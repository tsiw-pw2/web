import type { CampaignDetailsComment } from "@/modules/campaigns/types/details"
import { initialsFromDisplayName } from "@/shared/lib/userInitials"

export function commentComposerInitials(profileName: string | undefined): string {
    const s = initialsFromDisplayName(profileName ?? "")
    return s.length > 0 ? s : "?"
}

export function commentAuthorInitials(comment: CampaignDetailsComment): string {
    const s = initialsFromDisplayName(comment.user?.name ?? "Utilizador")
    return s.length > 0 ? s : "?"
}
