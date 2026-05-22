<script setup lang="ts">
import { cn } from "@/shared/lib/utils"

const props = withDefaults(
    defineProps<{
        class?: string
        paddingEnd?: boolean
        align?: "start" | "end"
    }>(),
    {
        paddingEnd: true,
        align: "start",
    },
)
</script>

<template>

    <th
        :class="
            cn(
                'h-10 max-h-10 py-0 align-middle text-xs font-medium leading-4 text-neutral-500',
                props.paddingEnd && 'pe-4',
                props.align === 'end' && 'text-end',
                props.class,
            )
        "
    >
        <slot />
    </th>

</template>

