<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { InputIconProp } from "@/shared/components/icons/input-icons"
import { resolveInputIcon } from "@/shared/components/icons/input-icons"
import { cn } from "@/shared/lib/utils"
import { computed, useAttrs, useSlots } from "vue"

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<{
    class?: HTMLAttributes["class"]
    leftIcon?: InputIconProp
    rightIcon?: InputIconProp
}>()

const modelValue = defineModel<string | undefined>()
const slots = useSlots()
const attrs = useAttrs()

const leftResolved = computed(() => resolveInputIcon(props.leftIcon))
const rightResolved = computed(() => resolveInputIcon(props.rightIcon))

const showLeft = computed(() => Boolean(slots.left) || Boolean(slots.default) || leftResolved.value != null)
const showRight = computed(() => Boolean(slots.right) || rightResolved.value != null)

const isTemporalInput = computed(() => {
    const type = attrs.type
    return type === "date" || type === "time" || type === "datetime-local"
})

const isTemporalEmpty = computed(() => {
    if (!isTemporalInput.value) return false
    const value = modelValue.value
    return value == null || value === ""
})

const inputTextClass = computed(() =>
    isTemporalEmpty.value ? "text-neutral-500" : "text-neutral-900",
)
</script>

<template>

    <div
        :class="
            cn(
                'flex h-[34px] w-full min-w-0 gap-1 cursor-text items-center rounded-lg bg-white px-2',
                'text-sm font-medium leading-5 outline-none input-shadow',
                '[&_svg]:shrink-0 [&_svg]:text-neutral-500',
                'has-[:disabled]:cursor-not-allowed has-[:disabled]:select-none has-[:disabled]:opacity-60',
                props.class,
            )
        "
    >
         <span v-if="showLeft" class="flex shrink-0 items-center justify-center [&_svg]:size-4"
            > <template v-if="$slots.left || $slots.default"> <slot name="left" /> <slot /> </template> <component v-else-if="leftResolved" :is="leftResolved" /> </span
        > <input
            v-bind="$attrs"
            v-model="modelValue"
            :class="
                cn(
                    'min-w-0 flex-1 bg-transparent px-0.5 text-sm font-medium leading-5 outline-none',
                    inputTextClass,
                    'caret-blue-500 placeholder:text-neutral-500',
                    'disabled:cursor-not-allowed disabled:select-none',
                )
            "
        /> <span v-if="showRight" class="flex shrink-0 items-center justify-center [&_svg]:size-4"
            > <slot v-if="$slots.right" name="right" /> <component v-else-if="rightResolved" :is="rightResolved" /> </span
        >
    </div>

</template>