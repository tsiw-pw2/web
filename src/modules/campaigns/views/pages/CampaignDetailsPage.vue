<script setup lang="ts">
	import { computed, onMounted, ref } from "vue"
	import { useRoute, useRouter } from "vue-router"
	import Button from "@/shared/components/ui/Button.vue"
	import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
	import type { CampaignDetails } from "@/modules/campaigns/types/details"
	import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
	import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
	import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"

	const router = useRouter()
	const route = useRoute()

	const loading = ref(true)
	const error = ref(false)
	const campaign = ref<CampaignDetails | null>(null)

	function goBack() {
		router.push({ name: "campaigns" })
	}

	const campaignId = computed(() => String(route.params.campaignId ?? ""))

	function formatDatePt(iso: string): string {
		const date = new Date(iso)
		if (Number.isNaN(date.getTime())) return iso
		return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(date)
	}

	function formatDateTimePt(iso: string): string {
		const date = new Date(iso)
		if (Number.isNaN(date.getTime())) return iso
		return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short" }).format(date)
	}

	const statusUi = computed(() => {
		const status = campaign.value?.status ?? 0
		if (status === 2) return { label: "Concluída", class: "bg-emerald-50 text-emerald-700 ring-emerald-200" }
		if (status === 1) return { label: "Ativa", class: "bg-sky-50 text-sky-700 ring-sky-200" }
		return { label: "Rascunho", class: "bg-neutral-50 text-neutral-700 ring-neutral-200" }
	})

	const registrationsSorted = computed(() => {
		const rows = campaign.value?.registrations ?? []
		return [...rows].sort((a, b) => {
			const an = a.user?.name ?? ""
			const bn = b.user?.name ?? ""
			return an.localeCompare(bn)
		})
	})

	async function load() {
		loading.value = true
		error.value = false
		try {
			campaign.value = await getCampaignDetails(campaignId.value)
		} catch {
			error.value = true
		} finally {
			loading.value = false
		}
	}

	onMounted(load)
</script>

