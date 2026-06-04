<script setup lang="ts">
import { computed, inject } from "vue"
import { useSettingsProfilePageInject } from "@/modules/settings/composables/settings-profile/useSettingsProfilePageInject"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"
import { formatSettingsDateTime } from "@/modules/settings/lib/formatSettingsDate"
import SettingsProfileAvatarSection from "@/modules/settings/views/components/settings-profile/SettingsProfileAvatarSection.vue"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"

const profile = inject(settingsProfileKey)

const {
    profileName,
    profileEmail,
    profilePhone,
    savingProfile,
    isProfileFormDirty,
    saveProfile,
} = useSettingsProfilePageInject()

const isBlocked = computed(() => profile?.value?.isBlocked === true)
</script>

<template>
    <form class="flex w-full flex-col gap-4" @submit.prevent="saveProfile">
        <div
            v-if="isBlocked"
            class="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm leading-5 text-orange-900"
            role="status"
        >
            <p class="font-medium">Conta bloqueada</p>
            <p v-if="profile?.blockedReason" class="mt-1">{{ profile.blockedReason }}</p>
            <p v-if="profile?.blockedAt" class="mt-1 text-orange-800">
                Desde {{ formatSettingsDateTime(profile.blockedAt) }}
            </p>
        </div>

        <SettingsProfileAvatarSection />

        <div class="flex flex-col gap-1">
            <FieldLabel for="profile-name">Nome</FieldLabel>
            <Input id="profile-name" v-model="profileName" class="w-full" autocomplete="name" :disabled="isBlocked" />
        </div>

        <div class="flex flex-col gap-1">
            <FieldLabel for="profile-email">E-mail</FieldLabel>
            <Input
                id="profile-email"
                v-model="profileEmail"
                class="w-full"
                type="email"
                autocomplete="email"
                :disabled="isBlocked"
            />
        </div>

        <div class="flex flex-col gap-1">
            <FieldLabel for="profile-phone" optional>Telefone</FieldLabel>
            <Input
                id="profile-phone"
                v-model="profilePhone"
                class="w-full"
                type="tel"
                inputmode="numeric"
                autocomplete="tel"
                :disabled="isBlocked"
            />
        </div>

        <div class="flex flex-col pt-2 sm:flex-row sm:justify-end">
            <Button
                type="submit"
                class="w-full touch-manipulation"
                :disabled="savingProfile || !isProfileFormDirty || isBlocked"
            >
                {{ savingProfile ? "A guardar…" : "Guardar perfil" }}
            </Button>
        </div>
    </form>
</template>
