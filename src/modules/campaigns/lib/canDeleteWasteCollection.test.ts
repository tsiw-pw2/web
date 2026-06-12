import { describe, expect, it } from "vitest"
import { canDeleteWasteCollection } from "@/modules/campaigns/lib/canDeleteWasteCollection"
import type { CampaignDetails, CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"

const organizerProfile: SettingsProfile = {
    id: "org-1",
    name: "Organizador",
    email: "org@test.pt",
    role: "organizer",
    isOrganizer: true,
    isOrgAdmin: false,
    isRoot: false,
    isBlocked: false,
    birthDate: "1990-01-01",
    phone: null,
    avatarUrl: null,
}

const volunteerProfile: SettingsProfile = {
    ...organizerProfile,
    id: "vol-1",
    role: "volunteer",
    isOrganizer: false,
}

const campaign: CampaignDetails = {
    id: "c1",
    title: "Campanha",
    description: "",
    meetingLocation: "",
    meetingTime: null,
    startDate: "2026-06-01",
    endDate: "2026-06-02",
    districtCode: null,
    status: "open",
    editStatus: "open",
    organizer: { id: "org-1", name: "Organizador" },
    beaches: [],
    metrics: {
        beachesCount: 0,
        registrationsCount: 0,
        pendingRegistrationsCount: 0,
        commentsCount: 0,
        wasteCollectionsCount: 0,
        totalWasteUnits: 0,
        totalWasteWeightKg: 0,
        totalActualWeightKg: 0,
        totalImpactWeightKg: 0,
        wasteByType: [],
    },
    viewerCanPostComment: true,
    viewerCanEnroll: false,
    viewerRegistration: { id: "r1", userId: "vol-1", role: 0, status: 1, attendance: null },
}

const row: CampaignDetailsWasteCollection = {
    id: "wc1",
    unitQuantity: 1,
    actualWeightKg: null,
    estimatedWeightKg: "0.025",
    createdAt: "2026-06-01T10:00:00.000Z",
    beach: { id: "b1", name: "Praia" },
    waste: { id: "w1", name: "PET" },
    recordedBy: { id: "org-1", name: "Organizador" },
}

describe("canDeleteWasteCollection", () => {
    it("voluntário inscrito não pode apagar", () => {
        expect(canDeleteWasteCollection(campaign, volunteerProfile, row)).toBe(false)
    })

    it("organizador da campanha pode apagar", () => {
        expect(canDeleteWasteCollection(campaign, organizerProfile, row)).toBe(true)
    })

    it("respeita hipermedia delete quando presente", () => {
        const withLinks = {
            ...row,
            links: { self: { href: "/x", method: "GET" } },
        }
        expect(canDeleteWasteCollection(campaign, organizerProfile, withLinks)).toBe(false)
    })
})
