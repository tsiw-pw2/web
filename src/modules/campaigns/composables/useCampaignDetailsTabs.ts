import { ref, watch, type Ref } from "vue"
import { fetchCampaignComments, fetchCampaignRegistrations, fetchCampaignWasteCollections } from "@/modules/campaigns/services/campaignTabLists"
import type { CampaignDetailsTabId } from "@/modules/campaigns/lib/campaignDetailsTabs"
import type { CampaignDetailsComment, CampaignDetailsRegistration, CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"

export type { CampaignDetailsTabId }

const TAB_PAGE_SIZE = 10

export function useCampaignDetailsTabs(campaignId: Ref<string>, activeTab: Ref<CampaignDetailsTabId>) {
    const registrations = ref<CampaignDetailsRegistration[]>([])
    const registrationsPage = ref(1)
    const registrationsTotal = ref(0)
    const registrationsLoading = ref(false)

    const wasteCollections = ref<CampaignDetailsWasteCollection[]>([])
    const wastePage = ref(1)
    const wasteTotal = ref(0)
    const wasteBeachId = ref<string | undefined>(undefined)
    const wasteLoading = ref(false)

    const comments = ref<CampaignDetailsComment[]>([])
    const commentsPage = ref(1)
    const commentsTotal = ref(0)
    const commentsLoading = ref(false)

    function resetTabState() {
        registrations.value = []
        registrationsPage.value = 1
        registrationsTotal.value = 0
        wasteCollections.value = []
        wastePage.value = 1
        wasteTotal.value = 0
        wasteBeachId.value = undefined
        comments.value = []
        commentsPage.value = 1
        commentsTotal.value = 0
    }

    async function loadRegistrations() {
        if (!campaignId.value) return
        registrationsLoading.value = true
        try {
            const data = await fetchCampaignRegistrations(campaignId.value, {
                page: registrationsPage.value,
                pageSize: TAB_PAGE_SIZE,
            })
            registrations.value = data.items
            registrationsTotal.value = data.total
            registrationsPage.value = data.page
        } catch {
            registrations.value = []
            registrationsTotal.value = 0
        } finally {
            registrationsLoading.value = false
        }
    }

    async function loadWasteCollections() {
        if (!campaignId.value) return
        wasteLoading.value = true
        try {
            const data = await fetchCampaignWasteCollections(campaignId.value, {
                page: wastePage.value,
                pageSize: TAB_PAGE_SIZE,
                beachId: wasteBeachId.value,
            })
            wasteCollections.value = data.items
            wasteTotal.value = data.total
            wastePage.value = data.page
        } catch {
            wasteCollections.value = []
            wasteTotal.value = 0
        } finally {
            wasteLoading.value = false
        }
    }

    async function loadComments() {
        if (!campaignId.value) return
        commentsLoading.value = true
        try {
            const data = await fetchCampaignComments(campaignId.value, {
                page: commentsPage.value,
                pageSize: TAB_PAGE_SIZE,
            })
            comments.value = data.items
            commentsTotal.value = data.total
            commentsPage.value = data.page
        } catch {
            comments.value = []
            commentsTotal.value = 0
        } finally {
            commentsLoading.value = false
        }
    }

    function syncTabLoad(tab: CampaignDetailsTabId) {
        if (!campaignId.value) return
        if (tab === "voluntarios") void loadRegistrations()
        if (tab === "recolhas") void loadWasteCollections()
        if (tab === "comentarios") void loadComments()
    }

    watch(activeTab, (tab) => {
        syncTabLoad(tab)
    })

    watch(campaignId, () => {
        resetTabState()
    })

    function goRegistrationsPrev() {
        if (registrationsPage.value <= 1) return
        registrationsPage.value -= 1
        void loadRegistrations()
    }

    function goRegistrationsNext() {
        const maxPage = Math.max(1, Math.ceil(registrationsTotal.value / TAB_PAGE_SIZE))
        if (registrationsPage.value >= maxPage) return
        registrationsPage.value += 1
        void loadRegistrations()
    }

    function goWastePrev() {
        if (wastePage.value <= 1) return
        wastePage.value -= 1
        void loadWasteCollections()
    }

    function goWasteNext() {
        const maxPage = Math.max(1, Math.ceil(wasteTotal.value / TAB_PAGE_SIZE))
        if (wastePage.value >= maxPage) return
        wastePage.value += 1
        void loadWasteCollections()
    }

    function setWasteBeachFilter(beachId: string | undefined) {
        wasteBeachId.value = beachId
        wastePage.value = 1
        void loadWasteCollections()
    }

    function goCommentsPrev() {
        if (commentsPage.value <= 1) return
        commentsPage.value -= 1
        void loadComments()
    }

    function goCommentsNext() {
        const maxPage = Math.max(1, Math.ceil(commentsTotal.value / TAB_PAGE_SIZE))
        if (commentsPage.value >= maxPage) return
        commentsPage.value += 1
        void loadComments()
    }

    function reloadCommentsFirstPage() {
        commentsPage.value = 1
        void loadComments()
    }

    function reloadRegistrationsFirstPage() {
        registrationsPage.value = 1
        void loadRegistrations()
    }

    function reloadWasteFirstPage() {
        wastePage.value = 1
        void loadWasteCollections()
    }

    return {
        tabPageSize: TAB_PAGE_SIZE,
        registrations,
        registrationsPage,
        registrationsTotal,
        registrationsLoading,
        loadRegistrations,
        goRegistrationsPrev,
        goRegistrationsNext,
        wasteCollections,
        wastePage,
        wasteTotal,
        wasteBeachId,
        wasteLoading,
        loadWasteCollections,
        goWastePrev,
        goWasteNext,
        setWasteBeachFilter,
        comments,
        commentsPage,
        commentsTotal,
        commentsLoading,
        loadComments,
        goCommentsPrev,
        goCommentsNext,
        reloadCommentsFirstPage,
        reloadRegistrationsFirstPage,
        reloadWasteFirstPage,
        resetTabState,
        syncTabLoad,
    }
}
