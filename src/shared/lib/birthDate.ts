export const MIN_CAMPAIGN_PARTICIPANT_AGE = 16

export function ageInFullYears(birthDateIso: string, referenceDate = new Date()): number | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDateIso)) return null
    const y = Number(birthDateIso.slice(0, 4))
    const m = Number(birthDateIso.slice(5, 7))
    const d = Number(birthDateIso.slice(8, 10))
    const refY = referenceDate.getFullYear()
    const refM = referenceDate.getMonth() + 1
    const refD = referenceDate.getDate()
    let age = refY - y
    if (refM < m || (refM === m && refD < d)) {
        age -= 1
    }
    return age
}

export function userMeetsMinimumAge(
    birthDateIso: string,
    minAge = MIN_CAMPAIGN_PARTICIPANT_AGE,
    referenceDate = new Date(),
): boolean {
    const age = ageInFullYears(birthDateIso, referenceDate)
    return age != null && age >= minAge
}

export function validateProfileBirthDate(value: string): string | null {
    const trimmed = value.trim()
    if (!trimmed) {
        return "Indica a tua data de nascimento."
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return "Data de nascimento inválida."
    }
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    if (trimmed > todayStr) {
        return "Data de nascimento inválida."
    }
    if (!userMeetsMinimumAge(trimmed)) {
        return "Precisas de ter pelo menos 16 anos para participar em campanhas."
    }
    return null
}

export function campaignEnrollmentProfileBlockMessage(profileBirthDate: string | null | undefined): string | null {
    const trimmed = profileBirthDate?.trim() ?? ""
    if (!trimmed) {
        return "Indica a tua data de nascimento no perfil para te inscreveres numa campanha."
    }
    if (!userMeetsMinimumAge(trimmed)) {
        return "Precisas de ter pelo menos 16 anos para te inscreveres numa campanha."
    }
    return null
}
