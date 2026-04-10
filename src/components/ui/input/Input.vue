<script setup lang="ts">
	import type { HTMLAttributes } from "vue"
	import { cn } from "../../../lib/utils"

	defineOptions({
    	inheritAttrs: false,
	})

	const props = defineProps<{ class?: HTMLAttributes["class"] }>()
	const modelValue = defineModel<string | undefined>()
</script>

<template>
    <input
        v-model="modelValue"
        v-bind="$attrs"
        :class="cn('mt-1 h-9 w-full rounded-lg border border-neutral-200 bg-white px-2.5 text-sm font-medium leading-5 text-neutral-900 shadow-sm outline-none placeholder:text-neutral-600 focus:shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05),inset_0_0_0_1.5px_#008BF8]', props.class)"
    />
</template>

