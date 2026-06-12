import municipalities from "portuguese-municipalities/municipalities.json"

type MunicipalityRow = {
    name?: string
    district?: string
}

const rows = municipalities as MunicipalityRow[]

// O pacote portuguese-municipalities marca duplicados com sufixo [n] no nome.
export function cleanMunicipalityName(name: string): string {
    return name.replace(/\[\d+\]$/, "").trim()
}

const SLUG_TO_DISTRICT_LABEL: Record<string, string> = {
    viana_do_castelo: "Viana do Castelo",
    braga: "Braga",
    porto: "Porto",
    vila_real: "Vila Real",
    braganca: "Bragança",
    aveiro: "Aveiro",
    viseu: "Viseu",
    guarda: "Guarda",
    coimbra: "Coimbra",
    castelo_branco: "Castelo Branco",
    leiria: "Leiria",
    santarem: "Santarém",
    lisboa: "Lisboa",
    portalegre: "Portalegre",
    setubal: "Setúbal",
    evora: "Évora",
    beja: "Beja",
    faro: "Faro",
}

// Lista opções de concelho para um distrito (slug).
export function concelhoSelectOptionsForDistrict(districtSlug: string | undefined) {
    if (!districtSlug) return []
    const districtLabel = SLUG_TO_DISTRICT_LABEL[districtSlug]
    if (!districtLabel) return []
    const seen = new Set<string>()
    const options: { value: string; label: string }[] = []
    for (const row of rows) {
        if (!row.name || row.district !== districtLabel) continue
        const label = cleanMunicipalityName(row.name)
        if (!label || seen.has(label)) continue
        seen.add(label)
        options.push({ value: label, label })
    }
    options.sort((a, b) => a.label.localeCompare(b.label, "pt"))
    return options
}

// Obtém o slug do distrito a partir do nome do concelho.
export function districtSlugFromMunicipalityName(name: string): string | undefined {
    const trimmed = cleanMunicipalityName(name.trim())
    if (!trimmed) return undefined
    const row = rows.find((r) => r.name && cleanMunicipalityName(r.name) === trimmed && r.district)
    if (!row?.district) return undefined
    const entry = Object.entries(SLUG_TO_DISTRICT_LABEL).find(([, label]) => label === row.district)
    return entry?.[0]
}
