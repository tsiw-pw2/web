<script setup lang="ts">
	withDefaults(defineProps<{ size?: number }>(), { size: 20 })
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		:width="size"
		:height="size"
		viewBox="0 0 20 20"
		fill="none"
		class="mx-0.5 shrink-0 text-[#008BF8]"
		aria-hidden="true"
		focusable="false">
		<path
			d="M13.4646 16.4189L9.40212 9.3825M9.40212 9.3825C8.59021 9.85125 7.8825 10.5004 7.18872 11.3821M9.40212 9.3825C10.214 8.91375 11.13 8.62541 12.2405 8.46541M7.18872 11.3821C5.68952 11.2854 4.24615 12.1187 3.21944 13.6737C1.14837 10.0866 2.37744 5.49961 5.96463 3.42855M7.18872 11.3821C5.11766 7.79487 4.56961 4.23396 5.96463 3.42855M5.96463 3.42855C9.55179 1.35748 14.1388 2.58654 16.2098 6.17374C14.3498 6.28536 12.9064 7.11872 12.2405 8.46541M5.96463 3.42855C7.35965 2.62313 10.1695 4.87821 12.2405 8.46541"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round" />
	</svg>
</template>
