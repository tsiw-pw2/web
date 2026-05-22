import { getAccessToken, setAccessToken } from "./access-token"
import { getApiBaseUrl } from "./config"
import { setProfileSummaryCache } from "./profileAvatarCache"

export async function logoutSession(): Promise<void> {
	const url = `${getApiBaseUrl()}/auth/logout`
	const token = getAccessToken()
	const headers: HeadersInit = { Accept: "application/json" }
	if (token) {
		headers.Authorization = `Bearer ${token}`
	}
	try {
		await fetch(url, {
			method: "POST",
			credentials: "include",
			cache: "no-store",
			headers,
		})
	} finally {
		setAccessToken(null)
		setProfileSummaryCache(null)
	}
}
