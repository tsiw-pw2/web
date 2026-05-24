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

    <div class="flex flex-1 flex-col items-center justify-center text-center">

        <p class="text-base font-medium leading-6 text-neutral-950">{{ title }}</p>

        <p class="mb-4 mt-2 max-w-sm text-balance text-sm leading-5 text-neutral-600">{{ hint }}</p>
         <Button v-if="actionLabel" @click="emit('action')">{{ actionLabel }}</Button
        >
    </div>

</template>

