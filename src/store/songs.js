import { defineStore } from "pinia";
import { songs } from '@/store/songsList';

export const useSongsStore = defineStore('songs', {
    state: () => ({
        songs: [...songs],
        activeIndex: 0,
    }),
});

