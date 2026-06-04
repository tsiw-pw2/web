import type { WasteUpsertDraft } from "@/modules/waste/types/list"
import { wasteDeleteMutationMessages, wasteCreateMutationMessages, wasteSaveMutationMessages } from "@/modules/waste/lib/wasteListMutationMessages"
import { addWasteToList, removeWasteFromList, updateWasteInList } from "@/modules/waste/composables/waste-list/wasteListState"
import { toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"
import type { usePaginatedListRoute } from "@/shared/composables/usePaginatedListRoute"

type RouteApi = Pick<ReturnType<typeof usePaginatedListRoute>, "syncRouteFromRefs">

// Composable que gere a lógica de resíduos lista mutations.
export function useWasteListMutations(routeApi: RouteApi) {

// Remove o resíduo da lista, sincroniza a rota e mostra toast de sucesso.
    async function removeWaste(id: string) {
        try {
            await removeWasteFromList(id)
            await routeApi.syncRouteFromRefs()
            toastSuccess(wasteDeleteMutationMessages.successTitle)
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "delete",
                forbiddenDetail: wasteDeleteMutationMessages.forbiddenDetail,
            })
        }
    }

// Cria o resíduo na lista e sincroniza a paginação na rota.
    async function addWaste(draft: WasteUpsertDraft) {
        await addWasteToList(draft)
        await routeApi.syncRouteFromRefs()
    }

// Actualiza resíduos.
    async function updateWaste(id: string, draft: WasteUpsertDraft) {
        await updateWasteInList(id, draft)
        await routeApi.syncRouteFromRefs()
    }

// Cria resíduos com notificação.
    async function createWasteWithToast(draft: WasteUpsertDraft): Promise<boolean> {
        try {
            await addWaste(draft)
            toastSuccess(wasteCreateMutationMessages.successTitle, wasteCreateMutationMessages.successBody)
            return true
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "create",
                forbiddenDetail: wasteCreateMutationMessages.forbiddenDetail,
                conflictDetail: wasteCreateMutationMessages.conflictDetail,
            })
            return false
        }
    }

// Actualiza o resíduo na lista e notifica sucesso ou erro da operação.
    async function saveWasteWithToast(id: string, draft: WasteUpsertDraft): Promise<boolean> {
        try {
            await updateWaste(id, draft)
            toastSuccess(wasteSaveMutationMessages.successTitle, wasteSaveMutationMessages.successBody)
            return true
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "save",
                forbiddenDetail: wasteSaveMutationMessages.forbiddenDetail,
                conflictDetail: wasteSaveMutationMessages.conflictDetail,
            })
            return false
        }
    }

    return {
        removeWaste,
        addWaste,
        updateWaste,
        createWasteWithToast,
        saveWasteWithToast,
    }
}
