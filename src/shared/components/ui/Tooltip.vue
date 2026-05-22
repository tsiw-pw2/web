<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "Tooltip", inheritAttrs: false })

const props = defineProps<{
    class?: HTMLAttributes["class"]
    contentClass?: HTMLAttributes["class"]
}>()
</script>

<template>
    <span :class="cn('group relative inline-flex', props.class)" v-bind="$attrs">
        <slot />
        <span
            role="tooltip"
            :class="
                cn(
                    'pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 flex w-max max-w-xs -translate-x-1/2 flex-col items-center gap-0 opacity-0 drop-shadow-[0_2px_6px_rgba(10,10,10,0.24)] transition-opacity duration-150 group-hover:opacity-100',
                    props.contentClass,
                )
            "
        >
            <span class="rounded-t-md bg-neutral-800 px-2.5 py-1.5 text-xs font-medium leading-4 text-white">
                <slot name="content" />
            </span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="6"
                viewBox="0 0 18 6"
                fill="none"
                class="-mt-px block shrink-0 text-neutral-800"
                aria-hidden="true"
            >
                <path d="M0 0H18C18 0 13.5002 0 11.2499 3.91111C10.2554 5.63974 7.74429 5.63982 6.74987 3.91111C4.50005 0 0 0 0 0Z" fill="currentColor" />
            </svg>
        </span>
    </span>
</template>
