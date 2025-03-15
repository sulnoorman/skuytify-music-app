<script setup>
import Searchbox from '@/components/Searchbox.vue';
import UserInfo from '@/components/layout/default/UserInfo.vue';
import ToggleTheme from '@/components/layout/default/ToggleTheme.vue';
import { RouterLink } from 'vue-router';

function log(param) {
    console.log('param', param);
};
</script>

<template>
    <div class="relative h-screen flex flex-col bg-background transition-colors ease-linear overflow-hidden">
        <!-- Navbar -->
        <nav class="px-8 py-2 w-full backdrop-blur-sm flex justify-between items-center">
             <!-- Menu List -->
             <div class="w-[20%] text-sm">
                <RouterLink to="/" class="inline-block px-4 hover:bg-transparent" active-class="text-textColor">
                    Home
                </RouterLink>
                <RouterLink to="/about" class="inline-block px-4 hover:bg-transparent" active-class="text-textColor">
                    About
                </RouterLink>
                <RouterLink to="/contact" class="inline-block px-4 hover:bg-transparent" active-class="text-textColor">
                    Contact
                </RouterLink>
            </div>
            
            <!-- Search Box -->
            <Searchbox :class-props="'w-[20%]'" @search="log" :placeholder="'Search Tracks, album, artists...'" />

            <!-- Toggle Theme and User Info -->
            <div class="flex flex-row justify-center items-center gap-3">
                <ToggleTheme />
                <UserInfo />
            </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-1 px-2 overflow-hidden">
            <slot />
        </main>

        <!-- Footer -->
        <!-- <footer class="px-8 py-4 bg-gray-800 text-white text-center">
            © 2025 Your App. All rights reserved.
        </footer> -->
    </div>
</template>
