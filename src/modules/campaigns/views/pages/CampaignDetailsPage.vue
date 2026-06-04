<script setup lang="ts">import { computed, provide } from "vue"

import { campaignDetailsPageKey } from "@/modules/campaigns/composables/campaign-details/campaignDetailsPageContext"
import { useCampaignDetailsPageState } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageState"
import { CAMPAIGN_DETAILS_TAB_CONFIG } from "@/modules/campaigns/lib/campaignDetailsTabConfig"
import { useDocumentTitle } from "@/shared/composables/useDocumentTitle"
import CampaignDetailsComentariosPanel from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsComentariosPanel.vue"
import CampaignDetailsInformacoesPanel from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsInformacoesPanel.vue"
import CampaignDetailsPageModals from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsPageModals.vue"
import CampaignDetailsPraiasPanel from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsPraiasPanel.vue"
import CampaignDetailsRecolhasPanel from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsRecolhasPanel.vue"
import CampaignDetailsVoluntariosPanel from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsVoluntariosPanel.vue"
import { formatDatePt } from "@/shared/lib/formatPt"
import ResourceErrorState from "@/shared/components/states/ResourceErrorState.vue"
import AnimatedTabBar from "@/shared/components/ui/tabs/AnimatedTabBar.vue"
import AnimatedTabTrigger from "@/shared/components/ui/tabs/AnimatedTabTrigger.vue"
import Button from "@/shared/components/ui/Button.vue"

const pageState = useCampaignDetailsPageState()
provide(campaignDetailsPageKey, pageState)

const { activeTab, core, display } = pageState
const { loading, error, campaign, visibleTabs, tabRoute, goBack, load } = core
const { statusUi } = display

const campaignDateRange = computed(() => {
    const c = campaign.value
    if (!c) return ""
    return `${formatDatePt(c.startDate)} — ${formatDatePt(c.endDate)}`
})

const tabPanelFillsHeight = computed(
    () => activeTab.value === "voluntarios" || activeTab.value === "recolhas" || activeTab.value === "comentarios",
)

const isInformacoesTab = computed(() => activeTab.value === "informacoes")

const browserTitle = computed(() => {
    const name = campaign.value?.title?.trim() || "Campanha"
    const tab = CAMPAIGN_DETAILS_TAB_CONFIG.find((t) => t.id === activeTab.value)?.label
    return tab ? `${name} — ${tab}` : name
})

useDocumentTitle(browserTitle)
</script>

<template>
    <div
        class="flex min-h-0 flex-1 flex-col gap-6"
        :class="isInformacoesTab ? 'overflow-hidden' : 'overflow-y-auto overscroll-none'"
    >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div class="min-w-0 flex-1">
                <h2 class="truncate text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">
                    {{ campaign?.title ?? "Campanha" }}
                </h2>
                <div v-if="campaign" class="mt-1 flex flex-wrap items-center gap-2 text-sm leading-5 text-neutral-600">
                    <span :class="statusUi.className">{{ statusUi.label }}</span>
                    <span>• {{ campaignDateRange }}</span>
                </div>
            </div>
            <Button class="w-full shrink-0 touch-manipulation sm:w-auto" variant="secondary" @click="goBack">Voltar</Button>
        </div>

        <div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar detalhes…</div>

        <ResourceErrorState
            v-else-if="error"
            class="py-8"
            title="Não foi possível carregar a campanha"
            hint="Verifica a ligação e tenta outra vez."
            action-label="Tentar novamente"
            @retry="load"
        />

        <div v-else-if="campaign" class="flex min-h-0 flex-1 flex-col gap-6">
                <AnimatedTabBar ariaLabel="Secções da campanha" class="min-w-0">
                    <RouterLink
                        v-for="t in visibleTabs"
                        :key="t.id"
                        v-slot="{ navigate, isActive }"
                        :to="tabRoute(t.id)"
                        custom
                    >
                        <AnimatedTabTrigger
                            :id="`campaign-tab-${t.id}`"
                            role="tab"
                            type="button"
                            :active="isActive"
                            @click="navigate"
                        >
                            {{ t.label }}
                        </AnimatedTabTrigger>
                    </RouterLink>
                </AnimatedTabBar>

            <div
                class="flex min-h-0 flex-col"
                :class="tabPanelFillsHeight || isInformacoesTab ? 'min-h-0 flex-1' : ''"
            >
                <div
                    v-if="isInformacoesTab"
                    class="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
                >
                    <CampaignDetailsInformacoesPanel />
                </div>
                <CampaignDetailsPraiasPanel v-else-if="activeTab === 'praias'" />
                <CampaignDetailsVoluntariosPanel v-else-if="activeTab === 'voluntarios'" />
                <CampaignDetailsRecolhasPanel v-else-if="activeTab === 'recolhas'" />
                <CampaignDetailsComentariosPanel v-else-if="activeTab === 'comentarios'" />
                                    </div>
                                </div>

        <CampaignDetailsPageModals />
    </div>
</template>
