export function registrationRoleLabel(role: number): string {
    if (role === 0) return "Voluntário"
    if (role === 1) return "Organizador"
    return String(role)
}

export function registrationStatusLabel(status: number): string {
    if (status === 0) return "Pendente"
    if (status === 1) return "Confirmada"
    if (status === 2) return "Cancelada"
    return String(status)
}
