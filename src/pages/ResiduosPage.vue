<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { Button } from "../components/ui/button"
import AsyncDataView from "../components/ui/AsyncDataView.vue"
import FieldLabel from "../components/ui/form/FieldLabel.vue"
import { Input } from "../components/ui/input"
import { Select } from "../components/ui/select"
import TipoResiduoFormModal from "../components/domain/waste/TipoResiduoFormModal.vue"
import ResiduoFormModal from "../components/domain/waste/ResiduoFormModal.vue"
import { useTiposResiduo } from "../composables/useTiposResiduo"
import { useResiduos } from "../composables/useResiduos"
import { useAuth } from "../composables/useAuth"
import { useAsyncDataPhase } from "../composables/useAsyncDataPhase"
import type { Residuo, ResiduoDraft, TipoResiduo, TipoResiduoDraft } from "../types/domain"

const { tipos, loading: loadT, error: errT, loadTipos, addTipo, updateTipo, removeTipo } = useTiposResiduo()
const { residuos, loading: loadR, error: errR, loadResiduos, addResiduo, updateResiduo, removeResiduo } =
    useResiduos()
const { isAdmin } = useAuth()

const tipoModalOpen = ref(false)
const residuoModalOpen = ref(false)
const editingTipo = ref<TipoResiduo | null>(null)
const editingResiduo = ref<Residuo | null>(null)

const tipoInlineOpen = ref(false)
const newTipoNome = ref("")
const savingTipo = ref(false)

const residuoInlineOpen = ref(false)
const newResiduoTipoId = ref("")
const newResiduoNome = ref("")
const newResiduoPesoStr = ref("")
const savingResiduo = ref(false)

const tiposEmpty = computed(() => tipos.value.length === 0)
const residuosEmpty = computed(() => residuos.value.length === 0)

const phaseTipos = useAsyncDataPhase(loadT, errT, tiposEmpty)
const phaseResiduos = useAsyncDataPhase(loadR, errR, residuosEmpty)

watch(tipoModalOpen, (o) => {
    if (!o) editingTipo.value = null
})
watch(residuoModalOpen, (o) => {
    if (!o) editingResiduo.value = null
})

onMounted(() => {
    void loadTipos()
    void loadResiduos()
})

function openEditTipo(t: TipoResiduo) {
    editingTipo.value = t
    tipoModalOpen.value = true
}

async function onSaveTipo(d: TipoResiduoDraft) {
    try {
        if (editingTipo.value) await updateTipo(editingTipo.value.id, d)
        tipoModalOpen.value = false
    } catch (e) {
        alert(e instanceof Error ? e.message : "Erro")
    }
}

function openEditResiduo(r: Residuo) {
    editingResiduo.value = r
    residuoModalOpen.value = true
}

async function onSaveResiduo(d: ResiduoDraft) {
    try {
        if (editingResiduo.value) await updateResiduo(editingResiduo.value.id, d)
        residuoModalOpen.value = false
    } catch (e) {
        alert(e instanceof Error ? e.message : "Erro")
    }
}

function tipoNome(id: string) {
    return tipos.value.find((t) => t.id === id)?.nome ?? id
}

async function onRemoveTipo(t: TipoResiduo) {
    const emUso = residuos.value.some((r) => r.tipoResiduoId === t.id)
    if (emUso) {
        alert("Não podes eliminar este tipo enquanto existirem resíduos associados.")
        return
    }
    if (!confirm(`Eliminar o tipo «${t.nome}»?`)) return
    try {
        await removeTipo(t.id)
    } catch (e) {
        alert(e instanceof Error ? e.message : "Erro")
    }
}

async function onRemoveResiduo(r: Residuo) {
    if (!confirm(`Eliminar o resíduo «${r.nome}»?`)) return
    try {
        await removeResiduo(r.id)
    } catch (e) {
        alert(e instanceof Error ? e.message : "Erro")
    }
}

function openTipoInline() {
    tipoInlineOpen.value = true
    newTipoNome.value = ""
}

function cancelTipoInline() {
    tipoInlineOpen.value = false
    newTipoNome.value = ""
    savingTipo.value = false
}

async function submitNewTipo() {
    const n = newTipoNome.value.trim()
    if (!n || savingTipo.value) return
    savingTipo.value = true
    try {
        await addTipo({ nome: n })
        cancelTipoInline()
    } catch (e) {
        alert(e instanceof Error ? e.message : "Erro")
    } finally {
        savingTipo.value = false
    }
}

function openResiduoInline() {
    residuoInlineOpen.value = true
    newResiduoTipoId.value = tipos.value[0]?.id ?? ""
    newResiduoNome.value = ""
    newResiduoPesoStr.value = ""
}

function cancelResiduoInline() {
    residuoInlineOpen.value = false
    newResiduoTipoId.value = ""
    newResiduoNome.value = ""
    newResiduoPesoStr.value = ""
    savingResiduo.value = false
}

