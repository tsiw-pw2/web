<script setup lang="ts">
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"

const { emailFrom, emailTo, emailSubject, modelBody } = defineProps<{
    emailFrom: string
    emailTo: string
    emailSubject: string
    modelBody: string
}>()
</script>

<template>
    <section class="lg:pt-2">
        <div class="rounded-2xl border border-neutral-200 bg-white shadow-card">
            <div class="border-b border-neutral-200 p-4">
                <div class="grid grid-cols-1 gap-2 text-xs text-neutral-600">
                    <div class="flex items-center gap-2">
                        <FieldLabel as="span" class="w-10 shrink-0 !font-medium !text-neutral-500"> De: </FieldLabel>
                        <div class="truncate font-medium text-neutral-950">{{ emailFrom }}</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <FieldLabel as="span" class="w-10 shrink-0 !font-medium !text-neutral-500"> Para: </FieldLabel>
                        <div class="truncate font-medium text-neutral-950">{{ emailTo }}</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <FieldLabel as="span" class="w-10 shrink-0 !font-medium !text-neutral-500"> Assunto: </FieldLabel>
                        <div class="truncate font-medium text-neutral-950">{{ emailSubject }}</div>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <pre class="whitespace-pre-wrap text-sm leading-6 text-neutral-700">{{ modelBody }}</pre>
            </div>
        </div>
        <FieldLabel as="span" class="mt-3 block !font-medium !text-neutral-500"> Exemplo de email </FieldLabel>
    </section>
</template>
