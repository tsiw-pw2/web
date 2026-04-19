<script setup lang="ts">
	import { computed, ref, watch } from "vue"
	import type { BeachUpsertDraft } from "@/modules/beaches/types/list"
	import Button from "@/shared/components/ui/Button.vue"
	import Input from "@/shared/components/ui/Input.vue"
	import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
	import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
	import Select from "@/shared/components/ui/select/Select.vue"

	const open = defineModel<boolean>({ required: true })

	const emit = defineEmits<{
		create: [payload: BeachUpsertDraft]
	}>()

	function close() {
		open.value = false
	}

	const name = ref("")
	const municipality = ref("")
	const district = ref<string | undefined>(undefined)

	const districtOptions = [
		{ value: "braganca", label: "Bragança" },
		{ value: "porto", label: "Porto" },
		{ value: "braga", label: "Braga" },
		{ value: "lisboa", label: "Lisboa" },
		{ value: "faro", label: "Faro" },
	]

	const canProceed = computed(() => {
		if (name.value.trim().length === 0) return false
		if (municipality.value.trim().length === 0) return false
		if (!district.value) return false
		return true
	})

	function resetForm() {
		name.value = ""
		municipality.value = ""
		district.value = undefined
	}

	function onProceed() {
		emit("create", {
			name: name.value,
			municipality: municipality.value,
			district: district.value!,
		})
		close()
	}

	watch(open, (isOpen) => {
		if (isOpen) resetForm()
	})
</script>

<template>
	<ModalRoot v-model="open" ariaLabelledby="create-beach-title">
		<div class="flex items-start justify-between gap-4">
			<h3 id="create-beach-title" class="text-lg font-semibold leading-7 text-neutral-950">
				Registar Praia
			</h3>
			<ModalCloseButton @click="close" />
		</div>

		<form class="flex flex-col gap-3" @submit.prevent="onProceed">
			<div class="flex flex-col gap-1">
				<label class="text-xs font-semibold leading-4 text-neutral-900">
					Nome <span class="text-red-500">*</span>
				</label>
				<Input v-model="name" class="w-full" placeholder="Nome da praia" />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-xs font-semibold leading-4 text-neutral-900">
					Município <span class="text-red-500">*</span>
				</label>
				<Input v-model="municipality" class="w-full" placeholder="Município" />
			</div>

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

			<div class="mt-2 flex items-center justify-end gap-2">
				<Button type="button" variant="secondary" @click="close">Cancelar</Button>
				<Button type="submit" :disabled="!canProceed">Guardar</Button>
			</div>
		</form>
	</ModalRoot>
</template>
