<script setup lang="ts">
	defineOptions({ name: "ModalCloseButton" })

	const emit = defineEmits<{
		click: [event: MouseEvent]
	}>()
</script>

<template>
	<button
		type="button"
		class="flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-500 outline-none enabled:hover:bg-neutral-100 enabled:hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-neutral-200"
		aria-label="Fechar"
		@click="emit('click', $event)">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true">
			<path
				d="M4 4L12 12M12 4L4 12"
				stroke="currentColor"
				stroke-width="1.25"
				stroke-linecap="round"
				stroke-linejoin="round" />
		</svg>
	</button>
</template>
