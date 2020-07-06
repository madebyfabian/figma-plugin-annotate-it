<template>
  <article class="annotationItem" :showSkeleton="showSkeleton">
    <SectionTitle class="annotationItem-number">#{{ itemKey + 1 }}</SectionTitle>

    <div>
      <input 
        class="annotationItem-input title" 
        type="text" 
        placeholder="Title"
        v-model="value.title"
      />

      <CodeMirror 
        class="annotationItem-editor" 
        :options="editorOptions"
        :value="value.content.rawMarkdown"
        @input="onContentInput"
      />
    </div>

    <Button 
      buttonType="icon" 
      class="annotationItem-removeButton"
      @click="removeAnnotation">

      <Icon iconName="minus" />
    </Button>
  </article>
</template>

<script>
  import SectionTitle from '@/components/ui/SectionTitle'
  import Icon from '@/components/ui/Icon'
  import Button from '@/components/ui/Button'

  // Setup CodeMirror v5 Editor & mdast parser
  import { create } from 'md-mdast'
  import { codemirror as CodeMirror } from 'vue-codemirror' 
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/gfm/gfm'
  import 'codemirror/addon/display/placeholder'
  const parser = create()

  export default {
    components: { SectionTitle, Icon, Button, CodeMirror },

    data: () => ({
      editorOptions: {
        mode: { name: 'gfm' },
        lineWrapping: true,
        inputStyle: 'contenteditable',
        viewportMargin: Infinity,
        placeholder: 'Description'
      }
    }),

    props: {
      showSkeleton: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object,
        default: () => ({
          title: 'My title', content: { rawMarkdown: 'Test **123**' }
        })
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
        this.$emit('removeAnnotation', this.itemKey)
      }
    },

    created() {
      this.generateMdast()
    }
  }
</script>

<style lang="scss" scoped>
  .annotationItem {
    width: 100%;
    display: grid;
    grid-template-columns: 32px 1fr 32px;
    gap: 8px;

    &[showSkeleton=true] {
      opacity: .33;
      pointer-events: none;
    }

    &-number {
      align-self: center;
      margin-left: 0;
      max-width: 32px;
      color: $color--black-8;
    }

    &-removeButton {
      background: transparent;
    }

    &-editor {
      margin-top: -1px;

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

        &-placeholder {
          padding: 8px;
          color: $color--black-3;
        }
      }
    }

    &-input {
      box-shadow: inset 0 0 0 1px $color--special-black-1;
      padding: 8px;
      width: 100%;
      background: $color--background-white;
      color: $color--black;

      // &:focus {
      //   // box-shadow: inset 0 0 0 2px $color--blue!important;
      //   box-shadow: initial!important;
      // }

      &.title {
        height: 40px;
        line-height: 40px;
        border-radius: 2px 2px 0 0;
        @include font(11, bold);
        border: none;
      }

      &.content {
        min-height: 64px;
        border-radius: 0 0 2px 2px;
        border-top: none;
        @include font(11, regular);

        &:empty::after {
          content: attr(placeholder);
        }

        * {
          @include font(11, bold);
        }
      }
    }
  }
</style>