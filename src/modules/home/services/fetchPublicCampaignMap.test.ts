import { describe, expect, it, vi, beforeEach } from "vitest"
import { fetchPublicCampaignMap } from "@/modules/home/services/fetchPublicCampaignMap"

vi.mock("@/infrastructure/apiClient", () => ({
    apiGet: vi.fn(),
}))

import { apiGet } from "@/infrastructure/apiClient"

describe("fetchPublicCampaignMap", () => {
    beforeEach(() => {
        vi.mocked(apiGet).mockReset()
    })

    it("mapeia items do endpoint público", async () => {
        vi.mocked(apiGet).mockResolvedValue({
            items: [
                {
                    beachId: "b1",
                    beachName: "Praia de Espinho",
                    latitude: "41.0",
                    longitude: "-8.6",
                    municipality: "Espinho",
                    district: "Aveiro",
                    campaignId: "c1",
                    title: "Campanha teste",
                    startDate: "2026-07-01",
                    endDate: "2026-07-01",
                    status: "aberta_inscricoes",
                },
            ],
        })

        const items = await fetchPublicCampaignMap()
        expect(items).toHaveLength(1)
        expect(items[0]?.campaignId).toBe("c1")
    })

    it("devolve lista vazia quando items não é array", async () => {
        vi.mocked(apiGet).mockResolvedValue({ items: null })
        const items = await fetchPublicCampaignMap()
        expect(items).toEqual([])
    })
})
