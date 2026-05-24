import { computed, ref, type Ref } from "vue"
import {
    deleteCampaignWasteCollection,
    postCampaignWasteCollection,
    type CreateCampaignWasteCollectionBody,
} from "@/modules/campaigns/services/campaignWasteCollections"
import type { CampaignDetails, CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"
import { toastError, toastSuccess } from "@/infrastructure/appToast"
import { isApiRequestError } from "@/infrastructure/request"

type WasteTabs = {
    wasteBeachId: Ref<string | undefined>
    wasteTotal: Ref<number>
    setWasteBeachFilter: (beachId: string | undefined) => void
    reloadWasteFirstPage: () => void | Promise<void>
}

export function useCampaignDetailsWaste(
    campaignId: Ref<string>,
    campaign: Ref<CampaignDetails | null>,
    tabs: WasteTabs,
    refreshCampaignMetrics: () => void | Promise<void>,
) {
    const createWasteCollectionOpen = ref(false)
    const postingWasteCollection = ref(false)
    const deleteWasteCollectionOpen = ref(false)
    const deleteWasteCollectionTarget = ref<CampaignDetailsWasteCollection | null>(null)
    const deletingWasteCollectionId = ref<string | null>(null)

    const wasteBeachSelectValue = computed({
        get: () => tabs.wasteBeachId.value ?? "__all__",
        set: (v: string | undefined) => {
            tabs.setWasteBeachFilter(v === "__all__" || v === undefined ? undefined : v)
        },
    })

    const wasteBeachSelectOptions = computed(() => {
        const beaches = campaign.value?.beaches ?? []
        return [
            { value: "__all__", label: "Todas as praias" },
            ...beaches.map((b) => ({ value: b.id, label: b.name })),
        ]
    })

    const wasteCountLabel = computed(() => {
        const n = tabs.wasteBeachId.value
            ? tabs.wasteTotal.value
            : (campaign.value?.metrics.wasteCollectionsCount ?? 0)
        return n === 1 ? "recolha" : "recolhas"
    })

    const wasteCountValue = computed(() =>
        tabs.wasteBeachId.value
            ? tabs.wasteTotal.value
            : (campaign.value?.metrics.wasteCollectionsCount ?? 0),
    )

    async function onCreateWasteCollection(body: CreateCampaignWasteCollectionBody) {
        postingWasteCollection.value = true
        try {
            await postCampaignWasteCollection(campaignId.value, body)
            await tabs.reloadWasteFirstPage()
            await refreshCampaignMetrics()
            toastSuccess("Recolha registada")
        } catch (e) {
            if (isApiRequestError(e) && e.httpStatus === 403) {
                toastError("Não podes registar aqui", "Inscreve-te nesta campanha para registar recolhas.")
            } else {
                toastError("Não foi possível registar", "Verifica os dados e tenta outra vez.")
            }
        } finally {
            postingWasteCollection.value = false
        }
    }

    function openDeleteWasteCollection(row: CampaignDetailsWasteCollection) {
        deleteWasteCollectionTarget.value = row
        deleteWasteCollectionOpen.value = true
    }

    const deleteWasteCollectionSummary = computed(() => {
        const row = deleteWasteCollectionTarget.value
        if (!row) return undefined
        const wasteName = row.waste?.name ?? "Resíduo"
        const beachName = row.beach?.name
        return beachName ? `${wasteName} · ${beachName}` : wasteName
    })

    async function confirmDeleteWasteCollection() {
        const target = deleteWasteCollectionTarget.value
        if (!target || deletingWasteCollectionId.value) return
        deletingWasteCollectionId.value = target.id
        try {
            await deleteCampaignWasteCollection(campaignId.value, target.id)
            await tabs.reloadWasteFirstPage()
            await refreshCampaignMetrics()
            toastSuccess("Recolha apagada")
            deleteWasteCollectionOpen.value = false
            deleteWasteCollectionTarget.value = null
        } catch (e) {
            if (isApiRequestError(e) && e.httpStatus === 403) {
                toastError("Não podes apagar", "Não tens permissão para remover este registo.")
            } else {
                toastError("Não foi possível apagar", "Tenta outra vez dentro de momentos.")
            }
        } finally {
            deletingWasteCollectionId.value = null
        }
    }

    return {
        createWasteCollectionOpen,
        postingWasteCollection,
        deleteWasteCollectionOpen,
        deleteWasteCollectionTarget,
        deleteWasteCollectionSummary,
        deletingWasteCollectionId,
        wasteBeachSelectValue,
        wasteBeachSelectOptions,
        wasteCountLabel,
        wasteCountValue,
        onCreateWasteCollection,
        openDeleteWasteCollection,
        confirmDeleteWasteCollection,
    }
}
