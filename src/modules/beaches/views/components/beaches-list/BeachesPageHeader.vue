<script setup lang="ts">
import Button from "@/shared/components/ui/Button.vue"
import { useCanManageCatalog } from "@/modules/auth/composables/useCanManageCatalog"

const emit = defineEmits<{
    create: []
}>()

const { canManage } = useCanManageCatalog()
</script>

<template>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 class="text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">Praias</h2>
        <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <slot name="actions" />
            <Button v-if="canManage" class="w-full shrink-0 touch-manipulation sm:w-auto" @click="emit('create')">
                Criar Praia
            </Button>
        </div>
    </div>
</template>
