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
			d="M10.0002 10.2083C6.85067 10.2083 4.89147 12.0176 4.12265 14.4126C3.70064 15.7273 4.86952 16.875 6.25023 16.875H13.5419C14.9226 16.875 16.0928 15.7304 15.699 14.407C14.9871 12.0148 13.1473 10.2083 10.0002 10.2083ZM10.0002 10.2083C12.0713 10.2083 13.7502 8.52936 13.7502 6.45829C13.7502 4.38722 12.0713 2.70829 10.0002 2.70829C7.92918 2.70829 6.25025 4.38722 6.25025 6.45829C6.25025 8.52936 7.92916 10.2083 10.0002 10.2083Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linejoin="round" />
	</svg>
</template>
