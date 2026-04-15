import { getApiBaseUrl } from "./config"

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
	const base = getApiBaseUrl()
	const normalizedPath = path.startsWith("/") ? path : `/${path}`
	const url = `${base}${normalizedPath}`
	const headers = new Headers(init?.headers)
	if (!headers.has("Accept")) {
		headers.set("Accept", "application/json")
	}
	const res = await fetch(url, {
		...init,
		credentials: "include",
		headers,
	})
	if (!res.ok) {
		throw new Error("Request failed")
	}
	return res.json() as Promise<T>
}
