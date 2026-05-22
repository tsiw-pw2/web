<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue"
import type { CampaignListItem } from "@/modules/campaigns/types/list"
import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"

const props = defineProps<{
    items: CampaignListItem[]
}>()

const emit = defineEmits<{
    (e: "select", campaignId: string): void
    (e: "edit", campaignId: string): void
    (e: "delete", campaignId: string): void
}>()

const TITLE_FOCUS_DELAY_MS = 400

const focusedRowId = ref<string | null>(null)
const titleHoverRowId = ref<string | null>(null)
let titleFocusTimer: ReturnType<typeof setTimeout> | null = null

function canUseTitleHoverFocus(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

function clearTitleFocusTimer() {
    if (titleFocusTimer != null) {
        clearTimeout(titleFocusTimer)
        titleFocusTimer = null
    }
}

function resetTitleFocusState() {
    clearTitleFocusTimer()
    titleHoverRowId.value = null
    focusedRowId.value = null
}

function isTitleCellOverflowing(cell: EventTarget | null): boolean {
    if (!(cell instanceof HTMLTableCellElement)) return false
    const inner = cell.querySelector(".campaign-list-title-cell__inner")
    if (!(inner instanceof HTMLElement)) return false
    return inner.scrollWidth > inner.clientWidth
}

function onTitleMouseEnter(rowId: string, event: MouseEvent) {
    if (!canUseTitleHoverFocus()) return
    if (!isTitleCellOverflowing(event.currentTarget)) return
    clearTitleFocusTimer()
    titleHoverRowId.value = rowId
    titleFocusTimer = setTimeout(() => {
        if (titleHoverRowId.value === rowId) {
            focusedRowId.value = rowId
        }
    }, TITLE_FOCUS_DELAY_MS)
}

function onTitleMouseLeave(rowId: string) {
    if (focusedRowId.value === rowId) return
    clearTitleFocusTimer()
    if (titleHoverRowId.value === rowId) {
        titleHoverRowId.value = null
    }
}

function onRowMouseLeave() {
    resetTitleFocusState()
}

function onRowClick(id: string) {
    emit("select", id)
}

onBeforeUnmount(() => {
    clearTitleFocusTimer()
})
</script>

<template>
    <DataTableScrollWrap>
        <table class="campaign-list-table w-full min-w-[920px] table-fixed border-collapse text-left">
            <colgroup>
                <col class="w-[26%]" />
                <col class="w-[18%]" />
                <col class="w-[24%]" />
                <col class="w-[11%]" />
                <col class="w-[11%]" />
                <col class="min-w-[7.5rem] w-[10%]" />
            </colgroup>

            <thead class="sticky top-0 z-10 bg-white">
                <tr class="border-b border-neutral-200">
                    <DataTableTh>Título</DataTableTh>
                    <DataTableTh>Município</DataTableTh>
                    <DataTableTh>Praia</DataTableTh>
                    <DataTableTh align="end">Data início</DataTableTh>
                    <DataTableTh align="end">Data fim</DataTableTh>
                    <DataTableTh :padding-end="false" />
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="row in props.items"
                    :key="row.id"
                    class="campaign-list-row relative isolate cursor-pointer border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50"
                    :class="{ 'campaign-list-row--title-focus': focusedRowId === row.id }"
                    @mouseleave="onRowMouseLeave"
                    @click="onRowClick(row.id)"
                >
                    <DataTableTd
                        emphasis
                        :truncate="false"
                        class="campaign-list-title-cell overflow-visible pe-4"
                        @mouseenter="onTitleMouseEnter(row.id, $event)"
                        @mouseleave="onTitleMouseLeave(row.id)"
                    >
                        <span class="campaign-list-title-cell__inner">{{ row.title }}</span>
                    </DataTableTd>
                    <DataTableTd>{{ row.municipality }}</DataTableTd>
                    <DataTableTd>{{ row.beach }}</DataTableTd>
                    <DataTableTd align="end" class="tabular-nums">{{ row.startDate }}</DataTableTd>
                    <DataTableTd align="end" class="tabular-nums">{{ row.endDate }}</DataTableTd>
                    <DataTableActionsCell
                        :row-id="row.id"
                        @edit="(id: string) => emit('edit', id)"
                        @delete="(id: string) => emit('delete', id)"
                    />
                </tr>
            </tbody>
        </table>
    </DataTableScrollWrap>
</template>

<style scoped>
.campaign-list-title-cell__inner {
    display: block;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (hover: hover) and (pointer: fine) {
    .campaign-list-row--title-focus {
        background-color: var(--color-neutral-50);
    }

    .campaign-list-row--title-focus td:not(.campaign-list-title-cell) {
        visibility: hidden;
        pointer-events: none;
    }

    .campaign-list-row--title-focus .campaign-list-title-cell__inner {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 20;
        box-sizing: border-box;
        display: flex;
        height: 2.5rem;
        width: 100%;
        max-width: 100%;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: var(--color-neutral-50);
        padding-right: 1rem;
        font-weight: 500;
    }
}
</style>
