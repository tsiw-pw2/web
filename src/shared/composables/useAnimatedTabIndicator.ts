import { nextTick, onBeforeUnmount, onMounted, type InjectionKey, type Ref } from "vue"

type TabRegistration = {
    el: HTMLElement
    isActive: () => boolean
}

export type AnimatedTabBarContext = {
    registerTab: (id: symbol, el: HTMLElement | null, isActive: () => boolean) => void
    updateIndicator: () => void
}

export const ANIMATED_TAB_BAR_KEY: InjectionKey<AnimatedTabBarContext> = Symbol("animatedTabBar")

const TRANSITION_MS = 300

function easeOut(t: number): number {
    return 1 - (1 - t) ** 3
}

function measureTab(tab: HTMLElement, track: HTMLElement): { x: number; w: number } {
    const trackRect = track.getBoundingClientRect()
    const tabRect = tab.getBoundingClientRect()
    return {
        x: tabRect.left - trackRect.left,
        w: tabRect.width,
    }
}

function getTargetScroll(scrollport: HTMLElement, tab: HTMLElement): number {
    const tabLeft = tab.offsetLeft
    const tabWidth = tab.offsetWidth
    const viewWidth = scrollport.clientWidth
    const maxScroll = scrollport.scrollWidth - viewWidth
    if (maxScroll <= 0) return 0

    const targetScroll = tabLeft - (viewWidth - tabWidth) / 2
    return Math.max(0, Math.min(targetScroll, maxScroll))
}

function needsScroll(scrollport: HTMLElement, tab: HTMLElement): boolean {
    const padding = 4
    const sp = scrollport.getBoundingClientRect()
    const tabRect = tab.getBoundingClientRect()
    return tabRect.left < sp.left + padding || tabRect.right > sp.right - padding
}

function paintIndicator(el: HTMLElement, x: number, w: number, visible: boolean) {
    el.style.transition = "none"
    el.style.transform = `translateX(${x}px)`
    el.style.width = `${w}px`
    el.style.opacity = visible ? "1" : "0"
}

