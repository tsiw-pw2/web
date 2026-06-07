import { computed, ref, watch, type Ref } from "vue"
import { toastError, toastSuccess } from "@/infrastructure/appToast"
import { isApiRequestError } from "@/infrastructure/request"
import { isApiServiceUnavailableError } from "@/infrastructure/apiErrors"
import { isEnrollmentClosedStatus, ENROLLABLE_CAMPAIGN_STATUS_KEYS } from "@/modules/campaigns/lib/campaignStatus"
import { canSelfEnrollInCampaign } from "@/modules/campaigns/lib/canSelfEnrollInCampaign"
import { hasActiveRegistration } from "@/modules/campaigns/lib/canVolunteerEnroll"
import { shouldReloadRegistrationsListAfterChange } from "@/modules/campaigns/lib/shouldReloadRegistrationsListAfterChange"
import { viewerRegistrationBelongsToProfile } from "@/modules/campaigns/lib/viewerRegistrationOwnership"
import { mergeCampaignEnrollmentSnapshot } from "@/modules/campaigns/lib/mergeCampaignEnrollmentSnapshot"
import { createCampaignRegistration, patchRegistration, type PatchRegistrationBody } from "@/modules/campaigns/services/campaignRegistrations"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import type { CampaignDetails, CampaignDetailsRegistration, CampaignDetailsViewerRegistration } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"
import { campaignEnrollmentProfileBlockMessage } from "@/shared/lib/birthDate"

