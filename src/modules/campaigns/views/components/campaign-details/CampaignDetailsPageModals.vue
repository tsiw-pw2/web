<script setup lang="ts">
import { computed } from "vue"
import { useCampaignDetailsPageInject } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageInject"
import CancelRegistrationModal from "@/modules/campaigns/views/components/CancelRegistrationModal.vue"
import CreateWasteCollectionModal from "@/modules/campaigns/views/components/CreateWasteCollectionModal.vue"
import DeleteRegistrationModal from "@/modules/campaigns/views/components/DeleteRegistrationModal.vue"
import DeleteWasteCollectionModal from "@/modules/campaigns/views/components/DeleteWasteCollectionModal.vue"
import EditRegistrationModal from "@/modules/campaigns/views/components/EditRegistrationModal.vue"

const { core, registration, waste } = useCampaignDetailsPageInject()

const campaign = computed(() => core.campaign.value)

const {
    editRegistrationOpen,
    editRegistrationTarget,
    savingRegistrationId,
    saveEditRegistration,
    cancelRegistrationOpen,
    canceling,
    cancelMyRegistration,
    deleteRegistrationOpen,
    deleteRegistrationTarget,
    deletingRegistrationId,
    confirmDeleteRegistration,
} = registration

const {
    createWasteCollectionOpen,
    onCreateWasteCollection,
    deleteWasteCollectionOpen,
    deleteWasteCollectionSummary,
    deletingWasteCollectionId,
    confirmDeleteWasteCollection,
} = waste
</script>

<template>
    <EditRegistrationModal
        v-model="editRegistrationOpen"
        :registration="editRegistrationTarget"
        :saving="Boolean(savingRegistrationId)"
        @save="saveEditRegistration"
    />
    <CancelRegistrationModal v-model="cancelRegistrationOpen" :busy="canceling" @confirm="cancelMyRegistration" />
    <DeleteRegistrationModal
        v-model="deleteRegistrationOpen"
        :volunteer-name="deleteRegistrationTarget?.user?.name ?? undefined"
        :busy="Boolean(deletingRegistrationId)"
        @confirm="confirmDeleteRegistration"
    />
    <CreateWasteCollectionModal
        v-if="campaign"
        v-model="createWasteCollectionOpen"
        :beaches="campaign.beaches"
        @create="onCreateWasteCollection"
    />
    <DeleteWasteCollectionModal
        v-model="deleteWasteCollectionOpen"
        :summary="deleteWasteCollectionSummary"
        :busy="Boolean(deletingWasteCollectionId)"
        @confirm="confirmDeleteWasteCollection"
    />
</template>
