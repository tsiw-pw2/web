<script setup lang="ts">
import { useSettingsProfilePageInject } from "@/modules/settings/composables/settings-profile/useSettingsProfilePageInject"
import TrashBucketIcon from "@/shared/components/icons/TrashBucketIcon.vue"
import { cn } from "@/shared/lib/utils"

const page = useSettingsProfilePageInject()

const {
    profileAvatarUrlTrimmed,
    profileAvatarDisplaySrc,
    profileAvatarPreviewShow,
    profileAvatarInitialsLabel,
    profileAvatarFileInputRef,
    savingProfile,
    onAvatarPreviewError,
    removeProfileAvatarSelection,
    onAvatarFileSelected,
    openProfileAvatarFilePicker,
} = page

const chooseImageLabelClass = cn(
    "inline-flex cursor-pointer items-center justify-center text-sm leading-5 font-semibold shadow-btn-secondary bg-linear-to-b from-white to-neutral-50 rounded-lg h-[34px] px-3 touch-manipulation outline-none select-none whitespace-nowrap",
    "hover:from-neutral-50 hover:to-neutral-100 active:scale-97",
    "focus-visible:outline-2 focus-visible:outline-neutral-100",
)

// Inicia a escolha de imagem no clique do rato.
function onChooseImageMouseDown() {
    if (savingProfile.value) return
    const input = profileAvatarFileInputRef.value
    if (input) input.value = ""
}

// Abre o selector de imagem ao activar a área do avatar.
function onAvatarAreaActivate() {
    openProfileAvatarFilePicker(savingProfile.value)
}
</script>

<template>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div class="relative shrink-0">
            <template v-if="profileAvatarUrlTrimmed.length > 0">
                <div
                    class="group relative size-20 cursor-pointer"
                    role="button"
                    tabindex="0"
                    aria-label="Trocar imagem"
                    @click="onAvatarAreaActivate"
                    @keydown.enter.prevent="onAvatarAreaActivate"
                    @keydown.space.prevent="onAvatarAreaActivate"
                >
                    <img
                        v-if="profileAvatarPreviewShow"
                        :key="profileAvatarDisplaySrc"
                        :src="profileAvatarDisplaySrc"
                        alt=""
                        class="size-20 rounded-full object-cover ring-1 ring-neutral-200"
                        @error="onAvatarPreviewError"
                    />
                    <div
                        v-else
                        class="flex size-20 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-200"
                        aria-hidden="true"
                    >
                        {{ profileAvatarInitialsLabel || "?" }}
                    </div>
                    <button
                        type="button"
                        class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full opacity-0 outline-none transition-opacity duration-200 ease-out group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-0"
                        :disabled="savingProfile"
                        aria-label="Remover imagem"
                        @click.stop="removeProfileAvatarSelection"
                    >
                        <span class="absolute inset-0 rounded-full bg-black/45" aria-hidden="true" />
                        <TrashBucketIcon
                            class="relative z-10 size-5 text-red-500 transition-transform duration-200 ease-out group-hover:scale-110 group-focus-within:scale-110"
                        />
                    </button>
                </div>
            </template>
            <div
                v-else
                class="flex size-20 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-200"
                aria-hidden="true"
            >
                {{ profileAvatarInitialsLabel || "?" }}
            </div>
        </div>

        <div class="flex flex-1 flex-col gap-2">
            <div class="flex flex-wrap items-center gap-2">
                <input
                    id="profile-avatar-file"
                    ref="profileAvatarFileInputRef"
                    class="sr-only"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    :disabled="savingProfile"
                    @change="onAvatarFileSelected"
                />
                <label
                    for="profile-avatar-file"
                    :class="cn(chooseImageLabelClass, savingProfile && 'pointer-events-none opacity-60')"
                    @mousedown="onChooseImageMouseDown"
                >
                    <span class="mx-0.5">Escolher imagem</span>
                </label>
            </div>

            <p class="text-xs leading-4 text-neutral-500">JPEG, PNG ou WebP, até 2 MB.</p>
        </div>
    </div>
</template>