// Mostra toast de erro adequado a falhas de gestão de inscrições (org/admin).
function registrationManagementToastError(e: unknown, fallbackTitle: string) {
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

// Toast para falhas de auto-inscrição - usa mensagem da API, nunca texto de permissão.
function enrollmentToastError(e: unknown, fallbackTitle: string) {
    if (isApiRequestError(e)) {
        if (e.httpStatus === 403 && e.message.trim()) {
            toastError(e.message)
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
        if (e.httpStatus >= 500) {
            toastError(fallbackTitle, "Ocorreu um erro no servidor. Tenta outra vez.")
            return
        }
    }
    if (isApiServiceUnavailableError(e)) {
        toastError(fallbackTitle, "Verifica a ligação e tenta outra vez.")
        return
    }
    toastError(fallbackTitle, "Ocorreu um erro inesperado. Tenta outra vez.")
}

// Composable que gere a lógica de campanha inscrição actions.
export function useCampaignRegistrationActions(
    campaignId: Ref<string>,
    campaign: Ref<CampaignDetails | null>,
    profile: Ref<SettingsProfile | null>,
    reloadRegistrationsFirstPage: (options?: { silent?: boolean }) => void | Promise<void>,
) {
    const myRegistration = ref<CampaignDetailsViewerRegistration | null>(null)
    const enrolling = ref(false)
    const canceling = ref(false)
    const savingRegistrationId = ref<string | null>(null)

    const editRegistrationOpen = ref(false)
    const editRegistrationTarget = ref<CampaignDetailsRegistration | null>(null)

    const cancelRegistrationOpen = ref(false)

// Sincroniza my inscrição de campanha (só se pertencer ao perfil autenticado).
    function syncMyRegistrationFromCampaign(c: CampaignDetails | null) {
        const reg = c?.viewerRegistration ?? null
        myRegistration.value = viewerRegistrationBelongsToProfile(reg, profile.value) ? reg : null
    }

    function ownedViewerRegistration(): CampaignDetailsViewerRegistration | null {
        const snapshot = campaign.value?.viewerRegistration ?? null
        const local = myRegistration.value
        const reg =
            local && viewerRegistrationBelongsToProfile(local, profile.value)
                ? local
                : snapshot && viewerRegistrationBelongsToProfile(snapshot, profile.value)
                  ? snapshot
                  : null
        return reg
    }

    watch(campaignId, () => {
        myRegistration.value = null
    })

    watch(
        () => profile.value?.id,
        () => {
            myRegistration.value = null
        },
    )

    const canManageRegistrations = computed(() => {
        const c = campaign.value
        const p = profile.value
        if (!c || !p) return false
        return p.isAdmin || c.organizer?.id === p.id
    })

    const canEnroll = computed(() => canSelfEnrollInCampaign(campaign.value, profile.value))

    const showEnrollmentClosed = computed(() => {
        const c = campaign.value
        if (!c || !profile.value) return false
        if (canEnroll.value) return false
        if (hasActiveRegistration(ownedViewerRegistration())) return false
        return isEnrollmentClosedStatus(c.editStatus)
    })

    const showMyRegistrationStatus = computed(() => hasActiveRegistration(ownedViewerRegistration()))

    const enrollmentProfileBlockReason = computed(() => {
        const c = campaign.value
        const p = profile.value
        const reg = ownedViewerRegistration()
        if (!c || !p || p.isBlocked) return null
        if (c.viewerCanEnroll === true) return null
        if (!ENROLLABLE_CAMPAIGN_STATUS_KEYS.has(c.editStatus)) return null
        if (hasActiveRegistration(reg)) return null
        return campaignEnrollmentProfileBlockMessage(p.birthDate)
    })

    const showAlreadyEnrolledHint = computed(() => {
        if (canEnroll.value || showMyRegistrationStatus.value) return false
        if (enrollmentProfileBlockReason.value || showEnrollmentClosed.value) return false
        const reg = ownedViewerRegistration()
        return hasActiveRegistration(reg)
    })

// Refresca a campanha e a primeira página de inscrições após mudança de inscrição.
    async function refreshCampaignAfterRegistrationChange() {
        if (!campaignId.value) return
        try {
            const d = await getCampaignDetails(campaignId.value)
            if (campaign.value) {
                mergeCampaignEnrollmentSnapshot(campaign.value, d)
            }
            syncMyRegistrationFromCampaign(d)
        } catch {
            /* ignore */
        }
        if (shouldReloadRegistrationsListAfterChange(canManageRegistrations.value)) {
            await reloadRegistrationsFirstPage({ silent: true })
        }
    }

// Inscreve o utilizador na campanha e sincroniza o estado local.
    async function enroll() {
        if (!canEnroll.value || enrolling.value) return
        enrolling.value = true
        try {
            if (!campaignId.value || !campaign.value) return

            const fresh = await getCampaignDetails(campaignId.value)
            mergeCampaignEnrollmentSnapshot(campaign.value, fresh)
            syncMyRegistrationFromCampaign(fresh)

            if (fresh.viewerCanEnroll !== true) {
                const ownedFresh = viewerRegistrationBelongsToProfile(fresh.viewerRegistration, profile.value)
                    ? fresh.viewerRegistration
                    : null
                if (hasActiveRegistration(ownedFresh)) {
                    toastError("Já tens uma inscrição nesta campanha.")
                } else if (!ENROLLABLE_CAMPAIGN_STATUS_KEYS.has(fresh.editStatus)) {
                    toastError("As inscrições não estão abertas nesta campanha.")
                } else {
                    toastError("Não foi possível concluir a inscrição.")
                }
                return
            }

            const created = await createCampaignRegistration(fresh)
            const profileId = profile.value?.id
            if (!profileId) return
            myRegistration.value = {
                id: created.id,
                userId: profileId,
                role: created.role,
                status: created.status,
                attendance: created.attendance,
            }
            toastSuccess("Inscrição registada")
            await refreshCampaignAfterRegistrationChange()
        } catch (e) {
            await refreshCampaignAfterRegistrationChange()
            enrollmentToastError(e, "Não foi possível concluir a inscrição.")
        } finally {
            enrolling.value = false
        }
    }

// Verifica se é possível cel my inscrição.
    async function cancelMyRegistration() {
        const reg = ownedViewerRegistration()
        if (!reg || reg.status === 2 || canceling.value) return
        canceling.value = true
        try {
            const updated = await patchRegistration(reg, { status: 2 })
            const profileId = profile.value?.id
            if (profileId) {
                myRegistration.value = {
                    id: updated.id,
                    userId: profileId,
                    role: updated.role,
                    status: updated.status,
                    attendance: updated.attendance,
                }
            }
            toastSuccess("Inscrição cancelada")
            cancelRegistrationOpen.value = false
            await refreshCampaignAfterRegistrationChange()
        } catch (e) {
            registrationManagementToastError(e, "Não foi possível cancelar a inscrição.")
        } finally {
            canceling.value = false
        }
    }

// Abre edição inscrição.
    function openEditRegistration(row: CampaignDetailsRegistration) {
        editRegistrationTarget.value = row
        editRegistrationOpen.value = true
    }

// Persiste as alterações da inscrição em edição na API.
    async function saveEditRegistration(body: PatchRegistrationBody) {
        const target = editRegistrationTarget.value
        if (!target || savingRegistrationId.value) return
        savingRegistrationId.value = target.id
        try {
            await patchRegistration(target, body)
            toastSuccess("Inscrição atualizada")
            editRegistrationOpen.value = false
            editRegistrationTarget.value = null
            await refreshCampaignAfterRegistrationChange()
        } catch (e) {
            registrationManagementToastError(e, "Não foi possível guardar a inscrição.")
        } finally {
            savingRegistrationId.value = null
        }
    }

    return {
        myRegistration,
        enrolling,
        canceling,
        savingRegistrationId,
        editRegistrationOpen,
        editRegistrationTarget,
        cancelRegistrationOpen,
        syncMyRegistrationFromCampaign,
        canManageRegistrations,
        canEnroll,
        showEnrollmentClosed,
        enrollmentProfileBlockReason,
        showAlreadyEnrolledHint,
        showMyRegistrationStatus,
        enroll,
        cancelMyRegistration,
        openEditRegistration,
        saveEditRegistration,
    }
}
