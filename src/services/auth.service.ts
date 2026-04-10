import { accessToken } from "../auth/accessToken"
import { apiFetch, apiJson, getApiBase } from "./http"

export type AuthUser = {
    id: string
    nome: string
    email: string
    telefone: string | null
    data_nascimento: string | null
    is_admin: number
    is_organizer: number
    is_blocked: number
    created_at: string | null
    updated_at: string | null
}

export async function loginRequest(email: string, password: string) {
    const data = await apiJson<{ access_token: string; expires_in: number }>("/auth/login", "POST", {
        email,
        password,
    })
    accessToken.value = data.access_token
    return data
}

export async function logoutRequest() {
    try {
        await apiFetch("/auth/logout", { method: "POST" })
    } finally {
        accessToken.value = null
    }
}

export async function registerRequest(payload: {
    nome: string
    email: string
    password: string
    data_nascimento: string
    telefone?: string | null
}) {
    return apiJson<{ id: string; nome: string; email: string }>("/users", "POST", payload)
}

export async function fetchMe() {
    return apiFetch<AuthUser>("/users/me")
}

export async function trySessionFromCookie() {
    const res = await fetch(`${getApiBase()}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}",
    })
    if (!res.ok) return false
    const data = (await res.json()) as { access_token?: string }
    if (data.access_token) {
        accessToken.value = data.access_token
        return true
    }
    return false
}
