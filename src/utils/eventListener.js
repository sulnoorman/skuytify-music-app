import { onMounted, onUnmounted } from "vue";

export function useEventListener(target, event, needCleanUp = false, callback) {
    if (needCleanUp && target) {
        onMounted(() => target.addEventListener(event, (e) => callback(e)));
        onUnmounted(() => target.removeEventListener(event, (e) => callback(e)));
    } else if (!needCleanUp && target) {
        target.addEventListener(event, (e) => callback(e));
    }
}