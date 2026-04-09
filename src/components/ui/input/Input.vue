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
        :class="cn('mt-1 h-9 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-sm font-medium leading-5 text-neutral-900 outline-none placeholder:text-neutral-500 focus:border-[#008BF8] focus:border-[1.5px]', props.class)"
    />
</template>

