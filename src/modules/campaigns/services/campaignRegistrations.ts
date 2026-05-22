import { requestApiData } from "@/infrastructure/request"
import type { CampaignDetailsRegistration } from "@/modules/campaigns/types/details"

export type PatchRegistrationBody = {
    role?: number
    status?: number
    attendance?: boolean | null
}

export async function createCampaignRegistration(
    campaignId: string,
): Promise<CampaignDetailsRegistration> {
    return requestApiData<CampaignDetailsRegistration>(`/campaigns/${campaignId}/registrations`, {
        method: "POST",
    })
}

export async function patchRegistration(
    registrationId: string,
    body: PatchRegistrationBody,
): Promise<CampaignDetailsRegistration> {
    return requestApiData<CampaignDetailsRegistration>(`/registrations/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
}

export async function deleteRegistration(registrationId: string): Promise<void> {
    await requestApiData<{ ok?: boolean }>(`/registrations/${registrationId}`, {
        method: "DELETE",
    })
}
