<script setup lang="ts">
import { legalConfig } from "@/app/config/legal"
import { appConfig } from "@/app/config/app"
import LegalPublicShell from "@/modules/legal/components/LegalPublicShell.vue"
import LegalSection from "@/modules/legal/components/LegalSection.vue"

const appName = appConfig.name
const { supportEmail, privacyEmail } = legalConfig
</script>

<template>
    <LegalPublicShell title="Política de privacidade">
        <p>
            Esta política explica como a {{ appName }} trata os dados pessoais quando utilizas a plataforma de campanhas
            de limpeza costeira. Aplica-se a voluntários, organizadores e administradores.
        </p>

        <LegalSection heading="Responsável pelo tratamento">
            <p>
                O responsável pelo tratamento dos dados é a entidade que disponibiliza a plataforma {{ appName }} (por
                exemplo, a câmara municipal ou organização parceira). Para questões sobre privacidade, contacta
                <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${privacyEmail}`">{{ privacyEmail }}</a
                >.
            </p>
        </LegalSection>

        <LegalSection heading="Dados que recolhemos">
            <ul class="list-disc space-y-2 ps-5">
                <li>Conta: nome, email, data de nascimento, palavra-passe (armazenada de forma segura), avatar opcional.</li>
                <li>Campanhas: inscrições, presença, recolhas de resíduos (praia, tipo, quantidades) e comentários.</li>
                <li>Organizadores: dados de gestão de campanhas, praias e inventário de resíduos.</li>
                <li>Técnicos: registos de sessão (tokens de autenticação) e logs de segurança sem conteúdo de palavra-passe.</li>
            </ul>
        </LegalSection>

        <LegalSection heading="Finalidades e base legal">
            <ul class="list-disc space-y-2 ps-5">
                <li>
                    <span class="font-medium text-neutral-950">Prestação do serviço</span> - criar conta, participar em
                    campanhas e registar recolhas (execução de contrato ou medidas pré-contratuais).
                </li>
                <li>
                    <span class="font-medium text-neutral-950">Gestão institucional</span> - aprovação de organizadores,
                    moderação e segurança da plataforma (interesse legítimo, com salvaguardas).
                </li>
                <li>
                    <span class="font-medium text-neutral-950">Obrigações legais</span> - quando a lei o exigir.
                </li>
            </ul>
        </LegalSection>

        <LegalSection heading="Conservação">
            <p>
                Os dados mantêm-se enquanto a conta estiver ativa e pelo tempo necessário para fins legais, contabilísticos
                ou de resolução de litígios. Podes pedir o apagamento da conta contactando
                <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${privacyEmail}`">{{ privacyEmail }}</a
                >.
            </p>
        </LegalSection>

        <LegalSection heading="Partilha e subcontratantes">
            <p>
                Os dados não são vendidos. Podem ser tratados por fornecedores de alojamento, base de dados ou email,
                apenas para operar a plataforma e com obrigações contratuais de confidencialidade e segurança.
            </p>
        </LegalSection>

        <LegalSection heading="Os teus direitos">
            <p>
                Nos termos do RGPD, podes solicitar acesso, retificação, apagamento, limitação, portabilidade e oposição,
                bem como apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD). Para exercer direitos,
                envia pedido para
                <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${privacyEmail}`">{{ privacyEmail }}</a
                >.
            </p>
        </LegalSection>

        <LegalSection heading="Segurança">
            <p>
                Aplicamos medidas técnicas e organizativas adequadas (ligação segura, tokens de sessão protegidos,
                palavras-passe encriptadas). Nenhum sistema é totalmente isento de risco; em caso de incidente grave,
                informaremos conforme a lei aplicável.
            </p>
        </LegalSection>

        <LegalSection heading="Contacto">
            <p>
                Suporte geral:
                <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${supportEmail}`">{{ supportEmail }}</a
                >. Privacidade:
                <a class="font-medium text-blue-700 hover:underline" :href="`mailto:${privacyEmail}`">{{ privacyEmail }}</a
                >.
            </p>
        </LegalSection>

        <p class="text-xs text-neutral-500">Última atualização: maio de 2026. Esta versão pode ser ajustada antes do go-live institucional.</p>
    </LegalPublicShell>
</template>
