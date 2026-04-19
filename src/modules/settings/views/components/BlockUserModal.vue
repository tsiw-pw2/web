<script setup lang="ts">
	import { computed, ref, watch } from "vue"
	import Button from "@/shared/components/ui/Button.vue"
	import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
	import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
	import Textarea from "@/shared/components/ui/Textarea.vue"

	const open = defineModel<boolean>({ required: true })

	const props = defineProps<{
		userDisplayName?: string
	}>()

	const emit = defineEmits<{
		confirm: [reason: string]
	}>()

	function close() {
		open.value = false
	}

	const reason = ref("")

	const canConfirm = computed(() => reason.value.trim().length > 0)

	function onConfirm() {
		if (!canConfirm.value) return
		emit("confirm", reason.value.trim())
		close()
	}

	watch(open, (isOpen) => {
		if (isOpen) reason.value = ""
	})
</script>

<template>
	<ModalRoot v-model="open" ariaLabelledby="block-user-title">
		<div class="flex items-start justify-between gap-4">
			<div class="min-w-0">
				<h3 id="block-user-title" class="text-lg font-semibold leading-7 text-neutral-950">
					Bloquear utilizador
				</h3>
				<p v-if="props.userDisplayName" class="mt-1 text-sm leading-5 text-neutral-600">
					{{ props.userDisplayName }}
				</p>
			</div>
			<ModalCloseButton @click="close" />
		</div>

		<p class="text-sm leading-5 text-neutral-600">
			Este texto fica registado como motivo do bloqueio e pode ser revisto mais tarde para efeitos de auditoria.
		</p>

		<form class="flex flex-col gap-3" @submit.prevent="onConfirm">
			<div class="flex flex-col gap-1">
				<label class="text-xs font-semibold leading-4 text-neutral-900" for="block-user-reason">
					Motivo do bloqueio <span class="text-red-500">*</span>
				</label>
				<Textarea
					id="block-user-reason"
					v-model="reason"
					class="min-h-[120px] w-full"
					placeholder="Descreve o motivo do bloqueio de forma clara para fins de auditoria." />
			</div>

			<div class="flex items-center justify-end gap-2 pt-2">
				<Button type="button" variant="secondary" @click="close">Cancelar</Button>
				<Button type="submit" variant="danger" :disabled="!canConfirm">Bloquear utilizador</Button>
			</div>
		</form>
	</ModalRoot>
</template>
