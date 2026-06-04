<script setup lang="ts">
import { onMounted, ref } from "vue"
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import { setProfileSummaryCache } from "@/infrastructure/profileAvatarCache"
import { toastAccountBlocked, toastError, toastListPossiblyStale, toastServiceUnavailable, toastSuccess, toastWarning } from "@/infrastructure/appToast"
import type { CampaignListItem } from "@/modules/campaigns/types/list"
import { registrationRoleTableBadge, registrationStatusTableBadge, wasteCategoryTableBadge, wasteUnitTableBadge, } from "@/shared/lib/tableValueBadge"
import CampaignsListState from "@/modules/campaigns/views/states/CampaignsListState.vue"
import ShowcaseSection from "@/modules/dev/components/ShowcaseSection.vue"
import ShowcaseErrorMessagesPanel from "@/modules/dev/components/ShowcaseErrorMessagesPanel.vue"
import AnimatedTabBar from "@/shared/components/ui/tabs/AnimatedTabBar.vue"
import AnimatedTabTrigger from "@/shared/components/ui/tabs/AnimatedTabTrigger.vue"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
import Clock from "@/shared/components/icons/Clock.vue"
import DashboardCampaignIcon from "@/shared/components/icons/dashboard/DashboardCampaignIcon.vue"
import DashboardCoastIcon from "@/shared/components/icons/dashboard/DashboardCoastIcon.vue"
import DashboardVolunteerIcon from "@/shared/components/icons/dashboard/DashboardVolunteerIcon.vue"
import EditPencilIcon from "@/shared/components/icons/EditPencilIcon.vue"
import LogoMark from "@/shared/components/icons/LogoMark.vue"
import MobileNavBeachesIcon from "@/shared/components/icons/mobile-nav/MobileNavBeachesIcon.vue"
import MobileNavCampaignsIcon from "@/shared/components/icons/mobile-nav/MobileNavCampaignsIcon.vue"
import MobileNavDashboardIcon from "@/shared/components/icons/mobile-nav/MobileNavDashboardIcon.vue"
import MobileNavSettingsIcon from "@/shared/components/icons/mobile-nav/MobileNavSettingsIcon.vue"
import MobileNavWasteIcon from "@/shared/components/icons/mobile-nav/MobileNavWasteIcon.vue"
import ModalCloseXIcon from "@/shared/components/icons/ModalCloseXIcon.vue"
import SelectChevronDownIcon from "@/shared/components/icons/SelectChevronDownIcon.vue"
import SelectOptionCheckIcon from "@/shared/components/icons/SelectOptionCheckIcon.vue"
import TrashBucketIcon from "@/shared/components/icons/TrashBucketIcon.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"
import ResourceEmptyState from "@/shared/components/states/ResourceEmptyState.vue"
import ResourceErrorState from "@/shared/components/states/ResourceErrorState.vue"
import ToastDangerIcon from "@/shared/components/toast/ToastDangerIcon.vue"
import ToastSuccessIcon from "@/shared/components/toast/ToastSuccessIcon.vue"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import SearchableSelect from "@/shared/components/ui/searchable-select/SearchableSelect.vue"
import Tooltip from "@/shared/components/ui/Tooltip.vue"
import { CAMPAIGN_STATUS_SELECT_OPTIONS } from "@/modules/campaigns/lib/campaignStatus"
import { CAMPAIGN_EDIT_STATUS_ITEMS, COMMENT_HIDDEN_BADGE, REGISTRATION_ROLE_ITEMS, REGISTRATION_STATUS_ITEMS, WASTE_CATEGORY_ITEMS, WASTE_UNIT_ITEMS, campaignDetailStatusBadge, userAccountStateBadge } from "@/shared/lib/apiStatePresentation"
import Textarea from "@/shared/components/ui/Textarea.vue"

