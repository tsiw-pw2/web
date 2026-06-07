<script setup lang="ts">
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import { appConfig } from "@/app/config/app"
import { legalConfig } from "@/app/config/legal"
import LegalPublicShell from "@/modules/legal/components/LegalPublicShell.vue"
import LegalSection from "@/modules/legal/components/LegalSection.vue"

const appName = appConfig.name
const { supportEmail } = legalConfig
</script>

<template>
    <LegalPublicShell title="Termos de utilização">
        <p>
            Ao utilizar a {{ appName }}, aceitas estes termos. Se não concordares, não utilizes a plataforma. Lê também a
            <RouterLink :to="routePaths.privacy" class="font-medium text-blue-700 hover:underline">
                política de privacidade
            </RouterLink
            >.
        </p>

        <LegalSection heading="Voluntários">
            <ul class="list-disc space-y-2 ps-5">
                <li>Deves ter pelo menos 16 anos e fornecer dados verdadeiros no registo.</li>
                <li>És responsável pela confidencialidade da tua palavra-passe e pela atividade na tua conta.</li>
                <li>
                    Ao inscrever-te numa campanha, comprometes-te a participar de boa-fé e a registar recolhas de forma
                    honesta.
                </li>
                <li>Comentários e conteúdos não podem ser ofensivos, ilegais ou enganadores.</li>
            </ul>
        </LegalSection>

        <LegalSection heading="Organizadores e administradores">
            <ul class="list-disc space-y-2 ps-5">
                <li>
                    O acesso de organizador é concedido após validação institucional - ver
                    <RouterLink :to="routePaths.help" class="font-medium text-blue-700 hover:underline">
                        ajuda e contacto
                    </RouterLink
                    >.
                </li>
                <li>És responsável pelas campanhas que crias, pelas inscrições que geres e pelos dados que introduces.</li>
                <li>Dados de praias e resíduos devem ser exactos e adequados ao objectivo ambiental da plataforma.</li>
                <li>Administradores podem moderar conteúdos e suspender contas em caso de violação destes termos.</li>
            </ul>
        </LegalSection>

        <LegalSection heading="Contas e suspensão">
            <p>
                Podemos limitar, suspender ou encerrar contas que violem estes termos, comprometam a segurança ou prejudiquem
                outras pessoas. Quando possível, comunicamos de forma genérica; não somos obrigados a manter contas activas.
            </p>
        </LegalSection>

        <LegalSection heading="Propriedade e licença">
            <p>
                A plataforma, marca e interface pertencem aos titulares da {{ appName }}. Concedemos-te uma licença limitada
                para usar o serviço conforme estes termos. Os dados que introduzes mantêm-se teus; concedes licença para os
                tratar na plataforma para as finalidades do serviço.
            </p>
        </LegalSection>

        <LegalSection heading="Limitação de responsabilidade">
            <p>
                A plataforma é prestada «tal como está», no âmbito de voluntariado e gestão de campanhas. Não garantimos
                disponibilidade ininterrupta. A entidade responsável e a equipa técnica não respondem por danos indirectos
                decorrentes do uso, dentro dos limites permitidos por lei.
            </p>
        </LegalSection>

        <LegalSection heading="Alterações">
            <p>
                Estes termos podem ser actualizados. A data da versão vigente consta no final desta página. O uso continuado
                após alterações implica aceitação, salvo disposição legal em contrário.
            </p>
        </LegalSection>

        <LegalSection heading="Lei aplicável e contacto">
            <p>
                Aplica-se a lei portuguesa. Para questões sobre estes termos:
                <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a
                >.
            </p>
        </LegalSection>

        <p class="text-xs text-neutral-500">Última atualização: maio de 2026.</p>
    </LegalPublicShell>
</template>
