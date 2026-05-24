import { getApiBaseUrl } from "@/infrastructure/config"
import { setAccessToken } from "@/infrastructure/access-token"
import {
    API_UNAVAILABLE_NETWORK_MESSAGE,
    ApiServiceUnavailableError,
    apiUnavailableMessageFromResponse,
    shouldTreatResponseAsUnavailable,
} from "@/infrastructure/apiErrors"

type RegisterSuccessBody = {
    session?: { token?: string }
    token?: string
    message?: string
    errors?: Record<string, string[]>
}

export class RegisterServiceUnavailableError extends ApiServiceUnavailableError {
    override readonly name = "RegisterServiceUnavailableError"
}

export function isRegisterServiceUnavailableError(e: unknown): e is RegisterServiceUnavailableError {
    return e instanceof RegisterServiceUnavailableError
}

function throwUnexpectedRegisterResponse(res: Response, rawText: string): never {
    if (shouldTreatResponseAsUnavailable(res, rawText)) {
        throw new RegisterServiceUnavailableError(apiUnavailableMessageFromResponse(res, rawText))
    }
    throw new RegisterServiceUnavailableError(API_UNAVAILABLE_NETWORK_MESSAGE)
}

function registerErrorMessage(parsed: RegisterSuccessBody): string {
    const credentials = parsed.errors?.credentials
    if (Array.isArray(credentials) && credentials.length > 0) {
        const msg = credentials[0]?.trim()
        if (msg === "Unable to create account" || msg === "Invalid name, email or password") {
            return "Não foi possível criar a conta. Verifica os dados e tenta novamente."
        }
        if (msg && msg.length > 0) {
            return msg
        }
    }
    const apiMsg = typeof parsed.message === "string" ? parsed.message.trim() : ""
    if (apiMsg.length > 0 && apiMsg !== "Validation error") {
        return apiMsg
    }
    return "Não foi possível criar a conta. Verifica os dados e tenta novamente."
}

function extractAccessToken(parsed: RegisterSuccessBody): string | null {
    const sessionToken = parsed.session?.token
    if (typeof sessionToken === "string" && sessionToken.length > 0) {
        return sessionToken
    }
    if (typeof parsed.token === "string" && parsed.token.length > 0) {
        return parsed.token
    }
    return null
}

export async function registerWithCredentials(
    name: string,
    email: string,
    password: string,
): Promise<void> {
    const url = `${getApiBaseUrl()}/users`
    let res: Response
    try {
        res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        })
    } catch {
        throw new RegisterServiceUnavailableError(API_UNAVAILABLE_NETWORK_MESSAGE)
    }

    const rawText = await res.text()

    let parsed: RegisterSuccessBody
    try {
        if (rawText.trim().length === 0 && !res.ok) {
            throw new SyntaxError("empty")
        }
        parsed = JSON.parse(rawText) as RegisterSuccessBody
        if (parsed === null || typeof parsed !== "object") {
            throw new SyntaxError("not-object")
        }
    } catch {
        throwUnexpectedRegisterResponse(res, rawText)
    }

    const token = extractAccessToken(parsed)
    if (!res.ok || token == null) {
        throw new Error(registerErrorMessage(parsed))
    }

    setAccessToken(token)
}
