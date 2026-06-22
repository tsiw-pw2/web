import { computed, reactive, watch, type Ref } from "vue"
import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import type { BeachListItem } from "@/modules/beaches/types/list"
import type { CampaignDetails } from "@/modules/campaigns/types/details"
import { beachesListRef, loadBeachesList } from "@/modules/beaches/services/beachesList"
import { districtSelectOptionsForBeaches } from "@/modules/beaches/lib/districtSelectOptionsForBeaches"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import { CAMPAIGN_CREATE_DEFAULT_STATUS } from "@/modules/campaigns/lib/campaignStatus"
import { toastError } from "@/infrastructure/appToast"
import { toDateInputValueFromUnknown } from "@/shared/lib/dateInputValue"

export type CampaignUpsertMode = "create" | "edit"

// Composable que gere a lógica de campanha criação ou actualização formulário.
export function useCampaignUpsertForm(
    open: Ref<boolean>,
    mode: CampaignUpsertMode,
    campaign: Ref<CampaignListItem | null | undefined>,
    onComplete: (payload: CampaignCreateDraft) => void,
) {
    const isEdit = computed(() => mode === "edit")

    const form = reactive({
        step: 0 as 0 | 1,
        lockedStepHeight: null as number | null,
        title: "",
        meetingTime: "",
        startDate: "",
        endDate: "",
        status: undefined as string | undefined,
        information: "",
        district: undefined as string | undefined,
        selectedBeachIds: [] as string[],
        beachesLoading: false,
        detailsLoading: false,
        get isEdit() {
            return isEdit.value
        },
        get districtOptions() {
            return districtSelectOptionsForBeaches(beachesListRef.value)
        },
        get districtPlaceholder() {
            if (form.beachesLoading) return "A carregar distritos…"
            if (form.districtOptions.length === 0) return "Regista praias para escolher um distrito"
            return "Seleciona um distrito"
        },
        get districtLabel() {
            const d = form.district
            if (!d) return ""
            return DISTRICT_SELECT_OPTIONS.find((o) => o.value === d)?.label ?? ""
        },
        get beachesForDistrict(): BeachListItem[] {
            const d = form.district
            if (!d) return []
            return beachesListRef.value
                .filter((b: BeachListItem) => b.district === d)
                .slice()
                .sort((a: BeachListItem, b: BeachListItem) => a.name.localeCompare(b.name, "pt"))
        },
        get canStep0Next() {
            if (form.title.trim().length === 0) return false
            if (form.meetingTime.trim().length === 0) return false
            if (form.startDate.trim().length === 0) return false
            if (!form.status) return false
            if (!form.district) return false
            if (!isEdit.value && form.beachesForDistrict.length === 0) return false
            return true
        },
        get canSubmitBeaches() {
            return form.selectedBeachIds.length > 0
        },
    })

    // Aplica detalhes.
    function applyDetails(d: CampaignDetails) {
        form.title = d.title
        form.meetingTime = d.meetingTime?.trim() ?? ""
        form.startDate = toDateInputValueFromUnknown(d.startDate)
        form.endDate = toDateInputValueFromUnknown(d.endDate)
        form.status = d.editStatus
        form.information = d.description?.trim() ?? ""
        form.district = d.districtCode ?? undefined
        form.selectedBeachIds = d.beaches.map((b) => b.id)
    }

    // Carrega detalhes para edição.
    async function loadDetailsForEdit(campaignId: string) {
        form.detailsLoading = true
        try {
            const d = await getCampaignDetails(campaignId)
            if (!open.value || campaign.value?.id !== campaignId) return
            applyDetails(d)
        } catch {
            if (open.value) {
                toastError("Não foi possível carregar", "Não foi possível obter os dados da campanha para editar.")
                open.value = false
            }
        } finally {
            form.detailsLoading = false
        }
    }

    // Navega para praia passo.
    async function goToBeachStep(formEl: HTMLFormElement, stepAreaEl: HTMLElement | null) {
        if (!form.canStep0Next) return
        if (!formEl.reportValidity()) return

        if (!isEdit.value && form.district && form.beachesForDistrict.length === 0) {
            toastError(
                "Sem praias no distrito",
                "Não há praias registadas neste distrito. Adiciona praias no separador Praias e volta a tentar.",
            )
            return
        }

        form.beachesLoading = true
        try {
            await loadBeachesList({ page: 1, pageSize: 100 })
            if (!isEdit.value && form.beachesForDistrict.length === 0) return
            form.lockedStepHeight = stepAreaEl?.offsetHeight ?? null
            form.step = 1
            if (!isEdit.value) {
                form.selectedBeachIds = []
            }
        } finally {
            form.beachesLoading = false
        }
    }

    // Navega volta para detalhes.
    function goBackToDetails() {
        form.step = 0
        form.lockedStepHeight = null
    }

    // Constrói draft.
    function buildDraft(): CampaignCreateDraft {
        const draft: CampaignCreateDraft = {
            title: form.title,
            meetingTime: form.meetingTime,
            startDate: form.startDate,
            endDate: form.endDate,
            status: form.status!,
            information: form.information,
            district: form.district,
        }
        if (!isEdit.value) {
            draft.beachIds = [...form.selectedBeachIds]
        }
        return draft
    }

    // Conclui o wizard e envia o rascunho final da campanha.
    function onFinalSubmit(formEl: HTMLFormElement) {
        if (!form.canSubmitBeaches || !form.district) return
        if (!formEl.reportValidity()) return
        onComplete(buildDraft())
        open.value = false
    }

    // Trata formulário submissão.
    async function handleFormSubmit(formEl: HTMLFormElement | null, stepAreaEl: HTMLElement | null) {
        if (!formEl) return
        if (form.step === 0) {
            if (!form.canStep0Next) return
            if (!formEl.reportValidity()) return
            if (isEdit.value) {
                onComplete(buildDraft())
                open.value = false
                return
            }
            await goToBeachStep(formEl, stepAreaEl)
            return
        }
        onFinalSubmit(formEl)
    }

    // Repõe formulário.
    function resetForm() {
        form.step = 0
        form.lockedStepHeight = null
        form.title = ""
        form.meetingTime = ""
        form.startDate = ""
        form.endDate = ""
        form.status = isEdit.value ? undefined : CAMPAIGN_CREATE_DEFAULT_STATUS
        form.information = ""
        form.district = undefined
        form.selectedBeachIds = []
    }

    // Fecha .
    function close() {
        open.value = false
    }

    watch(
        () => [open.value, campaign.value?.id] as const,
        async ([isOpen, campaignId]) => {
            if (!isOpen) return
            resetForm()
            form.beachesLoading = true
            try {
                await loadBeachesList({ page: 1, pageSize: 100 })
            } finally {
                form.beachesLoading = false
            }
            if (isEdit.value && campaignId) {
                await loadDetailsForEdit(campaignId)
            }
        },
        { immediate: true },
    )

    watch(
        () => form.districtOptions,
        (options) => {
            if (!form.district) return
            if (!options.some((option) => option.value === form.district)) {
                form.district = undefined
            }
        },
    )

    return {
        form,
        handleFormSubmit,
        goBackToDetails,
        close,
    }
}
