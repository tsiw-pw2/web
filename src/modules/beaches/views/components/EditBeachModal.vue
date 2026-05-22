<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import { concelhoSelectOptionsForDistrict } from "@/shared/lib/concelhosByDistrict"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    beach?: BeachListItem | null
}>()

const emit = defineEmits<{
    save: [payload: BeachUpsertDraft]
}>()

function close() {
    open.value = false
}

const name = ref("")
const municipality = ref<string | undefined>(undefined)
const district = ref<string | undefined>(undefined)

const districtOptions = DISTRICT_SELECT_OPTIONS

const nameInputId = computed(() => `edit-beach-name-${props.beach?.id ?? ""}`)

const concelhoOptions = computed(() => concelhoSelectOptionsForDistrict(district.value))

function syncFromBeach() {
    const b = props.beach
    if (!b) return
    name.value = b.name
    district.value = b.district
    municipality.value = b.municipality
}

const canProceed = computed(() => {
    if (name.value.trim().length === 0) return false
    if (!municipality.value) return false
    if (!district.value) return false
    return true
})

function onProceed() {
    const n = name.value.trim()
    const m = municipality.value
    const d = district.value
    if (!n || !m || !d) return
    emit("save", { name: n, municipality: m, district: d })
    close()
}

watch(
    () => [open.value, props.beach] as const,
    ([isOpen]) => {
        if (isOpen) syncFromBeach()
    },
    { immediate: true },
)

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
</script>

<template>
     <ModalRoot v-model="open" ariaLabelledby="edit-beach-title"
        >
        <div class="flex items-start justify-between gap-4">

            <h3 id="edit-beach-title" class="text-lg font-semibold leading-7 text-neutral-950"> Editar Praia </h3>
             <ModalCloseButton @click="close" />
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="onProceed">

            <div class="flex flex-col gap-1"> <FieldLabel required :for="nameInputId">Nome</FieldLabel> <Input :id="nameInputId" v-model="name" class="w-full" placeholder="Nome da praia" /> </div>

            <div class="flex flex-col gap-1">
                 <FieldLabel required>Distrito</FieldLabel> <Select v-model="district" class="w-full" :options="districtOptions" placeholder="Seleciona um distrito" />
            </div>

            <div class="flex flex-col gap-1">
                 <FieldLabel required>Concelho</FieldLabel> <Select v-model="municipality" class="w-full" :options="concelhoOptions" placeholder="Seleciona um concelho" :disabled="!district" />
            </div>

            <div class="mt-2 flex items-center justify-end gap-2">
                 <Button type="button" variant="secondary" @click="close">Cancelar</Button> <Button type="submit" :disabled="!canProceed">Guardar alterações</Button>
            </div>

        </form>
         </ModalRoot
    >
</template>

