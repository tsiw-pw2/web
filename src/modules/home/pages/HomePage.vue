<script setup lang="ts">
import HomeActiveCampaignsSection from "@/modules/home/views/components/HomeActiveCampaignsSection.vue"
import HomeFeaturesSection from "@/modules/home/views/components/HomeFeaturesSection.vue"
import HomeHeroSection from "@/modules/home/views/components/HomeHeroSection.vue"
import PublicSiteFooter from "@/shared/components/layout/PublicSiteFooter.vue"
import PublicSiteHeader from "@/shared/components/layout/PublicSiteHeader.vue"
import { usePublicSiteNav } from "@/shared/composables/usePublicSiteNav"

const { isAuthenticated } = usePublicSiteNav()
</script>

<template>
    <div class="flex min-h-screen flex-col bg-white text-neutral-950">
        <PublicSiteHeader />
        <main class="flex-1">
            <HomeHeroSection />
            <HomeActiveCampaignsSection :is-authenticated="isAuthenticated" />
            <HomeFeaturesSection />
        </main>
        <PublicSiteFooter />
    </div>
</template>
