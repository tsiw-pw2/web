<script setup lang="ts">
import { ref, watch, computed } from "vue"
import type { TipoResiduo, TipoResiduoDraft } from "../../../types/domain"
import Modal from "../../ui/Modal.vue"
import FieldLabel from "../../ui/form/FieldLabel.vue"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"

const props = withDefaults(
    defineProps<{
        tipo?: TipoResiduo | null
    }>(),
    { tipo: null },
)

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    save: [draft: TipoResiduoDraft]
}>()

const nome = ref("")

const titleText = computed(() => (props.tipo ? "Editar categoria" : "Nova categoria de material"))

function resetForm() {
    nome.value = ""
}

function fillFromTipo(t: TipoResiduo) {
    nome.value = t.nome
}

watch(
    [isOpen, () => props.tipo],
    ([open, t]) => {
        if (!open) return
        if (t) fillFromTipo(t)
        else resetForm()
    },
    { flush: "post" },
)

function close() {
    isOpen.value = false
}

function onSubmit() {
    if (!nome.value.trim()) return
    emit("save", { nome: nome.value.trim() })
    close()
}
</script>

<template>
    <Modal v-model="isOpen" :title="titleText" max-width-class="max-w-lg">
        <form id="tipo-form" class="space-y-3" @submit.prevent="onSubmit">
            <div>
                <FieldLabel for-id="tipo-nome" label="Nome da categoria" required />
                <Input id="tipo-nome" v-model="nome" type="text" required placeholder="Ex.: Plásticos" />
            </div>
        </form>
        <template #footer>
            <div class="flex w-full items-center justify-end gap-3">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" form="tipo-form">{{ tipo ? "Guardar" : "Criar" }}</Button>
            </div>
        </template>
    </Modal>
</template>
