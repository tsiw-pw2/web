import { API_UNAVAILABLE_NETWORK_MESSAGE, API_UNAVAILABLE_RESPONSE_MESSAGE, } from "@/infrastructure/apiErrors"
import { CLIENT_SAFE_REQUEST_FAILED } from "@/infrastructure/request"
import { LOGIN_GENERIC_ERROR_MESSAGE } from "@/modules/auth/lib/loginFormConstants"
import { REGISTER_GENERIC_ERROR_MESSAGE } from "@/modules/auth/lib/registerFormConstants"
import { beachCreateMutationMessages, beachDeleteMutationMessages, beachSaveMutationMessages, } from "@/modules/beaches/lib/beachListMutationMessages"
import { campaignsCreateMutationMessages, campaignsDeleteMutationMessages, campaignsSaveMutationMessages, } from "@/modules/campaigns/lib/campaignsListMutationMessages"
import { wasteCreateMutationMessages, wasteDeleteMutationMessages, wasteSaveMutationMessages, } from "@/modules/waste/lib/wasteListMutationMessages"
import { avatarFileValidationMessage } from "@/shared/lib/avatarConstraints"

export type ShowcaseErrorMessageRow = {
    context: string
    title?: string
    text: string
    source: string
}

export type ShowcaseErrorMessageGroup = {
    id: string
    label: string
    description?: string
    rows: ShowcaseErrorMessageRow[]
}

function row(
    context: string,
    text: string,
    source: string,
    title?: string,
): ShowcaseErrorMessageRow {
    return { context, text, source, ...(title ? { title } : {}) }
}

