<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { HomeCampaignMapPoint } from "@/modules/home/types/homeCampaignMap"
import { configureLeafletDefaultIcon } from "@/shared/lib/configureLeafletDefaultIcon"

const props = defineProps<{
    points: HomeCampaignMapPoint[]
    selectedPointId: string | null
}>()

const emit = defineEmits<{
    select: [pointId: string]
}>()

const mapRoot = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null

function parseCoord(value: string): number | null {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

function markerHtml(isSelected: boolean): string {
    const color = isSelected ? "#2A4DEB" : "#EF233C"
    const size = isSelected ? 14 : 12
    return `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.35)"></span>`
}

function syncMarkers() {
    if (!map || !markerLayer) return
    markerLayer.clearLayers()
    const latLngs: L.LatLngExpression[] = []

    for (const point of props.points) {
        const lat = parseCoord(point.latitude)
        const lng = parseCoord(point.longitude)
        if (lat == null || lng == null) continue
        const position: L.LatLngExpression = [lat, lng]
        latLngs.push(position)
        const isSelected = props.selectedPointId === point.id
        const marker = L.marker(position, {
            icon: L.divIcon({
                className: "home-campaign-marker",
                html: markerHtml(isSelected),
                iconSize: [isSelected ? 14 : 12, isSelected ? 14 : 12],
                iconAnchor: [isSelected ? 7 : 6, isSelected ? 7 : 6],
            }),
        })
        marker.on("click", () => emit("select", point.id))
        marker.addTo(markerLayer)
    }

    if (latLngs.length === 0) {
        map.setView([39.5, -8.0], 6)
        return
    }
    if (latLngs.length === 1) {
        map.setView(latLngs[0], 10)
        return
    }
    map.fitBounds(L.latLngBounds(latLngs), { padding: [48, 48], maxZoom: 8 })
}

onMounted(() => {
    if (!mapRoot.value) return
    configureLeafletDefaultIcon()
    map = L.map(mapRoot.value, {
        scrollWheelZoom: false,
        zoomControl: true,
    })
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
    }).addTo(map)
    markerLayer = L.layerGroup().addTo(map)
    syncMarkers()
    requestAnimationFrame(() => map?.invalidateSize())
})

watch(
    () => [props.points, props.selectedPointId] as const,
    async () => {
        await nextTick()
        syncMarkers()
        requestAnimationFrame(() => map?.invalidateSize())
    },
    { deep: true, flush: "post" },
)

onBeforeUnmount(() => {
    map?.remove()
    map = null
    markerLayer = null
})
</script>

<template>
    <div
        ref="mapRoot"
        class="relative isolate z-0 h-[min(420px,52vh)] w-full overflow-hidden rounded-2xl bg-neutral-800"
        aria-label="Mapa de campanhas ativas"
    />
</template>

<style scoped>
:deep(.home-campaign-marker) {
    background: transparent;
    border: none;
}
</style>
