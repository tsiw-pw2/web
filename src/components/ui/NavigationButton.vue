<script setup lang="ts">
import { RouterLink } from "vue-router"

const props = defineProps<{ to: string }>()

function onNavigate(e: MouseEvent, navigate: (e?: MouseEvent) => void) {
    navigate(e)
}
</script>

<template>
     <RouterLink v-slot="{ href, navigate, isActive }" :to="props.to" custom
        > <a
            :href="href"
            :class="[
                'cursor-pointer rounded-lg px-3 py-2 text-sm font-medium leading-5 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_1px_2px_0_rgba(10,10,10,0.24)] hover:text-white',
                isActive ? 'bg-white/8 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_1px_2px_0_rgba(10,10,10,0.24)]' : 'text-neutral-400 hover:bg-white/8',
            ]"
            @click="onNavigate($event, navigate)"
            > <slot /> </a
        > </RouterLink
    >
</template>

