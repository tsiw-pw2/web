<script setup lang="ts">
import type { WasteListItem } from "@/modules/waste/types/list"
import WasteEmptyState from "@/modules/waste/views/states/WasteEmptyState.vue"
import WasteFilteredEmptyState from "@/modules/waste/views/states/WasteFilteredEmptyState.vue"
import WasteErrorState from "@/modules/waste/views/states/WasteErrorState.vue"
import WasteListState from "@/modules/waste/views/states/WasteListState.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"

defineProps<{
    loading: boolean
    error: boolean
    errorHint: string
    items: WasteListItem[]
    page: number
    pageSize: number
    total: number
    hasActiveFilters: boolean
}>()

const emit = defineEmits<{
    retry: []
    create: []
    clearFilters: []
    edit: [id: string]
    delete: [id: string]
    prev: []
    next: []
}>()
</script>

<template>
    <div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>
    <WasteErrorState v-else-if="error" :hint="errorHint" @retry="emit('retry')" />
    <WasteFilteredEmptyState
        v-else-if="total === 0 && hasActiveFilters"
        @clear-filters="emit('clearFilters')"
    />
    <WasteEmptyState v-else-if="total === 0" @create="emit('create')" />
    <div v-else class="flex min-h-0 flex-1 flex-col">
    <ScrollableTableSection fill-container>
        <WasteListState :items="items" @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
        <template #footer>
            <ListPaginationBar :page="page" :page-size="pageSize" :total="total" @prev="emit('prev')" @next="emit('next')" />
        </template>
    </ScrollableTableSection>
    </div>
</template>
