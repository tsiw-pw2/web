<script setup lang="ts">
import { ref, computed, watch } from "vue"
import type { Campaign, InscricaoEstado, InscricaoFuncao } from "../../../types/domain"
import { inscricaoEstadoLabel, inscricaoFuncaoLabel } from "../../../types/domain"
import { Button } from "../../ui/button"
import { useBeaches } from "../../../composables/useBeaches"
import { useResiduos } from "../../../composables/useResiduos"
import {
    mapComentario,
    mapInscricao,
    mapRecolha,
    type ApiRecolhaRow,
} from "../../../lib/apiMappers"
import * as api from "../../../services/campaigns.api"
import type { ComentarioCampanha, Inscricao, RecolhaResiduo } from "../../../types/domain"
import AddRecolhaModal from "./AddRecolhaModal.vue"
import AddInscricaoModal from "./AddInscricaoModal.vue"
import AddComentarioModal from "./AddComentarioModal.vue"

const props = defineProps<{
    campaign: Campaign
}>()

const { beaches } = useBeaches()
const { residuos } = useResiduos()

const recolhasCamp = ref<RecolhaResiduo[]>([])
const inscricoesCamp = ref<Inscricao[]>([])
const comentariosCamp = ref<ComentarioCampanha[]>([])
const loading = ref(false)
const loadError = ref<string | null>(null)

const openRec = ref(false)
const openIns = ref(false)
const openCom = ref(false)

async function reload() {
    const id = props.campaign.id
    loading.value = true
    loadError.value = null
    try {
        const [ins, rec, com] = await Promise.all([
            api.fetchRegistrations(id),
            api.fetchRecolhasForCampaign(id),
            api.fetchComments(id),
        ])
        inscricoesCamp.value = ins.data.map((row) =>
            mapInscricao(row as Parameters<typeof mapInscricao>[0]),
        )
        recolhasCamp.value = rec.data.map((row) => mapRecolha(row as ApiRecolhaRow))
        comentariosCamp.value = com.data.map((row) =>
            mapComentario(row as Parameters<typeof mapComentario>[0]),
        )
    } catch (e) {
        loadError.value = e instanceof Error ? e.message : "Não foi possível carregar os dados da campanha."
        inscricoesCamp.value = []
        recolhasCamp.value = []
        comentariosCamp.value = []
    } finally {
        loading.value = false
    }
}

watch(
    () => props.campaign.id,
    () => {
        void reload()
    },
    { immediate: true },
)

const beachNames = computed(() => {
    const names: string[] = []
    for (const id of props.campaign.beachIds) {
        const b = beaches.value.find((x) => x.id === id)
        if (b) names.push(b.name)
    }
    return names
})

function beachName(id: string) {
    return beaches.value.find((b) => b.id === id)?.name ?? id
}

function residuoNome(id: string) {
    return residuos.value.find((r) => r.id === id)?.nome ?? id
}

async function onRecSave(payload: {
    beachId: string
    residuoId: string
    quantidadeUnidades: number
    pesoRealKg: number | null
}) {
    await api.upsertRecolhaApi(props.campaign.id, payload.beachId, {
        residuo_id: payload.residuoId,
        quantidade_unidades: payload.quantidadeUnidades,
        peso_real_kg: payload.pesoRealKg,
    })
    await reload()
}

async function onInsSave(payload: {
    userId: string
    funcao: InscricaoFuncao
    estado: InscricaoEstado
    presenca: boolean | null
}) {
    await api.postRegistrationApi(props.campaign.id, {
        utilizador_id: payload.userId,
        funcao: payload.funcao,
        estado: payload.estado,
        presenca: payload.presenca,
    })
    await reload()
}

async function onComSave(payload: { texto: string; isVisible: boolean }) {
    void payload.isVisible
    await api.postCommentApi(props.campaign.id, payload.texto)
    await reload()
}

async function removeRecolha(id: string) {
    await api.deleteRecolhaApi(id)
    await reload()
}

async function removeInscricao(id: string) {
    await api.patchRegistrationApi(id, { estado: 2 })
    await reload()
}

async function removeComentario(id: string) {
    await api.deleteCommentApi(id)
    await reload()
}
</script>

