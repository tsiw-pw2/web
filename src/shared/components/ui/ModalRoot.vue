<script setup lang="ts">
	import { computed, watch } from "vue"

	defineOptions({ name: "ModalRoot" })

	const open = defineModel<boolean>({ required: true })

	const props = withDefaults(
		defineProps<{
			ariaLabelledby: string
			maxWidth?: "md" | "lg"
		}>(),
		{
			maxWidth: "lg",
		},
	)

	function closeFromBackdrop() {
		open.value = false
	}

	const maxWidthClass = computed(() => (props.maxWidth === "md" ? "max-w-md" : "max-w-lg"))

	watch(open, (isOpen) => {
		if (!isOpen) return
		function onKeydown(e: KeyboardEvent) {
			if (e.key === "Escape") closeFromBackdrop()
		}
		document.addEventListener("keydown", onKeydown)
		return () => document.removeEventListener("keydown", onKeydown)
	})
</script>

<template>
	<Teleport to="body">
		<Transition name="modal-frame">
			<div
				v-if="open"
				class="fixed inset-0 z-100 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
				role="presentation"
				@click.self="closeFromBackdrop">
				<div
					role="dialog"
					aria-modal="true"
					:aria-labelledby="props.ariaLabelledby"
					class="modal-frame-panel flex max-h-[calc(100dvh-1rem)] w-full flex-col gap-4 overflow-y-auto overscroll-contain rounded-t-2xl bg-white p-4 shadow-card sm:max-h-[min(90dvh,48rem)] sm:rounded-2xl"
					:class="maxWidthClass"
					@click.stop>
					<slot />
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
