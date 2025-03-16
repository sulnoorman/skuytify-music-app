<!-- <script>
import { nextTick } from "vue";
import TerminalHeader from "./TerminalHeader.vue";
import { baseCommands } from "@/utils/baseCommand";
import { storeToRefs } from "pinia";

export default {
    name: "Terminal",
    components: {
        TerminalHeader,
    },
    props: {
        titleHeader: {
            required: false,
            type: String,
            default: 'Terminal v.1',
        },
        commands: {
            required: false,
            type: Object,
            default: baseCommands
        }
    },
    emits: ['handleClose'],
    data() {
        return {
            input: "", // Current user input
            output: [], // Terminal output (history)
            prompt: "->", // Prompt symbol
            isProcessing: false, // Flag to prevent multiple command submissions
            history: [], // Stores the command history
            historyIndex: -1, // Points to the current position in history
        };
    },
    mounted() {
        this.focusInput();
    },
    methods: {
        // Executes the user inputted command
        executeCommand() {
            if (this.isProcessing) return;
            this.isProcessing = true;

            const command = this.input.trim();
            if (command) {
                this.addOutput({ type: 'command', message: `${this.prompt} ${command}` }); // Add the command to output
                this.history.push(command); // Save command to history
                this.historyIndex = this.history.length; // Reset history navigation
                this.input = ""; // Clear the input field
                this.processCommand(command); // Process the command
            }
        },
        // Adds output to the terminal's history
        addOutput(line) {
            this.output.push(line);
            this.scrollToBottom(); // Scroll after new output
        },
        // Processes the command entered by the user
        async processCommand(input) {
            const [cmd, ...args] = input.split(" "); // Split command and arguments
            const command = this.commands[cmd];

            if (input === 'clear') {
                this.output = []
                this.isProcessing = false
                return
            }
            if (input !== 'clear' && !command) {
                this.addOutput({ type: 'result', message: `Command not found: ${cmd}` });
                this.isProcessing = false;
                return;
            }

            try {
                const result = typeof command === "function"
                    ? await command(args.join(" ")) // Pass arguments to the command
                    : command;

                if (typeof result === "string" && result.includes("<")) {
                    this.addOutput({ type: 'html-result', message: result })
                } else {
                    if (Array.isArray(result)) {
                        // If result is an array
                        result.map((item) => this.addOutput({ type: 'result', message: item }))
                    } else {
                        // Render as plain text
                        this.addOutput({ type: 'result', message: result })
                    }
                }
            } catch (error) {
                this.addOutput({ type: result, message: `Error executing command: ${error.message}` });
            }

            this.isProcessing = false;
        },
        // Navigates the history when up/down keys are pressed
        navigateHistory(direction) {
            if (direction === 'up' && this.historyIndex > 0) {
                this.historyIndex--;
                this.input = this.history[this.historyIndex];
            } else if (direction === 'down' && this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input = this.history[this.historyIndex];
            }
        },
        // Scrolls the terminal to the bottom after a new output
        scrollToBottom() {
            nextTick(() => {
                if (this.$refs.terminal) {
                    this.$refs.terminal.scrollTop = this.$refs.terminal.scrollHeight;
                }
            });
        },
        // Focuses the input field automatically when the component is mounted
        focusInput() {
            nextTick(() => {
                if (this.$refs.inputField) {
                    this.$refs.inputField.focus();
                }
            });
        }
    },
};
</script> -->

<script setup>
import { onMounted, ref } from "vue";
import TerminalHeader from "./TerminalHeader.vue";
import { baseCommands } from "@/utils/baseCommand";
import { useTerminalStore } from "@/store/terminal";
import { storeToRefs } from "pinia";

const emits = defineEmits(['handleClose']);
const props = defineProps({
    titleHeader: {
        required: false,
        type: String,
        default: 'Terminal v.1',
    },
    commands: {
        required: false,
        type: Object,
        default: baseCommands
    }
});

const input = ref(null);
const terminal = ref(null);
const inputField = ref(null);

const store = useTerminalStore();
const { output, history, historyIndex, prompt, isProcessing } = storeToRefs(store);

