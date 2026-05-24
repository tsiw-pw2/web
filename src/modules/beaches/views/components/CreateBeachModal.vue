<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { BeachUpsertDraft } from "@/modules/beaches/types/list"
import { areBeachCoordinatesValid, beachCoordinateToApiString } from "@/modules/beaches/lib/beachCoordinates"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import { concelhoSelectOptionsForDistrict } from "@/shared/lib/concelhosByDistrict"

const open = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    create: [payload: BeachUpsertDraft]
}>()

function close() {
    open.value = false
}

const name = ref("")
const municipality = ref<string | undefined>(undefined)
const district = ref<string | undefined>(undefined)
const latitude = ref("")
const longitude = ref("")

const districtOptions = DISTRICT_SELECT_OPTIONS

const concelhoOptions = computed(() => concelhoSelectOptionsForDistrict(district.value))

const canProceed = computed(() => {
    if (name.value.trim().length === 0) return false
    if (!municipality.value) return false
    if (!district.value) return false
    if (!areBeachCoordinatesValid(latitude.value, longitude.value)) return false
    return true
})

function resetForm() {
    name.value = ""
    municipality.value = undefined
    district.value = undefined
    latitude.value = ""
    longitude.value = ""
}

function onProceed() {
    const n = name.value.trim()
    const m = municipality.value
    const d = district.value
    const lat = latitude.value
    const lng = longitude.value
    if (!n || !m || !d || !areBeachCoordinatesValid(lat, lng)) return
    emit("create", {
        name: n,
        municipality: m,
        district: d,
        latitude: beachCoordinateToApiString(lat),
        longitude: beachCoordinateToApiString(lng),
    })
    close()
}

watch(
    district,
    (next, prev) => {
        if (!open.value) return
        if (prev !== undefined && next !== prev) {
            municipality.value = undefined
        }
    },
    { flush: "sync" },
)

watch(open, (isOpen) => {
    if (isOpen) resetForm()
})
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="create-beach-title">
        <div class="flex items-start justify-between gap-4">
            <h3 id="create-beach-title" class="text-lg font-semibold leading-7 text-neutral-950">Registar Praia</h3>
            <ModalCloseButton @click="close" />
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="onProceed">
            <div class="flex flex-col gap-1">
                <FieldLabel required>Nome</FieldLabel>
                <Input v-model="name" class="w-full" placeholder="Nome da praia" />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel required>Distrito</FieldLabel>
                <Select v-model="district" class="w-full" :options="districtOptions" placeholder="Seleciona um distrito" />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel required>Concelho</FieldLabel>
                <Select
                    v-model="municipality"
                    class="w-full"
                    :options="concelhoOptions"
                    placeholder="Seleciona um concelho"
                    :disabled="!district"
                />
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="flex flex-col gap-1">
                    <FieldLabel required for="create-beach-latitude">Latitude</FieldLabel>
                    <Input
                        id="create-beach-latitude"
                        v-model="latitude"
                        type="text"
                        inputmode="decimal"
                        class="w-full"
                        placeholder="ex.: 38.722300"
                    />
                </div>
                <div class="flex flex-col gap-1">
                    <FieldLabel required for="create-beach-longitude">Longitude</FieldLabel>
                    <Input
                        id="create-beach-longitude"
                        v-model="longitude"
                        type="text"
                        inputmode="decimal"
                        class="w-full"
                        placeholder="ex.: -9.139300"
                    />
                </div>
            </div>

            <div class="mt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" :disabled="!canProceed">Guardar</Button>
            </div>
        </form>
    </ModalRoot>
</template>
