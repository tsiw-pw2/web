function readEmail(value: string | undefined, fallback: string): string {
    if (typeof value === "string" && value.trim().length > 0) {
        return value.trim()
    }
    return fallback
}

const defaultSupport = "support@mariva.com"

const supportEmail = readEmail(import.meta.env.VITE_SUPPORT_EMAIL, defaultSupport)
const privacyEmail = readEmail(import.meta.env.VITE_PRIVACY_EMAIL, supportEmail)

export const legalConfig = {
    supportEmail,
    privacyEmail,
    organizerResponseBusinessDays: 5,
} as const