<template>
	<div class="flex min-h-full flex-1 flex-col gap-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="min-w-0">
				<h2 class="truncate text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">
					{{ campaign?.title ?? "Campanha" }}
				</h2>
				<div class="mt-1 flex flex-wrap items-center gap-2 text-sm leading-5 text-neutral-600">
					<span
						class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
						:class="statusUi.class">
						{{ statusUi.label }}
					</span>
					<span v-if="campaign">• {{ formatDatePt(campaign.startDate) }} — {{ formatDatePt(campaign.endDate) }}</span>
				</div>
			</div>
			<Button class="w-full shrink-0 touch-manipulation sm:w-auto" variant="secondary" @click="goBack">
				Voltar
			</Button>
		</div>

		<div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar detalhes…</div>

		<div v-else-if="error" class="rounded-2xl bg-white p-4 shadow-card">
			<div class="text-sm leading-5 text-neutral-600">
				Não foi possível carregar a campanha. Tenta novamente.
			</div>
			<div class="mt-4">
				<Button class="touch-manipulation" variant="secondary" @click="load">Recarregar</Button>
			</div>
		</div>

		<div v-else-if="campaign" class="flex flex-col gap-6">
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div class="rounded-2xl bg-white p-5 shadow-card lg:col-span-2">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<div class="text-xs font-medium uppercase tracking-wide text-neutral-500">Local de encontro</div>
							<div class="mt-1 text-sm font-medium text-neutral-950">
								{{ campaign.meetingLocation }}
							</div>
							<div v-if="campaign.meetingTime" class="mt-1 text-sm leading-5 text-neutral-600">
								Hora: {{ campaign.meetingTime }}
							</div>
						</div>
						<div>
							<div class="text-xs font-medium uppercase tracking-wide text-neutral-500">Organizador</div>
							<div class="mt-1 text-sm font-medium text-neutral-950">
								{{ campaign.organizer?.name ?? "—" }}
							</div>
							<div v-if="campaign.organizer?.email" class="mt-1 text-sm leading-5 text-neutral-600">
								{{ campaign.organizer.email }}
							</div>
						</div>
					</div>

					<div class="mt-5">
						<div class="text-xs font-medium uppercase tracking-wide text-neutral-500">Descrição</div>
						<div class="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
							{{ campaign.description?.trim().length ? campaign.description : "—" }}
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-4">
					<div class="rounded-2xl bg-white p-5 shadow-card">
						<div class="text-xs font-medium uppercase tracking-wide text-neutral-500">Inscritos</div>
						<div class="mt-1 text-2xl font-semibold text-neutral-950">
							{{ campaign.metrics.registrationsCount }}
						</div>
						<div class="mt-1 text-sm leading-5 text-neutral-600">
							{{ campaign.metrics.registrationsCount === 1 ? "pessoa" : "pessoas" }}
						</div>
					</div>
					<div class="rounded-2xl bg-white p-5 shadow-card">
						<div class="text-xs font-medium uppercase tracking-wide text-neutral-500">Praias</div>
						<div class="mt-1 text-2xl font-semibold text-neutral-950">
							{{ campaign.metrics.beachesCount }}
						</div>
						<div class="mt-1 text-sm leading-5 text-neutral-600">
							{{ campaign.metrics.beachesCount === 1 ? "local" : "locais" }}
						</div>
					</div>
					<div class="rounded-2xl bg-white p-5 shadow-card">
						<div class="text-xs font-medium uppercase tracking-wide text-neutral-500">Resíduos</div>
						<div class="mt-1 text-2xl font-semibold text-neutral-950">
							{{ campaign.metrics.totalWasteUnits }}
						</div>
						<div class="mt-1 text-sm leading-5 text-neutral-600">
							unidades • {{ campaign.metrics.totalWasteWeightKg }} kg (peso real)
						</div>
					</div>
					<div class="rounded-2xl bg-white p-5 shadow-card">
						<div class="text-xs font-medium uppercase tracking-wide text-neutral-500">Comentários</div>
						<div class="mt-1 text-2xl font-semibold text-neutral-950">
							{{ campaign.metrics.commentsCount }}
						</div>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<div class="rounded-2xl bg-white p-5 shadow-card">
					<div class="flex items-center justify-between gap-4">
						<h3 class="text-sm font-semibold text-neutral-950">Praias</h3>
						<div class="text-xs text-neutral-500">{{ campaign.beaches.length }}</div>
					</div>
					<div v-if="campaign.beaches.length === 0" class="mt-3 text-sm leading-5 text-neutral-600">
						Sem praias associadas.
					</div>
					<ul v-else class="mt-3 space-y-3">
						<li v-for="beach in campaign.beaches" :key="beach.id" class="rounded-xl border border-neutral-200 p-3">
							<div class="flex flex-wrap items-start justify-between gap-2">
								<div class="min-w-0">
									<div class="truncate text-sm font-medium text-neutral-950">{{ beach.name }}</div>
									<div class="mt-1 text-xs leading-5 text-neutral-600">
										{{ beach.municipality ?? "—" }} • {{ beach.district ?? "—" }}
										<span v-if="beach.parish"> • {{ beach.parish }}</span>
									</div>
								</div>
								<div class="text-xs text-neutral-500">
									{{ beach.latitude }}, {{ beach.longitude }}
								</div>
							</div>
						</li>
					</ul>
				</div>

				<div class="rounded-2xl bg-white p-5 shadow-card">
					<div class="flex items-center justify-between gap-4">
						<h3 class="text-sm font-semibold text-neutral-950">Atividade</h3>
						<div class="text-xs text-neutral-500">
							{{ campaign.comments.length }} comentários • {{ campaign.wasteCollections.length }} registos
						</div>
					</div>

					<div v-if="campaign.comments.length === 0 && campaign.wasteCollections.length === 0" class="mt-3 text-sm leading-5 text-neutral-600">
						Sem atividade registada.
					</div>

					<div v-else class="mt-4 space-y-3">
						<div v-for="comment in campaign.comments" :key="comment.id" class="rounded-xl border border-neutral-200 p-3">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<div class="text-sm font-medium text-neutral-950">
									{{ comment.user?.name ?? "Utilizador" }}
								</div>
								<div class="text-xs text-neutral-500">{{ formatDateTimePt(comment.createdAt) }}</div>
							</div>
							<div class="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">{{ comment.body }}</div>
						</div>

						<div
							v-for="row in campaign.wasteCollections"
							:key="row.id"
							class="rounded-xl border border-neutral-200 p-3">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<div class="text-sm font-medium text-neutral-950">
									{{ row.waste?.name ?? "Resíduo" }}
									<span class="text-neutral-500">•</span>
									{{ row.unitQuantity }} un
									<span v-if="row.actualWeightKg" class="text-neutral-500">•</span>
									<span v-if="row.actualWeightKg">{{ row.actualWeightKg }} kg</span>
								</div>
								<div class="text-xs text-neutral-500">{{ formatDateTimePt(row.createdAt) }}</div>
							</div>
							<div class="mt-1 text-xs leading-5 text-neutral-600">
								<span v-if="row.beach?.name">{{ row.beach.name }}</span>
								<span v-if="row.recordedBy?.name"> • registado por {{ row.recordedBy.name }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="rounded-2xl bg-white p-5 shadow-card">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
					<h3 class="text-sm font-semibold text-neutral-950">Pessoas inscritas</h3>
					<div class="text-xs text-neutral-500">
						{{ campaign.registrations.length }} {{ campaign.registrations.length === 1 ? "inscrição" : "inscrições" }}
					</div>
				</div>

				<div v-if="campaign.registrations.length === 0" class="mt-3 text-sm leading-5 text-neutral-600">
					Ainda não há inscrições.
				</div>

				<DataTableScrollWrap v-else class="mt-4">
					<table class="w-full min-w-[920px] border-collapse text-left">
						<thead>
							<tr class="border-b border-neutral-200">
								<DataTableTh>Nome</DataTableTh>
								<DataTableTh>Email</DataTableTh>
								<DataTableTh>Telefone</DataTableTh>
								<DataTableTh>Função</DataTableTh>
								<DataTableTh>Estado</DataTableTh>
								<DataTableTh>Presença</DataTableTh>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="row in registrationsSorted"
								:key="row.id"
								class="border-b border-neutral-200 last:border-b-0">
								<DataTableTd emphasis>{{ row.user?.name ?? "—" }}</DataTableTd>
								<DataTableTd>{{ row.user?.email ?? "—" }}</DataTableTd>
								<DataTableTd>{{ row.user?.phone ?? "—" }}</DataTableTd>
								<DataTableTd>{{ row.role }}</DataTableTd>
								<DataTableTd>{{ row.status }}</DataTableTd>
								<DataTableTd>{{ row.attendance === null ? "—" : row.attendance ? "Sim" : "Não" }}</DataTableTd>
							</tr>
						</tbody>
					</table>
				</DataTableScrollWrap>
			</div>
		</div>
	</div>
</template>

