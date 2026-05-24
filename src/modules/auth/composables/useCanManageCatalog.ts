import { computed } from "vue"
import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { canManageCatalog } from "@/modules/auth/lib/accessPolicy"

export function useCanManageCatalog() {
    const { profile, loadProfile } = useCurrentProfile()

    void loadProfile()

    const canManage = computed(() => canManageCatalog(profile.value))

    return { canManage }
}
