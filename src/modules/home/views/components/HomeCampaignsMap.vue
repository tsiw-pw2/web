<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import type { HomeCampaignMapPoint } from "@/modules/home/types/homeCampaignMap"
import {
    homeCampaignClusterHtml,
    homeCampaignMapPinAnchor,
    homeCampaignMapPinHtml,
    homeCampaignMapPinSize,
} from "@/modules/home/lib/homeCampaignMapPin"
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
let markerCluster: L.MarkerClusterGroup | null = null

function parseCoord(value: string): number | null {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

function createPointMarker(point: HomeCampaignMapPoint): L.Marker {
    const lat = parseCoord(point.latitude)
    const lng = parseCoord(point.longitude)
    if (lat == null || lng == null) {
        throw new Error("Invalid coordinates")
    }

    const isSelected = props.selectedPointId === point.id
    const [iconWidth, iconHeight] = homeCampaignMapPinSize(isSelected)
    const [anchorX, anchorY] = homeCampaignMapPinAnchor(isSelected)
    const marker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: "home-campaign-marker",
            html: homeCampaignMapPinHtml(isSelected),
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [anchorX, anchorY],
        }),
    })
    marker.on("click", () => emit("select", point.id))
    return marker
}

function syncMarkers() {
    if (!map || !markerCluster) return
    markerCluster.clearLayers()
    const latLngs: L.LatLngExpression[] = []

    for (const point of props.points) {
        const lat = parseCoord(point.latitude)
        const lng = parseCoord(point.longitude)
        if (lat == null || lng == null) continue
        latLngs.push([lat, lng])
        markerCluster.addLayer(createPointMarker(point))
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

    markerCluster = L.markerClusterGroup({
        maxClusterRadius: 42,
        disableClusteringAtZoom: 12,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction(cluster) {
            return L.divIcon({
                className: "home-campaign-cluster-marker",
                html: homeCampaignClusterHtml(cluster.getChildCount()),
                iconSize: [40, 40],
                iconAnchor: [20, 20],
            })
        },
    })
    map.addLayer(markerCluster)
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
    markerCluster?.clearLayers()
    map?.remove()
    map = null
    markerCluster = null
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

:deep(.home-campaign-cluster-marker) {
    background: transparent;
    border: none;
}

:deep(.home-campaign-cluster) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    background: #2563eb;
    border: 2px solid #ffffff;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
}
</style>
