<script setup lang="ts">
import { computed } from "vue"
import { Info } from "lucide-vue-next"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip"

const props = withDefaults(
    defineProps<{
        label: string
        required?: boolean
        optional?: boolean
        tooltip?: string
        forId?: string
    }>(),
    {
        required: false,
        optional: false,
        tooltip: undefined,
        forId: undefined,
    }
)

const suffixText = computed(() => {
    if (props.required) return "*"
    if (props.optional) return "(opcional)"
    return ""
})

const suffixClass = computed(() => {
    if (props.required) return "text-red-500"
    return "text-neutral-500"
})
</script>

<template>
    <div class="flex items-center gap-2">
        <label class="text-sm font-medium leading-5 text-neutral-900" :for="props.forId">
            {{ props.label }}
            <span v-if="suffixText" :class="suffixClass">
                {{ suffixText }}
            </span>
        </label>
        <TooltipProvider v-if="props.tooltip">
            <Tooltip>
                <TooltipTrigger as-child>
                    <button type="button" class="text-neutral-500 hover:text-neutral-700" aria-label="Ajuda">
                        <Info class="size-4" />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    {{ props.tooltip }}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
</template>

