<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowRight, faBars, faBookOpen, faPlay, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

const isExpanded = ref(false);
const itemHoveredId = ref(null);

function onHoverItem(id = null) {
  itemHoveredId.value = id;
};

function clearItemHoveredId() {
  itemHoveredId.value = null;
};
</script>

<template>
  <!-- Sidebar Content -->
  <div class="h-[calc(100%-5.5rem)] w-[20%] bg-backgroundSecondary rounded-lg flex flex-col gap-y-2">
    <!-- First Col - Title and Icon -->
    <div class="px-6 pt-6 flex flex-row justify-between">
      <!-- Your Library Logo -->
      <div
        class="flex flex-row gap-3 justify-center items-center text-textColor dark:hover:text-gray-300 hover:text-primary transition-colors ease-linear duration-300">
        <FontAwesomeIcon :icon="faBookOpen" class="text-lg cursor-pointer" />
        <h2>Your Library</h2>
      </div>
      <!-- Icon Section -->
      <div class="flex flex-row gap-3 justify-center items-center">
        <div
          class="size-8 p-4 flex items-center justify-center text-textColor rounded-full hover:bg-backgroundSoft hover:text-primary dark:hover:text-whiteApp transition-colors ease-linear">
          <FontAwesomeIcon :icon="faPlus" class="text-lg cursor-pointer transition-colors ease-linear duration-300" />
        </div>
        <div
          class="size-8 p-4 flex items-center justify-center text-textColor rounded-full hover:bg-backgroundSoft hover:text-primary dark:hover:text-whiteApp transition-colors ease-linear">
          <FontAwesomeIcon :icon="faArrowRight"
            class="text-lg cursor-pointer transition-colors ease-linear duration-300" />
        </div>
      </div>
    </div>
    <!-- Second Col - Badge Tab -->
    <div class="px-6 pt-4 w-full flex items-center justify-center">
      <div style="scrollbar-width: none;"
        class="w-[100%] overflow-auto cursor-pointer flex flex-row gap-2 justify-start items-center">
        <div
          class="p-2 text-xs text-center bg-backgroundSoft hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full whitespace-nowrap transition-colors ease-linear duration-200">
          Playlists
        </div>
        <div
          class="p-2 text-xs text-center bg-backgroundSoft hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full whitespace-nowrap transition-colors ease-linear duration-200">
          Artists
        </div>
        <div
          class="p-2 text-xs text-center bg-backgroundSoft hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full whitespace-nowrap transition-colors ease-linear duration-200">
          Albums
        </div>
        <div
          class="p-2 text-xs text-center bg-backgroundSoft hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full whitespace-nowrap transition-colors ease-linear duration-200">
          Podcasts & Shows
        </div>
      </div>
    </div>
    <!-- List Box -->
    <div class="px-6 pt-1 flex-1 overflow-auto">
      <div class="flex flex-col gap-2.5">
        <!-- Search Icon and Recents Menu -->
        <div class="mb-2 flex flex-row items-center justify-between">
          <!-- Search bar -->
          <div class="w-1/2">
            <div class="relative">
              <div class="absolute inset-y-0 start-0 ps-3.5 flex items-center cursor-pointer"
                @click="isExpanded = !isExpanded">
                <FontAwesomeIcon :icon="faSearch" class="size-3" />
              </div>
              <input placeholder="Search in your lib" :class="{ 'w-0': !isExpanded, 'w-full': isExpanded }"
                class="block p-2 ps-8 text-xs text-textColorSoft rounded-full bg-gray-200 dark:bg-backgroundSoft outline-none transition-all ease-linear duration-300" />
            </div>
          </div>
          <!-- Recents Menu -->
          <div
            class="flex flex-row gap-2 justify-center items-center text-textColor cursor-pointer dark:hover:text-gray-300 hover:text-primary transition-colors ease-linear duration-300">
            <h2>Recents</h2>
            <FontAwesomeIcon :icon="faBars" class="text-lg cursor-pointer transition-colors ease-linear duration-300" />
          </div>
        </div>
        <!-- List Item -->
        <template v-for="n in 15">
          <div class="relative w-full flex flex-row gap-2 items-center hover:bg-backgroundSoft cursor-pointer" @mouseenter="onHoverItem(n)" @mouseleave="clearItemHoveredId()">
            <img class="size-12 rounded-md relative"
              src="https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg"
              alt="img" />  
            <div v-if="itemHoveredId !== null && itemHoveredId === n" class="absolute size-12 rounded-md flex items-center justify-center bg-gray-600/40">
              <FontAwesomeIcon :icon="faPlay" class="text-lg text-white" />
            </div>
            <div class="flex flex-col">
              <h1 class="text-base text-black dark:text-white hover:underline cursor-pointer">Hoolahop</h1>
              <p class="text-sm text-textColor">Artist</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>