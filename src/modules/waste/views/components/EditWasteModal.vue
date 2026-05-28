<script setup lang="ts">
import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import WasteUpsertForm from "@/modules/waste/views/components/WasteUpsertForm.vue"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    wasteId: string | null
    waste: WasteListItem | null
    categoryOptions: { value: string; label: string }[]
    categoriesLoading: boolean
    categoryCreating: boolean
    isAdmin: boolean
    createCategoryHandler: (name: string) => Promise<string | undefined>
    submitting: boolean
}>()

const emit = defineEmits<{
    save: [payload: WasteUpsertDraft]
}>()

function close() {
    open.value = false
}
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="edit-waste-title">
        <div class="flex items-start justify-between gap-4">
            <h3 id="edit-waste-title" class="text-lg font-semibold leading-7 text-neutral-950">Editar resíduo</h3>
            <ModalCloseButton @click="close" />
        </div>

        <WasteUpsertForm
            v-if="open && props.wasteId"
            :key="props.wasteId"
            v-model="open"
            mode="edit"
            :waste-id="props.wasteId"
            :initial-item="props.waste"
            field-prefix="edit-waste"
            :category-options="props.categoryOptions"
            :categories-loading="props.categoriesLoading"
            :category-creating="props.categoryCreating"
            :is-admin="props.isAdmin"
            :create-category-handler="props.createCategoryHandler"
            :submitting="props.submitting"
            @submit="emit('save', $event)"
            @close="close"
        />
    </ModalRoot>
</template>
