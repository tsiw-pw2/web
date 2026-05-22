<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"
import { useCampaignDetailsTabs } from "@/modules/campaigns/composables/useCampaignDetailsTabs"
import { useCampaignRegistrationActions } from "@/modules/campaigns/composables/useCampaignRegistrationActions"
import {
    type CampaignDetailsTabId,
    campaignDetailsTabFromRoute,
    DEFAULT_CAMPAIGN_DETAILS_TAB,
    isCampaignDetailsTabId,
} from "@/modules/campaigns/lib/campaignDetailsTabs"
import { canRecordWasteCollection } from "@/modules/campaigns/lib/canRecordWasteCollection"
import { patchCampaignCommentVisibility, postCampaignComment } from "@/modules/campaigns/services/campaignComments"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import {
    postCampaignWasteCollection,
    type CreateCampaignWasteCollectionBody,
} from "@/modules/campaigns/services/campaignWasteCollections"
import CampaignBeachesMap from "@/modules/campaigns/views/components/CampaignBeachesMap.vue"
import CreateWasteCollectionModal from "@/modules/campaigns/views/components/CreateWasteCollectionModal.vue"
import type { CampaignDetails, CampaignDetailsBeach, CampaignDetailsComment } from "@/modules/campaigns/types/details"
import { registrationRoleLabel, registrationStatusLabel } from "@/modules/campaigns/lib/registrationLabels"
import CancelRegistrationModal from "@/modules/campaigns/views/components/CancelRegistrationModal.vue"
import DeleteRegistrationModal from "@/modules/campaigns/views/components/DeleteRegistrationModal.vue"
import EditRegistrationModal from "@/modules/campaigns/views/components/EditRegistrationModal.vue"
import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
import { fetchProfile } from "@/modules/settings/services/profile"
import type { SettingsProfile } from "@/modules/settings/types/profile"
import { toastError, toastSuccess } from "@/infrastructure/appToast"
import { isApiRequestError } from "@/infrastructure/request"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import { CAMPAIGN_EDIT_STATUS_ITEMS, campaignDetailStatusBadge } from "@/shared/lib/apiStatePresentation"
import { initialsFromDisplayName } from "@/shared/lib/userInitials"

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const error = ref(false)
const campaign = ref<CampaignDetails | null>(null)
const profile = ref<SettingsProfile | null>(null)
const commentBody = ref("")
const postingComment = ref(false)
const visibilitySavingId = ref<string | null>(null)
const createWasteCollectionOpen = ref(false)
const postingWasteCollection = ref(false)

const COMMENT_MAX = 8000

function goBack() {
    router.push({ name: "campaigns" })
}

const campaignId = computed(() => String(route.params.campaignId ?? ""))

const TABS: { id: CampaignDetailsTabId; label: string }[] = [
    { id: "informacoes", label: "Informações" },
    { id: "praias", label: "Praias" },
    { id: "voluntarios", label: "Voluntários" },
    { id: "recolhas", label: "Recolhas" },
    { id: "comentarios", label: "Comentários" },
]

const activeTab = computed<CampaignDetailsTabId>(() => campaignDetailsTabFromRoute(route.params.tab))

function tabRoute(tab: CampaignDetailsTabId) {
    return { name: "campaign-details" as const, params: { campaignId: campaignId.value, tab } }
}

const {
    tabPageSize,
    registrations,
    registrationsPage,
    registrationsTotal,
    registrationsLoading,
    goRegistrationsPrev,
    goRegistrationsNext,
    wasteCollections,
    wastePage,
    wasteTotal,
    wasteBeachId,
    wasteLoading,
    goWastePrev,
    goWasteNext,
    setWasteBeachFilter,
    comments,
    commentsPage,
    commentsTotal,
    commentsLoading,
    goCommentsPrev,
    goCommentsNext,
    reloadCommentsFirstPage,
    reloadRegistrationsFirstPage,
    reloadWasteFirstPage,
    resetTabState,
    syncTabLoad,
} = useCampaignDetailsTabs(campaignId, activeTab)

