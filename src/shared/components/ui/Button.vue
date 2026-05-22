<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({ name: "Button", inheritAttrs: false })

type ButtonVariant = "primary" | "secondary" | "danger"

const VARIANT_CLASS_PARTS: Record<ButtonVariant, readonly string[]> = {
    primary: [
        "text-sm leading-5 select-none outline-none w-min whitespace-nowrap font-semibold shadow-btn-primary bg-linear-to-b from-[#008BF8] to-[#2A4DEB] rounded-lg h-9 px-3 ease-out duration-300 cursor-pointer will-change-transform text-white",
        "enabled:hover:opacity-90 enabled:active:scale-97 disabled:opacity-60 disabled:cursor-not-allowed",
        "focus:outline-none focus-visible:outline-2 focus-visible:outline-blue-100",
    ],
    secondary: [
        "text-sm leading-5 select-none outline-none w-min whitespace-nowrap font-semibold shadow-btn-secondary bg-linear-to-b from-white to-neutral-50 rounded-lg h-[34px] px-3 ease-out duration-300 cursor-pointer will-change-transform",
        "enabled:hover:from-neutral-50 enabled:hover:to-neutral-100 enabled:active:scale-97 disabled:opacity-60 disabled:cursor-not-allowed",
        "focus:outline-none focus-visible:outline-2 focus-visible:outline-neutral-100",
    ],
    danger: [
        "text-sm leading-5 select-none outline-none w-min whitespace-nowrap font-semibold shadow-btn-danger bg-linear-to-b from-[#EF233C] to-[#D90429] rounded-lg h-9 px-3 ease-out duration-300 cursor-pointer will-change-transform text-white",
        "enabled:hover:opacity-90 enabled:active:scale-97 disabled:opacity-60 disabled:cursor-not-allowed",
        "focus:outline-none focus-visible:outline-2 focus-visible:outline-red-100",
    ],
}

const props = withDefaults(
    defineProps<{
        class?: HTMLAttributes["class"]
        type?: "button" | "submit" | "reset"
        variant?: ButtonVariant
        busy?: boolean
        pressed?: boolean
        expanded?: boolean
    }>(),
    {
        type: "button",
        variant: "primary",
    },
)
</script>

<template>
     <button
        :type="props.type"
        :data-variant="props.variant"
        :aria-busy="props.busy === true ? true : undefined"
        :aria-pressed="typeof props.pressed === 'boolean' ? props.pressed : undefined"
        :aria-expanded="typeof props.expanded === 'boolean' ? props.expanded : undefined"
        v-bind="$attrs"
        :class="cn(...VARIANT_CLASS_PARTS[props.variant], props.class)"
    >
         <span class="mx-0.5"> <slot /> </span> </button
    >
</template>

