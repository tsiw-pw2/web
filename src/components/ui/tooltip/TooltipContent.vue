<script setup lang="ts">
import type { TooltipContentEmits, TooltipContentProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { TooltipContent, useForwardPropsEmits } from "reka-ui"
import { cn } from "../../../lib/utils"

defineOptions({
    inheritAttrs: false,
})

const props = withDefaults(defineProps<TooltipContentProps & { class?: HTMLAttributes["class"] }>(), {
    sideOffset: 6,
})
const emits = defineEmits<TooltipContentEmits>()

const delegatedProps = reactiveOmit(props, "class")
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
    <TooltipContent
        data-slot="tooltip-content"
        v-bind="{ ...$attrs, ...forwarded }"
        :class="
            cn(
                'z-50 overflow-hidden rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-md',
                props.class
            )
        "
    >
        <slot />
    </TooltipContent>
</template>

