<script setup lang="ts">
import { onMounted, onUpdated, ref, type HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"

const props = defineProps<{
    text: string
    class?: HTMLAttributes["class"]
}>()

const rootRef = ref<HTMLElement | null>(null)
const titleAttr = ref<string | undefined>(undefined)

function syncTitle() {
    const el = rootRef.value
    if (!el) return
    titleAttr.value = el.scrollWidth > el.clientWidth ? props.text : undefined
}

onMounted(syncTitle)
onUpdated(syncTitle)
</script>

<template>
    <span
        ref="rootRef"
        :class="cn('min-w-0 flex-1 truncate text-end', props.class)"
        :title="titleAttr"
    >
        {{ text }}
    </span>
</template>
