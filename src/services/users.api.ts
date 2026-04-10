import { apiJson } from "./http"

export async function patchMeApi(body: Record<string, unknown>) {
    return apiJson<unknown>("/users/me", "PATCH", body)
}

