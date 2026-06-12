import { computed } from "vue"
import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { getActiveOrganizationId } from "@/infrastructure/active-organization"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import { districtSlugFromMunicipalityName } from "@/shared/lib/concelhosByDistrict"

// Distrito e concelho fixos da organização activa (registo de praias só no âmbito municipal).
export function useBeachOrganizationContext() {
    const { profile } = useCurrentProfile()

    const activeOrganization = computed(() => {
        const orgId = getActiveOrganizationId()
        if (!orgId) return null
        return profile.value?.organizations?.find((org) => org.id === orgId) ?? null
    })

    const organizationMunicipality = computed(() => activeOrganization.value?.municipality?.trim() || null)

    const organizationDistrictSlug = computed(() => {
        const municipality = organizationMunicipality.value
        if (!municipality) return undefined
        return districtSlugFromMunicipalityName(municipality)
    })

    const organizationDistrictLabel = computed(() => {
        const slug = organizationDistrictSlug.value
        if (!slug) return null
        return DISTRICT_SELECT_OPTIONS.find((option) => option.value === slug)?.label ?? null
    })

    const hasOrganizationLocation = computed(
        () => Boolean(organizationMunicipality.value && organizationDistrictSlug.value),
    )

    return {
        organizationMunicipality,
        organizationDistrictSlug,
        organizationDistrictLabel,
        hasOrganizationLocation,
    }
}
