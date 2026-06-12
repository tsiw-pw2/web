<script setup lang="ts">
import { onMounted, ref } from "vue"
import { toastError, toastSuccess } from "@/infrastructure/appToast"
import {
    createOrganization,
    createOrganizationMember,
    deleteOrganizationMember,
    fetchOrganizationMembers,
    fetchOrganizations,
    type OrganizationListItem,
    type OrganizationMember,
} from "@/modules/settings/services/organizations"
import AddOrganizationMemberModal from "@/modules/settings/views/components/settings-organizations/AddOrganizationMemberModal.vue"
import CreateOrganizationModal from "@/modules/settings/views/components/settings-organizations/CreateOrganizationModal.vue"
import ResourceErrorState from "@/shared/components/states/ResourceErrorState.vue"
import Button from "@/shared/components/ui/Button.vue"

const loading = ref(false)
const error = ref(false)
const organizations = ref<OrganizationListItem[]>([])
const membersByOrg = ref<Record<string, OrganizationMember[]>>({})
const expandedOrgId = ref<string | null>(null)

const createOrgOpen = ref(false)
const addMemberOpen = ref(false)
const addMemberOrg = ref<OrganizationListItem | null>(null)
const workingMemberId = ref<string | null>(null)

async function loadOrganizations() {
    loading.value = true
    error.value = false
    try {
        organizations.value = await fetchOrganizations()
    } catch {
        organizations.value = []
        error.value = true
    } finally {
        loading.value = false
    }
}

async function loadMembers(orgId: string) {
    try {
        membersByOrg.value[orgId] = await fetchOrganizationMembers(orgId)
    } catch {
        toastError("Não foi possível carregar as contas da organização.")
    }
}

async function toggleMembers(org: OrganizationListItem) {
    if (expandedOrgId.value === org.id) {
        expandedOrgId.value = null
        return
    }
    expandedOrgId.value = org.id
    if (!membersByOrg.value[org.id]) {
        await loadMembers(org.id)
    }
}

async function onCreateOrganization(payload: Parameters<typeof createOrganization>[0]) {
    try {
        await createOrganization(payload)
        toastSuccess("Organização criada")
        await loadOrganizations()
    } catch {
        toastError("Não foi possível criar a organização.")
    }
}

function openAddMember(org: OrganizationListItem) {
    addMemberOrg.value = org
    addMemberOpen.value = true
}

async function onCreateMember(payload: Parameters<typeof createOrganizationMember>[1]) {
    const org = addMemberOrg.value
    if (!org) return
    try {
        await createOrganizationMember(org.id, payload)
        toastSuccess("Conta de organizador criada")
        await loadOrganizations()
        if (expandedOrgId.value === org.id) {
            await loadMembers(org.id)
        }
    } catch {
        toastError("Não foi possível criar a conta.")
    }
}

async function onRemoveMember(orgId: string, userId: string) {
    workingMemberId.value = userId
    try {
        await deleteOrganizationMember(orgId, userId)
        toastSuccess("Associação removida")
        await loadMembers(orgId)
        await loadOrganizations()
    } catch {
        toastError("Não foi possível remover a associação.")
    } finally {
        workingMemberId.value = null
    }
}

onMounted(() => {
    void loadOrganizations()
})
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-neutral-600">
                Cria organizações municipais e contas de organizador associadas.
            </p>
            <Button type="button" @click="createOrgOpen = true">Nova organização</Button>
        </div>

        <p v-if="loading" class="text-sm text-neutral-600">A carregar organizações…</p>

        <ResourceErrorState
            v-else-if="error"
            title="Não foi possível carregar as organizações"
            hint="Verifica a ligação e tenta outra vez."
            action-label="Tentar novamente"
            @retry="loadOrganizations"
        />

        <div v-else-if="organizations.length === 0" class="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
            Ainda não existem organizações registadas.
        </div>

        <div v-else class="flex flex-col gap-3">
            <article
                v-for="org in organizations"
                :key="org.id"
                class="rounded-lg border border-neutral-200 bg-white p-4"
            >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h3 class="font-semibold text-neutral-950">{{ org.name }}</h3>
                        <p class="mt-1 text-sm text-neutral-600">
                            {{ org.municipality }}
                            <span v-if="org.contactEmail"> · {{ org.contactEmail }}</span>
                        </p>
                        <p class="mt-1 text-xs text-neutral-500">{{ org.memberCount }} conta(s) associada(s)</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <Button type="button" variant="secondary" @click="toggleMembers(org)">
                            {{ expandedOrgId === org.id ? "Ocultar contas" : "Ver contas" }}
                        </Button>
                        <Button type="button" @click="openAddMember(org)">Adicionar conta</Button>
                    </div>
                </div>

                <div v-if="expandedOrgId === org.id" class="mt-4 border-t border-neutral-200 pt-4">
                    <p v-if="!membersByOrg[org.id]" class="text-sm text-neutral-600">A carregar contas…</p>
                    <p v-else-if="membersByOrg[org.id].length === 0" class="text-sm text-neutral-600">
                        Sem contas associadas.
                    </p>
                    <ul v-else class="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
                        <li
                            v-for="member in membersByOrg[org.id]"
                            :key="member.id"
                            class="flex flex-wrap items-center justify-between gap-3 px-3 py-2 text-sm"
                        >
                            <div>
                                <p class="font-medium text-neutral-950">{{ member.user?.name ?? "—" }}</p>
                                <p class="text-neutral-600">{{ member.user?.email ?? "—" }}</p>
                                <p class="mt-0.5 text-xs text-neutral-500">
                                    {{ member.isOrgAdmin ? "Admin da organização" : "Organizador" }}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                :disabled="workingMemberId === member.userId"
                                @click="onRemoveMember(org.id, member.userId)"
                            >
                                Remover
                            </Button>
                        </li>
                    </ul>
                </div>
            </article>
        </div>

        <CreateOrganizationModal v-model="createOrgOpen" @create="onCreateOrganization" />
        <AddOrganizationMemberModal
            v-model="addMemberOpen"
            :organization="addMemberOrg"
            @create="onCreateMember"
        />
    </div>
</template>