const {
myRegistration,
enrolling,
canceling,
savingRegistrationId,
deletingRegistrationId,
editRegistrationOpen,
editRegistrationTarget,
cancelRegistrationOpen,
deleteRegistrationOpen,
deleteRegistrationTarget,
syncMyRegistrationFromCampaign,
canManageRegistrations,
canEnroll,
showEnrollmentClosed,
showMyRegistrationStatus,
enroll,
cancelMyRegistration,
openEditRegistration,
saveEditRegistration,
openDeleteRegistration,
confirmDeleteRegistration,
} = useCampaignRegistrationActions(campaignId, campaign, profile, reloadRegistrationsFirstPage)

const myRegistrationStatusLabel = computed(() =>
    myRegistration.value != null ? registrationStatusLabel(myRegistration.value.status) : "",
)

function onEditRegistrationRow(rowId: string) {
    const row = registrations.value.find((r) => r.id === rowId)
    if (row) openEditRegistration(row)
}

function onDeleteRegistrationRow(rowId: string) {
    const row = registrations.value.find((r) => r.id === rowId)
    if (row) openDeleteRegistration(row)
}

function formatDatePt(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(date)
}

function formatDateTimePt(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

function formatCommentTimeAgo(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
    if (diffSec < 60) return "agora"
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} min`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `${diffH} h`
    const diffD = Math.floor(diffH / 24)
    if (diffD < 7) return `${diffD} d`
    const diffW = Math.floor(diffD / 7)
    if (diffW < 5) return `${diffW} sem`
    return new Intl.DateTimeFormat("pt-PT", { dateStyle: "short" }).format(date)
}

const commentComposerInitials = computed(() => {
    const s = initialsFromDisplayName(profile.value?.name ?? "")
    return s.length > 0 ? s : "?"
})

function commentAuthorInitials(comment: CampaignDetailsComment): string {
    const s = initialsFromDisplayName(comment.user?.name ?? "Utilizador")
    return s.length > 0 ? s : "?"
}

const statusUi = computed(() => campaignDetailStatusBadge(campaign.value?.status ?? 0))

const canPostComment = computed(() => Boolean(campaign.value?.viewerCanPostComment))

const canRecordWaste = computed(() => canRecordWasteCollection(campaign.value, profile.value))

const descriptionText = computed(() => {
    const raw = campaign.value?.description?.trim()
    if (!raw?.length) return "—"
    return raw.replace(/(\r?\n\s*){2,}/g, "\n").trim()
})

const campaignPhaseLabel = computed(() => {
    const key = campaign.value?.editStatus
    if (!key) return "—"
    return CAMPAIGN_EDIT_STATUS_ITEMS.find((i) => i.apiKey === key)?.label ?? "—"
})

const campaignDistrictLabel = computed(() => {
    const code = campaign.value?.districtCode
    if (!code) return "—"
    return DISTRICT_SELECT_OPTIONS.find((o) => o.value === code)?.label ?? "—"
})

const campaignPeriodLabel = computed(() => {
    const c = campaign.value
    if (!c) return "—"
    return `${formatDatePt(c.startDate)} — ${formatDatePt(c.endDate)}`
})

function formatWeightKg(kg: number): string {
    if (!Number.isFinite(kg) || kg <= 0) return "—"
    return `${new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 }).format(kg)} kg`
}

function beachLocationLine(beach: CampaignDetailsBeach): string {
    const parts = [beach.municipality, beach.district].filter(Boolean)
    return parts.length > 0 ? parts.join(" · ") : ""
}

const wasteBeachSelectValue = computed({
    get: () => wasteBeachId.value ?? "__all__",
    set: (v: string | undefined) => {
        setWasteBeachFilter(v === "__all__" || v === undefined ? undefined : v)
    },
})

const wasteBeachSelectOptions = computed(() => {
    const beaches = campaign.value?.beaches ?? []
    return [
        { value: "__all__", label: "Todas as praias" },
        ...beaches.map((b) => ({ value: b.id, label: b.name })),
    ]
})

const wasteCountLabel = computed(() => {
    const n = wasteBeachId.value ? wasteTotal.value : (campaign.value?.metrics.wasteCollectionsCount ?? 0)
    return n === 1 ? "recolha" : "recolhas"
})

const wasteCountValue = computed(() =>
    wasteBeachId.value ? wasteTotal.value : (campaign.value?.metrics.wasteCollectionsCount ?? 0),
)

const canSubmitComment = computed(() => {
    const t = commentBody.value.trim()
    return t.length > 0 && t.length <= COMMENT_MAX && !postingComment.value
})

async function refreshCampaignMetrics() {
    if (!campaignId.value) return
    try {
        const d = await getCampaignDetails(campaignId.value)
        if (campaign.value) {
            campaign.value.metrics = d.metrics
            campaign.value.viewerCanPostComment = d.viewerCanPostComment
            campaign.value.viewerRegistration = d.viewerRegistration
        }
        syncMyRegistrationFromCampaign(d)
    } catch {
        /* ignore */
    }
}

async function setCommentVisibility(comment: CampaignDetailsComment, isVisible: boolean) {
    if (!profile.value?.isAdmin || visibilitySavingId.value) return
    visibilitySavingId.value = comment.id
    try {
        await patchCampaignCommentVisibility(comment.id, isVisible)
        await reloadCommentsFirstPage()
        await refreshCampaignMetrics()
        toastSuccess(isVisible ? "Comentário visível" : "Comentário oculto")
    } catch {
        toastError("Não foi possível atualizar", "Tenta outra vez.")
    } finally {
        visibilitySavingId.value = null
    }
}

async function onCreateWasteCollection(body: CreateCampaignWasteCollectionBody) {
    postingWasteCollection.value = true
    try {
        await postCampaignWasteCollection(campaignId.value, body)
        await reloadWasteFirstPage()
        await refreshCampaignMetrics()
        toastSuccess("Recolha registada")
    } catch (e) {
        if (isApiRequestError(e) && e.httpStatus === 403) {
            toastError("Não podes registar aqui", "Confirma a tua inscrição ou fala com o organizador.")
        } else {
            toastError("Não foi possível registar", "Verifica os dados e tenta outra vez.")
        }
    } finally {
        postingWasteCollection.value = false
    }
}

async function submitComment() {
    if (!canSubmitComment.value) return
    postingComment.value = true
    try {
        await postCampaignComment(campaignId.value, commentBody.value.trim())
        commentBody.value = ""
        await reloadCommentsFirstPage()
        await refreshCampaignMetrics()
        toastSuccess("Comentário publicado")
    } catch (e) {
        if (isApiRequestError(e) && e.httpStatus === 403) {
            toastError("Não podes publicar aqui", "Confirma a tua inscrição nesta campanha ou fala com o organizador.")
        } else {
            toastError("Não foi possível publicar", "Verifica a ligação e tenta outra vez.")
        }
    } finally {
        postingComment.value = false
    }
}

async function load() {
    loading.value = true
    error.value = false
    try {
        campaign.value = await getCampaignDetails(campaignId.value)
        syncMyRegistrationFromCampaign(campaign.value)
        syncTabLoad(activeTab.value)
    } catch {
        error.value = true
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    try {
        profile.value = await fetchProfile()
    } catch {
        profile.value = null
    }
    await load()
})

watch(
    () => route.params.tab,
    (tab) => {
        const raw = Array.isArray(tab) ? tab[0] : tab
        if (raw && !isCampaignDetailsTabId(raw)) {
            router.replace(tabRoute(DEFAULT_CAMPAIGN_DETAILS_TAB))
        }
    },
    { immediate: true },
)

watch(campaignId, (next, prev) => {
    if (!next || next === prev) return
    resetTabState()
    router.replace(tabRoute(DEFAULT_CAMPAIGN_DETAILS_TAB))
    void load()
})
</script>

<template>

    <div class="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-none px-px">

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div class="min-w-0">

                <h2 class="truncate text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl"> {{ campaign?.title ?? "Campanha" }} </h2>

                <div class="mt-1 flex flex-wrap items-center gap-2 text-sm leading-5 text-neutral-600">
                     <span :class="statusUi.className"> {{ statusUi.label }} </span> <span v-if="campaign"
                        >• {{ formatDatePt(campaign.startDate) }} — {{ formatDatePt(campaign.endDate) }}</span
                    >
                </div>

            </div>
             <Button class="w-full shrink-0 touch-manipulation sm:w-auto" variant="secondary" @click="goBack"> Voltar </Button>
        </div>

        <div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar detalhes…</div>

        <div v-else-if="error" class="rounded-2xl bg-white p-4 shadow-card">

            <div class="text-sm leading-5 text-neutral-600"> Não foi possível carregar a campanha. Tenta novamente. </div>

            <div class="mt-4"> <Button class="touch-manipulation" variant="secondary" @click="load">Recarregar</Button> </div>

        </div>

        <div v-else-if="campaign" class="flex flex-col gap-6">


                <div
                    role="tablist"
                    aria-label="Secções da campanha"
                    class="px-px flex min-w-0 gap-1 overflow-x-auto overflow-y-hidden border-b border-neutral-200"
                >
                    <RouterLink
                        v-for="t in TABS"
                        :key="t.id"
                        v-slot="{ navigate, isActive }"
                        :to="tabRoute(t.id)"
                        custom
                    >
                        <button
                            :id="`campaign-tab-${t.id}`"
                            type="button"
                            role="tab"
                            :aria-selected="isActive"
                            class="relative shrink-0 -mb-px whitespace-nowrap px-4 pb-3 pt-1 text-sm font-medium outline-none transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
                            :class="
                                isActive
                                    ? 'text-neutral-950 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-500'
                                    : 'text-neutral-500 hover:text-neutral-800'
                            "
                            @click="navigate"
                        >
                            {{ t.label }}
                        </button>
                    </RouterLink>
                </div>

                <div>

                    <div
                        v-show="activeTab === 'informacoes'"
                        id="campaign-panel-informacoes"
                        role="tabpanel"
                        aria-labelledby="campaign-tab-informacoes"
                        class="flex flex-col gap-6"
                    >

                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">

                            <div class="lg:col-span-2 flex flex-col gap-4">

                                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">
                                            Estado
                                        </FieldLabel>
                                        <p class="mt-2 text-sm font-medium leading-5 text-neutral-950">{{ campaignPhaseLabel }}</p>
                                    </div>
                                    <div>
                                        <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">
                                            Período
                                        </FieldLabel>
                                        <p class="mt-2 text-sm font-medium leading-5 text-neutral-950">{{ campaignPeriodLabel }}</p>
                                    </div>
                                    <div>
                                        <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">
                                            Distrito
                                        </FieldLabel>
                                        <p class="mt-2 text-sm font-medium leading-5 text-neutral-950">{{ campaignDistrictLabel }}</p>
                                    </div>
                                    <div>
                                        <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">
                                            Local de encontro
                                        </FieldLabel>
                                        <p class="mt-2 text-sm font-medium leading-5 text-neutral-950">{{ campaign.meetingLocation }}</p>
                                        <p v-if="campaign.meetingTime" class="mt-1 text-sm leading-5 text-neutral-600">
                                            Hora: {{ campaign.meetingTime }}
                                        </p>
                                    </div>
                                    <div class="sm:col-span-2">
                                        <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">
                                            Organizador
                                        </FieldLabel>
                                        <p class="mt-2 text-sm font-medium leading-5 text-neutral-950">{{ campaign.organizer?.name ?? "—" }}</p>
                                        <p v-if="campaign.organizer?.email" class="mt-1 text-sm leading-5 text-neutral-600">
                                            {{ campaign.organizer.email }}
                                        </p>
                                    </div>
                                </div>

                                <div v-if="campaign.beaches.length > 0">
                                    <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">
                                        Praias associadas
                                    </FieldLabel>
                                    <ul class="mt-3 space-y-2">
                                        <li
                                            v-for="beach in campaign.beaches"
                                            :key="beach.id"
                                            class="text-sm leading-5 text-neutral-950"
                                        >
                                            <span class="font-medium">{{ beach.name }}</span>
                                            <span v-if="beachLocationLine(beach)" class="text-neutral-600">
                                                · {{ beachLocationLine(beach) }}
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <FieldLabel as="span" class="block uppercase tracking-wide font-medium text-neutral-500">
                                        Descrição
                                    </FieldLabel>
                                    <p class="mt-2 whitespace-pre-line text-sm leading-5 text-neutral-700">
                                        {{ descriptionText }}
                                    </p>
                                </div>

                            </div>

                            <div class="flex flex-col gap-2">

                                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                                    <p class="font-medium text-neutral-500"> Voluntários </p>
                                    <div class="mt-1 text-neutral-950"> {{ campaign.metrics.registrationsCount }} </div>
                                </div>

                                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                                    <p class="font-medium text-neutral-500"> Praias </p>
                                    <div class="mt-1 text-neutral-950"> {{ campaign.metrics.beachesCount }} </div>
                                </div>

                                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                                    <p class="font-medium text-neutral-500"> Recolhas </p>
                                    <div class="text-neutral-950"> {{ campaign.metrics.wasteCollectionsCount }} </div>
                                </div>

                                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                                    <p class="font-medium text-neutral-500"> Resíduos (un.) </p>
                                    <div class="text-neutral-950"> {{ campaign.metrics.totalWasteUnits }} </div>
                                </div>

                                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                                    <p class="font-medium text-neutral-500"> Peso recolhido </p>
                                    <div class="text-neutral-950">
                                        {{ formatWeightKg(campaign.metrics.totalWasteWeightKg) }}
                                    </div>
                                </div>

                                <div class="flex items-center justify-between">
                                    <p class="font-medium text-neutral-500"> Comentários </p>
                                    <div class="text-neutral-950"> {{ campaign.metrics.commentsCount }} </div>
                                </div>

                                <div
                                    v-if="profile && (canEnroll || showMyRegistrationStatus || showEnrollmentClosed)"
                                    class="mt-2 flex flex-col gap-3"
                                >
                                    <div v-if="showMyRegistrationStatus" class="flex flex-col gap-3">
                                        <p class="text-sm leading-5 text-neutral-700">
                                            A tua inscrição:
                                            <span class="font-medium text-neutral-950">{{ myRegistrationStatusLabel }}</span>
                                        </p>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            class="w-full touch-manipulation"
                                            :disabled="canceling"
                                            :busy="canceling"
                                            @click="cancelRegistrationOpen = true"
                                        >
                                            Cancelar inscrição
                                        </Button>
                                    </div>

                                    <Button
                                        v-else-if="canEnroll"
                                        type="button"
                                        variant="primary"
                                        class="w-full touch-manipulation"
                                        :disabled="enrolling"
                                        :busy="enrolling"
                                        @click="enroll"
                                    >
                                        Inscrever-me
                                    </Button>

                                    <p v-else-if="showEnrollmentClosed" class="text-sm leading-5 text-neutral-600">
                                        Inscrições fechadas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-show="activeTab === 'praias'"
                        id="campaign-panel-praias"
                        role="tabpanel"
                        aria-labelledby="campaign-tab-praias"
                        class="flex flex-col gap-4"
                    >

                        <div v-if="campaign.beaches.length === 0" class="text-sm leading-5 text-neutral-600">
                            Sem praias associadas.
                        </div>

                        <CampaignBeachesMap
                            v-else-if="activeTab === 'praias'"
                            :beaches="campaign.beaches"
                        />

                    </div>
                    <div
                        v-show="activeTab === 'voluntarios'"
                        id="campaign-panel-voluntarios"
                        role="tabpanel"
                        aria-labelledby="campaign-tab-voluntarios"
                        class="flex flex-col gap-4"
                    >
                        <div v-if="registrationsLoading" class="text-sm leading-5 text-neutral-600">A carregar voluntários…</div>

                        <div v-else-if="campaign.metrics.registrationsCount === 0" class="text-sm leading-5 text-neutral-600">
                            Ainda não há voluntários inscritos.
                        </div>

                        <template v-else>
                        <DataTableScrollWrap class="mt-0">
                            <table
                                class="w-full table-fixed border-collapse text-left"
                                :class="canManageRegistrations ? 'min-w-[1000px]' : 'min-w-[920px]'"
                            >
                                <colgroup>
                                    <col :class="canManageRegistrations ? 'w-[18%]' : 'w-[20%]'" />
                                    <col :class="canManageRegistrations ? 'w-[22%]' : 'w-[26%]'" />
                                    <col class="w-[12%]" />
                                    <col class="w-[12%]" />
                                    <col class="w-[12%]" />
                                    <col class="w-[12%]" />
                                    <col v-if="canManageRegistrations" class="w-[12%]" />
                                </colgroup>

                                <thead class="sticky top-0 z-10 bg-white">

                                    <tr class="border-b border-neutral-200">
                                        <DataTableTh>Nome</DataTableTh>
                                        <DataTableTh>Email</DataTableTh>
                                        <DataTableTh align="end">Telefone</DataTableTh>
                                        <DataTableTh>Função</DataTableTh>
                                        <DataTableTh>Estado</DataTableTh>
                                        <DataTableTh>Presença</DataTableTh>
                                        <DataTableTh v-if="canManageRegistrations" align="end">Acções</DataTableTh>
                                    </tr>

                                </thead>

                                <tbody>

                                    <tr
                                        v-for="row in registrations"
                                        :key="row.id"
                                        class="border-b border-neutral-200 last:border-b-0"
                                    >
                                        <DataTableTd emphasis>{{ row.user?.name ?? "—" }}</DataTableTd>
                                        <DataTableTd>{{ row.user?.email ?? "—" }}</DataTableTd>
                                        <DataTableTd align="end" class="tabular-nums">{{ row.user?.phone ?? "—" }}</DataTableTd>
                                        <DataTableTd>{{ registrationRoleLabel(row.role) }}</DataTableTd>
                                        <DataTableTd>{{ registrationStatusLabel(row.status) }}</DataTableTd>
                                        <DataTableTd>{{ row.attendance === null ? "—" : row.attendance ? "Sim" : "Não" }}</DataTableTd>
                                        <DataTableActionsCell
                                            v-if="canManageRegistrations"
                                            :row-id="row.id"
                                            edit-label="Gerir inscrição"
                                            delete-label="Remover inscrição"
                                            @edit="onEditRegistrationRow"
                                            @delete="onDeleteRegistrationRow"
                                        />
                                    </tr>

                                </tbody>

                            </table>
                        </DataTableScrollWrap>

                        <ListPaginationBar
                            v-if="registrationsTotal > tabPageSize"
                            class="mt-4"
                            :page="registrationsPage"
                            :page-size="tabPageSize"
                            :total="registrationsTotal"
                            @prev="goRegistrationsPrev"
                            @next="goRegistrationsNext"
                        />
                        </template>

                    </div>
                    <div
                        v-show="activeTab === 'recolhas'"
                        id="campaign-panel-recolhas"
                        role="tabpanel"
                        aria-labelledby="campaign-tab-recolhas"
                        class="flex flex-col gap-4"
                    >

                        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Select
                                id="campaign-waste-beach-filter"
                                v-model="wasteBeachSelectValue"
                                class="w-full sm:w-[240px]"
                                :options="wasteBeachSelectOptions"
                                placeholder="Todas as praias"
                            />
							<Button
                                    v-if="canRecordWaste && campaign.beaches.length > 0"
                                    type="button"
                                    variant="primary"
                                    class="touch-manipulation"
                                    :disabled="postingWasteCollection"
                                    :busy="postingWasteCollection"
                                    @click="createWasteCollectionOpen = true"
                                >Registar recolha
							</Button>
                        </div>

                        <div class="text-xs text-neutral-500">{{ wasteCountValue }} {{ wasteCountLabel }}</div>

                        <div v-if="wasteLoading" class="text-sm leading-5 text-neutral-600">A carregar recolhas…</div>

                        <div v-else-if="campaign.metrics.wasteCollectionsCount === 0" class="text-sm leading-5 text-neutral-600">
                            Ainda não há recolhas registadas.
                        </div>

                        <template v-else>
                        <div v-if="wasteCollections.length === 0" class="text-sm leading-5 text-neutral-600">
                            Nenhuma recolha nesta praia.
                        </div>

                        <div v-else class="space-y-3">

                            <div v-for="row in wasteCollections" :key="row.id">

                                <div class="flex flex-wrap items-center justify-between gap-2">

                                    <div class="text-sm font-medium text-neutral-950">
                                        {{ row.waste?.name ?? "Resíduo" }} <span class="text-neutral-500">•</span> {{ row.unitQuantity }} un
                                        <span v-if="row.actualWeightKg" class="text-neutral-500">•</span>
                                        <span v-if="row.actualWeightKg">{{ row.actualWeightKg }} kg</span>
                                    </div>

                                    <div class="text-xs text-neutral-500">{{ formatDateTimePt(row.createdAt) }}</div>

                                </div>

                                <div class="mt-1 text-xs leading-5 text-neutral-600">
                                    <span v-if="row.beach?.name">{{ row.beach.name }}</span>
                                    <span v-if="row.recordedBy?.name"> • registado por {{ row.recordedBy.name }}</span>
                                </div>

                            </div>

                        </div>

                        <ListPaginationBar
                            v-if="wasteTotal > tabPageSize"
                            class="mt-4"
                            :page="wastePage"
                            :page-size="tabPageSize"
                            :total="wasteTotal"
                            @prev="goWastePrev"
                            @next="goWasteNext"
                        />
                        </template>

                    </div>
                    <div
                        v-show="activeTab === 'comentarios'"
                        id="campaign-panel-comentarios"
                        role="tabpanel"
                        aria-labelledby="campaign-tab-comentarios"
                        class="flex flex-col"
                    >

                        <form
                            v-if="canPostComment"
                            class="mb-3 flex items-start gap-3 border-b border-neutral-200 pb-3"
                            @submit.prevent="submitComment"
                        >
                            <div
                                class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-[11px] font-semibold text-neutral-700"
                                aria-hidden="true"
                            >
                                {{ commentComposerInitials }}
                            </div>
                            <div class="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                                <label for="campaign-new-comment" class="sr-only">Adiciona um comentário</label>
                                <textarea
                                    id="campaign-new-comment"
                                    v-model="commentBody"
                                    rows="1"
                                    :maxlength="COMMENT_MAX"
                                    placeholder="Adiciona um comentário…"
                                    class="max-h-24 min-h-[36px] w-full flex-1 resize-none border-0 bg-transparent py-1.5 text-sm leading-5 text-neutral-950 outline-none placeholder:text-neutral-400"
                                    @keydown.enter.exact.prevent="submitComment"
                                />
                                <button
                                    type="submit"
                                    class="shrink-0 self-end text-sm font-semibold text-blue-600 outline-none enabled:hover:text-blue-700 focus-visible:underline disabled:cursor-not-allowed disabled:opacity-40"
                                    :disabled="!canSubmitComment"
                                >
                                    {{ postingComment ? "A publicar…" : "Publicar" }}
                                </button>
                            </div>
                        </form>

                        <p
                            v-if="profile && !canPostComment"
                            class="mb-3 text-xs leading-5 text-neutral-500"
                        >
                            Só o organizador, moderadores ou voluntários inscritos nesta campanha podem publicar aqui.
                        </p>

                        <div v-if="commentsLoading" class="py-6 text-center text-sm text-neutral-500">A carregar comentários…</div>

                        <p
                            v-else-if="campaign.metrics.commentsCount === 0"
                            class="py-8 text-center text-sm text-neutral-500"
                        >
                            Sem comentários.
                        </p>

                        <template v-else>
                            <ul role="list" class="m-0 flex list-none flex-col divide-y divide-neutral-100 p-0">
                                <li v-for="comment in comments" :key="comment.id" class="py-3 first:pt-3">
                                    <article class="flex gap-3">
                                        <div
                                            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-[11px] font-semibold text-neutral-700"
                                            aria-hidden="true"
                                        >
                                            {{ commentAuthorInitials(comment) }}
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="flex items-start justify-between gap-3">
                                                <div class="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                                    <span class="text-sm font-semibold leading-5 text-neutral-950">{{
                                                        comment.user?.name ?? "Utilizador"
                                                    }}</span>
                                                    <span
                                                        v-if="profile?.isAdmin && comment.isVisible === false"
                                                        class="text-[10px] font-medium uppercase tracking-wide text-red-600"
                                                    >Oculto</span>
                                                    <span class="text-xs text-neutral-400" aria-hidden="true">·</span>
                                                    <time
                                                        class="text-xs leading-5 text-neutral-400"
                                                        :datetime="comment.createdAt"
                                                    >{{ formatCommentTimeAgo(comment.createdAt) }}</time>
                                                </div>
                                                <button
                                                    v-if="profile?.isAdmin"
                                                    type="button"
                                                    class="shrink-0 text-xs font-semibold text-neutral-500 outline-none hover:text-neutral-800 focus-visible:underline disabled:opacity-50"
                                                    :disabled="visibilitySavingId === comment.id"
                                                    @click="setCommentVisibility(comment, comment.isVisible === false)"
                                                >
                                                    {{
                                                        visibilitySavingId === comment.id
                                                            ? "…"
                                                            : comment.isVisible === false
                                                              ? "Mostrar"
                                                              : "Ocultar"
                                                    }}
                                                </button>
                                            </div>
                                            <p class="mt-1.5 text-sm leading-5 whitespace-pre-wrap text-neutral-950">
                                                {{ comment.body }}
                                            </p>
                                        </div>
                                    </article>
                                </li>
                            </ul>

                            <ListPaginationBar
                                v-if="commentsTotal > tabPageSize"
                                class="border-t border-neutral-100 py-3"
                                :page="commentsPage"
                                :page-size="tabPageSize"
                                :total="commentsTotal"
                                @prev="goCommentsPrev"
                                @next="goCommentsNext"
                            />
                        </template>

                    </div>
                </div>

            <EditRegistrationModal
                v-model="editRegistrationOpen"
                :registration="editRegistrationTarget"
                :saving="Boolean(savingRegistrationId)"
                @save="saveEditRegistration"
            />

            <CancelRegistrationModal
                v-model="cancelRegistrationOpen"
                :busy="canceling"
                @confirm="cancelMyRegistration"
            />

            <DeleteRegistrationModal
                v-model="deleteRegistrationOpen"
                :volunteer-name="deleteRegistrationTarget?.user?.name ?? undefined"
                :busy="Boolean(deletingRegistrationId)"
                @confirm="confirmDeleteRegistration"
            />

            <CreateWasteCollectionModal
                v-model="createWasteCollectionOpen"
                :beaches="campaign.beaches"
                @create="onCreateWasteCollection"
            />
        </div>
    </div>
</template>