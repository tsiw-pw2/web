import { computed, ref, type Ref } from "vue"
import { toastError, toastSuccess } from "@/infrastructure/appToast"
import { isApiRequestError } from "@/infrastructure/request"
import { isEnrollmentClosedStatus } from "@/modules/campaigns/lib/campaignStatus"
import { canVolunteerEnroll, hasActiveRegistration } from "@/modules/campaigns/lib/canVolunteerEnroll"
import {
    createCampaignRegistration,
    deleteRegistration,
    patchRegistration,
    type PatchRegistrationBody,
} from "@/modules/campaigns/services/campaignRegistrations"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import type {
    CampaignDetails,
    CampaignDetailsRegistration,
    CampaignDetailsViewerRegistration,
} from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"

function registrationToastError(e: unknown, fallbackTitle: string) {
    if (isApiRequestError(e)) {
        if (e.httpStatus === 403) {
            toastError("Não tens permissão para esta ação.")
            return
        }
        if (e.httpStatus === 404) {
            toastError("Campanha ou inscrição não encontrada.")
            return
        }
        if (e.httpStatus === 400) {
            toastError(fallbackTitle)
            return
        }
    }
    toastError(fallbackTitle, "Verifica a ligação e tenta outra vez.")
}

export function useCampaignRegistrationActions(
    campaignId: Ref<string>,
    campaign: Ref<CampaignDetails | null>,
    profile: Ref<SettingsProfile | null>,
    reloadRegistrationsFirstPage: () => void | Promise<void>,
) {
    const myRegistration = ref<CampaignDetailsViewerRegistration | null>(null)
    const enrolling = ref(false)
    const canceling = ref(false)
    const savingRegistrationId = ref<string | null>(null)
    const deletingRegistrationId = ref<string | null>(null)

    const editRegistrationOpen = ref(false)
    const editRegistrationTarget = ref<CampaignDetailsRegistration | null>(null)

    const cancelRegistrationOpen = ref(false)
    const deleteRegistrationOpen = ref(false)
    const deleteRegistrationTarget = ref<CampaignDetailsRegistration | null>(null)

    function syncMyRegistrationFromCampaign(c: CampaignDetails | null) {
        myRegistration.value = c?.viewerRegistration ?? null
    }

    const canManageRegistrations = computed(() => {
        const c = campaign.value
        const p = profile.value
        if (!c || !p) return false
        return p.isAdmin || c.organizer?.id === p.id
    })

    const canEnroll = computed(() => {
        const c = campaign.value
        if (!c) return false
        return canVolunteerEnroll(c, profile.value, myRegistration.value)
    })

    const showEnrollmentClosed = computed(() => {
        const c = campaign.value
        if (!c || !profile.value) return false
        if (c.organizer?.id === profile.value.id) return false
        if (canEnroll.value) return false
        if (hasActiveRegistration(myRegistration.value)) return false
        return isEnrollmentClosedStatus(c.editStatus)
    })

    const showMyRegistrationStatus = computed(() => hasActiveRegistration(myRegistration.value))

    async function refreshCampaignAfterRegistrationChange() {
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
        await reloadRegistrationsFirstPage()
    }

    async function enroll() {
        if (!canEnroll.value || enrolling.value) return
        enrolling.value = true
        try {
            const created = await createCampaignRegistration(campaignId.value)
            myRegistration.value = {
                id: created.id,
                role: created.role,
                status: created.status,
                attendance: created.attendance,
            }
            toastSuccess("Inscrição registada")
            await refreshCampaignAfterRegistrationChange()
        } catch (e) {
            registrationToastError(e, "Não foi possível concluir a inscrição.")
        } finally {
            enrolling.value = false
        }
    }

    async function cancelMyRegistration() {
        const reg = myRegistration.value
        if (!reg || reg.status === 2 || canceling.value) return
        canceling.value = true
        try {
            const updated = await patchRegistration(reg.id, { status: 2 })
            myRegistration.value = {
                id: updated.id,
                role: updated.role,
                status: updated.status,
                attendance: updated.attendance,
            }
            toastSuccess("Inscrição cancelada")
            cancelRegistrationOpen.value = false
            await refreshCampaignAfterRegistrationChange()
        } catch (e) {
            registrationToastError(e, "Não foi possível cancelar a inscrição.")
        } finally {
            canceling.value = false
        }
    }

    function openEditRegistration(row: CampaignDetailsRegistration) {
        editRegistrationTarget.value = row
        editRegistrationOpen.value = true
    }

    async function saveEditRegistration(body: PatchRegistrationBody) {
        const target = editRegistrationTarget.value
        if (!target || savingRegistrationId.value) return
        savingRegistrationId.value = target.id
        try {
            await patchRegistration(target.id, body)
            toastSuccess("Inscrição atualizada")
            editRegistrationOpen.value = false
            editRegistrationTarget.value = null
            await refreshCampaignAfterRegistrationChange()
        } catch (e) {
            registrationToastError(e, "Não foi possível guardar a inscrição.")
        } finally {
            savingRegistrationId.value = null
        }
    }

    function openDeleteRegistration(row: CampaignDetailsRegistration) {
        deleteRegistrationTarget.value = row
        deleteRegistrationOpen.value = true
    }

    async function confirmDeleteRegistration() {
        const target = deleteRegistrationTarget.value
        if (!target || deletingRegistrationId.value) return
        deletingRegistrationId.value = target.id
        try {
            await deleteRegistration(target.id)
            toastSuccess("Inscrição removida")
            deleteRegistrationOpen.value = false
            deleteRegistrationTarget.value = null
            await refreshCampaignAfterRegistrationChange()
        } catch (e) {
            registrationToastError(e, "Não foi possível remover a inscrição.")
        } finally {
            deletingRegistrationId.value = null
        }
    }

    return {
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
    }
}
