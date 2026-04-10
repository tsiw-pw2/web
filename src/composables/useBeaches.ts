import { ref } from "vue"
import type { Beach, BeachFormValues } from "../types/domain"
import { mapBeachFromApi, mapLocationFromBeachRow } from "../lib/apiMappers"
import * as api from "../services/beaches.api"
import { useAuth } from "./useAuth"

const beaches = ref<Beach[]>([])

type LocMap = Record<string, import("../types/domain").BeachLocation>

const locations = ref<LocMap>({})

const loading = ref(false)
const error = ref<string | null>(null)

export function useBeaches() {
    const { isAdmin } = useAuth()

    function getLocation(locationId: string) {
        return locations.value[locationId]
    }

    async function loadBeaches() {
        loading.value = true
        error.value = null
        try {
            const out = await api.fetchBeachesList(1, 500)
            const locs: LocMap = {}
            const bs: Beach[] = []
            for (const row of out.data) {
                bs.push(mapBeachFromApi(row))
                const loc = mapLocationFromBeachRow(row)
                locs[loc.id] = loc
            }
            beaches.value = bs
            locations.value = locs
        } catch (e) {
            error.value = e instanceof Error ? e.message : "Erro ao carregar praias"
            beaches.value = []
            locations.value = {}
        } finally {
            loading.value = false
        }
    }

    function assertAdmin() {
        if (!isAdmin.value) {
            throw new Error("Apenas administradores podem gerir praias na API.")
        }
    }

    async function addBeach(values: BeachFormValues) {
        assertAdmin()
        const loc = await api.postAdminLocation({
            distrito: values.distrito.trim(),
            concelho: values.concelho.trim(),
            freguesia: values.freguesia.trim(),
            codigo_nuts: values.codigoNuts.trim().slice(0, 5),
        })
        await api.postAdminBeach({
            localizacao_praia_id: loc.id,
            nome: values.name.trim(),
            latitude: values.latitude,
            longitude: values.longitude,
            descricao: values.description.trim() || null,
        })
        await loadBeaches()
    }

    async function updateBeach(beachId: string, values: BeachFormValues) {
        assertAdmin()
        const b = beaches.value.find((x) => x.id === beachId)
        if (!b) return
        const loc = getLocation(b.locationId)
        if (!loc) return
        const locChanged =
            loc.distrito !== values.distrito.trim() ||
            loc.concelho !== values.concelho.trim() ||
            loc.freguesia !== values.freguesia.trim() ||
            loc.codigoNuts !== values.codigoNuts.trim().slice(0, 5)
        let locId = b.locationId
        if (locChanged) {
            const newLoc = await api.postAdminLocation({
                distrito: values.distrito.trim(),
                concelho: values.concelho.trim(),
                freguesia: values.freguesia.trim(),
                codigo_nuts: values.codigoNuts.trim().slice(0, 5),
            })
            locId = newLoc.id
        }
        await api.patchAdminBeach(beachId, {
            nome: values.name.trim(),
            latitude: values.latitude,
            longitude: values.longitude,
            descricao: values.description.trim() || null,
            ...(locChanged ? { localizacao_praia_id: locId } : {}),
        })
        await loadBeaches()
    }

    async function removeBeach(beachId: string) {
        assertAdmin()
        await api.patchAdminBeach(beachId, { deleted_at: new Date().toISOString() })
        await loadBeaches()
    }

    function beachToFormValues(beach: Beach): BeachFormValues | null {
        const loc = getLocation(beach.locationId)
        if (!loc) return null
        return {
            distrito: loc.distrito,
            concelho: loc.concelho,
            freguesia: loc.freguesia,
            codigoNuts: loc.codigoNuts,
            name: beach.name,
            latitude: beach.latitude,
            longitude: beach.longitude,
            description: beach.description,
        }
    }

    return {
        beaches,
        locations,
        loading,
        error,
        loadBeaches,
        getLocation,
        addBeach,
        updateBeach,
        removeBeach,
        beachToFormValues,
    }
}
