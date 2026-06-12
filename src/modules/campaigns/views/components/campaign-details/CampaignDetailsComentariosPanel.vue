<script setup lang="ts">
import { computed } from "vue"
import { useCampaignDetailsPageInject } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageInject"
import { CAMPAIGN_COMMENT_MAX } from "@/modules/campaigns/lib/campaignDetailsConstants"
import { formatCommentTimeAgo } from "@/shared/lib/formatPt"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import CampaignDetailsComentariosEmptyState from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsComentariosEmptyState.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"

const { core, tabs, display, comments } = useCampaignDetailsPageInject()
const {
    comments: commentItems,
    commentsLoading,
    commentsPage,
    commentsTotal,
    tabPageSize,
    goCommentsPrev,
    goCommentsNext,
} = tabs
const { canPostComment } = display
const {
    commentBody,
    submitComment,
    commentComposerInitials,
    canSubmitComment,
    postingComment,
    commentAuthorInitials,
    visibilitySavingId,
    setCommentVisibility,
} = comments
const campaign = computed(() => core.campaign.value!)
const profile = computed(() => core.profile.value)
</script>

<template>
    <div id="campaign-panel-comentarios" role="tabpanel" aria-labelledby="campaign-tab-comentarios" class="flex min-h-0 flex-1 flex-col overflow-hidden">
                        <form
                            v-if="canPostComment"
                            class="mb-3 flex shrink-0 items-start gap-3 border-b border-neutral-200 pb-3"
                            @submit.prevent="submitComment"
                        >
                            <div
                                class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-[11px] font-semibold text-neutral-700"
                                aria-hidden="true"
                            >
                                {{ commentComposerInitials }}
                            </div>
                            <div class="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                                <label for="campaign-new-comment" class="sr-only">Adiciona um comentário</label>
                                <textarea
                                    id="campaign-new-comment"
                                    v-model="commentBody"
                                    rows="1"
                                    :maxlength="CAMPAIGN_COMMENT_MAX"
                                    placeholder="Adiciona um comentário…"
                                    class="max-h-24 min-h-[36px] w-full flex-1 resize-none border-0 bg-transparent py-1.5 text-sm leading-5 text-neutral-950 outline-none placeholder:text-neutral-400"
                                    @keydown.enter.exact.prevent="submitComment"
                                />
                                <button
                                    type="submit"
                                    class="shrink-0 self-end text-sm font-semibold text-blue-600 outline-none enabled:hover:text-blue-700 focus-visible:underline disabled:cursor-not-allowed disabled:opacity-40"
                                    :disabled="!canSubmitComment"
                                >
                                    {{ postingComment ? "A publicar…" : "Publicar" }}
                                </button>
                            </div>
                        </form>

                        <p
                            v-if="profile && !canPostComment"
                            class="mb-3 text-xs leading-5 text-neutral-500"
                        >
                            Só o organizador, moderadores ou voluntários inscritos nesta campanha podem publicar aqui.
                        </p>

                        <div v-if="commentsLoading" class="py-6 text-center text-sm text-neutral-500">A carregar comentários…</div>

                        <CampaignDetailsComentariosEmptyState
                            v-else-if="campaign.metrics.commentsCount === 0"
                            :can-post-comment="canPostComment"
                        />

                        <ScrollableTableSection v-else fill-container>
                            <ul role="list" class="m-0 flex list-none flex-col divide-y divide-neutral-100 p-0">
                                <li v-for="comment in commentItems" :key="comment.id" class="py-3 first:pt-3">
                                    <article class="flex gap-3">
                                        <div
                                            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-[11px] font-semibold text-neutral-700"
                                            aria-hidden="true"
                                        >
                                            {{ commentAuthorInitials(comment) }}
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="flex items-start justify-between gap-3">
                                                <div class="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                                    <span class="text-sm font-semibold leading-5 text-neutral-950">{{
                                                        comment.user?.name ?? "Utilizador"
                                                    }}</span>
                                                    <span
                                                        v-if="profile?.isOrgAdmin && comment.isVisible === false"
                                                        class="text-[10px] font-medium uppercase tracking-wide text-red-600"
                                                    >Oculto</span>
                                                    <span class="text-xs text-neutral-400" aria-hidden="true">·</span>
                                                    <time
                                                        class="text-xs leading-5 text-neutral-400"
                                                        :datetime="comment.createdAt"
                                                    >{{ formatCommentTimeAgo(comment.createdAt) }}</time>
                                                </div>
                                                <button
                                                    v-if="profile?.isOrgAdmin"
                                                    type="button"
                                                    class="shrink-0 text-xs font-semibold text-neutral-500 outline-none hover:text-neutral-800 focus-visible:underline disabled:opacity-50"
                                                    :disabled="visibilitySavingId === comment.id"
                                                    @click="setCommentVisibility(comment, comment.isVisible === false)"
                                                >
                                                    {{
                                                        visibilitySavingId === comment.id
                                                            ? "…"
                                                            : comment.isVisible === false
                                                              ? "Mostrar"
                                                              : "Ocultar"
                                                    }}
                                                </button>
                                            </div>
                                            <p class="mt-1.5 text-sm leading-5 whitespace-pre-wrap text-neutral-950">
                                                {{ comment.body }}
                                            </p>
                                        </div>
                                    </article>
                                </li>
                            </ul>

                            <template #footer>
                            <ListPaginationBar
                                v-if="commentsTotal > tabPageSize"
                                :page="commentsPage"
                                :page-size="tabPageSize"
                                :total="commentsTotal"
                                @prev="goCommentsPrev"
                                @next="goCommentsNext"
                            />
                            </template>
                        </ScrollableTableSection>

    </div>
</template>
