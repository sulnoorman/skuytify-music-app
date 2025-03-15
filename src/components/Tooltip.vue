<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: () => 'Tooltip title', // Default offset values
    },
    placement: {
        type: String,
        default: () => 'top'
    }
});

const tooltipTitleClassess = computed(() => {
    if (props.placement === 'top') return "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text- text-textColor bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100"
    else if (props.placement === 'bottom') return "absolute top-full z-50 left-[60px] top-[15px] transform-translate-x-1/2 mt-2 w-max px-2 p-1 text-sm text-textColor bg-background rounded shadow-lg opacity-0 group-hover:opacity-100"
});

</script>

<template>
    <!-- Tooltip Top -->
    <div class="relative group">
        <slot />

        <div :class="tooltipTitleClassess">
            {{ props.title }}
        </div>
    </div>
</template>