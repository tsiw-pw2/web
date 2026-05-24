import { computed, ref } from "vue"
import { buildRequestAccountEmailBody, buildRequestAccountEmailPreview } from "@/modules/access-request/lib/buildRequestAccountEmail"
import { REQUEST_ACCOUNT_CONTACT_EMAIL, REQUEST_ACCOUNT_DEFAULT_FROM, REQUEST_ACCOUNT_DEFAULT_RESPONSIBLE_NAME, REQUEST_ACCOUNT_DEFAULT_SUBJECT, REQUEST_ACCOUNT_DEFAULT_TO } from "@/modules/access-request/lib/requestAccountConstants"

export function useRequestAccountForm() {
    const contactEmail = REQUEST_ACCOUNT_CONTACT_EMAIL
    const emailFrom = ref(REQUEST_ACCOUNT_DEFAULT_FROM)
    const emailTo = ref(REQUEST_ACCOUNT_DEFAULT_TO)
    const emailSubject = ref(REQUEST_ACCOUNT_DEFAULT_SUBJECT)
    const responsibleName = ref(REQUEST_ACCOUNT_DEFAULT_RESPONSIBLE_NAME)

    const institutionalEmail = computed(() => emailFrom.value)

    const modelBody = computed(() =>
        buildRequestAccountEmailBody(responsibleName.value, institutionalEmail.value),
    )

    const modelEmail = computed(() =>
        buildRequestAccountEmailPreview(
            emailFrom.value,
            emailTo.value,
            emailSubject.value,
            modelBody.value,
        ),
    )

    return {
        contactEmail,
        emailFrom,
        emailTo,
        emailSubject,
        responsibleName,
        institutionalEmail,
        modelBody,
        modelEmail,
    }
}
