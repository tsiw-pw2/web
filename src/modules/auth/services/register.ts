import { setAccessToken } from "@/infrastructure/access-token"
import { clearApiRootCache, loadApiRoot, rootLink } from "@/infrastructure/apiDiscovery"
import { followHref } from "@/infrastructure/hypermediaClient"
import { extractApiErrorMessage } from "@/infrastructure/hypermedia.types"
import { API_UNAVAILABLE_NETWORK_MESSAGE, ApiServiceUnavailableError, } from "@/infrastructure/apiErrors"
import { isApiRequestError } from "@/infrastructure/request"
import { mapAuthApiMessage } from "@/modules/auth/lib/authApiMessages"
import { REGISTER_GENERIC_ERROR_MESSAGE } from "@/modules/auth/lib/registerFormConstants"

export class RegisterServiceUnavailableError extends ApiServiceUnavailableError {
    override readonly name = "RegisterServiceUnavailableError"
}

// Verifica se o erro é de indisponibilidade do serviço de registo.
export function isRegisterServiceUnavailableError(e: unknown): e is RegisterServiceUnavailableError {
    return e instanceof RegisterServiceUnavailableError
}

type SessionResponse = {
    id: string
    token: string
    user: Record<string, unknown>
    links?: Record<string, unknown>
}

// Formata a mensagem de erro amigável para falhas de registo.
function registerErrorMessage(body: unknown): string {
    if (!body || typeof body !== "object") {
        return "Não foi possível criar a conta. Verifica os dados e tenta novamente."
    }
    const record = body as Record<string, unknown>
    const errors = record.errors as Record<string, string[]> | undefined
    const credentials = errors?.credentials
    if (Array.isArray(credentials) && credentials.length > 0) {
        const msg = credentials[0]?.trim()
        return mapAuthApiMessage(msg, REGISTER_GENERIC_ERROR_MESSAGE)
    }
    const birthDateErrors = errors?.birthDate
    if (Array.isArray(birthDateErrors) && birthDateErrors.length > 0) {
        return mapAuthApiMessage(birthDateErrors[0]?.trim(), REGISTER_GENERIC_ERROR_MESSAGE)
    }
    const apiMsg = extractApiErrorMessage(body) ?? ""
    return mapAuthApiMessage(apiMsg, REGISTER_GENERIC_ERROR_MESSAGE)
}

// Regista um novo utilizador e inicia sessão automaticamente.
export async function registerWithCredentials(
    name: string,
    email: string,
    password: string,
    birthDate: string,
): Promise<void> {
    try {
        await loadApiRoot(true)
        const usersLink = await rootLink("users")
        await followHref(usersLink, { method: "POST", body: { name, email, password, birthDate } })
        const sessionsLink = await rootLink("sessions")
        const session = await followHref<SessionResponse>(sessionsLink, {
            method: "POST",
            body: { email, password },
        })
        if (!session.token) {
            throw new Error(
                "Conta criada, mas não foi possível iniciar sessão. Entra com o teu email e palavra-passe.",
            )
        }
        setAccessToken(session.token)
        clearApiRootCache()
        await loadApiRoot(true)
    } catch (e) {
        if (e instanceof RegisterServiceUnavailableError) {
            throw e
        }
        if (e instanceof ApiServiceUnavailableError) {
            throw new RegisterServiceUnavailableError(API_UNAVAILABLE_NETWORK_MESSAGE)
        }
        if (isApiRequestError(e)) {
            throw new Error(registerErrorMessage({ message: e.message }))
        }
        throw e
    }
}
