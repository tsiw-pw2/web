<script setup lang="ts">
import { ref, watch, computed } from "vue"
import type { Beach, BeachFormValues } from "../../../types/domain"
import Modal from "../../ui/Modal.vue"
import FieldLabel from "../../ui/form/FieldLabel.vue"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Button } from "../../ui/button"
import { useBeaches } from "../../../composables/useBeaches"
import { Select } from "../../ui/select"
import {
    geoApiPtListDistritos,
    geoApiPtListMunicipios,
    geoApiPtListFreguesias,
    geoApiPtNutsCodeForFreguesia,
} from "../../../services/geoapiPt"

const props = withDefaults(
    defineProps<{
        beach?: Beach | null
    }>(),
    { beach: null },
)

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    save: [values: BeachFormValues]
}>()

const { beachToFormValues } = useBeaches()

const distrito = ref("")
const concelho = ref("")
const freguesia = ref("")
const codigoNuts = ref("")
const name = ref("")
const latitudeStr = ref("")
const longitudeStr = ref("")
const description = ref("")

const distritos = ref<string[]>([])
const municipios = ref<string[]>([])
const freguesias = ref<string[]>([])
const loadingDistritos = ref(false)
const loadingMunicipios = ref(false)
const loadingFreguesias = ref(false)
const loadingNuts = ref(false)

const titleText = computed(() => (props.beach ? "Editar praia" : "Registar praia"))

function resetForm() {
    distrito.value = ""
    concelho.value = ""
    freguesia.value = ""
    codigoNuts.value = ""
    name.value = ""
    latitudeStr.value = ""
    longitudeStr.value = ""
    description.value = ""
    municipios.value = []
    freguesias.value = []
}

function fillFromBeach(b: Beach) {
    const v = beachToFormValues(b)
    if (!v) {
        resetForm()
        return
    }
    distrito.value = v.distrito
    concelho.value = v.concelho
    freguesia.value = v.freguesia
    codigoNuts.value = v.codigoNuts
    name.value = v.name
    latitudeStr.value = String(v.latitude)
    longitudeStr.value = String(v.longitude)
    description.value = v.description
}

watch(
    [isOpen, () => props.beach],
    ([open, b]) => {
        if (!open) return
        if (b) fillFromBeach(b)
        else resetForm()
    },
    { flush: "post" },
)

function close() {
    isOpen.value = false
}

async function loadDistritos() {
    if (loadingDistritos.value) return
    loadingDistritos.value = true
    try {
        distritos.value = await geoApiPtListDistritos()
    } catch (e) {
        alert(e instanceof Error ? e.message : "Não foi possível carregar.")
    } finally {
        loadingDistritos.value = false
    }
}

async function onDistritoChange() {
    concelho.value = ""
    freguesia.value = ""
    codigoNuts.value = ""
    municipios.value = []
    freguesias.value = []
    const d = distrito.value.trim()
    if (!d || loadingMunicipios.value) return
    loadingMunicipios.value = true
    try {
        municipios.value = await geoApiPtListMunicipios(d)
    } catch (e) {
        alert(e instanceof Error ? e.message : "Não foi possível carregar.")
    } finally {
        loadingMunicipios.value = false
    }
}

async function onConcelhoChange() {
    freguesia.value = ""
    codigoNuts.value = ""
    freguesias.value = []
    const c = concelho.value.trim()
    if (!c || loadingFreguesias.value) return
    loadingFreguesias.value = true
    try {
        freguesias.value = await geoApiPtListFreguesias(c)
    } catch (e) {
        alert(e instanceof Error ? e.message : "Não foi possível carregar.")
    } finally {
        loadingFreguesias.value = false
    }
}

async function onFreguesiaChange() {
    codigoNuts.value = ""
    const c = concelho.value.trim()
    const f = freguesia.value.trim()
    if (!c || !f || loadingNuts.value) return
    loadingNuts.value = true
    try {
        codigoNuts.value = await geoApiPtNutsCodeForFreguesia(c, f)
    } catch (e) {
        alert(e instanceof Error ? e.message : "Não foi possível preencher.")
    } finally {
        loadingNuts.value = false
    }
}

