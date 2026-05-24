import type { WasteUpsertDraft } from "@/modules/waste/types/list"
import { wasteDeleteMutationMessages, wasteCreateMutationMessages, wasteSaveMutationMessages } from "@/modules/waste/lib/wasteListMutationMessages"
import { addWasteToList, removeWasteFromList, updateWasteInList } from "@/modules/waste/composables/waste-list/wasteListState"
import { toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"
import type { usePaginatedListRoute } from "@/shared/composables/usePaginatedListRoute"

type RouteApi = Pick<ReturnType<typeof usePaginatedListRoute>, "syncRouteFromRefs">

export function useWasteListMutations(routeApi: RouteApi) {
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

    async function addWaste(draft: WasteUpsertDraft) {
        await addWasteToList(draft)
        await routeApi.syncRouteFromRefs()
    }

    async function updateWaste(id: string, draft: WasteUpsertDraft) {
        await updateWasteInList(id, draft)
        await routeApi.syncRouteFromRefs()
    }

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
