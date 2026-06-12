<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { routePaths } from "@/app/router"
import { deleteAccount } from "@/modules/settings/services/deleteAccount"
import { toastError, toastSuccess } from "@/infrastructure/appToast"
import Button from "@/shared/components/ui/Button.vue"

const router = useRouter()
const confirmText = ref("")
const currentPassword = ref("")
const working = ref(false)
const showForm = ref(false)

async function onDelete() {
    if (confirmText.value !== "APAGAR" && !currentPassword.value.trim()) {
        toastError("Escreve APAGAR ou a tua palavra-passe para confirmar.")
        return
    }
    working.value = true
    try {
        await deleteAccount({
            confirmText: confirmText.value === "APAGAR" ? "APAGAR" : undefined,
            currentPassword: currentPassword.value.trim() || undefined,
        })
        toastSuccess("Conta apagada com sucesso.")
        await router.replace(routePaths.home)
    } catch {
        toastError("Não foi possível apagar a conta.")
    } finally {
        working.value = false
    }
}
</script>

<template>
    <section class="rounded-lg border border-red-200 bg-red-50 p-4">
        <h3 class="text-sm font-semibold text-red-900">Apagar conta</h3>
        <p class="mt-2 text-sm leading-5 text-red-800">
            Esta acção é irreversível. Os teus dados serão anonimizados e não poderás voltar a iniciar sessão com esta
            conta.
        </p>
        <Button v-if="!showForm" class="mt-4" variant="secondary" @click="showForm = true">Apagar a minha conta</Button>
        <div v-else class="mt-4 flex max-w-md flex-col gap-3">
            <label class="text-sm">
                <span class="font-medium text-red-900">Escreve APAGAR para confirmar</span>
                <input
                    v-model="confirmText"
                    type="text"
                    class="mt-1 w-full rounded-md border border-red-200 px-3 py-2"
                    autocomplete="off"
                />
            </label>
            <label class="text-sm">
                <span class="font-medium text-red-900">Ou confirma com a palavra-passe</span>
                <input
                    v-model="currentPassword"
                    type="password"
                    class="mt-1 w-full rounded-md border border-red-200 px-3 py-2"
                    autocomplete="current-password"
                />
            </label>
            <div class="flex flex-wrap gap-2">
                <Button variant="secondary" :disabled="working" @click="showForm = false">Cancelar</Button>
                <Button :disabled="working" @click="onDelete">Confirmar apagamento</Button>
            </div>
        </div>
    </section>
</template>
