import { cn } from "@/shared/lib/utils"

export const SELECT_TRIGGER_LAYOUT =
    "flex h-[34px] w-full min-w-0 cursor-pointer items-center gap-1 rounded-lg bg-white px-2 text-sm font-medium leading-5 outline-none select-shadow focus:outline-none disabled:cursor-not-allowed disabled:select-none disabled:opacity-60"

export const SELECT_PANEL_LAYOUT = "select-shadow-content fixed z-[110] max-h-60 overflow-auto rounded-lg bg-white p-1 text-neutral-900 outline-none"

export function selectLabelClasses(hasSelectedLabel: boolean, hasPlaceholder: boolean, isDisabled: boolean) {
    return cn(
        "min-w-0 flex-1 truncate bg-transparent px-0.5 text-start text-sm font-medium leading-5 outline-none",
        !hasSelectedLabel && hasPlaceholder ? "text-neutral-500" : "text-neutral-900",
        isDisabled && "select-none",
    )
}

export function selectOptionClasses(isHighlighted: boolean) {
    return cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-left text-sm outline-none transition-colors",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "hover:bg-neutral-100 hover:text-neutral-900",
        isHighlighted && "bg-neutral-100 text-neutral-900",
    )
}
