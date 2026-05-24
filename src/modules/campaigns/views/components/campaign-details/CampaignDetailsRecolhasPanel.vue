<script setup lang="ts">
import { computed } from "vue"
import { useCampaignDetailsPageInject } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageInject"
import Button from "@/shared/components/ui/Button.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"
import CampaignDetailsRecolhasEmptyState from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsRecolhasEmptyState.vue"
import CampaignDetailsRecolhasTable from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsRecolhasTable.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import type { CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"

const { core, tabs, display, waste } = useCampaignDetailsPageInject()
const {
    wasteCollections,
    wasteLoading,
    wastePage,
    wasteTotal,
    tabPageSize,
    goWastePrev,
    goWasteNext,
} = tabs
const {
    wasteBeachSelectValue,
    wasteBeachSelectOptions,
    wasteCountLabel,
    wasteCountValue,
    createWasteCollectionOpen,
    postingWasteCollection,
    openDeleteWasteCollection,
} = waste
const { canRecordWaste, canDeleteWasteRow } = display
const campaign = computed(() => core.campaign.value!)

function onDeleteWasteRow(row: CampaignDetailsWasteCollection) {
    openDeleteWasteCollection(row)
}
</script>

<template>
    <div id="campaign-panel-recolhas" role="tabpanel" aria-labelledby="campaign-tab-recolhas" class="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
                        <div class="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                                <Select
                                    id="campaign-waste-beach-filter"
                                    v-model="wasteBeachSelectValue"
                                    class="ml-px w-full sm:w-[240px]"
                                    :options="wasteBeachSelectOptions"
                                    placeholder="Todas as praias"
                                />
                                <p class="text-sm leading-5 text-neutral-500">
                                    <span class="font-medium tabular-nums text-neutral-950">{{ wasteCountValue }}</span>
                                    {{ wasteCountLabel }}
                                </p>
                            </div>
							<Button
                                    v-if="canRecordWaste && campaign.beaches.length > 0"
                                    type="button"
                                    variant="primary"
                                    class="touch-manipulation"
                                    :disabled="postingWasteCollection"
                                    :busy="postingWasteCollection"
                                    @click="createWasteCollectionOpen = true"
                                >Registar recolha
							</Button>
                        </div>

                        <div v-if="wasteLoading" class="text-sm leading-5 text-neutral-600">A carregar recolhas…</div>

                        <CampaignDetailsRecolhasEmptyState
                            v-else-if="campaign.metrics.wasteCollectionsCount === 0"
                            variant="none"
                            :can-record="canRecordWaste"
                            :has-beaches="campaign.beaches.length > 0"
                            @record="createWasteCollectionOpen = true"
                        />

                        <ScrollableTableSection v-else fill-container>
                        <CampaignDetailsRecolhasEmptyState
                            v-if="wasteCollections.length === 0"
                            variant="filtered"
                            :can-record="canRecordWaste"
                            :has-beaches="campaign.beaches.length > 0"
                            @record="createWasteCollectionOpen = true"
                        />

                        <CampaignDetailsRecolhasTable
                            v-else
                            :rows="wasteCollections"
                            :can-delete-row="canDeleteWasteRow"
                            @delete="onDeleteWasteRow"
                        />

                        <template #footer>
                        <ListPaginationBar
                            v-if="wasteTotal > tabPageSize"
                            :page="wastePage"
                            :page-size="tabPageSize"
                            :total="wasteTotal"
                            @prev="goWastePrev"
                            @next="goWasteNext"
                        />
                        </template>
                        </ScrollableTableSection>

    </div>
</template>
