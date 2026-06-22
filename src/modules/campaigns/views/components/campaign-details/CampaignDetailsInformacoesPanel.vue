<script setup lang="ts">
import { computed } from "vue"
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import { useCampaignDetailsPageInject } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageInject"
import { beachLocationLine } from "@/modules/campaigns/lib/beachLocationLine"
import { canAccessCampaignComments } from "@/modules/campaigns/lib/canAccessCampaignComments"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import CalendarIcon from "@/shared/components/icons/CalendarIcon.vue"
import MapPinIcon from "@/shared/components/icons/MapPinIcon.vue"

const { core, display, registration, registrationRows } = useCampaignDetailsPageInject()

const {
    canEnroll,
    showEnrollmentClosed,
    showMyRegistrationStatus,
    enrollmentProfileBlockReason,
    showAlreadyEnrolledHint,
    canceling,
    cancelRegistrationOpen,
    enrolling,
    enroll,
} = registration

const campaign = computed(() => core.campaign.value!)
const profile = computed(() => core.profile.value)
const statusUi = computed(() => display.statusUi.value)
const showCommentsMetric = computed(() => canAccessCampaignComments(campaign.value))
const organizerPhone = computed(() => campaign.value.organizer?.phone?.trim() || "")
</script>

<template>
    <div
        id="campaign-panel-informacoes"
        role="tabpanel"
        aria-labelledby="campaign-tab-informacoes"
        class="flex min-h-0 flex-col gap-6 pb-0"
    >
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div class="lg:col-span-2 flex flex-col gap-4">
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">Estado</FieldLabel>
                        <div class="mt-2">
                            <ApiStateBadge v-bind="statusUi" />
                        </div>
                    </div>
                    <div>
                        <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">Período</FieldLabel>
                        <div class="mt-2 flex items-center gap-1">
                            <CalendarIcon :size="20" :stroke-width="1.5" class="text-neutral-500" />
                            <p class="text-sm font-medium leading-5 text-neutral-950">{{ display.campaignPeriodLabel }}</p>
                        </div>
                    </div>
                    <div>
                        <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">Distrito</FieldLabel>
                        <p class="mt-2 text-sm font-medium leading-5 text-neutral-950">{{ display.campaignDistrictLabel }}</p>
                    </div>
                    <div>
                        <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">Local de encontro</FieldLabel>
                        <div class="mt-2 flex items-start gap-1">
                            <MapPinIcon :size="20" :stroke-width="1.5" class="mt-0.5 text-neutral-500" />
                            <div class="min-w-0">
                                <p class="text-sm font-medium leading-5 text-neutral-950">{{ campaign.meetingLocation }}</p>
                                <p v-if="campaign.meetingTime" class="mt-1 text-sm leading-5 text-neutral-600">{{ campaign.meetingTime }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="sm:col-span-2">
                        <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">Organizador</FieldLabel>
                        <p class="mt-2 text-sm font-medium leading-5 text-neutral-950">{{ campaign.organizer?.name ?? "-" }}</p>
                        <p v-if="organizerPhone" class="mt-1 text-sm leading-5 text-neutral-600">
                            Telemóvel: <span class="tabular-nums text-neutral-950">{{ organizerPhone }}</span>
                        </p>
                    </div>
                </div>
                <div v-if="campaign.beaches.length > 0">
                    <FieldLabel as="span" class="block uppercase tracking-wide font-medium !text-neutral-500">Praias associadas</FieldLabel>
                    <ul class="mt-3 space-y-2">
                        <li v-for="beach in campaign.beaches" :key="beach.id" class="text-sm leading-5 text-neutral-950">
                            <span class="font-medium">{{ beach.name }}</span>
                            <span v-if="beachLocationLine(beach)" class="text-neutral-600"> · {{ beachLocationLine(beach) }} </span>
                        </li>
                    </ul>
                </div>
                <div>
                    <FieldLabel as="span" class="block uppercase tracking-wide font-medium text-neutral-500">Descrição</FieldLabel>
                    <p class="mt-2 whitespace-pre-line text-sm leading-5 text-neutral-700">{{ display.descriptionText }}</p>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <p class="font-medium text-neutral-500"> Voluntários </p>
                    <div class="mt-1 text-neutral-950"> {{ campaign.metrics.registrationsCount }} </div>
                </div>
                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <p class="font-medium text-neutral-500"> Praias </p>
                    <div class="mt-1 text-neutral-950"> {{ campaign.metrics.beachesCount }} </div>
                </div>
                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <p class="font-medium text-neutral-500"> Recolhas </p>
                    <div class="text-neutral-950"> {{ campaign.metrics.wasteCollectionsCount }} </div>
                </div>
                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <p class="font-medium text-neutral-500"> Resíduos (un.) </p>
                    <div class="text-neutral-950"> {{ campaign.metrics.totalWasteUnits }} </div>
                </div>
                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <p class="font-medium text-neutral-500"> Peso pesado </p>
                    <div class="text-neutral-950">
                        {{ display.formatWeightKg(campaign.metrics.totalActualWeightKg ?? campaign.metrics.totalWasteWeightKg) }}
                    </div>
                </div>
                <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <p class="font-medium text-neutral-500"> Peso estimado </p>
                    <div class="text-neutral-950">
                        {{ display.formatWeightKg(campaign.metrics.totalImpactWeightKg ?? campaign.metrics.totalWasteWeightKg) }}
                    </div>
                </div>
                <div v-if="showCommentsMetric" class="flex items-center justify-between">
                    <p class="font-medium text-neutral-500"> Comentários </p>
                    <div class="text-neutral-950"> {{ campaign.metrics.commentsCount }} </div>
                </div>
                <div
                    v-if="profile && (canEnroll || showMyRegistrationStatus || enrollmentProfileBlockReason || showEnrollmentClosed || showAlreadyEnrolledHint)"
                    class="flex flex-col gap-3"
                >
                    <div v-if="showMyRegistrationStatus" class="flex flex-col gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            class="w-full touch-manipulation"
                            :disabled="canceling"
                            :busy="canceling"
                            @click="cancelRegistrationOpen = true"
                        >
                            Cancelar inscrição
                        </Button>
                        <p class="text-sm leading-5 text-neutral-700">
                            A tua inscrição:
                            <span class="font-medium text-neutral-950">{{ registrationRows.myRegistrationStatusLabel }}</span>
                        </p>
                    </div>
                    <Button
                        v-else-if="canEnroll"
                        type="button"
                        variant="primary"
                        class="w-full touch-manipulation"
                        :disabled="enrolling"
                        :busy="enrolling"
                        @click="enroll"
                    >
                        Inscrever-me
                    </Button>
                    <p v-else-if="enrollmentProfileBlockReason" class="text-sm leading-5 text-neutral-600">
                        {{ enrollmentProfileBlockReason }}
                        <RouterLink :to="routePaths.settingsProfile" class="font-medium text-neutral-950 underline">
                            Ir ao perfil
                        </RouterLink>
                    </p>
                    <p v-else-if="showAlreadyEnrolledHint" class="text-sm leading-5 text-neutral-600">
                        Já tens uma inscrição nesta campanha.
                    </p>
                    <p v-else-if="showEnrollmentClosed" class="text-sm leading-5 text-neutral-600">
                        As inscrições não estão abertas nesta campanha.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
