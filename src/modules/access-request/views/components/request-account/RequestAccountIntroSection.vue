<script setup lang="ts">
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import { REQUEST_ACCOUNT_CHECKLIST_ITEMS } from "@/modules/access-request/lib/requestAccountConstants"

const { contactEmail, copied } = defineProps<{
    contactEmail: string
    copied: boolean
}>()

const emit = defineEmits<{
    copy: []
}>()

const checklistItems = REQUEST_ACCOUNT_CHECKLIST_ITEMS
</script>

<template>
    <section>
        <h1 class="text-3xl font-semibold leading-tight sm:text-4xl">Pedido de acesso para organização.</h1>

        <p class="mt-4 max-w-prose text-sm leading-6 text-neutral-600">
            Para solicitar acesso à plataforma, envie um email com os dados da sua organização. O pedido será analisado
            antes de ser aprovado. Vê o
            <RouterLink :to="{ path: routePaths.help, hash: '#organizadores' }" class="font-medium text-blue-700 hover:underline">
                processo completo
            </RouterLink>
            em Ajuda e contacto.
        </p>

        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <FieldLabel as="span" class="block !font-medium !text-neutral-500"> Email de contacto </FieldLabel>
                <div class="mt-2 text-sm font-medium text-neutral-950">{{ contactEmail }}</div>
            </div>

            <div>
                <FieldLabel as="span" class="block !font-medium !text-neutral-500"> Modelo de email </FieldLabel>
                <div class="mt-2 flex items-center gap-3">
                    <Button class="w-auto" variant="secondary" @click="emit('copy')">
                        {{ copied ? "Copiado" : "Copiar modelo" }}
                    </Button>
                </div>
            </div>
        </div>

        <div class="mt-8">
            <FieldLabel as="span" class="block !font-medium !text-neutral-500"> O que incluir no email: </FieldLabel>
            <div class="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-700">
                <div v-for="item in checklistItems" :key="item.label" class="flex items-center gap-2">
                    <span class="inline-block size-1.5 rounded-full" :class="item.dotClass" />
                    <span>{{ item.label }}</span>
                </div>
            </div>
        </div>

        <div class="mt-12 border-t border-neutral-200 pt-8">
            <p class="max-w-prose text-sm leading-6 text-neutral-600">
                Caso tenha interesse em saber mais sobre a plataforma ou pretenda esclarecer alguma questão, a nossa
                equipa encontra-se disponível para ajudar. Utilize o email
                <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${contactEmail}`">
                    {{ contactEmail }}
                </a>
                para falar connosco.
            </p>
        </div>
    </section>
</template>
