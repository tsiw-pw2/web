<script setup lang="ts">
import type { CampaignDetails, CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"
import { formatDateTimePt } from "@/shared/lib/formatPt"
import Button from "@/shared/components/ui/Button.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import Select from "@/shared/components/ui/select/Select.vue"

defineProps<{
    campaign: CampaignDetails
    wasteCollections: CampaignDetailsWasteCollection[]
    wasteLoading: boolean
    wastePage: number
    wasteTotal: number
    tabPageSize: number
    wasteBeachSelectOptions: { value: string; label: string }[]
    wasteCountValue: number
    wasteCountLabel: string
    canRecordWaste: boolean
    postingWasteCollection: boolean
}>()

const wasteBeachFilter = defineModel<string>("wasteBeachFilter", { required: true })

const emit = defineEmits<{
    openCreateWaste: []
    prevPage: []
    nextPage: []
}>()
</script>

<template>
    <motion id="campaign-panel-recolhas" role="tabpanel" aria-labelledby="campaign-tab-recolhas" class="flex flex-col gap-4">
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Select
                                id="campaign-waste-beach-filter"
                                v-model="wasteBeachFilter"
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
                                    @click="emit('openCreateWaste')"
                                >Registar recolha
							</Button>
                        </div>

                        <div class="text-xs text-neutral-500">{{ wasteCountValue }} {{ wasteCountLabel }}</div>

                        <div v-if="wasteLoading" class="text-sm leading-5 text-neutral-600">A carregar recolhas…</div>

                        <div v-else-if="campaign.metrics.wasteCollectionsCount === 0" class="text-sm leading-5 text-neutral-600">
                            Ainda não há recolhas registadas.
                        </div>

                        <template v-else>
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

                        <ListPaginationBar
                            v-if="wasteTotal > tabPageSize"
                            class="mt-4"
                            :page="wastePage"
                            :page-size="tabPageSize"
                            :total="wasteTotal"
                            @prev="emit('prevPage')"
                            @next="emit('nextPage')"
                        />
                        </template>

    </div>
</template>
