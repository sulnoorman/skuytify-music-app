<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPlay, faPause, faStepForward, faStepBackward, faShuffle, faRepeat, faVolumeLow, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import SongCard from './components/SongCard.vue';
import SidebarAbout from './components/SidebarAbout.vue';

// Utils
// import { logger as log } from '@/utils/loger';
import { useEventListener } from '@/utils/eventListener';

// Songs list
// import { songs } from '@/utils/songs';

// Song Store
import { useSongsStore } from '@/store/songs';

const store = useSongsStore();

const audio = ref(null);
const volumeBar = ref(null);
const progressBar = ref(null);

const currentSong = ref(store.songs[0]);
const isMuted = ref(false);
const isPlaying = ref(false);
const isLoading = ref(false);
const isDragging = ref(false);
const isDraggingVolume = ref(false);

const barWidth = ref(0);
const endTime = ref('0.00');
const startTime = ref('0.00');
const barVolumeWidth = ref(75);

const userInteracted = ref(false);

const showCircleProgress = ref(false);
const showCircleVolumeBar = ref(false);

// Load track function
function loadTrack(trackIndex) {
  currentSong.value = store.songs[trackIndex];
  audio.value.src = store.songs[trackIndex].source;
  setTimeout(() => {
    isPlaying.value = true;
    isLoading.value = false;
    audio.value.play();
    audio.value.volume = barVolumeWidth.value / 100
  }, 1200)
}

