import { cn } from "@/shared/lib/utils"

export const SELECT_TRIGGER_LAYOUT =
    "select-shadow flex h-[34px] w-full min-w-0 items-center gap-1 rounded-lg bg-white px-2 text-sm font-medium leading-5 outline-none focus-within:outline-none"

export const SELECT_TRIGGER_COMBO =
    "flex min-h-0 min-w-0 flex-1 cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-start text-sm font-medium leading-5 outline-none disabled:cursor-not-allowed disabled:select-none"

export const FIELD_CLEAR_BUTTON =
    "shrink-0 cursor-pointer border-0 bg-transparent p-0 text-neutral-500 outline-none disabled:cursor-not-allowed"

export const SELECT_CLEAR_BUTTON = FIELD_CLEAR_BUTTON

export const SELECT_PANEL_LAYOUT = "select-shadow-content fixed z-[1000] max-h-60 overflow-auto rounded-lg bg-white p-1 text-neutral-900 outline-none"

// Classes Tailwind do rótulo do select consoante valor, placeholder e estado.
export function selectLabelClasses(hasSelectedLabel: boolean, hasPlaceholder: boolean, isDisabled: boolean) {
    return cn(
        "min-w-0 flex-1 truncate bg-transparent px-0.5 text-start text-sm font-medium leading-5 outline-none",
        !hasSelectedLabel && hasPlaceholder ? "text-neutral-500" : "text-neutral-900",
        isDisabled && "select-none",
    )
}

// Classes Tailwind de cada opção do painel do select (destaque ao passar o rato).
export function selectOptionClasses(isHighlighted: boolean) {
    return cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-left text-sm font-medium leading-5 outline-none",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "hover:bg-neutral-100 hover:text-neutral-900",
        isHighlighted && "bg-neutral-100 text-neutral-900",
    )
}
