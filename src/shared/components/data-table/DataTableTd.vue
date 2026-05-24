<script setup lang="ts">
import { cn } from "@/shared/lib/utils"

const props = withDefaults(
    defineProps<{
        class?: string
        emphasis?: boolean
        paddingEnd?: boolean
        truncate?: boolean
        align?: "start" | "end"
    }>(),
    {
        emphasis: false,
        paddingEnd: true,
        truncate: true,
        align: "start",
    },
)
</script>

<template>

    <td
        :class="
            cn(
                'h-10 max-h-10 px-3 py-0 align-middle text-sm leading-5 text-neutral-950',
                props.emphasis && 'font-medium',
                props.align === 'end' && 'text-end',
                props.truncate && 'min-w-0 max-w-0 overflow-hidden',
                props.class,
            )
        "
    >
        <span
            v-if="props.truncate"
            :class="
                cn(
                    'flex h-full min-h-0 max-w-full items-center truncate whitespace-nowrap',
                    props.align === 'end' && 'justify-end text-end',
                )
            "
        >
            <slot />
        </span>
        <slot v-else />
    </td>

</template>

