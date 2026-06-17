import municipalities from "portuguese-municipalities/municipalities.json"

type MunicipalityRow = {
    name?: string
    district?: string
}

const rows = municipalities as MunicipalityRow[]

// O pacote portuguese-municipalities inclui sufixos tipo "[2]" em alguns nomes (notas de rodapé).
function normalizeMunicipalityName(name: string): string {
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
    const options = rows
        .filter((r) => r.name && r.district === districtLabel)
        .map((r) => {
            const label = normalizeMunicipalityName(r.name!)
            return { value: label, label }
        })
        .filter((o) => {
            if (seen.has(o.value)) return false
            seen.add(o.value)
            return true
        })
    options.sort((a, b) => a.label.localeCompare(b.label, "pt"))
    return options
}

// Obtém o slug do distrito a partir do nome do concelho.
export function districtSlugFromMunicipalityName(name: string): string | undefined {
    const trimmed = name.trim()
    if (!trimmed) return undefined
    const row = rows.find((r) => r.name && normalizeMunicipalityName(r.name) === trimmed && r.district)
    if (!row?.district) return undefined
    const entry = Object.entries(SLUG_TO_DISTRICT_LABEL).find(([, label]) => label === row.district)
    return entry?.[0]
}
