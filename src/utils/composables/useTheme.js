import { ref } from "vue";

export function useTheme() {
    const theme = ref(localStorage.getItem('theme') || 'light');
    
    const setTheme = newTheme => {
        theme.value = newTheme;
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    // initialize theme on app load
    if (theme.value === 'dark') {
        document.documentElement.classList.add('dark')
    }

    const toggleTheme = () => {
        setTheme(theme.value === 'dark' ? '' : 'dark')
    }

    return {theme, toggleTheme};
}