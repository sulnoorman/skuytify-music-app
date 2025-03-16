import { defineStore } from "pinia";

export const useTerminalStore = defineStore('terminal', {
    state: () => ({
        output: [], // Terminal output (history)
        prompt: "->", // Prompt symbol
        isProcessing: false, // Flag to prevent multiple command submissions
        history: [], // Stores the command history
        historyIndex: -1, // Points to the current position in history
    }),
});

