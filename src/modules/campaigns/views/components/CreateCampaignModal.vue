<script setup lang="ts">
	import { computed, ref } from "vue"
	import type { CampaignCreateDraft } from "@/modules/campaigns/types/list"
	import Button from "@/shared/components/ui/Button.vue"
	import Input from "@/shared/components/ui/Input.vue"
	import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
	import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
	import Select from "@/shared/components/ui/select/Select.vue"
	import Textarea from "@/shared/components/ui/Textarea.vue"

	const open = defineModel<boolean>({ required: true })

	const emit = defineEmits<{
		create: [payload: CampaignCreateDraft]
	}>()

	function close() {
		open.value = false
	}

	const title = ref<string>("")
	const district = ref<string | undefined>(undefined)
	const meetingTime = ref<string>("")
	const startDate = ref<string>("")
	const endDate = ref<string>("")
	const status = ref<string | undefined>(undefined)
	const information = ref<string>("")

	const districtOptions = [
		{ value: "braganca", label: "Bragança" },
		{ value: "porto", label: "Porto" },
		{ value: "lisboa", label: "Lisboa" },
		{ value: "faro", label: "Faro" },
	]

	const statusOptions = [
		{ value: "draft", label: "Rascunho" },
		{ value: "scheduled", label: "Agendada" },
		{ value: "ongoing", label: "A decorrer" },
		{ value: "completed", label: "Concluída" },
	]

	const canProceed = computed(() => {
		if (title.value.trim().length === 0) return false
		if (!district.value) return false
		if (meetingTime.value.trim().length === 0) return false
		if (startDate.value.trim().length === 0) return false
		if (!status.value) return false
		return true
	})

	function onProceed() {
		emit("create", {
			title: title.value,
			district: district.value!,
			meetingTime: meetingTime.value,
			startDate: startDate.value,
			endDate: endDate.value,
			status: status.value!,
			information: information.value,
		})
		close()
	}
</script>

<template>
	<ModalRoot v-model="open" ariaLabelledby="create-campaign-title">
		<div class="flex items-start justify-between gap-4">
			<h3 id="create-campaign-title" class="text-lg font-semibold leading-7 text-neutral-950">
				Criar Campanha
			</h3>
			<ModalCloseButton @click="close" />
		</div>

		<form class="flex flex-col gap-3" @submit.prevent="onProceed">
			<div class="flex flex-col gap-1">
				<label class="text-xs font-semibold leading-4 text-neutral-900">
					Título <span class="text-red-500">*</span>
				</label>
				<Input v-model="title" class="w-full" placeholder="Onda de mudança" />
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="flex flex-col gap-1">
					<label class="text-xs font-semibold leading-4 text-neutral-900">
						Distrito <span class="text-red-500">*</span>
					</label>
					<Select
						v-model="district"
						class="w-full"
						:options="districtOptions"
						placeholder="Seleciona um distrito" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-xs font-semibold leading-4 text-neutral-900">
						Hora de encontro <span class="text-red-500">*</span>
					</label>
					<Input
						v-model="meetingTime"
						class="w-full"
						type="time"
						left-icon="clock"
						placeholder="09:30" />
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="flex flex-col gap-1">
					<label class="text-xs font-semibold leading-4 text-neutral-900">
						Data de início <span class="text-red-500">*</span>
					</label>
					<Input v-model="startDate" class="w-full" placeholder="DD / MM / AAAA" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-xs font-semibold leading-4 text-neutral-900">
						Data de fim <span class="text-xs font-medium text-neutral-500">(opcional)</span>
					</label>
					<Input v-model="endDate" class="w-full" placeholder="DD / MM / AAAA" />
				</div>
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-xs font-semibold leading-4 text-neutral-900">
					Estado <span class="text-red-500">*</span>
				</label>
				<Select
					v-model="status"
					class="w-full"
					:options="statusOptions"
					placeholder="Estado da campanha" />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-xs font-semibold leading-4 text-neutral-900">
					Informações <span class="text-xs font-medium text-neutral-500">(opcional)</span>
				</label>
				<Textarea
					v-model="information"
					class="w-full"
					placeholder="Ponto de encontro, o que levar (luvas, água...), duração prevista e notas importantes…" />
			</div>

			<div class="mt-2 flex items-center justify-between gap-4">
				<div class="flex items-center gap-2">
					<span class="h-1 w-6 rounded-full bg-blue-500" />
					<span class="h-1 w-6 rounded-full bg-neutral-200" />
				</div>
				<div class="flex items-center gap-2">
					<Button type="button" variant="secondary" @click="close">Cancelar</Button>
					<Button type="submit" :disabled="!canProceed">Próximo</Button>
				</div>
			</div>
		</form>
	</ModalRoot>
</template>
