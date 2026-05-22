<script setup lang="ts">
import { useSlots } from "vue"

defineOptions({ name: "ScrollableTableSection" })

const props = withDefaults(
    defineProps<{
        fillContainer?: boolean
    }>(),
    { fillContainer: false },
)

const slots = useSlots()
</script>

<template>

    <div
        class="flex w-full min-w-0 flex-col"
        :class="props.fillContainer ? 'min-h-0 flex-1' : 'h-[calc(100dvh-15rem)] min-h-[12rem]'"
    >

        <div
            class="scrollbar-transparent flex min-h-0 flex-1 flex-col overflow-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
        >
            <slot />
        </div>

        <div v-if="slots.footer" class="w-full shrink-0 border-t border-neutral-200 bg-white pt-4">
            <slot name="footer" />
        </div>

    </div>

</template>
