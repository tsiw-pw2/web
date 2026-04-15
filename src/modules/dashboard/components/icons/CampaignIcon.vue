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
			d="M6.45832 13.5417H13.5417M14.375 3.12497H5.625C4.24429 3.12497 3.125 4.24426 3.125 5.62497V14.375C3.125 15.7557 4.24429 16.875 5.625 16.875H14.375C15.7558 16.875 16.875 15.7557 16.875 14.375V5.62497C16.875 4.24426 15.7558 3.12497 14.375 3.12497ZM6.45832 7.70829V6.45829H7.70832V7.70829H6.45832Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round" />
	</svg>
</template>
