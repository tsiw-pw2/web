<script setup lang="ts">
import { ref, watch } from "vue"
import { useAuth } from "../composables/useAuth"
import DashboardPanelCard from "../components/domain/dashboard/DashboardPanelCard.vue"
import FieldLabel from "../components/ui/form/FieldLabel.vue"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { patchMeApi } from "../services/users.api"
import { ApiRequestError } from "../services/http"

const { profile, isAuthenticated, loadProfile } = useAuth()

const nome = ref("")
const telefone = ref("")
const dataNascimento = ref("")
const currentPassword = ref("")
const newPassword = ref("")

const saving = ref(false)
const profileError = ref<string | null>(null)
const profileSuccess = ref(false)

function fillFromProfile() {
    const p = profile.value
    if (!p) return
    nome.value = p.nome
    telefone.value = p.telefone ?? ""
    dataNascimento.value = p.data_nascimento ?? ""
}

watch(profile, fillFromProfile, { immediate: true })

async function saveProfile() {
    profileError.value = null
    profileSuccess.value = false
    const n = nome.value.trim()
    if (!n) {
        profileError.value = "O nome é obrigatório."
        return
    }
    saving.value = true
    try {
        const body: Record<string, unknown> = {
            nome: n,
            telefone: telefone.value.trim() || null,
            data_nascimento: dataNascimento.value.trim() || null,
        }
        const np = newPassword.value
        if (np) {
            body.current_password = currentPassword.value
            body.password = np
        }
        await patchMeApi(body)
        await loadProfile()
        currentPassword.value = ""
        newPassword.value = ""
        profileSuccess.value = true
    } catch (e) {
        profileError.value = e instanceof ApiRequestError ? e.message : "Não foi possível guardar o perfil."
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col gap-6">
        <div>
            <h2 class="text-2xl font-semibold leading-8 text-neutral-950">Definições</h2>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:gap-6">
            <DashboardPanelCard v-if="!isAuthenticated" title="Conta">
                <p class="text-sm font-medium leading-5 text-neutral-600">
                    Inicia sessão para atualizares o teu nome, contactos ou palavra-passe.
                </p>
            </DashboardPanelCard>

            <DashboardPanelCard v-else title="Perfil">
                <div v-if="!profile" class="text-sm text-neutral-500">A carregar perfil…</div>
                <form v-else class="space-y-4" @submit.prevent="saveProfile">
                    <p class="text-sm font-medium leading-5 text-neutral-600">
                        Email: <span class="text-neutral-950">{{ profile.email }}</span>
                        <span class="block pt-1 text-xs text-neutral-500">O email não pode ser alterado neste ecrã.</span>
                    </p>
                    <div>
                        <FieldLabel for-id="me-nome" label="Nome" required />
                        <Input id="me-nome" v-model="nome" type="text" required />
                    </div>
                    <div>
                        <FieldLabel for-id="me-tel" label="Telefone" optional />
                        <Input id="me-tel" v-model="telefone" type="text" autocomplete="tel" />
                    </div>
                    <div>
                        <FieldLabel for-id="me-dob" label="Data de nascimento" optional />
                        <Input id="me-dob" v-model="dataNascimento" type="date" />
                    </div>
                    <div class="border-t border-neutral-100 pt-4">
                        <p class="text-sm font-medium text-neutral-950">Alterar palavra-passe</p>
                        <p class="mt-1 text-xs text-neutral-500">Opcional. A nova palavra-passe deve ter pelo menos 10 caracteres.</p>
                        <div class="mt-3 space-y-3">
                            <div>
                                <FieldLabel for-id="me-cur-pw" label="Palavra-passe atual" optional />
                                <Input id="me-cur-pw" v-model="currentPassword" type="password" autocomplete="current-password" />
                            </div>
                            <div>
                                <FieldLabel for-id="me-new-pw" label="Nova palavra-passe" optional />
                                <Input id="me-new-pw" v-model="newPassword" type="password" autocomplete="new-password" />
                            </div>
                        </div>
                    </div>
                    <p v-if="profileError" class="text-sm text-red-600">{{ profileError }}</p>
                    <p v-if="profileSuccess" class="text-sm text-neutral-700">Perfil atualizado com sucesso.</p>
                    <Button type="submit" :disabled="saving">{{ saving ? "A guardar…" : "Guardar perfil" }}</Button>
                </form>
            </DashboardPanelCard>

            <DashboardPanelCard title="Privacidade e dados">
                <p class="text-sm font-medium leading-5 text-neutral-600">
                    Os dados sobre campanhas, praias e recolhas servem para coordenar voluntários e demonstrar o impacto das
                    limpezas no ambiente costeiro. Usa sempre informação verdadeira e respeita as regras da tua organização.
                </p>
            </DashboardPanelCard>
        </div>
    </div>
</template>
