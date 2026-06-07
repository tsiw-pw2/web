import { ref, watch, type Ref } from "vue"
import { toastError } from "@/infrastructure/appToast"
import { isApiRequestError } from "@/infrastructure/request"
import { CAMPAIGN_DETAILS_TAB_PAGE_SIZE } from "@/modules/campaigns/lib/campaignDetailsConstants"
import { fetchCampaignComments, fetchCampaignRegistrations, fetchCampaignWasteCollections } from "@/modules/campaigns/services/campaign-tab-lists/index"
import type { CampaignDetailsTabId } from "@/modules/campaigns/lib/campaignDetailsTabs"
import type {
    CampaignDetails,
    CampaignDetailsComment,
    CampaignDetailsRegistration,
    CampaignDetailsWasteCollection,
} from "@/modules/campaigns/types/details"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import { canAccessCampaignComments } from "@/modules/campaigns/lib/canAccessCampaignComments"

export type { CampaignDetailsTabId }

const TAB_PAGE_SIZE = CAMPAIGN_DETAILS_TAB_PAGE_SIZE

// Mostra toast quando o separador não pode ser carregado por falta de permissão.
function tabLoadForbiddenToast() {
    toastError("Não tens permissão para esta ação.")
}

// Composable que gere a lógica de campanha detalhes separadores.
type CampaignWithLinks = CampaignDetails & { links?: ResourceLinks }

export function useCampaignDetailsTabs(
    campaignId: Ref<string>,
    campaign: Ref<CampaignWithLinks | null>,
    activeTab: Ref<CampaignDetailsTabId>,
) {
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

// Repõe separador estado.
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

// Carrega inscrições.
    async function loadRegistrations(options?: { silent?: boolean }) {
        if (!campaignId.value || !campaign.value) return
        registrationsLoading.value = true
        try {
            const data = await fetchCampaignRegistrations(campaign.value, {
                page: registrationsPage.value,
                pageSize: TAB_PAGE_SIZE,
            })
            registrations.value = data.items
            registrationsTotal.value = data.total
            registrationsPage.value = data.page
        } catch (e) {
            registrations.value = []
            registrationsTotal.value = 0
            if (isApiRequestError(e) && e.httpStatus === 403 && !options?.silent) {
                tabLoadForbiddenToast()
            }
        } finally {
            registrationsLoading.value = false
        }
    }

// Carrega resíduos collections.
    async function loadWasteCollections() {
        if (!campaignId.value || !campaign.value) return
        wasteLoading.value = true
        try {
            const data = await fetchCampaignWasteCollections(campaign.value, {
                page: wastePage.value,
                pageSize: TAB_PAGE_SIZE,
                beachId: wasteBeachId.value,
            })
            wasteCollections.value = data.items
            wasteTotal.value = data.total
            wastePage.value = data.page
        } catch (e) {
            wasteCollections.value = []
            wasteTotal.value = 0
            if (isApiRequestError(e) && e.httpStatus === 403) {
                tabLoadForbiddenToast()
            }
        } finally {
            wasteLoading.value = false
        }
    }

// Carrega comentários.
    async function loadComments() {
        if (!campaignId.value || !campaign.value) return
        if (!canAccessCampaignComments(campaign.value)) return
        commentsLoading.value = true
        try {
            const data = await fetchCampaignComments(campaign.value, {
                page: commentsPage.value,
                pageSize: TAB_PAGE_SIZE,
            })
            comments.value = data.items
            commentsTotal.value = data.total
            commentsPage.value = data.page
        } catch (e) {
            comments.value = []
            commentsTotal.value = 0
            if (isApiRequestError(e) && e.httpStatus === 403) {
                tabLoadForbiddenToast()
            }
        } finally {
            commentsLoading.value = false
        }
    }

// Sincroniza separador load.
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

// Navega inscrições anterior.
    function goRegistrationsPrev() {
        if (registrationsPage.value <= 1) return
        registrationsPage.value -= 1
        void loadRegistrations()
    }

// Navega inscrições seguinte.
    function goRegistrationsNext() {
        const maxPage = Math.max(1, Math.ceil(registrationsTotal.value / TAB_PAGE_SIZE))
        if (registrationsPage.value >= maxPage) return
        registrationsPage.value += 1
        void loadRegistrations()
    }

// Navega resíduos anterior.
    function goWastePrev() {
        if (wastePage.value <= 1) return
        wastePage.value -= 1
        void loadWasteCollections()
    }

// Navega resíduos seguinte.
    function goWasteNext() {
        const maxPage = Math.max(1, Math.ceil(wasteTotal.value / TAB_PAGE_SIZE))
        if (wastePage.value >= maxPage) return
        wastePage.value += 1
        void loadWasteCollections()
    }

// Define resíduos praia filtro.
    function setWasteBeachFilter(beachId: string | undefined) {
        wasteBeachId.value = beachId
        wastePage.value = 1
        void loadWasteCollections()
    }

// Navega comentários anterior.
    function goCommentsPrev() {
        if (commentsPage.value <= 1) return
        commentsPage.value -= 1
        void loadComments()
    }

// Navega comentários seguinte.
    function goCommentsNext() {
        const maxPage = Math.max(1, Math.ceil(commentsTotal.value / TAB_PAGE_SIZE))
        if (commentsPage.value >= maxPage) return
        commentsPage.value += 1
        void loadComments()
    }

// Repõe a paginação e recarrega os comentários da primeira página.
    function reloadCommentsFirstPage() {
        commentsPage.value = 1
        void loadComments()
    }

// Repõe a paginação e recarrega as inscrições da primeira página.
    function reloadRegistrationsFirstPage(options?: { silent?: boolean }) {
        registrationsPage.value = 1
        void loadRegistrations(options)
    }

// Repõe a paginação e recarrega as recolhas da primeira página.
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
