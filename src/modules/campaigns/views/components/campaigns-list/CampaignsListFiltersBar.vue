<script setup lang="ts">
import type { CampaignStatusKey } from "@/modules/campaigns/lib/campaignStatus"
import { CAMPAIGN_STATUS_SELECT_OPTIONS } from "@/modules/campaigns/lib/campaignStatus"
import FieldClearIcon from "@/shared/components/icons/FieldClearIcon.vue"
import Input from "@/shared/components/ui/Input.vue"
import { FIELD_CLEAR_BUTTON } from "@/shared/components/ui/select/design"
import MultiSelect from "@/shared/components/ui/select/MultiSelect.vue"
import Select from "@/shared/components/ui/select/Select.vue"
const search = defineModel<string>("search", { required: true })
const statuses = defineModel<CampaignStatusKey[]>("statuses", { required: true })
const district = defineModel<string>("district", { required: true })

defineProps<{
    districtOptions: { value: string; label: string }[]
}>()

function clearSearch() {
    search.value = ""
}
</script>

<template>
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <Input
            id="campaigns-filter-search"
            v-model="search"
            class="w-full max-w-full shrink-0 sm:w-[300px]"
            type="search"
            placeholder="Pesquisar por título…"
            left-icon="search"
            autocomplete="off"
        >
            <template v-if="search.trim()" #right>
                <button
                    type="button"
                    :class="FIELD_CLEAR_BUTTON"
                    aria-label="Limpar pesquisa"
                    @mousedown.prevent
                    @click="clearSearch"
                >
                    <FieldClearIcon />
                </button>
            </template>
        </Input>
        <div class="flex min-w-0 flex-col gap-3 sm:flex-row sm:shrink-0 sm:gap-3">
            <MultiSelect
                id="campaigns-filter-status"
                v-model="statuses"
                class="w-full sm:w-[220px]"
                filter-mode
                :options="CAMPAIGN_STATUS_SELECT_OPTIONS"
                placeholder="Estado"
                empty-label="Todos os estados"
                clear-label="Limpar estados"
            />
            <Select
                id="campaigns-filter-district"
                v-model="district"
                class="w-full sm:w-[200px]"
                filter-mode
                :options="districtOptions"
                placeholder="Distrito"
                clear-label="Limpar distrito"
            />
        </div>
    </div>
</template>
