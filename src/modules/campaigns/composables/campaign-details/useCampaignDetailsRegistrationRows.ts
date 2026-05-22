import { computed, type Ref } from "vue"
import { registrationStatusLabel } from "@/modules/campaigns/lib/registrationLabels"
import type { CampaignDetailsRegistration } from "@/modules/campaigns/types/details"

type RegistrationActions = {
    openEditRegistration: (row: CampaignDetailsRegistration) => void
    openDeleteRegistration: (row: CampaignDetailsRegistration) => void
    myRegistration: Ref<{ status: number } | null>
}

type RegistrationTabs = {
    registrations: Ref<CampaignDetailsRegistration[]>
}

export function useCampaignDetailsRegistrationRows(
    tabs: RegistrationTabs,
    registration: RegistrationActions,
) {
    const myRegistrationStatusLabel = computed(() =>
        registration.myRegistration.value != null
            ? registrationStatusLabel(registration.myRegistration.value.status)
            : "",
    )

    function onEditRegistrationRow(rowId: string) {
        const row = tabs.registrations.value.find((r) => r.id === rowId)
        if (row) registration.openEditRegistration(row)
    }

    function onDeleteRegistrationRow(rowId: string) {
        const row = tabs.registrations.value.find((r) => r.id === rowId)
        if (row) registration.openDeleteRegistration(row)
    }

    return {
        myRegistrationStatusLabel,
        onEditRegistrationRow,
        onDeleteRegistrationRow,
    }
}
