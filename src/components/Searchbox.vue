<template>
    <div :class="props.classProps">
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
                <svg class="w-4 h-4 text-textColor" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>
            <input 
                v-model="value" 
                :placeholder="props.placeholder" 
                @keyup.enter="log"
                class="block w-full p-3 ps-12 text-md text-textColorSoft rounded-full bg-backgroundSecondary outline-none transition-colors ease-linear"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    classProps: String,
    placeholder: String,
});

const emits = defineEmits(['search']);

const value = ref('');

function log() {
    emits('search', value.value);
};

</script>