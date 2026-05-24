<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "UserUnblockIcon" })

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
        :class="cn('shrink-0', props.class)"
    >
        <path
            d="M8 8.66667C9.47276 8.66667 10.6667 7.47276 10.6667 6C10.6667 4.52724 9.47276 3.33333 8 3.33333C6.52724 3.33333 5.33333 4.52724 5.33333 6C5.33333 7.47276 6.52724 8.66667 8 8.66667Z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M3.33333 13.3333C3.33333 11.1242 5.12417 9.33333 7.33333 9.33333H8.66667C10.8758 9.33333 12.6667 11.1242 12.6667 13.3333"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M11.3333 12L12.3333 13L14.3333 11"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>
