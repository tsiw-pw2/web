<script setup lang="ts">
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import { appConfig } from "@/app/config/app"
import { legalConfig } from "@/app/config/legal"
import LegalPublicShell from "@/modules/legal/components/LegalPublicShell.vue"
import LegalSection from "@/modules/legal/components/LegalSection.vue"

const appName = appConfig.name
const { supportEmail, privacyEmail, organizerResponseBusinessDays } = legalConfig
</script>

<template>
    <LegalPublicShell title="Ajuda e contacto">
        <p>
            Encontra aqui como falar connosco e como pedir acesso de organizador à {{ appName }}.
        </p>

        <LegalSection heading="Suporte">
            <p>
                Para dúvidas sobre campanhas, conta ou utilização da plataforma, envia email para
                <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a
                >. Indica o teu nome e, se possível, o email com que te registaste.
            </p>
        </LegalSection>

        <LegalSection heading="Privacidade e dados pessoais">
            <p>
                Para exercer direitos ao abrigo do RGPD (acesso, rectificação, apagamento, etc.) ou questões sobre
                tratamento de dados, contacta
                <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${privacyEmail}`">{{ privacyEmail }}</a
                >. Consulta também a
                <RouterLink :to="routePaths.privacy" class="font-medium text-blue-700 hover:underline">
                    política de privacidade
                </RouterLink
                >.
            </p>
        </LegalSection>

        <LegalSection id="organizadores" heading="Acesso para organizadores">
            <p>
                Contas de organizador não são criadas automaticamente no registo público. O processo é manual para
                garantir que apenas entidades autorizadas gerem campanhas.
            </p>
            <ol class="list-decimal space-y-3 ps-5">
                <li>
                    Visita
                    <RouterLink :to="routePaths.requestAccount" class="font-medium text-blue-700 hover:underline">
                        Solicitar acesso
                    </RouterLink
                    >
                    e copia o modelo de email com os dados da organização.
                </li>
                <li>
                    Envia o email para
                    <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a
                    >
                    a partir de um endereço institucional, incluindo nome da organização, responsável e contacto.
                </li>
                <li>A equipa valida o pedido (identidade e legitimidade institucional).</li>
                <li>
                    Se for aprovado, recebes instruções para activar a conta de organizador. O prazo habitual de resposta
                    é até {{ organizerResponseBusinessDays }} dias úteis.
                </li>
            </ol>
            <p>
                Se o pedido for recusado, a resposta será genérica, sem obrigação de detalhar motivos internos de segurança.
            </p>
        </LegalSection>

        <LegalSection heading="Documentos">
            <ul class="list-disc space-y-2 ps-5">
                <li>
                    <RouterLink :to="routePaths.terms" class="font-medium text-blue-700 hover:underline">
                        Termos de utilização
                    </RouterLink>
                </li>
                <li>
                    <RouterLink :to="routePaths.privacy" class="font-medium text-blue-700 hover:underline">
                        Política de privacidade
                    </RouterLink>
                </li>
            </ul>
        </LegalSection>
    </LegalPublicShell>
</template>
