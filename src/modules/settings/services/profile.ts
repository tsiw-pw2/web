import { unwrapResource } from "@/infrastructure/hateoas"
import { requestApiData, requestApiFormData } from "@/infrastructure/request"
import { settingsUserRoleFromFlags } from "@/modules/settings/lib/settingsUserRole"
import type { SettingsProfile } from "@/modules/settings/types/profile"

function normalizeProfile(raw: SettingsProfile): SettingsProfile {
    return {
        ...raw,
        role: raw.role ?? settingsUserRoleFromFlags(raw),
        birthDate: raw.birthDate ?? null,
        blockedReason: raw.blockedReason ?? null,
        blockedAt: raw.blockedAt ?? null,
    }
}

export async function fetchProfile(): Promise<SettingsProfile> {
    const body = await requestApiData<unknown>("/users/me", { method: "GET" })
    return normalizeProfile(unwrapResource<SettingsProfile>(body))
}

export async function updateProfileApi(payload: {
    name: string
    email: string
    phone: string
    birthDate: string
    avatarUrl: string
}): Promise<SettingsProfile> {
    const phoneTrimmed = payload.phone.trim()
    const avatarTrimmed = payload.avatarUrl.trim()
    const birthTrimmed = payload.birthDate.trim()
    const body = await requestApiData<unknown>("/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: payload.name.trim(),
            email: payload.email.trim(),
            phone: phoneTrimmed.length > 0 ? phoneTrimmed : "",
            birthDate: birthTrimmed.length > 0 ? birthTrimmed : "",
            avatarUrl: avatarTrimmed.length > 0 ? avatarTrimmed : "",
        }),
    })
    return normalizeProfile(unwrapResource<SettingsProfile>(body))
}

export async function updateProfileWithOptionalAvatarFile(payload: {
    name: string
    email: string
    phone: string
    birthDate: string
    avatarUrl: string
    avatarFile: File | null
}): Promise<SettingsProfile> {
    if (payload.avatarFile) {
        const formData = new FormData()
        formData.append("name", payload.name.trim())
        formData.append("email", payload.email.trim())
        formData.append("phone", payload.phone.trim())
        formData.append("birthDate", payload.birthDate.trim())
        formData.append("avatar", payload.avatarFile)
        const body = await requestApiFormData<unknown>("/users/me", formData, { method: "PATCH" })
        return normalizeProfile(unwrapResource<SettingsProfile>(body))
    }
    return updateProfileApi({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        birthDate: payload.birthDate,
        avatarUrl: payload.avatarUrl,
    })
}

export async function changeProfilePassword(payload: {
    currentPassword: string
    newPassword: string
}): Promise<void> {
    await requestApiData("/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            currentPassword: payload.currentPassword,
            newPassword: payload.newPassword,
        }),
    })
}
