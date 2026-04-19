<script setup lang="ts">
	defineOptions({ name: "DataTableScrollWrap" })
</script>

<template>
	<div class="flex min-h-0 w-full min-w-0 flex-1 touch-pan-x flex-col overflow-x-auto">
		<slot />
	</div>
</template>
