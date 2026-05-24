<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "UserBlockIcon" })

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
            d="M8 8C9.38071 8 10.5 6.88071 10.5 5.5C10.5 4.11929 9.38071 3 8 3C6.61929 3 5.5 4.11929 5.5 5.5C5.5 6.88071 6.61929 8 8 8Z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M3.5 13C3.5 10.7909 5.29086 9 7.5 9H8.5C10.7091 9 12.5 10.7909 12.5 13"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <circle cx="12" cy="12" r="2.25" stroke="currentColor" stroke-width="1.25" />
        <path d="M11 12H13" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" />
    </svg>
</template>
