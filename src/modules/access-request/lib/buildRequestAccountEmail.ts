// Constrói pedido conta e-mail body.
export function buildRequestAccountEmailBody(responsibleName: string, institutionalEmail: string): string {
    return [
        "Exmos. Senhores,",
        "",
        "Venho por este meio solicitar o acesso à plataforma em nome da nossa organização.",
        "",
        `Responsável: ${responsibleName}`,
        `Email: ${institutionalEmail}`,
        "",
        "Confirmo que estou autorizada a solicitar acesso em nome desta câmara.",
        "",
        "Com os melhores cumprimentos,",
        responsibleName,
    ].join("\n")
}

// Constrói pedido conta e-mail preview.
export function buildRequestAccountEmailPreview(
    emailFrom: string,
    emailTo: string,
    emailSubject: string,
    body: string,
): string {
    return [`De: ${emailFrom}`, `Para: ${emailTo}`, `Assunto: ${emailSubject}`, "", body].join("\n")
}
