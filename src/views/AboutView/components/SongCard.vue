<script setup>
import Tooltip from '@/components/Tooltip.vue';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const emit = defineEmits(['onClickPlayButton']);

const props = defineProps({
    index: {
        type: Number,
        required: true,
    },
    item: {
        type: Object,
        default: () => null,
        required: true,
    },
});

function onClickPlay() {
    emit('onClickPlayButton', props.index)
}

</script>

<template>
    <div @click.prevent="onClickPlay"
        class="relative hover:bg-background p-2 rounded-lg w-40 cursor-pointer transition-colors ease-linear">
        <!-- Album Cover -->
        <div :alt="props.item?.title" :style="`background-image: url(${item.cover}); background-size:cover`"
            class="w-full h-[144px] mx-auto rounded-lg mb-2" />
        <!-- Button Play -->
        <div
            class="absolute hover:scale-105 bottom-[60px] right-[18px] w-[30px] h-[30px] p-4 dark:bg-primary bg-whiteApp rounded-full flex items-center justify-center cursor-pointer">
            <FontAwesomeIcon :icon="faPlay" class="text-base dark:text-whiteApp text-blackApp" />
        </div>
        <!-- Artist Name -->
        <Tooltip :title="props.item?.title" :placement="'bottom'">
            <p class="text-textColor text-xs line-clamp-2">{{ props.item?.title }}</p>
        </Tooltip>
    </div>
</template>