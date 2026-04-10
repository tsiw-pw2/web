<script setup lang="ts">
import { ref, watch, computed } from "vue"
import type { Campaign, CampaignDraft, CampanhaEstado } from "../../../types/domain"
import { campanhaEstadoLabel } from "../../../types/domain"
import Modal from "../../ui/Modal.vue"
import FieldLabel from "../../ui/form/FieldLabel.vue"
import { Input } from "../../ui/input"
import { Select } from "../../ui/select"
import { Textarea } from "../../ui/textarea"
import { Button } from "../../ui/button"
import { useBeaches } from "../../../composables/useBeaches"

const props = withDefaults(
    defineProps<{
        campaign?: Campaign | null
    }>(),
    { campaign: null },
)

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    save: [draft: CampaignDraft]
}>()

const { beaches } = useBeaches()

const title = ref("")
const description = ref("")
const meetingLocation = ref("")
const meetingTime = ref("")
const startDate = ref("")
const endDate = ref("")
const estado = ref<string>("")
const selectedBeachIds = ref<string[]>([])

function resetForm() {
    title.value = ""
    description.value = ""
    meetingLocation.value = ""
    meetingTime.value = ""
    startDate.value = ""
    endDate.value = ""
    estado.value = ""
    selectedBeachIds.value = []
}

function fillFromCampaign(c: Campaign) {
    title.value = c.title
    description.value = c.description
    meetingLocation.value = c.meetingLocation
    meetingTime.value = c.meetingTime ?? ""
    startDate.value = c.startDate
    endDate.value = c.endDate
    estado.value = String(c.estado)
    selectedBeachIds.value = [...c.beachIds]
}

watch(
    [isOpen, () => props.campaign],
    ([open, c]) => {
        if (!open) return
        if (c) fillFromCampaign(c)
        else resetForm()
    },
    { flush: "post" },
)

function close() {
    isOpen.value = false
}

const titleText = computed(() => (props.campaign ? "Editar campanha" : "Criar campanha"))

const estadoOptions = computed(() =>
    ([0, 1, 2, 3, 4, 5] as CampanhaEstado[]).map((v) => ({
        value: String(v),
        label: campanhaEstadoLabel[v],
    })),
)

function toggleBeach(id: string) {
    const set = new Set(selectedBeachIds.value)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    selectedBeachIds.value = [...set]
}

function onSubmit() {
    if (
        !title.value.trim() ||
        !meetingLocation.value.trim() ||
        !startDate.value ||
        !endDate.value ||
        estado.value === ""
    ) {
        return
    }
    emit("save", {
        title: title.value.trim(),
        description: description.value.trim(),
        meetingLocation: meetingLocation.value.trim(),
        meetingTime: meetingTime.value.trim() || null,
        startDate: startDate.value,
        endDate: endDate.value,
        estado: Number(estado.value) as CampanhaEstado,
        organizerId: props.campaign?.organizerId ?? "",
        beachIds: [...selectedBeachIds.value],
    })
    close()
}
</script>

<template>
    <Modal v-model="isOpen" :title="titleText" max-width-class="max-w-3xl">
        <form id="campaign-form" class="space-y-3" @submit.prevent="onSubmit">
            <div>
                <FieldLabel for-id="title" label="Título" required />
                <Input id="title" v-model="title" type="text" placeholder="Onda de mudança" required />
            </div>

            <div>
                <FieldLabel for-id="meetingLocation" label="Local de encontro" required />
                <Input
                    id="meetingLocation"
                    v-model="meetingLocation"
                    type="text"
                    required
                    placeholder="Ex.: Estacionamento norte da praia"
                />
            </div>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                    <FieldLabel for-id="meetingTime" label="Hora de encontro" optional />
                    <Input id="meetingTime" v-model="meetingTime" type="time" />
                </div>
                <div>
                    <FieldLabel for-id="estado" label="Estado" required />
                    <Select id="estado" v-model="estado" required>
                        <option value="" disabled>Estado da campanha</option>
                        <option v-for="o in estadoOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
                    </Select>
                </div>
                <div>
                    <FieldLabel for-id="startDate" label="Data de início" required />
                    <Input id="startDate" v-model="startDate" type="date" required />
                </div>
                <div>
                    <FieldLabel for-id="endDate" label="Data de fim" required />
                    <Input id="endDate" v-model="endDate" type="date" required />
                </div>
            </div>

            <div>
                <FieldLabel for-id="beaches" label="Praias incluídas nesta campanha" />
                <div
                    class="mt-1 max-h-36 space-y-2 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
                >
                    <p v-if="beaches.length === 0" class="text-sm font-medium text-neutral-600">Sem praias. Regista-as em Praias.</p>
                    <label
                        v-for="b in beaches"
                        v-else
                        :key="b.id"
                        class="flex cursor-pointer items-center gap-2 text-sm font-medium leading-5 text-neutral-900"
                    >
                        <input
                            type="checkbox"
                            class="size-4 rounded border-neutral-300"
                            :checked="selectedBeachIds.includes(b.id)"
                            @change="toggleBeach(b.id)"
                        />
                        {{ b.name }}
                    </label>
                </div>
            </div>

            <div>
                <FieldLabel for-id="description" label="Descrição" optional />
                <Textarea
                    id="description"
                    v-model="description"
                    rows="5"
                    placeholder="Informações gerais, o que levar, duração prevista…"
                />
            </div>
        </form>
        <template #footer>
            <div class="flex w-full items-center justify-end gap-3">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" form="campaign-form">{{ campaign ? "Guardar" : "Criar campanha" }}</Button>
            </div>
        </template>
    </Modal>
</template>