// Executes the user inputted command
function executeCommand() {
    if (isProcessing.value) return;
    isProcessing.value = true;

    const command = input.value.trim();
    if (command) {
        addOutput({ type: 'command', message: `${prompt.value} ${command}` }); // Add the command to output
        history.value.push(command); // Save command to history
        historyIndex.value = history.value.length; // Reset history navigation
        input.value = ""; // Clear the input field
        processCommand(command); // Process the command
    }
};

// Adds output to the terminal's history
function addOutput(line) {
    output.value.push(line);
    scrollToBottom(); // Scroll after new output
};

// Processes the command entered by the user
async function processCommand(param) {
    const [cmd, ...args] = param.split(" "); // Split command and arguments
    const command = props.commands[cmd];

    if (param === 'clear') {
        output.value = []
        isProcessing.value = false
        return
    }
    if (param !== 'clear' && !command) {
        addOutput({ type: 'result', message: `Command not found: ${cmd}` });
        isProcessing.value = false;
        return;
    }

    try {
        const result = typeof command === "function"
            ? await command(args.join(" ")) // Pass arguments to the command
            : command;

        if (typeof result === "string" && result.includes("<")) {
            addOutput({ type: 'html-result', message: result })
        } else {
            if (Array.isArray(result)) {
                // If result is an array
                result.map((item) => addOutput({ type: 'result', message: item }))
            } else {
                // Render as plain text
                addOutput({ type: 'result', message: result })
            }
        }
    } catch (error) {
        addOutput({ type: result, message: `Error executing command: ${error.message}` });
    }

    isProcessing.value = false;
};

// Navigates the history when up/down keys are pressed
function navigateHistory(direction) {
    if (direction === 'up' && this.historyIndex > 0) {
        historyIndex.value--;
        input.value = history.value[historyIndex.value];
    } else if (direction === 'down' && historyIndex.value < history.value.length - 1) {
        historyIndex.value++;
        input.value = history.value[historyIndex.value];
    }
};

// Scrolls the terminal to the bottom after a new output
function scrollToBottom() {
    if (terminal.value) {
        terminal.value.scrollTop = terminal.value.scrollHeight;
    }
};

// Focuses the input field automatically when the component is mounted
function focusInput() {
    if (inputField.value) {
        inputField.value.focus();
    }
};

onMounted(() => {
    focusInput()
    scrollToBottom()
    isProcessing.value = false
});
</script>

<template>
    <div class="terminal !text-lime-400" ref="terminal" @click="focusInput">
        <!-- Terminal Header -->
        <TerminalHeader @handle-close="emits('handleClose')" :title="props.titleHeader" />

        <div class="terminal-body">
            <div v-for="(line, index) in output" :key="index" class="terminal-line"
                :class="line.type === 'command' ? 'command-message' : 'result-message !text-violet-300'">
                <span v-if="line.type !== 'html-result'">{{ line.message }}</span>

                <span v-else v-html="line.message"></span>
            </div>

            <div ref="inputContainer" class="input-container">
                <span class="prompt">{{ prompt }}</span>
                <input type="text" v-model="input" @keydown.enter="executeCommand" @keydown.up="navigateHistory('up')"
                    @keydown.down="navigateHistory('down')" :disabled="isProcessing" class="terminal-input"
                    ref="inputField" />
            </div>
        </div>

    </div>
</template>

<style scoped>
.terminal {
    position: relative;
    font-family: monospace;
    background-color: #1e1e1e;
    color: #21cb21;
    border-radius: 5px;
    height: 400px;
    overflow-y: auto;
}

.terminal-body {
    padding: 10px;
    margin-top: 10px;
}

.terminal-line {
    margin: 0;
}

.input-container {
    display: flex;
    align-items: center;
}

.prompt {
    width: 25px;
    margin-right: 7px;
}

.terminal-input {
    background: transparent;
    color: inherit;
    border: none;
    outline: none;
    font-size: 16px;
    font-family: monospace;
    font-weight: normal;
    width: 100%;
}

.result-message {
    color: rgb(226, 174, 255);
}

.command-message {
    color: inherit;
}
</style>