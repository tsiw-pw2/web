<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { RouterLink } from "vue-router"
import { useHomeActiveCampaignsMap } from "@/modules/home/composables/useHomeActiveCampaignsMap"
import { formatHomeCampaignDate } from "@/modules/home/lib/formatHomeCampaignDate"
import HomeCampaignsMap from "@/modules/home/views/components/HomeCampaignsMap.vue"
import Button from "@/shared/components/ui/Button.vue"

const props = defineProps<{
    isAuthenticated: boolean
    loginPath: string
}>()

const isAuthenticatedRef = computed(() => props.isAuthenticated)
const { points, loading, error } = useHomeActiveCampaignsMap(isAuthenticatedRef)

const selectedPointId = ref<string | null>(null)

const selectedPoint = computed(() => {
    if (!selectedPointId.value) return null
    return points.value.find((point) => point.id === selectedPointId.value) ?? null
})

watch(
    points,
    (nextPoints) => {
        if (nextPoints.length === 0) {
            selectedPointId.value = null
            return
        }
        if (!selectedPointId.value || !nextPoints.some((point) => point.id === selectedPointId.value)) {
            selectedPointId.value = nextPoints[0]?.id ?? null
        }
    },
    { immediate: true },
)

const campaignDetailsPath = computed(() => {
    const campaignId = selectedPoint.value?.campaignId
    if (!campaignId) return null
    return {
        name: "campaign-details" as const,
        params: { campaignId, tab: "informacoes" },
    }
})
</script>

<template>
    <section class="bg-neutral-950 text-white">
        <div class="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <div class="mx-auto max-w-3xl text-center">
                <h2 class="text-2xl font-semibold leading-8 sm:text-3xl">Campanhas ativas em todo o país</h2>
                <p class="mt-3 text-sm leading-6 text-neutral-300 sm:text-base">
                    Explore iniciativas de limpeza organizadas por municípios e junte-se à sua comunidade.
                </p>
            </div>

            <div class="relative mt-10">
                <HomeCampaignsMap
                    :points="points"
                    :selected-point-id="selectedPointId"
                    @select="selectedPointId = $event"
                />

                <div
                    v-if="!isAuthenticated"
                    class="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-neutral-950/75 px-6 text-center"
                >
                    <p class="max-w-md text-sm leading-6 text-neutral-200 sm:text-base">
                        Inicia sessão para ver campanhas ativas no mapa e inscrever-te numa ação perto de ti.
                    </p>
                    <RouterLink :to="loginPath">
                        <Button>Entrar</Button>
                    </RouterLink>
                </div>

                <p v-else-if="loading" class="absolute inset-x-0 top-4 text-center text-sm text-neutral-300">
                    A carregar campanhas…
                </p>
                <p v-else-if="error" class="absolute inset-x-0 top-4 text-center text-sm text-red-300">
                    {{ error }}
                </p>
                <p
                    v-else-if="points.length === 0"
                    class="absolute inset-x-0 top-4 text-center text-sm text-neutral-300"
                >
                    Ainda não há campanhas ativas para mostrar no mapa.
                </p>

                <div
                    v-if="isAuthenticated && selectedPoint"
                    class="pointer-events-none absolute bottom-4 right-4 left-4 sm:left-auto sm:w-[min(100%,22rem)]"
                >
                    <div class="pointer-events-auto rounded-xl border border-neutral-200 bg-white p-4 text-neutral-950 shadow-lg">
                        <h3 class="text-base font-semibold leading-6">{{ selectedPoint.title }}</h3>
                        <dl class="mt-3 grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <dt class="font-medium text-neutral-500">Localização</dt>
                                <dd class="mt-0.5 font-medium text-neutral-950">{{ selectedPoint.locationLabel }}</dd>
                            </div>
                            <div>
                                <dt class="font-medium text-neutral-500">Data</dt>
                                <dd class="mt-0.5 font-medium text-neutral-950">
                                    {{ formatHomeCampaignDate(selectedPoint.startDate) }}
                                </dd>
                            </div>
                        </dl>
                        <RouterLink v-if="campaignDetailsPath" :to="campaignDetailsPath" class="mt-4 inline-flex">
                            <Button>Inscrição</Button>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
