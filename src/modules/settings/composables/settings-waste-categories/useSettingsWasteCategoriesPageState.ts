import { computed, inject, onMounted, ref } from "vue"
import type { WasteCategory } from "@/modules/waste/types/wasteCategory"
import { canAccessSettingsWasteCategories } from "@/modules/auth/lib/accessPolicy"
import { useSettingsWasteCategories } from "@/modules/settings/composables/settings-waste-categories/useSettingsWasteCategories"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"

// Composable que gere a lógica de definições resíduos categorias página estado.
export function useSettingsWasteCategoriesPageState() {
    const profile = inject(settingsProfileKey)
    const api = useSettingsWasteCategories()

    const isCreating = ref(false)
    const newCategoryName = ref("")
    const editingCategoryId = ref<string | null>(null)
    const editingName = ref("")
    const isDeleteModalOpen = ref(false)
    const deleteCategoryId = ref<string | null>(null)
    const isSaving = ref(false)
    const ignoreEditBlurUntil = ref(0)

    const deleteCategoryName = computed(() => {
        if (!deleteCategoryId.value) return undefined
        return api.categories.value.find((row) => row.id === deleteCategoryId.value)?.name
    })

    onMounted(() => {
        if (canAccessSettingsWasteCategories(profile?.value)) {
            void api.reload()
        }
    })

// Verifica se é possível cel criação.
    function cancelCreate() {
        isCreating.value = false
        newCategoryName.value = ""
    }

// Verifica se é possível cel edição.
    function cancelEdit() {
        editingCategoryId.value = null
        editingName.value = ""
    }

// Cancela criação e edição inline na página de categorias.
    function clearInlineState() {
        cancelCreate()
        cancelEdit()
    }

// Abre o formulário inline para criar uma nova categoria.
    async function startCreate() {
        if (isSaving.value) return
        cancelEdit()
        isCreating.value = true
        newCategoryName.value = ""
    }

// Entra em modo de edição inline de uma categoria.
    function startEdit(category: WasteCategory) {
        if (isSaving.value) return
        cancelCreate()
        editingCategoryId.value = category.id
        editingName.value = category.name
        ignoreEditBlurUntil.value = Date.now() + 250
    }

// Abre eliminação modal.
    function openDeleteModal(id: string) {
        if (isSaving.value) return
        clearInlineState()
        deleteCategoryId.value = id
        isDeleteModalOpen.value = true
    }

// Valida o nome e cria a categoria na API.
    async function commitCreate() {
        const name = newCategoryName.value.trim()
        if (!name || isSaving.value) {
            if (!name) cancelCreate()
            return
        }
        isSaving.value = true
        try {
            await api.createCategory({ name })
            cancelCreate()
        } catch {
        } finally {
            isSaving.value = false
        }
    }

// Grava o nome editado na API se tiver sido alterado.
    async function commitEdit() {
        if (Date.now() < ignoreEditBlurUntil.value) return
        const id = editingCategoryId.value
        if (!id || isSaving.value) return
        const name = editingName.value.trim()
        const current = api.categories.value.find((row) => row.id === id)
        if (!name) {
            cancelEdit()
            return
        }
        if (current && current.name === name) {
            cancelEdit()
            return
        }
        isSaving.value = true
        try {
            await api.saveCategory(id, { name })
            cancelEdit()
        } catch {
        } finally {
            isSaving.value = false
        }
    }

// Trata Enter/Escape no campo de criação de categoria.
    function onCreateKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault()
            void commitCreate()
        }
        if (event.key === "Escape") {
            event.preventDefault()
            cancelCreate()
        }
    }

// Trata Enter/Escape no campo de edição de categoria.
    function onEditKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault()
            void commitEdit()
        }
        if (event.key === "Escape") {
            event.preventDefault()
            cancelEdit()
        }
    }

// Elimina a categoria confirmada no modal e limpa o estado.
    async function onDeleteConfirm() {
        if (!deleteCategoryId.value) return
        await api.removeCategory(deleteCategoryId.value)
        deleteCategoryId.value = null
    }

    return {
        profile,
        ...api,
        isCreating,
        newCategoryName,
        editingCategoryId,
        editingName,
        isDeleteModalOpen,
        deleteCategoryName,
        isSaving,
        startCreate,
        startEdit,
        openDeleteModal,
        commitCreate,
        commitEdit,
        cancelCreate,
        cancelEdit,
        onCreateKeydown,
        onEditKeydown,
        onDeleteConfirm,
    }
}
