<script setup lang="ts">
	import {
		DashboardKeyValuePanel,
		DashboardMetricPanel,
	} from "@/modules/dashboard"
	import CampaignIcon from "@/modules/dashboard/components/icons/CampaignIcon.vue"
	import CoastIcon from "@/modules/dashboard/components/icons/CoastIcon.vue"
	import VolunteerIcon from "@/modules/dashboard/components/icons/VolunteerIcon.vue"
	import { useDashboardOverview } from "@/modules/dashboard/composables/useDashboardOverview"

	const { overview, loading, error } = useDashboardOverview()
</script>

<template>
	<div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>
	<div v-else-if="error" class="text-sm leading-5 text-neutral-600">{{ error }}</div>
	<div v-else-if="overview" class="grid grid-cols-6 gap-6">
		<DashboardMetricPanel class="col-span-2" title="Campanhas" :value="String(overview.metrics.campaignCount)" more-href="#">
			<template #icon>
				<CampaignIcon />
			</template>
		</DashboardMetricPanel>
		<DashboardMetricPanel class="col-span-2" title="Praias" :value="String(overview.metrics.beachCount)" more-href="#">
			<template #icon>
				<CoastIcon />
			</template>
		</DashboardMetricPanel>
		<DashboardMetricPanel class="col-span-2" title="Voluntários" :value="String(overview.metrics.volunteerCount)" more-href="#">
			<template #icon>
				<VolunteerIcon />
			</template>
		</DashboardMetricPanel>
		<DashboardKeyValuePanel
			class="col-span-3"
			title="Estatísticas de limpeza"
			:rows="overview.cleaningStatsRows"
			more-href="#" />
		<DashboardKeyValuePanel
			class="col-span-3"
			title="Próxima Campanha"
			:rows="overview.nextCampaignRows"
			more-href="#" />
	</div>
</template>
