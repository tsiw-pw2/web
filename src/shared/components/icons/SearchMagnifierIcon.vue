<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "SearchMagnifierIcon" })

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        :class="cn('size-4 shrink-0 text-neutral-500', props.class)"
    >
        <path
            d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M14 14L11.1 11.1"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>
