<script setup lang="ts">
import { useId } from "vue"

defineOptions({ name: "LogoMark" })

const raw = useId()
const maskId = `lm-${raw.replace(/\W/g, "")}`
</script>

<template>
     <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" class="shrink-0" aria-hidden="true" focusable="false">

        <mask :id="maskId" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="28">

            <circle cx="14" cy="14" r="14" fill="#D9D9D9" />

        </mask>

        <g :mask="`url(#${maskId})`">

            <circle cx="12" cy="26" r="14" fill="#56BEEE" />

            <circle cx="25" cy="25" r="14" fill="#42DA54" />

        </g>
         </svg
    >
</template>

