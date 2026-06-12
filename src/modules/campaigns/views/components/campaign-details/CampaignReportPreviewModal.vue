<script setup lang="ts">
import { ref, watch } from "vue"
import CampaignReportPreview from "@/modules/campaigns/views/components/campaign-details/CampaignReportPreview.vue"
import Button from "@/shared/components/ui/Button.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import {
    downloadCampaignReportPdf,
    fetchCampaignReport,
    type CampaignReport,
} from "@/modules/campaigns/services/campaignReport"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    campaignId: string
}>()

const report = ref<CampaignReport | null>(null)
const loading = ref(false)
const error = ref(false)
const downloading = ref(false)

async function loadReport() {
    if (!props.campaignId) return
    loading.value = true
    error.value = false
    try {
        report.value = await fetchCampaignReport(props.campaignId)
    } catch {
        report.value = null
        error.value = true
    } finally {
        loading.value = false
    }
}

async function onDownloadPdf() {
    if (!props.campaignId) return
    downloading.value = true
    try {
        await downloadCampaignReportPdf(props.campaignId)
    } finally {
        downloading.value = false
    }
}

watch(
    open,
    (isOpen) => {
        if (isOpen) {
            void loadReport()
        } else {
            report.value = null
            error.value = false
        }
    },
    { immediate: true },
)

function close() {
    open.value = false
}
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="campaign-report-modal-title" max-width="3xl">
        <div class="flex items-start justify-between gap-4">
            <h2 id="campaign-report-modal-title" class="text-lg font-semibold leading-7 text-neutral-950">
                Pré-visualização do relatório
            </h2>
            <ModalCloseButton @click="close" />
        </div>

        <p v-if="loading" class="text-sm text-neutral-600">A carregar relatório…</p>
        <p v-else-if="error" class="text-sm text-red-700">Não foi possível carregar o relatório.</p>
        <div
            v-else-if="report"
            class="relative max-h-[min(70dvh,40rem)] rounded-lg border border-neutral-200 bg-neutral-50"
        >
            <div class="max-h-[min(70dvh,40rem)] overflow-y-auto overscroll-contain p-3 pb-16 sm:p-4">
                <CampaignReportPreview :report="report" />
            </div>
            <div class="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end p-3 sm:p-4">
                <Button
                    :disabled="downloading"
                    :busy="downloading"
                    class="pointer-events-auto shadow-card"
                    @click="onDownloadPdf"
                >
                    Descarregar PDF
                </Button>
            </div>
        </div>
    </ModalRoot>
</template>
