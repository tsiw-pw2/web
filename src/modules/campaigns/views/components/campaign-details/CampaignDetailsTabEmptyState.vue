<script setup lang="ts">
import Button from "@/shared/components/ui/Button.vue"

defineProps<{
    title: string
    hint: string
    actionLabel?: string
}>()

const emit = defineEmits<{
    action: []
}>()
</script>

<template>
    <div class="flex min-h-[14rem] flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div
            class="shadow-badge mb-4 flex size-12 items-center justify-center rounded-full bg-white text-neutral-500 [&_svg]:!text-neutral-500"
            aria-hidden="true"
        >
            <slot name="icon" />
        </div>
        <p class="text-base font-medium leading-6 text-neutral-950">{{ title }}</p>
        <p class="mt-2 max-w-md text-balance text-sm leading-5 text-neutral-600">{{ hint }}</p>
        <Button v-if="actionLabel" class="mt-5" type="button" variant="primary" @click="emit('action')">
            {{ actionLabel }}
        </Button>
    </div>
</template>
