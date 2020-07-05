<template>
  <article class="annotationItem" :showSkeleton="showSkeleton">
    <SectionTitle class="annotationItem-number">#1</SectionTitle>
    <div>
      <input class="annotationItem-input title" type="text" placeholder="Title" value="This is an example">
      <MarkdownEditor class="annotationItem-editor" />
      <!-- <div 
        class="annotationItem-input content"
        placeholder="Description"
        @input.prevent="contentUpdate"
        :contenteditable="true"
      /> -->
    </div>
    <Button buttonType="icon" class="annotationItem-removeButton"><Icon iconName="minus" /></Button>
  </article>
</template>

<script>
  import SectionTitle from '@/components/ui/SectionTitle'
  import Icon from '@/components/ui/Icon'
  import Button from '@/components/ui/Button'
  import MarkdownEditor from '@/components/ui/MarkdownEditor'

  export default {
    components: { SectionTitle, Icon, Button, MarkdownEditor },

    props: {
      showSkeleton: {
        type: Boolean,
        default: false
      }
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