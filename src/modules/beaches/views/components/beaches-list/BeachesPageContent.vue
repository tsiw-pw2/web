<script setup lang="ts">
import type { BeachesViewMode } from "@/modules/beaches/composables/beaches-list/useBeachesViewMode"
import { beachesToMapPoints } from "@/modules/beaches/lib/beachMapPoints"
import type { BeachListItem } from "@/modules/beaches/types/list"
import BeachesEmptyState from "@/modules/beaches/views/states/BeachesEmptyState.vue"
import BeachesErrorState from "@/modules/beaches/views/states/BeachesErrorState.vue"
import BeachesListState from "@/modules/beaches/views/states/BeachesListState.vue"
import BeachesMap from "@/shared/components/BeachesMap.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"
import { computed } from "vue"

const props = defineProps<{
    viewMode: BeachesViewMode
    loading: boolean
    error: boolean
    errorHint: string
    beaches: BeachListItem[]
    mapBeaches: BeachListItem[]
    mapLoading: boolean
    mapError: boolean
    focusBeachId?: string
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
    "update:focusBeachId": [id: string | undefined]
}>()

const mapPoints = computed(() => beachesToMapPoints(props.mapBeaches))
</script>

<template>
    <div v-if="viewMode === 'map'" class="flex min-h-0 flex-1 flex-col">
        <div v-if="mapLoading" class="text-sm leading-5 text-neutral-600">A carregar mapa…</div>
        <BeachesErrorState v-else-if="mapError" :hint="errorHint" @retry="emit('retry')" />
        <p v-else-if="mapPoints.length === 0" class="text-sm leading-5 text-neutral-600">
            Não há praias com localização para mostrar no mapa.
        </p>
        <BeachesMap
            v-else
            :points="mapPoints"
            :focus-beach-id="focusBeachId"
            aria-label="Mapa das praias"
        />
    </div>
    <div v-else-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>
    <BeachesErrorState v-else-if="error" :hint="errorHint" @retry="emit('retry')" />
    <BeachesEmptyState v-else-if="total === 0" @create="emit('create')" />
    <ScrollableTableSection v-else fill-container>
        <BeachesListState :items="beaches" @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
        <template #footer>
            <ListPaginationBar :page="page" :page-size="pageSize" :total="total" @prev="emit('prev')" @next="emit('next')" />
        </template>
    </ScrollableTableSection>
</template>
