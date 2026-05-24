export type BeachListItem = {
    id: string
    name: string
    municipality: string
    district: string
    latitude: string
    longitude: string
}

export type BeachUpsertDraft = {
    name: string
    municipality: string
    district: string
    latitude: string
    longitude: string
}
