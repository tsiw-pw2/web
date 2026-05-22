export function getApiBaseUrl(): string {
    const raw = import.meta.env.VITE_API_URL
    if (typeof raw === "string") {
        const trimmed = raw.trim()
        if (trimmed.length > 0) {
            return trimmed.replace(/\/$/, "")
        }
    }
    return "/api/v1"
}
