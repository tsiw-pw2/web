<script setup lang="ts">
import { RouterLink } from "vue-router"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import { routePaths } from "@/app/router"
import { REGISTER_PASSWORD_MIN_LENGTH } from "@/modules/auth/lib/registerFormConstants"

const name = defineModel<string>("name", { required: true })
const email = defineModel<string>("email", { required: true })
const password = defineModel<string>("password", { required: true })
const confirmPassword = defineModel<string>("confirmPassword", { required: true })
const acceptedTerms = defineModel<boolean>("acceptedTerms", { required: true })

defineProps<{
    formError: string | null
    fieldHasError: boolean
    fieldErrorClass: string
    canSubmit: boolean
    isSubmitting: boolean
}>()

const emit = defineEmits<{
    submit: []
}>()
</script>

<template>
    <form class="w-full" @submit.prevent="emit('submit')">
        <div class="space-y-4">
            <div>
                <h1 class="text-center text-xl font-semibold leading-8 text-neutral-950">Criar conta</h1>
                <p class="mt-2 text-center text-sm leading-5 text-neutral-600">
                    Junta-te às campanhas de limpeza costeira na Mariva.
                </p>
            </div>

            <div>
                <FieldLabel class="block" required for="register-name">Nome</FieldLabel>
                <Input
                    id="register-name"
                    v-model="name"
                    :class="['mt-2 w-full', fieldHasError && fieldErrorClass]"
                    autocomplete="name"
                    type="text"
                    placeholder="O teu nome"
                />
            </div>

            <div>
                <FieldLabel class="block" required for="register-email">Email</FieldLabel>
                <Input
                    id="register-email"
                    v-model="email"
                    :class="['mt-2 w-full', fieldHasError && fieldErrorClass]"
                    autocomplete="email"
                    type="email"
                    placeholder="support@mariva.com"
                />
            </div>

            <div>
                <FieldLabel class="block" required for="register-password">Palavra-passe</FieldLabel>
                <Input
                    id="register-password"
                    v-model="password"
                    :class="['mt-2 w-full', fieldHasError && fieldErrorClass]"
                    autocomplete="new-password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                />
            </div>

            <div>
                <FieldLabel class="block" required for="register-confirm-password">Confirmar palavra-passe</FieldLabel>
                <Input
                    id="register-confirm-password"
                    v-model="confirmPassword"
                    :class="['mt-2 w-full', fieldHasError && fieldErrorClass]"
                    autocomplete="new-password"
                    type="password"
                    placeholder="Repete a palavra-passe"
                />
                <p class="mt-1 text-xs leading-4 text-neutral-500">
                    A palavra-passe deve ter pelo menos {{ REGISTER_PASSWORD_MIN_LENGTH }} caracteres.
                </p>
                <p
                    v-if="formError"
                    role="alert"
                    class="mt-2 text-left text-sm font-medium leading-4 text-red-600">
                    {{ formError }}
                </p>
            </div>

            <label class="flex cursor-pointer items-start gap-3 text-left text-xs leading-5 text-neutral-600">
                <input
                    v-model="acceptedTerms"
                    type="checkbox"
                    class="mt-0.5 size-4 shrink-0 rounded border-neutral-300 text-blue-600"
                />
                <span>
                    Li e aceito os
                    <RouterLink :to="routePaths.terms" class="font-medium text-blue-700 hover:underline">
                        termos de utilização
                    </RouterLink>
                    e a
                    <RouterLink :to="routePaths.privacy" class="font-medium text-blue-700 hover:underline">
                        política de privacidade
                    </RouterLink
                    >.
                </span>
            </label>

            <Button class="w-full justify-center" type="submit" :disabled="isSubmitting || !canSubmit">
                Criar conta
            </Button>

            <div class="flex items-center justify-center gap-2 text-xs text-neutral-600">
                <span>Já tens conta?</span>
                <RouterLink :to="routePaths.login" class="hover:text-neutral-950">Entrar</RouterLink>
            </div>
        </div>
    </form>
</template>
