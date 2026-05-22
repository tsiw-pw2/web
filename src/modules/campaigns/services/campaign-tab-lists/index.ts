import { listCampaignComments } from "@/modules/campaigns/services/campaign-tab-lists/listCampaignComments"
import { listCampaignRegistrations } from "@/modules/campaigns/services/campaign-tab-lists/listCampaignRegistrations"
import { listCampaignWasteCollections } from "@/modules/campaigns/services/campaign-tab-lists/listCampaignWasteCollections"

export { listCampaignComments, type ListCampaignCommentsQuery } from "@/modules/campaigns/services/campaign-tab-lists/listCampaignComments"
export {
    listCampaignRegistrations,
    type ListCampaignRegistrationsQuery,
} from "@/modules/campaigns/services/campaign-tab-lists/listCampaignRegistrations"
export {
    listCampaignWasteCollections,
    type ListCampaignWasteCollectionsQuery,
} from "@/modules/campaigns/services/campaign-tab-lists/listCampaignWasteCollections"

export const fetchCampaignComments = listCampaignComments
export const fetchCampaignRegistrations = listCampaignRegistrations
export const fetchCampaignWasteCollections = listCampaignWasteCollections
