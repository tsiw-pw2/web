<script setup lang="ts">
defineProps<{
    label: string
    className: string
}>()
</script>

<template>
     <span :class="className">{{ label }}</span>
</template>
