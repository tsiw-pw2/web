const AUTH_API_MESSAGE_PT: Record<string, string> = {
    "Validation failed": "Preenche os campos obrigatórios.",
    "Validation error": "Preenche os campos obrigatórios.",
    "Invalid credentials": "Credenciais inválidas.",
    Unauthorized: "Credenciais inválidas.",
    "Invalid credentials.": "Credenciais inválidas.",
    "Account blocked": "A tua conta foi bloqueada. Contacta a equipa Mariva se precisares de ajuda.",
    "Unable to create account": "Não foi possível criar a conta. Verifica os dados e tenta novamente.",
    "Invalid name, email or password": "Não foi possível criar a conta. Verifica os dados e tenta novamente.",
    "Birth date is required": "Indica a tua data de nascimento.",
    "Invalid birth date": "Data de nascimento inválida.",
    "Minimum age not met": "Precisas de ter pelo menos 16 anos para participar em campanhas.",
    "Missing required fields": "Preenche os campos obrigatórios.",
    "Invalid credentials format": "Preenche o email e a palavra-passe.",
}

// Traduz mensagens conhecidas da API de autenticação para português.
export function mapAuthApiMessage(message: string | undefined, fallback: string): string {
    const trimmed = typeof message === "string" ? message.trim() : ""
    if (!trimmed) return fallback
    return AUTH_API_MESSAGE_PT[trimmed] ?? fallback
}
