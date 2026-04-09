<script setup lang="ts">
import { watchEffect } from "vue"
import { RouterView, useRoute } from "vue-router"
import AppHeader from "./components/layout/AppHeader.vue"

const route = useRoute()

watchEffect(() => {
    const allowBodyScroll = route.meta?.bodyScroll === true
    document.body.classList.toggle("app-shell", !allowBodyScroll)
})
</script>

<template>

    <div class="flex h-screen w-full flex-col overflow-hidden bg-neutral-950 pb-2">
         <AppHeader />
        <main class="mx-2 flex flex-1 flex-col overflow-y-auto overscroll-none rounded-b-sm rounded-t-lg bg-white py-8">

            <div class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4"> <RouterView /> </div>

        </main>

    </div>

</template>

