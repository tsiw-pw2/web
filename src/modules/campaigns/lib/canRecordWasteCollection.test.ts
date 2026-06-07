import { describe, expect, it } from "vitest"
import { canRecordWasteCollection } from "@/modules/campaigns/lib/canRecordWasteCollection"
import type { CampaignDetails } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"

const organizerProfile = { id: "org-1", isAdmin: false, isOrganizer: true, isBlocked: false } as SettingsProfile
const volunteerProfile = { id: "vol-1", isAdmin: false, isOrganizer: false, isBlocked: false } as SettingsProfile
const adminProfile = { id: "adm-1", isAdmin: true, isOrganizer: false, isBlocked: false } as SettingsProfile

function campaign(overrides: Partial<CampaignDetails> = {}): CampaignDetails {
    return {
        id: "camp-1",
        organizer: { id: "org-1", name: "Organizador" },
        viewerRegistration: { id: "reg-1", userId: "vol-1", role: 0, status: 1, attendance: null },
        ...overrides,
    } as CampaignDetails
}

describe("canRecordWasteCollection", () => {
    it("permite organizador da campanha", () => {
        expect(canRecordWasteCollection(campaign(), organizerProfile)).toBe(true)
    })

    it("permite administrador", () => {
        expect(canRecordWasteCollection(campaign(), adminProfile)).toBe(true)
    })

    it("nega voluntário inscrito", () => {
        expect(canRecordWasteCollection(campaign(), volunteerProfile)).toBe(false)
    })
})
