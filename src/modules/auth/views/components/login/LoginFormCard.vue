<script setup lang="ts">
import { RouterLink } from "vue-router"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import { routePaths } from "@/app/router"

const email = defineModel<string>("email", { required: true })
const password = defineModel<string>("password", { required: true })

defineProps<{
    credentialsError: string | null
    loginFieldHasError: boolean
    loginFieldErrorClass: string
    canSubmit: boolean
    isSubmitting: boolean
}>()

const emit = defineEmits<{
    submit: []
}>()
</script>

<template>
    <form class="w-full max-w-sm" @submit.prevent="emit('submit')">
        <div class="space-y-4">
            <div>
                <FieldLabel class="block" required for="login-email">Email</FieldLabel>
                <Input
                    id="login-email"
                    v-model="email"
                    :class="['mt-2 w-full', loginFieldHasError && loginFieldErrorClass]"
                    autocomplete="email"
                    type="email"
                    placeholder="support@mariva.com"
                />
            </div>

            <div>
                <FieldLabel class="block" required for="login-password">Senha</FieldLabel>
                <Input
                    id="login-password"
                    v-model="password"
                    :class="['mt-2 w-full', loginFieldHasError && loginFieldErrorClass]"
                    autocomplete="current-password"
                    type="password"
                    placeholder="A sua palavra passe"
                />
                <p
                    v-if="credentialsError"
                    role="alert"
                    class="mt-2 text-left text-sm font-medium leading-4 text-red-600">
                    {{ credentialsError }}
                </p>
            </div>

            <Button class="w-full justify-center" type="submit" :disabled="isSubmitting || !canSubmit">
                Entrar
            </Button>

            <div class="flex items-center justify-center gap-2 text-xs text-neutral-600">
                <RouterLink to="#" class="hover:text-neutral-950">Criar conta?</RouterLink>
                <span class="text-neutral-400">|</span>
                <RouterLink :to="routePaths.requestAccount" class="hover:text-neutral-950">
                    Entrar em contacto
                </RouterLink>
            </div>
        </div>
    </form>
</template>
