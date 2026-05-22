<script setup lang="ts">
import { useSettingsProfilePageInject } from "@/modules/settings/composables/settings-profile/useSettingsProfilePageInject"
import SettingsProfileAvatarSection from "@/modules/settings/views/components/settings-profile/SettingsProfileAvatarSection.vue"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"

const {
    profileName,
    profileEmail,
    profilePhone,
    savingProfile,
    isProfileFormDirty,
    saveProfile,
} = useSettingsProfilePageInject()
</script>

<template>
    <form class="flex w-full max-w-lg flex-col gap-4" @submit.prevent="saveProfile">
        <SettingsProfileAvatarSection />

        <div class="flex flex-col gap-1">
            <FieldLabel for="profile-name">Nome</FieldLabel>
            <Input id="profile-name" v-model="profileName" class="w-full" autocomplete="name" />
        </div>

        <div class="flex flex-col gap-1">
            <FieldLabel for="profile-email">E-mail</FieldLabel>
            <Input id="profile-email" v-model="profileEmail" class="w-full" type="email" autocomplete="email" />
        </div>

        <div class="flex flex-col gap-1">
            <FieldLabel for="profile-phone" optional>Telefone</FieldLabel>
            <Input id="profile-phone" v-model="profilePhone" class="w-full" type="tel" autocomplete="tel" />
        </div>

        <div class="flex flex-col pt-2 sm:flex-row sm:justify-end">
            <Button type="submit" class="w-full touch-manipulation" :disabled="savingProfile || !isProfileFormDirty">
                {{ savingProfile ? "A guardar…" : "Guardar perfil" }}
            </Button>
        </div>
    </form>
</template>