<template>
    <div class="mt-4 space-y-4 border-t border-neutral-100 pt-4">
        <p v-if="loading" class="text-sm text-neutral-500">A carregar…</p>
        <div v-else-if="loadError" class="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800">
            <p>{{ loadError }}</p>
            <Button class="mt-2" size="sm" type="button" variant="outline" @click="reload()">Tentar novamente</Button>
        </div>

        <template v-else>
        <details class="group">
            <summary class="cursor-pointer text-sm font-semibold text-neutral-950">Praias desta campanha</summary>
            <ul v-if="beachNames.length" class="mt-2 list-inside list-disc text-sm font-medium text-neutral-600">
                <li v-for="n in beachNames" :key="n">{{ n }}</li>
            </ul>
            <p v-else class="mt-2 text-sm font-medium text-neutral-600">Nenhuma praia.</p>
        </details>

        <details class="group">
            <summary class="cursor-pointer text-sm font-semibold text-neutral-950">O que foi recolhido</summary>
            <div class="mt-2 flex flex-wrap gap-2">
                <Button size="sm" type="button" :disabled="!campaign.beachIds.length" @click="openRec = true">
                    Registar recolha
                </Button>
            </div>
            <ul v-if="recolhasCamp.length" class="mt-2 space-y-2">
                <li
                    v-for="r in recolhasCamp"
                    :key="r.id"
                    class="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700"
                >
                    <span
                        >{{ beachName(r.beachId) }} · {{ residuoNome(r.residuoId) }} · {{ r.quantidadeUnidades }} u.
                        <template v-if="r.pesoRealKg != null">· {{ r.pesoRealKg }} kg</template></span
                    >
                    <Button variant="outline" size="sm" class="border-red-200 text-red-700" @click="removeRecolha(r.id)">
                        Remover
                    </Button>
                </li>
            </ul>
            <p v-else class="mt-2 text-sm text-neutral-600">Sem recolhas.</p>
        </details>

        <details class="group">
            <summary class="cursor-pointer text-sm font-semibold text-neutral-950">Inscrições de voluntários</summary>
            <div class="mt-2">
                <Button size="sm" type="button" @click="openIns = true">Nova inscrição</Button>
            </div>
            <ul v-if="inscricoesCamp.length" class="mt-2 space-y-2">
                <li
                    v-for="i in inscricoesCamp"
                    :key="i.id"
                    class="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
                >
                    <span class="font-mono text-xs">{{ i.userId.slice(0, 8) }}…</span>
                    <span>{{ inscricaoFuncaoLabel[i.funcao] }} · {{ inscricaoEstadoLabel[i.estado] }}</span>
                    <span v-if="i.presenca === true" class="text-neutral-600">Presente</span>
                    <span v-else-if="i.presenca === false" class="text-neutral-600">Ausente</span>
                    <Button variant="outline" size="sm" class="border-red-200 text-red-700" @click="removeInscricao(i.id)">
                        Remover
                    </Button>
                </li>
            </ul>
            <p v-else class="mt-2 text-sm text-neutral-600">Sem inscrições.</p>
        </details>

        <details class="group">
            <summary class="cursor-pointer text-sm font-semibold text-neutral-950">Comentários</summary>
            <div class="mt-2">
                <Button size="sm" type="button" @click="openCom = true">Novo comentário</Button>
            </div>
            <ul v-if="comentariosCamp.length" class="mt-2 space-y-2">
                <li
                    v-for="c in comentariosCamp"
                    :key="c.id"
                    class="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
                >
                    <p>{{ c.texto }}</p>
                    <p class="mt-1 text-xs text-neutral-500">
                        {{ c.autorNome ?? c.userId.slice(0, 8) }} · {{ c.isVisible ? "Visível" : "Oculto" }}
                    </p>
                    <Button variant="outline" size="sm" class="mt-2 border-red-200 text-red-700" @click="removeComentario(c.id)">
                        Remover
                    </Button>
                </li>
            </ul>
            <p v-else class="mt-2 text-sm text-neutral-600">Sem comentários.</p>
        </details>
        </template>

        <AddRecolhaModal
            v-model="openRec"
            :campaign-id="campaign.id"
            :allowed-beach-ids="campaign.beachIds"
            @save="(p) => void onRecSave(p)"
        />
        <AddInscricaoModal v-model="openIns" :campaign-id="campaign.id" @save="(p) => void onInsSave(p)" />
        <AddComentarioModal v-model="openCom" :campaign-id="campaign.id" @save="(p) => void onComSave(p)" />
    </div>
</template>
