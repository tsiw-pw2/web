<script setup lang="ts">
	import { ref } from "vue"
	import { useRouter } from "vue-router"
	import { RouterLink } from "vue-router"
	import Button from "@/shared/components/ui/Button.vue"
	import Input from "@/shared/components/ui/Input.vue"
	import { routePaths } from "@/app/router"

	const router = useRouter()

	const email = ref("support@mariva.com")
	const password = ref("")

	function submit() {
		router.push({ name: "dashboard" })
	}
</script>

<template>
	<div class="min-h-screen bg-white text-neutral-950">
		<div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4">
			<header class="flex h-20 items-start justify-center pt-8">
				<img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
			</header>

			<main class="flex flex-1 items-center justify-center pb-12">
				<form class="w-full max-w-sm" @submit.prevent="submit">
					<div class="space-y-4">
						<div>
							<label class="block text-xs font-semibold text-neutral-900">
								Email <span class="text-red-600">*</span>
							</label>
							<Input v-model="email" class="mt-2 w-full" autocomplete="email" type="email" />
						</div>

						<div>
							<label class="block text-xs font-semibold text-neutral-900">
								Senha <span class="text-red-600">*</span>
							</label>
							<Input
								v-model="password"
								class="mt-2 w-full"
								autocomplete="current-password"
								type="password"
								placeholder="A sua palavra passe" />
						</div>

						<Button class="w-full justify-center">Entrar</Button>

						<div class="flex items-center justify-center gap-2 text-xs text-neutral-600">
							<RouterLink to="#" class="hover:text-neutral-950">Criar conta?</RouterLink>
							<span class="text-neutral-400">|</span>
							<RouterLink :to="routePaths.requestAccount" class="hover:text-neutral-950">
								Entrar em contacto
							</RouterLink>
						</div>
					</div>
				</form>
			</main>

			<footer class="flex items-center justify-between py-6 text-xs text-neutral-500">
				<div>© Mariva</div>
				<div class="flex items-center gap-4">
					<a href="#" class="hover:text-neutral-950">Termos de serviço</a>
					<a href="#" class="hover:text-neutral-950">Política de privacidade</a>
				</div>
			</footer>
		</div>
	</div>
</template>

