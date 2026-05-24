<script setup lang="ts">
import { useSettingsProfilePage } from "@/modules/settings/composables/useSettingsProfilePage"
import SettingsProfileForm from "@/modules/settings/views/components/settings-profile/SettingsProfileForm.vue"
import SettingsHelpContactCard from "@/modules/settings/views/components/settings-profile/SettingsHelpContactCard.vue"

useSettingsProfilePage()
</script>

<template>
    <div id="settings-panel-profile" role="tabpanel" aria-labelledby="settings-tab-profile" class="flex w-full flex-col gap-4">
        <SettingsProfileForm />
        <SettingsHelpContactCard />
    </div>
</template>
