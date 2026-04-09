import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
    "inline-flex font-semibold items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
    {
        variants: {
            variant: {
                default: "h-9 bg-linear-to-b from-[#008BF8] to-[#2A4DEB] shadow-[0_1px_2px_0_rgba(28,78,244,0.24),0_-1px_0_0_rgba(0,0,0,0.16)_inset,0_1px_0_0_rgba(255,255,255,0.24)_inset] hover:opacity-90 text-white text-shadow-[0_0.5px_1px_rgba(0,0,0,0.25)]",
                secondary: "h-[34px] bg-linear-to-b from-white to-neutral-50 hover:from-neutral-50 hover:to-neutral-100 shadow-[0_1px_1px_0_rgba(0,0,0,0.06),0_1px_2px_0_rgba(0,0,0,0.24),0_0_0_1px_rgb(229,229,229)] text-neutral-950 text-shadow-[0_1px_0_rgb(255,255,255)]",
                outline: "h-9 border border-neutral-200 bg-white shadow-xs hover:bg-neutral-50 text-neutral-900",
            },
            size: {
                default: "px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
