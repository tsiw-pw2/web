import type { BeachUpsertDraft } from "@/modules/beaches/types/list"
import { beachCreateMutationMessages, beachDeleteMutationMessages, beachSaveMutationMessages } from "@/modules/beaches/lib/beachListMutationMessages"
import { addBeachToList, removeBeachFromList, updateBeachInList } from "@/modules/beaches/composables/beaches-list/beachesListState"
import { toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"
import type { usePaginatedListRoute } from "@/shared/composables/usePaginatedListRoute"

type RouteApi = Pick<ReturnType<typeof usePaginatedListRoute>, "syncRouteFromRefs">

// Composable que gere a lógica de beaches lista mutations.
export function useBeachesListMutations(routeApi: RouteApi) {

// Remove a praia da lista, sincroniza a rota e mostra toast de sucesso.
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

// Cria a praia na lista e sincroniza a paginação na rota.
    async function addBeach(draft: BeachUpsertDraft) {
        await addBeachToList(draft)
        await routeApi.syncRouteFromRefs()
    }

// Actualiza praia.
    async function updateBeach(id: string, draft: BeachUpsertDraft) {
        await updateBeachInList(id, draft)
        await routeApi.syncRouteFromRefs()
    }

// Cria praia com notificação.
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

// Actualiza a praia na lista e notifica sucesso ou erro da operação.
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
