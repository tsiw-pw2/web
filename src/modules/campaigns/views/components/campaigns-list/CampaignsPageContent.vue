<script setup lang="ts">
import type { CampaignListItem } from "@/modules/campaigns/types/list"
import CampaignsEmptyState from "@/modules/campaigns/views/states/CampaignsEmptyState.vue"
import CampaignsFilteredEmptyState from "@/modules/campaigns/views/states/CampaignsFilteredEmptyState.vue"
import CampaignsErrorState from "@/modules/campaigns/views/states/CampaignsErrorState.vue"
import CampaignsListState from "@/modules/campaigns/views/states/CampaignsListState.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"

defineProps<{
    loading: boolean
    error: boolean
    errorHint: string
    campaigns: CampaignListItem[]
    page: number
    pageSize: number
    total: number
    hasActiveFilters: boolean
}>()

const emit = defineEmits<{
    retry: []
    create: []
    clearFilters: []
    select: [id: string]
    edit: [id: string]
    delete: [id: string]
    prev: []
    next: []
}>()
</script>

<template>
    <div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>
    <CampaignsErrorState v-else-if="error" :hint="errorHint" @retry="emit('retry')" />
    <CampaignsFilteredEmptyState
        v-else-if="total === 0 && hasActiveFilters"
        @clear-filters="emit('clearFilters')"
    />
    <CampaignsEmptyState v-else-if="total === 0" @create="emit('create')" />
    <div v-else class="flex min-h-0 flex-1 flex-col">
    <ScrollableTableSection fill-container>
        <CampaignsListState
            :items="campaigns"
            @select="emit('select', $event)"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
        />
        <template #footer>
            <ListPaginationBar :page="page" :page-size="pageSize" :total="total" @prev="emit('prev')" @next="emit('next')" />
        </template>
    </ScrollableTableSection>
    </div>
</template>
