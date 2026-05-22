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
        class="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-500 outline-none enabled:hover:bg-neutral-100 enabled:hover:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300"
        aria-label="Fechar"
        @click="emit('click', $event)"
    >
         <ModalCloseXIcon /> </button
    >
</template>

