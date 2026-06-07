// Calcula a idade a partir da data de nascimento ISO.
export function ageFromBirthDate(birthDateIso: string | null | undefined, referenceDate = new Date()): number | null {
    if (typeof birthDateIso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(birthDateIso)) {
        return null
    }
    const y = Number(birthDateIso.slice(0, 4))
    const m = Number(birthDateIso.slice(5, 7))
    const d = Number(birthDateIso.slice(8, 10))
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null

    const refY = referenceDate.getFullYear()
    const refM = referenceDate.getMonth() + 1
    const refD = referenceDate.getDate()

    let age = refY - y
    if (refM < m || (refM === m && refD < d)) {
        age -= 1
    }
    return age >= 0 ? age : null
}

// Divide o nome completo em primeiro nome e apelido.
export function splitDisplayName(fullName: string): { firstName: string; lastName: string } {
    const trimmed = fullName.trim()
    if (!trimmed) return { firstName: "-", lastName: "-" }
    const spaceIndex = trimmed.indexOf(" ")
    if (spaceIndex === -1) return { firstName: trimmed, lastName: "-" }
    return {
        firstName: trimmed.slice(0, spaceIndex),
        lastName: trimmed.slice(spaceIndex + 1).trim() || "-",
    }
}
