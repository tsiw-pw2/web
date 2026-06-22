const PIN_BLUE = "#3b82f6"
const PIN_BLUE_SELECTED = "#2563eb"

// Ícone de pin (gota) para o mapa público de campanhas.
export function homeCampaignMapPinHtml(isSelected: boolean): string {
    const fill = isSelected ? PIN_BLUE_SELECTED : PIN_BLUE
    const width = isSelected ? 36 : 32
    const height = isSelected ? 46 : 42
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 32 42" aria-hidden="true" style="display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,.28))">
  <path d="M16 0C7.163 0 0 7.163 0 16c0 11.046 16 26 16 26s16-14.954 16-26C32 7.163 24.837 0 16 0z" fill="${fill}"/>
  <circle cx="16" cy="15" r="5.5" fill="#ffffff"/>
</svg>`
}

export function homeCampaignMapPinSize(isSelected: boolean): [number, number] {
    return isSelected ? [36, 46] : [32, 42]
}

export function homeCampaignMapPinAnchor(isSelected: boolean): [number, number] {
    const [width, height] = homeCampaignMapPinSize(isSelected)
    return [width / 2, height]
}

// Ícone circular para agrupar vários pinos próximos.
export function homeCampaignClusterHtml(count: number): string {
    return `<span class="home-campaign-cluster" aria-hidden="true">${count}</span>`
}
