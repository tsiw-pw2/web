import type { Component } from "vue"
import Clock from "./Clock.vue"

export const INPUT_ICONS = {
	clock: Clock,
} as const

export type InputIconName = keyof typeof INPUT_ICONS

export type InputIconProp = Component | InputIconName

export function resolveInputIcon(icon: InputIconProp | undefined): Component | null {
	if (icon == null) return null
	if (typeof icon === "string") {
		return INPUT_ICONS[icon as InputIconName] ?? null
	}
	return icon
}
