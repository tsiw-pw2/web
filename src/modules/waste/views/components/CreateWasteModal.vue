<script setup lang="ts">
	import { computed, ref, watch } from "vue"
	import type { WasteUpsertDraft } from "@/modules/waste/types/list"
	import Button from "@/shared/components/ui/Button.vue"
	import Input from "@/shared/components/ui/Input.vue"
	import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
	import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
	import Select from "@/shared/components/ui/select/Select.vue"

	const open = defineModel<boolean>({ required: true })

	const emit = defineEmits<{
		create: [payload: WasteUpsertDraft]
	}>()

	function close() {
		open.value = false
	}

	const name = ref("")
	const category = ref<string | undefined>(undefined)
	const unit = ref<string | undefined>(undefined)

	const categoryOptions = [
		{ value: "plastic", label: "Plástico" },
		{ value: "glass", label: "Vidro" },
		{ value: "metal", label: "Metal" },
		{ value: "paper", label: "Papel / cartão" },
		{ value: "organic", label: "Orgânico" },
		{ value: "other", label: "Outro" },
	]

	const unitOptions = [
		{ value: "kg", label: "Quilogramas (kg)" },
		{ value: "unit", label: "Unidade" },
	]

	const canProceed = computed(() => {
		if (name.value.trim().length === 0) return false
		if (!category.value) return false
		if (!unit.value) return false
		return true
	})

	function resetForm() {
		name.value = ""
		category.value = undefined
		unit.value = undefined
	}

	function onProceed() {
		emit("create", {
			name: name.value,
			category: category.value!,
			unit: unit.value!,
		})
		close()
	}

	watch(open, (isOpen) => {
		if (isOpen) resetForm()
	})
</script>

<template>
	<ModalRoot v-model="open" ariaLabelledby="create-waste-title">
		<div class="flex items-start justify-between gap-4">
			<h3 id="create-waste-title" class="text-lg font-semibold leading-7 text-neutral-950">
				Criar Resíduo
			</h3>
			<ModalCloseButton @click="close" />
		</div>

		<form class="flex flex-col gap-3" @submit.prevent="onProceed">
			<div class="flex flex-col gap-1">
				<label class="text-xs font-semibold leading-4 text-neutral-900">
					Nome <span class="text-red-500">*</span>
				</label>
				<Input v-model="name" class="w-full" placeholder="Ex.: garrafas, redes de pesca…" />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-xs font-semibold leading-4 text-neutral-900">
					Categoria <span class="text-red-500">*</span>
				</label>
				<Select
					v-model="category"
					class="w-full"
					:options="categoryOptions"
					placeholder="Tipo de material" />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-xs font-semibold leading-4 text-neutral-900">
					Unidade <span class="text-red-500">*</span>
				</label>
				<Select v-model="unit" class="w-full" :options="unitOptions" placeholder="Como medir" />
			</div>

			<div class="mt-2 flex items-center justify-end gap-2">
				<Button type="button" variant="secondary" @click="close">Cancelar</Button>
				<Button type="submit" :disabled="!canProceed">Guardar</Button>
			</div>
		</form>
	</ModalRoot>
</template>
