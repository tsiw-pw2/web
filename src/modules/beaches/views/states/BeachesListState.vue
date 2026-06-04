<script setup lang="ts">
import type { BeachListItem } from "@/modules/beaches/types/list"
import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import { useCanManageCatalog } from "@/modules/auth/composables/useCanManageCatalog"

const props = defineProps<{
    items: BeachListItem[]
}>()

const { canManage } = useCanManageCatalog()

const emit = defineEmits<{
    (e: "edit", beachId: string): void
    (e: "delete", beachId: string): void
}>()

const districtLabel = Object.fromEntries(DISTRICT_SELECT_OPTIONS.map((o) => [o.value, o.label])) as Record<string, string>

// Obtém a etiqueta legível do distrito.
function labelForDistrict(code: string) {
    return districtLabel[code] ?? code
}

// Formata uma coordenada para exibição.
function formatCoordinate(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return "—"
    const n = Number(trimmed)
    if (!Number.isFinite(n)) return "—"
    return trimmed
}
</script>

<template>
     <DataTableScrollWrap
        >
        <table class="w-full min-w-[880px] table-fixed border-collapse text-left">
            <colgroup>
                <col class="w-[22%]" />
                <col class="w-[18%]" />
                <col class="w-[16%]" />
                <col class="w-[14%]" />
                <col class="w-[14%]" />
                <col v-if="canManage" class="min-w-[7.5rem] w-[16%]" />
            </colgroup>

            <thead class="sticky top-0 z-10 bg-white">

                <tr class="border-b border-neutral-200">
                     <DataTableTh>Nome</DataTableTh>
                     <DataTableTh>Distrito</DataTableTh>
                     <DataTableTh>Concelho</DataTableTh>
                     <DataTableTh align="end">Latitude</DataTableTh>
                     <DataTableTh align="end">Longitude</DataTableTh>
                     <DataTableTh v-if="canManage" :padding-end="false" />
                </tr>

            </thead>

            <tbody>

                <tr v-for="row in props.items" :key="row.id" class="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50">
                     <DataTableTd emphasis>{{ row.name }}</DataTableTd>
                     <DataTableTd>{{ labelForDistrict(row.district) }}</DataTableTd>
                     <DataTableTd>{{ row.municipality }}</DataTableTd>
                     <DataTableTd align="end" class="tabular-nums">{{ formatCoordinate(row.latitude) }}</DataTableTd>
                     <DataTableTd align="end" class="tabular-nums">{{ formatCoordinate(row.longitude) }}</DataTableTd>
                     <DataTableActionsCell
                        v-if="canManage"
                        :row-id="row.id"
                        @edit="(id: string) => emit('edit', id)"
                        @delete="(id: string) => emit('delete', id)"
                     />
                </tr>

            </tbody>

        </table>
         </DataTableScrollWrap
    >
</template>

