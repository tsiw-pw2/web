import { getApiBaseUrl } from "@/infrastructure/config"
import { setAccessToken } from "@/infrastructure/access-token"

type LoginSuccessBody = {
    success?: boolean
    data?: { accessToken?: string }
    message?: string
}

export class LoginServiceUnavailableError extends Error {
    override readonly name = "LoginServiceUnavailableError"

    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

export class LoginAccountBlockedError extends Error {
    override readonly name = "LoginAccountBlockedError"

    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

export function isLoginServiceUnavailableError(e: unknown): e is LoginServiceUnavailableError {
    return e instanceof LoginServiceUnavailableError
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
    const contentType = (res.headers.get("content-type") ?? "").toLowerCase()
    const isEmpty = rawText.trim().length === 0
    const isUpstreamError = res.status === 502 || res.status === 503 || res.status === 504
    if (contentType.includes("text/html") || isUpstreamError || (isEmpty && !res.ok)) {
        throw new LoginServiceUnavailableError(
            "O serviço está temporariamente indisponível ou não respondeu como esperado. Tenta outra vez dentro de momentos.",
        )
    }
    const base = getApiBaseUrl()
    if (base.startsWith("http")) {
        throw new LoginServiceUnavailableError("Não foi possível completar o pedido. Verifica a ligação e tenta outra vez.")
    }
    throw new LoginServiceUnavailableError("Não foi possível completar o pedido. Tenta outra vez.")
}

export async function loginWithCredentials(email: string, password: string): Promise<void> {
    const url = `${getApiBaseUrl()}/auth/login`
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
        throw new LoginServiceUnavailableError(
            "Não foi possível ligar ao serviço. Verifica a ligação à internet e tenta outra vez.",
        )
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

    if (!res.ok || !parsed.success || !parsed.data?.accessToken) {
        const apiMsg = parsed.message ?? ""
        if (res.status === 403) {
            throw new LoginAccountBlockedError(blockedAccountMessage(apiMsg))
        }
        const friendly = apiMsg === "Invalid credentials" || apiMsg === "Unauthorized" ? "Credenciais inválidas." : apiMsg.length > 0 ? apiMsg : "Credenciais inválidas."
        throw new Error(friendly)
    }
    setAccessToken(parsed.data.accessToken)
}
