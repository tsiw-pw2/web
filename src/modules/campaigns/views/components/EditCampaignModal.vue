<script setup lang="ts">
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import CampaignUpsertForm from "@/modules/campaigns/views/components/campaign-upsert/CampaignUpsertForm.vue"
import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"

const open = defineModel<boolean>({ required: true })

defineProps<{
    campaign?: CampaignListItem | null
}>()

const emit = defineEmits<{
    save: [payload: CampaignCreateDraft]
}>()
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="edit-campaign-title">
        <div class="flex items-start justify-between gap-4">
            <h3 id="edit-campaign-title" class="text-lg font-semibold leading-7 text-neutral-950">Editar campanha</h3>
            <ModalCloseButton @click="open = false" />
        </div>

        <CampaignUpsertForm
            v-if="open"
            v-model="open"
            mode="edit"
            :campaign="campaign"
            field-prefix="edit-campaign"
            submit-label="Guardar"
            @submit="emit('save', $event)"
        />
    </ModalRoot>
</template>
