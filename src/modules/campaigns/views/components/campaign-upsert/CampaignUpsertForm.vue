<script setup lang="ts">
import { toRef } from "vue"
import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import { useCampaignUpsertForm } from "@/modules/campaigns/composables/useCampaignUpsertForm"
import { CAMPAIGN_STATUS_SELECT_OPTIONS } from "@/modules/campaigns/lib/campaignStatus"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import SearchableSelect from "@/shared/components/ui/searchable-select/SearchableSelect.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import Textarea from "@/shared/components/ui/Textarea.vue"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    mode: "create" | "edit"
    campaign?: CampaignListItem | null
    fieldPrefix: string
    submitLabel: string
}>()

const emit = defineEmits<{
    submit: [payload: CampaignCreateDraft]
}>()

const campaignRef = toRef(props, "campaign")

const { form, handleFormSubmit, goBackToDetails, close } = useCampaignUpsertForm(
    open,
    props.mode,
    campaignRef,
    (payload) => emit("submit", payload),
)

const statusOptions = CAMPAIGN_STATUS_SELECT_OPTIONS
</script>

<template>
    <form class="flex flex-col gap-3" @submit.prevent="handleFormSubmit">
        <div v-if="form.detailsLoading" class="min-h-[28rem] text-sm leading-5 text-neutral-600">
            A carregar dados da campanha…
        </div>

        <template v-else>
            <div class="flex min-h-[28rem] flex-col">
                <div v-show="form.step === 0" class="flex flex-1 flex-col gap-3">
                    <div class="flex flex-col gap-1">
                        <FieldLabel required :for="`${fieldPrefix}-title`">Título</FieldLabel>
                        <Input
                            :id="`${fieldPrefix}-title`"
                            v-model="form.title"
                            class="w-full"
                            placeholder="Onda de mudança"
                        />
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div class="flex flex-col gap-1">
                            <FieldLabel required>Distrito</FieldLabel>
                            <SearchableSelect
                                v-model="form.district"
                                class="w-full"
                                :options="form.districtOptions"
                                :placeholder="form.districtPlaceholder"
                                :disabled="form.beachesLoading || form.districtOptions.length === 0"
                            />
                        </div>

                        <div class="flex flex-col gap-1">
                            <FieldLabel required :for="`${fieldPrefix}-meeting-time`">Hora de encontro</FieldLabel>
                            <Input
                                :id="`${fieldPrefix}-meeting-time`"
                                v-model="form.meetingTime"
                                class="w-full"
                                type="time"
                                left-icon="clock"
                                placeholder="09:30"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div class="flex flex-col gap-1">
                            <FieldLabel required :for="`${fieldPrefix}-start-date`">Data de início</FieldLabel>
                            <Input
                                :id="`${fieldPrefix}-start-date`"
                                v-model="form.startDate"
                                class="w-full"
                                type="date"
                                left-icon="calendar"
                            />
                        </div>

                        <div class="flex flex-col gap-1">
                            <FieldLabel optional :for="`${fieldPrefix}-end-date`">Data de fim</FieldLabel>
                            <Input
                                :id="`${fieldPrefix}-end-date`"
                                v-model="form.endDate"
                                class="w-full"
                                type="date"
                                :min="form.startDate || undefined"
                                left-icon="calendar"
                            />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <FieldLabel required>Estado</FieldLabel>
                        <Select v-model="form.status" class="w-full" :options="statusOptions" placeholder="Estado da campanha" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <FieldLabel optional :for="`${fieldPrefix}-information`">Informações</FieldLabel>
                        <Textarea
                            :id="`${fieldPrefix}-information`"
                            v-model="form.information"
                            class="w-full"
                            placeholder="Ponto de encontro, o que levar (luvas, água...), duração prevista e notas importantes…"
                        />
                    </div>
                </div>

                <div v-show="form.step === 1" class="flex flex-1 flex-col gap-3">
                    <p class="text-base font-semibold leading-7 text-neutral-950">{{ form.districtLabel }}</p>

                    <div class="flex-1 min-h-0 overflow-y-auto">
                        <p v-if="form.beachesLoading" class="text-sm leading-5 text-neutral-600">A carregar praias…</p>

                        <div v-else-if="form.beachesForDistrict.length === 0" class="text-sm leading-5 text-neutral-600">
                            Não há praias registadas neste distrito. Adiciona praias no separador Praias e volta a tentar.
                        </div>

                        <ul v-else class="list-none space-y-1 p-0">
                            <li v-for="b in form.beachesForDistrict" :key="b.id">
                                <label class="flex cursor-pointer items-center gap-3 py-1.5">
                                    <input
                                        v-model="form.selectedBeachIds"
                                        type="checkbox"
                                        class="size-4 rounded border-neutral-300 text-blue-600"
                                        :value="b.id"
                                    />
                                    <span class="text-sm leading-5 text-neutral-950">{{ b.name }}</span>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <nav class="flex min-w-0 justify-center sm:justify-start" aria-label="Passos da campanha">
                    <div class="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-card">
                        <span
                            class="h-2 shrink-0 rounded-full"
                            :class="form.step === 0 ? 'w-6 bg-blue-500' : 'size-2 bg-neutral-200'"
                            :aria-current="form.step === 0 ? 'step' : undefined"
                        />
                        <span
                            class="h-2 shrink-0 rounded-full"
                            :class="form.step === 1 ? 'w-6 bg-blue-500' : 'size-2 bg-neutral-200'"
                            :aria-current="form.step === 1 ? 'step' : undefined"
                        />
                    </div>
                </nav>

                <div class="flex shrink-0 items-center justify-end gap-2">
                    <template v-if="form.step === 0">
                        <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                        <Button type="submit" :disabled="!form.canStep0Next || form.beachesLoading">Próximo</Button>
                    </template>
                    <template v-else>
                        <Button type="button" variant="secondary" @click="goBackToDetails">Voltar</Button>
                        <Button type="submit" :disabled="!form.canSubmitBeaches">{{ submitLabel }}</Button>
                    </template>
                </div>
            </div>
        </template>
    </form>
</template>