async function submitNewResiduo() {
    const nome = newResiduoNome.value.trim()
    if (!nome || !newResiduoTipoId.value || savingResiduo.value) return
    const g = newResiduoPesoStr.value.trim()
    const pesoMedioGramas = g === "" ? null : Math.max(0, Math.floor(Number.parseInt(g, 10) || 0))
    savingResiduo.value = true
    try {
        await addResiduo({
            tipoResiduoId: newResiduoTipoId.value,
            nome,
            pesoMedioGramas,
        })
        cancelResiduoInline()
    } catch (e) {
        alert(e instanceof Error ? e.message : "Erro")
    } finally {
        savingResiduo.value = false
    }
}
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col gap-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-2xl font-semibold leading-8 text-neutral-950">Resíduos</h2>
        </div>

        <section class="space-y-3">
            <h3 class="text-lg font-semibold text-neutral-950">Categorias de material</h3>
            <AsyncDataView :phase="phaseTipos" :error-message="errT">
                <template #empty>
                    <p class="text-sm font-medium text-neutral-600">Sem categorias.</p>
                </template>
                <ul class="flex flex-col gap-2">
                    <li
                        v-for="t in tipos"
                        :key="t.id"
                        class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm"
                    >
                        <span class="font-medium text-neutral-950">{{ t.nome }}</span>
                        <div v-if="isAdmin" class="flex gap-2">
                            <Button variant="outline" size="sm" @click="openEditTipo(t)">Editar</Button>
                            <Button
                                variant="outline"
                                size="sm"
                                class="border-red-200 text-red-700"
                                @click="onRemoveTipo(t)"
                            >
                                Eliminar
                            </Button>
                        </div>
                    </li>
                    <li
                        v-if="isAdmin && tipoInlineOpen"
                        class="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm"
                    >
                        <form class="flex flex-col gap-3 sm:flex-row sm:items-end" @submit.prevent="submitNewTipo">
                            <div class="min-w-0 flex-1">
                                <FieldLabel for-id="inline-tipo-nome" label="Nome da categoria" required />
                                <Input
                                    id="inline-tipo-nome"
                                    v-model="newTipoNome"
                                    type="text"
                                    required
                                    placeholder="Ex.: Plásticos"
                                />
                            </div>
                            <div class="flex gap-2">
                                <Button type="button" variant="outline" size="sm" @click="cancelTipoInline">Cancelar</Button>
                                <Button type="submit" size="sm" :disabled="savingTipo">Criar</Button>
                            </div>
                        </form>
                    </li>
                    <li v-if="isAdmin" class="flex justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 py-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            class="min-w-10 px-3 font-semibold"
                            :disabled="tipoInlineOpen"
                            aria-label="Adicionar tipo de resíduo"
                            @click="openTipoInline"
                        >
                            +
                        </Button>
                    </li>
                </ul>
            </AsyncDataView>
        </section>

        <section class="space-y-3">
            <h3 class="text-lg font-semibold text-neutral-950">Itens do catálogo</h3>
            <p v-if="isAdmin && loadT && !tipos.length" class="text-sm text-neutral-600">
                A carregar categorias…
            </p>
            <AsyncDataView v-else :phase="phaseResiduos" :error-message="errR">
                <template #empty>
                    <p class="text-sm font-medium text-neutral-600">Sem itens no catálogo.</p>
                </template>
                <ul class="flex flex-col gap-2">
                    <li
                        v-for="r in residuos"
                        :key="r.id"
                        class="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <p class="font-semibold text-neutral-950">{{ r.nome }}</p>
                            <p class="text-sm text-neutral-600">
                                Categoria: {{ tipoNome(r.tipoResiduoId) }}
                                <template v-if="r.pesoMedioGramas != null"> · ~{{ r.pesoMedioGramas }} g</template>
                            </p>
                        </div>
                        <div v-if="isAdmin" class="flex gap-2">
                            <Button variant="outline" size="sm" @click="openEditResiduo(r)">Editar</Button>
                            <Button
                                variant="outline"
                                size="sm"
                                class="border-red-200 text-red-700"
                                @click="onRemoveResiduo(r)"
                            >
                                Eliminar
                            </Button>
                        </div>
                    </li>
                    <li
                        v-if="isAdmin && residuoInlineOpen && tipos.length"
                        class="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm"
                    >
                        <form class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" @submit.prevent="submitNewResiduo">
                            <div>
                                <FieldLabel for-id="inline-res-tipo" label="Categoria" required />
                                <Select id="inline-res-tipo" v-model="newResiduoTipoId" required>
                                    <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.nome }}</option>
                                </Select>
                            </div>
                            <div class="sm:col-span-2">
                                <FieldLabel for-id="inline-res-nome" label="Nome do material" required />
                                <Input id="inline-res-nome" v-model="newResiduoNome" type="text" required placeholder="Ex.: Beatas" />
                            </div>
                            <div>
                                <FieldLabel for-id="inline-res-peso" label="Peso médio (g)" optional />
                                <Input id="inline-res-peso" v-model="newResiduoPesoStr" type="number" min="0" inputmode="numeric" />
                            </div>
                            <div class="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
                                <Button type="button" variant="outline" size="sm" @click="cancelResiduoInline">Cancelar</Button>
                                <Button type="submit" size="sm" :disabled="savingResiduo || !tipos.length">Criar</Button>
                            </div>
                        </form>
                    </li>
                    <li
                        v-if="isAdmin"
                        class="flex justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 py-2"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            class="min-w-10 px-3 font-semibold"
                            :disabled="residuoInlineOpen || !tipos.length"
                            aria-label="Adicionar resíduo"
                            @click="openResiduoInline"
                        >
                            +
                        </Button>
                    </li>
                </ul>
            </AsyncDataView>
        </section>

        <TipoResiduoFormModal v-model="tipoModalOpen" :tipo="editingTipo" @save="onSaveTipo" />
        <ResiduoFormModal v-model="residuoModalOpen" :residuo="editingResiduo" :tipos="tipos" @save="onSaveResiduo" />
    </div>
</template>
