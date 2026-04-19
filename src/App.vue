<script setup lang="ts">
	import { watchEffect } from "vue"
	import { RouterView, useRoute } from "vue-router"
	import AppHeader from "@/shared/components/layout/AppHeader.vue"
	import MobileBottomNav from "@/shared/components/layout/MobileBottomNav.vue"

	const route = useRoute()

	watchEffect(() => {
		const allowBodyScroll = route.meta?.bodyScroll === true
		document.body.classList.toggle("app-shell", !allowBodyScroll)
	})
</script>

<template>
	<div class="flex h-screen w-full flex-col overflow-hidden bg-neutral-950 pb-0 md:pb-2">
		<AppHeader />
		<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div class="mx-2 mb-2 flex min-h-0 flex-1 flex-col md:mb-0">
				<main
					class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white md:rounded-b-sm md:rounded-t-lg">
					<div
						class="mx-auto flex min-h-0 w-full min-w-0 max-w-5xl flex-1 flex-col gap-6 overflow-y-auto overscroll-none px-3 py-6 sm:px-4 md:py-8">
						<RouterView />
					</div>
				</main>
			</div>
			<MobileBottomNav />
		</div>
	</div>
</template>
