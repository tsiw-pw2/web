import { legalConfig } from "@/app/config/legal"

export const REQUEST_ACCOUNT_CONTACT_EMAIL = legalConfig.supportEmail

export const REQUEST_ACCOUNT_DEFAULT_FROM = "geral@cm-pvarzim.pt"

export const REQUEST_ACCOUNT_DEFAULT_TO = REQUEST_ACCOUNT_CONTACT_EMAIL

export const REQUEST_ACCOUNT_DEFAULT_SUBJECT = "Pedido de acesso à plataforma"

export const REQUEST_ACCOUNT_DEFAULT_RESPONSIBLE_NAME = "Maria Fernandes"

export const REQUEST_ACCOUNT_COPY_FEEDBACK_MS = 1600

export type RequestAccountChecklistItem = {
    label: string
    dotClass: string
}

export const REQUEST_ACCOUNT_CHECKLIST_ITEMS: RequestAccountChecklistItem[] = [
    { label: "Nome da organização", dotClass: "bg-emerald-500" },
    { label: "Pessoa responsável", dotClass: "bg-sky-500" },
    { label: "Email institucional", dotClass: "bg-violet-500" },
]
