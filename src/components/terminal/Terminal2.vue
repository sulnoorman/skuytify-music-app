<template>
    <div class="terminal !text-lime-400" ref="terminal" @click="focusInput">
        <!-- Terminal Header -->
        <TerminalHeader />

        <div class="terminal-body">
            <div v-for="(line, index) in output" :key="index" class="terminal-line"
                :class="line.type === 'command' ? 'command-message' : 'result-message !text-violet-300'"
            >
                <span v-if="line.type !== 'html-result'">{{ line.message }}</span>

                <span v-else v-html="line.message"></span>
            </div>

            <div class="input-container">
                <span class="prompt">{{ prompt }}</span>
                <input 
                    type="text" 
                    v-model="input" 
                    @keydown.enter="executeCommand" 
                    @keydown.up="navigateHistory('up')"
                    @keydown.down="navigateHistory('down')" 
                    :disabled="isProcessing" class="terminal-input"
                    ref="inputField" 
                />
            </div>
        </div>

    </div>
</template>

<script>
import { nextTick } from "vue";
import TerminalHeader from "./TerminalHeader.vue";
import { baseCommands } from "@/utils/baseCommand";

export default {
    name: "Terminal",
    components: {
        TerminalHeader,
    },
    data() {
        return {
            input: "", // Current user input
            output: [], // Terminal output (history)
            prompt: "$", // Prompt symbol
            isProcessing: false, // Flag to prevent multiple command submissions
            history: [], // Stores the command history
            historyIndex: -1, // Points to the current position in history
        };
    },
    props: {
        commands: {
            required: false,
            type: Object,
            default: baseCommands
        }
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
                this.addOutput({type: 'result', message: `Command not found: ${cmd}`});
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
                this.addOutput({type: result, message: `Error executing command: ${error.message}`});
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
</script>

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