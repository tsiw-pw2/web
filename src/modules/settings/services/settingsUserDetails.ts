import { href } from "@/infrastructure/apiDiscovery"
import { apiGet, paginationQuery, unwrapList } from "@/infrastructure/apiClient"
import { followHref, getLink } from "@/infrastructure/hypermediaClient"
import { settingsUserRoleFromFlags } from "@/modules/settings/lib/settingsUserRole"
import type { SettingsUserDetail, SettingsUserOrganizedCampaignRow, SettingsUserRegistrationRow, } from "@/modules/settings/types/settingsUserDetails"
import type { PaginatedResult } from "@/types/pagination"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

type UserDetailResource = SettingsUserDetail & { links?: ResourceLinks }

// Normaliza o papel do utilizador nos detalhes devolvidos pela API.
function normalizeUserDetail(raw: SettingsUserDetail): SettingsUserDetail {
    return {
        ...raw,
        role: raw.role ?? settingsUserRoleFromFlags(raw),
    }
}

// Obtém os detalhes de um utilizador nas definições.
export async function fetchSettingsUserDetail(userId: string): Promise<UserDetailResource> {
    const base = await href("usersCollection")
    const body = await apiGet<UserDetailResource>(`${base}/${userId}`)
    return normalizeUserDetail(body) as UserDetailResource
}

// Lista as inscrições de um utilizador de forma paginada.
export async function fetchSettingsUserRegistrations(
    user: UserDetailResource | string,
    page: number,
    pageSize: number,
): Promise<PaginatedResult<SettingsUserRegistrationRow>> {
    const resource = typeof user === "string" ? await fetchSettingsUserDetail(user) : user
    const link = getLink(resource, "registrations")
    const q = paginationQuery(page, pageSize)
    if (link?.href) {
        const body = await followHref<{
            data: SettingsUserRegistrationRow[]
            page?: number
            pageSize?: number
            total?: number
        }>(link, { query: q })
        return unwrapList(body)
    }
    const base = await href("usersCollection")
    const body = await apiGet<{
        data: SettingsUserRegistrationRow[]
        page?: number
        pageSize?: number
        total?: number
    }>(`${base}/${resource.id}/registrations`, q)
    return unwrapList(body)
}

// Lista as campanhas organizadas por um utilizador de forma paginada.
export async function fetchSettingsUserOrganizedCampaigns(
    user: UserDetailResource | string,
    page: number,
    pageSize: number,
): Promise<PaginatedResult<SettingsUserOrganizedCampaignRow>> {
    const resource = typeof user === "string" ? await fetchSettingsUserDetail(user) : user
    const link = getLink(resource, "organizedCampaigns")
    const q = paginationQuery(page, pageSize)
    if (link?.href) {
        const body = await followHref<{
            data: SettingsUserOrganizedCampaignRow[]
            page?: number
            pageSize?: number
            total?: number
        }>(link, { query: q })
        return unwrapList(body)
    }
    const base = await href("usersCollection")
    const body = await apiGet<{
        data: SettingsUserOrganizedCampaignRow[]
        page?: number
        pageSize?: number
        total?: number
    }>(`${base}/${resource.id}/organized-campaigns`, q)
    return unwrapList(body)
}
