<script setup lang="ts">
import type { DashboardMonthlyTrendPoint } from "@/modules/dashboard/types"

const props = defineProps<{
    points: DashboardMonthlyTrendPoint[]
}>()

// Formata o mês para o eixo do gráfico.
function monthLabel(month: string): string {
    const [y, m] = month.split("-")
    const d = new Date(Number(y), Number(m) - 1, 1)
    if (Number.isNaN(d.getTime())) return month
    return d.toLocaleDateString("pt-PT", { month: "short", year: "numeric" })
}

// Calcula o peso máximo para escala do gráfico.
function maxWeight(): number {
    let max = 0
    for (const p of props.points) {
        if (p.weightKg > max) max = p.weightKg
    }
    return max > 0 ? max : 1
}
</script>

<template>
    <p v-if="points.length === 0" class="text-sm leading-5 text-neutral-600">Ainda não há recolhas registadas.</p>
    <ul v-else class="space-y-3">
        <li v-for="point in points" :key="point.month" class="space-y-1">
            <div class="flex justify-between gap-2 text-sm">
                <span class="font-medium text-neutral-950">{{ monthLabel(point.month) }}</span>
                <span class="tabular-nums text-neutral-600">
                    {{ Math.round(point.weightKg) }} kg · {{ point.units }} un.
                </span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                    class="h-full rounded-full bg-neutral-800"
                    :style="{ width: `${Math.max(4, (point.weightKg / maxWeight()) * 100)}%` }"
                />
            </div>
        </li>
    </ul>
</template>
