<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "../../../lib/utils"

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()

const TEXTAREA_BASE_CLASSES =
    "mt-1 h-[94px] w-full rounded-lg border border-neutral-200 px-3.5 py-3 text-sm font-medium leading-5 text-neutral-900 shadow-sm outline-none placeholder:text-neutral-500 focus:border-neutral-400"
</script>

<template>
    <textarea v-bind="$attrs" :class="cn(TEXTAREA_BASE_CLASSES, props.class)" />
</template>

