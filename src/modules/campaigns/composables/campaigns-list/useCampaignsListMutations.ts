import type { CampaignCreateDraft } from "@/modules/campaigns/types/list"
import { campaignsCreateMutationMessages, campaignsDeleteMutationMessages, campaignsSaveMutationMessages } from "@/modules/campaigns/lib/campaignsListMutationMessages"
import { addCampaignToList, removeCampaignFromList, updateCampaignInList } from "@/modules/campaigns/composables/campaigns-list/campaignsListState"
import { toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"
import type { usePaginatedListRoute } from "@/shared/composables/usePaginatedListRoute"

type RouteApi = Pick<ReturnType<typeof usePaginatedListRoute>, "syncRouteFromRefs">

// Composable que gere a lógica de campanhas lista mutations.
export function useCampaignsListMutations(routeApi: RouteApi) {

// Remove a campanha da lista, sincroniza a rota e mostra toast de sucesso.
    async function removeCampaign(id: string) {
        try {
            await removeCampaignFromList(id)
            await routeApi.syncRouteFromRefs()
            toastSuccess(campaignsDeleteMutationMessages.successTitle)
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "delete",
                forbiddenDetail: campaignsDeleteMutationMessages.forbiddenDetail,
            })
        }
    }

// Cria a campanha na lista e sincroniza a paginação na rota.
    async function addCampaign(draft: CampaignCreateDraft) {
        await addCampaignToList(draft)
        await routeApi.syncRouteFromRefs()
    }

// Actualiza campanha.
    async function updateCampaign(id: string, draft: CampaignCreateDraft) {
        await updateCampaignInList(id, draft)
        await routeApi.syncRouteFromRefs()
    }

// Cria campanha com notificação.
    async function createCampaignWithToast(draft: CampaignCreateDraft) {
        try {
            await addCampaign(draft)
            toastSuccess(campaignsCreateMutationMessages.successTitle, campaignsCreateMutationMessages.successBody)
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "create",
                forbiddenDetail: campaignsCreateMutationMessages.forbiddenDetail,
            })
        }
    }

// Actualiza a campanha na lista e notifica sucesso ou erro da operação.
    async function saveCampaignWithToast(id: string, draft: CampaignCreateDraft) {
        try {
            await updateCampaign(id, draft)
            toastSuccess(campaignsSaveMutationMessages.successTitle, campaignsSaveMutationMessages.successBody)
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "save",
                forbiddenDetail: campaignsSaveMutationMessages.forbiddenDetail,
            })
        }
    }

    return {
        removeCampaign,
        addCampaign,
        updateCampaign,
        createCampaignWithToast,
        saveCampaignWithToast,
    }
}
