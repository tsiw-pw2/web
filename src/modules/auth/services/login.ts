import { getApiBaseUrl } from "@/infrastructure/config"
import { setAccessToken } from "@/infrastructure/access-token"

type LoginSuccessBody = {
    token?: string
    user?: unknown
    message?: string
}

import {
    API_UNAVAILABLE_NETWORK_MESSAGE,
    ApiServiceUnavailableError,
    apiUnavailableMessageFromResponse,
    shouldTreatResponseAsUnavailable,
} from "@/infrastructure/apiErrors"

export class LoginServiceUnavailableError extends ApiServiceUnavailableError {
    override readonly name = "LoginServiceUnavailableError"
}

export function isLoginServiceUnavailableError(e: unknown): e is LoginServiceUnavailableError {
    return e instanceof LoginServiceUnavailableError
}

export class LoginAccountBlockedError extends Error {
    override readonly name = "LoginAccountBlockedError"

    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

export function isLoginAccountBlockedError(e: unknown): e is LoginAccountBlockedError {
    return e instanceof LoginAccountBlockedError
}

function blockedAccountMessage(apiMessage: string): string {
    const trimmed = apiMessage.trim()
    if (trimmed.length > 0 && trimmed !== "Account blocked") {
        return trimmed
    }
    return "A tua conta foi bloqueada. Contacta a equipa Mariva se precisares de ajuda."
}

function throwUnexpectedLoginResponse(res: Response, rawText: string): never {
    if (shouldTreatResponseAsUnavailable(res, rawText)) {
        throw new LoginServiceUnavailableError(apiUnavailableMessageFromResponse(res, rawText))
    }
    throw new LoginServiceUnavailableError(API_UNAVAILABLE_NETWORK_MESSAGE)
}

export async function loginWithCredentials(email: string, password: string): Promise<void> {
    const url = `${getApiBaseUrl()}/sessions`
    let res: Response
    try {
        res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
    } catch {
        throw new LoginServiceUnavailableError(API_UNAVAILABLE_NETWORK_MESSAGE)
    }

    const rawText = await res.text()

    let parsed: LoginSuccessBody
    try {
        if (rawText.trim().length === 0 && !res.ok) {
            throw new SyntaxError("empty")
        }
        parsed = JSON.parse(rawText) as LoginSuccessBody
        if (parsed === null || typeof parsed !== "object") {
            throw new SyntaxError("not-object")
        }
    } catch {
        throwUnexpectedLoginResponse(res, rawText)
    }

    if (!res.ok || typeof parsed.token !== "string" || parsed.token.length === 0) {
        const apiMsg = parsed.message ?? ""
        if (res.status === 403) {
            throw new LoginAccountBlockedError(blockedAccountMessage(apiMsg))
        }
        const friendly = apiMsg === "Invalid credentials" || apiMsg === "Unauthorized" ? "Credenciais inválidas." : apiMsg.length > 0 ? apiMsg : "Credenciais inválidas."
        throw new Error(friendly)
    }
    setAccessToken(parsed.token)
}
