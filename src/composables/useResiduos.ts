import { ref } from "vue"
import type { Residuo, ResiduoDraft } from "../types/domain"
import { mapResiduo } from "../lib/apiMappers"
import * as api from "../services/waste.api"
import { useAuth } from "./useAuth"

const residuos = ref<Residuo[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useResiduos() {
    const { isAdmin } = useAuth()

    async function loadResiduos() {
        loading.value = true
        error.value = null
        try {
            const out = await api.fetchWastes(1, 500)
            residuos.value = out.data.map(mapResiduo)
        } catch (e) {
            error.value = e instanceof Error ? e.message : "Erro"
            residuos.value = []
        } finally {
            loading.value = false
        }
    }

    function assertAdmin() {
        if (!isAdmin.value) throw new Error("Apenas administradores podem alterar resíduos.")
    }

    async function addResiduo(draft: ResiduoDraft) {
        assertAdmin()
        await api.postWasteApi({
            tipo_residuo_id: draft.tipoResiduoId,
            nome: draft.nome.trim(),
            peso_medio_gramas: draft.pesoMedioGramas,
        })
        await loadResiduos()
    }

    async function updateResiduo(id: string, draft: ResiduoDraft) {
        assertAdmin()
        await api.patchWasteApi(id, {
            nome: draft.nome.trim(),
            tipo_residuo_id: draft.tipoResiduoId,
            peso_medio_gramas: draft.pesoMedioGramas,
        })
        await loadResiduos()
    }

    async function removeResiduo(id: string) {
        assertAdmin()
        await api.patchWasteApi(id, { deleted_at: new Date().toISOString() })
        await loadResiduos()
    }

    return { residuos, loading, error, loadResiduos, addResiduo, updateResiduo, removeResiduo }
}
