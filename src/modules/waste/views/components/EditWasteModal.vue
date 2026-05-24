<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue"
import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import { normalizeWasteUnit } from "@/modules/waste/lib/wasteDisplayLabels"
import { isWeightGramsInputValid, parseWeightGramsInput } from "@/modules/waste/lib/wasteWeightForm"
import { toastError } from "@/infrastructure/appToast"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import SearchableSelect from "@/shared/components/ui/searchable-select/SearchableSelect.vue"
import Select from "@/shared/components/ui/select/Select.vue"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    waste: WasteListItem | null
    categoryOptions: { value: string; label: string }[]
    categoriesLoading: boolean
    categoryCreating: boolean
    isAdmin: boolean
    unitOptions: { value: string; label: string }[]
    onCreateCategory: (name: string) => Promise<string | undefined>
}>()

const emit = defineEmits<{
    save: [payload: WasteUpsertDraft]
}>()

function close() {
    open.value = false
}

const name = ref("")
const categoryId = ref<string | undefined>(undefined)
const unit = ref<string | undefined>(undefined)
const weightGrams = ref("")
const skipWeightReset = ref(false)

const showWeightField = computed(() => unit.value === "peso")

const showCategorySelect = computed(() => {
    if (props.categoriesLoading) return false
    if (props.categoryOptions.length > 0) return true
    return props.isAdmin
})

const formReady = computed(() => {
    if (name.value.trim().length === 0) return false
    if (!categoryId.value || !unit.value) return false
    if (props.categoriesLoading || props.categoryCreating) return false
    if (!props.isAdmin && props.categoryOptions.length === 0) return false
    return true
})

function resolveAverageWeightGrams(): number | null {
    if (unit.value !== "peso") return null
    return parseWeightGramsInput(weightGrams.value)
}

async function syncFromWaste() {
    const w = props.waste
    if (!w) return
    skipWeightReset.value = true
    name.value = w.name
    categoryId.value = w.categoryId
    const normalizedUnit = normalizeWasteUnit(w.unit)
    unit.value = normalizedUnit
    weightGrams.value =
        normalizedUnit === "peso" && w.averageWeightGrams != null && w.averageWeightGrams > 0
            ? String(w.averageWeightGrams)
            : ""
    await nextTick()
    skipWeightReset.value = false
}

function onProceed() {
    if (!formReady.value) return

    if (unit.value === "peso") {
        if (!isWeightGramsInputValid(weightGrams.value)) {
            toastError("Indica o peso", "Introduz um valor em gramas (mínimo 1 g).")
            return
        }
    }

    emit("save", {
        name: name.value.trim(),
        categoryId: categoryId.value!,
        unit: unit.value!,
        averageWeightGrams: resolveAverageWeightGrams(),
    })
}

async function onCreateCategory(name: string) {
    const id = await props.onCreateCategory(name)
    if (id) categoryId.value = id
}

watch(unit, (next) => {
    if (skipWeightReset.value) return
    if (next !== "peso") weightGrams.value = ""
})

watch(
    () => [open.value, props.waste] as const,
    ([isOpen]) => {
        if (isOpen) void syncFromWaste()
    },
    { immediate: true },
)
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="edit-waste-title">
        <div class="flex items-start justify-between gap-4">
            <h3 id="edit-waste-title" class="text-lg font-semibold leading-7 text-neutral-950">Editar resíduo</h3>
            <ModalCloseButton @click="close" />
        </div>

        <form class="flex flex-col gap-3" novalidate @submit.prevent="onProceed">
            <div class="flex flex-col gap-1">
                <FieldLabel required :for="`edit-waste-name-${waste?.id ?? ''}`">Nome</FieldLabel>
                <Input
                    :id="`edit-waste-name-${waste?.id ?? ''}`"
                    v-model="name"
                    class="w-full"
                    placeholder="Ex.: garrafas, redes de pesca…"
                />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel required>Categoria</FieldLabel>
                <p v-if="categoriesLoading" class="text-sm text-neutral-500">A carregar categorias…</p>
                <SearchableSelect
                    v-else-if="showCategorySelect"
                    v-model="categoryId"
                    class="w-full"
                    :options="categoryOptions"
                    placeholder="Tipo de material"
                    :creatable="isAdmin"
                    :creating="categoryCreating"
                    @create-option="onCreateCategory"
                />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel required>Unidade</FieldLabel>
                <Select v-model="unit" class="w-full" :options="unitOptions" placeholder="Como medir" />
            </div>

            <div v-if="showWeightField" class="flex flex-col gap-1">
                <FieldLabel required :for="`edit-waste-weight-grams-${waste?.id ?? ''}`">Peso (g)</FieldLabel>
                <Input
                    :id="`edit-waste-weight-grams-${waste?.id ?? ''}`"
                    v-model="weightGrams"
                    type="number"
                    min="1"
                    step="1"
                    class="w-full"
                    placeholder="Ex.: 250"
                />
            </div>

            <div class="mt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" :disabled="!formReady">Guardar</Button>
            </div>
        </form>
    </ModalRoot>
</template>
