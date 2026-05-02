<script setup lang="ts">
	import { computed, ref } from "vue"
	import { RouterLink } from "vue-router"
	import Button from "@/shared/components/ui/Button.vue"
	import { routePaths } from "@/app/router"

	const contactEmail = "support@mariva.com"

	const emailFrom = ref("geral@cm-pvarzim.pt")
	const emailTo = ref(contactEmail)
	const emailSubject = ref("Pedido de acesso à plataforma")
	const responsibleName = ref("Maria Fernandes")
	const institutionalEmail = computed(() => emailFrom.value)

	const modelBody = computed(() => {
		return [
			"Exmos. Senhores,",
			"",
			"Venho por este meio solicitar o acesso à plataforma em nome da nossa organização.",
			"",
			`Responsável: ${responsibleName.value}`,
			`Email: ${institutionalEmail.value}`,
			"",
			"Confirmo que estou autorizada a solicitar acesso em nome desta câmara.",
			"",
			"Com os melhores cumprimentos,",
			responsibleName.value,
		].join("\n")
	})

	const modelEmail = computed(() => {
		return [
			`De: ${emailFrom.value}`,
			`Para: ${emailTo.value}`,
			`Assunto: ${emailSubject.value}`,
			"",
			modelBody.value,
		].join("\n")
	})

	const copied = ref(false)
	let copiedTimeout: number | null = null

	async function copyModel() {
		try {
			await navigator.clipboard.writeText(modelEmail.value)
			copied.value = true
			if (copiedTimeout) window.clearTimeout(copiedTimeout)
			copiedTimeout = window.setTimeout(() => {
				copied.value = false
			}, 1600)
		} catch {
			copied.value = false
		}
	}
</script>

<template>
	<div class="min-h-screen bg-white text-neutral-950">
		<header class="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
			<div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
				<RouterLink :to="routePaths.home" class="flex items-center gap-2">
					<img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
				</RouterLink>

				<nav class="hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex">
					<RouterLink :to="routePaths.campaigns" class="hover:text-neutral-950">Campanhas</RouterLink>
					<RouterLink :to="routePaths.requestAccount" class="hover:text-neutral-950">Solicitar acesso</RouterLink>
					<RouterLink :to="routePaths.login" class="hover:text-neutral-950">Entrar</RouterLink>
				</nav>

				<div class="flex items-center gap-2 md:hidden">
					<RouterLink :to="routePaths.login">
						<Button variant="secondary" class="w-auto">Entrar</Button>
					</RouterLink>
				</div>
			</div>
		</header>

		<main class="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:pt-14">
			<div class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
				<section>
					<h1 class="text-3xl font-semibold leading-tight sm:text-4xl">Pedido de acesso para organização.</h1>
					<p class="mt-4 max-w-prose text-sm leading-6 text-neutral-600">
						Para solicitar acesso à plataforma, envie um email com os dados da sua organização. O pedido será analisado
						antes de ser aprovado.
					</p>

					<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div>
							<div class="text-xs font-medium text-neutral-500">Email de contacto</div>
							<div class="mt-2 text-sm font-medium text-neutral-950">{{ contactEmail }}</div>
						</div>

						<div>
							<div class="text-xs font-medium text-neutral-500">Modelo de email</div>
							<div class="mt-2 flex items-center gap-3">
								<Button class="w-auto" variant="secondary" @click="copyModel">
									{{ copied ? "Copiado" : "Copiar modelo" }}
								</Button>
							</div>
						</div>
					</div>

					<div class="mt-8">
						<div class="text-xs font-medium text-neutral-500">O que incluir no email:</div>
						<div class="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-700">
							<div class="flex items-center gap-2">
								<span class="inline-block size-1.5 rounded-full bg-emerald-500" />
								<span>Nome da organização</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="inline-block size-1.5 rounded-full bg-sky-500" />
								<span>Pessoa responsável</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="inline-block size-1.5 rounded-full bg-violet-500" />
								<span>Email institucional</span>
							</div>
						</div>
					</div>

					<div class="mt-12 border-t border-neutral-200 pt-8">
						<p class="max-w-prose text-sm leading-6 text-neutral-600">
							Caso tenha interesse em saber mais sobre a plataforma ou pretenda esclarecer alguma questão, a nossa equipa
							encontra-se disponível para ajudar. Utilize o email
							<a class="font-medium text-blue-700 hover:underline" :href="`mailto:${contactEmail}`">
								{{ contactEmail }}
							</a>
							para falar connosco.
						</p>
					</div>
				</section>

				<section class="lg:pt-2">
					<div class="rounded-2xl border border-neutral-200 bg-white shadow-card">
						<div class="border-b border-neutral-200 p-4">
							<div class="grid grid-cols-1 gap-2 text-xs text-neutral-600">
								<div class="flex items-center gap-2">
									<div class="w-10 shrink-0 font-medium text-neutral-500">De:</div>
									<div class="truncate font-medium text-neutral-950">{{ emailFrom }}</div>
								</div>
								<div class="flex items-center gap-2">
									<div class="w-10 shrink-0 font-medium text-neutral-500">Para:</div>
									<div class="truncate font-medium text-neutral-950">{{ emailTo }}</div>
								</div>
								<div class="flex items-center gap-2">
									<div class="w-10 shrink-0 font-medium text-neutral-500">Assunto:</div>
									<div class="truncate font-medium text-neutral-950">{{ emailSubject }}</div>
								</div>
							</div>
						</div>

						<div class="p-4">
							<pre class="whitespace-pre-wrap text-sm leading-6 text-neutral-700">{{ modelBody }}</pre>
						</div>
					</div>
					<div class="mt-3 text-xs text-neutral-500">Exemplo de email</div>
				</section>
			</div>
		</main>

		<footer class="border-t border-neutral-200 bg-white">
			<div class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
				<div class="flex items-center gap-2 text-sm font-semibold">
						<img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
					<span class="font-normal text-neutral-500">© Mariva — 2026</span>
				</div>

				<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600">
					<a href="#" class="hover:text-neutral-950">Termos de serviço</a>
					<a href="#" class="hover:text-neutral-950">Política de privacidade</a>
				</div>
			</div>
		</footer>
	</div>
</template>

