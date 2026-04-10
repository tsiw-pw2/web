<script setup lang="ts">
import { ref, watch } from "vue"
import type { InscricaoEstado, InscricaoFuncao } from "../../../types/domain"
import { inscricaoEstadoLabel, inscricaoFuncaoLabel } from "../../../types/domain"
import Modal from "../../ui/Modal.vue"
import FieldLabel from "../../ui/form/FieldLabel.vue"
import { Input } from "../../ui/input"
import { Select } from "../../ui/select"
import { Button } from "../../ui/button"

defineProps<{
    campaignId: string
}>()

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    save: [payload: { userId: string; funcao: InscricaoFuncao; estado: InscricaoEstado; presenca: boolean | null }]
}>()

const userId = ref("")
const funcao = ref<string>("0")
const estado = ref<string>("0")
const presenca = ref<string>("")

watch(isOpen, (open) => {
    if (!open) return
    userId.value = ""
    funcao.value = "0"
    estado.value = "0"
    presenca.value = ""
})

function close() {
    isOpen.value = false
}

function onSubmit() {
    if (!userId.value.trim()) return
    let pres: boolean | null = null
    if (presenca.value === "1") pres = true
    else if (presenca.value === "0") pres = false
    emit("save", {
        userId: userId.value.trim(),
        funcao: Number(funcao.value) as InscricaoFuncao,
        estado: Number(estado.value) as InscricaoEstado,
        presenca: pres,
    })
    close()
}
</script>

<template>
    <Modal v-model="isOpen" title="Inscrever participante" max-width-class="max-w-lg">
        <form id="ins-form" class="space-y-3" @submit.prevent="onSubmit">
            <div>
                <FieldLabel for-id="ins-user" label="Identificador da conta do participante" required />
                <Input id="ins-user" v-model="userId" type="text" required class="font-mono text-xs" />
            </div>
            <div>
                <FieldLabel for-id="ins-funcao" label="Função" required />
                <Select id="ins-funcao" v-model="funcao" required>
                    <option value="0">{{ inscricaoFuncaoLabel[0] }}</option>
                    <option value="1">{{ inscricaoFuncaoLabel[1] }}</option>
                </Select>
            </div>
            <div>
                <FieldLabel for-id="ins-estado" label="Estado" required />
                <Select id="ins-estado" v-model="estado" required>
                    <option value="0">{{ inscricaoEstadoLabel[0] }}</option>
                    <option value="1">{{ inscricaoEstadoLabel[1] }}</option>
                    <option value="2">{{ inscricaoEstadoLabel[2] }}</option>
                </Select>
            </div>
            <div>
                <FieldLabel for-id="ins-pres" label="Presença (check-in)" optional />
                <Select id="ins-pres" v-model="presenca">
                    <option value="">—</option>
                    <option value="1">Presente</option>
                    <option value="0">Ausente</option>
                </Select>
            </div>
        </form>
        <template #footer>
            <div class="flex w-full items-center justify-end gap-3">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" form="ins-form">Guardar</Button>
            </div>
        </template>
    </Modal>
</template>
