<script setup lang="ts">
	import Button from "@/shared/components/ui/Button.vue"
	import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
	import ModalRoot from "@/shared/components/ui/ModalRoot.vue"

	const open = defineModel<boolean>({ required: true })

	const props = defineProps<{
		beachName?: string
	}>()

	function close() {
		open.value = false
	}

	const emit = defineEmits<{
		confirm: []
	}>()

	function confirmDelete() {
		emit("confirm")
		close()
	}
</script>

<template>
	<ModalRoot v-model="open" ariaLabelledby="delete-beach-title" max-width="md">
		<div class="flex items-start justify-between gap-4">
			<div class="min-w-0">
				<h3 id="delete-beach-title" class="text-sm font-semibold leading-5 text-neutral-950">
					Eliminar Praia
				</h3>
				<div v-if="props.beachName" class="mt-1 text-xs leading-4 text-neutral-500">
					{{ props.beachName }}
				</div>
			</div>
			<ModalCloseButton @click="close" />
		</div>

		<p class="text-sm font-semibold leading-5 text-neutral-950">
			Tem a certeza que pretende eliminar esta praia? Esta ação é irreversível e não poderá voltar atrás!
		</p>

		<div class="flex items-center justify-end gap-2">
			<Button type="button" variant="secondary" @click="close">Cancelar</Button>
			<Button type="button" variant="danger" @click="confirmDelete">Eliminar Praia</Button>
		</div>
	</ModalRoot>
</template>
