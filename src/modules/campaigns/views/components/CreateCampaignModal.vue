<script setup lang="ts">
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import CampaignUpsertForm from "@/modules/campaigns/views/components/campaign-upsert/CampaignUpsertForm.vue"
import type { CampaignCreateDraft } from "@/modules/campaigns/types/list"

const open = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    create: [payload: CampaignCreateDraft]
}>()
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="create-campaign-modal-title">
        <div class="flex items-start justify-between gap-4">
            <h3 id="create-campaign-modal-title" class="text-lg font-semibold leading-7 text-neutral-950">Criar Campanha</h3>
            <ModalCloseButton @click="open = false" />
        </div>

        <CampaignUpsertForm
            v-if="open"
            v-model="open"
            mode="create"
            field-prefix="create-campaign"
            submit-label="Criar campanha"
            @submit="emit('create', $event)"
        />
    </ModalRoot>
</template>