// Composable que gere a lógica de animado separador indicador.
export function useAnimatedTabIndicator(
    trackRef: Ref<HTMLElement | null | undefined>,
    scrollportRef: Ref<HTMLElement | null | undefined>,
    indicatorRef: Ref<HTMLElement | null | undefined>,
) {
    const registrations = new Map<symbol, TabRegistration>()

    let resizeObserver: ResizeObserver | null = null
    let enableAnimationFrame = 0
    let updateFrame = 0
    let scrollAnimationFrame = 0
    let previousActiveEl: HTMLElement | null = null
    let hasPositionedOnce = false
    let canAnimate = false
    let isAnimating = false
    let pendingUpdate = false
    let currentX = 0
    let currentW = 0
    let indicatorAnimation: Animation | null = null

    function findActiveTab(): TabRegistration | null {
        for (const tab of registrations.values()) {
            if (tab.isActive()) return tab
        }
        return null
    }

    function cancelRunningAnimations() {
        indicatorAnimation?.cancel()
        indicatorAnimation = null
        cancelAnimationFrame(scrollAnimationFrame)
        scrollAnimationFrame = 0
    }

    function finishAnimation(nextX: number, nextW: number, activeEl: HTMLElement) {
        const el = indicatorRef.value
        if (el) paintIndicator(el, nextX, nextW, nextW > 0)

        currentX = nextX
        currentW = nextW
        previousActiveEl = activeEl
        hasPositionedOnce = true
        isAnimating = false
        indicatorAnimation = null

        if (pendingUpdate) {
            pendingUpdate = false
            scheduleUpdate()
        }
    }

    function snapTo(nextX: number, nextW: number, activeEl: HTMLElement) {
        cancelRunningAnimations()
        const el = indicatorRef.value
        if (!el) return

        currentX = nextX
        currentW = nextW
        paintIndicator(el, nextX, nextW, nextW > 0)
        previousActiveEl = activeEl
        hasPositionedOnce = true
    }

    function animateScrollLeft(scrollport: HTMLElement, targetScroll: number) {
        const startScroll = scrollport.scrollLeft
        const delta = targetScroll - startScroll
        if (Math.abs(delta) < 1) return

        const startTime = performance.now()

        function tick(now: number) {
            const t = Math.min(1, (now - startTime) / TRANSITION_MS)
            scrollport.scrollLeft = startScroll + delta * easeOut(t)
            if (t < 1) {
                scrollAnimationFrame = requestAnimationFrame(tick)
            } else {
                scrollAnimationFrame = 0
            }
        }

        scrollAnimationFrame = requestAnimationFrame(tick)
    }

    function animateTo(
        startX: number,
        startW: number,
        nextX: number,
        nextW: number,
        activeEl: HTMLElement,
    ) {
        const el = indicatorRef.value
        const scrollport = scrollportRef.value
        if (!el) {
            snapTo(nextX, nextW, activeEl)
            return
        }

        cancelRunningAnimations()
        isAnimating = true

        paintIndicator(el, startX, startW, startW > 0)

        indicatorAnimation = el.animate(
            [
                { transform: `translateX(${startX}px)`, width: `${startW}px`, offset: 0 },
                { transform: `translateX(${nextX}px)`, width: `${nextW}px`, offset: 1 },
            ],
            { duration: TRANSITION_MS, easing: "ease-out", fill: "forwards" },
        )

        if (scrollport && needsScroll(scrollport, activeEl)) {
            animateScrollLeft(scrollport, getTargetScroll(scrollport, activeEl))
        }

        indicatorAnimation.onfinish = () => finishAnimation(nextX, nextW, activeEl)
        indicatorAnimation.oncancel = () => {
            isAnimating = false
            indicatorAnimation = null
        }
    }

    function update() {
        if (isAnimating) {
            pendingUpdate = true
            return
        }
        pendingUpdate = false

        const track = trackRef.value
        if (!track) return

        const activeTab = findActiveTab()
        if (!activeTab) {
            const el = indicatorRef.value
            if (el) paintIndicator(el, currentX, currentW, false)
            previousActiveEl = null
            return
        }

        const activeEl = activeTab.el
        const { x: nextX, w: nextW } = measureTab(activeEl, track)

        if (!hasPositionedOnce || !canAnimate) {
            snapTo(nextX, nextW, activeEl)
            return
        }

        if (activeEl === previousActiveEl) {
            snapTo(nextX, nextW, activeEl)
            return
        }

        animateTo(currentX, currentW, nextX, nextW, activeEl)
    }

    function scheduleUpdate() {
        cancelAnimationFrame(updateFrame)
        void nextTick(() => {
            updateFrame = requestAnimationFrame(() => {
                updateFrame = 0
                update()
            })
        })
    }

    function registerTab(id: symbol, el: HTMLElement | null, isActive: () => boolean) {
        if (!el) {
            registrations.delete(id)
            scheduleUpdate()
            return
        }

        registrations.set(id, { el, isActive })
        scheduleUpdate()
    }

    function onWindowResize() {
        if (isAnimating) {
            pendingUpdate = true
            return
        }
        scheduleUpdate()
    }

    onMounted(() => {
        canAnimate = false
        resizeObserver = new ResizeObserver(() => {
            if (isAnimating) {
                pendingUpdate = true
                return
            }
            scheduleUpdate()
        })
        if (trackRef.value) {
            resizeObserver.observe(trackRef.value)
        }
        window.addEventListener("resize", onWindowResize, { passive: true })

        cancelAnimationFrame(enableAnimationFrame)
        enableAnimationFrame = requestAnimationFrame(() => {
            enableAnimationFrame = requestAnimationFrame(() => {
                canAnimate = true
                scheduleUpdate()
            })
        })
    })

    onBeforeUnmount(() => {
        cancelRunningAnimations()
        cancelAnimationFrame(enableAnimationFrame)
        cancelAnimationFrame(updateFrame)
        resizeObserver?.disconnect()
        resizeObserver = null
        window.removeEventListener("resize", onWindowResize)
    })

    return {
        registerTab,
        updateIndicator: scheduleUpdate,
    }
}
