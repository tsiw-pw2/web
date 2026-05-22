import { routePaths } from "@/app/router/routePaths"

export function safeInternalRedirectPath(raw: unknown): string | null {
    if (typeof raw !== "string") return null
    const t = raw.trim()
    if (t === "") return null
    if (!t.startsWith("/")) return null
    if (t.startsWith("//")) return null
    const pathOnly = t.split("?")[0] ?? t
    if (pathOnly === routePaths.login) return null
    return t
}
