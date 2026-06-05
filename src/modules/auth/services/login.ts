import { invalidateCurrentProfile } from "@/composables/useCurrentProfile"
import { setAccessToken } from "@/infrastructure/access-token"
import { clearApiRootCache, loadApiRoot, rootLink } from "@/infrastructure/apiDiscovery"
import { followHref } from "@/infrastructure/hypermediaClient"
import { extractApiErrorMessage } from "@/infrastructure/hypermedia.types"
import { isApiRequestError } from "@/infrastructure/request"
import { API_UNAVAILABLE_NETWORK_MESSAGE, ApiServiceUnavailableError, } from "@/infrastructure/apiErrors"

export class LoginServiceUnavailableError extends ApiServiceUnavailableError {
    override readonly name = "LoginServiceUnavailableError"
}

// Verifica se o erro é de indisponibilidade do serviço de login.
export function isLoginServiceUnavailableError(e: unknown): e is LoginServiceUnavailableError {
    return e instanceof LoginServiceUnavailableError
}

export class LoginAccountBlockedError extends Error {
    override readonly name = "LoginAccountBlockedError"

    // Constrói o erro de conta bloqueada com a mensagem indicada.
    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

// Verifica se o erro indica conta bloqueada no login.
export function isLoginAccountBlockedError(e: unknown): e is LoginAccountBlockedError {
    return e instanceof LoginAccountBlockedError
}

type SessionResponse = {
    id: string
    token: string
    user: Record<string, unknown>
    links?: Record<string, unknown>
}

// Formata a mensagem de conta bloqueada a partir da resposta da API.
function blockedAccountMessage(apiMessage: string): string {
    const trimmed = apiMessage.trim()
    if (trimmed.length > 0 && trimmed !== "Account blocked") {
        return trimmed
    }
    return "A tua conta foi bloqueada. Contacta a equipa Mariva se precisares de ajuda."
}

// Formata a mensagem de erro amigável para falhas de autenticação.
function loginFriendlyMessage(status: number, body: unknown): string {
    const apiMsg = extractApiErrorMessage(body) ?? ""
    if (status === 403) {
        return blockedAccountMessage(apiMsg)
    }
    if (
        apiMsg === "Invalid credentials" ||
        apiMsg === "Unauthorized" ||
        apiMsg.length === 0
    ) {
        return "Credenciais inválidas."
    }
    return apiMsg
}

// Inicia sessão com email e palavra-passe e guarda o token.
export async function loginWithCredentials(email: string, password: string): Promise<void> {
    try {
        await loadApiRoot(true)
        const sessionsLink = await rootLink("sessions")
        const session = await followHref<SessionResponse>(sessionsLink, {
            method: "POST",
            body: { email, password },
        })
        if (!session.token) {
            throw new Error("Credenciais inválidas.")
        }
        setAccessToken(session.token)
        invalidateCurrentProfile()
        clearApiRootCache()
        await loadApiRoot(true)
    } catch (e) {
        if (e instanceof LoginServiceUnavailableError || e instanceof LoginAccountBlockedError) {
            throw e
        }
        if (isApiRequestError(e)) {
            if (e.httpStatus === 403) {
                throw new LoginAccountBlockedError(blockedAccountMessage(e.message))
            }
            throw new Error(loginFriendlyMessage(e.httpStatus, { error_description: e.message }))
        }
        if (e instanceof ApiServiceUnavailableError) {
            throw new LoginServiceUnavailableError(API_UNAVAILABLE_NETWORK_MESSAGE)
        }
        throw e
    }
}
