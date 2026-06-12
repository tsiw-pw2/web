<script setup lang="ts">
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import { formatHomeCampaignDate } from "@/modules/home/lib/formatHomeCampaignDate"
import type { PublicActiveCampaign } from "@/modules/campaigns/services/campaigns/fetchPublicActiveCampaigns"
import Button from "@/shared/components/ui/Button.vue"

defineProps<{
    campaigns: PublicActiveCampaign[]
}>()
</script>

<template>
    <div class="grid gap-4 sm:grid-cols-2">
        <article
            v-for="campaign in campaigns"
            :key="campaign.id"
            class="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
        >
            <h3 class="text-base font-semibold text-neutral-950">{{ campaign.title }}</h3>
            <p class="mt-1 text-sm text-neutral-600">{{ campaign.organizationName }}</p>
            <p class="mt-2 text-sm text-neutral-700">
                {{ formatHomeCampaignDate(campaign.startDate) }}
                <span v-if="campaign.beaches.length > 0">
                    · {{ campaign.beaches.map((b) => b.name).join(", ") }}
                </span>
            </p>
            <RouterLink
                class="mt-4 inline-flex"
                :to="{ path: routePaths.login, query: { redirect: `/campanhas/${campaign.id}/informacoes` } }"
            >
                <Button variant="secondary">Inscrever — iniciar sessão</Button>
            </RouterLink>
        </article>
    </div>
</template>
