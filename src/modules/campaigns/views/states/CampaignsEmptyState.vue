<script setup lang="ts">
	import ResourceEmptyState from "@/shared/components/states/ResourceEmptyState.vue"

	const emit = defineEmits<{
		create: []
	}>()
</script>

<template>
	<ResourceEmptyState
		title="Sem campanhas."
		hint="Cria a primeira para mobilizar equipas nas praias."
		action-label="Nova campanha"
		@action="emit('create')" />
</template>
