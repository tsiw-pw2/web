<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue"

defineOptions({ name: "ModalRoot" })

const open = defineModel<boolean>({ required: true })

const props = withDefaults(
    defineProps<{
        ariaLabelledby: string
        maxWidth?: "md" | "lg"
    }>(),
    {
        maxWidth: "lg",
    },
)

const panelRef = ref<HTMLElement | null>(null)

// Fecha o modal ao clicar no fundo.
function closeFromBackdrop() {
    open.value = false
}

const maxWidthClass = computed(() => (props.maxWidth === "md" ? "max-w-md" : "max-w-lg"))

let escapeKeyHandler: ((e: KeyboardEvent) => void) | null = null

onBeforeUnmount(() => {
    if (escapeKeyHandler) {
        document.removeEventListener("keydown", escapeKeyHandler)
        escapeKeyHandler = null
    }
})

// Verifica se o elemento está provavelmente visível.
function isLikelyVisible(el: HTMLElement): boolean {
    if (el.closest('[aria-hidden="true"]')) return false
    const r = el.getBoundingClientRect()
    if (r.width <= 0 && r.height <= 0) return false
    const st = window.getComputedStyle(el)
    if (st.visibility === "hidden" || st.display === "none") return false
    return true
}

// Tenta focar o primeiro campo editável do painel.
function tryFocusFirstField(panel: HTMLElement): boolean {
    const form = panel.querySelector("form")
    const scope = form ?? panel

    const primarySelector = [
        'input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([disabled]):not(.sr-only)',
        "textarea:not([disabled])",
        "select:not([disabled])",
        'button[role="combobox"]:not([disabled])',
    ].join(", ")

    const primary = scope.querySelectorAll<HTMLElement>(primarySelector)
    for (const el of primary) {
        if (!isLikelyVisible(el)) continue
        el.focus({ preventScroll: true })
        return true
    }

    const buttons = scope.querySelectorAll<HTMLButtonElement>("button:not([disabled])")
    for (const b of buttons) {
        if (b.getAttribute("aria-label") === "Fechar") continue
        if (!isLikelyVisible(b)) continue
        b.focus({ preventScroll: true })
        return true
    }

    return false
}

// Agenda tentativas de foco no primeiro campo do modal.
function scheduleInitialFocus(panel: HTMLElement | null) {
    if (!panel) return
    // Executa o foco inicial no primeiro campo.
    const run = () => {
        tryFocusFirstField(panel)
    }
    queueMicrotask(run)
    requestAnimationFrame(run)
    window.setTimeout(run, 0)
    window.setTimeout(run, 120)
    window.setTimeout(run, 360)
}

watch(
    open,
    async (isOpen) => {
        if (escapeKeyHandler) {
            document.removeEventListener("keydown", escapeKeyHandler)
            escapeKeyHandler = null
        }
        if (!isOpen) return
        escapeKeyHandler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeFromBackdrop()
        }
        document.addEventListener("keydown", escapeKeyHandler)
        await nextTick()
        scheduleInitialFocus(panelRef.value)
    },
    { flush: "post" },
)

</script>

<template>
    <Teleport to="body">
        <Transition name="modal-frame">
            <div v-if="open" class="fixed inset-0 z-100 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="presentation" @click.self="closeFromBackdrop">
                <div
                    ref="panelRef"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="props.ariaLabelledby"
                    class="modal-frame-panel flex max-h-[calc(100dvh-1rem)] w-full flex-col gap-4 overflow-y-auto overscroll-contain rounded-t-2xl bg-white p-4 shadow-card sm:max-h-[min(90dvh,48rem)] sm:rounded-2xl"
                    :class="maxWidthClass"
                    @click.stop
                >
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>