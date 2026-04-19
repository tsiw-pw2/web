<script setup lang="ts">
	import { useRouter } from "vue-router"
	import Button from "@/shared/components/ui/Button.vue"

	const router = useRouter()

	function goBack() {
		router.push({ name: "campaigns" })
	}
</script>

<template>
	<div class="flex min-h-full flex-1 flex-col gap-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<h2 class="min-w-0 text-xl font-semibold leading-8 sm:text-2xl">Campanha</h2>
			<Button class="w-full shrink-0 touch-manipulation sm:w-auto" variant="secondary" @click="goBack">
				Voltar
			</Button>
		</div>
		<div class="rounded-2xl bg-white p-4 shadow-card">
			<div class="text-sm leading-5 text-neutral-600">Sem informação para mostrar por agora.</div>
		</div>
	</div>
</template>

