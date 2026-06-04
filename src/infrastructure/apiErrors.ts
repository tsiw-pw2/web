export const API_UNAVAILABLE_NETWORK_MESSAGE =
    "Não foi possível ligar ao serviço. Verifica a ligação à internet e tenta outra vez."

export const API_UNAVAILABLE_RESPONSE_MESSAGE =
    "O serviço está temporariamente indisponível. Tenta outra vez dentro de momentos."

export class ApiServiceUnavailableError extends Error {
    readonly friendlyMessage: string

    constructor(message: string = API_UNAVAILABLE_NETWORK_MESSAGE) {
        super(message)
        this.name = "ApiServiceUnavailableError"
        this.friendlyMessage = message
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

// Verifica se o erro é uma instância de ApiServiceUnavailableError.
export function isApiServiceUnavailableError(e: unknown): e is ApiServiceUnavailableError {
    return e instanceof ApiServiceUnavailableError
}

// Indica se o código HTTP corresponde a indisponibilidade upstream (502–504).
function isUpstreamUnavailableStatus(status: number): boolean {
    return status === 502 || status === 503 || status === 504
}

// Deteta respostas HTML em vez de JSON (proxy ou servidor em falha).
function isHtmlLikeResponse(contentType: string, rawText: string): boolean {
    const ct = contentType.toLowerCase()
    if (ct.includes("text/html")) return true
    const t = rawText.trimStart()
    return t.startsWith("<!DOCTYPE") || t.startsWith("<html")
}

// Escolhe a mensagem amigável consoante o tipo de resposta indisponível.
export function apiUnavailableMessageFromResponse(res: Response, rawText: string): string {
    const contentType = res.headers.get("content-type") ?? ""
    const isEmpty = rawText.trim().length === 0
    if (
        isHtmlLikeResponse(contentType, rawText) ||
        isUpstreamUnavailableStatus(res.status) ||
        (isEmpty && !res.ok)
    ) {
        if (import.meta.env.DEV && res.status === 404 && rawText.includes("Cannot POST")) {
            return `${API_UNAVAILABLE_RESPONSE_MESSAGE} Verifica se a API deste projeto está a correr e se a porta no proxy (web) coincide com PORT no api/.env.`
        }
        return API_UNAVAILABLE_RESPONSE_MESSAGE
    }
    return API_UNAVAILABLE_NETWORK_MESSAGE
}

// Determina se a resposta deve ser tratada como serviço indisponível.
export function shouldTreatResponseAsUnavailable(res: Response, rawText: string): boolean {
    const contentType = res.headers.get("content-type") ?? ""
    const isEmpty = rawText.trim().length === 0
    return (
        isHtmlLikeResponse(contentType, rawText) ||
        isUpstreamUnavailableStatus(res.status) ||
        (isEmpty && !res.ok)
    )
}

// Descreve uma falha genérica da API com mensagem de recurso opcional.
export function describeApiFailure(e: unknown, fallback = "Verifica a ligação e tenta outra vez."): string {
    if (isApiServiceUnavailableError(e)) {
        return e.friendlyMessage
    }
    return fallback
}

// Descreve falha ao carregar um recurso específico da API.
export function describeApiLoadFailure(e: unknown, resourcePhrase: string): string {
    if (isApiServiceUnavailableError(e)) {
        return e.friendlyMessage
    }
    return `Não foi possível carregar ${resourcePhrase}. Tenta outra vez.`
}
