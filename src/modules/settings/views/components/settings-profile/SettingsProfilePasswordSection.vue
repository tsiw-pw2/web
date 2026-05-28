<script setup lang="ts">
import { useSettingsProfilePassword } from "@/modules/settings/composables/settings-profile/useSettingsProfilePassword"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"

const {
    currentPassword,
    newPassword,
    confirmPassword,
    passwordSaveError,
    savingPassword,
    canSavePassword,
    savePassword,
} = useSettingsProfilePassword()
</script>

<template>
    <section class="flex w-full max-w-lg flex-col gap-4">
        <div class="flex flex-col gap-1">
            <h3 class="text-base font-semibold leading-6 text-neutral-950">Palavra-passe</h3>
            <p class="text-sm leading-5 text-neutral-600">Altera a palavra-passe da tua conta.</p>
        </div>

        <p v-if="passwordSaveError" class="text-sm leading-5 text-red-600">{{ passwordSaveError }}</p>

        <form class="flex flex-col gap-4" @submit.prevent="savePassword">
            <div class="flex flex-col gap-1">
                <FieldLabel for="security-current-password" required>Palavra-passe actual</FieldLabel>
                <Input
                    id="security-current-password"
                    v-model="currentPassword"
                    class="w-full"
                    type="password"
                    autocomplete="current-password"
                />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel for="security-new-password" required>Nova palavra-passe</FieldLabel>
                <Input
                    id="security-new-password"
                    v-model="newPassword"
                    class="w-full"
                    type="password"
                    autocomplete="new-password"
                />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel for="security-confirm-password" required>Confirmar nova palavra-passe</FieldLabel>
                <Input
                    id="security-confirm-password"
                    v-model="confirmPassword"
                    class="w-full"
                    type="password"
                    autocomplete="new-password"
                />
            </div>

            <div class="flex flex-col pt-2 sm:flex-row sm:justify-end">
                <Button type="submit" class="w-full touch-manipulation" :disabled="savingPassword || !canSavePassword">
                    {{ savingPassword ? "A guardar…" : "Alterar palavra-passe" }}
                </Button>
            </div>
        </form>
    </section>
</template>
