import { computed, ref, type Ref } from "vue"
import { CAMPAIGN_COMMENT_MAX } from "@/modules/campaigns/lib/campaignDetailsConstants"
import { commentAuthorInitials, commentComposerInitials } from "@/modules/campaigns/lib/commentInitials"
import { postCampaignComment, patchCampaignCommentVisibility } from "@/modules/campaigns/services/campaignComments"
import type { CampaignDetails, CampaignDetailsComment } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"
import { toastError, toastSuccess } from "@/infrastructure/appToast"
import { isApiRequestError } from "@/infrastructure/request"

// Composable que gere a lógica de campanha detalhes comentários.
export function useCampaignDetailsComments(
    campaign: Ref<CampaignDetails | null>,
    profile: Ref<SettingsProfile | null>,
    reloadCommentsFirstPage: () => void | Promise<void>,
    refreshCampaignMetrics: () => void | Promise<void>,
) {
    const commentBody = ref("")
    const postingComment = ref(false)
    const visibilitySavingId = ref<string | null>(null)

    const commentComposerInitialsValue = computed(() => commentComposerInitials(profile.value?.name))

    const canSubmitComment = computed(() => {
        const t = commentBody.value.trim()
        return t.length > 0 && t.length <= CAMPAIGN_COMMENT_MAX && !postingComment.value
    })

// Define comentário visibility.
    async function setCommentVisibility(comment: CampaignDetailsComment, isVisible: boolean) {
        if (!profile.value?.isAdmin || visibilitySavingId.value) return
        visibilitySavingId.value = comment.id
        try {
            await patchCampaignCommentVisibility(comment, isVisible)
            await reloadCommentsFirstPage()
            await refreshCampaignMetrics()
            toastSuccess(isVisible ? "Comentário visível" : "Comentário oculto")
        } catch {
            toastError("Não foi possível atualizar", "Tenta outra vez.")
        } finally {
            visibilitySavingId.value = null
        }
    }

// Publica o comentário na campanha e recarrega comentários e métricas.
    async function submitComment() {
        if (!canSubmitComment.value) return
        postingComment.value = true
        try {
            if (!campaign.value) return
            await postCampaignComment(campaign.value, commentBody.value.trim())
            commentBody.value = ""
            await reloadCommentsFirstPage()
            await refreshCampaignMetrics()
            toastSuccess("Comentário publicado")
        } catch (e) {
            if (isApiRequestError(e) && e.httpStatus === 403) {
                toastError(
                    "Não podes publicar aqui",
                    "Inscreve-te nesta campanha para comentar.",
                )
            } else {
                toastError("Não foi possível publicar", "Verifica a ligação e tenta outra vez.")
            }
        } finally {
            postingComment.value = false
        }
    }

    return {
        commentBody,
        postingComment,
        visibilitySavingId,
        commentComposerInitials: commentComposerInitialsValue,
        commentAuthorInitials,
        canSubmitComment,
        setCommentVisibility,
        submitComment,
    }
}
