<script setup lang="ts">
import { selectOptionClasses } from "@/shared/components/ui/select/design"

const props = defineProps<{
    listboxId: string
    createIndex: number
    name: string
    highlighted: boolean
    onCreateMouseDown: () => void
    onCreateMouseEnter: () => void
}>()
</script>

<template>
    <div
        :id="`${listboxId}-opt-${createIndex}`"
        role="option"
        :aria-selected="false"
        :class="selectOptionClasses(highlighted)"
        @mouseenter="onCreateMouseEnter"
        @mousedown.prevent="onCreateMouseDown"
    >
        <span class="block truncate text-neutral-900">
            Criar "{{ name }}"
        </span>
    </div>
</template>
