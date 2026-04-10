<script setup lang="ts">
defineProps<{
    label: string
    value: string | number
}>()
</script>

<template>
    <div class="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div class="flex gap-4">
            <div class="flex size-10 shrink-0 items-center justify-center text-[#008BF8] [&_svg]:size-6">
                <slot name="icon" />
            </div>
            <div class="min-w-0 flex-1">
                <p class="text-sm font-medium leading-5 text-neutral-950">{{ label }}</p>
                <p class="mt-1 text-3xl font-semibold leading-9 tracking-tight text-neutral-950">{{ value }}</p>
            </div>
        </div>
    </div>
</template>
