<script setup lang="ts">
import { onClickOutside } from "@vueuse/core"
import { computed, onMounted, ref, watch } from "vue"
import { RouterLink, useRouter } from "vue-router"
import { routePaths } from "@/app/router"
import { logoutSession } from "@/infrastructure/authLogout"
import {
    profileAvatarCacheBust,
    profileAvatarUrlCache,
    profileDisplayNameCache,
    setProfileSummaryCache,
} from "@/infrastructure/profileAvatarCache"
import { resolveAvatarDisplaySrc } from "@/shared/lib/avatarUrl"
import { fetchProfile } from "@/modules/settings/services/profile"
import { initialsFromDisplayName } from "@/shared/lib/userInitials"

defineOptions({ name: "UserMenuDropdown" })

const router = useRouter()
const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const loggingOut = ref(false)
const avatarImgFailed = ref(false)

onClickOutside(rootRef, () => {
    open.value = false
})

watch([profileAvatarUrlCache, profileAvatarCacheBust], () => {
    avatarImgFailed.value = false
})

const headerAvatarSrc = computed(() =>
    resolveAvatarDisplaySrc(profileAvatarUrlCache.value, profileAvatarCacheBust.value),
)

const menuInitials = computed(() => {
    const label = initialsFromDisplayName(profileDisplayNameCache.value ?? "")
    return label.length > 0 ? label : "?"
})

const showAvatarImage = computed(() => Boolean(profileAvatarUrlCache.value) && !avatarImgFailed.value)

onMounted(() => {
    void (async () => {
        try {
            const p = await fetchProfile()
            setProfileSummaryCache({ avatarUrl: p.avatarUrl ?? null, name: p.name })
        } catch {}
    })()
})

function toggle() {
    open.value = !open.value
}

function onAvatarImgError() {
    avatarImgFailed.value = true
}

async function onLogout() {
    if (loggingOut.value) return
    loggingOut.value = true
    open.value = false
    try {
        await logoutSession()
        await router.push({ name: "login" })
    } finally {
        loggingOut.value = false
    }
}
</script>

<template>

    <div ref="rootRef" class="relative shrink-0">
         <button
            type="button"
            class="flex cursor-pointer select-none rounded-full outline-none ring-offset-2 ring-offset-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-400"
            :aria-expanded="open"
            aria-haspopup="menu"
            @click="toggle"
        >
             <span class="sr-only">Abrir menu da conta</span> <img
                v-if="showAvatarImage"
                :key="headerAvatarSrc"
                :src="headerAvatarSrc"
                alt=""
                class="size-8 shrink-0 rounded-full object-cover ring-1 ring-neutral-700"
                @error="onAvatarImgError"
            /> <span v-else class="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-white ring-1 ring-neutral-700" aria-hidden="true"
                > {{ menuInitials }} </span
            > </button
        >
        <Transition name="user-menu-dropdown">
            <div
                v-if="open"
                role="menu"
                class="select-shadow-content absolute right-0 top-full z-60 mt-2 min-w-52 origin-top-right rounded-lg bg-white py-1 outline-none"
            >
                <RouterLink
                    role="menuitem"
                    :to="routePaths.settingsProfile"
                    class="block w-full cursor-pointer px-3 py-2 text-left text-sm font-medium leading-5 text-neutral-900 outline-none hover:bg-neutral-50 focus-visible:bg-neutral-50"
                    @click="open = false"
                >
                    Definições
                </RouterLink>
                <button
                    type="button"
                    role="menuitem"
                    class="w-full cursor-pointer px-3 py-2 text-left text-sm font-medium leading-5 text-neutral-900 outline-none hover:bg-neutral-50 focus-visible:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="loggingOut"
                    @click="onLogout"
                >
                    {{ loggingOut ? "A terminar…" : "Terminar sessão" }}
                </button>
            </div>
        </Transition>

    </div>

</template>

