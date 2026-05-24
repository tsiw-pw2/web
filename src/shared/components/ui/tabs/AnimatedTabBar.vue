<script setup lang="ts">
import { provide, ref } from "vue"
import { cn } from "@/shared/lib/utils"
import { ANIMATED_TAB_BAR_KEY, useAnimatedTabIndicator } from "@/shared/composables/useAnimatedTabIndicator"

defineOptions({ name: "AnimatedTabBar" })

const props = defineProps<{
    ariaLabel: string
    class?: string
}>()

const listRef = ref<HTMLElement | null>(null)
const { indicatorStyle, transitionsEnabled, registerTab, updateIndicator } = useAnimatedTabIndicator(listRef)

provide(ANIMATED_TAB_BAR_KEY, { registerTab, updateIndicator })
</script>

<template>
    <div
        ref="listRef"
        role="tablist"
        :aria-label="props.ariaLabel"
        :class="cn('relative flex gap-1 overflow-x-auto border-b border-neutral-200', props.class)"
    >
        <div
            aria-hidden="true"
            :class="
                cn(
                    'pointer-events-none absolute bottom-0 left-0 z-10 h-0.5 rounded-full bg-blue-500',
                    transitionsEnabled && 'transition-[transform,width,opacity] duration-300 ease-out',
                )
            "
            :style="indicatorStyle"
        />
        <slot />
    </div>
</template>
