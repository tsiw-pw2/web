// Extrair apenas dígitos de um telefone (para envio à API).
export function normalizePhoneDigits(raw: string): string {
    return raw.replace(/\D/g, "")
}

// Validar telefone opcional antes de guardar o perfil.
export function validateProfilePhone(value: string): string | null {
    const trimmed = value.trim()
    if (trimmed.length === 0) return null
    const digits = normalizePhoneDigits(trimmed)
    if (digits.length === 0) {
        return "O telefone deve conter apenas números."
    }
    if (digits.length < 9 || digits.length > 15) {
        return "Indica um número de telefone válido (9 a 15 dígitos)."
    }
    return null
}
