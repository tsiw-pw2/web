<script setup lang="ts">
	import { computed, ref } from "vue"
	import CreateWasteModal from "@/modules/waste/views/components/CreateWasteModal.vue"
	import DeleteWasteModal from "@/modules/waste/views/components/DeleteWasteModal.vue"
	import EditWasteModal from "@/modules/waste/views/components/EditWasteModal.vue"
	import WasteEmptyState from "@/modules/waste/views/states/WasteEmptyState.vue"
	import WasteErrorState from "@/modules/waste/views/states/WasteErrorState.vue"
	import WasteListState from "@/modules/waste/views/states/WasteListState.vue"
	import type { WasteUpsertDraft } from "@/modules/waste/types/list"
	import { useWastePageData } from "@/modules/waste/composables/useWastePageData"
	import Button from "@/shared/components/ui/Button.vue"

	const { loading, error, items, reload, removeWaste, addWaste, updateWaste } = useWastePageData()

	const isCreateModalOpen = ref(false)
	const isEditModalOpen = ref(false)
	const isDeleteModalOpen = ref(false)
	const editWasteId = ref<string | null>(null)
	const deleteWasteId = ref<string | null>(null)

	const wasteForEdit = computed(() => {
		if (!editWasteId.value) return null
		return items.value.find((w) => w.id === editWasteId.value) ?? null
	})

	const deleteWasteName = computed(() => {
		if (!deleteWasteId.value) return undefined
		return items.value.find((w) => w.id === deleteWasteId.value)?.name
	})

	function openCreateModal() {
		isCreateModalOpen.value = true
	}

	function openEditModal(id: string) {
		editWasteId.value = id
		isEditModalOpen.value = true
	}

	function openDeleteModal(id: string) {
		deleteWasteId.value = id
		isDeleteModalOpen.value = true
	}

	function confirmDeleteWaste() {
		if (deleteWasteId.value) removeWaste(deleteWasteId.value)
	}

	function onCreateWaste(payload: WasteUpsertDraft) {
		addWaste(payload)
	}

	function onSaveWaste(payload: WasteUpsertDraft) {
		if (editWasteId.value) updateWaste(editWasteId.value, payload)
	}
</script>

<template>
	<div class="flex min-h-full flex-1 flex-col gap-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<h2 class="text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">Resíduos</h2>
			<Button class="w-full shrink-0 touch-manipulation sm:w-auto" @click="openCreateModal">
				Criar Resíduo
			</Button>
		</div>
		<div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>
		<WasteErrorState v-else-if="error" @retry="reload" />
		<WasteEmptyState v-else-if="items.length === 0" @create="openCreateModal" />
		<WasteListState v-else :items="items" @edit="openEditModal" @delete="openDeleteModal" />
	</div>
	<CreateWasteModal v-model="isCreateModalOpen" @create="onCreateWaste" />
	<EditWasteModal v-model="isEditModalOpen" :item="wasteForEdit" @save="onSaveWaste" />
	<DeleteWasteModal v-model="isDeleteModalOpen" :waste-name="deleteWasteName" @confirm="confirmDeleteWaste" />
</template>
