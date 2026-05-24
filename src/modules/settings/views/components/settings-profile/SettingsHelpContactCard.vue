<script setup lang="ts">
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import { legalConfig } from "@/app/config/legal"

const { supportEmail, privacyEmail } = legalConfig
</script>

<template>
    <section class="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <h3 class="text-sm font-semibold leading-5 text-neutral-950">Ajuda e contacto</h3>
        <p class="mt-2 text-sm leading-5 text-neutral-600">
            Suporte:
            <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a
            >. Privacidade:
            <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${privacyEmail}`">{{ privacyEmail }}</a
            >.
        </p>
        <RouterLink :to="routePaths.help" class="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline">
            Ver ajuda completa
        </RouterLink>
    </section>
</template>
