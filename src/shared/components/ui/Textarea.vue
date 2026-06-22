<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()

const modelValue = defineModel<string | undefined>()
</script>

<template>

    <div
        :class="
            cn(
                'flex h-[94px] min-h-[94px] min-w-0 cursor-text rounded-lg bg-white px-2 py-[7px]',
                'text-sm font-medium leading-5 outline-none input-shadow',
                'w-min',
                'has-[:disabled]:cursor-not-allowed has-[:disabled]:select-none',
                props.class,
            )
        "
    >
        <textarea
            v-bind="$attrs"
            v-model="modelValue"
            :class="
                cn(
                    'min-h-0 min-w-0 flex-1 resize-none bg-transparent px-0.5 text-sm font-medium leading-5 text-neutral-900 outline-none',
                    'caret-blue-500 placeholder:text-neutral-500',
                    'disabled:cursor-not-allowed disabled:select-none',
                )
            "
        />
    </div>

</template>
