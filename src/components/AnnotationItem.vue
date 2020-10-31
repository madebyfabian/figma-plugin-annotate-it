<template>
  <article class="annotationItem" :class="showSkeletonClass">
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

    <div class="annotationItem-inputEditor" :class="showSkeletonClass">
      <RichTextEditor v-model="value.content" :isSkeleton="showSkeleton" />
    </div>

    <ColorStyleControl
      class="annotationItem-colorStyleControl"
      v-model="value.colorThemeId" />

    <Button 
      buttonType="icon" 
      class="annotationItem-removeButton"
      v-tooltip.bottom-left="`Delete annotation`"
      @click="removeAnnotation">

      <Icon iconName="trash" />
    </Button>
  </article>
</template>

<script>
  import SectionTitle from '@/components/ui/SectionTitle'
  import Icon from '@/components/ui/Icon'
  import Button from '@/components/ui/Button'
  import ColorStyleControl from '@/components/ui/ColorStyleControl'

  import RichTextEditor from '@/components/ui/RichTextEditor'

  import { generateAnnotItemObject, randomId } from '@/utils/utils'

  // const contentPlaceholder = 'Your annotation Description goes here.\nYou can format the text with Markdown like\n**bold** or _italic_, - unordered, 1. ordered, --- divider'

  export default {
    components: { 
      SectionTitle, 
      Icon,
      Button,
      ColorStyleControl,
      RichTextEditor
    },

    props: {
      showSkeleton: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object,
        default: () => generateAnnotItemObject('Your annotation Title goes here')
      },
      itemKey: {
        type: Number,
        default: 0
      }
    },

    methods: {
      removeAnnotation() {
        this.$emit('removeAnnotation', this.value.id)
      }
    },

    computed: {
      showSkeletonClass() {
        return this.showSkeleton ? 'showSkeleton' : false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .annotationItem {
    width: calc(100% - 8px);
    margin: 0 8px 24px 0;
    display: grid;
    grid-template-columns: 24px auto 1fr 32px;
    grid-template-rows: 40px 1fr min-content;
    align-items: center;
    gap: 6px 8px;

    &:hover &-dragHandleButton {
      opacity: 1
    }

    &.showSkeleton {
      opacity: .25;
      pointer-events: none;
      margin-bottom: 0;
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
      max-width: 24px;
      color: $color--black-8;
      padding-left: 0;
      padding-right: 0;
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

      &::placeholder {
        color: $color--black-3;
      }
    }

    &-inputEditor {
      grid-column: 3 / 4;
      grid-row: 2 / 3;
      position: relative;

      /deep/ .editor {
        // padding: 12px 8px;
        
        *[contenteditable=true] {
          padding: 12px 8px;
          min-height: calc(calc(12px * 2) + calc(16px * 3)); // padding + 3 line-heights
          border-radius: 3px;
          box-shadow: inset 0 0 0 1px $color--special-black-1;;
        }
      }
    }

    &-inputTitle {
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
  }
</style>