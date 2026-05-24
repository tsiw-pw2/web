import { unwrapList, unwrapResource } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"
import { settingsUserRoleFromFlags } from "@/modules/settings/lib/settingsUserRole"
import type {
    SettingsUserDetail,
    SettingsUserOrganizedCampaignRow,
    SettingsUserRegistrationRow,
} from "@/modules/settings/types/settingsUserDetails"
import type { PaginatedResult } from "@/types/pagination"

function normalizeUserDetail(raw: SettingsUserDetail): SettingsUserDetail {
    return {
        ...raw,
        role: raw.role ?? settingsUserRoleFromFlags(raw),
    }
}

export async function fetchSettingsUserDetail(userId: string): Promise<SettingsUserDetail> {
    const body = await requestApiData<unknown>(`/users/${userId}`, { method: "GET" })
    return normalizeUserDetail(unwrapResource<SettingsUserDetail>(body))
}

export async function fetchSettingsUserRegistrations(
    userId: string,
    page: number,
    pageSize: number,
): Promise<PaginatedResult<SettingsUserRegistrationRow>> {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    const body = await requestApiData<unknown>(`/users/${userId}/registrations?${q}`, { method: "GET" })
    return unwrapList<SettingsUserRegistrationRow>(body)
}

export async function fetchSettingsUserOrganizedCampaigns(
    userId: string,
    page: number,
    pageSize: number,
): Promise<PaginatedResult<SettingsUserOrganizedCampaignRow>> {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    const body = await requestApiData<unknown>(`/users/${userId}/campaigns?${q}`, { method: "GET" })
    return unwrapList<SettingsUserOrganizedCampaignRow>(body)
}
