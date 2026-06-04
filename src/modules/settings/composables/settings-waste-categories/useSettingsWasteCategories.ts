import { describeApiLoadFailure } from "@/infrastructure/apiErrors"
import { ref } from "vue"
import type { WasteCategory, WasteCategoryUpsertDraft } from "@/modules/waste/types/wasteCategory"
import { createWasteCategory, deleteWasteCategory, fetchWasteCategories, updateWasteCategory } from "@/modules/waste/services/wasteCategories"
import { toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"

// Composable que gere a lógica de definições resíduos categorias.
export function useSettingsWasteCategories() {
    const categories = ref<WasteCategory[]>([])
    const page = ref(1)
    const pageSize = ref(20)
    const total = ref(0)
    const loading = ref(false)
    const error = ref<string | null>(null)

// Obtém a página actual de categorias de resíduos da API.
    async function reload() {
        loading.value = true
        error.value = null
        try {
            const result = await fetchWasteCategories(page.value, pageSize.value)
            categories.value = result.items
            total.value = result.total
            page.value = result.page
            pageSize.value = result.pageSize
        } catch (e) {
            categories.value = []
            error.value = describeApiLoadFailure(e, "as categorias")
        } finally {
            loading.value = false
        }
    }

// Navega para anterior página.
    async function goToPrevPage() {
        if (page.value <= 1) return
        page.value -= 1
        await reload()
    }

// Navega para seguinte página.
    async function goToNextPage() {
        const maxPage = Math.max(1, Math.ceil(total.value / pageSize.value))
        if (page.value >= maxPage) return
        page.value += 1
        await reload()
    }

// Cria categoria.
    async function createCategory(draft: WasteCategoryUpsertDraft) {
        try {
            await createWasteCategory(draft)
            await reload()
            toastSuccess("Categoria criada", "A nova categoria já pode ser usada nos resíduos.")
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "create",
                forbiddenDetail: "Só administradores podem gerir categorias.",
                conflictDetail: "Já existe uma categoria com este nome.",
            })
            throw e
        }
    }

// Actualiza a categoria na API, recarrega a lista e notifica sucesso.
    async function saveCategory(id: string, draft: WasteCategoryUpsertDraft) {
        try {
            const item = categories.value.find((c) => c.id === id)
            await updateWasteCategory(item ?? id, draft)
            await reload()
            toastSuccess("Categoria guardada", "As alterações ficaram disponíveis nos resíduos.")
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "save",
                forbiddenDetail: "Só administradores podem gerir categorias.",
                conflictDetail: "Já existe uma categoria com este nome.",
            })
            throw e
        }
    }

// Elimina a categoria na API, recarrega a lista e notifica sucesso.
    async function removeCategory(id: string) {
        try {
            const item = categories.value.find((c) => c.id === id)
            await deleteWasteCategory(item ?? id)
            await reload()
            toastSuccess("Categoria eliminada")
        } catch (e) {
            toastFromListMutationError(e, {
                mode: "delete",
                forbiddenDetail: "Só administradores podem gerir categorias.",
                conflictDetail: "Não podes eliminar: existem resíduos associados a esta categoria.",
            })
            throw e
        }
    }

    return {
        categories,
        page,
        pageSize,
        total,
        loading,
        error,
        reload,
        goToPrevPage,
        goToNextPage,
        createCategory,
        saveCategory,
        removeCategory,
    }
}
