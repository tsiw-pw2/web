<script setup lang="ts">
import ModalCloseXIcon from "@/shared/components/icons/ModalCloseXIcon.vue"

defineOptions({ name: "ModalCloseButton" })

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()
</script>

<template>
    <button
        type="button"
        class="p-1 rounded-full text-neutral-500 outline-none duration-200 ease-out hover:bg-white hover:shadow-btn-secondary"
        aria-label="Fechar"
        @click="emit('click', $event)"
    >
        <ModalCloseXIcon />
    </button>
</template>
