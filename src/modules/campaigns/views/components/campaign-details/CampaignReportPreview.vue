<script setup lang="ts">
import type { CampaignReport } from "@/modules/campaigns/services/campaignReport"
import { formatHomeCampaignDate } from "@/modules/home/lib/formatHomeCampaignDate"
import { formatWeightKg } from "@/shared/lib/formatPt"

defineProps<{
    report: CampaignReport
}>()

function formatMeetingTime(value: string | null | undefined): string {
    if (!value) return "—"
    const match = /^(\d{1,2}):(\d{2})/.exec(value.trim())
    if (!match) return value
    return `${match[1].padStart(2, "0")}:${match[2]}`
}
</script>

<template>
    <article class="mx-auto w-[210mm] max-w-full min-h-[297mm] border border-slate-300 bg-white shadow-sm">
        <header class="border-b-4 border-slate-800 bg-slate-50 px-6 py-5 text-center">
            <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                República Portuguesa
            </p>
            <p class="mt-1 text-sm font-medium text-slate-800">
                {{ report.organizationName ?? "Entidade promotora" }}
            </p>
            <p v-if="report.organizationMunicipality" class="text-xs text-slate-600">
                Município de {{ report.organizationMunicipality }}
            </p>
            <div class="mx-auto mt-4 h-px w-24 bg-slate-400" />
            <h3 class="mt-4 text-base font-bold uppercase tracking-wide text-slate-900">
                Relatório de campanha de limpeza de praias
            </h3>
            <p class="mt-2 text-sm font-semibold text-slate-800">{{ report.title }}</p>
            <p class="mt-1 font-mono text-xs text-slate-500">Ref. {{ report.referenceCode }}</p>
        </header>

        <div class="grid gap-0 border-b border-slate-200 sm:grid-cols-2">
            <dl class="border-b border-slate-200 px-6 py-4 sm:border-b-0 sm:border-r">
                <dt class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Estado</dt>
                <dd class="mt-1 text-sm font-medium text-slate-900">{{ report.statusLabel }}</dd>
                <dt class="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Período</dt>
                <dd class="mt-1 text-sm text-slate-800">
                    {{ formatHomeCampaignDate(report.startDate) }} — {{ formatHomeCampaignDate(report.endDate) }}
                </dd>
                <dt class="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Distrito</dt>
                <dd class="mt-1 text-sm text-slate-800">{{ report.district ?? "—" }}</dd>
            </dl>
            <dl class="px-6 py-4">
                <dt class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Ponto de encontro</dt>
                <dd class="mt-1 text-sm text-slate-800">{{ report.meetingLocation || "—" }}</dd>
                <dt class="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Hora de encontro</dt>
                <dd class="mt-1 text-sm text-slate-800">{{ formatMeetingTime(report.meetingTime) }}</dd>
                <dt class="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Organizador responsável</dt>
                <dd class="mt-1 text-sm text-slate-800">{{ report.organizerName ?? "—" }}</dd>
            </dl>
        </div>

        <section v-if="report.description" class="border-b border-slate-200 px-6 py-4">
            <h4 class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Objectivo e informações</h4>
            <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{{ report.description }}</p>
        </section>

        <section class="border-b border-slate-200 px-6 py-4">
            <h4 class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                1. Praias abrangidas ({{ report.beaches.length }})
            </h4>
            <table class="mt-3 w-full border-collapse text-left text-sm">
                <thead>
                    <tr class="border-b border-slate-300 bg-slate-50">
                        <th class="px-2 py-2 font-semibold text-slate-700">Praia</th>
                        <th class="px-2 py-2 font-semibold text-slate-700">Concelho</th>
                        <th class="px-2 py-2 font-semibold text-slate-700">Distrito</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="beach in report.beaches" :key="beach.id" class="border-b border-slate-200 last:border-b-0">
                        <td class="px-2 py-2 text-slate-900">{{ beach.name }}</td>
                        <td class="px-2 py-2 text-slate-700">{{ beach.municipality ?? "—" }}</td>
                        <td class="px-2 py-2 text-slate-700">{{ beach.district ?? "—" }}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section class="border-b border-slate-200 px-6 py-4">
            <h4 class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">2. Participação voluntária</h4>
            <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div class="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                    <p class="text-[11px] uppercase text-slate-500">Total inscrições</p>
                    <p class="mt-1 text-xl font-semibold tabular-nums text-slate-900">{{ report.volunteers.total }}</p>
                </div>
                <div class="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                    <p class="text-[11px] uppercase text-slate-500">Confirmadas</p>
                    <p class="mt-1 text-xl font-semibold tabular-nums text-slate-900">{{ report.volunteers.confirmed }}</p>
                </div>
                <div class="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                    <p class="text-[11px] uppercase text-slate-500">Presentes</p>
                    <p class="mt-1 text-xl font-semibold tabular-nums text-slate-900">{{ report.volunteers.present }}</p>
                </div>
                <div class="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                    <p class="text-[11px] uppercase text-slate-500">Taxa de presença</p>
                    <p class="mt-1 text-xl font-semibold tabular-nums text-slate-900">
                        {{ report.volunteers.attendanceRate }}%
                    </p>
                </div>
            </div>
            <dl class="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <div class="flex justify-between gap-2 border-b border-dashed border-slate-200 py-1 sm:block">
                    <dt class="text-slate-500">Pendentes</dt>
                    <dd class="font-medium tabular-nums text-slate-900">{{ report.volunteers.pending }}</dd>
                </div>
                <div class="flex justify-between gap-2 border-b border-dashed border-slate-200 py-1 sm:block">
                    <dt class="text-slate-500">Canceladas</dt>
                    <dd class="font-medium tabular-nums text-slate-900">{{ report.volunteers.cancelled }}</dd>
                </div>
                <div class="flex justify-between gap-2 border-b border-dashed border-slate-200 py-1 sm:block">
                    <dt class="text-slate-500">Ausentes (confirmados)</dt>
                    <dd class="font-medium tabular-nums text-slate-900">{{ report.volunteers.absent }}</dd>
                </div>
            </dl>
        </section>

        <section class="border-b border-slate-200 px-6 py-4">
            <h4 class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">3. Resíduos recolhidos</h4>
            <div class="mt-3 grid gap-3 sm:grid-cols-3">
                <div class="rounded border border-slate-200 px-3 py-2">
                    <p class="text-[11px] uppercase text-slate-500">Unidades</p>
                    <p class="mt-1 text-lg font-semibold tabular-nums text-slate-900">{{ report.waste.totalUnits }}</p>
                </div>
                <div class="rounded border border-slate-200 px-3 py-2">
                    <p class="text-[11px] uppercase text-slate-500">Peso real</p>
                    <p class="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                        {{ formatWeightKg(report.waste.totalActualWeightKg) }}
                    </p>
                </div>
                <div class="rounded border border-slate-200 px-3 py-2">
                    <p class="text-[11px] uppercase text-slate-500">Impacto estimado</p>
                    <p class="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                        {{ formatWeightKg(report.waste.totalImpactWeightKg) }}
                    </p>
                </div>
            </div>

            <table v-if="report.waste.byType.length > 0" class="mt-4 w-full border-collapse text-left text-sm">
                <thead>
                    <tr class="border-b border-slate-300 bg-slate-50">
                        <th class="px-2 py-2 font-semibold text-slate-700">Tipo de resíduo</th>
                        <th class="px-2 py-2 text-right font-semibold text-slate-700">Unidades</th>
                        <th class="px-2 py-2 text-right font-semibold text-slate-700">Peso (kg)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="row in report.waste.byType"
                        :key="row.wasteType"
                        class="border-b border-slate-200 last:border-b-0"
                    >
                        <td class="px-2 py-2 text-slate-900">{{ row.wasteType }}</td>
                        <td class="px-2 py-2 text-right tabular-nums text-slate-800">{{ row.totalUnits }}</td>
                        <td class="px-2 py-2 text-right tabular-nums text-slate-800">{{ row.totalWeightKg }}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section
            v-for="beach in report.waste.byBeach"
            :key="beach.beachId"
            class="border-b border-slate-200 px-6 py-4 last:border-b-0"
        >
            <h4 class="text-sm font-semibold text-slate-900">
                Detalhe por praia — {{ beach.beachName }}
            </h4>
            <p class="mt-1 text-xs text-slate-500">
                {{ beach.totalUnits }} un. · {{ formatWeightKg(beach.totalWeightKg) }}
            </p>
            <table class="mt-3 w-full border-collapse text-left text-sm">
                <thead>
                    <tr class="border-b border-slate-300 bg-slate-50">
                        <th class="px-2 py-2 font-semibold text-slate-700">Resíduo</th>
                        <th class="px-2 py-2 font-semibold text-slate-700">Tipo</th>
                        <th class="px-2 py-2 text-right font-semibold text-slate-700">Unidades</th>
                        <th class="px-2 py-2 text-right font-semibold text-slate-700">Peso (kg)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in beach.collections"
                        :key="index"
                        class="border-b border-slate-200 last:border-b-0"
                    >
                        <td class="px-2 py-2 text-slate-900">{{ item.wasteName }}</td>
                        <td class="px-2 py-2 text-slate-700">{{ item.wasteType ?? "—" }}</td>
                        <td class="px-2 py-2 text-right tabular-nums text-slate-800">{{ item.unitQuantity }}</td>
                        <td class="px-2 py-2 text-right tabular-nums text-slate-800">{{ item.actualWeightKg }}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <footer class="border-t border-slate-300 bg-slate-50 px-6 py-4 text-xs text-slate-600">
            <p>Documento gerado automaticamente pela plataforma Mariva em {{ new Date(report.generatedAt).toLocaleString("pt-PT") }}.</p>
            <p class="mt-1">Este relatório consolida dados registados durante a campanha e destina-se a arquivo e comunicação institucional.</p>
        </footer>
    </article>
</template>
