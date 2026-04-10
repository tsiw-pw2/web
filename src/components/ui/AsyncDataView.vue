<script setup lang="ts">
import type { AsyncDataPhase } from "../../composables/useAsyncDataPhase"

defineProps<{
    phase: AsyncDataPhase
    errorMessage?: string | null
}>()
</script>

<template>
    <div class="min-h-[120px]">
        <div v-if="phase === 'loading'" class="flex flex-col gap-2 py-8">
            <slot name="loading">
                <div class="h-3 w-40 animate-pulse rounded bg-neutral-200" />
                <div class="h-3 w-full max-w-md animate-pulse rounded bg-neutral-100" />
                <div class="h-3 w-full max-w-sm animate-pulse rounded bg-neutral-100" />
            </slot>
        </div>
        <div v-else-if="phase === 'error'" class="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
            <slot name="error">
                <p class="text-sm font-medium text-red-800">
                    {{ errorMessage || "Não conseguimos mostrar esta informação. Atualiza a página ou tenta dentro de momentos." }}
                </p>
            </slot>
        </div>
        <div
            v-else-if="phase === 'empty'"
            class="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white px-6 py-14 text-center shadow-sm"
        >
            <slot name="empty" />
        </div>
        <div v-else>
            <slot />
        </div>
    </div>
</template>
