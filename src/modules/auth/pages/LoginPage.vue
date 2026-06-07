<script setup lang="ts">
import { useLoginPage } from "@/modules/auth/composables/useLoginPage"
import LoginFormCard from "@/modules/auth/views/components/login/LoginFormCard.vue"
import LoginPageShell from "@/modules/auth/views/components/login/LoginPageShell.vue"

const {
    email,
    password,
    credentialsError,
    loginFieldHasError,
    loginFieldErrorClass,
    isSubmitting,
    submit,
} = useLoginPage()
</script>

<template>
    <LoginPageShell>
        <LoginFormCard
            v-model:email="email"
            v-model:password="password"
            :credentials-error="credentialsError"
            :login-field-has-error="loginFieldHasError"
            :login-field-error-class="loginFieldErrorClass"
            :is-submitting="isSubmitting"
            @submit="submit"
        />
    </LoginPageShell>
</template>
