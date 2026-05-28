<script setup lang="ts">
import Button from "@/shared/components/ui/Button.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"

const open = defineModel<boolean>({ required: true })

const props = withDefaults(
    defineProps<{
        titleId: string
        title: string
        resourceName?: string
        message: string
        confirmLabel: string
        cancelLabel?: string
        busy?: boolean
        closeOnConfirm?: boolean
    }>(),
    {
        cancelLabel: "Cancelar",
        busy: false,
        closeOnConfirm: true,
    },
)

const emit = defineEmits<{
    confirm: []
}>()

function close() {
    open.value = false
}

function onConfirm() {
    emit("confirm")
    if (props.closeOnConfirm) close()
}
</script>

<template>
    <ModalRoot v-model="open" :ariaLabelledby="titleId" max-width="md">
        <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
                <h3 :id="titleId" class="text-sm font-semibold leading-5 text-neutral-950">{{ title }}</h3>
                <div v-if="resourceName" class="mt-1 text-xs leading-4 text-neutral-500">{{ resourceName }}</div>
            </div>
            <ModalCloseButton @click="close" />
        </div>

        <p class="text-sm leading-5 text-neutral-600">{{ message }}</p>

        <div class="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" :disabled="busy" @click="close">{{ cancelLabel }}</Button>
            <Button type="button" variant="danger" :busy="busy" :disabled="busy" @click="onConfirm">{{ confirmLabel }}</Button>
        </div>
    </ModalRoot>
</template>
