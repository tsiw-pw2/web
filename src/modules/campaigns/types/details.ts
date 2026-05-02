export type CampaignDetailsOrganizer = {
	id: string
	name: string
	email: string
}

export type CampaignDetailsBeach = {
	id: string
	name: string
	latitude: string
	longitude: string
	district: string | null
	municipality: string | null
	parish: string | null
}

export type CampaignDetailsRegistrationUser = {
	id: string
	name: string
	email: string
	phone: string | null
}

export type CampaignDetailsRegistration = {
	id: string
	role: number
	status: number
	attendance: boolean | null
	createdAt: string
	user: CampaignDetailsRegistrationUser | null
}

export type CampaignDetailsComment = {
	id: string
	body: string
	createdAt: string
	user: { id: string; name: string } | null
}

export type CampaignDetailsWasteCollection = {
	id: string
	unitQuantity: number
	actualWeightKg: string | null
	createdAt: string
	beach: { id: string; name: string } | null
	waste: { id: string; name: string } | null
	recordedBy: { id: string; name: string } | null
}

export type CampaignDetailsMetrics = {
	beachesCount: number
	registrationsCount: number
	commentsCount: number
	wasteCollectionsCount: number
	totalWasteUnits: number
	totalWasteWeightKg: number
}

export type CampaignDetails = {
	id: string
	title: string
	description: string | null
	meetingLocation: string
	meetingTime: string | null
	startDate: string
	endDate: string
	status: number
	organizer: CampaignDetailsOrganizer | null
	beaches: CampaignDetailsBeach[]
	registrations: CampaignDetailsRegistration[]
	comments: CampaignDetailsComment[]
	wasteCollections: CampaignDetailsWasteCollection[]
	metrics: CampaignDetailsMetrics
}

