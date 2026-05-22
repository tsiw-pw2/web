<script setup lang="ts">
import Button from "@/shared/components/ui/Button.vue"

const emit = defineEmits<{
    create: []
}>()
</script>

<template>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 class="text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">Praias</h2>
        <Button class="w-full shrink-0 touch-manipulation sm:w-auto" @click="emit('create')"> Criar Praia </Button>
    </div>
</template>
