<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "SelectChevronDownIcon" })

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" :class="cn('size-4 shrink-0 text-neutral-500', props.class)">

        <path d="M5.3335 7.66699L8.00016 10.3337L10.6668 7.66699" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
         </svg
    >
</template>

