import { describe, expect, it } from "vitest"
import { canRecordWasteCollection } from "@/modules/campaigns/lib/canRecordWasteCollection"
import type { CampaignDetails } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"

const organizerProfile = {
    id: "org-1",
    isAdmin: false,
    isOrganizer: true,
    isBlocked: false,
} as SettingsProfile
const orgAdminProfile = {
    id: "adm-1",
    isAdmin: false,
    isOrganizer: true,
    isOrgAdmin: true,
    isBlocked: false,
} as SettingsProfile
const volunteerProfile = {
    id: "vol-1",
    isAdmin: false,
    isOrganizer: false,
    isBlocked: false,
} as SettingsProfile

const campaign = {
    organizer: { id: "org-1" },
    editStatus: "aberta_inscricoes",
} as CampaignDetails

describe("canRecordWasteCollection", () => {
    it("organizador da campanha pode registar", () => {
        expect(canRecordWasteCollection(campaign, organizerProfile)).toBe(true)
    })

    it("admin da org pode registar", () => {
        expect(canRecordWasteCollection(campaign, orgAdminProfile)).toBe(true)
    })

    it("voluntário não pode registar", () => {
        expect(canRecordWasteCollection(campaign, volunteerProfile)).toBe(false)
    })
})
