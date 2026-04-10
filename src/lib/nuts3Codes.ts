export const nuts3NameToCode: Record<string, string> = {
    "Alto Minho": "PT111",
    "Cávado": "PT112",
    "Ave": "PT119",
    "Área Metropolitana do Porto": "PT11A",
    "Área Metropolitana de Lisboa": "PT170",
    "Grande Porto": "PT11A",
    "Grande Lisboa": "PT170",
    "Oeste": "PT16B",
    "Região de Aveiro": "PT16D",
    "Região de Coimbra": "PT16E",
    "Região de Leiria": "PT16F",
    "Viseu Dão Lafões": "PT16G",
    "Beira Baixa": "PT16H",
    "Médio Tejo": "PT16I",
    "Beiras e Serra da Estrela": "PT16J",
    "Alentejo Litoral": "PT181",
    "Baixo Alentejo": "PT184",
    "Lezíria do Tejo": "PT185",
    "Alto Alentejo": "PT186",
    "Alentejo Central": "PT187",
    "Algarve": "PT150",
    "Região Autónoma dos Açores": "PT200",
    "Região Autónoma da Madeira": "PT300",
}

export function resolveNuts3Code(nuts3Name: string | null | undefined) {
    if (!nuts3Name) return ""
    const key = String(nuts3Name).trim()
    return nuts3NameToCode[key] ?? ""
}
