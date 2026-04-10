<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Button } from "../components/ui/button"
import FieldLabel from "../components/ui/form/FieldLabel.vue"
import { Input } from "../components/ui/input"
import { routePaths } from "../app/router"
import { useAuth } from "../composables/useAuth"
import type { ApiRequestError } from "../services/http"

function isApiRequestLike(e: unknown): e is ApiRequestError {
    return (
        typeof e === "object" &&
        e !== null &&
        "status" in e &&
        typeof (e as { status: unknown }).status === "number" &&
        "message" in e &&
        typeof (e as { message: unknown }).message === "string"
    )
}

function loginErrorMessage(e: unknown): string {
    if (isApiRequestLike(e)) {
        if (e.status === 401 || e.status === 403) {
            return "Credenciais inválidas ou conta bloqueada."
        }
        if (e.status >= 500) {
            return "Serviço temporariamente indisponível. Tenta mais tarde."
        }
        return e.message
    }
    if (e instanceof Error) {
        if (e.message.includes("VITE_API_URL")) {
            return "A aplicação não está configurada para falar com o servidor. Quem instalou o projeto deve definir o endereço do serviço e reiniciar."
        }
        if (/failed to fetch|networkerror|load failed|fetch/i.test(e.message)) {
            return "Não foi possível ligar ao serviço. Verifica a internet, se o servidor está ligado e tenta outra vez."
        }
    }
    return "Credenciais inválidas ou conta bloqueada."
}

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const email = ref("")
const password = ref("")
const err = ref("")
const pending = ref(false)

async function onSubmit() {
    err.value = ""
    pending.value = true
    try {
        await login(email.value.trim(), password.value)
        const r = route.query.redirect
        await router.replace(typeof r === "string" && r.startsWith("/") ? r : routePaths.dashboard)
    } catch (e) {
        err.value = loginErrorMessage(e)
    } finally {
        pending.value = false
    }
}
</script>

<template>
    <div class="mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div>
            <h1 class="text-2xl font-semibold text-neutral-950">Entrar</h1>
        </div>
        <form class="space-y-4" @submit.prevent="onSubmit">
            <div>
                <FieldLabel for-id="login-email" label="Email" required />
                <Input id="login-email" v-model="email" type="email" autocomplete="username" required class="mt-1" />
            </div>
            <div>
                <FieldLabel for-id="login-password" label="Palavra-passe" required />
                <Input
                    id="login-password"
                    v-model="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    class="mt-1"
                />
            </div>
            <p v-if="err" class="text-sm text-red-600">{{ err }}</p>
            <Button type="submit" class="w-full" :disabled="pending">{{ pending ? "A entrar…" : "Entrar" }}</Button>
        </form>
        <p class="text-center text-sm text-neutral-600">
            <router-link :to="routePaths.register" class="font-medium text-neutral-950 underline">Criar conta</router-link>
        </p>
    </div>
</template>
