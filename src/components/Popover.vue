<script setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
  
  const props = defineProps({
    offset: {
      type: Object,
      default: () => ({ top: 10, left: 0 }), // Default offset values
    },
  });
  
  const isOpen = ref(false); 
  const activator = ref(null);
  const popover = ref(null);
  const popoverStyles = ref({});
  
  const togglePopover = async (event) => {
    isOpen.value = !isOpen.value;
    activator.value = event.currentTarget;
  
    if (isOpen.value) {
      await nextTick();
      positionPopover();
    }
  };
  
  const positionPopover = () => {
    if (!activator.value || !popover.value) return;

    const activatorRect = activator.value.getBoundingClientRect();

    popoverStyles.value = {
      top: `${activatorRect.bottom - 50 + props.offset.top}px`,
      left: `${props.offset.left - 200}px`,
    };
  };
  
  const handleClickOutside = (event) => {
    if (
      isOpen.value &&
      !popover.value?.contains(event.target) &&
      !activator.value?.contains(event.target)
    ) {
      isOpen.value = false;
    }
  };
  
  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      isOpen.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleEscapeKey);
  });
</script>

<template>
    <div class="relative">
      <!-- Popover Trigger -->
      <slot name="activator" :toggle="togglePopover" />
  
      <!-- Popover Content -->
      <div
        v-if="isOpen"
        ref="popover"
        class="absolute z-4 bg-backgroundSecondary rounded-md shadow-lg"
        :style="popoverStyles"
      >
        <slot name="content" :toggle="togglePopover" />
      </div>
    </div>
</template>