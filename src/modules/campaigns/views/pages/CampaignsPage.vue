<script setup lang="ts">
	import { computed, ref } from "vue"
	import { useRouter } from "vue-router"
	import CreateCampaignModal from "@/modules/campaigns/views/components/CreateCampaignModal.vue"
	import DeleteCampaignModal from "@/modules/campaigns/views/components/DeleteCampaignModal.vue"
	import EditCampaignModal from "@/modules/campaigns/views/components/EditCampaignModal.vue"
	import CampaignsEmptyState from "@/modules/campaigns/views/states/CampaignsEmptyState.vue"
	import CampaignsErrorState from "@/modules/campaigns/views/states/CampaignsErrorState.vue"
	import CampaignsListState from "@/modules/campaigns/views/states/CampaignsListState.vue"
	import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
	import { useCampaignsPageData } from "@/modules/campaigns/composables/useCampaignsPageData"
	import Button from "@/shared/components/ui/Button.vue"

	const {
		loading,
		error,
		campaigns,
		reload,
		removeCampaign,
		addCampaign,
		updateCampaign,
	} = useCampaignsPageData()
	const router = useRouter()

	const isCreateModalOpen = ref(false)
	const isEditModalOpen = ref(false)
	const isDeleteModalOpen = ref(false)
	const editCampaignId = ref<string | null>(null)
	const deleteCampaignId = ref<string | null>(null)

	const editCampaign = computed<CampaignListItem | null>(() => {
		if (!editCampaignId.value) return null
		return campaigns.value.find((c) => c.id === editCampaignId.value) ?? null
	})

	const deleteCampaignTitle = computed(() => {
		if (!deleteCampaignId.value) return undefined
		return campaigns.value.find((c) => c.id === deleteCampaignId.value)?.title
	})

	function openCreateModal() {
		isCreateModalOpen.value = true
	}

	function openCampaign(id: string) {
		router.push({ name: "campaign-details", params: { campaignId: id } })
	}

	function openEditModal(id: string) {
		editCampaignId.value = id
		isEditModalOpen.value = true
	}

	function openDeleteModal(id: string) {
		deleteCampaignId.value = id
		isDeleteModalOpen.value = true
	}

	function confirmDeleteCampaign() {
		if (deleteCampaignId.value) removeCampaign(deleteCampaignId.value)
	}

	function onCreateCampaign(payload: CampaignCreateDraft) {
		addCampaign(payload)
	}

	function onEditCampaign(payload: CampaignCreateDraft) {
		if (!editCampaignId.value) return
		updateCampaign(editCampaignId.value, payload)
	}
</script>

<template>
	<div class="flex min-h-full flex-1 flex-col gap-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<h2 class="text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">Campanhas</h2>
			<Button class="w-full shrink-0 touch-manipulation sm:w-auto" @click="openCreateModal">
				Criar Campanha
			</Button>
		</div>
		<div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>
		<CampaignsErrorState v-else-if="error" @retry="reload" />
		<CampaignsEmptyState v-else-if="campaigns.length === 0" @create="openCreateModal" />
		<CampaignsListState
			v-else
			:items="campaigns"
			@select="openCampaign"
			@edit="openEditModal"
			@delete="openDeleteModal" />
	</div>
	<CreateCampaignModal v-model="isCreateModalOpen" @create="onCreateCampaign" />
	<EditCampaignModal
		v-model="isEditModalOpen"
		:campaign="editCampaign"
		@save="onEditCampaign" />
	<DeleteCampaignModal
		v-model="isDeleteModalOpen"
		:campaign-title="deleteCampaignTitle"
		@confirm="confirmDeleteCampaign" />
</template>
