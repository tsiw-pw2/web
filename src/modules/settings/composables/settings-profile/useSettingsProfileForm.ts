import { computed, onBeforeUnmount, ref, watch, type Ref } from "vue"
import type { SettingsProfile } from "@/modules/settings/types/profile"
import { avatarFileValidationMessage, validateAvatarFile } from "@/shared/lib/avatarConstraints"
import { isValidAvatarUrlField, resolveAvatarDisplaySrc } from "@/shared/lib/avatarUrl"
import { initialsFromDisplayName } from "@/shared/lib/userInitials"
import { toastError } from "@/infrastructure/appToast"

// Indica se blob avatar preview URL.
function isBlobAvatarPreviewUrl(s: string): boolean {
    return s.trim().startsWith("blob:")
}

// Composable que gere a lógica de definições perfil formulário.
export function useSettingsProfileForm(profile: Ref<SettingsProfile | null | undefined> | undefined) {
    const profileName = ref("")
    const profileEmail = ref("")
    const profilePhone = ref("")
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

// Marca falha ao carregar a pré-visualização do avatar.
    function onAvatarPreviewError() {
        previewAvatarErrored.value = true
    }

// Revoga URL blob da pré-visualização local do avatar.
    function revokeLocalAvatarPreviewIfNeeded() {
        const u = profileAvatarUrl.value
        if (u.trim().startsWith("blob:")) {
            URL.revokeObjectURL(u)
        }
    }

// Abre perfil avatar file picker.
    function openProfileAvatarFilePicker(savingProfile: boolean) {
        if (savingProfile) return
        const input = profileAvatarFileInputRef.value
        if (!input) return
        input.value = ""
        input.click()
    }

// Remove ficheiro pendente e limpa a pré-visualização do avatar.
    function removeProfileAvatarSelection() {
        revokeLocalAvatarPreviewIfNeeded()
        pendingAvatarFile.value = null
        profileAvatarUrl.value = ""
        if (profileAvatarFileInputRef.value) {
            profileAvatarFileInputRef.value.value = ""
        }
    }

// Valida e aplica ficheiro de avatar selecionado no perfil.
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

// Força atualização da imagem de avatar com cache-bust.
    function bumpProfileAvatarDisplayCache() {
        profileAvatarDisplayCacheBust.value = Date.now()
    }

// Aplica perfil para formulário.
    function applyProfileToForm(p: SettingsProfile, options?: { bumpAvatarCache?: boolean }) {
        revokeLocalAvatarPreviewIfNeeded()
        pendingAvatarFile.value = null
        profileName.value = p.name
        profileEmail.value = p.email
        profilePhone.value = p.phone ?? ""
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
