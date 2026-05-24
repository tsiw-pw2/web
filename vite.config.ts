import { fileURLToPath, URL } from "node:url"
import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "")
    const apiPort = env.VITE_DEV_API_PORT?.trim() || "3000"
    const apiTarget = `http://127.0.0.1:${apiPort}`

    return {
        plugins: [vue(), tailwindcss()],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        test: {
            environment: "node",
            include: ["src/**/*.test.ts"],
        },
        server: {
            proxy: {
                "^/(sessions|users|campaigns|beaches|waste-items|waste-categories)": {
                    target: apiTarget,
                    changeOrigin: true,
                },
                "/uploads": {
                    target: apiTarget,
                    changeOrigin: true,
                },
            },
        },
    }
})
