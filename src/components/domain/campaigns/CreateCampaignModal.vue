<script setup lang="ts">
import { ref } from "vue"
import Modal from "../../ui/Modal.vue"
import FieldLabel from "../../ui/form/FieldLabel.vue"
import { Input } from "../../ui/input"
import { Select } from "../../ui/select"
import { Textarea } from "../../ui/textarea"
import { Button } from "../../ui/button"

const isOpen = defineModel<boolean>({ required: true })

const title = ref("")
const district = ref("")
const meetingTime = ref("")
const startDate = ref("")
const endDate = ref("")
const status = ref("")
const info = ref("")

function close() {
    isOpen.value = false
}

function onNext() {
    close()
}
</script>

<template>
    <Modal v-model="isOpen" title="Criar Campanha" max-width-class="max-w-3xl">
        <form class="space-y-3" @submit.prevent="onNext">
            <div>
                <FieldLabel for-id="title" label="Título" required />
                <Input
                    v-model="title"
                    id="title"
                    type="text"
                    placeholder="Onda de mudança"
                    required
                />
            </div>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                    <FieldLabel for-id="district" label="Distrito" required />
                    <Select v-model="district" id="district" required>
                        <option value="" disabled>Seleciona o distrito</option>
                        <option>Bragança</option>
                        <option>Porto</option>
                        <option>Lisboa</option>
                    </Select>
                </div>

                <div>
                    <FieldLabel for-id="meetingTime" label="Hora de encontro" required />
                    <Input
                        v-model="meetingTime"
                        id="meetingTime"
                        type="time"
                        required
                    />
                </div>

                <div>
                    <FieldLabel for-id="startDate" label="Data de início" required />
                    <Input
                        v-model="startDate"
                        id="startDate"
                        type="date"
                        required
                    />
                </div>

                <div>
                    <FieldLabel for-id="endDate" label="Data de fim" optional />
                    <Input
                        v-model="endDate"
                        id="endDate"
                        type="date"
                    />
                </div>

            </div>

            <div>
                <FieldLabel for-id="status" label="Estado" required />
                <Select v-model="status" id="status" required>
                    <option value="" disabled>Estado da campanha</option>
                    <option value="draft">Rascunho</option>
                    <option value="active">Ativa</option>
                    <option value="done">Concluída</option>
                </Select>
            </div>

            <div>
                <FieldLabel for-id="info" label="Informações" optional tooltip="Ex.: ponto de encontro, o que levar, duração prevista" />
                <Textarea v-model="info" id="info" rows="5" placeholder="Ponto de encontro, o que levar (luvas, água...), duração prevista e notas importantes…" />
            </div>

        </form>
        <template #footer>
            <div class="flex w-full items-center justify-end gap-3">
                <Button variant="secondary" @click="close">Cancelar</Button>
                <Button @click="onNext">Próximo</Button>
            </div>
        </template>
    </Modal>
</template>