watch(isOpen, (open) => {
    if (!open) return
    void loadDistritos()
})

watch(
    () => distrito.value,
    () => void onDistritoChange(),
)

watch(
    () => concelho.value,
    () => void onConcelhoChange(),
)

watch(
    () => freguesia.value,
    () => void onFreguesiaChange(),
)

function onSubmit() {
    const lat = Number.parseFloat(latitudeStr.value.replace(",", "."))
    const lng = Number.parseFloat(longitudeStr.value.replace(",", "."))
    if (
        !name.value.trim() ||
        !distrito.value.trim() ||
        !concelho.value.trim() ||
        !freguesia.value.trim() ||
        !codigoNuts.value.trim() ||
        Number.isNaN(lat) ||
        Number.isNaN(lng)
    ) {
        return
    }
    emit("save", {
        distrito: distrito.value.trim(),
        concelho: concelho.value.trim(),
        freguesia: freguesia.value.trim(),
        codigoNuts: codigoNuts.value.trim().slice(0, 5),
        name: name.value.trim(),
        latitude: lat,
        longitude: lng,
        description: description.value.trim(),
    })
    close()
}
</script>

<template>
    <Modal v-model="isOpen" :title="titleText" max-width-class="max-w-lg">
        <form id="beach-form" class="space-y-3" @submit.prevent="onSubmit">
            <div>
                <FieldLabel for-id="beach-name" label="Nome da praia" required />
                <Input id="beach-name" v-model="name" type="text" required placeholder="Ex.: Praia da Aguda" />
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <FieldLabel for-id="beach-distrito" label="Distrito" required />
                    <Select id="beach-distrito" v-model="distrito" required :disabled="loadingDistritos">
                        <option value="" disabled>{{ loadingDistritos ? "A carregar…" : "Seleciona" }}</option>
                        <option v-for="d in distritos" :key="d" :value="d">{{ d }}</option>
                    </Select>
                </div>
                <div>
                    <FieldLabel for-id="beach-concelho" label="Concelho" required />
                    <Select id="beach-concelho" v-model="concelho" required :disabled="!distrito || loadingMunicipios">
                        <option value="" disabled>{{ loadingMunicipios ? "A carregar…" : "Seleciona" }}</option>
                        <option v-for="m in municipios" :key="m" :value="m">{{ m }}</option>
                    </Select>
                </div>
                <div>
                    <FieldLabel for-id="beach-freguesia" label="Freguesia" required />
                    <Select id="beach-freguesia" v-model="freguesia" required :disabled="!concelho || loadingFreguesias">
                        <option value="" disabled>{{ loadingFreguesias ? "A carregar…" : "Seleciona" }}</option>
                        <option v-for="f in freguesias" :key="f" :value="f">{{ f }}</option>
                    </Select>
                </div>
                <div>
                    <FieldLabel for-id="beach-nuts" label="Código NUTS (5 caracteres)" required />
                    <Input
                        id="beach-nuts"
                        v-model="codigoNuts"
                        type="text"
                        required
                        maxlength="5"
                        :readonly="loadingNuts || Boolean(freguesia)"
                    />
                </div>
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <FieldLabel for-id="beach-lat" label="Latitude" required />
                    <Input id="beach-lat" v-model="latitudeStr" type="text" required inputmode="decimal" />
                </div>
                <div>
                    <FieldLabel for-id="beach-lng" label="Longitude" required />
                    <Input id="beach-lng" v-model="longitudeStr" type="text" required inputmode="decimal" />
                </div>
            </div>
            <div>
                <FieldLabel for-id="beach-desc" label="Descrição" optional />
                <Textarea id="beach-desc" v-model="description" rows="4" placeholder="Acesso, estacionamento…" />
            </div>
        </form>
        <template #footer>
            <div class="flex w-full items-center justify-end gap-3">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" form="beach-form">{{ beach ? "Guardar" : "Registar" }}</Button>
            </div>
        </template>
    </Modal>
</template>
