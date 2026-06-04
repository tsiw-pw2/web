import type { Component } from "vue"
import CalendarIcon from "./CalendarIcon.vue"
import Clock from "./Clock.vue"
import SearchMagnifierIcon from "./SearchMagnifierIcon.vue"

export const INPUT_ICONS = {
    clock: Clock,
    calendar: CalendarIcon,
    search: SearchMagnifierIcon,
} as const

export type InputIconName = keyof typeof INPUT_ICONS

export type InputIconProp = Component | InputIconName

// Resolve o ícone de input: aceita nome registado ou componente Vue directo.
export function resolveInputIcon(icon: InputIconProp | undefined): Component | null {
    if (icon == null) return null
    if (typeof icon === "string") {
        return INPUT_ICONS[icon as InputIconName] ?? null
    }
    return icon
}
