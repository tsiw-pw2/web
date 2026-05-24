import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"
import { settingsUserRoleFromFlags } from "@/modules/settings/lib/settingsUserRole"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"
import { unwrapList, unwrapResource } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"
import { ref } from "vue"

const DEFAULT_PAGE_SIZE = 10

const users = ref<SettingsUserRow[]>([])
export const settingsUsersPage = ref(1)
export const settingsUsersPageSize = ref(DEFAULT_PAGE_SIZE)
export const settingsUsersTotal = ref(0)

let loadGeneration = 0
let lastListRoleForReload: string | undefined

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
    const q = new URLSearchParams({
        page: String(settingsUsersPage.value),
        pageSize: String(settingsUsersPageSize.value),
    })
    if (lastListRoleForReload === "volunteer") {
        q.set("role", "volunteer")
    }
    const body = await requestApiData<unknown>(`/users?${q}`, {
        method: "GET",
    })
    if (gen !== loadGeneration) return
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

export async function blockUser(userId: string, reason: string): Promise<void> {
    await requestApiData(`/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: true, blockedReason: reason }),
    })
    await reloadListAfterMutation()
}

export async function unblockUser(userId: string): Promise<void> {
    await requestApiData(`/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: false }),
    })
    await reloadListAfterMutation()
}

export async function updateUserRole(userId: string, role: SettingsUserRoleKey): Promise<SettingsUserRow> {
    const body = await requestApiData<unknown>(`/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
    })
    await reloadListAfterMutation()
    return unwrapResource<SettingsUserRow>(body)
}

export { users as settingsUsersRef }
