<script setup>
import { useTemplateRef } from 'vue';
import { useDraggable } from '@vueuse/core';

const props = defineProps({
    isOpen: {
        required:true,
        type: Boolean,
        default: false
    },
})

const el = useTemplateRef('el');
const { style: styleDraggable } = useDraggable(el);
</script>

<template>
    <div v-if="props.isOpen" ref="el" :style="styleDraggable"
        class="z-50 fixed overflow-hidden rounded-lg sm:my-8 sm:w-full sm:max-w-lg">
        <slot />
    </div>
</template>