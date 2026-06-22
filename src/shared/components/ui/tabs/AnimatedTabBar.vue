<script setup lang="ts">
import { provide, ref } from "vue"
import { cn } from "@/shared/lib/utils"
import { ANIMATED_TAB_BAR_KEY, useAnimatedTabIndicator } from "@/shared/composables/useAnimatedTabIndicator"

defineOptions({ name: "AnimatedTabBar" })

const props = defineProps<{
    ariaLabel: string
    class?: string
}>()

const scrollportRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const { registerTab, updateIndicator } = useAnimatedTabIndicator(trackRef, scrollportRef, indicatorRef)

provide(ANIMATED_TAB_BAR_KEY, { registerTab, updateIndicator })
</script>

<template>
    <div ref="scrollportRef" :class="cn('overflow-x-auto border-b border-neutral-200', props.class)">
        <div
            ref="trackRef"
            role="tablist"
            :aria-label="props.ariaLabel"
            class="relative flex w-max min-w-full gap-1"
        >
            <div
                ref="indicatorRef"
                aria-hidden="true"
                class="pointer-events-none absolute bottom-0 left-0 z-10 h-0.5 rounded-full bg-blue-500 will-change-[transform,width]"
                style="opacity: 0"
            />
            <slot />
        </div>
    </div>
</template>
