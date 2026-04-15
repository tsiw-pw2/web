<script setup lang="ts">
	import Button from "@/shared/components/ui/Button.vue"

	const emit = defineEmits<{
		retry: []
	}>()
</script>

<template>
	<div class="flex flex-1 flex-col items-center justify-center text-center">
		<p class="text-base font-medium leading-6 text-neutral-950">Não foi possível carregar as campanhas.</p>
		<p class="mb-4 mt-2 max-w-sm text-balance text-sm leading-5 text-neutral-600">
			Verifica a ligação e tenta outra vez.
		</p>
		<Button @click="emit('retry')">Tentar novamente</Button>
	</div>
</template>
