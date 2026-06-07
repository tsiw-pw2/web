import { campaignStatusLabel, type CampaignStatusKey, } from "@/modules/campaigns/lib/campaignStatus"
import { registrationRoleLabel, registrationStatusLabel, } from "@/modules/campaigns/lib/registrationLabels"
import { settingsUserRoleFromFlags, type SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"
import { userRoleLabel } from "@/modules/settings/lib/userRoleLabel"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"
import { labelUnit } from "@/modules/waste/lib/wasteDisplayLabels"

export type TableValueBadge = {
    label: string
    className: string
}

const BASE = "inline-block px-1 py-0.5 text-sm leading-5 font-medium rounded-sm"

function badge(label: string, tone: string): TableValueBadge {
    return { label, className: `${BASE} ${tone}` }
}

const CAMPAIGN_STATUS_TONE: Record<CampaignStatusKey, string> = {
    planeada: "bg-neutral-100 text-neutral-700",
    aberta_inscricoes: "bg-emerald-100 text-emerald-800",
    encerrada_inscricoes: "bg-amber-100 text-amber-900",
    em_progresso: "bg-sky-100 text-sky-800",
    concluida: "bg-teal-100 text-teal-800",
    cancelada: "bg-red-100 text-red-800",
}

export function campaignStatusTableBadge(key: CampaignStatusKey | string | undefined | null): TableValueBadge {
    const k = key as CampaignStatusKey
    const label = campaignStatusLabel(key)
    if (label === "-") return badge(label, "bg-neutral-100 text-neutral-600")
    return badge(label, CAMPAIGN_STATUS_TONE[k] ?? "bg-neutral-100 text-neutral-700")
}

export function campaignDetailUiStatusTableBadge(status: number): TableValueBadge {
    if (status === 2) return badge("Concluída", "bg-teal-100 text-teal-800")
    if (status === 1) return badge("Ativa", "bg-sky-100 text-sky-800")
    return badge("Planeada", "bg-neutral-100 text-neutral-700")
}

export function registrationStatusTableBadge(status: number): TableValueBadge {
    const label = registrationStatusLabel(status)
    if (status === 0) return badge(label, "bg-amber-100 text-amber-900")
    if (status === 1) return badge(label, "bg-emerald-100 text-emerald-800")
    if (status === 2) return badge(label, "bg-neutral-100 text-neutral-600")
    return badge(label, "bg-neutral-100 text-neutral-700")
}

export function registrationRoleTableBadge(role: number): TableValueBadge {
    const label = registrationRoleLabel(role)
    if (role === 1) return badge(label, "bg-violet-100 text-violet-800")
    return badge(label, "bg-sky-100 text-sky-800")
}

const USER_ROLE_TONE: Record<SettingsUserRoleKey, string> = {
    admin: "bg-violet-100 text-violet-800",
    organizer: "bg-indigo-100 text-indigo-800",
    volunteer: "bg-neutral-100 text-neutral-700",
}

export function userRoleTableBadge(u: Pick<SettingsUserRow, "isAdmin" | "isOrganizer" | "role">): TableValueBadge {
    const label = userRoleLabel(u)
    const key = u.role ?? settingsUserRoleFromFlags(u)
    return badge(label, USER_ROLE_TONE[key] ?? "bg-neutral-100 text-neutral-700")
}

export function userAccountStateTableBadge(isBlocked: boolean): TableValueBadge {
    if (isBlocked) return badge("Bloqueado", "bg-red-100 text-red-800")
    return badge("Ativo", "bg-emerald-100 text-emerald-800")
}

const WASTE_UNIT_TONE: Record<string, string> = {
    peso: "bg-amber-100 text-amber-900",
    kg: "bg-amber-100 text-amber-900",
    unit: "bg-cyan-100 text-cyan-900",
}

export function wasteUnitTableBadge(unitCode: string): TableValueBadge {
    const label = labelUnit(unitCode)
    return badge(label, WASTE_UNIT_TONE[unitCode] ?? "bg-neutral-100 text-neutral-700")
}

const WASTE_CATEGORY_TONES = [
    "bg-violet-100 text-violet-800",
    "bg-sky-100 text-sky-800",
    "bg-emerald-100 text-emerald-800",
    "bg-amber-100 text-amber-900",
    "bg-rose-100 text-rose-800",
    "bg-teal-100 text-teal-800",
] as const

function toneIndexFromString(value: string): number {
    let hash = 0
    for (let i = 0; i < value.length; i++) {
        hash = (hash + value.charCodeAt(i) * (i + 1)) % WASTE_CATEGORY_TONES.length
    }
    return hash
}

export function wasteCategoryTableBadge(categoryName: string): TableValueBadge {
    const trimmed = categoryName.trim()
    if (!trimmed) return badge("-", "bg-neutral-100 text-neutral-600")
    const tone = WASTE_CATEGORY_TONES[toneIndexFromString(trimmed.toLowerCase())]
    return badge(trimmed, tone)
}
