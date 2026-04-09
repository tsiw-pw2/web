<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "../../../lib/utils"

defineOptions({
    inheritAttrs: false,
})

const modelValue = defineModel<boolean>()

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()

const CHECKBOX_BASE_CLASSES = "size-5 rounded border-neutral-300"
</script>

<template>
    <input v-model="modelValue" type="checkbox" v-bind="$attrs" :class="cn(CHECKBOX_BASE_CLASSES, props.class)" />
</template>

