export function initialsFromDisplayName(name: string): string {
    const n = name.trim()
    if (n.length === 0) return ""
    const parts = n.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
        const a = parts[0]?.[0]
        const b = parts[parts.length - 1]?.[0]
        if (a && b) return (a + b).toUpperCase()
    }
    return n.slice(0, 2).toUpperCase()
}
