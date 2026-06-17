<script setup lang="ts">
import { ref } from "vue"
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
    isSubmitting: boolean
}>()

const emit = defineEmits<{
    submit: []
}>()

const formRef = ref<HTMLFormElement | null>(null)

function onSubmit() {
    if (!formRef.value?.reportValidity()) return
    emit("submit")
}
</script>

<template>
    <form ref="formRef" class="w-full" @submit.prevent="onSubmit">
        <div class="space-y-4">
            <div>
                <FieldLabel class="block" required for="login-email">Email</FieldLabel>
                <Input
                    id="login-email"
                    v-model="email"
                    :class="['mt-2 w-full', loginFieldHasError && loginFieldErrorClass]"
                    autocomplete="email"
                    type="email"
                    name="email"
                    required
                    placeholder="support@mariva.pt"
                />
            </div>

            <div>
                <FieldLabel class="block" required for="login-password">Palavra-passe</FieldLabel>
                <Input
                    id="login-password"
                    v-model="password"
                    :class="['mt-2 w-full', loginFieldHasError && loginFieldErrorClass]"
                    autocomplete="current-password"
                    type="password"
                    name="password"
                    required
                    placeholder="A tua palavra-passe"
                />
                <p
                    v-if="credentialsError"
                    role="alert"
                    class="mt-2 text-left text-sm font-medium leading-4 text-red-600">
                    {{ credentialsError }}
                </p>
            </div>

            <Button class="w-full justify-center" type="submit" :disabled="isSubmitting">
                Entrar
            </Button>

            <div class="flex items-center justify-center text-xs text-neutral-600">
                <RouterLink :to="routePaths.register" class="hover:text-neutral-950">Criar conta?</RouterLink>
            </div>
        </div>
    </form>
</template>
