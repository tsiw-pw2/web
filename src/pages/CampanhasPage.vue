<script setup lang="ts">
import { ref } from "vue"
import { Button } from "../components/ui/button"
import CreateCampaignModal from "../components/domain/campaigns/CreateCampaignModal.vue"

const isCreateModalOpen = ref(false)

function openCreateModal() {
    isCreateModalOpen.value = true
}
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col gap-6">
        <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold leading-8">Campanhas</h2>
			<Button @click="openCreateModal">Criar Campanha</Button>
        </div>
        <div class="flex flex-1 flex-col items-center justify-center text-center">
            <p class="text-base font-medium leading-6 text-neutral-950">Zero campanhas, zero lixo. Coincidência?</p>
            <p class="mt-2 mb-4 text-sm leading-5 text-neutral-600 text-balance w-64">Ainda não existem campanhas. Vamos criar a primeira?</p>
             <Button @click="openCreateModal">Criar Campanha</Button>
        </div>
    </div>
     <CreateCampaignModal v-model="isCreateModalOpen" />
</template>

