<script setup lang="ts">
import { computed } from "vue"
import { useCampaignDetailsPageInject } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageInject"
import { formatDateTimePt } from "@/shared/lib/formatPt"
import Button from "@/shared/components/ui/Button.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"
import Select from "@/shared/components/ui/select/Select.vue"

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
} = waste
const { canRecordWaste } = display
const campaign = computed(() => core.campaign.value!)
</script>

<template>
    <div id="campaign-panel-recolhas" role="tabpanel" aria-labelledby="campaign-tab-recolhas" class="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
                        <div class="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Select
                                id="campaign-waste-beach-filter"
                                v-model="wasteBeachSelectValue"
                                class="w-full sm:w-[240px]"
                                :options="wasteBeachSelectOptions"
                                placeholder="Todas as praias"
                            />
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

                        <div class="shrink-0 text-xs text-neutral-500">{{ wasteCountValue }} {{ wasteCountLabel }}</div>

                        <div v-if="wasteLoading" class="text-sm leading-5 text-neutral-600">A carregar recolhas…</div>

                        <div v-else-if="campaign.metrics.wasteCollectionsCount === 0" class="text-sm leading-5 text-neutral-600">
                            Ainda não há recolhas registadas.
                        </div>

                        <ScrollableTableSection v-else fill-container>
                        <div v-if="wasteCollections.length === 0" class="text-sm leading-5 text-neutral-600">
                            Nenhuma recolha nesta praia.
                        </div>

                        <div v-else class="space-y-3">

                            <div v-for="row in wasteCollections" :key="row.id">

                                <div class="flex flex-wrap items-center justify-between gap-2">

                                    <div class="text-sm font-medium text-neutral-950">
                                        {{ row.waste?.name ?? "Resíduo" }} <span class="text-neutral-500">•</span> {{ row.unitQuantity }} un
                                        <span v-if="row.actualWeightKg" class="text-neutral-500">•</span>
                                        <span v-if="row.actualWeightKg">{{ row.actualWeightKg }} kg</span>
                                    </div>

                                    <div class="text-xs text-neutral-500">{{ formatDateTimePt(row.createdAt) }}</div>

                                </div>

                                <div class="mt-1 text-xs leading-5 text-neutral-600">
                                    <span v-if="row.beach?.name">{{ row.beach.name }}</span>
                                    <span v-if="row.recordedBy?.name"> • registado por {{ row.recordedBy.name }}</span>
                                </div>

                            </div>

                        </div>

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
