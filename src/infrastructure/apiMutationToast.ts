import { toastError } from "@/infrastructure/appToast"
import { isApiRequestError } from "@/infrastructure/request"

export type ListMutationToastMode = "create" | "save" | "delete"

export function describeListMutationFailure(
    e: unknown,
    opts: { forbiddenDetail?: string; conflictDetail?: string } = {},
): string {
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
            return "O serviço está indisponível. Tenta mais tarde."
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
    toastError(
        title,
        describeListMutationFailure(e, { forbiddenDetail: opts.forbiddenDetail, conflictDetail: opts.conflictDetail }),
    )
}
