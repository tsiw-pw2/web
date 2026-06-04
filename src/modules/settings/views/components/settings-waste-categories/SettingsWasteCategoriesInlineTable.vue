<script setup lang="ts">
import { nextTick, ref, watch } from "vue"
import type { ComponentPublicInstance } from "vue"
import type { WasteCategory } from "@/modules/waste/types/wasteCategory"
import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"

const props = defineProps<{
    categories: WasteCategory[]
    isCreating: boolean
    newCategoryName: string
    editingCategoryId: string | null
    editingName: string
    isSaving: boolean
}>()

const emit = defineEmits<{
    "update:newCategoryName": [value: string]
    "update:editingName": [value: string]
    startCreate: []
    startEdit: [category: WasteCategory]
    commitCreate: []
    commitEdit: []
    cancelCreate: []
    cancelEdit: []
    delete: [id: string]
    createKeydown: [event: KeyboardEvent]
    editKeydown: [event: KeyboardEvent]
}>()

const createInputRef = ref<HTMLInputElement | null>(null)
const editInputRef = ref<HTMLInputElement | null>(null)

// Resolve a referência de elemento para HTMLElement.
function resolveElementRef(el: Element | ComponentPublicInstance | null) {
    if (el && "$el" in el) {
        const node = el.$el
        return node instanceof HTMLInputElement ? node : null
    }
    return el instanceof HTMLInputElement ? el : null
}

// Associa a referência do input de criação.
function setCreateInputRef(el: Element | ComponentPublicInstance | null) {
    createInputRef.value = resolveElementRef(el)
}

// Associa a referência do input de edição.
function setEditInputRef(el: Element | ComponentPublicInstance | null) {
    editInputRef.value = resolveElementRef(el)
}

watch(
    () => props.isCreating,
    async (active) => {
        if (!active) return
        await nextTick()
        createInputRef.value?.focus()
    },
)

watch(
    () => props.editingCategoryId,
    async (id) => {
        if (!id) {
            editInputRef.value = null
            return
        }
        await nextTick()
        editInputRef.value?.focus()
    },
)

const inlineInputClass =
    "w-full min-w-0 border-0 bg-transparent p-0 text-sm font-medium leading-5 text-neutral-950 outline-none ring-0 placeholder:text-neutral-400 focus:ring-0"
</script>

<template>
    <DataTableScrollWrap>
        <table class="w-full min-w-[480px] table-fixed border-collapse text-left">
            <colgroup>
                <col class="w-[70%]" />
                <col class="min-w-[7.5rem] w-[30%]" />
            </colgroup>
            <thead class="sticky top-0 z-10 bg-white">
                <tr class="border-b border-neutral-200">
                    <DataTableTh>Nome</DataTableTh>
                    <DataTableTh :padding-end="false" />
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="row in categories"
                    :key="row.id"
                    class="border-b border-neutral-200 hover:bg-neutral-50"
                    :class="editingCategoryId === row.id ? 'bg-neutral-50' : ''"
                >
                    <DataTableTd emphasis :truncate="false">
                        <input
                            v-if="editingCategoryId === row.id"
                            :ref="setEditInputRef"
                            :value="editingName"
                            type="text"
                            :disabled="isSaving"
                            :class="inlineInputClass"
                            placeholder="Nome da categoria"
                            @input="emit('update:editingName', ($event.target as HTMLInputElement).value)"
                            @keydown="emit('editKeydown', $event)"
                            @blur="emit('commitEdit')"
                        />
                        <button
                            v-else
                            type="button"
                            class="w-full truncate text-left outline-none select-none hover:text-neutral-700 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-neutral-300"
                            :disabled="isSaving"
                            @click="emit('startEdit', row)"
                        >
                            {{ row.name }}
                        </button>
                    </DataTableTd>
                    <DataTableActionsCell
                        v-if="editingCategoryId !== row.id"
                        :row-id="row.id"
                        :show-edit="false"
                        @delete="emit('delete', row.id)"
                    />
                    <DataTableTd v-else :padding-end="false" :truncate="false" aria-hidden="true" />
                </tr>

                <tr
                    class="border-b border-neutral-200 last:border-b-0"
                    :class="isCreating ? 'bg-neutral-50' : 'hover:bg-neutral-50'"
                >
                    <DataTableTd :truncate="false" colspan="2">
                        <input
                            v-if="isCreating"
                            :ref="setCreateInputRef"
                            :value="newCategoryName"
                            type="text"
                            :disabled="isSaving"
                            :class="inlineInputClass"
                            placeholder="Nome da categoria"
                            @input="emit('update:newCategoryName', ($event.target as HTMLInputElement).value)"
                            @keydown="emit('createKeydown', $event)"
                            @blur="emit('commitCreate')"
                        />
                        <button
                            v-else
                            type="button"
                            class="flex w-full items-center gap-2 text-left text-sm font-medium leading-5 text-neutral-400 outline-none hover:text-neutral-600 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-neutral-300"
                            :disabled="isSaving"
                            @click="emit('startCreate')"
                        >
                            <span aria-hidden="true" class="text-base leading-none">+</span>
                            <span>Nova categoria</span>
                        </button>
                    </DataTableTd>
                </tr>
            </tbody>
        </table>
    </DataTableScrollWrap>
</template>
