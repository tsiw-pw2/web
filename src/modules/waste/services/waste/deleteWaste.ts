import { requestApiData } from "@/infrastructure/request"

export async function deleteWaste(id: string): Promise<null> {
    return requestApiData<null>(`/waste-items/${id}`, { method: "DELETE" })
}
