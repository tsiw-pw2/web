<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { CampaignDetailsBeach } from "@/modules/campaigns/types/details"
import type { CreateCampaignWasteCollectionBody } from "@/modules/campaigns/services/campaignWasteCollections"
import type { WasteListItem } from "@/modules/waste/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { requestApiData } from "@/infrastructure/request"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import Select from "@/shared/components/ui/select/Select.vue"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    beaches: CampaignDetailsBeach[]
}>()

const emit = defineEmits<{
    create: [body: CreateCampaignWasteCollectionBody]
}>()

const beachId = ref<string | undefined>(undefined)
const wasteId = ref<string | undefined>(undefined)
const unitQuantity = ref("")
const actualWeightKg = ref("")
const wasteOptions = ref<{ value: string; label: string }[]>([])
const loadingWaste = ref(false)

const beachSelectOptions = computed(() =>
    props.beaches.map((b) => ({ value: b.id, label: b.name })),
)

const canProceed = computed(() => {
    const qty = Number(unitQuantity.value)
    if (!beachId.value || !wasteId.value) return false
    if (!Number.isFinite(qty) || qty < 1) return false
    const weightRaw = actualWeightKg.value.trim()
    if (weightRaw.length === 0) return true
    const weight = Number(weightRaw)
    return Number.isFinite(weight) && weight >= 0
})

function close() {
    open.value = false
}

function resetForm() {
    beachId.value = props.beaches.length === 1 ? props.beaches[0]?.id : undefined
    wasteId.value = undefined
    unitQuantity.value = ""
    actualWeightKg.value = ""
}

async function loadWasteOptions() {
    loadingWaste.value = true
    try {
        const data = await requestApiData<PaginatedResult<WasteListItem>>("/waste?page=1&pageSize=200", {
            method: "GET",
        })
        wasteOptions.value = data.items.map((w) => ({ value: w.id, label: w.name }))
    } catch {
        wasteOptions.value = []
    } finally {
        loadingWaste.value = false
    }
}

function onProceed() {
    if (!canProceed.value || !beachId.value || !wasteId.value) return
    const weightRaw = actualWeightKg.value.trim()
    const body: CreateCampaignWasteCollectionBody = {
        beachId: beachId.value,
        wasteId: wasteId.value,
        unitQuantity: Number(unitQuantity.value),
    }
    if (weightRaw.length > 0) {
        body.actualWeightKg = Number(weightRaw)
    }
    emit("create", body)
    close()
}

watch(open, (isOpen) => {
    if (!isOpen) return
    resetForm()
    void loadWasteOptions()
})

watch(
    () => props.beaches,
    () => {
        if (open.value) resetForm()
    },
)
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="create-waste-collection-title">
        <div class="flex items-start justify-between gap-4">
            <h3 id="create-waste-collection-title" class="text-lg font-semibold leading-7 text-neutral-950">
                Registar recolha
            </h3>
            <ModalCloseButton @click="close" />
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="onProceed">
            <div class="flex flex-col gap-1">
                <FieldLabel required>Praia</FieldLabel>
                <Select
                    v-model="beachId"
                    class="w-full"
                    :options="beachSelectOptions"
                    placeholder="Escolhe a praia"
                    :disabled="beachSelectOptions.length === 0"
                />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel required>Resíduo</FieldLabel>
                <Select
                    v-model="wasteId"
                    class="w-full"
                    :options="wasteOptions"
                    placeholder="Tipo de material"
                    :disabled="loadingWaste || wasteOptions.length === 0"
                />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel required for="create-waste-collection-qty">Quantidade</FieldLabel>
                <Input
                    id="create-waste-collection-qty"
                    v-model="unitQuantity"
                    type="number"
                    min="1"
                    step="1"
                    class="w-full"
                    placeholder="Unidades recolhidas"
                />
            </div>

            <div class="flex flex-col gap-1">
                <FieldLabel optional for="create-waste-collection-weight">Peso (kg)</FieldLabel>
                <Input
                    id="create-waste-collection-weight"
                    v-model="actualWeightKg"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full"
                    placeholder="Opcional"
                />
            </div>

            <div class="mt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" :disabled="!canProceed">Guardar</Button>
            </div>
        </form>
    </ModalRoot>
</template>
