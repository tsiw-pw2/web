<script setup lang="ts">
	import { computed, ref } from "vue"
	import { useSettingsUsers } from "@/modules/settings/composables/useSettingsUsers"
	import { userRoleLabel } from "@/modules/settings/lib/userRoleLabel"
	import BlockUserModal from "@/modules/settings/views/components/BlockUserModal.vue"
	import UnblockUserModal from "@/modules/settings/views/components/UnblockUserModal.vue"
	import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
	import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
	import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
	import Button from "@/shared/components/ui/Button.vue"
	import Input from "@/shared/components/ui/Input.vue"

	type SettingsTab = "users" | "profile"

	const activeTab = ref<SettingsTab>("users")

	const { users, blockUser, unblockUser } = useSettingsUsers()

	const profileName = ref("Maria Silva")
	const profileEmail = ref("maria@exemplo.org")
	const profilePhone = ref("")

	function saveProfile() {}

	function selectTab(tab: SettingsTab) {
		activeTab.value = tab
	}

	const isBlockModalOpen = ref(false)
	const isUnblockModalOpen = ref(false)
	const actionUserId = ref<string | null>(null)

	const actionUserDisplayName = computed(() => {
		if (!actionUserId.value) return undefined
		return users.value.find((u) => u.id === actionUserId.value)?.name
	})

	function openBlockModal(userId: string) {
		actionUserId.value = userId
		isBlockModalOpen.value = true
	}

	function openUnblockModal(userId: string) {
		actionUserId.value = userId
		isUnblockModalOpen.value = true
	}

	function onBlockConfirm(reason: string) {
		if (!actionUserId.value) return
		blockUser(actionUserId.value, reason)
		actionUserId.value = null
	}

	function onUnblockConfirm() {
		if (!actionUserId.value) return
		unblockUser(actionUserId.value)
		actionUserId.value = null
	}
</script>

<template>
	<div class="flex min-h-full flex-1 flex-col gap-6">
		<div>
			<h2 class="text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">Definições</h2>
			<p class="mt-1 text-sm leading-5 text-neutral-600">Gere utilizadores e o teu perfil.</p>
		</div>

		<div class="flex min-w-0 flex-col gap-6">
			<div
				role="tablist"
				aria-label="Secções de definições"
				class="-mx-1 flex min-w-0 gap-1 overflow-x-auto overflow-y-hidden border-b border-neutral-200 px-1 pb-px">
				<button
					id="settings-tab-users"
					type="button"
					role="tab"
					:aria-selected="activeTab === 'users'"
					aria-controls="settings-panel-users"
					:tabindex="activeTab === 'users' ? 0 : -1"
					class="relative shrink-0 -mb-px whitespace-nowrap px-4 pb-3 pt-1 text-sm font-medium outline-none transition-colors focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
					:class="
						activeTab === 'users'
							? 'text-neutral-950 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-500'
							: 'text-neutral-500 hover:text-neutral-800'
					"
					@click="selectTab('users')">
					Utilizadores
				</button>
				<button
					id="settings-tab-profile"
					type="button"
					role="tab"
					:aria-selected="activeTab === 'profile'"
					aria-controls="settings-panel-profile"
					:tabindex="activeTab === 'profile' ? 0 : -1"
					class="relative shrink-0 -mb-px whitespace-nowrap px-4 pb-3 pt-1 text-sm font-medium outline-none transition-colors focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
					:class="
						activeTab === 'profile'
							? 'text-neutral-950 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-500'
							: 'text-neutral-500 hover:text-neutral-800'
					"
					@click="selectTab('profile')">
					Perfil
				</button>
			</div>

			<div
				v-show="activeTab === 'users'"
				id="settings-panel-users"
				role="tabpanel"
				aria-labelledby="settings-tab-users"
				class="flex flex-col gap-4">
				<p class="text-sm leading-5 text-neutral-600">
					Cada utilizador pode ser administrador e/ou organizador de forma independente. Contas bloqueadas deixam de
					aceder à plataforma; ao bloquear, o motivo fica guardado no registo do utilizador.
				</p>
				<DataTableScrollWrap>
					<table class="w-full min-w-[920px] border-collapse text-left">
						<thead>
							<tr class="border-b border-neutral-200">
								<DataTableTh>Nome</DataTableTh>
								<DataTableTh>E-mail</DataTableTh>
								<DataTableTh>Perfil</DataTableTh>
								<DataTableTh>Estado</DataTableTh>
								<DataTableTh :padding-end="false" />
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="u in users"
								:key="u.id"
								class="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50">
								<DataTableTd emphasis>{{ u.name }}</DataTableTd>
								<DataTableTd>{{ u.email }}</DataTableTd>
								<DataTableTd>{{ userRoleLabel(u) }}</DataTableTd>
								<DataTableTd>
									<span
										v-if="u.isBlocked"
										class="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
										Bloqueado
									</span>
									<span
										v-else
										class="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
										Ativo
									</span>
								</DataTableTd>
								<DataTableTd :padding-end="false">
									<div class="flex flex-wrap items-center justify-end gap-2 pe-2">
										<button
											v-if="!u.isBlocked"
											type="button"
											class="rounded-md px-2 py-1 text-xs font-semibold text-red-600 outline-none hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-neutral-200"
											@click="openBlockModal(u.id)">
											Bloquear
										</button>
										<button
											v-else
											type="button"
											class="rounded-md px-2 py-1 text-xs font-semibold text-neutral-700 outline-none hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-neutral-200"
											@click="openUnblockModal(u.id)">
											Desbloquear
										</button>
									</div>
								</DataTableTd>
							</tr>
						</tbody>
					</table>
				</DataTableScrollWrap>
			</div>

			<div
				v-show="activeTab === 'profile'"
				id="settings-panel-profile"
				role="tabpanel"
				aria-labelledby="settings-tab-profile"
				class="flex flex-col gap-4">
				<p class="text-sm leading-5 text-neutral-600">Atualiza os dados da tua conta.</p>
				<form class="flex w-full max-w-lg flex-col gap-4" @submit.prevent="saveProfile">
					<div class="flex flex-col gap-1">
						<label class="text-xs font-semibold leading-4 text-neutral-900" for="profile-name">
							Nome
						</label>
						<Input id="profile-name" v-model="profileName" class="w-full" autocomplete="name" />
					</div>
					<div class="flex flex-col gap-1">
						<label class="text-xs font-semibold leading-4 text-neutral-900" for="profile-email">
							E-mail
						</label>
						<Input
							id="profile-email"
							v-model="profileEmail"
							class="w-full"
							type="email"
							autocomplete="email" />
					</div>
					<div class="flex flex-col gap-1">
						<label class="text-xs font-semibold leading-4 text-neutral-900" for="profile-phone">
							Telefone <span class="text-xs font-medium text-neutral-500">(opcional)</span>
						</label>
						<Input id="profile-phone" v-model="profilePhone" class="w-full" type="tel" autocomplete="tel" />
					</div>
					<div class="flex flex-col pt-2 sm:flex-row sm:justify-end">
						<Button type="submit" class="w-full touch-manipulation sm:w-auto">Guardar perfil</Button>
					</div>
				</form>
			</div>
		</div>
	</div>

	<BlockUserModal v-model="isBlockModalOpen" :user-display-name="actionUserDisplayName" @confirm="onBlockConfirm" />
	<UnblockUserModal v-model="isUnblockModalOpen" :user-display-name="actionUserDisplayName" @confirm="onUnblockConfirm" />
</template>
