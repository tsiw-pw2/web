export function getApiBaseUrl(): string {
	const raw = import.meta.env.VITE_API_URL
	if (typeof raw !== "string" || raw.length === 0) {
		return ""
	}
	return raw.replace(/\/$/, "")
}
