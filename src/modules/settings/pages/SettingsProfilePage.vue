<script setup lang="ts">
import { useSettingsProfilePage } from "@/modules/settings/composables/useSettingsProfilePage"
import SettingsProfileForm from "@/modules/settings/views/components/settings-profile/SettingsProfileForm.vue"
import SettingsProfileInfoPanel from "@/modules/settings/views/components/settings-profile/SettingsProfileInfoPanel.vue"

useSettingsProfilePage()
</script>

<template>
    <div id="settings-panel-profile" role="tabpanel" aria-labelledby="settings-tab-profile" class="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        <SettingsProfileForm class="lg:col-span-2" />
        <SettingsProfileInfoPanel />
    </div>
</template>
