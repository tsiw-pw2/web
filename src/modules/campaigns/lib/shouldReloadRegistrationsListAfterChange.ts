// A listagem de inscrições (GET /registrations) só está disponível para org/admin.
export function shouldReloadRegistrationsListAfterChange(canManageRegistrations: boolean): boolean {
    return canManageRegistrations
}
