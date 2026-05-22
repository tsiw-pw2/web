<script setup lang="ts">
import type { BeachListItem } from "@/modules/beaches/types/list"
import BeachesEmptyState from "@/modules/beaches/views/states/BeachesEmptyState.vue"
import BeachesErrorState from "@/modules/beaches/views/states/BeachesErrorState.vue"
import BeachesListState from "@/modules/beaches/views/states/BeachesListState.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"

defineProps<{
    loading: boolean
    error: boolean
    beaches: BeachListItem[]
    page: number
    pageSize: number
    total: number
}>()

const emit = defineEmits<{
    retry: []
    create: []
    edit: [id: string]
    delete: [id: string]
    prev: []
    next: []
}>()
</script>

<template>
    <div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>
    <BeachesErrorState v-else-if="error" @retry="emit('retry')" />
    <BeachesEmptyState v-else-if="total === 0" @create="emit('create')" />
    <ScrollableTableSection v-else fill-container>
        <BeachesListState :items="beaches" @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
        <template #footer>
            <ListPaginationBar :page="page" :page-size="pageSize" :total="total" @prev="emit('prev')" @next="emit('next')" />
        </template>
    </ScrollableTableSection>
</template>
