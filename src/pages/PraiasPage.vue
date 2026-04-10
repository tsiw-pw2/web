<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { Button } from "../components/ui/button"
import AsyncDataView from "../components/ui/AsyncDataView.vue"
import BeachFormModal from "../components/domain/beaches/BeachFormModal.vue"
import BeachesMapView from "../components/domain/beaches/BeachesMapView.vue"
import { useBeaches } from "../composables/useBeaches"
import { useAuth } from "../composables/useAuth"
import { useAsyncDataPhase } from "../composables/useAsyncDataPhase"
import type { Beach, BeachFormValues } from "../types/domain"

const { beaches, loading, error, loadBeaches, addBeach, updateBeach, removeBeach, getLocation } = useBeaches()
const { isAdmin } = useAuth()

const isModalOpen = ref(false)
const editing = ref<Beach | null>(null)
const viewMode = ref<"table" | "map">("table")

const listEmpty = computed(() => beaches.value.length === 0)
const phase = useAsyncDataPhase(loading, error, listEmpty)

watch(isModalOpen, (open) => {
    if (!open) editing.value = null
})

onMounted(() => {
    void loadBeaches()
})

function openCreate() {
    editing.value = null
    isModalOpen.value = true
}

function openEdit(b: Beach) {
    editing.value = b
    isModalOpen.value = true
}

async function onSave(values: BeachFormValues) {
    try {
        if (editing.value) await updateBeach(editing.value.id, values)
        else await addBeach(values)
        isModalOpen.value = false
    } catch (e) {
        alert(e instanceof Error ? e.message : "Erro ao guardar.")
    }
}

async function onRemove(b: Beach) {
    if (!confirm(`Eliminar a praia «${b.name}»?`)) return
    try {
        await removeBeach(b.id)
    } catch (e) {
        alert(e instanceof Error ? e.message : "Erro ao eliminar.")
    }
}
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col gap-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-2xl font-semibold leading-8 text-neutral-950">Praias</h2>
            <Button v-if="isAdmin" class="shrink-0 self-start sm:self-auto" @click="openCreate">Registar praia</Button>
        </div>

        <div
            v-if="phase === 'success' || phase === 'empty'"
            class="flex gap-1 border-b border-neutral-200"
            role="tablist"
            aria-label="Vista de praias"
        >
            <button
                type="button"
                role="tab"
                :aria-selected="viewMode === 'table'"
                class="px-4 py-2 text-sm font-semibold transition-colors"
                :class="viewMode === 'table' ? 'border-b-2 border-neutral-950 text-neutral-950' : 'text-neutral-500'"
                @click="viewMode = 'table'"
            >
                Tabela
            </button>
            <button
                type="button"
                role="tab"
                :aria-selected="viewMode === 'map'"
                class="px-4 py-2 text-sm font-semibold transition-colors"
                :class="viewMode === 'map' ? 'border-b-2 border-neutral-950 text-neutral-950' : 'text-neutral-500'"
                @click="viewMode = 'map'"
            >
                Mapa
            </button>
        </div>

        <AsyncDataView :phase="phase" :error-message="error">
            <template #empty>
                <p class="text-sm font-medium text-neutral-600">Sem praias.</p>
                <Button v-if="isAdmin" class="mt-4" @click="openCreate">Registar praia</Button>
            </template>

            <div v-show="viewMode === 'table'" class="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
                <table class="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead>
                        <tr class="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                            <th class="px-4 py-3">Nome</th>
                            <th class="px-4 py-3">Localização</th>
                            <th class="px-4 py-3">Coordenadas</th>
                            <th class="px-4 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="b in beaches" :key="b.id" class="border-b border-neutral-100 align-top">
                            <td class="px-4 py-3">
                                <p class="font-semibold text-neutral-950">{{ b.name }}</p>
                                <p v-if="b.description" class="mt-1 line-clamp-2 text-neutral-600">{{ b.description }}</p>
                            </td>
                            <td class="px-4 py-3 text-neutral-600">
                                <template v-if="getLocation(b.locationId)">
                                    {{ getLocation(b.locationId)!.distrito }} · {{ getLocation(b.locationId)!.concelho }} ·
                                    {{ getLocation(b.locationId)!.freguesia }} · NUTS {{ getLocation(b.locationId)!.codigoNuts }}
                                </template>
                            </td>
                            <td class="px-4 py-3 font-mono text-xs text-neutral-500 whitespace-nowrap">
                                {{ b.latitude.toFixed(6) }}, {{ b.longitude.toFixed(6) }}
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div v-if="isAdmin" class="flex flex-wrap justify-end gap-2">
                                    <Button variant="outline" size="sm" @click="openEdit(b)">Editar</Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="border-red-200 text-red-700 hover:bg-red-50"
                                        @click="onRemove(b)"
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-show="viewMode === 'map'">
                <BeachesMapView :beaches="beaches" />
            </div>
        </AsyncDataView>

        <BeachFormModal v-model="isModalOpen" :beach="editing" @save="onSave" />
    </div>
</template>
