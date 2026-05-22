export function stringifyRecordStrings(record: Record<string, string | undefined | null>): string {
    const out: Record<string, string> = {}
    for (const key of Object.keys(record)) {
        const v = record[key]
        if (v === undefined || v === null) {
            continue
        }
        out[key] = typeof v === "string" ? v.trim() : String(v).trim()
    }
    return JSON.stringify(out)
}
