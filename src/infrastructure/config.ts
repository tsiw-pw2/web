// Resolve o URL base da API a partir das variáveis de ambiente Vite.
export function getApiBaseUrl(): string {
    const fromUrl = import.meta.env.VITE_API_URL
    const fromLegacy = import.meta.env.VITE_API_BASE_URL
    const raw =
        typeof fromUrl === "string" && fromUrl.trim().length > 0
            ? fromUrl
            : typeof fromLegacy === "string"
              ? fromLegacy
              : ""
    if (raw.trim().length > 0) {
        return raw.trim().replace(/\/$/, "")
    }
    return ""
}
