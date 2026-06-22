<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "MapPinIcon" })

const props = withDefaults(
    defineProps<{
        size?: number
        strokeWidth?: number
        class?: HTMLAttributes["class"]
    }>(),
    { size: 24, strokeWidth: 1.5 },
)
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="props.size"
        :height="props.size"
        viewBox="0 0 24 24"
        fill="none"
        :class="cn('shrink-0', props.class)"
        aria-hidden="true"
        focusable="false"
    >
        <path
            d="M14.75 10C14.75 11.5188 13.5188 12.75 12 12.75C10.4812 12.75 9.25 11.5188 9.25 10C9.25 8.48122 10.4812 7.25 12 7.25C13.5188 7.25 14.75 8.48122 14.75 10Z"
            stroke="currentColor"
            :stroke-width="props.strokeWidth"
            vector-effect="non-scaling-stroke"
            stroke-linejoin="round"
        />
        <path
            d="M19.25 10C19.25 14.1772 15.8227 17.996 13.681 19.9746C12.7191 20.8633 11.2809 20.8633 10.319 19.9746C8.17726 17.996 4.75 14.1772 4.75 10C4.75 5.99594 7.99594 2.75 12 2.75C16.0041 2.75 19.25 5.99594 19.25 10Z"
            stroke="currentColor"
            :stroke-width="props.strokeWidth"
            vector-effect="non-scaling-stroke"
            stroke-linejoin="round"
        />
    </svg>
</template>
