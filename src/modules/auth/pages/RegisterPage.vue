<script setup lang="ts">
import { useRegisterPage } from "@/modules/auth/composables/useRegisterPage"
import LoginPageShell from "@/modules/auth/views/components/login/LoginPageShell.vue"
import RegisterFormCard from "@/modules/auth/views/components/register/RegisterFormCard.vue"

const {
    name,
    email,
    password,
    confirmPassword,
    acceptedTerms,
    formError,
    fieldHasError,
    fieldErrorClass,
    canSubmit,
    isSubmitting,
    submit,
} = useRegisterPage()
</script>

<template>
    <LoginPageShell>
        <RegisterFormCard
            v-model:name="name"
            v-model:email="email"
            v-model:password="password"
            v-model:confirm-password="confirmPassword"
            v-model:accepted-terms="acceptedTerms"
            :form-error="formError"
            :field-has-error="fieldHasError"
            :field-error-class="fieldErrorClass"
            :can-submit="canSubmit"
            :is-submitting="isSubmitting"
            @submit="submit"
        />
    </LoginPageShell>
</template>
