import { ref } from 'vue';
import { useSongsStore } from '@/store/songs';

export function useAudioPlayer() {
    const store = useSongsStore();

    const audio = ref(null);
    const isMuted = ref(false);
    const isPlaying = ref(false);
    const isLoading = ref(false);
    const endTime = ref('0.00');
    const startTime = ref('0.00');
    const userInteracted = ref(false);
    const currentSong = ref(store.songs[0]);

    // Load track to play
    function _loadTrack(trackIndex) {
        currentSong.value = store.songs[trackIndex];
        audio.value.src = store.songs[trackIndex].source;
        setTimeout(() => {
            isPlaying.value = true;
            isLoading.value = false;
            audio.value.play();
            audio.value.volume = 75 / 100
        }, 1200)
    }

    // Handle Run Track
    function handleRunTrack(indexOfSong) {
        isPlaying.value = !isPlaying.value
        if (!audio?.value) return;
        else {
            if (!userInteracted.value) {
                userInteracted.value = true;
                _loadTrack(indexOfSong);
            } else {
                if (audio?.value && audio.value?.paused) {
                    audio.value.play();
                } else if (audio?.value && !audio.value?.paused) {
                    audio.value.pause();
                } else return;
            }
        }
    }

    // Handle Click Card Song
    function handleChangeSong(indexOfSong) {
        userInteracted.value = false;
        isLoading.value = true;
        endTime.value = '0.00';
        startTime.value = '0.00';
        handleRunTrack(indexOfSong);
    }

    // Previous song function
    function prevSong() {
        // songIndex--
        store.activeIndex--
        isLoading.value = true;
        isPlaying.value = false;
        startTime.value = '0.00';
        endTime.value = '0.00';
        if (store.activeIndex < 0) {
            store.activeIndex = store.songs.length - 1;
        }
        _loadTrack(store.activeIndex);
    }

    // Next song function
    function nextSong() {
        // songIndex++
        store.activeIndex++
        isLoading.value = true;
        isPlaying.value = false;
        startTime.value = '0.00';
        endTime.value = '0.00';
        if (store.activeIndex > store.songs.length - 1) {
            store.activeIndex = 0
        }
        _loadTrack(store.activeIndex);
    }

    // ToggleMute
    const toggleMute = () => {
        if (audio?.value) {
            audio.value.muted = !audio.value.muted;
            isMuted.value = audio.value.muted;
        }
    };

    return {
        audio,
        isPlaying,
        isMuted,
        isLoading,
        endTime,
        startTime,
        currentSong,
        userInteracted,
        handleRunTrack,
        handleChangeSong,
        nextSong,
        prevSong,
        toggleMute,
    };
}
