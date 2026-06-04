import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combina classes CSS com Tailwind merge (evita conflitos de utilitários).
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
