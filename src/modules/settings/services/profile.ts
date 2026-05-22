import { requestApiData, requestApiFormData } from "@/infrastructure/request"
import type { SettingsProfile } from "@/modules/settings/types/profile"

export async function fetchProfile(): Promise<SettingsProfile> {
    return requestApiData<SettingsProfile>("/users/me", { method: "GET" })
}

export async function updateProfileApi(payload: { name: string; email: string; phone: string; avatarUrl: string }): Promise<SettingsProfile> {
    const phoneTrimmed = payload.phone.trim()
    const avatarTrimmed = payload.avatarUrl.trim()
    return requestApiData<SettingsProfile>("/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: payload.name.trim(),
            email: payload.email.trim(),
            phone: phoneTrimmed.length > 0 ? phoneTrimmed : "",
            avatarUrl: avatarTrimmed.length > 0 ? avatarTrimmed : "",
        }),
    })
}

export async function updateProfileWithOptionalAvatarFile(payload: { name: string; email: string; phone: string; avatarUrl: string; avatarFile: File | null }): Promise<SettingsProfile> {
    if (payload.avatarFile) {
        const formData = new FormData()
        formData.append("name", payload.name.trim())
        formData.append("email", payload.email.trim())
        formData.append("phone", payload.phone.trim())
        formData.append("avatar", payload.avatarFile)
        return requestApiFormData<SettingsProfile>("/users/me", formData, { method: "PATCH" })
    }
    return updateProfileApi({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        avatarUrl: payload.avatarUrl,
    })
}
