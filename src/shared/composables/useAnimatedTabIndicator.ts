import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
    type InjectionKey,
    type Ref,
} from "vue"

type TabRegistration = {
    el: HTMLElement
    isActive: () => boolean
}

export type AnimatedTabBarContext = {
    registerTab: (id: symbol, el: HTMLElement | null, isActive: () => boolean) => void
    updateIndicator: () => void
}

export const ANIMATED_TAB_BAR_KEY: InjectionKey<AnimatedTabBarContext> = Symbol("animatedTabBar")

export function useAnimatedTabIndicator(containerRef: Ref<HTMLElement | null | undefined>) {
    const registrations = ref(new Map<symbol, TabRegistration>())
    const offsetX = ref(0)
    const width = ref(0)
    const visible = ref(false)
    const transitionsEnabled = ref(false)

    let resizeObserver: ResizeObserver | null = null
    let enableTransitionsFrame = 0

    function scheduleEnableTransitions() {
        if (transitionsEnabled.value) return
        cancelAnimationFrame(enableTransitionsFrame)
        enableTransitionsFrame = requestAnimationFrame(() => {
            enableTransitionsFrame = requestAnimationFrame(() => {
                transitionsEnabled.value = true
            })
        })
    }

    function update() {
        const container = containerRef.value
        if (!container) return

        let activeTab: TabRegistration | null = null
        for (const tab of registrations.value.values()) {
            if (tab.isActive()) {
                activeTab = tab
                break
            }
        }

        if (!activeTab) {
            visible.value = false
            return
        }

        const containerRect = container.getBoundingClientRect()
        const tabRect = activeTab.el.getBoundingClientRect()
        offsetX.value = tabRect.left - containerRect.left + container.scrollLeft
        width.value = tabRect.width
        visible.value = width.value > 0

        if (visible.value) {
            scheduleEnableTransitions()
        }
    }

    function registerTab(id: symbol, el: HTMLElement | null, isActive: () => boolean) {
        if (!el) {
            registrations.value.delete(id)
            void nextTick(update)
            return
        }
        registrations.value.set(id, { el, isActive })
        resizeObserver?.observe(el)
        void nextTick(update)
    }

    function onWindowResize() {
        update()
    }

    onMounted(() => {
        transitionsEnabled.value = false
        resizeObserver = new ResizeObserver(() => update())
        if (containerRef.value) {
            resizeObserver.observe(containerRef.value)
        }
        containerRef.value?.addEventListener("scroll", update, { passive: true })
        window.addEventListener("resize", onWindowResize, { passive: true })
        void nextTick(update)
    })

    onBeforeUnmount(() => {
        cancelAnimationFrame(enableTransitionsFrame)
        resizeObserver?.disconnect()
        containerRef.value?.removeEventListener("scroll", update)
        window.removeEventListener("resize", onWindowResize)
    })

    watch(registrations, () => void nextTick(update), { deep: true })

    const indicatorStyle = computed(() => ({
        transform: `translateX(${offsetX.value}px)`,
        width: `${width.value}px`,
        opacity: visible.value ? 1 : 0,
    }))

    return {
        indicatorStyle,
        transitionsEnabled,
        registerTab,
        updateIndicator: update,
    }
}
