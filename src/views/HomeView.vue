<script setup>
import { ref } from 'vue';
import { songs } from '@/store/songsList';
import TheWelcome from '../components/TheWelcome.vue'
import Terminal2 from '@/components/terminal/Terminal2.vue';
import ModalDraggable from '@/components/ModalDraggable.vue';

const showTerminal = ref(false)

function toggleShowTerminal(param) {
  showTerminal.value = param
}

const commandsList = {
  help: (
    `<span>
                <strong>clear</strong> - clears the console. <br />
                <strong>reload_page</strong> - reload the current page. <br />
                <strong>ls &lt;ARGS&gt;</strong> - return list of given argument. <br />
                <ol class='ml-5'>
                    <li>-- &lt;songs&gt; -  return list of availabel songs</li>.
                </ol>
            </span>
        `
  ),
  ls: (args) => {
    if (args === 'songs') {
      return songs.map((item, index) => `${index + 1}. ${item.title}`)
    } else if (args === '') {
      const result = `
                        <span>
                            Command error: please provide arguments. Available arguments for <span class='text-gray-100'>'ls'</span> command is:
                        </span>
                        <br/>
                        <ol class='ml-[30px] text-gray-100'>
                            <li>1. &lt;songs&gt; - list of registered songs.</li>
                        </ol>
                    `
      return result
    } else {
      return `Command error: Arguments ${cmdArguments}\'s not supported`
    }
  },
  console: (args) => {
    if (args === '') {
      const result = `
                    <span>
                        Command error: please provide arguments.
                    </span>
            `
      return result
    }

    return `${args} args has been threw in`;
  },
  reload_page: () => {
    location.reload();
  }
};
</script>

<template>
  <TheWelcome />

  <button @click.prevent="toggleShowTerminal(true)"
    class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
    show terminal
  </button>

  <ModalDraggable :is-open="showTerminal">
    <Terminal2 title-header="Terminal" :commands="commandsList" @handle-close="toggleShowTerminal(false)" />
  </ModalDraggable>

</template>
