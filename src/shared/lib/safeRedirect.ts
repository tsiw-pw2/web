import { routePaths } from "@/app/router/routePaths"

// Valida um caminho de redireccionamento interno seguro (evita URLs externas e o login).
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
