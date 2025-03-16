<script>
import Tooltip from '@/components/Tooltip.vue';

export default {
    name: 'TerminalHeader',
    props: {
        title: {
            required: false,
            type: String,
            default: 'Terminal v.1'
        },
    },
    emits: ['handleClose']
}
</script>

<template>
    <div class="terminal-header">
        <h4>{{ title }}</h4>
        <ul class="shell-dots">
            <li class="shell-dots-green"></li>
            <li class="shell-dots-yellow"></li>
            <li class="shell-dots-red" @click="$emit('handleClose')">
                <Tooltip title="Close">
                    <div class="w-full h-full"></div>
                </Tooltip>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.terminal-header {
    position: sticky;
    z-index: 2;
    top: 0;
    right: 0;
    left: 0;
    background-color: rgb(149, 149, 152);
    text-align: center;
    padding: 2px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px
}

.terminal-header ul.shell-dots {
    position: absolute;
    top: 5px;
    right: 8px;
    padding-left: 0;
    margin: 0;
}

.terminal-header ul.shell-dots li {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    margin-left: 6px
}

.terminal-header ul .shell-dots-red {
    cursor: pointer;
    background-color: rgb(200, 48, 48);
}

.terminal-header ul .shell-dots-yellow {
    background-color: rgb(247, 219, 96);
}

.terminal-header ul .shell-dots-green {
    background-color: rgb(46, 201, 113);
}

.terminal-header h4 {
    margin: 5px;
    font-size: 15px;
    letter-spacing: 1px;
    color: black;
    font-family: monospace
}
</style>