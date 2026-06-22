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
                <dl class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs">
                    <dt class="shrink-0 font-medium text-neutral-500">De:</dt>
                    <dd class="truncate font-medium text-neutral-950">{{ emailFrom }}</dd>

                    <dt class="shrink-0 font-medium text-neutral-500">Para:</dt>
                    <dd class="truncate font-medium text-neutral-950">{{ emailTo }}</dd>

                    <dt class="shrink-0 font-medium text-neutral-500">Assunto:</dt>
                    <dd class="truncate font-medium text-neutral-950">{{ emailSubject }}</dd>
                </dl>
            </div>
            <div class="p-4">
                <p class="whitespace-pre-wrap text-sm leading-6 text-neutral-700">{{ modelBody }}</p>
            </div>
        </div>
        <FieldLabel as="span" class="mt-3 block !font-medium !text-neutral-500"> Exemplo de email </FieldLabel>
    </section>
</template>
