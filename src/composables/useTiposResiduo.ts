import { ref } from "vue"
import type { TipoResiduo, TipoResiduoDraft } from "../types/domain"
import { mapTipoResiduo } from "../lib/apiMappers"
import * as api from "../services/waste.api"
import { useAuth } from "./useAuth"

const tipos = ref<TipoResiduo[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useTiposResiduo() {
    const { isAdmin } = useAuth()

    async function loadTipos() {
        loading.value = true
        error.value = null
        try {
            const out = await api.fetchWasteTypes(1, 500)
            tipos.value = out.data.map(mapTipoResiduo)
        } catch (e) {
            error.value = e instanceof Error ? e.message : "Erro"
            tipos.value = []
        } finally {
            loading.value = false
        }
    }

    function assertAdmin() {
        if (!isAdmin.value) throw new Error("Apenas administradores podem alterar tipos de resíduo.")
    }

    async function addTipo(draft: TipoResiduoDraft) {
        assertAdmin()
        await api.postWasteTypeApi(draft.nome.trim())
        await loadTipos()
    }

    async function updateTipo(id: string, draft: TipoResiduoDraft) {
        assertAdmin()
        await api.patchWasteTypeApi(id, { nome: draft.nome.trim() })
        await loadTipos()
    }

    async function removeTipo(id: string) {
        assertAdmin()
        await api.patchWasteTypeApi(id, { deleted_at: new Date().toISOString() })
        await loadTipos()
    }

    return { tipos, loading, error, loadTipos, addTipo, updateTipo, removeTipo }
}
