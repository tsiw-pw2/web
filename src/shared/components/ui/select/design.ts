import { cn } from "@/shared/lib/utils"

export const SELECT_TRIGGER_LAYOUT =
	"flex h-[34px] w-full min-w-0 cursor-text items-center gap-1 rounded-lg bg-white px-2 text-sm font-medium leading-5 outline-none select-shadow focus:outline-none"

export const SELECT_PANEL_LAYOUT =
	"select-shadow-content fixed z-50 max-h-60 origin-top overflow-auto rounded-lg bg-white p-1 text-neutral-900 outline-none"

export function selectLabelClasses(hasSelectedLabel: boolean, hasPlaceholder: boolean) {
	return cn(
		"min-w-0 flex-1 truncate bg-transparent px-0.5 text-start text-sm font-medium leading-5 outline-none",
		!hasSelectedLabel && hasPlaceholder ? "text-neutral-500" : "text-neutral-900",
	)
}

export function selectOptionClasses(isHighlighted: boolean) {
	return cn(
		"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-left text-sm outline-none",
		"data-disabled:pointer-events-none data-disabled:opacity-50",
		isHighlighted && "bg-neutral-100 text-neutral-900",
	)
}
