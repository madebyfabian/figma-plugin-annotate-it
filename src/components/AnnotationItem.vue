<template>
  <article class="annotationItem" :showSkeleton="showSkeleton">
    <Button
      buttonType="iconDraggable"
      class="annotationItem-dragHandleButton"
      v-tooltip.bottom-right="`Hold to drag`">

      <Icon iconName="drag" />
    </Button>

    <SectionTitle class="annotationItem-number">
      #{{ itemKey + 1 }}
    </SectionTitle>

    <input 
      class="annotationItem-inputTitle" 
      type="text" 
      placeholder="Title"
      v-model="value.title" />

    <div class="annotationItem-inputEditor-wrap">
      <CodeMirror 
        class="annotationItem-inputEditor" 
        :options="editorOptions"
        :value="value.content.rawMarkdown"
        @input="onContentInput"
      />
    </div>

    <ColorStyleControl
      class="annotationItem-colorStyleControl"
      v-model="value.colorThemeId" />

    <Button 
      buttonType="icon" 
      class="annotationItem-removeButton"
      v-tooltip.bottom-left="`Delete annotation`"
      @click="removeAnnotation">

      <Icon iconName="minus" />
    </Button>
  </article>
</template>

<script>
  // Setup CodeMirror v5 Editor & mdast parser
  import { create } from 'md-mdast'
  import { codemirror as CodeMirror } from 'vue-codemirror' 
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/gfm/gfm'
  import 'codemirror/addon/display/placeholder'
  const parser = create()

  import SectionTitle from '@/components/ui/SectionTitle'
  import Icon from '@/components/ui/Icon'
  import Button from '@/components/ui/Button'
  import ColorStyleControl from '@/components/ui/ColorStyleControl'

  import { generateAnnotationItem, randomId } from '@/functions/helpers'

  const contentPlaceholder = 'Your annotation Description goes here.\nYou can format the text with Markdown like\n**bold** or _italic_, - unordered, 1. ordered, --- divider'
  

  export default {
    components: { SectionTitle, Icon, Button, CodeMirror, ColorStyleControl },

    data: () => ({
      editorOptions: {
        mode: { name: 'gfm' },
        lineWrapping: true,
        inputStyle: 'contenteditable',
        viewportMargin: Infinity,
        placeholder: contentPlaceholder
      }
    }),

    props: {
      showSkeleton: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object,
        default: () => generateAnnotationItem('Your annotation Title goes here', contentPlaceholder)
      },
      itemKey: {
        type: Number,
        default: 1
      }
    },

    methods: {
      onContentInput( newValue ) {
        this.value.content.rawMarkdown = newValue
        this.generateMdast()
      },

      generateMdast() {
        this.value.content.parsedMdast = parser.tokenizeBlock(this.value.content.rawMarkdown)
      },

      removeAnnotation() {
        this.$emit('removeAnnotation', this.value.id)
      }
    },

    created() {
      this.generateMdast()
    }
  }
</script>

<style lang="scss" scoped>
  .annotationItem {
    width: calc(100% - 8px);
    margin: 0 8px 24px 0;

    display: grid;
    grid-template-columns: 24px 32px 1fr 32px;
    grid-template-rows: 40px minmax(72px, 1fr) min-content;
    align-items: center;
    gap: 6px 8px;

    &:hover &-dragHandleButton {
      opacity: 1
    }

    &-dragHandleButton {
      grid-column: 1 / 2;
      background: transparent;
      cursor: grab;
      opacity: 0;
      transition: opacity 150ms ease;
      margin-left: 8px;
      
      /deep/ * {
        color: $color--black-3!important;
      }
    }

    &-number {
      grid-column: 2 / 3;
      margin-left: 0;
      max-width: 32px;
      color: $color--black-8;
    }

    &-inputTitle {
      grid-column: 3 / 4;
      padding: 8px;
      width: 100%;
      background: $color--background-white;
      color: $color--black;
      height: 40px;
      line-height: 40px;
      @include font(11, bold);
      border: none;
    }

    &-inputEditor-wrap {
      min-height: 72px;
      grid-column: 3 / 4;
      grid-row: 2 / 3;
    }

    &-inputEditor {
      min-height: 72px;
      border-top: none;
      @include font(11, regular);
      margin-top: -1px;
      width: 100%;

      /deep/ .CodeMirror {
        height: auto;
        min-height: 72px;

        &-code {
          padding: 8px 0;
        }

        &-line {
          padding: 0 8px;
        }

        &-placeholder {
          // padding: 8px;
          transform: translate(4px, 8px);
          color: $color--black-3;
        }
      }

      &:empty::after {
        content: attr(placeholder);
      }

      * {
        @include font(11, bold);
      }
    }

    &-inputTitle, &-inputEditor /deep/ .CodeMirror {
      box-shadow: inset 0 0 0 1px $color--special-black-1;
      border-radius: 3px;
    }

    &-colorStyleControl {
      grid-row: 3 / 4;
      grid-column: 3 / 4;
    }

    &-removeButton {
      grid-column: 4 / 5;
      background: transparent;
    }

    &[showSkeleton=true] {
      opacity: .33;
      pointer-events: none;
    }
  }
</style>