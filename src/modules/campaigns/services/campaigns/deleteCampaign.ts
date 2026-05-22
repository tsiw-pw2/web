import { requestApiData } from "@/infrastructure/request"

export async function deleteCampaign(id: string): Promise<null> {
    return requestApiData<null>(`/campaigns/${id}`, { method: "DELETE" })
}
