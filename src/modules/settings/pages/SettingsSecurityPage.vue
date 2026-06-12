<script setup lang="ts">
import { inject } from "vue"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"
import { formatSettingsDateTime } from "@/modules/settings/lib/formatSettingsDate"
import SettingsProfilePasswordSection from "@/modules/settings/views/components/settings-profile/SettingsProfilePasswordSection.vue"
import SettingsDeleteAccountSection from "@/modules/settings/views/components/settings-security/SettingsDeleteAccountSection.vue"

const profile = inject(settingsProfileKey)
</script>

<template>
    <div
        id="settings-panel-security"
        role="tabpanel"
        aria-labelledby="settings-tab-security"
        class="flex w-full flex-col gap-4"
    >
        <div
            v-if="profile?.isBlocked"
            class="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm leading-5 text-orange-900"
            role="status"
        >
            <p class="font-medium">Conta bloqueada</p>
            <p v-if="profile.blockedReason" class="mt-1">{{ profile.blockedReason }}</p>
            <p v-if="profile.blockedAt" class="mt-1 text-orange-800">
                Desde {{ formatSettingsDateTime(profile.blockedAt) }}
            </p>
            <p class="mt-2 text-orange-800">Não podes alterar a palavra-passe enquanto a conta estiver bloqueada.</p>
        </div>

        <template v-else>
            <SettingsProfilePasswordSection />
            <SettingsDeleteAccountSection />
        </template>
    </div>
</template>
