import { computed, ref, watch, type Ref } from "vue"
import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import { normalizeWasteUnit } from "@/modules/waste/lib/wasteDisplayLabels"
import { isWeightGramsInputValid, parseWeightGramsInput } from "@/modules/waste/lib/wasteWeightForm"
import { fetchWasteItem } from "@/modules/waste/services/waste/fetchWasteItem"
import { toastError } from "@/infrastructure/appToast"

export type WasteUpsertMode = "create" | "edit"

const WEIGHT_ERROR_MESSAGE = "Introduz um valor em gramas (mínimo 1 g)."

export function useWasteUpsertForm(
    open: Ref<boolean>,
    mode: WasteUpsertMode,
    wasteId: Ref<string | null | undefined>,
    initialItem: Ref<WasteListItem | null | undefined>,
    options: {
        categoriesLoading: Ref<boolean>
        categoryCreating: Ref<boolean>
        isAdmin: Ref<boolean>
        categoryOptions: Ref<{ value: string; label: string }[]>
        submitting: Ref<boolean>
    },
    onSubmit: (payload: WasteUpsertDraft) => void,
) {
    const name = ref("")
    const categoryId = ref<string | undefined>(undefined)
    const unit = ref<string>("unit")
    const weightGrams = ref("")
    const weightError = ref("")
    const loading = ref(false)

    const showCategorySelect = computed(() => {
        if (options.categoriesLoading.value) return false
        if (options.categoryOptions.value.length > 0) return true
        return options.isAdmin.value
    })

    const canSubmit = computed(() => {
        if (options.categoriesLoading.value || options.categoryCreating.value) return false
        if (!options.isAdmin.value && options.categoryOptions.value.length === 0) return false
        if (loading.value || options.submitting.value) return false
        return true
    })

    function requiresWeightValidation(): boolean {
        return normalizeWasteUnit(unit.value) === "peso"
    }

    function validateWeight(): boolean {
        if (!requiresWeightValidation()) {
            weightError.value = ""
            return true
        }
        if (!isWeightGramsInputValid(weightGrams.value)) {
            weightError.value = WEIGHT_ERROR_MESSAGE
            return false
        }
        weightError.value = ""
        return true
    }

    function validateForm(): boolean {
        const weightOk = validateWeight()
        return weightOk && name.value.trim().length > 0 && Boolean(categoryId.value)
    }

    function buildDraft(): WasteUpsertDraft | null {
        const normalizedUnit = normalizeWasteUnit(unit.value)
        if (normalizedUnit === "peso" && !isWeightGramsInputValid(weightGrams.value)) {
            return null
        }

        if (normalizedUnit === "peso") {
            const grams = parseWeightGramsInput(weightGrams.value)
            if (grams == null) return null
            return {
                name: name.value.trim(),
                categoryId: categoryId.value!,
                unit: "peso",
                averageWeightGrams: grams,
            }
        }

        return {
            name: name.value.trim(),
            categoryId: categoryId.value!,
            unit: "unit",
            averageWeightGrams: null,
        }
    }

    function resetForm() {
        name.value = ""
        categoryId.value = undefined
        unit.value = "unit"
        weightGrams.value = ""
        weightError.value = ""
    }

    function syncFromWaste(w: WasteListItem) {
        name.value = w.name
        categoryId.value = w.categoryId
        unit.value = normalizeWasteUnit(w.unit)
        weightGrams.value =
            unit.value === "peso" && w.averageWeightGrams != null && w.averageWeightGrams > 0
                ? String(w.averageWeightGrams)
                : ""
        weightError.value = ""
    }

    async function refreshWasteFromApi(id: string) {
        try {
            const item = await fetchWasteItem(id)
            if (!open.value || wasteId.value !== id) return
            syncFromWaste(item)
        } catch {
            toastError(
                "Não foi possível atualizar",
                "Não foi possível obter os dados mais recentes deste resíduo. Podes continuar a editar com os dados da listagem.",
            )
        }
    }

    function bootstrapEdit() {
        const item = initialItem.value
        if (item) {
            syncFromWaste(item)
            return
        }
        const id = wasteId.value
        if (!id) return
        loading.value = true
        void fetchWasteItem(id)
            .then((fetched) => {
                if (!open.value || wasteId.value !== id) return
                syncFromWaste(fetched)
            })
            .catch(() => {
                toastError(
                    "Não foi possível carregar",
                    "Não foi possível obter os dados do resíduo para editar.",
                )
            })
            .finally(() => {
                loading.value = false
            })
    }

    function submit() {
        if (!validateForm()) return
        const draft = buildDraft()
        if (!draft) {
            validateWeight()
            return
        }
        onSubmit(draft)
    }

    watch(
        () => [open.value, mode, wasteId.value, initialItem.value?.id] as const,
        ([isOpen, currentMode]) => {
            if (!isOpen) return
            weightError.value = ""
            if (currentMode === "create") {
                resetForm()
                return
            }
            bootstrapEdit()
            const id = wasteId.value
            if (id && initialItem.value) {
                void refreshWasteFromApi(id)
            }
        },
        { immediate: true },
    )

    watch(weightGrams, () => {
        if (weightError.value) validateWeight()
    })

    watch(unit, (next) => {
        if (normalizeWasteUnit(next) !== "peso") {
            weightGrams.value = ""
            weightError.value = ""
        }
    })

    return {
        name,
        categoryId,
        unit,
        weightGrams,
        weightError,
        loading,
        showCategorySelect,
        canSubmit,
        validateWeight,
        submit,
        syncFromWaste,
        resetForm,
    }
}
