import { followHref, followLink, getLink } from "@/infrastructure/hypermediaClient"
import type { CampaignLinkParent } from "@/modules/campaigns/services/campaignHypermedia"
import type { CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

export type CreateCampaignWasteCollectionBody = {
    beachId: string
    wasteId: string
    unitQuantity: number
    actualWeightKg?: number | null
}

type WasteCollectionResource = CampaignDetailsWasteCollection & { links?: ResourceLinks }

// Regista uma nova recolha de resíduos numa campanha.
export async function postCampaignWasteCollection(
    campaign: CampaignLinkParent,
    body: CreateCampaignWasteCollectionBody,
): Promise<CampaignDetailsWasteCollection> {
    const link = getLink(campaign, "wasteCollections")
    if (link?.href) {
        return followHref<WasteCollectionResource>(link, { method: "POST", body })
    }
    return followHref<WasteCollectionResource>(
        { href: `/campaigns/${campaign.id}/waste-collections`, method: "POST" },
        { method: "POST", body },
    )
}

// Elimina uma recolha de resíduos de uma campanha.
export async function deleteCampaignWasteCollection(collection: WasteCollectionResource): Promise<void> {
    if (getLink(collection, "delete")) {
        await followLink(collection, "delete", { method: "DELETE" })
        return
    }
    throw new Error("Waste collection delete link not available")
}
