<script setup lang="ts">
import { ref, watch } from "vue"
import Modal from "../../ui/Modal.vue"
import FieldLabel from "../../ui/form/FieldLabel.vue"
import { Textarea } from "../../ui/textarea"
import { Checkbox } from "../../ui/checkbox"
import { Button } from "../../ui/button"

defineProps<{
    campaignId: string
}>()

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    save: [payload: { texto: string; isVisible: boolean }]
}>()

const texto = ref("")
const isVisible = ref(true)

watch(isOpen, (open) => {
    if (!open) return
    texto.value = ""
    isVisible.value = true
})

function close() {
    isOpen.value = false
}

function onSubmit() {
    if (!texto.value.trim()) return
    emit("save", { texto: texto.value.trim(), isVisible: isVisible.value })
    close()
}
</script>

<template>
    <Modal v-model="isOpen" title="Novo comentário" max-width-class="max-w-lg">
        <form id="com-form" class="space-y-3" @submit.prevent="onSubmit">
            <div>
                <FieldLabel for-id="com-text" label="Comentário" required />
                <Textarea id="com-text" v-model="texto" rows="4" required />
            </div>
            <label class="flex cursor-pointer items-start gap-3">
                <Checkbox id="com-vis" v-model="isVisible" class="mt-0.5" />
                <span class="text-sm font-medium leading-5 text-neutral-900">Visível (is_visible)</span>
            </label>
        </form>
        <template #footer>
            <div class="flex w-full items-center justify-end gap-3">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" form="com-form">Publicar</Button>
            </div>
        </template>
    </Modal>
</template>
