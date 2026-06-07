import { describe, expect, it } from "vitest"
import { fetchCampaignsPage } from "@/modules/campaigns/services/campaigns/fetchCampaignsPage"

describe("fetchCampaignsPage", () => {
    it("devolve lista vazia sem chamar a API quando o distrito é inválido", async () => {
        const result = await fetchCampaignsPage(1, 10, { district: "bragasss" })
        expect(result).toEqual({
            items: [],
            page: 1,
            pageSize: 10,
            total: 0,
        })
    })
})
