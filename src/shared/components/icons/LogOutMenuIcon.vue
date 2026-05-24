<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "LogOutMenuIcon" })

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
            d="M6 13.5H3.5C2.94772 13.5 2.5 13.0523 2.5 12.5V3.5C2.5 2.94772 2.94772 2.5 3.5 2.5H6"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M10.5 11L13.5 8L10.5 5"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M13.5 8H6.5"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>
