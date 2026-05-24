<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "CalendarIcon" })

const props = withDefaults(
    defineProps<{
        size?: number
        class?: HTMLAttributes["class"]
    }>(),
    { size: 16 },
)
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="props.size"
        :height="props.size"
        viewBox="0 0 16 16"
        fill="none"
        :class="cn('shrink-0 text-neutral-400', props.class)"
        aria-hidden="true"
        focusable="false"
    >
        <path
            d="M2.5 6.5H13.5M5.16667 3.16666V1.83333M10.8333 3.16666V1.83333M2.5 5.16666C2.5 4.0621 3.39543 3.16666 4.5 3.16666H11.5C12.6046 3.16666 13.5 4.0621 13.5 5.16666V11.5C13.5 12.6046 12.6046 13.5 11.5 13.5H4.5C3.39543 13.5 2.5 12.6046 2.5 11.5V5.16666Z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>
