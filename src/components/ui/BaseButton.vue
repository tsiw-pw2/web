<script setup lang="ts">
import { Button } from "./button"

type Variant = "primary" | "secondary"

const props = withDefaults(defineProps<{ variant?: Variant }>(), {
    variant: "primary",
})

const BUTTON_BASE_CLASSES = "flex items-center whitespace-nowrap px-3 py-2 font-semibold rounded-lg duration-200 ease-out cursor-pointer active:scale-98"

const buttonVariantClasses: Record<Variant, string> = {
    primary:
        "bg-linear-to-b from-[#008BF8] to-[#2A4DEB] shadow-[0_1px_2px_0_rgba(28,78,244,0.24),0_-1px_0_0_rgba(0,0,0,0.16)_inset,0_1px_0_0_rgba(255,255,255,0.24)_inset] hover:opacity-90",
    secondary:
        "bg-linear-to-b from-[#008BF8] to-[#2A4DEB] shadow-[0_1px_2px_0_rgba(28,78,244,0.24),0_-1px_0_0_rgba(0,0,0,0.16)_inset,0_1px_0_0_rgba(255,255,255,0.24)_inset]",
}

const TEXT: Record<Variant, string> = {
    primary: "text-white text-shadow-[0_0.5px_1px_rgba(0,0,0,0.25)]",
    secondary: "text-white text-shadow-[0_0.5px_1px_rgba(0,0,0,0.25)]",
}
</script>

<template>
    <Button type="button" :class="[BUTTON_BASE_CLASSES, buttonVariantClasses[props.variant]]">
        <span :class="[TEXT[props.variant]]">
            <slot />
        </span>
    </Button>
</template>
