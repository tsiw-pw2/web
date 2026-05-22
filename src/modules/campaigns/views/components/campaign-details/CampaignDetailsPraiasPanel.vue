<script setup lang="ts">
import { computed } from "vue"
import { useCampaignDetailsPageInject } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageInject"
import CampaignBeachesMap from "@/modules/campaigns/views/components/CampaignBeachesMap.vue"

const { core, activeTab } = useCampaignDetailsPageInject()
const campaign = computed(() => core.campaign.value!)
const mapActive = computed(() => activeTab.value === "praias")
</script>

<template>
    <section
        id="campaign-panel-praias"
        role="tabpanel"
        aria-labelledby="campaign-tab-praias"
        class="flex flex-col gap-4"
    >
        <p v-if="campaign.beaches.length === 0" class="text-sm leading-5 text-neutral-600">Sem praias associadas.</p>
        <CampaignBeachesMap v-else-if="mapActive" :beaches="campaign.beaches" />
    </section>
</template>
