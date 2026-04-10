import { resolveNuts3Code } from "../lib/nuts3Codes"

export type GeoApiPtGpsBaseDetalhes = {
    distrito?: string
    concelho?: string
    freguesia?: string
    detalhesFreguesia?: {
        nuts3?: string
    }
}

export type GeoApiPtDistrito = {
    distrito: string
}

export type GeoApiPtMunicipio = {
    municipio: string
}

export type GeoApiPtFreguesia = {
    freguesia: string
}

export type GeoApiPtFreguesiaDetalhes = {
    nuts3?: string
}

export type GeoApiPtLocation = {
    distrito: string
    concelho: string
    freguesia: string
    codigoNuts: string
}

export async function geoApiPtLocationByGps(lat: number, lng: number): Promise<GeoApiPtLocation> {
    const url = `https://geoapi.pt/gps/${lat},${lng}/base/detalhes?json=1`
    const res = await fetch(url, { headers: { Accept: "application/json" } })
    if (!res.ok) throw new Error("Não foi possível obter a localização.")
    const data = (await res.json()) as GeoApiPtGpsBaseDetalhes

    const distrito = String(data.distrito ?? "").trim()
    const concelho = String(data.concelho ?? "").trim()
    const freguesia = String(data.freguesia ?? "").trim()
    const codigoNuts = resolveNuts3Code(data.detalhesFreguesia?.nuts3)

    if (!distrito || !concelho || !freguesia) throw new Error("Não foi possível preencher a localização.")

    return {
        distrito,
        concelho,
        freguesia,
        codigoNuts,
    }
}

async function fetchGeoApiJson<T>(path: string): Promise<T> {
    const url = `https://json.geoapi.pt${path}`
    const res = await fetch(url, { headers: { Accept: "application/json" } })
    if (!res.ok) throw new Error("Não foi possível obter a lista.")
    return (await res.json()) as T
}

export async function geoApiPtListDistritos(): Promise<string[]> {
    const rows = await fetchGeoApiJson<GeoApiPtDistrito[]>("/distritos")
    const out = rows.map((r) => String(r.distrito || "").trim()).filter(Boolean)
    out.sort((a, b) => a.localeCompare(b, "pt"))
    return out
}

export async function geoApiPtListMunicipios(distrito: string): Promise<string[]> {
    const slug = encodeURIComponent(distrito.trim().toLowerCase())
    const rows = await fetchGeoApiJson<GeoApiPtMunicipio[]>(`/distrito/${slug}/municipios`)
    const out = rows.map((r) => String(r.municipio || "").trim()).filter(Boolean)
    out.sort((a, b) => a.localeCompare(b, "pt"))
    return out
}

export async function geoApiPtListFreguesias(municipio: string): Promise<string[]> {
    const slug = encodeURIComponent(municipio.trim().toLowerCase())
    const rows = await fetchGeoApiJson<GeoApiPtFreguesia[]>(`/municipio/${slug}/freguesias`)
    const out = rows.map((r) => String(r.freguesia || "").trim()).filter(Boolean)
    out.sort((a, b) => a.localeCompare(b, "pt"))
    return out
}

export async function geoApiPtNutsCodeForFreguesia(municipio: string, freguesia: string) {
    const m = encodeURIComponent(municipio.trim().toLowerCase())
    const f = encodeURIComponent(freguesia.trim().toLowerCase())
    const data = await fetchGeoApiJson<GeoApiPtFreguesiaDetalhes>(`/municipio/${m}/freguesia/${f}`)
    return resolveNuts3Code(data.nuts3)
}