const navSections = [
    { id: "buttons", label: "Botões" },
    { id: "labels", label: "Etiquetas" },
    { id: "inputs", label: "Inputs" },
    { id: "select", label: "Select" },
    { id: "searchable-select", label: "SearchableSelect" },
    { id: "modal", label: "Modal" },
    { id: "tooltip", label: "Tooltip" },
    { id: "states", label: "Estados" },
    { id: "api-states", label: "Estados API" },
    { id: "table", label: "Tabela" },
    { id: "pagination", label: "Paginação" },
    { id: "logo", label: "Logo" },
    { id: "icons", label: "Ícones" },
    { id: "toasts", label: "Toasts" },
] as const

type ShowcaseView = "components" | "errors"

const showcaseView = ref<ShowcaseView>("components")

const showcaseTabs: { id: ShowcaseView; label: string }[] = [
    { id: "components", label: "Componentes" },
    { id: "errors", label: "Mensagens de erro" },
]

const buttonVariants = ["primary", "secondary", "danger"] as const

const inputValue = ref("Texto de exemplo")
const inputErrorValue = ref("")
const textareaValue = ref("Comentário ou descrição longa para testar altura e scroll interno.")
const selectValue = ref<string | undefined>("aberta_inscricoes")
const selectDisabledValue = ref<string | undefined>(undefined)
const selectAboveValue = ref<string | undefined>(undefined)
const modalOpenMd = ref(false)
const modalOpenLg = ref(false)
const paginationPage = ref(2)
const paginationFirstPage = ref(1)
const paginationLastPage = ref(10)

const selectOptions = [...CAMPAIGN_STATUS_SELECT_OPTIONS]

const searchableSelectValue = ref<string | undefined>(undefined)
const searchableSelectCreatable = ref(true)
const wasteCategorySelectOptions = WASTE_CATEGORY_ITEMS.map((item, index) => ({
    value: `demo-${index}`,
    label: item.label,
}))

const campaignDemoItems: CampaignListItem[] = [
    {
        id: "demo-1",
        title: "Limpeza Costa da Caparica",
        municipality: "Almada",
        beach: "Praia do CDP, Praia do Dragão",
        startDate: "12/04/2026",
        endDate: "12/04/2026",
    },
    {
        id: "demo-2",
        title: "Voluntários Matosinhos",
        municipality: "Matosinhos",
        beach: "Praia da Azul",
        startDate: "03/05/2026",
        endDate: "04/05/2026",
    },
    {
        id: "demo-3",
        title: "Ria de Aveiro — norte",
        municipality: "Ílhavo",
        beach: "Praia da Barra",
        startDate: "18/06/2026",
        endDate: "20/06/2026",
    },
    {
        id: "demo-4",
        title: "São Martinho do Porto",
        municipality: "Alcobaça",
        beach: "Praia de São Martinho",
        startDate: "01/07/2026",
        endDate: "01/07/2026",
    },
]

const campaignDemoPage = ref(1)
const campaignDetailStatusSamples = [0, 1, 2] as const

const inputErrorClass =
    "!shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_0_0_1px_rgb(239,68,68)] focus-within:!shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_0_0_1.5px_rgb(239,68,68)]"

const campaignDemoTotal = 47

const iconShowcase = [
    { name: "Clock", component: Clock },
    { name: "EditPencilIcon", component: EditPencilIcon },
    { name: "TrashBucketIcon", component: TrashBucketIcon },
    { name: "ModalCloseXIcon", component: ModalCloseXIcon },
    { name: "SelectChevronDownIcon", component: SelectChevronDownIcon },
    { name: "SelectOptionCheckIcon", component: SelectOptionCheckIcon },
    { name: "DashboardCampaignIcon", component: DashboardCampaignIcon },
    { name: "DashboardCoastIcon", component: DashboardCoastIcon },
    { name: "DashboardVolunteerIcon", component: DashboardVolunteerIcon },
    { name: "MobileNavDashboardIcon", component: MobileNavDashboardIcon },
    { name: "MobileNavCampaignsIcon", component: MobileNavCampaignsIcon },
    { name: "MobileNavBeachesIcon", component: MobileNavBeachesIcon },
    { name: "MobileNavWasteIcon", component: MobileNavWasteIcon },
    { name: "MobileNavSettingsIcon", component: MobileNavSettingsIcon },
    { name: "ToastSuccessIcon", component: ToastSuccessIcon },
    { name: "ToastDangerIcon", component: ToastDangerIcon },
] as const

