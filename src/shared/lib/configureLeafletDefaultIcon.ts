import L from "leaflet"
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png"
import markerIconUrl from "leaflet/dist/images/marker-icon.png"
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png"

let configured = false

// Configura Leaflet predefinição ícone.
export function configureLeafletDefaultIcon() {
    if (configured) return
    configured = true

    const iconDefault = L.Icon.Default.prototype as L.Icon.Default & {
        _getIconUrl?: () => string
    }
    delete iconDefault._getIconUrl

    L.Icon.Default.mergeOptions({
        iconUrl: markerIconUrl,
        iconRetinaUrl: markerIcon2xUrl,
        shadowUrl: markerShadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    })
}
