<template>
  <CodeMirror 
    class="editor" 
    :options="options" 
    v-model="content"
  />
</template>

<script>
  import { codemirror as CodeMirror } from 'vue-codemirror' 

  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/gfm/gfm'

  export default {
    data: () => ({
      options: {
        mode: { name: 'gfm' },
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
      min-height: 72px;
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