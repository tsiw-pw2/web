<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "FieldClearIcon" })

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
            d="M5.3335 10.8367L8.00016 8.17L10.6668 10.8367M5.3335 5.16992L8.00016 7.83659L10.6668 5.16992"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>
