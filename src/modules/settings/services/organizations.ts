import { apiDelete, apiGet, apiPatch, apiPost } from "@/infrastructure/apiClient"

export type OrganizationListItem = {
    id: string
    name: string
    municipality: string
    contactEmail: string | null
    memberCount: number
    createdAt: string | null
    updatedAt: string | null
}

export type OrganizationMember = {
    id: string
    userId: string
    organizationId: string
    isOrgAdmin: boolean
    createdAt: string | null
    user: {
        id: string
        name: string
        email: string
        isOrganizer: boolean
        isBlocked: boolean
    } | null
}

export type OrganizationUpsertDraft = {
    name: string
    municipality: string
    contactEmail?: string
}

export type OrganizationMemberCreateDraft = {
    name: string
    email: string
    password: string
    birthDate: string
    phone?: string
}

type OrganizationsListResponse = { items: OrganizationListItem[] }
type OrganizationMembersResponse = { items: OrganizationMember[] }

export async function fetchOrganizations(): Promise<OrganizationListItem[]> {
    const body = await apiGet<OrganizationsListResponse>("/organizations")
    return body.items ?? []
}

export async function createOrganization(draft: OrganizationUpsertDraft): Promise<OrganizationListItem> {
    return apiPost<OrganizationListItem>("/organizations", {
        name: draft.name.trim(),
        municipality: draft.municipality.trim(),
        contactEmail: draft.contactEmail?.trim() || "",
    })
}

export async function updateOrganization(id: string, draft: OrganizationUpsertDraft): Promise<OrganizationListItem> {
    return apiPatch<OrganizationListItem>(`/organizations/${id}`, {
        name: draft.name.trim(),
        municipality: draft.municipality.trim(),
        contactEmail: draft.contactEmail?.trim() || "",
    })
}

export async function fetchOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
    const body = await apiGet<OrganizationMembersResponse>(`/organizations/${organizationId}/members`)
    return body.items ?? []
}

export async function createOrganizationMember(
    organizationId: string,
    draft: OrganizationMemberCreateDraft,
): Promise<OrganizationMember> {
    return apiPost<OrganizationMember>(`/organizations/${organizationId}/members`, {
        name: draft.name.trim(),
        email: draft.email.trim(),
        password: draft.password,
        birthDate: draft.birthDate,
        phone: draft.phone?.trim() || undefined,
    })
}

export async function updateOrganizationMember(
    organizationId: string,
    userId: string,
    body: { isOrgAdmin?: boolean; isBlocked?: boolean; blockedReason?: string },
): Promise<OrganizationMember> {
    return apiPatch<OrganizationMember>(`/organizations/${organizationId}/members/${userId}`, body)
}

export async function deleteOrganizationMember(organizationId: string, userId: string): Promise<void> {
    await apiDelete(`/organizations/${organizationId}/members/${userId}`)
}
