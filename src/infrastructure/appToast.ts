import { toast } from "vue-sonner"
import ToastDangerIcon from "@/shared/components/toast/ToastDangerIcon.vue"

const TOAST_DURATION_MS = 2800

function toastOpts(description?: string) {
    return {
        duration: TOAST_DURATION_MS,
        ...(description ? { description } : {}),
    }
}

export function toastSuccess(title: string, subtitle?: string) {
    toast.success(title, toastOpts(subtitle))
}

export function toastError(title: string, subtitle?: string) {
    toast.error(title, toastOpts(subtitle))
}

export function toastWarning(title: string, subtitle?: string) {
    toast.warning(title, toastOpts(subtitle))
}

export function toastListPossiblyStale(): void {
    toastWarning("Lista poderá estar desatualizada", "Se não vires a alteração, recarrega a página ou volta a esta secção.")
}

export function toastServiceUnavailable(description: string) {
    toast.error("Não foi possível entrar", {
        description,
        duration: 12_000,
    })
}

export function toastAccountBlocked(title: string, description: string) {
    toast.error(title, {
        ...toastOpts(description),
        icon: ToastDangerIcon,
    })
}
