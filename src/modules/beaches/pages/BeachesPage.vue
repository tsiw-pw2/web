<script setup lang="ts">
import { useCanManageCatalog } from "@/modules/auth/composables/useCanManageCatalog"
import { useBeachesPageState } from "@/modules/beaches/composables/beaches-list/useBeachesPageState"
import { useBeachesViewMode } from "@/modules/beaches/composables/beaches-list/useBeachesViewMode"
import { areBeachCoordinatesValid } from "@/modules/beaches/lib/beachCoordinates"
import { beachMapSelectLabel } from "@/modules/beaches/lib/beachMapPoints"
import BeachesPageContent from "@/modules/beaches/views/components/beaches-list/BeachesPageContent.vue"
import BeachesPageHeader from "@/modules/beaches/views/components/beaches-list/BeachesPageHeader.vue"
import BeachesPageModals from "@/modules/beaches/views/components/beaches-list/BeachesPageModals.vue"
import type { BeachUpsertDraft } from "@/modules/beaches/types/list"
import AnimatedTabBar from "@/shared/components/ui/tabs/AnimatedTabBar.vue"
import AnimatedTabTrigger from "@/shared/components/ui/tabs/AnimatedTabTrigger.vue"
import SearchableSelect from "@/shared/components/ui/searchable-select/SearchableSelect.vue"
import { computed } from "vue"

const page = useBeachesPageState()
const beachesView = useBeachesViewMode()
const { viewMode, mapBeaches, mapLoading, mapError, focusBeachId, focusBeachOnMap, setViewMode, reloadMap } =
    beachesView
const { canManage } = useCanManageCatalog()

const {
    loading,
    error,
    errorHint,
    beaches,
    page: currentPage,
    pageSize,
    total,
    reload,
    goToPrevPage,
    goToNextPage,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    editBeachId,
    beachForEdit,
    deleteBeachName,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    createBeachWithToast,
    saveBeachWithToast,
    confirmDeleteBeach,
    removeBeach,
} = page

const mapBeachSelectOptions = computed(() =>
    mapBeaches.value
        .filter((beach) => areBeachCoordinatesValid(beach.latitude, beach.longitude))
        .map((beach) => ({
            value: beach.id,
            label: beachMapSelectLabel(beach),
        })),
)

const mapBeachPicker = computed({
    get: () => focusBeachId.value,
    set: (id: string | undefined) => focusBeachOnMap(id),
})
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col gap-6">
        <div class="relative z-20 flex shrink-0 flex-col gap-4">
            <BeachesPageHeader @create="openCreateModal">
                <template #actions>
                    <SearchableSelect
                        v-if="viewMode === 'map' && mapBeachSelectOptions.length > 0"
                        id="beaches-map-focus"
                        v-model="mapBeachPicker"
                        class="w-full shrink-0 sm:w-[280px]"
                        filter-mode
                        :options="mapBeachSelectOptions"
                        placeholder="Ir para uma praia…"
                        clear-label="Limpar seleção"
                    />
                </template>
            </BeachesPageHeader>
            <AnimatedTabBar ariaLabel="Vista de praias" class="min-w-0 px-px">
                <AnimatedTabTrigger
                    id="beaches-tab-list"
                    role="tab"
                    type="button"
                    :active="viewMode === 'list'"
                    @click="setViewMode('list')"
                >
                    Lista
                </AnimatedTabTrigger>
                <AnimatedTabTrigger
                    id="beaches-tab-map"
                    role="tab"
                    type="button"
                    :active="viewMode === 'map'"
                    @click="setViewMode('map')"
                >
                    Mapa
                </AnimatedTabTrigger>
            </AnimatedTabBar>
        </div>
        <div class="relative z-0 flex min-h-0 flex-1 flex-col">
            <BeachesPageContent
                :view-mode="viewMode"
                :loading="loading"
                :error="error"
                :error-hint="errorHint"
                :beaches="beaches"
                :map-beaches="mapBeaches"
                :map-loading="mapLoading"
                :map-error="mapError"
                :focus-beach-id="focusBeachId"
                :page="currentPage"
                :page-size="pageSize"
                :total="total"
                @retry="viewMode === 'map' ? reloadMap() : reload()"
                @create="openCreateModal"
                @edit="openEditModal"
                @delete="openDeleteModal"
                @prev="goToPrevPage"
                @next="goToNextPage"
                @update:focus-beach-id="focusBeachOnMap"
            />
        </div>
    </div>
    <BeachesPageModals
        v-if="canManage"
        v-model:is-create-modal-open="isCreateModalOpen"
        v-model:is-edit-modal-open="isEditModalOpen"
        v-model:is-delete-modal-open="isDeleteModalOpen"
        :beach-for-edit="beachForEdit"
        :delete-beach-name="deleteBeachName"
        @create="createBeachWithToast"
        @save="(payload: BeachUpsertDraft) => editBeachId && saveBeachWithToast(editBeachId, payload)"
        @confirm-delete="() => confirmDeleteBeach(removeBeach)"
    />
</template>
