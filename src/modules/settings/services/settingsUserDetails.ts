import { getActiveOrganizationId } from "@/infrastructure/active-organization"
import { fetchOrganizationMembers } from "@/modules/settings/services/organizations"
import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"
import type { SettingsUserDetail } from "@/modules/settings/types/settingsUserDetails"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

type UserDetailResource = SettingsUserDetail & { links?: ResourceLinks }

export async function fetchSettingsUserDetail(userId: string): Promise<UserDetailResource> {
    const orgId = getActiveOrganizationId()
    if (!orgId) {
        throw new Error("Organization context required")
    }
    const members = await fetchOrganizationMembers(orgId)
    const member = members.find((m) => m.userId === userId || m.user?.id === userId)
    if (!member?.user) {
        throw new Error("Member not found")
    }
    const role: SettingsUserRoleKey = member.isOrgAdmin ? "orgAdmin" : "organizer"
    return {
        id: member.user.id,
        membershipId: member.id,
        organizationId: member.organizationId,
        name: member.user.name,
        email: member.user.email,
        phone: null,
        birthDate: null,
        avatarUrl: null,
        role,
        isAdmin: false,
        isOrgAdmin: member.isOrgAdmin,
        isOrganizer: member.user.isOrganizer,
        isBlocked: member.user.isBlocked,
        blockedReason: null,
        blockedAt: null,
        createdAt: member.createdAt,
        metrics: {
            registrationsCount: 0,
            organizedCampaignsCount: 0,
            wasteCollectionsCount: 0,
            beachesCreatedCount: 0,
        },
        links: (member as typeof member & { links?: ResourceLinks }).links,
    }
}
