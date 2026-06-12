import { shallowRef } from "vue"
import { decodeAccessTokenPayload } from "./jwt-payload"

export const ORG_HEADER_NAME = "X-Org-Id"

export const activeOrganizationId = shallowRef<string | null>(null)

export function syncActiveOrganizationFromToken(token: string | null) {
    if (!token) {
        activeOrganizationId.value = null
        return
    }
    const payload = decodeAccessTokenPayload(token)
    activeOrganizationId.value =
        typeof payload?.orgId === "string" && payload.orgId.length > 0 ? payload.orgId : null
}

export function getActiveOrganizationId(): string | null {
    return activeOrganizationId.value
}

export function setActiveOrganizationId(orgId: string | null) {
    activeOrganizationId.value = orgId
}
