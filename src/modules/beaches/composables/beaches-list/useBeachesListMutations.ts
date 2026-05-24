import type { BeachUpsertDraft } from "@/modules/beaches/types/list"
import { beachCreateMutationMessages, beachDeleteMutationMessages, beachSaveMutationMessages } from "@/modules/beaches/lib/beachListMutationMessages"
import { addBeachToList, removeBeachFromList, updateBeachInList } from "@/modules/beaches/composables/beaches-list/beachesListState"
import { toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"
import type { usePaginatedListRoute } from "@/shared/composables/usePaginatedListRoute"

type RouteApi = Pick<ReturnType<typeof usePaginatedListRoute>, "syncRouteFromRefs">

export function useBeachesListMutations(routeApi: RouteApi) {
    async function removeBeach(id: string) {
        try {
            await removeBeachFromList(id)
            await routeApi.syncRouteFromRefs()
            toastSuccess(beachDeleteMutationMessages.successTitle)
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "delete",
                forbiddenDetail: beachDeleteMutationMessages.forbiddenDetail,
            })
        }
    }

    async function addBeach(draft: BeachUpsertDraft) {
        await addBeachToList(draft)
        await routeApi.syncRouteFromRefs()
    }

    async function updateBeach(id: string, draft: BeachUpsertDraft) {
        await updateBeachInList(id, draft)
        await routeApi.syncRouteFromRefs()
    }

    async function createBeachWithToast(draft: BeachUpsertDraft) {
        try {
            await addBeach(draft)
            toastSuccess(beachCreateMutationMessages.successTitle, beachCreateMutationMessages.successBody)
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "create",
                forbiddenDetail: beachCreateMutationMessages.forbiddenDetail,
                conflictDetail: beachCreateMutationMessages.conflictDetail,
            })
        }
    }

    async function saveBeachWithToast(id: string, draft: BeachUpsertDraft) {
        try {
            await updateBeach(id, draft)
            toastSuccess(beachSaveMutationMessages.successTitle, beachSaveMutationMessages.successBody)
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "save",
                forbiddenDetail: beachSaveMutationMessages.forbiddenDetail,
                conflictDetail: beachSaveMutationMessages.conflictDetail,
            })
        }
    }

    return {
        removeBeach,
        addBeach,
        updateBeach,
        createBeachWithToast,
        saveBeachWithToast,
    }
}
