<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
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

function registerErrorMessage(e: unknown): string {
    if (isApiRequestLike(e)) {
        if (e.status === 409) {
            return e.message
        }
        if (e.status === 400 && e.body && typeof e.body === "object" && e.body !== null && "errors" in e.body) {
            const raw = (e.body as { errors?: Record<string, string[]> }).errors
            if (raw && Object.keys(raw).length) {
                const lines = Object.entries(raw).flatMap(([key, msgs]) =>
                    (msgs || []).map((m) => (key === "_root" ? m : `${key}: ${m}`)),
                )
                if (lines.length) return lines.join(" ")
            }
        }
        if (e.message) return e.message
    }
    if (e instanceof Error) {
        const m = e.message
        if (m.includes("VITE_API_URL")) {
            return "A aplicação não está ligada ao servidor. Pede ajuda a quem instalou o projeto ou verifica a configuração local."
        }
        if (/failed to fetch|networkerror|load failed|fetch/i.test(m)) {
            return "Não foi possível ligar ao serviço. Verifica a ligação e se o servidor está a correr."
        }
        return m
    }
    return "Não foi possível registar. Tenta de novo ou contacta o suporte."
}

const router = useRouter()
const { register } = useAuth()

const nome = ref("")
const email = ref("")
const password = ref("")
const dataNascimento = ref("")
const telefone = ref("")
const err = ref("")
const pending = ref(false)

async function onSubmit() {
    err.value = ""
    if (password.value.length < 10) {
        err.value = "A palavra-passe deve ter pelo menos 10 caracteres."
        return
    }
    pending.value = true
    try {
        await register({
            nome: nome.value.trim(),
            email: email.value.trim(),
            password: password.value,
            data_nascimento: dataNascimento.value,
            telefone: telefone.value.trim() || null,
        })
        await router.replace(routePaths.login)
    } catch (e) {
        err.value = registerErrorMessage(e)
    } finally {
        pending.value = false
    }
}
</script>

<template>
    <div class="mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div>
            <h1 class="text-2xl font-semibold text-neutral-950">Registo</h1>
        </div>
        <form class="space-y-4" @submit.prevent="onSubmit">
            <div>
                <FieldLabel for-id="reg-nome" label="Nome" required />
                <Input id="reg-nome" v-model="nome" type="text" required class="mt-1" />
            </div>
            <div>
                <FieldLabel for-id="reg-email" label="Email" required />
                <Input id="reg-email" v-model="email" type="email" required class="mt-1" />
            </div>
            <div>
                <FieldLabel for-id="reg-pass" label="Palavra-passe (mín. 10)" required />
                <Input id="reg-pass" v-model="password" type="password" required class="mt-1" />
            </div>
            <div>
                <FieldLabel for-id="reg-dob" label="Data de nascimento" required />
                <Input id="reg-dob" v-model="dataNascimento" type="date" required class="mt-1" />
            </div>
            <div>
                <FieldLabel for-id="reg-tel" label="Telefone" optional />
                <Input id="reg-tel" v-model="telefone" type="text" class="mt-1" />
            </div>
            <p v-if="err" class="text-sm text-red-600">{{ err }}</p>
            <Button type="submit" class="w-full" :disabled="pending">{{ pending ? "A registar…" : "Registar" }}</Button>
        </form>
        <p class="text-center text-sm text-neutral-600">
            <router-link :to="routePaths.login" class="font-medium text-neutral-950 underline">Já tens conta? Entrar</router-link>
        </p>
    </div>
</template>
