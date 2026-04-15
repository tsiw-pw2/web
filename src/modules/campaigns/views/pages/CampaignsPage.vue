<script setup lang="ts">
	import { ref } from "vue"
	import CreateCampaignModal from "@/modules/campaigns/views/components/CreateCampaignModal.vue"
	import CampaignsEmptyState from "@/modules/campaigns/views/states/CampaignsEmptyState.vue"
	import CampaignsErrorState from "@/modules/campaigns/views/states/CampaignsErrorState.vue"
	import CampaignsListState from "@/modules/campaigns/views/states/CampaignsListState.vue"
	import { useCampaignsPageData } from "@/modules/campaigns/composables/useCampaignsPageData"
	import Button from "@/shared/components/ui/Button.vue"

	const { loading, error, campaigns, reload } = useCampaignsPageData()

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
		<div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>
		<CampaignsErrorState v-else-if="error" @retry="reload" />
		<CampaignsEmptyState v-else-if="campaigns.length === 0" @create="openCreateModal" />
		<CampaignsListState v-else :items="campaigns" />
	</div>
	<CreateCampaignModal v-model="isCreateModalOpen" />
</template>
