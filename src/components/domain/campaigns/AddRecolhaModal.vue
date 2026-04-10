<script setup lang="ts">
import { ref, watch, computed } from "vue"
import Modal from "../../ui/Modal.vue"
import FieldLabel from "../../ui/form/FieldLabel.vue"
import { Input } from "../../ui/input"
import { Select } from "../../ui/select"
import { Button } from "../../ui/button"
import { useBeaches } from "../../../composables/useBeaches"
import { useResiduos } from "../../../composables/useResiduos"

const props = defineProps<{
    campaignId: string
    allowedBeachIds: string[]
}>()

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    save: [payload: { beachId: string; residuoId: string; quantidadeUnidades: number; pesoRealKg: number | null }]
}>()

const { beaches } = useBeaches()
const { residuos } = useResiduos()

const beachId = ref("")
const residuoId = ref("")
const qtyStr = ref("1")
const kgStr = ref("")

const beachChoices = computed(() => beaches.value.filter((b) => props.allowedBeachIds.includes(b.id)))

watch(isOpen, (open) => {
    if (!open) return
    beachId.value = beachChoices.value[0]?.id ?? ""
    residuoId.value = residuos.value[0]?.id ?? ""
    qtyStr.value = "1"
    kgStr.value = ""
})

function close() {
    isOpen.value = false
}

function onSubmit() {
    const q = Math.max(1, Math.floor(Number.parseInt(qtyStr.value, 10) || 0))
    const kgRaw = kgStr.value.trim()
    const pesoRealKg = kgRaw === "" ? null : Number.parseFloat(kgRaw.replace(",", "."))
    if (!beachId.value || !residuoId.value || Number.isNaN(q)) return
    if (pesoRealKg != null && Number.isNaN(pesoRealKg)) return
    emit("save", {
        beachId: beachId.value,
        residuoId: residuoId.value,
        quantidadeUnidades: q,
        pesoRealKg,
    })
    close()
}
</script>

<template>
    <Modal v-model="isOpen" title="Registar o que foi recolhido" max-width-class="max-w-lg">
        <form id="rec-form" class="space-y-3" @submit.prevent="onSubmit">
            <div>
                <FieldLabel for-id="rec-praia" label="Praia" required />
                <Select id="rec-praia" v-model="beachId" required>
                    <option value="" disabled>Seleciona a praia</option>
                    <option v-for="b in beachChoices" :key="b.id" :value="b.id">{{ b.name }}</option>
                </Select>
            </div>
            <div>
                <FieldLabel for-id="rec-res" label="Resíduo" required />
                <Select id="rec-res" v-model="residuoId" required>
                    <option value="" disabled>Seleciona o resíduo</option>
                    <option v-for="r in residuos" :key="r.id" :value="r.id">{{ r.nome }}</option>
                </Select>
            </div>
            <div>
                <FieldLabel for-id="rec-qty" label="Quantidade (unidades)" required />
                <Input id="rec-qty" v-model="qtyStr" type="number" min="1" required inputmode="numeric" />
            </div>
            <div>
                <FieldLabel for-id="rec-kg" label="Peso real (kg)" optional />
                <Input id="rec-kg" v-model="kgStr" type="text" inputmode="decimal" />
            </div>
        </form>
        <template #footer>
            <div class="flex w-full items-center justify-end gap-3">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" form="rec-form">Guardar</Button>
            </div>
        </template>
    </Modal>
</template>
