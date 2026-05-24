<script setup lang="ts">
import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import type { CampaignDetails } from "@/modules/campaigns/types/details"
import { computed, ref, watch } from "vue"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import { toastError } from "@/infrastructure/appToast"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import SearchableSelect from "@/shared/components/ui/searchable-select/SearchableSelect.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import Textarea from "@/shared/components/ui/Textarea.vue"
import { toDateInputValueFromUnknown } from "@/shared/lib/dateInputValue"
import { CAMPAIGN_STATUS_SELECT_OPTIONS } from "@/modules/campaigns/lib/campaignStatus"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    campaign?: CampaignListItem | null
}>()

const emit = defineEmits<{
    save: [payload: CampaignCreateDraft]
}>()

function close() {
    open.value = false
}

const title = ref<string>("")
const meetingTime = ref<string>("")
const startDate = ref<string>("")
const endDate = ref<string>("")
const status = ref<string | undefined>(undefined)
const information = ref<string>("")
const detailsLoading = ref(false)
const district = ref<string | undefined>(undefined)

const statusOptions = CAMPAIGN_STATUS_SELECT_OPTIONS

const districtOptions = DISTRICT_SELECT_OPTIONS

function applyDetails(d: CampaignDetails) {
    title.value = d.title
    meetingTime.value = d.meetingTime?.trim() ?? ""
    startDate.value = toDateInputValueFromUnknown(d.startDate)
    endDate.value = toDateInputValueFromUnknown(d.endDate)
    status.value = d.editStatus
    information.value = d.description?.trim() ?? ""
    district.value = d.districtCode ?? undefined
}

async function loadDetailsForEdit(campaignId: string) {
    detailsLoading.value = true
    try {
        const d = await getCampaignDetails(campaignId)
        if (!open.value || props.campaign?.id !== campaignId) return
        applyDetails(d)
    } catch {
        if (open.value) {
            toastError("Não foi possível carregar", "Não foi possível obter os dados da campanha para editar.")
            close()
        }
    } finally {
        detailsLoading.value = false
    }
}

const canProceed = computed(() => {
    const t = title.value.trim()
    if (t.length === 0 || t.length > 200) return false
    if (information.value.length > 8000) return false
    if (meetingTime.value.trim().length === 0) return false
    if (startDate.value.trim().length === 0) return false
    if (!status.value) return false
    if (!district.value) return false
    return true
})

function onProceed() {
    emit("save", {
        title: title.value,
        meetingTime: meetingTime.value,
        startDate: startDate.value,
        endDate: endDate.value,
        status: status.value!,
        information: information.value,
        district: district.value,
    })
    close()
}

watch(
    () => [open.value, props.campaign?.id ?? null] as const,
    async ([isOpen, id]) => {
        if (!isOpen || !id) return
        await loadDetailsForEdit(id)
    },
)
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="edit-campaign-title">
        <div class="flex items-start justify-between gap-4">
            <h3 id="edit-campaign-title" class="text-lg font-semibold leading-7 text-neutral-950">Editar campanha</h3>
            <ModalCloseButton @click="close" />
        </div>

        <p v-if="detailsLoading" class="text-sm leading-5 text-neutral-600">A carregar dados da campanha…</p>

        <form v-else class="flex flex-col gap-3" @submit.prevent="onProceed">
            <div class="flex flex-col gap-1">
                <FieldLabel required for="edit-campaign-title">Título</FieldLabel>
                <Input id="edit-campaign-title" v-model="title" class="w-full" placeholder="Onda de mudança" />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="flex flex-col gap-1">
                    <FieldLabel required>Distrito</FieldLabel>
                    <SearchableSelect
                        v-model="district"
                        class="w-full"
                        :options="districtOptions"
                        placeholder="Seleciona um distrito"
                    />
                </div>

                <div class="flex flex-col gap-1">
                    <FieldLabel required for="edit-campaign-meeting-time">Hora de encontro</FieldLabel>
                    <Input
                        id="edit-campaign-meeting-time"
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
                    <FieldLabel required for="edit-campaign-start-date">Data de início</FieldLabel>
                    <Input id="edit-campaign-start-date" v-model="startDate" class="w-full" type="date" />
                </div>

                <div class="flex flex-col gap-1">
                    <FieldLabel optional for="edit-campaign-end-date">Data de fim</FieldLabel>
                    <Input id="edit-campaign-end-date" v-model="endDate" class="w-full" type="date" />
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel required>Estado</FieldLabel>
                <Select v-model="status" class="w-full" :options="statusOptions" placeholder="Estado da campanha" />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel optional for="edit-campaign-information">Informações</FieldLabel>
                <Textarea
                    id="edit-campaign-information"
                    v-model="information"
                    class="w-full"
                    placeholder="Ponto de encontro, o que levar (luvas, água...), duração prevista e notas importantes…"
                />
            </div>

            <div class="mt-2 flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 pt-4">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" :disabled="!canProceed || detailsLoading">Guardar</Button>
            </div>
        </form>
    </ModalRoot>
</template>
