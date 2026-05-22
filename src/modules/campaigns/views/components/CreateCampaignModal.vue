<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { CampaignCreateDraft } from "@/modules/campaigns/types/list"
import type { BeachListItem } from "@/modules/beaches/types/list"
import { beachesListRef, loadBeachesList } from "@/modules/beaches/services/beachesList"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import Textarea from "@/shared/components/ui/Textarea.vue"
import { CAMPAIGN_STATUS_SELECT_OPTIONS } from "@/modules/campaigns/lib/campaignStatus"

const open = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    create: [payload: CampaignCreateDraft]
}>()

function close() {
    open.value = false
}

const step = ref<0 | 1>(0)
const title = ref<string>("")
const meetingTime = ref<string>("")
const startDate = ref<string>("")
const endDate = ref<string>("")
const status = ref<string | undefined>(undefined)
const information = ref<string>("")
const district = ref<string | undefined>(undefined)
const selectedBeachIds = ref<string[]>([])
const beachesLoading = ref(false)

const statusOptions = CAMPAIGN_STATUS_SELECT_OPTIONS

const districtOptions = DISTRICT_SELECT_OPTIONS

const districtLabel = computed(() => {
    const d = district.value
    if (!d) return ""
    return DISTRICT_SELECT_OPTIONS.find((o) => o.value === d)?.label ?? ""
})

const beachesForDistrict = computed((): BeachListItem[] => {
    const d = district.value
    if (!d) return []
    return beachesListRef.value
        .filter((b: BeachListItem) => b.district === d)
        .slice()
        .sort((a: BeachListItem, b: BeachListItem) => a.name.localeCompare(b.name, "pt"))
})

const canStep0Next = computed(() => {
    const t = title.value.trim()
    if (t.length === 0 || t.length > 200) return false
    if (information.value.length > 8000) return false
    if (meetingTime.value.trim().length === 0) return false
    if (startDate.value.trim().length === 0) return false
    if (!status.value) return false
    if (!district.value) return false
    return true
})

const canSubmitBeaches = computed(() => selectedBeachIds.value.length > 0)

async function goToBeachStep() {
    if (!canStep0Next.value) return
    beachesLoading.value = true
    try {
        await loadBeachesList({ page: 1, pageSize: 100 })
        step.value = 1
        selectedBeachIds.value = []
    } finally {
        beachesLoading.value = false
    }
}

function goBackToDetails() {
    step.value = 0
}

function onFinalSubmit() {
    if (!canSubmitBeaches.value || !district.value) return
    emit("create", {
        title: title.value,
        meetingTime: meetingTime.value,
        startDate: startDate.value,
        endDate: endDate.value,
        status: status.value!,
        information: information.value,
        district: district.value,
        beachIds: [...selectedBeachIds.value],
    })
    close()
}

async function handleFormSubmit() {
    if (step.value === 0) await goToBeachStep()
    else onFinalSubmit()
}

function resetForm() {
    step.value = 0
    title.value = ""
    meetingTime.value = ""
    startDate.value = ""
    endDate.value = ""
    status.value = undefined
    information.value = ""
    district.value = undefined
    selectedBeachIds.value = []
}

