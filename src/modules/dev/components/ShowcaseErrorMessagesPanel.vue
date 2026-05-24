<script setup lang="ts">
import { computed, ref } from "vue"
import {
    SHOWCASE_ERROR_MESSAGE_GROUPS,
    showcaseErrorMessageCount,
} from "@/modules/dev/lib/showcaseErrorMessages"
import AnimatedTabBar from "@/shared/components/ui/tabs/AnimatedTabBar.vue"
import AnimatedTabTrigger from "@/shared/components/ui/tabs/AnimatedTabTrigger.vue"

const totalMessages = showcaseErrorMessageCount()
const activeGroupId = ref(SHOWCASE_ERROR_MESSAGE_GROUPS[0]?.id ?? "")

const activeGroup = computed(() =>
    SHOWCASE_ERROR_MESSAGE_GROUPS.find((group) => group.id === activeGroupId.value),
)

function shortSource(source: string): string {
    const path = source.split(" · ")[0]?.trim() ?? source
    const segments = path.split("/")
    return segments.length > 2 ? segments.slice(-2).join("/") : path
}

function selectGroup(id: string) {
    activeGroupId.value = id
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <p class="text-sm text-neutral-600">
            {{ totalMessages }} mensagens visíveis ao utilizador. Valores entre chavetas são dinâmicos.
        </p>

        <AnimatedTabBar ariaLabel="Áreas de mensagens de erro" class="flex-wrap gap-2 overflow-visible">
            <AnimatedTabTrigger
                v-for="group in SHOWCASE_ERROR_MESSAGE_GROUPS"
                :key="group.id"
                role="tab"
                type="button"
                :active="activeGroupId === group.id"
                class="rounded-full px-3 py-1.5"
                :class="
                    activeGroupId === group.id
                        ? 'bg-neutral-950 text-white hover:text-white'
                        : 'bg-white text-neutral-600 ring-1 ring-neutral-200 hover:text-neutral-950'
                "
                @click="selectGroup(group.id)"
            >
                {{ group.label }}
                <span
                    class="ml-1.5 tabular-nums"
                    :class="activeGroupId === group.id ? 'text-neutral-300' : 'text-neutral-400'"
                >
                    {{ group.rows.length }}
                </span>
            </AnimatedTabTrigger>
        </AnimatedTabBar>

        <section v-if="activeGroup" :key="activeGroup.id" class="flex flex-col gap-4">
            <div>
                <h2 class="text-base font-semibold text-neutral-950">{{ activeGroup.label }}</h2>
                <p v-if="activeGroup.description" class="mt-1 text-sm text-neutral-500">
                    {{ activeGroup.description }}
                </p>
            </div>

            <ul class="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <li
                    v-for="(entry, index) in activeGroup.rows"
                    :key="`${activeGroup.id}-${index}`"
                    class="border-b border-neutral-100 px-4 py-3 last:border-b-0"
                >
                    <p class="text-xs font-medium uppercase tracking-wide text-neutral-400">
                        {{ entry.context }}
                    </p>
                    <p v-if="entry.title" class="mt-1.5 text-sm font-medium text-neutral-950">
                        {{ entry.title }}
                    </p>
                    <p class="mt-1 text-sm leading-5 text-neutral-700">{{ entry.text }}</p>
                    <p class="mt-2 font-mono text-[11px] text-neutral-400">{{ shortSource(entry.source) }}</p>
                </li>
            </ul>
        </section>
    </div>
</template>
