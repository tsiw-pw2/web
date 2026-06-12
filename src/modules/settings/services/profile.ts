import { clearApiRootCache, href } from "@/infrastructure/apiDiscovery"
import { setAccessToken } from "@/infrastructure/access-token"
import { apiGet } from "@/infrastructure/apiClient"
import { followHref, followLink } from "@/infrastructure/hypermediaClient"
import { getLink } from "@/infrastructure/hypermediaClient"
import { settingsUserRoleFromFlags } from "@/modules/settings/lib/settingsUserRole"
import type { SettingsProfile } from "@/modules/settings/types/profile"
import { normalizePhoneDigits } from "@/shared/lib/phoneDigits"

type ProfileResource = SettingsProfile & { links?: Record<string, { href: string; method?: string }> }

// Normaliza o papel e campos opcionais do perfil devolvido pela API.
function normalizeProfile(raw: ProfileResource): SettingsProfile {
    return {
        ...raw,
        role: raw.role ?? settingsUserRoleFromFlags(raw),
        birthDate: raw.birthDate ?? null,
        blockedReason: raw.blockedReason ?? null,
        blockedAt: raw.blockedAt ?? null,
        organizations: raw.organizations ?? [],
        isOrgAdmin: raw.isOrgAdmin === true,
    }
}

// Obtém o perfil do utilizador autenticado.
export async function fetchProfile(): Promise<SettingsProfile> {
    const body = await apiGet<ProfileResource>(await href("userMe"))
    return normalizeProfile(body)
}

// Actualiza o perfil do utilizador autenticado (sem ficheiro de avatar).
function phoneForApi(phone: string): string {
    const trimmed = phone.trim()
    if (trimmed.length === 0) return ""
    return normalizePhoneDigits(trimmed)
}

// Actualiza o perfil do utilizador autenticado (sem ficheiro de avatar).
export async function updateProfileApi(payload: {
    name: string
    email: string
    phone: string
    avatarUrl: string
}): Promise<SettingsProfile> {
    const current = await apiGet<ProfileResource>(await href("userMe"))
    const avatarTrimmed = payload.avatarUrl.trim()
    const updateLink = getLink(current, "update")
    if (!updateLink) {
        throw new Error("Profile update link not available")
    }
    const body = await followHref<ProfileResource>(updateLink, {
        method: "PATCH",
        body: {
            name: payload.name.trim(),
            email: payload.email.trim(),
            phone: phoneForApi(payload.phone),
            avatarUrl: avatarTrimmed.length > 0 ? avatarTrimmed : "",
        },
    })
    return normalizeProfile(body)
}

// Actualiza o perfil, enviando ficheiro de avatar quando fornecido.
export async function updateProfileWithOptionalAvatarFile(payload: {
    name: string
    email: string
    phone: string
    avatarUrl: string
    avatarFile: File | null
}): Promise<SettingsProfile> {
    const current = await apiGet<ProfileResource>(await href("userMe"))
    if (payload.avatarFile) {
        const avatarLink = getLink(current, "avatar")
        if (!avatarLink) {
            throw new Error("Profile avatar link not available")
        }
        const formData = new FormData()
        formData.append("name", payload.name.trim())
        formData.append("email", payload.email.trim())
        formData.append("phone", phoneForApi(payload.phone))
        formData.append("avatar", payload.avatarFile)
        const body = await followHref<ProfileResource>(avatarLink, {
            method: "PATCH",
            formData,
        })
        return normalizeProfile(body)
    }
    return updateProfileApi({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        avatarUrl: payload.avatarUrl,
    })
}

type PasswordChangeResponse = {
    token?: string
}

// Altera a palavra-passe do utilizador autenticado.
export async function changeProfilePassword(payload: {
    currentPassword: string
    newPassword: string
}): Promise<void> {
    const current = await apiGet<ProfileResource>(await href("userMe"))
    const body = await followLink<PasswordChangeResponse>(current, "password", {
        method: "PATCH",
        body: {
            currentPassword: payload.currentPassword,
            newPassword: payload.newPassword,
        },
    })
    if (typeof body?.token === "string" && body.token.length > 0) {
        setAccessToken(body.token)
        clearApiRootCache()
    }
}
