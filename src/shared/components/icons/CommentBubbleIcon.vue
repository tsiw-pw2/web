<script setup lang="ts">
defineOptions({ name: "CommentBubbleIcon" })

withDefaults(defineProps<{ size?: number }>(), { size: 24 })
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        fill="none"
        class="shrink-0"
        aria-hidden="true"
        focusable="false"
    >
        <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5l-1.838 5.162 4.986-1.245A9.956 9.956 0 0 0 12 22Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M8.25 12h.008v.008H8.25V12Zm3.75 0h.008v.008H12V12Zm3.75 0h.008v.008h-.008V12Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>
