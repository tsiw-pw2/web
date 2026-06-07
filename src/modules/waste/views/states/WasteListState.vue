<script setup lang="ts">
import { computed } from "vue"
import type { WasteListItem } from "@/modules/waste/types/list"
import { getLink } from "@/infrastructure/hypermediaClient"
import { normalizeWasteUnit } from "@/modules/waste/lib/wasteDisplayLabels"
import { formatWasteCatalogWeight } from "@/modules/waste/lib/wasteWeightForm"
import { wasteCategoryTableBadge, wasteUnitTableBadge } from "@/shared/lib/tableValueBadge"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
import { useCanManageCatalog } from "@/modules/auth/composables/useCanManageCatalog"

const props = defineProps<{
    items: WasteListItem[]
}>()

const { canManage } = useCanManageCatalog()

const showActionsColumn = computed(() => canManage.value && props.items.some((row) => getLink(row, "update")))

// Indica se a linha permite editar ou eliminar.
function rowCanManage(row: WasteListItem) {
    return canManage.value && Boolean(getLink(row, "update"))
}

const emit = defineEmits<{
    (e: "edit", wasteId: string): void
    (e: "delete", wasteId: string): void
}>()

function catalogWeightLabel(row: WasteListItem) {
    return formatWasteCatalogWeight(row.unit, row.averageWeightGrams)
}
</script>

<template>
    <DataTableScrollWrap>
        <table class="w-full min-w-[640px] table-fixed border-collapse text-left">
            <colgroup>
                <col class="w-[40%]" />
                <col class="w-[28%]" />
                <col class="w-[22%]" />
                <col v-if="showActionsColumn" class="min-w-[7.5rem] w-[10%]" />
            </colgroup>

            <thead class="sticky top-0 z-10 bg-white">

                <tr class="border-b border-neutral-200">
                    <DataTableTh>Nome</DataTableTh>
                    <DataTableTh>Categoria</DataTableTh>
                    <DataTableTh align="end">Medida</DataTableTh>
                    <DataTableTh v-if="showActionsColumn" :padding-end="false" />
                </tr>

            </thead>

            <tbody>

                <tr v-for="row in props.items" :key="row.id" class="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50">
                    <DataTableTd emphasis>{{ row.name }}</DataTableTd>
                    <DataTableTd :truncate="false">
                        <ApiStateBadge v-bind="wasteCategoryTableBadge(row.categoryName)" />
                    </DataTableTd>
                    <DataTableTd align="end" :truncate="false">
                        <div class="flex items-center justify-end gap-2">
                            <span
                                v-if="catalogWeightLabel(row)"
                                class="shrink-0 text-sm font-medium leading-5 text-neutral-500 tabular-nums"
                            >
                                {{ catalogWeightLabel(row) }}
                            </span>
                            <ApiStateBadge v-bind="wasteUnitTableBadge(normalizeWasteUnit(row.unit))" />
                        </div>
                    </DataTableTd>
                    <DataTableActionsCell
                        v-if="rowCanManage(row)"
                        :row-id="row.id"
                        @edit="(id: string) => emit('edit', id)"
                        @delete="(id: string) => emit('delete', id)"
                    />
                </tr>

            </tbody>

        </table>
    </DataTableScrollWrap>
</template>
