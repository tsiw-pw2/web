<script setup lang="ts">
import CampaignDetailsTabEmptyState from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsTabEmptyState.vue"
import CommentBubbleIcon from "@/shared/components/icons/CommentBubbleIcon.vue"

defineProps<{
    canPostComment: boolean
}>()
</script>

<template>
    <CampaignDetailsTabEmptyState
        title="Ainda sem comentários"
        :hint="
            canPostComment
                ? 'Usa o campo acima para deixar a primeira nota à equipa sobre esta campanha.'
                : 'Quando alguém publicar, as mensagens aparecem aqui por ordem cronológica.'
        "
    >
        <template #icon>
            <CommentBubbleIcon :size="24" />
        </template>
    </CampaignDetailsTabEmptyState>
</template>
