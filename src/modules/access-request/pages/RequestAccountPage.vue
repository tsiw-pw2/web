<script setup lang="ts">
import { useRequestAccountPage } from "@/modules/access-request/composables/useRequestAccountPage"
import RequestAccountEmailPreviewCard from "@/modules/access-request/views/components/request-account/RequestAccountEmailPreviewCard.vue"
import RequestAccountIntroSection from "@/modules/access-request/views/components/request-account/RequestAccountIntroSection.vue"
import RequestAccountPageShell from "@/modules/access-request/views/components/request-account/RequestAccountPageShell.vue"

const {
    contactEmail,
    emailFrom,
    emailTo,
    emailSubject,
    modelBody,
    copied,
    copyModel,
} = useRequestAccountPage()
</script>

<template>
    <RequestAccountPageShell>
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            <RequestAccountIntroSection
                :contact-email="contactEmail"
                :copied="copied"
                @copy="copyModel"
            />
            <RequestAccountEmailPreviewCard
                :email-from="emailFrom"
                :email-to="emailTo"
                :email-subject="emailSubject"
                :model-body="modelBody"
            />
        </div>
    </RequestAccountPageShell>
</template>
