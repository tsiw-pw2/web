// Resolve avatar apresentação src.
export function resolveAvatarDisplaySrc(url: string | null | undefined, cacheBust?: number | string | null): string {
    const t = (url ?? "").trim()
    if (t.length === 0) return ""
    if (t.startsWith("blob:")) return t
    if (cacheBust == null || cacheBust === "") return t
    const sep = t.includes("?") ? "&" : "?"
    return `${t}${sep}v=${encodeURIComponent(String(cacheBust))}`
}

// Indica se valid avatar URL campo.
export function isValidAvatarUrlField(input: string): boolean {
    const t = input.trim()
    if (t === "") return true
    if (/^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\/.+/.test(t)) return true
    try {
        const u = new URL(t)
        return u.protocol === "http:" || u.protocol === "https:"
    } catch {
        return false
    }
}
