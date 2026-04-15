<script setup lang="ts">
	import Button from "@/shared/components/ui/Button.vue"

	const emit = defineEmits<{
		create: []
	}>()
</script>

<template>
	<div class="flex flex-1 flex-col items-center justify-center text-center">
		<p class="text-base font-medium leading-6 text-neutral-950">Zero campanhas, zero lixo. Coincidência?</p>
		<p class="mb-4 mt-2 w-64 text-balance text-sm leading-5 text-neutral-600">
			Ainda não existem campanhas. Vamos criar a primeira?
		</p>
		<Button @click="emit('create')">Criar Campanha</Button>
	</div>
</template>
