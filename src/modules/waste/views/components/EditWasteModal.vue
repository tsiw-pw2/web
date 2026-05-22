<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import Select from "@/shared/components/ui/select/Select.vue"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    waste: WasteListItem | null
    categoryOptions: { value: string; label: string }[]
    unitOptions: { value: string; label: string }[]
}>()

const emit = defineEmits<{
    save: [payload: WasteUpsertDraft]
}>()

function close() {
    open.value = false
}

const name = ref("")
const category = ref<string | undefined>(undefined)
const unit = ref<string | undefined>(undefined)

const canProceed = computed(() => {
    if (name.value.trim().length === 0) return false
    if (!category.value || !unit.value) return false
    return true
})

function syncFromWaste() {
    const w = props.waste
    if (!w) return
    name.value = w.name
    category.value = w.category
    unit.value = w.unit
}

function onProceed() {
    emit("save", {
        name: name.value.trim(),
        category: category.value!,
        unit: unit.value!,
    })
    close()
}

watch(
    () => [open.value, props.waste] as const,
    ([isOpen]) => {
        if (isOpen) syncFromWaste()
    },
    { immediate: true },
)
</script>

<template>
     <ModalRoot v-model="open" ariaLabelledby="edit-waste-title"
        >
        <div class="flex items-start justify-between gap-4">

            <h3 id="edit-waste-title" class="text-lg font-semibold leading-7 text-neutral-950"> Editar resíduo </h3>
             <ModalCloseButton @click="close" />
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="onProceed">

            <div class="flex flex-col gap-1">
                 <FieldLabel required :for="`edit-waste-name-${waste?.id ?? ''}`">Nome</FieldLabel> <Input
                    :id="`edit-waste-name-${waste?.id ?? ''}`"
                    v-model="name"
                    class="w-full"
                    placeholder="Ex.: garrafas, redes de pesca…"
                />
            </div>

            <div class="flex flex-col gap-1">
                 <FieldLabel required>Categoria</FieldLabel> <Select v-model="category" class="w-full" :options="props.categoryOptions" placeholder="Tipo de material" />
            </div>

            <div class="flex flex-col gap-1"> <FieldLabel required>Unidade</FieldLabel> <Select v-model="unit" class="w-full" :options="props.unitOptions" placeholder="Como medir" /> </div>

            <div class="mt-2 flex items-center justify-end gap-2">
                 <Button type="button" variant="secondary" @click="close">Cancelar</Button> <Button type="submit" :disabled="!canProceed">Guardar</Button>
            </div>

        </form>
         </ModalRoot
    >
</template>

