import type { BeachListItem } from "@/modules/beaches/types/list"
import { formatHomeCampaignLocation } from "@/modules/home/lib/formatHomeCampaignDate"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"

const districtLabelByCode = Object.fromEntries(
    DISTRICT_SELECT_OPTIONS.map((option) => [option.value, option.label]),
) as Record<string, string>

export function beachLocationLabel(beach: Pick<BeachListItem, "municipality" | "district">): string {
    const districtLabel = districtLabelByCode[beach.district] ?? beach.district
    return formatHomeCampaignLocation(beach.municipality, districtLabel)
}
