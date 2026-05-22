<script setup lang="ts">
import { computed } from "vue"
import Button from "@/shared/components/ui/Button.vue"

const props = defineProps<{
    page: number
    pageSize: number
    total: number
}>()

const emit = defineEmits<{
    prev: []
    next: []
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const canPrev = computed(() => props.page > 1)

const canNext = computed(() => props.page < totalPages.value)
</script>

<template>

    <div class="flex flex-wrap items-center justify-between gap-3">

        <p class="text-sm leading-5 text-neutral-600"> Página {{ page }} de {{ totalPages }} ({{ total }} no total) </p>

        <div class="flex items-center gap-2">
             <Button variant="secondary" type="button" :disabled="!canPrev" @click="emit('prev')"> Anterior </Button> <Button
                variant="secondary"
                type="button"
                :disabled="!canNext"
                @click="emit('next')"
                > Seguinte </Button
            >
        </div>

    </div>

</template>

