import { computed, ref } from "vue"
import { accessToken } from "../auth/accessToken"
import * as authApi from "../services/auth.service"
import type { AuthUser } from "../services/auth.service"

const profile = ref<AuthUser | null>(null)
const bootstrapped = ref(false)

export function useAuth() {
    const isAuthenticated = computed(() => Boolean(accessToken.value))
    const isAdmin = computed(() => profile.value?.is_admin === 1)
    const isOrganizer = computed(() => profile.value?.is_organizer === 1)
    const userName = computed(() => profile.value?.nome ?? "")

    async function loadProfile() {
        if (!accessToken.value) {
            profile.value = null
            return
        }
        try {
            profile.value = await authApi.fetchMe()
        } catch {
            profile.value = null
        }
    }

    async function bootstrap() {
        if (bootstrapped.value) return
        bootstrapped.value = true
        if (!accessToken.value) {
            const ok = await authApi.trySessionFromCookie()
            if (ok) await loadProfile()
        } else {
            await loadProfile()
        }
    }

    async function login(email: string, password: string) {
        await authApi.loginRequest(email, password)
        await loadProfile()
    }

    async function register(payload: {
        nome: string
        email: string
        password: string
        data_nascimento: string
        telefone?: string | null
    }) {
        await authApi.registerRequest(payload)
    }

    async function logout() {
        await authApi.logoutRequest()
        profile.value = null
    }

    return {
        accessToken,
        profile,
        isAuthenticated,
        isAdmin,
        isOrganizer,
        userName,
        bootstrap,
        loadProfile,
        login,
        register,
        logout,
    }
}
