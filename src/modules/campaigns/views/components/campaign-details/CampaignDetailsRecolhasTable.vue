<script setup lang="ts">
import { computed } from "vue"
import type { CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"
import { formatRecolhaWeightGrams } from "@/modules/campaigns/lib/recolhaDisplay"
import { formatDateTimePt } from "@/shared/lib/formatPt"
import DataTableActionButton from "@/shared/components/data-table/DataTableActionButton.vue"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
import TrashBucketIcon from "@/shared/components/icons/TrashBucketIcon.vue"

const props = defineProps<{
    rows: CampaignDetailsWasteCollection[]
    canDeleteRow: (row: CampaignDetailsWasteCollection) => boolean
}>()

const emit = defineEmits<{
    delete: [row: CampaignDetailsWasteCollection]
}>()

const showActionsColumn = computed(() => props.rows.some((row) => props.canDeleteRow(row)))

function weightGrams(row: CampaignDetailsWasteCollection) {
    return formatRecolhaWeightGrams(row.actualWeightKg, row.estimatedWeightKg)
}

function onDeleteRow(row: CampaignDetailsWasteCollection) {
    emit("delete", row)
}
</script>

<template>
    <DataTableScrollWrap class="mt-0">
        <table
            class="w-full min-w-[880px] table-fixed border-collapse text-left"
            :class="showActionsColumn ? 'min-w-[920px]' : ''"
        >
            <colgroup>
                <col :class="showActionsColumn ? 'w-[20%]' : 'w-[22%]'" />
                <col class="w-[8%]" />
                <col class="w-[10%]" />
                <col class="w-[18%]" />
                <col class="w-[18%]" />
                <col class="w-[11rem]" />
                <col v-if="showActionsColumn" class="w-10" />
            </colgroup>
            <thead class="sticky top-0 z-10 bg-white">
                <tr class="border-b border-neutral-200">
                    <DataTableTh>Resíduo</DataTableTh>
                    <DataTableTh align="end">Unidade</DataTableTh>
                    <DataTableTh align="end">Peso (g)</DataTableTh>
                    <DataTableTh>Praia</DataTableTh>
                    <DataTableTh>Registado por</DataTableTh>
                    <DataTableTh class="whitespace-nowrap">Data</DataTableTh>
                    <DataTableTh v-if="showActionsColumn" :padding-end="false" align="end" class="w-10 px-1">
                        <span class="sr-only">Apagar recolha</span>
                    </DataTableTh>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="row in rows"
                    :key="row.id"
                    class="border-b border-neutral-200 last:border-b-0"
                >
                    <DataTableTd emphasis>{{ row.waste?.name ?? "Resíduo" }}</DataTableTd>
                    <DataTableTd align="end" class="tabular-nums">{{ row.unitQuantity }}</DataTableTd>
                    <DataTableTd align="end" class="tabular-nums" :class="weightGrams(row)?.isEstimated ? 'text-neutral-600' : ''">
                        {{ weightGrams(row)?.text ?? "-" }}
                    </DataTableTd>
                    <DataTableTd>{{ row.beach?.name ?? "-" }}</DataTableTd>
                    <DataTableTd>{{ row.recordedBy?.name ?? "-" }}</DataTableTd>
                    <DataTableTd :truncate="false" class="whitespace-nowrap tabular-nums">
                        {{ formatDateTimePt(row.createdAt) }}
                    </DataTableTd>
                    <td v-if="showActionsColumn" class="h-10 w-10 px-1 py-0 align-middle">
                        <div class="flex h-10 items-center justify-end">
                            <DataTableActionButton
                                v-if="canDeleteRow(row)"
                                variant="delete"
                                ariaLabel="Apagar recolha"
                                @click="onDeleteRow(row)"
                            >
                                <TrashBucketIcon />
                            </DataTableActionButton>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </DataTableScrollWrap>
</template>
