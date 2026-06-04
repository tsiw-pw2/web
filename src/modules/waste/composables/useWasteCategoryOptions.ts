import { computed, ref } from "vue"
import type { WasteCategory } from "@/modules/waste/types/wasteCategory"
import { createWasteCategory, fetchWasteCategories } from "@/modules/waste/services/wasteCategories"
import { isApiRequestError } from "@/infrastructure/request"
import { normalizeForSearch } from "@/shared/lib/matchHighlight"

const categoriesRef = ref<WasteCategory[]>([])
const loadingRef = ref(false)
const creatingRef = ref(false)
const loadedRef = ref(false)

// Ordena categorias de resíduo por nome (locale pt).
function sortCategories(items: WasteCategory[]) {
    return [...items].sort((a, b) => a.name.localeCompare(b.name, "pt"))
}

// Procura categoria pelo nome (comparação normalizada).
function findCategoryByName(name: string) {
    const normalized = normalizeForSearch(name)
    return categoriesRef.value.find((category) => normalizeForSearch(category.name) === normalized) ?? null
}

// Composable que gere a lógica de resíduos categoria opções.
export function useWasteCategoryOptions() {
    const categoryOptions = computed(() =>
        categoriesRef.value.map((category) => ({
            value: category.id,
            label: category.name,
        })),
    )

// Carrega categorias.
    async function loadCategories(force = false) {
        if (loadedRef.value && !force) return
        loadingRef.value = true
        try {
            const result = await fetchWasteCategories(1, 100)
            categoriesRef.value = sortCategories(result.items)
            loadedRef.value = true
        } finally {
            loadingRef.value = false
        }
    }

// Cria categoria.
    async function createCategory(name: string): Promise<WasteCategory> {
        const trimmed = name.trim()
        const existing = findCategoryByName(trimmed)
        if (existing) return existing

        creatingRef.value = true
        try {
            const created = await createWasteCategory({ name: trimmed })
            categoriesRef.value = sortCategories([...categoriesRef.value, created])
            return created
        } catch (error) {
            if (isApiRequestError(error) && error.httpStatus === 409) {
                await loadCategories(true)
                const duplicate = findCategoryByName(trimmed)
                if (duplicate) return duplicate
            }
            throw error
        } finally {
            creatingRef.value = false
        }
    }

    return {
        categories: categoriesRef,
        categoryOptions,
        categoriesLoading: loadingRef,
        categoryCreating: creatingRef,
        loadCategories,
        createCategory,
    }
}
