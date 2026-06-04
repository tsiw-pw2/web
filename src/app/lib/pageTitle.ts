import { appConfig } from "@/app/config/app"

// Formata página título.
export function formatPageTitle(segment: string | null | undefined): string {
    const app = appConfig.name
    const part = typeof segment === "string" ? segment.trim() : ""
    if (part.length === 0) return app
    return `${part} · ${app}`
}

// Define documento título.
export function setDocumentTitle(segment: string | null | undefined): void {
    document.title = formatPageTitle(segment)
}
