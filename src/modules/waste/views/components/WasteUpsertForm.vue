<script setup lang="ts">
import { toRef } from "vue"
import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import { useWasteUpsertForm } from "@/modules/waste/composables/useWasteUpsertForm"
import { unitOptions } from "@/modules/waste/lib/wasteDisplayLabels"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import SearchableSelect from "@/shared/components/ui/searchable-select/SearchableSelect.vue"
import Select from "@/shared/components/ui/select/Select.vue"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    mode: "create" | "edit"
    wasteId?: string | null
    initialItem?: WasteListItem | null
    categoryOptions: { value: string; label: string }[]
    categoriesLoading: boolean
    categoryCreating: boolean
    isAdmin: boolean
    createCategoryHandler: (name: string) => Promise<string | undefined>
    submitting: boolean
    fieldPrefix: string
}>()

const emit = defineEmits<{
    submit: [payload: WasteUpsertDraft]
    close: []
}>()

const wasteIdRef = toRef(props, "wasteId")
const initialItemRef = toRef(props, "initialItem")
const categoriesLoadingRef = toRef(props, "categoriesLoading")
const categoryCreatingRef = toRef(props, "categoryCreating")
const isAdminRef = toRef(props, "isAdmin")
const categoryOptionsRef = toRef(props, "categoryOptions")
const submittingRef = toRef(props, "submitting")

const {
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
} = useWasteUpsertForm(
    open,
    props.mode,
    wasteIdRef,
    initialItemRef,
    {
        categoriesLoading: categoriesLoadingRef,
        categoryCreating: categoryCreatingRef,
        isAdmin: isAdminRef,
        categoryOptions: categoryOptionsRef,
        submitting: submittingRef,
    },
    (payload) => emit("submit", payload),
)

async function onCreateCategory(categoryName: string) {
    const id = await props.createCategoryHandler(categoryName)
    if (id) categoryId.value = id
}
</script>

<template>
    <form class="flex flex-col gap-3" novalidate @submit.prevent="submit">
        <p v-if="loading" class="text-sm text-neutral-500">A carregar resíduo…</p>

        <template v-else>
            <div class="flex flex-col gap-1">
                <FieldLabel required :for="`${props.fieldPrefix}-name`">Nome</FieldLabel>
                <Input
                    :id="`${props.fieldPrefix}-name`"
                    v-model="name"
                    class="w-full"
                    placeholder="Ex.: garrafas, redes de pesca…"
                />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel required>Categoria</FieldLabel>
                <p v-if="props.categoriesLoading" class="text-sm text-neutral-500">A carregar categorias…</p>
                <p v-else-if="!props.isAdmin && props.categoryOptions.length === 0" class="text-sm text-neutral-500">
                    Ainda não há categorias. Pede a um administrador para as criar ao registar um resíduo.
                </p>
                <SearchableSelect
                    v-else-if="showCategorySelect"
                    v-model="categoryId"
                    class="w-full"
                    :options="props.categoryOptions"
                    placeholder="Tipo de material"
                    :creatable="props.isAdmin"
                    :creating="props.categoryCreating"
                    @create-option="onCreateCategory"
                />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel required>Unidade</FieldLabel>
                <Select
                    v-model="unit"
                    class="w-full"
                    :options="[...unitOptions]"
                    placeholder="Como medir este resíduo"
                />
            </div>

            <div v-if="unit === 'peso'" class="flex flex-col gap-1">
                <FieldLabel :for="`${props.fieldPrefix}-weight-grams`" required>Peso (g)</FieldLabel>
                <Input
                    :id="`${props.fieldPrefix}-weight-grams`"
                    v-model="weightGrams"
                    type="number"
                    min="1"
                    step="1"
                    class="w-full"
                    placeholder="Ex.: 250"
                    :aria-invalid="weightError ? true : undefined"
                    :aria-describedby="weightError ? `${props.fieldPrefix}-weight-error` : undefined"
                    @blur="validateWeight"
                />
                <p v-if="weightError" :id="`${props.fieldPrefix}-weight-error`" class="text-xs leading-4 text-red-600" role="alert">
                    {{ weightError }}
                </p>
            </div>

            <div class="mt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" :disabled="props.submitting" @click="emit('close')">
                    Cancelar
                </Button>
                <Button type="submit" :disabled="!canSubmit || props.submitting">
                    {{ props.submitting ? "A guardar…" : "Guardar" }}
                </Button>
            </div>
        </template>
    </form>
</template>
