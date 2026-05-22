import type { CampaignDetailsBeach } from "@/modules/campaigns/types/details"

export function beachLocationLine(beach: CampaignDetailsBeach): string {
    const parts = [beach.municipality, beach.district].filter(Boolean)
    return parts.length > 0 ? parts.join(" · ") : ""
}
