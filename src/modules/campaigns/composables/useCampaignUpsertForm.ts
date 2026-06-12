import { computed, reactive, watch, type Ref } from "vue"
import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import type { BeachListItem } from "@/modules/beaches/types/list"
import type { CampaignDetails } from "@/modules/campaigns/types/details"
import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { getActiveOrganizationId } from "@/infrastructure/active-organization"
import { beachesListRef, loadBeachesList } from "@/modules/beaches/services/beachesList"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import { CAMPAIGN_CREATE_DEFAULT_STATUS } from "@/modules/campaigns/lib/campaignStatus"
import { toastError } from "@/infrastructure/appToast"
import { toDateInputValueFromUnknown } from "@/shared/lib/dateInputValue"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"

export type CampaignUpsertMode = "create" | "edit"

function normalizeMunicipality(value: string): string {
    return value.trim().toLocaleLowerCase("pt-PT")
}

function sortBeachesByName(beaches: BeachListItem[]): BeachListItem[] {
    return beaches.slice().sort((a, b) => a.name.localeCompare(b.name, "pt"))
}

export function useCampaignUpsertForm(
    open: Ref<boolean>,
    mode: CampaignUpsertMode,
    campaign: Ref<CampaignListItem | null | undefined>,
    onComplete: (payload: CampaignCreateDraft) => void,
) {
    const isEdit = computed(() => mode === "edit")
    const { profile } = useCurrentProfile()

    const activeOrganizationMunicipality = computed(() => {
        const orgId = getActiveOrganizationId()
        if (!orgId) return null
        return profile.value?.organizations?.find((org) => org.id === orgId)?.municipality ?? null
    })

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
        get beachesStepTitle() {
            if (isEdit.value) {
                const code = form.district
                if (!code) return "Praias"
                return DISTRICT_SELECT_OPTIONS.find((option) => option.value === code)?.label ?? "Praias"
            }
            return activeOrganizationMunicipality.value ?? "Praias do concelho"
        },
        get beachesForSelection(): BeachListItem[] {
            if (isEdit.value && form.district) {
                return sortBeachesByName(
                    beachesListRef.value.filter((beach) => beach.district === form.district),
                )
            }
            const municipality = activeOrganizationMunicipality.value
            if (!municipality) return []
            const target = normalizeMunicipality(municipality)
            return sortBeachesByName(
                beachesListRef.value.filter(
                    (beach) => normalizeMunicipality(beach.municipality) === target,
                ),
            )
        },
        get canStep0Next() {
            if (form.title.trim().length === 0) return false
            if (form.meetingTime.trim().length === 0) return false
            if (form.startDate.trim().length === 0) return false
            if (!form.status) return false
            if (!form.district) return false
            if (!isEdit.value && form.beachesForSelection.length === 0) return false
            return true
        },
        get canSubmitBeaches() {
            return form.selectedBeachIds.length > 0
        },
    })

    function syncDistrictFromOrganization() {
        if (isEdit.value) return
        const beaches = form.beachesForSelection
        form.district = beaches[0]?.district
    }

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

    async function goToBeachStep(formEl: HTMLFormElement, stepAreaEl: HTMLElement | null) {
        if (!form.canStep0Next) return
        if (!formEl.reportValidity()) return

        if (!isEdit.value && form.beachesForSelection.length === 0) {
            toastError(
                "Sem praias no concelho",
                "Não há praias registadas para o concelho da tua organização. Adiciona praias no separador Praias e volta a tentar.",
            )
            return
        }

        form.beachesLoading = true
        try {
            await loadBeachesList({ page: 1, pageSize: 100 })
            syncDistrictFromOrganization()
            if (!isEdit.value && form.beachesForSelection.length === 0) return
            form.lockedStepHeight = stepAreaEl?.offsetHeight ?? null
            form.step = 1
            if (!isEdit.value) {
                form.selectedBeachIds = []
            }
        } finally {
            form.beachesLoading = false
        }
    }

    function goBackToDetails() {
        form.step = 0
        form.lockedStepHeight = null
    }

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

    function onFinalSubmit(formEl: HTMLFormElement) {
        if (!form.canSubmitBeaches || !form.district) return
        if (!formEl.reportValidity()) return
        onComplete(buildDraft())
        open.value = false
    }

    async function handleFormSubmit(formEl: HTMLFormElement | null, stepAreaEl: HTMLElement | null) {
        if (!formEl) return
        if (form.step === 0) {
            syncDistrictFromOrganization()
            await goToBeachStep(formEl, stepAreaEl)
            return
        }
        onFinalSubmit(formEl)
    }

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
                syncDistrictFromOrganization()
            } finally {
                form.beachesLoading = false
            }
            if (isEdit.value && campaignId) {
                await loadDetailsForEdit(campaignId)
            }
        },
        { immediate: true },
    )

    return {
        form,
        handleFormSubmit,
        goBackToDetails,
        close,
    }
}
