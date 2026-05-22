export type CampaignListItem = {
    id: string
    title: string
    municipality: string
    beach: string
    startDate: string
    endDate: string
}

export type CampaignCreateDraft = {
    title: string
    meetingTime: string
    startDate: string
    endDate: string
    status: string
    information: string
    district?: string
    beachIds?: string[]
}
