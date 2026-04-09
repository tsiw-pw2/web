<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue"
import { Dialog, DialogContent } from "./dialog"

const props = withDefaults(
    defineProps<{
        modelValue: boolean
        title?: string
        maxWidthClass?: string
        closeOnBackdrop?: boolean
        closeOnEsc?: boolean
    }>(),
    {
        title: undefined,
        maxWidthClass: "max-w-lg",
        closeOnBackdrop: true,
        closeOnEsc: true,
    },
)

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void
    (e: "close"): void
}>()

const isOpen = computed(() => props.modelValue)

function close() {
    emit("update:modelValue", false)
    emit("close")
}

function onEscapeKeyDown(e: KeyboardEvent) {
    if (!props.closeOnEsc) e.preventDefault()
}

function onPointerDownOutside(e: Event) {
    if (!props.closeOnBackdrop) e.preventDefault()
}

watch(
    () => isOpen.value,
    (open) => {
        document.body.classList.toggle("modal-open", open)
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    document.body.classList.remove("modal-open")
})
</script>

<template>
    <Dialog :open="isOpen" @update:open="emit('update:modelValue', $event)">
        <DialogContent
            :show-close-button="false"
            :class="['border-0 bg-white p-4 shadow-xl max-h-[calc(100vh-2rem)] flex flex-col', props.maxWidthClass]"
            @escape-key-down="onEscapeKeyDown"
            @pointer-down-outside="onPointerDownOutside"
        >
            <div v-if="props.title" class="flex items-center justify-between gap-4">
                <h3 class="text-lg font-semibold">{{ props.title }}</h3>
                <button type="button" class="rounded-md px-2 py-1 text-neutral-600 hover:bg-neutral-100" @click="close">×</button>
            </div>
            <div class="flex-1">
                <slot />
            </div>
            <div v-if="$slots.footer" class="flex justify-end gap-2">
                <slot name="footer" :close="close" />
            </div>
        </DialogContent>
    </Dialog>
</template>

