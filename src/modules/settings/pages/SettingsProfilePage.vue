<script setup lang="ts">
import { useSettingsProfilePage } from "@/modules/settings/composables/useSettingsProfilePage"
import SettingsProfileForm from "@/modules/settings/views/components/settings-profile/SettingsProfileForm.vue"

const { profileSaveError } = useSettingsProfilePage()
</script>

<template>
    <div id="settings-panel-profile" role="tabpanel" aria-labelledby="settings-tab-profile" class="flex flex-col gap-4">
        <p v-if="profileSaveError" class="text-sm leading-5 text-red-600">{{ profileSaveError }}</p>
        <SettingsProfileForm />
    </div>
</template>
