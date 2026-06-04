import type { CampaignDetailsComment } from "@/modules/campaigns/types/details"
import { initialsFromDisplayName } from "@/shared/lib/userInitials"

// Iniciais do autor no compositor de comentários.
export function commentComposerInitials(profileName: string | undefined): string {
    const s = initialsFromDisplayName(profileName ?? "")
    return s.length > 0 ? s : "?"
}

// Iniciais do autor de um comentário existente.
export function commentAuthorInitials(comment: CampaignDetailsComment): string {
    const s = initialsFromDisplayName(comment.user?.name ?? "Utilizador")
    return s.length > 0 ? s : "?"
}
