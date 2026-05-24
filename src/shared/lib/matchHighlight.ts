export type HighlightSegment = {
    text: string
    highlighted: boolean
}

export function normalizeForSearch(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
}

export function optionMatchesQuery(label: string, query: string): boolean {
    const q = normalizeForSearch(query.trim())
    if (!q) return true
    return normalizeForSearch(label).includes(q)
}

export function hasExactLabelMatch(labels: string[], query: string): boolean {
    const q = normalizeForSearch(query.trim())
    if (!q) return false
    return labels.some((label) => normalizeForSearch(label) === q)
}

export function splitLabelByQuery(label: string, query: string): HighlightSegment[] {
    const q = normalizeForSearch(query.trim())
    if (!q) return [{ text: label, highlighted: false }]

    const normalizedLabel = normalizeForSearch(label)
    const matchStart = normalizedLabel.indexOf(q)
    if (matchStart < 0) return [{ text: label, highlighted: false }]

    let normPos = 0
    let highlightStart = -1
    let highlightEnd = label.length

    for (let i = 0; i < label.length; i++) {
        const charNorm = normalizeForSearch(label[i] ?? "")
        if (normPos === matchStart) highlightStart = i
        normPos += charNorm.length
        if (normPos >= matchStart + q.length) {
            highlightEnd = i + 1
            break
        }
    }

    if (highlightStart < 0) return [{ text: label, highlighted: false }]

    const segments: HighlightSegment[] = []
    if (highlightStart > 0) {
        segments.push({ text: label.slice(0, highlightStart), highlighted: false })
    }
    segments.push({ text: label.slice(highlightStart, highlightEnd), highlighted: true })
    if (highlightEnd < label.length) {
        segments.push({ text: label.slice(highlightEnd), highlighted: false })
    }
    return segments
}
