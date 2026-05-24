<script setup lang="ts">
import LegalFooterLinks from "@/modules/legal/components/LegalFooterLinks.vue"
</script>

<template>
    <div class="min-h-screen bg-white text-neutral-950">
        <div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4">
            <header class="flex h-20 select-none items-start justify-center pt-8">
                <img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
            </header>
            <main class="flex flex-1 items-center justify-center pb-12">
                <slot />
            </main>
            <footer class="flex items-center justify-between py-6 text-xs text-neutral-500">
                <div>© Mariva</div>
                <LegalFooterLinks class="!text-xs" />
            </footer>
        </div>
    </div>
</template>
