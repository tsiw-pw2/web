<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"
import { dataTableActionButtonVariantClasses, type DataTableActionButtonVariant } from "./dataTableActionButtonVariants"

const props = defineProps<{
    variant: DataTableActionButtonVariant
    ariaLabel: string
    disabled?: boolean
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <button
        type="button"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :class="
            cn(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-neutral-200 disabled:cursor-not-allowed disabled:opacity-50',
                dataTableActionButtonVariantClasses[variant],
                props.class,
            )
        "
    >
        <slot />
    </button>
</template>
