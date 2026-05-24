import { unwrapResource } from "@/infrastructure/hateoas"
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
    const body = await requestApiData<unknown>(`/campaigns/${campaignId}/registrations`, {
        method: "POST",
    })
    return unwrapResource<CampaignDetailsRegistration>(body)
}

export async function patchRegistration(
    campaignId: string,
    registrationId: string,
    body: PatchRegistrationBody,
): Promise<CampaignDetailsRegistration> {
    const resBody = await requestApiData<unknown>(
        `/campaigns/${campaignId}/registrations/${registrationId}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        },
    )
    return unwrapResource<CampaignDetailsRegistration>(resBody)
}

export async function deleteRegistration(campaignId: string, registrationId: string): Promise<void> {
    await requestApiData<null>(`/campaigns/${campaignId}/registrations/${registrationId}`, {
        method: "DELETE",
    })
}
