<script setup lang="ts">
import { computed, inject } from "vue"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import { userRoleTableBadge } from "@/shared/lib/tableValueBadge"

const profile = inject(settingsProfileKey)

const nameLabel = computed(() => profile?.value?.name?.trim() || "—")

const emailLabel = computed(() => profile?.value?.email?.trim() || "—")

const phoneLabel = computed(() => profile?.value?.phone?.trim() || "—")

const roleBadge = computed(() => {
    const p = profile?.value
    if (!p) return null
    return userRoleTableBadge(p)
})

const rows = computed(() => [
    { label: "Email", value: emailLabel.value },
    { label: "Telefone", value: phoneLabel.value },
])
</script>

<template>
    <aside class="flex flex-col gap-2 lg:min-w-[14rem]">
        <div class="flex items-start justify-between gap-3 border-b border-neutral-200 pb-2">
            <p class="text-sm font-medium text-neutral-500">Nome</p>
            <p class="text-end text-sm font-medium leading-5 text-neutral-950">{{ nameLabel }}</p>
        </div>

        <div
            v-for="row in rows"
            :key="row.label"
            class="flex items-start justify-between gap-3 border-b border-neutral-200 pb-2"
        >
            <p class="text-sm font-medium text-neutral-500">{{ row.label }}</p>
            <p class="text-end text-sm font-medium leading-5 text-neutral-950">{{ row.value }}</p>
        </div>

        <div class="flex items-start justify-between gap-3 pb-2">
            <p class="text-sm font-medium text-neutral-500">Cargo</p>
            <ApiStateBadge v-if="roleBadge" v-bind="roleBadge" />
            <p v-else class="text-end text-sm font-medium leading-5 text-neutral-950">—</p>
        </div>
    </aside>
</template>
