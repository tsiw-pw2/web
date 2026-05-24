<script setup lang="ts">
import type { LabelHTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "FieldLabel" })

const props = withDefaults(
    defineProps<{
        for?: LabelHTMLAttributes["for"]
        as?: "label" | "span"
        class?: string
        optional?: boolean
        required?: boolean
    }>(),
    {
        as: "label",
        optional: false,
        required: false,
    },
)
</script>

<template>
     <component :is="props.as === 'span' ? 'span' : 'label'" :for="props.as === 'label' ? props.for : undefined" :class="cn('text-sm font-medium leading-5 text-neutral-900', props.class)"
        > <span><slot /></span> <span v-if="props.required" class="text-red-500"> *</span> <span v-if="props.optional" class="text-sm font-medium text-neutral-500">(opcional)</span>
        </component
    >
</template>

