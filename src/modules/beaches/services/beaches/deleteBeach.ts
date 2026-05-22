import { requestApiData } from "@/infrastructure/request"

export async function deleteBeach(id: string): Promise<void> {
    await requestApiData<null>(`/beaches/${id}`, { method: "DELETE" })
}
