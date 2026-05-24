import { computed, onBeforeUnmount, ref, watch, type Ref } from "vue"
import type { SettingsProfile } from "@/modules/settings/types/profile"
import { avatarFileValidationMessage, validateAvatarFile } from "@/shared/lib/avatarConstraints"
import { isValidAvatarUrlField, resolveAvatarDisplaySrc } from "@/shared/lib/avatarUrl"
import { initialsFromDisplayName } from "@/shared/lib/userInitials"
import { toastError } from "@/infrastructure/appToast"

function isBlobAvatarPreviewUrl(s: string): boolean {
    return s.trim().startsWith("blob:")
}

export function useSettingsProfileForm(profile: Ref<SettingsProfile | null | undefined> | undefined) {
    const profileName = ref("")
    const profileEmail = ref("")
    const profilePhone = ref("")
    const profileBirthDate = ref("")
    const profileAvatarUrl = ref("")
    const previewAvatarErrored = ref(false)
    const pendingAvatarFile = ref<File | null>(null)
    const profileAvatarFileInputRef = ref<HTMLInputElement | null>(null)
    const profileAvatarDisplayCacheBust = ref(0)

    const profileAvatarUrlTrimmed = computed(() => profileAvatarUrl.value.trim())

    const profileAvatarDisplaySrc = computed(() =>
        resolveAvatarDisplaySrc(profileAvatarUrl.value, profileAvatarDisplayCacheBust.value),
    )

    const profileAvatarPreviewShow = computed(
        () =>
            profileAvatarUrlTrimmed.value.length > 0 &&
            (isValidAvatarUrlField(profileAvatarUrl.value) || isBlobAvatarPreviewUrl(profileAvatarUrl.value)) &&
            !previewAvatarErrored.value,
    )

    const profileAvatarInitialsLabel = computed(() => initialsFromDisplayName(profileName.value))

    watch(profileAvatarUrl, () => {
        previewAvatarErrored.value = false
    })

    function onAvatarPreviewError() {
        previewAvatarErrored.value = true
    }

    function revokeLocalAvatarPreviewIfNeeded() {
        const u = profileAvatarUrl.value
        if (u.trim().startsWith("blob:")) {
            URL.revokeObjectURL(u)
        }
    }

    function openProfileAvatarFilePicker(savingProfile: boolean) {
        if (savingProfile) return
        const input = profileAvatarFileInputRef.value
        if (!input) return
        input.value = ""
        input.click()
    }

    function removeProfileAvatarSelection() {
        revokeLocalAvatarPreviewIfNeeded()
        pendingAvatarFile.value = null
        profileAvatarUrl.value = ""
        if (profileAvatarFileInputRef.value) {
            profileAvatarFileInputRef.value.value = ""
        }
    }

    function onAvatarFileSelected(ev: Event) {
        const input = ev.target as HTMLInputElement
        const file = input.files?.[0]
        input.value = ""
        if (!file) return
        const check = validateAvatarFile(file)
        if (!check.ok) {
            toastError("Imagem inválida", avatarFileValidationMessage(check.issue))
            return
        }
        revokeLocalAvatarPreviewIfNeeded()
        pendingAvatarFile.value = file
        profileAvatarUrl.value = URL.createObjectURL(file)
    }

    function bumpProfileAvatarDisplayCache() {
        profileAvatarDisplayCacheBust.value = Date.now()
    }

    function applyProfileToForm(p: SettingsProfile, options?: { bumpAvatarCache?: boolean }) {
        revokeLocalAvatarPreviewIfNeeded()
        pendingAvatarFile.value = null
        profileName.value = p.name
        profileEmail.value = p.email
        profilePhone.value = p.phone ?? ""
        profileBirthDate.value = p.birthDate ?? ""
        profileAvatarUrl.value = p.avatarUrl ?? ""
        if (options?.bumpAvatarCache && (p.avatarUrl ?? "").trim().length > 0) {
            bumpProfileAvatarDisplayCache()
        }
    }

    watch(
        () => profile?.value,
        (p) => {
            if (!p) return
            if (pendingAvatarFile.value !== null) return
            applyProfileToForm(p)
        },
        { immediate: true },
    )

    const isProfileFormDirty = computed(() => {
        const p = profile?.value
        if (!p) return false
        if (pendingAvatarFile.value !== null) return true
        return (
            profileName.value !== p.name ||
            profileEmail.value !== p.email ||
            profilePhone.value !== (p.phone ?? "") ||
            profileBirthDate.value !== (p.birthDate ?? "") ||
            profileAvatarUrl.value.trim() !== (p.avatarUrl ?? "").trim()
        )
    })

    onBeforeUnmount(() => {
        revokeLocalAvatarPreviewIfNeeded()
    })

    return {
        profileName,
        profileEmail,
        profilePhone,
        profileBirthDate,
        profileAvatarUrl,
        pendingAvatarFile,
        profileAvatarFileInputRef,
        profileAvatarUrlTrimmed,
        profileAvatarDisplaySrc,
        profileAvatarPreviewShow,
        profileAvatarInitialsLabel,
        isProfileFormDirty,
        onAvatarPreviewError,
        openProfileAvatarFilePicker,
        removeProfileAvatarSelection,
        onAvatarFileSelected,
        applyProfileToForm,
        bumpProfileAvatarDisplayCache,
        revokeLocalAvatarPreviewIfNeeded,
    }
}
