<script setup>
    import Popover from '@/components/Popover.vue';

    let username = 'Sulthan Noorman'
    let avatar = 'https://plus.unsplash.com/premium_photo-1728654439502-af094286476b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
</script>

<template>
    <div class="p-1 rounded-full bg-backgroundSecondary flex flex-row items-center transition-colors ease-linear">
        <div class="me-16 flex flex-row items-center gap-2">
            <img class="w-9 h-9 rounded-full hover:scale-100" :src="avatar" alt="Rounded avatar">
            <p class="font-medium text-heading">{{ username }}</p>
        </div>

        <!-- Popover User -->
        <Popover :offset="{ top: 35, left: 75 }">
            <!-- Activator Popover -->
            <template #activator="{ toggle }">
                <button @click="toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-4 mt-1 me-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>

                </button>
            </template>

            <!-- Popover User Content -->
            <template #content="{ toggle }">
                <div class="p-4 text-sm">
                    <ul class="text-sm text-gray-700 dark:text-gray-200" @click="toggle">
                        <li>
                            <a href="#"
                                class="px-2 text-textColor flex flex-row items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="size-6 me-2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>

                                Sign out
                            </a>
                        </li>
                    </ul>
                </div>
            </template>
        </Popover>
    </div>
</template>