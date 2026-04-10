<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { Button } from "../components/ui/button"
import AsyncDataView from "../components/ui/AsyncDataView.vue"
import CreateCampaignModal from "../components/domain/campaigns/CreateCampaignModal.vue"
import CampaignRelationsPanel from "../components/domain/campaigns/CampaignRelationsPanel.vue"
import { useCampaigns } from "../composables/useCampaigns"
import { useAuth } from "../composables/useAuth"
import { useAsyncDataPhase } from "../composables/useAsyncDataPhase"
import type { Campaign, CampaignDraft, CampanhaEstado } from "../types/domain"
import { campanhaEstadoLabel } from "../types/domain"
import { formatDatePt } from "../utils/date"

const {
    campaigns,
    loading,
    error,
    loadCampaigns,
    fetchCampaignDetailById,
    addCampaign,
    updateCampaign,
    removeCampaign,
} = useCampaigns()
const { profile, isAdmin, isOrganizer } = useAuth()

const isModalOpen = ref(false)
const editing = ref<Campaign | null>(null)

const listEmpty = computed(() => campaigns.value.length === 0)
const phase = useAsyncDataPhase(loading, error, listEmpty)

watch(isModalOpen, (open) => {
    if (!open) editing.value = null
})

onMounted(() => {
    void loadCampaigns()
})

function openCreate() {
    editing.value = null
    isModalOpen.value = true
}

async function openEdit(c: Campaign) {
    try {
        editing.value = await fetchCampaignDetailById(c.id)
    } catch {
        editing.value = c
    }
    isModalOpen.value = true
}

async function onSave(draft: CampaignDraft) {
    try {
        const full: CampaignDraft = {
            ...draft,
            organizerId: profile.value?.id ?? draft.organizerId,
        }
        if (editing.value) await updateCampaign(editing.value.id, full)
        else await addCampaign(full)
        isModalOpen.value = false
    } catch (e) {
        alert(e instanceof Error ? e.message : "Não foi possível guardar.")
    }
}

async function onRemove(c: Campaign) {
    if (!confirm(`Eliminar a campanha «${c.title}»?`)) return
    try {
        await removeCampaign(c.id)
    } catch (e) {
        alert(e instanceof Error ? e.message : "Não foi possível eliminar.")
    }
}

function estadoClass(estado: CampanhaEstado) {
    if (estado === 4) return "bg-neutral-100 text-neutral-700"
    if (estado === 5) return "bg-red-50 text-red-800"
    if (estado === 3) return "bg-sky-50 text-[#008BF8]"
    return "bg-neutral-50 text-neutral-600"
}

function meetingLine(c: Campaign) {
    const t = c.meetingTime ? ` · ${c.meetingTime}` : ""
    return `${c.meetingLocation}${t}`
}

const canCreateCampaign = () => isAdmin.value || isOrganizer.value

function canEditCampaign(c: Campaign) {
    return isAdmin.value || (profile.value != null && c.organizerId === profile.value.id)
}
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col gap-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-2xl font-semibold leading-8 text-neutral-950">Campanhas</h2>
            <Button v-if="canCreateCampaign()" class="shrink-0 self-start sm:self-auto" @click="openCreate">
                Nova campanha
            </Button>
        </div>

        <AsyncDataView :phase="phase" :error-message="error">
            <template #empty>
                <p class="text-sm font-medium text-neutral-600">Sem campanhas.</p>
                <Button v-if="canCreateCampaign()" class="mt-4" @click="openCreate">Criar campanha</Button>
            </template>

            <div class="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
                <table class="w-full min-w-[720px] border-collapse text-left text-sm">
                    <thead>
                        <tr class="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                            <th class="px-4 py-3">Campanha</th>
                            <th class="px-4 py-3">Estado</th>
                            <th class="px-4 py-3">Encontro</th>
                            <th class="px-4 py-3">Início</th>
                            <th class="px-4 py-3">Fim</th>
                            <th class="px-4 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="c in campaigns" :key="c.id">
                            <tr class="border-b border-neutral-100 align-top">
                                <td class="px-4 py-3">
                                    <p class="font-semibold text-neutral-950">{{ c.title }}</p>
                                    <p v-if="c.description" class="mt-1 line-clamp-2 text-neutral-600">{{ c.description }}</p>
                                </td>
                                <td class="px-4 py-3 whitespace-nowrap">
                                    <span
                                        class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-4"
                                        :class="estadoClass(c.estado)"
                                    >
                                        {{ campanhaEstadoLabel[c.estado] }}
                                    </span>
                                </td>
                                <td class="max-w-[200px] px-4 py-3 text-neutral-600">{{ meetingLine(c) }}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-neutral-600">{{ formatDatePt(c.startDate) }}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-neutral-600">{{ formatDatePt(c.endDate) }}</td>
                                <td class="px-4 py-3 text-right">
                                    <div v-if="canEditCampaign(c)" class="flex flex-wrap justify-end gap-2">
                                        <Button variant="outline" size="sm" @click="openEdit(c)">Editar</Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="border-red-200 text-red-700 hover:bg-red-50"
                                            @click="onRemove(c)"
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="isAdmin || (profile && c.organizerId === profile.id)" class="border-b border-neutral-100">
                                <td colspan="6" class="bg-neutral-50/50 px-4 py-2">
                                    <CampaignRelationsPanel :campaign="c" />
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </AsyncDataView>

        <CreateCampaignModal v-model="isModalOpen" :campaign="editing" @save="onSave" />
    </div>
</template>
