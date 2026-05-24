import { computed, inject, onMounted, ref } from "vue"
import type { WasteCategory } from "@/modules/waste/types/wasteCategory"
import { useSettingsWasteCategories } from "@/modules/settings/composables/settings-waste-categories/useSettingsWasteCategories"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"

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
        if (profile?.value?.isAdmin) {
            void api.reload()
        }
    })

    function cancelCreate() {
        isCreating.value = false
        newCategoryName.value = ""
    }

    function cancelEdit() {
        editingCategoryId.value = null
        editingName.value = ""
    }

    function clearInlineState() {
        cancelCreate()
        cancelEdit()
    }

    async function startCreate() {
        if (isSaving.value) return
        cancelEdit()
        isCreating.value = true
        newCategoryName.value = ""
    }

    function startEdit(category: WasteCategory) {
        if (isSaving.value) return
        cancelCreate()
        editingCategoryId.value = category.id
        editingName.value = category.name
        ignoreEditBlurUntil.value = Date.now() + 250
    }

    function openDeleteModal(id: string) {
        if (isSaving.value) return
        clearInlineState()
        deleteCategoryId.value = id
        isDeleteModalOpen.value = true
    }

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
