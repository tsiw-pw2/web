import { apiDelete } from "@/infrastructure/apiClient"
import { clearApiRootCache } from "@/infrastructure/apiDiscovery"
import { setAccessToken } from "@/infrastructure/access-token"

export async function deleteAccount(payload: { confirmText?: string; currentPassword?: string }): Promise<void> {
    await apiDelete("/users/me", payload)
    setAccessToken(null)
    clearApiRootCache()
}