export const SHOWCASE_ERROR_MESSAGE_GROUPS: ShowcaseErrorMessageGroup[] = [
    {
        id: "infra",
        label: "Infraestrutura",
        description: "Rede, HTTP e mutações partilhadas.",
        rows: [
            row("Rede / fetch falhou", API_UNAVAILABLE_NETWORK_MESSAGE, "infrastructure/apiErrors.ts"),
            row("Resposta indisponível (502/503/504, HTML, corpo vazio)", API_UNAVAILABLE_RESPONSE_MESSAGE, "infrastructure/apiErrors.ts"),
            row("Pedido autenticado genérico", CLIENT_SAFE_REQUEST_FAILED, "infrastructure/request.ts"),
            row("Fallback de listagem paginada", "Verifica a ligação e tenta outra vez.", "shared/composables/usePaginatedListRoute.ts"),
            row(
                "Carregar recurso (template)",
                "Não foi possível carregar {recurso}. Tenta outra vez.",
                "infrastructure/apiErrors.ts · describeApiLoadFailure",
            ),
            row("HTTP 401", "A sessão expirou ou deixou de ser válida. Inicia sessão outra vez.", "infrastructure/apiMutationToast.ts"),
            row("HTTP 403 (genérico)", "Não tens permissão para esta ação.", "infrastructure/apiMutationToast.ts"),
            row(
                "HTTP 409 (genérico)",
                "Este nome ou combinação já está a ser utilizada. Ajusta os dados e tenta outra vez.",
                "infrastructure/apiMutationToast.ts",
            ),
            row(
                "HTTP 400",
                "Os dados enviados não são válidos. Revisa os campos obrigatórios e o formato.",
                "infrastructure/apiMutationToast.ts",
            ),
            row("HTTP 429", "Foram feitos demasiados pedidos seguidos. Espera um pouco e tenta outra vez.", "infrastructure/apiMutationToast.ts"),
            row(
                "HTTP 5xx",
                "O serviço está temporariamente indisponível. Tenta outra vez dentro de momentos.",
                "infrastructure/apiMutationToast.ts",
            ),
            row(
                "Mutação (fallback)",
                "Verifica a ligação, os dados e tenta outra vez.",
                "infrastructure/apiMutationToast.ts · describeListMutationFailure",
            ),
            row("Toast mutação - criar", "Não foi possível criar", "infrastructure/apiMutationToast.ts · toastFromListMutationError"),
            row("Toast mutação - guardar", "Não foi possível guardar", "infrastructure/apiMutationToast.ts · toastFromListMutationError"),
            row("Toast mutação - eliminar", "Não foi possível eliminar", "infrastructure/apiMutationToast.ts · toastFromListMutationError"),
            row("Toast mutação - serviço", "Serviço indisponível", "infrastructure/apiMutationToast.ts · toastFromListMutationError"),
            row("Toast serviço (login/registo)", "Não foi possível entrar", "infrastructure/appToast.ts · toastServiceUnavailable"),
            row(
                "Lista desatualizada (toast)",
                "Se não vires a alteração, recarrega a página ou volta a esta secção.",
                "infrastructure/appToast.ts · toastListPossiblyStale",
                "Lista poderá estar desatualizada",
            ),
        ],
    },
    {
        id: "auth",
        label: "Autenticação e conta",
        rows: [
            row("Login - credenciais", "Credenciais inválidas.", "modules/auth/services/login.ts"),
            row("Login - genérico", LOGIN_GENERIC_ERROR_MESSAGE, "modules/auth/lib/loginFormConstants.ts"),
            row(
                "Conta bloqueada (fallback)",
                "A tua conta foi bloqueada. Contacta a equipa Mariva se precisares de ajuda.",
                "modules/auth/services/login.ts",
            ),
            row("Login - toast bloqueio", "Conta bloqueada", "modules/auth/composables/login/useLoginSubmit.ts"),
            row("Registo - genérico", REGISTER_GENERIC_ERROR_MESSAGE, "modules/auth/lib/registerFormConstants.ts"),
            row(
                "Registo - confirmação palavra-passe",
                "A confirmação não coincide com a palavra-passe.",
                "modules/auth/composables/register/useRegisterSubmit.ts",
            ),
            row(
                "Perfil - sessão inválida",
                "Não foi possível carregar o perfil. Confirma que tens sessão iniciada.",
                "composables/useCurrentProfile.ts",
            ),
            row(
                "Segurança - conta bloqueada",
                "Não podes alterar a palavra-passe enquanto a conta estiver bloqueada.",
                "modules/settings/pages/SettingsSecurityPage.vue",
            ),
            row(
                "Palavra-passe - confirmação",
                "A confirmação não coincide com a nova palavra-passe.",
                "modules/settings/composables/settings-profile/useSettingsProfilePassword.ts",
            ),
            row(
                "Palavra-passe - comprimento",
                "A nova palavra-passe deve ter pelo menos 8 caracteres.",
                "modules/settings/composables/settings-profile/useSettingsProfilePassword.ts",
            ),
            row(
                "Palavra-passe - guardar (prefixo)",
                "Não foi possível alterar a palavra-passe. {detalhe mutação}",
                "modules/settings/composables/settings-profile/useSettingsProfilePassword.ts",
            ),
        ],
    },
    {
        id: "profile",
        label: "Perfil e avatar",
        rows: [
            row(
                "Avatar - validação falhou",
                "Não foi possível validar a foto. Recarrega a página ou remove a imagem.",
                "modules/settings/composables/settings-profile/useSettingsProfileSave.ts",
            ),
            row("Avatar - tipo inválido", avatarFileValidationMessage("type"), "shared/lib/avatarConstraints.ts"),
            row("Avatar - tamanho", avatarFileValidationMessage("size"), "shared/lib/avatarConstraints.ts"),
            row("Avatar - toast", "Imagem inválida", "modules/settings/composables/settings-profile/useSettingsProfileForm.ts"),
            row(
                "Perfil - guardar (prefixo)",
                "Não foi possível guardar. {detalhe mutação}",
                "modules/settings/composables/settings-profile/useSettingsProfileSave.ts",
            ),
        ],
    },
    {
        id: "load-states",
        label: "Carregamento",
        description: "Títulos ResourceErrorState; o hint depende do pedido.",
        rows: [
            row("Dashboard", "Não foi possível carregar o painel", "modules/dashboard/pages/DashboardPage.vue"),
            row("Campanhas (lista)", "Não foi possível carregar as campanhas.", "modules/campaigns/views/states/CampaignsErrorState.vue"),
            row("Campanha (detalhe)", "Não foi possível carregar a campanha", "modules/campaigns/views/pages/CampaignDetailsPage.vue"),
            row("Praias", "Não foi possível carregar as praias.", "modules/beaches/views/states/BeachesErrorState.vue"),
            row("Resíduos", "Não foi possível carregar os resíduos.", "modules/waste/views/states/WasteErrorState.vue"),
            row("Definições", "Não foi possível carregar as definições", "modules/settings/pages/SettingsLayout.vue"),
            row("Utilizadores (admin)", "Não foi possível carregar os utilizadores", "modules/settings/views/components/settings-users/SettingsUsersPageHeader.vue"),
            row("Utilizador (detalhe admin)", "{describeApiLoadFailure - o utilizador}", "modules/settings/composables/settings-user-details/useSettingsUserDetails.ts"),
            row("Categorias resíduos", "Não foi possível carregar as categorias", "modules/settings/pages/SettingsWasteCategoriesPage.vue"),
        ],
    },
    {
        id: "campaigns",
        label: "Campanhas",
        rows: [
            row("Editar modal - carregar", "Não foi possível carregar", "modules/campaigns/views/components/EditCampaignModal.vue"),
            row(
                "Editar modal - detalhe",
                "Não foi possível obter os dados da campanha para editar.",
                "modules/campaigns/views/components/EditCampaignModal.vue",
            ),
            row("Tab sem permissão", "Não tens permissão para esta ação.", "modules/campaigns/composables/campaign-details/useCampaignDetailsTabs.ts"),
            row("Inscrição - 403", "Não tens permissão para esta ação.", "modules/campaigns/composables/campaign-details/useCampaignRegistrationActions.ts"),
            row(
                "Inscrição - 404",
                "Campanha ou inscrição não encontrada.",
                "modules/campaigns/composables/campaign-details/useCampaignRegistrationActions.ts",
            ),
            row(
                "Inscrição - falha genérica (detalhe)",
                "Verifica a ligação e tenta outra vez.",
                "modules/campaigns/composables/campaign-details/useCampaignRegistrationActions.ts",
            ),
            row("Inscrição - concluir", "Não foi possível concluir a inscrição.", "useCampaignRegistrationActions.ts"),
            row("Inscrição - cancelar", "Não foi possível cancelar a inscrição.", "useCampaignRegistrationActions.ts"),
            row("Inscrição - guardar", "Não foi possível guardar a inscrição.", "useCampaignRegistrationActions.ts"),
            row(
                "Comentário - visibilidade",
                "Tenta outra vez.",
                "modules/campaigns/composables/campaign-details/useCampaignDetailsComments.ts",
                "Não foi possível atualizar",
            ),
            row(
                "Comentário - publicar",
                "Verifica a ligação e tenta outra vez.",
                "modules/campaigns/composables/campaign-details/useCampaignDetailsComments.ts",
                "Não foi possível publicar",
            ),
            row(
                "Comentário - 403",
                "Confirma a tua inscrição nesta campanha ou fala com o organizador.",
                "modules/campaigns/composables/campaign-details/useCampaignDetailsComments.ts",
                "Não podes publicar aqui",
            ),
            row(
                "Recolha - 403",
                "Confirma a tua inscrição ou fala com o organizador.",
                "modules/campaigns/composables/campaign-details/useCampaignDetailsWaste.ts",
                "Não podes registar aqui",
            ),
            row(
                "Recolha - falha",
                "Verifica os dados e tenta outra vez.",
                "modules/campaigns/composables/campaign-details/useCampaignDetailsWaste.ts",
                "Não foi possível registar",
            ),
            row("Criar campanha - 403", campaignsCreateMutationMessages.forbiddenDetail, "modules/campaigns/lib/campaignsListMutationMessages.ts"),
            row("Guardar campanha - 403", campaignsSaveMutationMessages.forbiddenDetail, "modules/campaigns/lib/campaignsListMutationMessages.ts"),
            row("Eliminar campanha - 403", campaignsDeleteMutationMessages.forbiddenDetail, "modules/campaigns/lib/campaignsListMutationMessages.ts"),
        ],
    },
    {
        id: "beaches",
        label: "Praias",
        rows: [
            row("Criar - 403", beachCreateMutationMessages.forbiddenDetail, "modules/beaches/lib/beachListMutationMessages.ts"),
            row("Criar - 409", beachCreateMutationMessages.conflictDetail, "modules/beaches/lib/beachListMutationMessages.ts"),
            row("Guardar - 403", beachSaveMutationMessages.forbiddenDetail, "modules/beaches/lib/beachListMutationMessages.ts"),
            row("Guardar - 409", beachSaveMutationMessages.conflictDetail, "modules/beaches/lib/beachListMutationMessages.ts"),
            row("Eliminar - 403", beachDeleteMutationMessages.forbiddenDetail, "modules/beaches/lib/beachListMutationMessages.ts"),
        ],
    },
    {
        id: "waste",
        label: "Resíduos",
        rows: [
            row("Criar - 403", wasteCreateMutationMessages.forbiddenDetail, "modules/waste/lib/wasteListMutationMessages.ts"),
            row("Criar - 409", wasteCreateMutationMessages.conflictDetail, "modules/waste/lib/wasteListMutationMessages.ts"),
            row("Guardar - 403", wasteSaveMutationMessages.forbiddenDetail, "modules/waste/lib/wasteListMutationMessages.ts"),
            row("Guardar - 409", wasteSaveMutationMessages.conflictDetail, "modules/waste/lib/wasteListMutationMessages.ts"),
            row("Eliminar - 403", wasteDeleteMutationMessages.forbiddenDetail, "modules/waste/lib/wasteListMutationMessages.ts"),
        ],
    },
    {
        id: "settings-admin",
        label: "Definições (admin)",
        rows: [
            row(
                "Categorias - criar 403",
                "Só administradores podem gerir categorias.",
                "modules/settings/composables/settings-waste-categories/useSettingsWasteCategories.ts",
            ),
            row(
                "Categorias - conflito nome",
                "Já existe uma categoria com este nome.",
                "modules/settings/composables/settings-waste-categories/useSettingsWasteCategories.ts",
            ),
            row(
                "Categorias - eliminar com resíduos",
                "Não podes eliminar: existem resíduos associados a esta categoria.",
                "modules/settings/composables/settings-waste-categories/useSettingsWasteCategories.ts",
            ),
            row(
                "Admin - auto-remover papel",
                "Não podes remover o teu próprio acesso de administrador.",
                "modules/settings/pages/SettingsUserDetailsPage.vue",
            ),
        ],
    },
    {
        id: "showcase-demo",
        label: "Galeria (demo)",
        description: "Exemplos só em /componentes.",
        rows: [
            row("Input com erro inline", "Este campo é obrigatório.", "modules/dev/pages/ComponentShowcasePage.vue"),
            row("ResourceErrorState demo", "Verifica a ligação e tenta outra vez.", "ComponentShowcasePage.vue"),
        ],
    },
]

export function showcaseErrorMessageCount(): number {
    return SHOWCASE_ERROR_MESSAGE_GROUPS.reduce((sum, group) => sum + group.rows.length, 0)
}
