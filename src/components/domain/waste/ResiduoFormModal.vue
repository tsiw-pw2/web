<script setup lang="ts">
import { ref, watch, computed } from "vue"
import type { Residuo, ResiduoDraft, TipoResiduo } from "../../../types/domain"
import Modal from "../../ui/Modal.vue"
import FieldLabel from "../../ui/form/FieldLabel.vue"
import { Input } from "../../ui/input"
import { Select } from "../../ui/select"
import { Button } from "../../ui/button"

const props = withDefaults(
    defineProps<{
        residuo?: Residuo | null
        tipos: TipoResiduo[]
    }>(),
    { residuo: null },
)

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    save: [draft: ResiduoDraft]
}>()

const tipoResiduoId = ref("")
const nome = ref("")
const pesoMedioStr = ref("")

const titleText = computed(() => (props.residuo ? "Editar item" : "Novo item no catálogo"))

function resetForm() {
    tipoResiduoId.value = ""
    nome.value = ""
    pesoMedioStr.value = ""
}

function fillFromResiduo(r: Residuo) {
    tipoResiduoId.value = r.tipoResiduoId
    nome.value = r.nome
    pesoMedioStr.value = r.pesoMedioGramas != null ? String(r.pesoMedioGramas) : ""
}

watch(
    [isOpen, () => props.residuo],
    ([open, r]) => {
        if (!open) return
        if (r) fillFromResiduo(r)
        else resetForm()
    },
    { flush: "post" },
)

function close() {
    isOpen.value = false
}

function onSubmit() {
    if (!nome.value.trim() || !tipoResiduoId.value) return
    const g = pesoMedioStr.value.trim()
    const pesoMedioGramas = g === "" ? null : Math.max(0, Math.floor(Number.parseInt(g, 10) || 0))
    emit("save", {
        tipoResiduoId: tipoResiduoId.value,
        nome: nome.value.trim(),
        pesoMedioGramas,
    })
    close()
}
</script>

<template>
    <Modal v-model="isOpen" :title="titleText" max-width-class="max-w-lg">
        <form id="residuo-form" class="space-y-3" @submit.prevent="onSubmit">
            <div>
                <FieldLabel for-id="res-tipo" label="Categoria" required />
                <Select id="res-tipo" v-model="tipoResiduoId" required>
                    <option value="" disabled>Seleciona o tipo</option>
                    <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.nome }}</option>
                </Select>
            </div>
            <div>
                <FieldLabel for-id="res-nome" label="Nome do material" required />
                <Input id="res-nome" v-model="nome" type="text" required placeholder="Ex.: Beatas" />
            </div>
            <div>
                <FieldLabel for-id="res-peso" label="Peso médio (gramas)" optional />
                <Input id="res-peso" v-model="pesoMedioStr" type="number" min="0" inputmode="numeric" />
            </div>
        </form>
        <template #footer>
            <div class="flex w-full items-center justify-end gap-3">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" form="residuo-form">{{ residuo ? "Guardar" : "Criar" }}</Button>
            </div>
        </template>
    </Modal>
</template>
