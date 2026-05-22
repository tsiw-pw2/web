import { computed, ref, type Ref } from "vue"
import {
    postCampaignWasteCollection,
    type CreateCampaignWasteCollectionBody,
} from "@/modules/campaigns/services/campaignWasteCollections"
import type { CampaignDetails } from "@/modules/campaigns/types/details"
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
                toastError("Não podes registar aqui", "Confirma a tua inscrição ou fala com o organizador.")
            } else {
                toastError("Não foi possível registar", "Verifica os dados e tenta outra vez.")
            }
        } finally {
            postingWasteCollection.value = false
        }
    }

    return {
        createWasteCollectionOpen,
        postingWasteCollection,
        wasteBeachSelectValue,
        wasteBeachSelectOptions,
        wasteCountLabel,
        wasteCountValue,
        onCreateWasteCollection,
    }
}
