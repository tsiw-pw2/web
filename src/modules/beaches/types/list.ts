import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

export type BeachListItem = {
    id: string
    name: string
    municipality: string
    district: string
    latitude: string
    longitude: string
    links?: ResourceLinks
}

export type BeachUpsertDraft = {
    name: string
    municipality: string
    district: string
    latitude: string
    longitude: string
}
