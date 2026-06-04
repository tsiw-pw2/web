export const AVATAR_MAX_BYTES = 2 * 1024 * 1024

export const AVATAR_ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const

export type AvatarValidationIssue = "type" | "size"

// Valida avatar file.
export function validateAvatarFile(file: File):
    | {
          ok: true
      }
    | {
          ok: false
          issue: AvatarValidationIssue
      } {
    const mime = file.type || ""
    if (!AVATAR_ALLOWED_MIME_TYPES.includes(mime as (typeof AVATAR_ALLOWED_MIME_TYPES)[number])) {
        return { ok: false, issue: "type" }
    }
    if (file.size > AVATAR_MAX_BYTES) {
        return { ok: false, issue: "size" }
    }
    return { ok: true }
}

// Mensagem de erro para tipo ou tamanho inválido do avatar.
export function avatarFileValidationMessage(issue: AvatarValidationIssue): string {
    if (issue === "type") {
        return "Escolhe uma imagem JPEG, PNG ou WebP."
    }
    return "A imagem não pode ultrapassar 2 MB."
}
