<script setup lang="ts">
import CampaignDetailsTabEmptyState from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsTabEmptyState.vue"
import DashboardVolunteerIcon from "@/shared/components/icons/dashboard/DashboardVolunteerIcon.vue"

defineProps<{
    canManageRegistrations: boolean
}>()
</script>

<template>
    <CampaignDetailsTabEmptyState
        title="Ainda sem voluntários"
        :hint="
            canManageRegistrations
                ? 'Quando houver inscrições, os nomes e contactos aparecem aqui. Partilha a campanha para mobilizar equipas.'
                : 'Quando alguém se inscrever nesta campanha, o nome aparece nesta lista.'
        "
    >
        <template #icon>
            <DashboardVolunteerIcon :size="24" />
        </template>
    </CampaignDetailsTabEmptyState>
</template>
