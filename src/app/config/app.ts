const rawName = import.meta.env.VITE_APP_NAME

export const appConfig = {
    name: typeof rawName === "string" && rawName.length > 0 ? rawName : "App",
} as const