onMounted(() => {
    setProfileSummaryCache({ name: "Utilizador demo", avatarUrl: null })
})
</script>

<template>
     <div class="min-h-screen bg-neutral-50 text-neutral-950">
         <header class="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
            <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
                <div>
                    <p class="text-xs font-medium uppercase tracking-wide text-neutral-500">Desenvolvimento</p>
                    <h1 class="text-xl font-semibold leading-7 text-neutral-950">Galeria de componentes</h1>
                    <p class="mt-1 max-w-xl text-sm text-neutral-600">
                        {{
                            showcaseView === "errors"
                                ? "Referência de copy de erro na web."
                                : "Componentes partilhados e estados visuais do contrato API."
                        }}
                    </p>
                </div>
                <RouterLink :to="routePaths.home" class="text-sm font-medium text-blue-600 hover:text-blue-700"> Voltar ao início </RouterLink>
            </div>
            <AnimatedTabBar
                ariaLabel="Vistas da galeria"
                class="mx-auto max-w-6xl border-b border-t border-neutral-100 px-4 pt-3"
            >
                <AnimatedTabTrigger
                    v-for="tab in showcaseTabs"
                    :key="tab.id"
                    role="tab"
                    type="button"
                    :active="showcaseView === tab.id"
                    class="rounded-t-lg py-2.5"
                    :class="showcaseView === tab.id ? 'bg-neutral-50' : 'hover:bg-neutral-50'"
                    @click="showcaseView = tab.id"
                >
                    {{ tab.label }}
                </AnimatedTabTrigger>
            </AnimatedTabBar>
        </header>

        <div v-if="showcaseView === 'errors'" class="mx-auto max-w-6xl px-4 py-8">
            <ShowcaseErrorMessagesPanel />
        </div>

        <div v-else class="mx-auto flex max-w-6xl gap-10 px-4 py-8">
            <nav class="hidden w-44 shrink-0 lg:block" aria-label="Secções da galeria">
                <ul class="sticky top-24 space-y-1">
                    <li v-for="section in navSections" :key="section.id">
                        <a :href="`#${section.id}`" class="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-white hover:text-neutral-950">
                            {{ section.label }}
                        </a>
                    </li>
                </ul>
            </nav>

            <main class="min-w-0 flex-1">
                <ShowcaseSection id="buttons" title="Button" description="variant: primary | secondary | danger. disabled: 60% opacidade, sem clique. busy: aria-busy durante um pedido em curso (ex.: guardar) — usar com disabled para evitar duplo envio; leitores de ecrã anunciam que o botão está ocupado.">
                    <div class="space-y-6">
                        <div v-for="state in ['default', 'disabled', 'busy'] as const" :key="state" class="space-y-2">
                            <p class="text-sm font-medium text-neutral-800">
                                {{ state === "busy" ? "busy (com disabled)" : state }}
                            </p>
                            <div class="flex flex-wrap items-center gap-3">
                                <Button
                                    v-for="variant in buttonVariants"
                                    :key="`${state}-${variant}`"
                                    :variant="variant"
                                    :disabled="state === 'disabled' || state === 'busy'"
                                    :busy="state === 'busy'"
                                >
                                    {{ variant }}
                                </Button>
                            </div>
                        </div>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection id="labels" title="FieldLabel" description="Etiquetas com asterisco obrigatório ou sufixo opcional.">
                    <div class="flex max-w-md flex-col gap-4">
                        <FieldLabel for="showcase-label-required" required>Nome da campanha</FieldLabel>
                        <FieldLabel for="showcase-label-optional" optional>Notas internas</FieldLabel>
                        <FieldLabel as="span">Rótulo só de leitura</FieldLabel>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection id="inputs" title="Input e Textarea" description="Input com ícones opcionais; Textarea sem ícones. Desactivado: 60% opacidade e select-none.">
                    <div class="flex max-w-md flex-col gap-6">
                        <div>
                            <FieldLabel for="showcase-input-default" class="mb-2 block">Input normal</FieldLabel>
                            <Input id="showcase-input-default" v-model="inputValue" class="w-full" placeholder="Escreve algo" />
                        </div>
                        <div>
                            <FieldLabel for="showcase-input-left" class="mb-2 block">leftIcon</FieldLabel>
                            <Input id="showcase-input-left" v-model="inputValue" class="w-full" left-icon="clock" type="time" />
                        </div>
                        <div>
                            <FieldLabel for="showcase-input-right" class="mb-2 block">rightIcon</FieldLabel>
                            <Input id="showcase-input-right" v-model="inputValue" class="w-full" right-icon="clock" />
                        </div>
                        <div>
                            <FieldLabel for="showcase-input-error" class="mb-2 block" required>Com erro</FieldLabel>
                            <Input
                                id="showcase-input-error"
                                v-model="inputErrorValue"
                                class="w-full"
                                :class="inputErrorClass"
                                placeholder="Campo inválido"
                            />
                            <p class="mt-2 text-sm font-medium text-red-600">Este campo é obrigatório.</p>
                        </div>
                        <div>
                            <FieldLabel for="showcase-input-disabled" class="mb-2 block">Desactivado</FieldLabel>
                            <Input id="showcase-input-disabled" class="w-full" model-value="Valor fixo" disabled />
                        </div>
                        <div>
                            <FieldLabel for="showcase-textarea" class="mb-2 block">Textarea</FieldLabel>
                            <Textarea id="showcase-textarea" v-model="textareaValue" class="w-full min-w-0" />
                        </div>
                        <div>
                            <FieldLabel for="showcase-textarea-disabled" class="mb-2 block">Textarea desactivado</FieldLabel>
                            <Textarea id="showcase-textarea-disabled" model-value="Texto fixo" class="w-full min-w-0" disabled />
                        </div>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection id="select" title="Select" description="Desactivado: 60% opacidade e select-none. panelPlacement above para abrir o painel para cima.">
                    <div class="flex max-w-md flex-col gap-6">
                        <div>
                            <FieldLabel class="mb-2 block">Estado da campanha</FieldLabel>
                            <Select v-model="selectValue" class="w-full min-w-0" :options="selectOptions" placeholder="Escolhe um estado" />
                        </div>
                        <div>
                            <FieldLabel class="mb-2 block">Select desactivado</FieldLabel>
                            <Select v-model="selectDisabledValue" class="w-full min-w-0" :options="selectOptions" placeholder="Indisponível" disabled />
                        </div>
                        <div>
                            <FieldLabel class="mb-2 block">panelPlacement=&quot;above&quot;</FieldLabel>
                            <Select v-model="selectAboveValue" class="w-full min-w-0" :options="selectOptions" panel-placement="above" placeholder="Abre para cima" />
                        </div>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection id="searchable-select" title="SearchableSelect" description="Pesquisa com destaque de texto; creatable mostra «Criar …» quando não há correspondência exacta.">
                    <div class="flex max-w-md flex-col gap-6">
                        <div>
                            <FieldLabel class="mb-2 block" required>Categoria</FieldLabel>
                            <SearchableSelect
                                v-model="searchableSelectValue"
                                class="w-full min-w-0"
                                :options="wasteCategorySelectOptions"
                                placeholder="Tipo de material"
                                :creatable="searchableSelectCreatable"
                                @create-option="(name) => { searchableSelectValue = `demo-new-${name}` }"
                            />
                        </div>
                        <label class="flex items-center gap-2 text-sm text-neutral-700">
                            <input v-model="searchableSelectCreatable" type="checkbox" class="size-4 rounded border-neutral-300" />
                            Creatable activo
                        </label>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection id="modal" title="Modal" description="ModalRoot md/lg, ModalCloseButton isolado e formulário de exemplo.">
                    <div class="flex flex-wrap gap-3">
                        <Button type="button" @click="modalOpenMd = true">Modal md</Button>
                        <Button type="button" variant="secondary" @click="modalOpenLg = true">Modal lg</Button>
                        <ModalCloseButton @click="() => {}" />
                    </div>
                    <ModalRoot v-model="modalOpenMd" ariaLabelledby="showcase-modal-title-md" max-width="md">
                        <div class="flex items-start justify-between gap-3">
                            <h2 id="showcase-modal-title-md" class="text-lg font-semibold leading-6 text-neutral-950">Modal md</h2>
                            <ModalCloseButton @click="modalOpenMd = false" />
                        </div>
                        <p class="text-sm leading-5 text-neutral-600">Testa fechar com Escape, clique no fundo ou no botão de fechar.</p>
                        <form class="flex flex-col gap-4" @submit.prevent="modalOpenMd = false">
                            <div>
                                <FieldLabel for="showcase-modal-input" class="mb-2 block" required>Título</FieldLabel>
                                <Input id="showcase-modal-input" class="w-full" placeholder="Nome" />
                            </div>
                            <div class="flex justify-end gap-2">
                                <Button type="button" variant="secondary" @click="modalOpenMd = false">Cancelar</Button>
                                <Button type="submit">Guardar</Button>
                            </div>
                        </form>
                    </ModalRoot>
                    <ModalRoot v-model="modalOpenLg" ariaLabelledby="showcase-modal-title-lg" max-width="lg">
                        <div class="flex items-start justify-between gap-3">
                            <h2 id="showcase-modal-title-lg" class="text-lg font-semibold leading-6 text-neutral-950">Modal lg</h2>
                            <ModalCloseButton @click="modalOpenLg = false" />
                        </div>
                        <p class="text-sm leading-5 text-neutral-600">maxWidth=&quot;lg&quot; — usado em formulários mais largos.</p>
                    </ModalRoot>
                </ShowcaseSection>

                <ShowcaseSection
                    id="tooltip"
                    title="Tooltip"
                    description="Esqueleto visual: aparece no hover (group). content-class !opacity-100 para rever o balão e a seta sem hover. Abre acima do trigger; seta centrada por baixo."
                >
                    <div class="flex flex-wrap items-end gap-12 pt-20 pb-4">
                        <Tooltip>
                            <span class="cursor-default border-b border-dotted border-neutral-400 text-sm font-medium text-neutral-950">
                                Passa o rato
                            </span>
                            <template #content>Texto de ajuda no tooltip.</template>
                        </Tooltip>
                        <Tooltip content-class="!opacity-100">
                            <Button type="button" variant="secondary">Sempre visível</Button>
                            <template #content>
                                Campanha de limpeza da Praia da Barra — edição 2026
                            </template>
                        </Tooltip>
                        <Tooltip content-class="!opacity-100">
                            <span class="max-w-32 truncate text-sm font-medium text-neutral-950 tabular-nums">
                                Título muito longo da campanha…
                            </span>
                            <template #content>
                                Limpeza costeira Ria de Aveiro — norte, Matosinhos e zona envolvente
                            </template>
                        </Tooltip>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection id="states" title="Estados de recurso" description="Empty e error states usados em listagens.">
                    <div class="grid min-h-[12rem] gap-6 rounded-xl border border-neutral-200 bg-white md:grid-cols-2">
                        <ResourceEmptyState
                            title="Sem campanhas"
                            hint="Quando existirem campanhas na tua área, aparecem aqui."
                            action-label="Criar campanha"
                            @action="() => {}"
                        />
                        <ResourceErrorState
                            title="Não foi possível carregar"
                            hint="Verifica a ligação e tenta outra vez."
                            action-label="Tentar novamente"
                            @retry="() => {}"
                        />
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    id="api-states"
                    title="Estados da API"
                    description="Valores e apresentação alinhados ao contrato REST (badges onde a app os usa; restantes como na tabela de detalhe)."
                >
                    <div class="flex flex-col gap-8">
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Campanha — detalhe (status agrupado na UI)</p>
                            <div class="flex flex-wrap gap-2">
                                <ApiStateBadge
                                    v-for="s in campaignDetailStatusSamples"
                                    :key="s"
                                    v-bind="campaignDetailStatusBadge(s)"
                                />
                            </div>
                        </div>
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Campanha — escrita (status no body)</p>
                            <ul class="grid gap-2 sm:grid-cols-2">
                                <li
                                    v-for="item in CAMPAIGN_EDIT_STATUS_ITEMS"
                                    :key="item.apiKey"
                                    class="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-card"
                                >
                                    <span class="font-medium text-neutral-900">{{ item.label }}</span>
                                    <span class="font-mono text-xs text-neutral-500">{{ item.apiKey }} · BD {{ item.db }}</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Conta de utilizador</p>
                            <div class="flex flex-wrap gap-2">
                                <ApiStateBadge v-bind="userAccountStateBadge(true)" />
                                <ApiStateBadge v-bind="userAccountStateBadge(false)" />
                            </div>
                        </div>
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Comentário (moderação)</p>
                            <ApiStateBadge v-bind="COMMENT_HIDDEN_BADGE" />
                        </div>
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Inscrição — função e estado (badges na tabela)</p>
                            <DataTableScrollWrap>
                                <table class="w-full min-w-[320px] table-fixed border-collapse text-left">
                                    <thead class="sticky top-0 z-10 bg-white">
                                        <tr class="border-b border-neutral-200">
                                            <DataTableTh>Campo API</DataTableTh>
                                            <DataTableTh>Exemplo</DataTableTh>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="row in REGISTRATION_ROLE_ITEMS"
                                            :key="`role-${row.value}`"
                                            class="border-b border-neutral-200 last:border-b-0"
                                        >
                                            <DataTableTd emphasis>role = {{ row.value }}</DataTableTd>
                                            <DataTableTd :truncate="false">
                                                <ApiStateBadge v-bind="registrationRoleTableBadge(row.value)" />
                                            </DataTableTd>
                                        </tr>
                                        <tr
                                            v-for="row in REGISTRATION_STATUS_ITEMS"
                                            :key="`status-${row.value}`"
                                            class="border-b border-neutral-200 last:border-b-0"
                                        >
                                            <DataTableTd emphasis>status = {{ row.value }}</DataTableTd>
                                            <DataTableTd :truncate="false">
                                                <ApiStateBadge v-bind="registrationStatusTableBadge(row.value)" />
                                            </DataTableTd>
                                        </tr>
                                    </tbody>
                                </table>
                            </DataTableScrollWrap>
                        </div>
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Resíduo — categoria e unidade (badges na tabela)</p>
                            <div class="flex flex-wrap gap-2">
                                <ApiStateBadge
                                    v-for="c in WASTE_CATEGORY_ITEMS"
                                    :key="c.apiKey"
                                    v-bind="wasteCategoryTableBadge(c.label)"
                                />
                                <ApiStateBadge
                                    v-for="u in WASTE_UNIT_ITEMS"
                                    :key="u.apiKey"
                                    v-bind="wasteUnitTableBadge(u.apiKey)"
                                />
                            </div>
                        </div>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    id="table"
                    title="Tabela (como na app)"
                    description="Listagem Campanhas: contentor branco da shell, cabeçalho + ScrollableTableSection + paginação no rodapé."
                >
                    <div class="flex flex-col gap-6 rounded-2xl bg-white p-6 md:rounded-t-lg">
                        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <h2 class="text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">Campanhas</h2>
                            <Button class="w-full shrink-0 touch-manipulation sm:w-auto">Criar Campanha</Button>
                        </div>
                        <ScrollableTableSection fill-container>
                            <CampaignsListState
                                :items="campaignDemoItems"
                                @select="() => {}"
                                @edit="() => {}"
                                @delete="() => {}"
                            />
                            <template #footer>
                                <ListPaginationBar
                                    :page="campaignDemoPage"
                                    :page-size="10"
                                    :total="campaignDemoTotal"
                                    @prev="campaignDemoPage = Math.max(1, campaignDemoPage - 1)"
                                    @next="campaignDemoPage = Math.min(Math.ceil(campaignDemoTotal / 10), campaignDemoPage + 1)"
                                />
                            </template>
                        </ScrollableTableSection>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection id="pagination" title="ListPaginationBar" description="Estados: meio, primeira página (Anterior off), última página (Seguinte off).">
                    <div class="flex flex-col gap-4">
                        <ListPaginationBar :page="paginationPage" :page-size="5" :total="47" @prev="paginationPage = Math.max(1, paginationPage - 1)" @next="paginationPage = paginationPage + 1" />
                        <ListPaginationBar :page="paginationFirstPage" :page-size="5" :total="47" @prev="paginationFirstPage = Math.max(1, paginationFirstPage - 1)" @next="paginationFirstPage = paginationFirstPage + 1" />
                        <ListPaginationBar :page="paginationLastPage" :page-size="5" :total="47" @prev="paginationLastPage = Math.max(1, paginationLastPage - 1)" @next="paginationLastPage = paginationLastPage + 1" />
                    </div>
                </ShowcaseSection>

                <ShowcaseSection id="logo" title="Logo Mariva" description="Variantes usadas na app: ícone no header autenticado e wordmark nas páginas públicas.">
                    <div class="flex flex-col gap-8">
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">LogoMark — header (autenticado)</p>
                            <div class="flex flex-wrap items-end gap-8 bg-neutral-950 px-4 py-6">
                                <div class="flex flex-col items-center gap-2">
                                    <LogoMark />
                                    <span class="text-xs text-neutral-400">predefinido (28×28)</span>
                                </div>
                                <div class="flex flex-col items-center gap-2">
                                    <LogoMark class="size-7" />
                                    <span class="text-xs text-neutral-400">class="size-7"</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p class="mb-3 text-sm font-medium text-neutral-800">Logo com texto — páginas públicas</p>
                            <div class="flex flex-wrap items-center gap-8 rounded-lg bg-white px-4 py-6 shadow-card">
                                <img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
                                <span class="text-xs text-neutral-500">h-8 w-auto (login, início, solicitar acesso)</span>
                            </div>
                        </div>
                    </div>
                </ShowcaseSection>




                <ShowcaseSection id="icons" title="Ícones" description="Todos os SVG em shared/components/icons e toast (Select* usados dentro do Select aberto).">
                    <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        <li
                            v-for="icon in iconShowcase"
                            :key="icon.name"
                            class="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 bg-white p-4 text-center"
                        >
                            <component :is="icon.component" class="text-neutral-700" />
                            <span class="text-xs font-medium text-neutral-600">{{ icon.name }}</span>
                        </li>
                    </ul>
                </ShowcaseSection>

                <ShowcaseSection id="toasts" title="Toasts" description="Dispara cada variante (canto inferior direito).">
                    <div class="flex flex-wrap gap-3">
                        <Button type="button" variant="secondary" @click="toastSuccess('Operação concluída', 'Alterações guardadas.')">Success</Button>
                        <Button type="button" variant="secondary" @click="toastError('Não foi possível guardar', 'Tenta outra vez.')">Error</Button>
                        <Button type="button" variant="secondary" @click="toastWarning('Atenção', 'Revê os dados antes de continuar.')">Warning</Button>
                        <Button
                            type="button"
                            variant="secondary"
                            @click="toastAccountBlocked('Conta bloqueada', 'Conta suspensa após revisão (exemplo).')"
                        >
                            Conta bloqueada
                        </Button>
                        <Button type="button" variant="secondary" @click="toastServiceUnavailable('O serviço está temporariamente indisponível.')">
                            Serviço indisponível
                        </Button>
                        <Button type="button" variant="secondary" @click="toastListPossiblyStale()">Lista desatualizada</Button>
                    </div>
                </ShowcaseSection>
            </main>
        </div>
    </div>
</template>

