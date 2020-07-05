<template>
  <!-- <div ref="editor" /> -->
  
  <CodeMirror 
    class="editor" 
    :options="options" 
    v-model="content"
  />
</template>

<script>
  // import CodeMirror from '@/functions/codemirror/lib/codemirror'
  // import mdMode from '@/functions/codemirror/mode/markdown/markdown'

  // import '@/functions/codemirror/lib/codemirror.css'

  import { codemirror as CodeMirror } from 'vue-codemirror' 
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/markdown/markdown'

  export default {
    //  mounted() {
    //   const cm = new CodeMirror(this.$refs.editor, {
    //     value: `# Hello world!\n\nThis is some **bold** text!\n- Do list me\n- Or me`,
    //     mode: 'markdown',
    //     lineWrapping: true,
    //     inputStyle: 'contenteditable',
    //     viewportMargin: Infinity
    //   })
    // }

    data: () => ({
      options: {
        mode: { name: 'markdown' },
        lineWrapping: true,
        inputStyle: 'contenteditable',
        viewportMargin: Infinity
      },
      content: `This is some **bold** text!\n- Do list me\n- Or me`
    }),

    components: { CodeMirror }
  }
</script>

<style lang="scss" scoped>
  .editor {
    /deep/ .CodeMirror {
      height: auto;
      border-radius: 0 0 2px 2px;
      box-shadow: inset 0 0 0 1px $color--special-black-1;

      &-code {
        padding: 8px 0;
      }

      &-line {
        padding: 0 8px;
      }
    }
  }
</style>