watch(open, (isOpen) => {
    if (isOpen) resetForm()
})
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="create-campaign-modal-title">
        <div class="flex items-start justify-between gap-4">
            <h3 id="create-campaign-modal-title" class="text-lg font-semibold leading-7 text-neutral-950">Criar Campanha</h3>
            <ModalCloseButton @click="close" />
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="handleFormSubmit">
            <div class="grid grid-cols-1">
                <div
                    class="col-start-1 row-start-1 flex h-full min-h-0 flex-col gap-3"
                    :class="step === 0 ? '' : 'invisible pointer-events-none'"
                    :inert="step !== 0"
                    :aria-hidden="step !== 0 ? true : undefined"
                >
                    <div class="flex flex-col gap-1">
                        <FieldLabel required for="create-campaign-title-input">Título</FieldLabel>
                        <Input id="create-campaign-title-input" v-model="title" class="w-full" placeholder="Onda de mudança" />
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div class="flex flex-col gap-1">
                            <FieldLabel required>Distrito</FieldLabel>
                            <Select v-model="district" class="w-full" :options="districtOptions" placeholder="Seleciona um distrito" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <FieldLabel required for="create-campaign-meeting-time">Hora de encontro</FieldLabel>
                            <Input
                                id="create-campaign-meeting-time"
                                v-model="meetingTime"
                                class="w-full"
                                type="time"
                                left-icon="clock"
                                placeholder="09:30"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div class="flex flex-col gap-1">
                            <FieldLabel required for="create-campaign-start-date">Data de início</FieldLabel>
                            <Input id="create-campaign-start-date" v-model="startDate" class="w-full" type="date" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <FieldLabel optional for="create-campaign-end-date">Data de fim</FieldLabel>
                            <Input id="create-campaign-end-date" v-model="endDate" class="w-full" type="date" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <FieldLabel required>Estado</FieldLabel>
                        <Select v-model="status" class="w-full" :options="statusOptions" placeholder="Estado da campanha" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <FieldLabel optional for="create-campaign-information">Informações</FieldLabel>
                        <Textarea
                            id="create-campaign-information"
                            v-model="information"
                            class="w-full"
                            placeholder="Ponto de encontro, o que levar (luvas, água...), duração prevista e notas importantes…"
                        />
                    </div>
                </div>

                <div
                    class="col-start-1 row-start-1 flex h-full min-h-0 flex-col gap-3"
                    :class="step === 1 ? '' : 'invisible pointer-events-none'"
                    :inert="step !== 1"
                    :aria-hidden="step !== 1 ? true : undefined"
                >
                    <p class="text-base font-semibold leading-7 text-neutral-950">{{ districtLabel }}</p>

                    <div class="h-64 shrink-0 overflow-y-auto">
                        <p v-if="beachesLoading" class="text-sm leading-5 text-neutral-600">A carregar praias…</p>

                        <div v-else-if="beachesForDistrict.length === 0" class="text-sm leading-5 text-neutral-600">
                            Não há praias registadas neste distrito. Adiciona praias no separador Praias e volta a tentar.
                        </div>

                        <ul v-else class="list-none space-y-1 p-0">
                            <li v-for="b in beachesForDistrict" :key="b.id">
                                <label class="flex cursor-pointer items-center gap-3 py-1.5">
                                    <input v-model="selectedBeachIds" type="checkbox" class="size-4 rounded border-neutral-300 text-blue-600" :value="b.id" />
                                    <span class="text-sm leading-5 text-neutral-950">{{ b.name }}</span>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1">
                <div
                    class="col-start-1 row-start-1 mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    :class="step === 0 ? '' : 'invisible pointer-events-none'"
                    :inert="step !== 0"
                    :aria-hidden="step !== 0 ? true : undefined"
                >
                    <nav class="flex min-w-0 justify-center sm:justify-start" aria-label="Passos da criação">
                        <div class="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-card">
                            <span class="h-2 w-6 shrink-0 rounded-full bg-blue-500" aria-current="step" />
                            <span class="size-2 shrink-0 rounded-full bg-neutral-200" aria-hidden="true" />
                        </div>
                    </nav>

                    <div class="flex shrink-0 items-center justify-end gap-2">
                        <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                        <Button type="submit" :disabled="!canStep0Next || beachesLoading">Próximo</Button>
                    </div>
                </div>

                <div
                    class="col-start-1 row-start-1 mt-2 flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    :class="step === 1 ? '' : 'invisible pointer-events-none'"
                    :inert="step !== 1"
                    :aria-hidden="step !== 1 ? true : undefined"
                >
                    <nav class="flex min-w-0 justify-center sm:justify-start" aria-label="Passos da criação">
                        <div class="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-card">
                            <span class="size-2 shrink-0 rounded-full bg-neutral-200" aria-hidden="true" />
                            <span class="h-2 w-6 shrink-0 rounded-full bg-blue-500" aria-current="step" />
                        </div>
                    </nav>

                    <div class="flex shrink-0 items-center justify-end gap-2">
                        <Button type="button" variant="secondary" @click="goBackToDetails">Voltar</Button>
                        <Button type="submit" :disabled="!canSubmitBeaches">Criar campanha</Button>
                    </div>
                </div>
            </div>
        </form>
    </ModalRoot>
</template>
