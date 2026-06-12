import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"
import { getActiveOrganizationId } from "@/infrastructure/active-organization"
import { apiPatch } from "@/infrastructure/apiClient"
import { followLink, getLink } from "@/infrastructure/hypermediaClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import {
    fetchOrganizationMembers,
    type OrganizationMember,
} from "@/modules/settings/services/organizations"
import { ref } from "vue"

const users = ref<SettingsUserRow[]>([])
export const settingsUsersPage = ref(1)
export const settingsUsersPageSize = ref(10)
export const settingsUsersTotal = ref(0)

let loadGeneration = 0

function memberToRow(member: OrganizationMember): SettingsUserRow {
    const user = member.user
    const role: SettingsUserRoleKey = member.isOrgAdmin ? "orgAdmin" : "organizer"
    return {
        id: user?.id ?? member.userId,
        membershipId: member.id,
        organizationId: member.organizationId,
        name: user?.name ?? "—",
        email: user?.email ?? "—",
        phone: null,
        birthDate: null,
        avatarUrl: null,
        role,
        isAdmin: false,
        isOrgAdmin: member.isOrgAdmin,
        isOrganizer: Boolean(user?.isOrganizer),
        isBlocked: Boolean(user?.isBlocked),
        blockedReason: null,
        blockedAt: null,
        createdAt: member.createdAt,
        links: (member as OrganizationMember & { links?: ResourceLinks }).links,
    }
}

export function resetSettingsUsersListState(): void {
    users.value = []
    settingsUsersPage.value = 1
    settingsUsersPageSize.value = 10
    settingsUsersTotal.value = 0
}

export async function loadSettingsUsers(): Promise<void> {
    const orgId = getActiveOrganizationId()
    if (!orgId) {
        resetSettingsUsersListState()
        return
    }

    const gen = ++loadGeneration
    const members = await fetchOrganizationMembers(orgId)
    if (gen !== loadGeneration) return

    const rows = members.map(memberToRow)
    users.value = rows
    settingsUsersTotal.value = rows.length
    settingsUsersPage.value = 1
    settingsUsersPageSize.value = Math.max(rows.length, 10)
}

async function reloadListAfterMutation(): Promise<void> {
    await loadSettingsUsers()
}

function findUserRow(userId: string): (SettingsUserRow & { links?: ResourceLinks }) | undefined {
    return users.value.find((u) => u.id === userId) as (SettingsUserRow & { links?: ResourceLinks }) | undefined
}

export async function blockUser(userId: string, reason: string): Promise<void> {
    const row = findUserRow(userId)
    const body = { isBlocked: true, blockedReason: reason }
    if (row?.links && getLink(row, "update")) {
        await followLink(row, "update", { method: "PATCH", body })
    } else if (row?.organizationId) {
        await apiPatch(`/organizations/${row.organizationId}/members/${userId}`, body)
    }
    await reloadListAfterMutation()
}

export async function unblockUser(userId: string): Promise<void> {
    const row = findUserRow(userId)
    const body = { isBlocked: false }
    if (row?.links && getLink(row, "update")) {
        await followLink(row, "update", { method: "PATCH", body })
    } else if (row?.organizationId) {
        await apiPatch(`/organizations/${row.organizationId}/members/${userId}`, body)
    }
    await reloadListAfterMutation()
}

export async function updateUserOrgAdmin(userId: string, isOrgAdmin: boolean): Promise<void> {
    const row = findUserRow(userId)
    const body = { isOrgAdmin }
    if (row?.links && getLink(row, "update")) {
        await followLink(row, "update", { method: "PATCH", body })
    } else if (row?.organizationId) {
        await apiPatch(`/organizations/${row.organizationId}/members/${userId}`, body)
    }
    await reloadListAfterMutation()
}

export { users as settingsUsersRef }
