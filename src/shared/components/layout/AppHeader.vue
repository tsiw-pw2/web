<script setup lang="ts">
	import { RouterLink } from "vue-router"
	import { routePaths } from "@/app/router"
	import NavigationButton from "./NavigationButton.vue"
</script>

<template>
	<header class="flex h-16 items-center">
		<div class="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4">
			<RouterLink :to="routePaths.dashboard" class="shrink-0">
				<img src="/logo.svg" alt="Início" class="size-8" width="32" height="32" />
			</RouterLink>
			<nav class="flex items-center gap-2">
				<NavigationButton :to="routePaths.dashboard">Dashboard</NavigationButton>
				<NavigationButton :to="routePaths.campaigns">Campanhas</NavigationButton>
				<NavigationButton :to="routePaths.beaches">Praias</NavigationButton>
				<NavigationButton :to="routePaths.waste">Resíduos</NavigationButton>
				<NavigationButton :to="routePaths.settings">Definições</NavigationButton>
			</nav>
			<div class="size-8 shrink-0 rounded-full bg-neutral-800" aria-hidden="true" />
		</div>
	</header>
</template>
