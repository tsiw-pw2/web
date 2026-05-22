<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "TrashBucketIcon" })

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" :class="cn('shrink-0', props.class)">

        <path
            d="M3.1665 4.33366L3.72638 12.3071C3.79994 13.3547 4.67126 14.167 5.72147 14.167H10.2782C11.3284 14.167 12.1997 13.3547 12.2733 12.3071L12.8332 4.33366M2.1665 3.83366H13.8332M5.68294 3.72225C5.8204 2.56467 6.8053 1.66699 7.9999 1.66699C9.19444 1.66699 10.1794 2.56467 10.3168 3.72225"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
         </svg
    >
</template>

