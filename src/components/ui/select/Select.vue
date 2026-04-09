<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "../../../lib/utils"

defineOptions({ inheritAttrs: false })

const modelValue = defineModel<string | undefined>()

const props = defineProps<{ class?: HTMLAttributes["class"] }>()

const SELECT_BASE_CLASSES = "mt-1 h-9 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-sm font-medium leading-5 text-neutral-900 shadow-sm outline-none invalid:text-neutral-500 [&>option]:font-medium [&>option]:text-neutral-900 focus:border-neutral-400"
</script>

<template>
    <select v-model="modelValue" v-bind="$attrs" :class="cn(SELECT_BASE_CLASSES, props.class)">
        <slot />
    </select>
</template>

