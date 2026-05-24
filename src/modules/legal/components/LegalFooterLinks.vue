<script setup lang="ts">
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"

withDefaults(
    defineProps<{
        layout?: "row" | "stack"
    }>(),
    { layout: "row" },
)
</script>

<template>
    <nav
        class="flex text-sm text-neutral-600"
        :class="layout === 'stack' ? 'flex-col gap-2' : 'flex-wrap items-center gap-x-6 gap-y-2'"
        aria-label="Documentos legais"
    >
        <RouterLink :to="routePaths.terms" class="hover:text-neutral-950">Termos de utilização</RouterLink>
        <RouterLink :to="routePaths.privacy" class="hover:text-neutral-950">Política de privacidade</RouterLink>
        <RouterLink :to="routePaths.help" class="hover:text-neutral-950">Ajuda e contacto</RouterLink>
    </nav>
</template>
