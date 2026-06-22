<script setup lang="ts">
import { inject, onBeforeUnmount, ref, watch, type ComponentPublicInstance } from "vue"
import { cn } from "@/shared/lib/utils"
import { ANIMATED_TAB_BAR_KEY } from "@/shared/composables/useAnimatedTabIndicator"

defineOptions({ name: "AnimatedTabTrigger", inheritAttrs: false })

const props = withDefaults(
    defineProps<{
        active: boolean
        as?: "button" | "a"
        class?: string
        id?: string
    }>(),
    {
        as: "button",
    },
)

const tabBar = inject(ANIMATED_TAB_BAR_KEY)
const elRef = ref<HTMLElement | null>(null)
const registrationId = Symbol("animatedTab")

function resolveElement(el: Element | ComponentPublicInstance | null): HTMLElement | null {
    if (el instanceof HTMLElement) return el
    if (el && "$el" in el && el.$el instanceof HTMLElement) return el.$el
    return null
}

function setTabRef(el: Element | ComponentPublicInstance | null) {
    elRef.value = resolveElement(el)
    syncRegistration()
}

function syncRegistration() {
    tabBar?.registerTab(registrationId, elRef.value, () => props.active)
}

onBeforeUnmount(() => {
    tabBar?.registerTab(registrationId, null, () => false)
})

watch(
    () => props.active,
    () => {
        tabBar?.updateIndicator()
    },
    { flush: "post" },
)
watch(elRef, syncRegistration)
</script>

<template>
    <component
        :is="props.as"
        :id="props.id"
        :ref="setTabRef"
        :aria-selected="props.active"
        :class="
            cn(
                'relative shrink-0 whitespace-nowrap px-4 pb-3 pt-1 text-sm font-medium outline-none transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400',
                props.active ? 'text-neutral-950' : 'text-neutral-500 hover:text-neutral-800',
                props.class,
            )
        "
        v-bind="$attrs"
    >
        <slot />
    </component>
</template>