// Handle Run Track
function handleRunTrack(indexOfSong) {
  isPlaying.value = !isPlaying.value
  if (!audio?.value) return;
  else {
    if (!userInteracted.value) {
      userInteracted.value = true;
      loadTrack(indexOfSong);
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
  loadTrack(store.activeIndex);
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
  loadTrack(store.activeIndex);
}

// Handle show hide circle progress bar
function handleShowCircle() {
  if (!isDragging.value) {
    showCircleProgress.value = !showCircleProgress.value
  }
}

// Handle show hide circle volume bar
function handleShowCircleVolume() {
  if (!isDraggingVolume.value) {
    showCircleVolumeBar.value = !showCircleVolumeBar.value
  }
}

// Start dragging
const startDragging = (e) => {
  isDragging.value = true;
  handleUpdateProgressBar(e)
  document.addEventListener("mousemove", handleDragging);
  document.addEventListener("mouseup", stopDragging);
};

// Handle dragging
const handleDragging = (e) => {
  if (isDragging?.value) {
    showCircleProgress.value = true
    handleUpdateProgressBar(e)
  }
}

// Stop dragging
const stopDragging = () => {
  if (isDragging.value) {
    isDragging.value = !isDragging.value
    showCircleProgress.value = false
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", stopDragging);
  }
}

// Handle drag progressbar
function handleUpdateProgressBar(e) {
  if (progressBar?.value && audio?.value) {
    const clientX = e.clientX
    const progressBarWidth = progressBar?.value.offsetWidth
    const rectLeft = progressBar?.value.getBoundingClientRect().left

    const clickX = clientX - rectLeft
    const seekTime = (clickX / progressBarWidth) * audio?.value?.duration
    const percentage = Math.min(Math.max(clickX / progressBarWidth, 0), 1)

    barWidth.value = percentage * 100;
    audio.value.currentTime = seekTime
  }
}

// Start dragging Volume Bar
const startDraggingVolume = (e) => {
  isDraggingVolume.value = true;
  handleVolumeChange(e)
  document.addEventListener("mousemove", handleDraggingVolume);
  document.addEventListener("mouseup", stopDraggingVolume);
};

// Handle dragging Volume Bar
const handleDraggingVolume = (e) => {
  if (isDraggingVolume?.value) {
    showCircleVolumeBar.value = true
    handleVolumeChange(e)
  }
}

// Stop dragging Volume Bar
const stopDraggingVolume = () => {
  if (isDraggingVolume.value) {
    isDraggingVolume.value = !isDraggingVolume.value
    showCircleVolumeBar.value = false
    document.removeEventListener("mousemove", handleDraggingVolume);
    document.removeEventListener("mouseup", stopDraggingVolume);
  }
}

// Update volume when the slider value changes
const handleVolumeChange = (e) => {
  if (volumeBar?.value && audio?.value) {
    const clientX = e.clientX
    const barWidth = volumeBar?.value.offsetWidth
    const rectLeft = volumeBar?.value.getBoundingClientRect().left

    const clickX = clientX - rectLeft
    const percentage = Math.min(Math.max(clickX / barWidth, 0), 1)

    barVolumeWidth.value = percentage * 100;
    audio.value.volume = percentage;
  }
};

// Toggle mute/unmute
const toggleMute = () => {
  if (audio?.value) {
    audio.value.muted = !audio.value.muted;
    isMuted.value = audio.value.muted;
  }
};

// Listen to spacebar key
useEventListener(window, 'keydown', true, (e) => {
  if (e.code === 'Space') handleRunTrack(store.activeIndex);
});

// On component mounted first time
onMounted(() => {
  // Listen time update audio
  useEventListener(audio.value, 'timeupdate', false, function () {
    if (!audio.value?.currentTime) return;

    let duration = audio.value?.duration;
    let currentTime = audio.value?.currentTime;

    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    let secondsWithLeadingZero = seconds < 10 ? '0' + seconds : seconds;

    let currentMinute = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor((currentTime % 60));

    let formattedCurrentTime = `${currentMinute}.${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    let endTimeVal = minutes + '.' + secondsWithLeadingZero;
    const progressPercent = (audio.value?.currentTime / audio.value?.duration) * 100;

    barWidth.value = progressPercent;
    startTime.value = formattedCurrentTime;
    if (endTime.value !== endTimeVal) endTime.value = endTimeVal;
  });

  // Add event listener for audio ended event
  useEventListener(audio.value, 'ended', false, function () {
    store.activeIndex++
    isPlaying.value = false;
    isLoading.value = true;
    endTime.value = '0.00';
    startTime.value = '0.00';
    if (store.activeIndex > store.songs.length - 1) {
      store.activeIndex = 0
    }
    loadTrack(store.activeIndex);
  });
});

// Clean up event listener
onUnmounted(() => {
  barWidth.value = 0
  audio.value = null;
  isPlaying.value = false;
  isLoading.value = false;
  userInteracted.value = false;
});
</script>

<template>
  <div class="h-full w-full flex flex-row gap-2">
    <!-- Sidebar -->
    <SidebarAbout />
    <!-- Main Content -->
    <div class="h-[calc(100%-5.5rem)] p-2 w-full bg-backgroundSecondary rounded-lg flex flex-col gap-y-2">
      <div class="flex flex-col gap-2 p-1">
        <h1 class="text-xl font-semibold text-white">Recently Plays</h1>
        <div class="flex flex-row gap-2 flex-wrap">
          <template v-for="(item, index) in store.songs">
            <SongCard :index="index" :item="item" @on-click-play-button="(index) => handleChangeSong(index)" />
          </template>
        </div>
      </div>
    </div>

    <!-- Audio Tag -->
    <audio ref="audio"></audio>

    <!-- Footer -->
    <footer
      class="footer px-5 pb-3 h-[5.5rem] fixed bottom-0 left-0 right-0 bg-background transition-colors ease-linear flex flex-row justify-between items-center">
      <!-- Active Song View -->
      <div class="w-[25%] pt-4 h-full flex flex-row gap-3">
        <template v-if="!isLoading">
          <div :style="`background-image: url(${currentSong?.cover})`" class="w-[70px] h-full bg-cover rounded-md" />
          <div class="flex flex-col items-start justify-center">
            <h1 style="font-size: 14px;" class="text-black dark:text-white hover:underline cursor-pointer line-clamp-1">{{
              currentSong.title }}</h1>
            <p class="text-sm text-textColor">{{ currentSong.artist }}</p>
          </div>
        </template>
      </div>
      <!-- Center Panel/Audio Player -->
      <div class="min-w-[40%] flex flex-col items-center justify-center gap-4">
        <!-- Top Section -->
        <div class="w-full flex flex-row justify-between items-center">
          <!-- Empty div for centering audio player -->
          <div class="w-[8rem]">
          </div>
          <!-- Audio Player -->
          <div class="flex flex-row justify-center items-center gap-7">
            <!-- Icon Shuffle -->
            <div>
              <FontAwesomeIcon :icon="faShuffle"
                class="text-base hover:text-primary dark:hover:text-whiteApp cursor-pointer" @click="" />
            </div>
            <!-- Icon Previous -->
            <div>
              <FontAwesomeIcon :icon="faStepBackward"
                class="text-xl hover:text-primary dark:hover:text-whiteApp cursor-pointer" @click="prevSong()" />
            </div>
            <!-- Icon Play / Pause -->
            <div
              class="w-[30px] h-[30px] p-4 bg-primary dark:bg-whiteApp rounded-full flex items-center justify-center cursor-pointer"
              @click="handleRunTrack(store.activeIndex)">
              <FontAwesomeIcon :icon="isPlaying ? faPause : faPlay" class="text-base text-whiteApp dark:text-blackApp"
                :style="{ 'margin-left': !isPlaying ? '2px' : '0' }" />
            </div>
            <!-- Icon Next -->
            <div>
              <FontAwesomeIcon :icon="faStepForward"
                class="text-xl hover:text-primary dark:hover:text-whiteApp cursor-pointer" @click="nextSong()" />
            </div>
            <!-- Icon Repeat -->
            <div>
              <FontAwesomeIcon :icon="faRepeat"
                class="text-base hover:text-primary dark:hover:text-whiteApp cursor-pointer" @click="" />
            </div>
          </div>
          <!-- Input Volume Control -->
          <div class="flex items-center gap-3">
            <!-- Icon Volume -->
            <div>
              <FontAwesomeIcon :icon="isMuted ? faVolumeXmark : faVolumeLow"
                class="text-xs hover:text-primary dark:hover:text-whiteApp cursor-pointer" @click="toggleMute" />
            </div>

            <!-- Volume Bar -->
            <div ref="volumeBar" class="volume-control-bar" @mousedown="startDraggingVolume($event)">
              <div
                class="h-full relative rounded-2xl cursor-pointer bg-blackApp dark:bg-whiteApp hover:bg-primary dark:hover:bg-primary transition duration-100"
                :style="{ width: barVolumeWidth + '%', 'background': showCircleVolumeBar ? 'hsla(160, 100%, 37%, 1)' : '' }"
                @mouseenter="handleShowCircleVolume()" @mouseleave="handleShowCircleVolume()">
                <div v-show="showCircleVolumeBar" class="circle-progress-volume bg-gray-400 dark:bg-whiteApp"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar Audio | Bottom Section -->
        <div class="wrapper-progress-bar">
          <!-- Audio start time -->
          <div class="song-time">{{ startTime }}</div>

          <!-- Proggress Bar -->
          <div ref="progressBar" class="progress-bar" @mousedown="startDragging($event)">
            <div
              class="h-full relative rounded-2xl cursor-pointer bg-blackApp dark:bg-whiteApp hover:bg-primary dark:hover:bg-primary transition duration-100"
              @mouseenter="handleShowCircle()" @mouseleave="handleShowCircle()"
              :style="{ 'width': barWidth + '%', 'background': showCircleProgress ? 'hsla(160, 100%, 37%, 1)' : '' }">
              <div v-show="showCircleProgress" class="circle-progress bg-gray-400 dark:bg-whiteApp"></div>
            </div>
          </div>

          <!-- Audio End time -->
          <div class="song-time">{{ endTime }}</div>
        </div>
      </div>
      <!-- Empty Div -->
      <div class="md:w-[20rem] lg:w-[28rem]"></div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.wrapper-player-section {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
}

.wrapper-status-text {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-icon {
  cursor: pointer;
  font-size: 20px;

  &:hover {
    color: #fff;
  }
}

.player-icon.center {
  color: #000;
  cursor: pointer;
  font-size: 20px;
}

.about {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 30px;
  min-height: 0px;
}

.title {
  width: 100%;
  font-size: 1.5rem;
  text-align: center;
  transition: .5ms;
}

/* Inital progress bar style */
.wrapper-progress-bar {
  width: 100%;
  height: 3px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;

  .song-time {
    font-weight: 500;
    font-size: 0.9rem;
  }
}

.progress-bar {
  width: 100%;
  height: 4.75px;
  cursor: pointer;
  border-radius: 20px;
  background-color: #9f9d9a;
}

.progress {
  height: 100%;
  position: relative;
  border-radius: 20px;
  cursor: pointer;
  transition: width 0.1s;
  background-color: #fff;

  &:hover {
    height: 120%;
    background-color: hsla(160, 100%, 37%, 1);
  }
}

.circle-progress {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50px;
  right: 0;
  top: -4px;
}

.circle-progress-volume {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50px;
  right: 0;
  top: -2px;
}

/* Marquee text (running text) */
.marquee-text {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.marquee-text p {
  font-size: 18px;
  animation: marquee 25s linear infinite;
}

/* Volume Control Bar */
.volume-control-bar {
  width: 5rem;
  height: 4.50px;
  cursor: pointer;
  border-radius: 20px;
  background-color: #9f9d9a;
}

/* Footer */
.footer {
  backdrop-filter: blur(2px);
}

@keyframes marquee {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(-100%);
  }
}

/* Extra small devices (phones, 576px and down) */
@media (max-width: 576px) {
  .wrapper-player-section {
    gap: 17px;
  }

  .wrapper-status-text {
    height: 50px;
  }

  .player-icon {
    font-size: 15px;
  }

  .title {
    font-size: 1rem;
  }

  .progress-bar {
    width: 95%;
  }

  .marquee-text {
    width: 91%;
  }

  .marquee-text p {
    font-size: 14px;
  }
}

/* Large devices (laptops/desktops, 993px and up) */
@media (min-width: 993px) and (max-width: 1200px) {
  .player-section {
    flex-direction: row;
  }

  .about {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}

/* Extra large devices (large desktops, 1201px and up) */
@media (min-width: 1201px) {
  .player-section {
    gap: 30px;
    flex-direction: row;
  }

  .about {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>