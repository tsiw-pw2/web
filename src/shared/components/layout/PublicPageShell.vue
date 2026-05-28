<script setup lang="ts">
import PublicSiteFooter from "@/shared/components/layout/PublicSiteFooter.vue"
import PublicSiteHeader from "@/shared/components/layout/PublicSiteHeader.vue"

const props = withDefaults(
    defineProps<{
        title?: string
        centered?: boolean
        narrow?: boolean
        mainClass?: string
    }>(),
    {
        centered: false,
        narrow: false,
    },
)

const mainWidthClass = props.narrow ? "max-w-3xl" : "max-w-6xl"
</script>

<template>
    <div class="flex min-h-screen flex-col bg-white text-neutral-950">
        <PublicSiteHeader />

        <main
            class="mx-auto w-full flex-1 px-4 sm:px-6"
            :class="[
                mainWidthClass,
                centered ? 'flex flex-col justify-center py-10' : 'py-10 sm:py-14',
                mainClass,
            ]"
        >
            <h1
                v-if="title"
                class="text-2xl font-semibold leading-8 text-neutral-950 sm:text-3xl"
                :class="centered ? 'mx-auto w-full max-w-sm text-center' : ''"
            >
                {{ title }}
            </h1>
            <div
                :class="[
                    title ? 'mt-8' : '',
                    centered ? 'mx-auto w-full max-w-sm shrink-0' : 'w-full',
                ]"
            >
                <slot />
            </div>
        </main>

        <PublicSiteFooter />
    </div>
</template>
