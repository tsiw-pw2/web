<script setup lang="ts">
import type { WasteUnitKey } from "@/modules/waste/types/list"
import FieldClearIcon from "@/shared/components/icons/FieldClearIcon.vue"
import Input from "@/shared/components/ui/Input.vue"
import { FIELD_CLEAR_BUTTON } from "@/shared/components/ui/select/design"
import MultiSelect from "@/shared/components/ui/select/MultiSelect.vue"

defineProps<{
    categoryOptions: { value: string; label: string }[]
}>()

const search = defineModel<string>("search", { required: true })
defineModel<WasteUnitKey[]>("units", { required: true })
const categories = defineModel<string[]>("categories", { required: true })

function clearSearch() {
    search.value = ""
}
</script>

<template>
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <Input
            id="waste-filter-search"
            v-model="search"
            class="w-full max-w-full shrink-0 sm:w-[300px]"
            type="search"
            placeholder="Pesquisar por nome…"
            left-icon="search"
            autocomplete="off"
        >
            <template v-if="search.trim()" #right>
                <button
                    type="button"
                    :class="FIELD_CLEAR_BUTTON"
                    aria-label="Limpar pesquisa"
                    @mousedown.prevent
                    @click="clearSearch"
                >
                    <FieldClearIcon />
                </button>
            </template>
        </Input>
        <div class="flex min-w-0 flex-col gap-3 sm:flex-row sm:shrink-0 sm:gap-3">
            <MultiSelect
                id="waste-filter-category"
                v-model="categories"
                class="w-full sm:w-[220px]"
                filter-mode
                :options="categoryOptions"
                placeholder="Categoria"
                empty-label="Todas as categorias"
                clear-label="Limpar categorias"
            />
        </div>
    </div>
</template>
