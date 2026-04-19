<script setup lang="ts">
	import { computed, ref } from "vue"
	import type { BeachUpsertDraft } from "@/modules/beaches/types/list"
	import { useBeachesPageData } from "@/modules/beaches/composables/useBeachesPageData"
	import CreateBeachModal from "@/modules/beaches/views/components/CreateBeachModal.vue"
	import DeleteBeachModal from "@/modules/beaches/views/components/DeleteBeachModal.vue"
	import EditBeachModal from "@/modules/beaches/views/components/EditBeachModal.vue"
	import BeachesEmptyState from "@/modules/beaches/views/states/BeachesEmptyState.vue"
	import BeachesErrorState from "@/modules/beaches/views/states/BeachesErrorState.vue"
	import BeachesListState from "@/modules/beaches/views/states/BeachesListState.vue"
	import Button from "@/shared/components/ui/Button.vue"

	const { loading, error, beaches, reload, removeBeach, addBeach, updateBeach } = useBeachesPageData()

	const isCreateModalOpen = ref(false)
	const isEditModalOpen = ref(false)
	const isDeleteModalOpen = ref(false)
	const editBeachId = ref<string | null>(null)
	const deleteBeachId = ref<string | null>(null)

	const beachForEdit = computed(() => {
		if (!editBeachId.value) return null
		return beaches.value.find((b) => b.id === editBeachId.value) ?? null
	})

	const deleteBeachName = computed(() => {
		if (!deleteBeachId.value) return undefined
		return beaches.value.find((b) => b.id === deleteBeachId.value)?.name
	})

	function openCreateModal() {
		isCreateModalOpen.value = true
	}

	function openEditModal(id: string) {
		editBeachId.value = id
		isEditModalOpen.value = true
	}

	function openDeleteModal(id: string) {
		deleteBeachId.value = id
		isDeleteModalOpen.value = true
	}

	function confirmDeleteBeach() {
		if (deleteBeachId.value) removeBeach(deleteBeachId.value)
	}

	function onCreateBeach(payload: BeachUpsertDraft) {
		addBeach(payload)
	}

	function onSaveBeach(payload: BeachUpsertDraft) {
		if (editBeachId.value) updateBeach(editBeachId.value, payload)
	}
</script>

<template>
	<div class="flex min-h-full flex-1 flex-col gap-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<h2 class="text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">Praias</h2>
			<Button class="w-full shrink-0 touch-manipulation sm:w-auto" @click="openCreateModal">
				Registar Praia
			</Button>
		</div>
		<div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>
		<BeachesErrorState v-else-if="error" @retry="reload" />
		<BeachesEmptyState v-else-if="beaches.length === 0" @create="openCreateModal" />
		<BeachesListState v-else :items="beaches" @edit="openEditModal" @delete="openDeleteModal" />
	</div>
	<CreateBeachModal v-model="isCreateModalOpen" @create="onCreateBeach" />
	<EditBeachModal v-model="isEditModalOpen" :beach="beachForEdit" @save="onSaveBeach" />
	<DeleteBeachModal v-model="isDeleteModalOpen" :beach-name="deleteBeachName" @confirm="confirmDeleteBeach" />
</template>
