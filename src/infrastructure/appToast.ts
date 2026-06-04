import { toast } from "vue-sonner"
import ToastDangerIcon from "@/shared/components/toast/ToastDangerIcon.vue"

const TOAST_DURATION_MS = 2800

// Opções comuns de duração e descrição para toasts da aplicação.
function toastOpts(description?: string) {
    return {
        duration: TOAST_DURATION_MS,
        ...(description ? { description } : {}),
    }
}

// Mostra toast de sucesso com título e subtítulo opcional.
export function toastSuccess(title: string, subtitle?: string) {
    toast.success(title, toastOpts(subtitle))
}

// Mostra toast de erro com título e subtítulo opcional.
export function toastError(title: string, subtitle?: string) {
    toast.error(title, toastOpts(subtitle))
}

// Mostra toast de aviso com título e subtítulo opcional.
export function toastWarning(title: string, subtitle?: string) {
    toast.warning(title, toastOpts(subtitle))
}

// Avisa que a lista visível pode não reflectir a última alteração.
export function toastListPossiblyStale(): void {
    toastWarning("Lista poderá estar desatualizada", "Se não vires a alteração, recarrega a página ou volta a esta secção.")
}

// Mostra toast prolongado quando o serviço está indisponível no login.
export function toastServiceUnavailable(description: string) {
    toast.error("Não foi possível entrar", {
        description,
        duration: 12_000,
    })
}

// Mostra toast de conta bloqueada com ícone de perigo.
export function toastAccountBlocked(title: string, description: string) {
    toast.error(title, {
        ...toastOpts(description),
        icon: ToastDangerIcon,
    })
}
