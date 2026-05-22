<script setup lang="ts">
import type { WasteListItem } from "@/modules/waste/types/list"
import { labelCategory, labelUnit } from "@/modules/waste/lib/wasteDisplayLabels"
import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"

const props = defineProps<{
    items: WasteListItem[]
}>()

const emit = defineEmits<{
    (e: "edit", wasteId: string): void
    (e: "delete", wasteId: string): void
}>()
</script>

<template>
    <DataTableScrollWrap>
        <table class="w-full min-w-[640px] table-fixed border-collapse text-left">
            <colgroup>
                <col class="w-[40%]" />
                <col class="w-[28%]" />
                <col class="w-[22%]" />
                <col class="min-w-[7.5rem] w-[10%]" />
            </colgroup>

            <thead class="sticky top-0 z-10 bg-white">

                <tr class="border-b border-neutral-200">
                    <DataTableTh>Nome</DataTableTh>
                    <DataTableTh>Categoria</DataTableTh>
                    <DataTableTh align="end">Medida</DataTableTh>
                    <DataTableTh :padding-end="false" />
                </tr>

            </thead>

            <tbody>

                <tr v-for="row in props.items" :key="row.id" class="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50">
                    <DataTableTd emphasis>{{ row.name }}</DataTableTd>
                    <DataTableTd>{{ labelCategory(row.category) }}</DataTableTd>
                    <DataTableTd align="end">{{ labelUnit(row.unit) }}</DataTableTd>
                    <DataTableActionsCell :row-id="row.id" @edit="(id: string) => emit('edit', id)" @delete="(id: string) => emit('delete', id)" />
                </tr>

            </tbody>

        </table>
    </DataTableScrollWrap>
</template>
