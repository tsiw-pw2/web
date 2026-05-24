import { toastError } from "@/infrastructure/appToast"
import { isApiServiceUnavailableError } from "@/infrastructure/apiErrors"
import { isApiRequestError } from "@/infrastructure/request"

export type ListMutationToastMode = "create" | "save" | "delete"

export function describeListMutationFailure(
    e: unknown,
    opts: { forbiddenDetail?: string; conflictDetail?: string } = {},
): string {
    if (isApiServiceUnavailableError(e)) {
        return e.friendlyMessage
    }
    if (isApiRequestError(e)) {
        if (e.httpStatus === 403) {
            return opts.forbiddenDetail ?? "Não tens permissão para esta ação."
        }
        if (e.httpStatus === 401) {
            return "A sessão expirou ou deixou de ser válida. Inicia sessão outra vez."
        }
        if (e.httpStatus === 409) {
            return opts.conflictDetail ?? "Este nome ou combinação já está a ser utilizada. Ajusta os dados e tenta outra vez."
        }
        if (e.httpStatus === 400) {
            return "Os dados enviados não são válidos. Revisa os campos obrigatórios e o formato."
        }
        if (e.httpStatus === 429) {
            return "Foram feitos demasiados pedidos seguidos. Espera um pouco e tenta outra vez."
        }
        if (e.httpStatus >= 500) {
            return "O serviço está temporariamente indisponível. Tenta outra vez dentro de momentos."
        }
    }
    return "Verifica a ligação, os dados e tenta outra vez."
}

export function toastFromListMutationError(
    e: unknown,
    opts: { mode: ListMutationToastMode; forbiddenDetail?: string; conflictDetail?: string },
): void {
    const title =
        opts.mode === "create"
            ? "Não foi possível criar"
            : opts.mode === "delete"
              ? "Não foi possível eliminar"
              : "Não foi possível guardar"
    if (isApiServiceUnavailableError(e)) {
        toastError("Serviço indisponível", e.friendlyMessage)
        return
    }
    toastError(
        title,
        describeListMutationFailure(e, { forbiddenDetail: opts.forbiddenDetail, conflictDetail: opts.conflictDetail }),
    )
}
