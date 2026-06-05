<script setup lang="ts">
import { computed } from "vue"
import CampaignDetailsTabEmptyState from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsTabEmptyState.vue"
import MobileNavWasteIcon from "@/shared/components/icons/mobile-nav/MobileNavWasteIcon.vue"

const props = defineProps<{
    variant: "none" | "filtered"
    canRecord: boolean
    hasBeaches: boolean
}>()

const emit = defineEmits<{
    record: []
}>()

const title = computed(() =>
    props.variant === "filtered" ? "Nenhuma recolha nesta praia" : "Ainda sem recolhas",
)

const hint = computed(() =>
    props.variant === "filtered"
        ? "Escolhe outra praia no filtro ou regista uma nova recolha para esta praia."
        : "Regista o que foi apanhado em cada praia durante a ação de limpeza.",
)

const showAction = computed(() => props.canRecord && props.hasBeaches)
</script>

<template>
    <CampaignDetailsTabEmptyState
        :title="title"
        :hint="hint"
        :action-label="showAction ? 'Registar recolha' : undefined"
        @action="emit('record')"
    >
        <template #icon>
            <MobileNavWasteIcon :stroke-width="1.5" />
        </template>
    </CampaignDetailsTabEmptyState>
</template>
