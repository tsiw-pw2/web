import { describeApiLoadFailure } from "@/infrastructure/apiErrors"
import { toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"
import type { SettingsUserDetailsTabId } from "@/modules/settings/lib/settingsUserDetailsTabs"
import {
    fetchSettingsUserDetail,
    fetchSettingsUserOrganizedCampaigns,
    fetchSettingsUserRegistrations,
} from "@/modules/settings/services/settingsUserDetails"
import { updateUserRole } from "@/modules/settings/services/settingsUsers"
import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"
import type { SettingsUserDetail, SettingsUserOrganizedCampaignRow, SettingsUserRegistrationRow } from "@/modules/settings/types/settingsUserDetails"
import { totalPagesFromTotal } from "@/shared/lib/pagination"
import { computed, ref, watch, type Ref } from "vue"

const TAB_PAGE_SIZE = 10

export function useSettingsUserDetails(userId: Ref<string>, activeTab: Ref<SettingsUserDetailsTabId>) {
    const user = ref<SettingsUserDetail | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)
    const savingRole = ref(false)
    const selectedRole = ref<SettingsUserRoleKey | undefined>(undefined)

    const registrations = ref<SettingsUserRegistrationRow[]>([])
    const registrationsPage = ref(1)
    const registrationsTotal = ref(0)
    const registrationsLoading = ref(false)

    const organizedCampaigns = ref<SettingsUserOrganizedCampaignRow[]>([])
    const organizedPage = ref(1)
    const organizedTotal = ref(0)
    const organizedLoading = ref(false)

    const canSaveRole = computed(() => {
        const u = user.value
        if (!u || savingRole.value || !selectedRole.value) return false
        return selectedRole.value !== u.role
    })

    async function loadUser() {
        loading.value = true
        error.value = null
        try {
            const detail = await fetchSettingsUserDetail(userId.value)
            user.value = detail
            selectedRole.value = detail.role
        } catch (e) {
            user.value = null
            error.value = describeApiLoadFailure(e, "o utilizador")
        } finally {
            loading.value = false
        }
    }

    async function loadRegistrations() {
        registrationsLoading.value = true
        try {
            const result = await fetchSettingsUserRegistrations(userId.value, registrationsPage.value, TAB_PAGE_SIZE)
            registrations.value = result.items
            registrationsTotal.value = result.total
            registrationsPage.value = result.page
        } catch {
            registrations.value = []
            registrationsTotal.value = 0
        } finally {
            registrationsLoading.value = false
        }
    }

    async function loadOrganizedCampaigns() {
        organizedLoading.value = true
        try {
            const result = await fetchSettingsUserOrganizedCampaigns(userId.value, organizedPage.value, TAB_PAGE_SIZE)
            organizedCampaigns.value = result.items
            organizedTotal.value = result.total
            organizedPage.value = result.page
        } catch {
            organizedCampaigns.value = []
            organizedTotal.value = 0
        } finally {
            organizedLoading.value = false
        }
    }

    function resetTabLists() {
        registrationsPage.value = 1
        organizedPage.value = 1
        registrations.value = []
        organizedCampaigns.value = []
        registrationsTotal.value = 0
        organizedTotal.value = 0
    }

    async function syncTabLoad(tab: SettingsUserDetailsTabId) {
        if (tab === "participacoes") {
            await loadRegistrations()
            return
        }
        if (tab === "organizadas") {
            await loadOrganizedCampaigns()
        }
    }

    async function saveRole(isSelfAdmin: boolean) {
        const u = user.value
        if (!u || !selectedRole.value || !canSaveRole.value) return
        if (isSelfAdmin) return
        savingRole.value = true
        try {
            await updateUserRole(u.id, selectedRole.value)
            await loadUser()
            toastSuccess("Cargo actualizado", "O perfil do utilizador foi actualizado.")
        } catch (e) {
            toastFromListMutationError(e, { mode: "save" })
        } finally {
            savingRole.value = false
        }
    }

    function goRegistrationsPrev() {
        if (registrationsPage.value <= 1) return
        registrationsPage.value -= 1
        void loadRegistrations()
    }

    function goRegistrationsNext() {
        const pages = totalPagesFromTotal(registrationsTotal.value, TAB_PAGE_SIZE)
        if (registrationsPage.value >= pages) return
        registrationsPage.value += 1
        void loadRegistrations()
    }

    function goOrganizedPrev() {
        if (organizedPage.value <= 1) return
        organizedPage.value -= 1
        void loadOrganizedCampaigns()
    }

    function goOrganizedNext() {
        const pages = totalPagesFromTotal(organizedTotal.value, TAB_PAGE_SIZE)
        if (organizedPage.value >= pages) return
        organizedPage.value += 1
        void loadOrganizedCampaigns()
    }

    watch(
        userId,
        async () => {
            resetTabLists()
            await loadUser()
            await syncTabLoad(activeTab.value)
        },
        { immediate: true },
    )

    watch(activeTab, (tab) => {
        void syncTabLoad(tab)
    })

    return {
        user,
        loading,
        error,
        selectedRole,
        savingRole,
        canSaveRole,
        loadUser,
        saveRole,
        registrations,
        registrationsPage,
        registrationsTotal,
        registrationsLoading,
        goRegistrationsPrev,
        goRegistrationsNext,
        organizedCampaigns,
        organizedPage,
        organizedTotal,
        organizedLoading,
        goOrganizedPrev,
        goOrganizedNext,
        tabPageSize: TAB_PAGE_SIZE,
    }
}
