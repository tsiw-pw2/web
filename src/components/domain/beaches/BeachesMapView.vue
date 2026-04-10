<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from "vue"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import type { Beach } from "../../../types/domain"

const props = defineProps<{
    beaches: Beach[]
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let layer: L.LayerGroup | null = null
let ro: ResizeObserver | null = null

function useDefaultLeafletIcons() {
    const proto = L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void }
    delete proto._getIconUrl
    L.Icon.Default.mergeOptions({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIcon2x,
        shadowUrl: markerShadow,
    })
}

function bindTextPopup(marker: L.Marker, text: string) {
    const el = document.createElement("div")
    el.textContent = text
    marker.bindPopup(el)
}

function renderMarkers() {
    if (!map || !layer) return
    layer.clearLayers()
    for (const b of props.beaches) {
        const m = L.marker([b.latitude, b.longitude])
        bindTextPopup(m, b.name)
        m.addTo(layer)
    }
    if (props.beaches.length > 0) {
        const bounds = L.latLngBounds(props.beaches.map((b) => [b.latitude, b.longitude] as L.LatLngExpression))
        map.fitBounds(bounds, { padding: [32, 32], maxZoom: 14 })
    } else {
        map.setView([41.15, -8.61], 8)
    }
}

async function invalidate() {
    await nextTick()
    map?.invalidateSize()
}

onMounted(() => {
    useDefaultLeafletIcons()
    const el = mapContainer.value
    if (!el) return
    map = L.map(el, { scrollWheelZoom: true }).setView([41.15, -8.61], 8)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)
    layer = L.layerGroup().addTo(map)
    renderMarkers()
    invalidate()
    ro = new ResizeObserver(() => void invalidate())
    ro.observe(el)
})

watch(
    () => props.beaches,
    () => renderMarkers(),
    { deep: true },
)

onBeforeUnmount(() => {
    ro?.disconnect()
    ro = null
    map?.remove()
    map = null
    layer = null
})
</script>

<template>
    <div
        ref="mapContainer"
        class="isolate z-0 h-[min(520px,55vh)] w-full min-h-[320px] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
    />
</template>
