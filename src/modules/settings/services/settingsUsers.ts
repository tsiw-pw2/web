import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"
import { settingsUserRoleFromFlags } from "@/modules/settings/lib/settingsUserRole"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"
import { href } from "@/infrastructure/apiDiscovery"
import { apiGet, apiPatch, paginationQuery, unwrapList } from "@/infrastructure/apiClient"
import { followHref, followLink, getLink } from "@/infrastructure/hypermediaClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import { ref } from "vue"

const DEFAULT_PAGE_SIZE = 10

const users = ref<SettingsUserRow[]>([])
export const settingsUsersPage = ref(1)
export const settingsUsersPageSize = ref(DEFAULT_PAGE_SIZE)
export const settingsUsersTotal = ref(0)

let loadGeneration = 0
let lastListRoleForReload: string | undefined
let listLinks: ResourceLinks | undefined

export function getSettingsUsersListRoleFilter(): string | undefined {
    return lastListRoleForReload
}

export async function loadSettingsUsers(opts?: { page?: number; pageSize?: number; role?: string }): Promise<void> {
    if (opts != null && Object.prototype.hasOwnProperty.call(opts, "role")) {
        lastListRoleForReload = opts.role === "volunteer" ? "volunteer" : undefined
    }
    const gen = ++loadGeneration
    if (opts?.page != null) settingsUsersPage.value = opts.page
    if (opts?.pageSize != null) settingsUsersPageSize.value = opts.pageSize
    const q = paginationQuery(settingsUsersPage.value, settingsUsersPageSize.value)
    if (lastListRoleForReload === "volunteer") {
        q.set("role", "volunteer")
    }

    type ListBody = {
        data: SettingsUserRow[]
        page?: number
        pageSize?: number
        total?: number
        links?: ResourceLinks
    }

    let body: ListBody
    if (settingsUsersPage.value > 1 && listLinks?.next?.href) {
        body = await followHref<ListBody>(listLinks.next, { query: q })
    } else {
        const path = await href("usersCollection")
        body = await apiGet<ListBody>(path, q)
    }

    if (gen !== loadGeneration) return
    listLinks = body.links
    const data = unwrapList<SettingsUserRow>(body)
    users.value = data.items.map((row) => ({
        ...row,
        role: row.role ?? settingsUserRoleFromFlags(row),
    }))
    settingsUsersTotal.value = data.total
    settingsUsersPage.value = data.page
    settingsUsersPageSize.value = data.pageSize
}

async function reloadListAfterMutation(): Promise<void> {
    await loadSettingsUsers()
    if (users.value.length === 0 && settingsUsersPage.value > 1) {
        await loadSettingsUsers({ page: settingsUsersPage.value - 1 })
    }
}

function findUserRow(userId: string): (SettingsUserRow & { links?: ResourceLinks }) | undefined {
    return users.value.find((u) => u.id === userId) as (SettingsUserRow & { links?: ResourceLinks }) | undefined
}

export async function blockUser(userId: string, reason: string): Promise<void> {
    const row = findUserRow(userId)
    const body = { isBlocked: true, blockedReason: reason }
    if (row && getLink(row, "update")) {
        await followLink(row, "update", { method: "PATCH", body })
    } else {
        const base = await href("usersCollection")
        await apiPatch(`${base}/${userId}`, body)
    }
    await reloadListAfterMutation()
}

export async function unblockUser(userId: string): Promise<void> {
    const row = findUserRow(userId)
    const body = { isBlocked: false }
    if (row && getLink(row, "update")) {
        await followLink(row, "update", { method: "PATCH", body })
    } else {
        const base = await href("usersCollection")
        await apiPatch(`${base}/${userId}`, body)
    }
    await reloadListAfterMutation()
}

export async function updateUserRole(userId: string, role: SettingsUserRoleKey): Promise<SettingsUserRow> {
    const row = findUserRow(userId)
    if (row && getLink(row, "update")) {
        const updated = await followLink<SettingsUserRow>(row, "update", { method: "PATCH", body: { role } })
        await reloadListAfterMutation()
        return updated
    }
    const base = await href("usersCollection")
    const updated = await apiPatch<SettingsUserRow>(`${base}/${userId}`, { role })
    await reloadListAfterMutation()
    return updated
}

export { users as settingsUsersRef }
