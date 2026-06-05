<script setup lang="ts">
import { computed, watchEffect } from "vue"
import { RouterView, useRoute } from "vue-router"
import { Toaster } from "vue-sonner"
import ToastSuccessIcon from "@/shared/components/toast/ToastSuccessIcon.vue"
import AppHeader from "@/shared/components/layout/AppHeader.vue"
import MobileBottomNav from "@/shared/components/layout/MobileBottomNav.vue"

const route = useRoute()

const toasterMobileOffset = { bottom: "5rem" }

const toasterToastOptions = {
    class: "bg-white !border-0 !shadow-[0_2px_3px_0_rgba(0,0,0,0.06),0_1px_2px_0_rgba(0,0,0,0.24),0_0_0_1px_var(--neutral-200,#E5E5E5)]",
    classes: {
        toast: "rounded-lg border border-neutral-200 bg-white !items-start",
        icon: "self-start mx-0.5 !items-start",
        title: "text-sm font-medium leading-5 text-neutral-800",
        description: "text-sm leading-5 text-neutral-500",
    },
}

watchEffect(() => {
    const allowBodyScroll = route.meta?.bodyScroll === true
    const useShell = !allowBodyScroll
    document.documentElement.classList.toggle("app-shell", useShell)
    document.body.classList.toggle("app-shell", useShell)
})

const hideChrome = computed(() => route.meta?.hideChrome === true)
</script>

<template>
    <Toaster position="bottom-right" theme="light" :mobile-offset="toasterMobileOffset" :toast-options="toasterToastOptions">
        <template #success-icon>
            <ToastSuccessIcon />
        </template>
    </Toaster>

    <div v-if="hideChrome" class="min-h-screen bg-white">
        <RouterView />
    </div>

    <div v-else class="flex h-dvh w-full flex-col bg-neutral-950 pb-0 md:pb-2">
        <AppHeader />
        <div class="flex min-h-0 flex-1 flex-col">
            <div class="mx-2 mb-2 flex min-h-0 flex-1 flex-col md:mb-0">
                <main class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white md:rounded-b-sm md:rounded-t-lg">
                    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-px">
                        <div class="mx-auto flex w-full min-h-0 max-w-5xl flex-1 flex-col px-3 pt-6 pb-8 sm:px-4 md:pt-8">
                            <RouterView v-slot="{ Component }">
                                <component :is="Component" class="flex min-h-0 w-full flex-1 flex-col" />
                            </RouterView>
                        </div>
                    </div>
                </main>
            </div>
            <MobileBottomNav />
        </div>
    </div>
</template>
