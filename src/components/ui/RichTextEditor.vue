<template>
  <div class="editor">
    <editor-floating-menu :editor="editor" v-slot="{ commands, isActive, menu }">
      <div
        class="editor-floatingMenu"
        :class="{ 'is-active': menu.isActive }"
        :style="`top: ${menu.top}px`">

        <button
          v-for="(item, i) of floatingMenuItems"
          :key="i"
          @click="() => commands[item.commandName]()"
          v-tooltip.top-center="item.title">

          <svg v-html="item.icon" />
        </button>
      </div>
    </editor-floating-menu>

    <editor-menu-bubble :editor="editor" :keep-in-bounds="keepInBounds" v-slot="{ commands, isActive, menu }">
      <div
        class="editor-menuBubble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`">

        <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
          <b>B</b>
        </button>

        <button :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
          <i>i</i>
        </button>

        <button :class="{ 'is-active': isActive.strike() }" @click="commands.strike">
          <s>S</s>
        </button>

        <button :class="{ 'is-active': isActive.underline() }" @click="commands.underline">
          <u>U</u>
        </button>
      </div>
    </editor-menu-bubble>

    <editor-content class="editor-content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBubble, EditorFloatingMenu } from 'tiptap'
import { HardBreak, OrderedList, BulletList, ListItem, Bold, Italic, Strike, Underline, HorizontalRule, Placeholder, History } from 'tiptap-extensions'

export default {
  props: {
    value: Array,
    isSkeleton: {
      type: Boolean,
      default: false
    }
  },

  components: {
    EditorContent,
    EditorMenuBubble,
    EditorFloatingMenu
  },

  data: function() {
    return {
      keepInBounds: true,
      editable: !this.isSkeleton,

      editor: new Editor({
        extensions: [
          new HardBreak(),
          new BulletList(),
          new OrderedList(),
          new ListItem(),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new HorizontalRule(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Your annotation Description goes here.\nYou can format the text with Markdown like\n**bold** or _italic_, - unordered, 1. ordered, --- divider',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
          })
        ],
        content: {
          type: 'doc',
          content: this.value,
        }
      }),

      floatingMenuItems: [
        {
          title: 'Bullet list',
          commandName: 'bullet_list',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path fill="#000" fill-opacity=".8" fill-rule="evenodd" d="M8 6.5H6v1h2v-1zm0 10H6v1h2v-1zm-2-5h2v1H6v-1zm12-5h-8v1h8v-1zm-8 10h8v1h-8v-1zm8-5h-8v1h8v-1z" clip-rule="evenodd"/>
                </svg>`
        },
        {
          title: 'Numbered list',
          commandName: 'ordered_list',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path fill="#000" fill-opacity=".8" fill-rule="evenodd" d="M7.06 5.5h.582v2.92h-.618V6.087h-.017l-.67.42v-.548l.724-.458zM18 6.413H9.96v1.004H18V6.413zm0 10.04H9.96v1.003H18v-1.004zm-8.04-5.02H18v1.003H9.96v-1.004zM6.102 13.44h2.084v-.505H6.958v-.02l.426-.417c.601-.548.763-.822.763-1.154 0-.506-.414-.864-1.04-.864-.615 0-1.036.366-1.034.94h.586c-.001-.28.176-.451.443-.451.257 0 .448.16.448.416 0 .233-.143.393-.408.648l-1.04.962v.445zm2.133 4.2c.001.5-.468.86-1.125.86-.642 0-1.099-.355-1.109-.866h.622c.012.214.216.357.489.357.282 0 .482-.16.48-.392.002-.236-.205-.401-.536-.401h-.273v-.454h.273c.281 0 .477-.155.475-.384.002-.22-.165-.371-.415-.371-.253 0-.457.144-.464.366h-.592c.008-.505.46-.855 1.059-.855.605 0 1.009.362 1.007.822.002.328-.224.56-.55.618v.023c.43.054.66.313.659.677z" clip-rule="evenodd"/>
                </svg>`
        },
        {
          title: 'Seperator',
          commandName: 'horizontal_rule',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="#000" d="M6 12h5M13 12h5"/>
                </svg>`
        }
      ]
    }
  },

  mounted() {
    this.editor.on('update', ({ getJSON }) => {
      const newValue = getJSON().content
      this.$emit('input', newValue)
    })
  },

  beforeDestroy() {
    setTimeout(() => {
      this.editor.destroy()
    }, 300);
  },
}
</script>

<style lang="scss" scoped>
  .editor /deep/ p.is-editor-empty:first-child::before {
    content: attr(data-empty-text);
    color: $color--black-3;
    pointer-events: none;
    height: 0;
    position: absolute;
    width: 100%;
  }

  .editor {
    position: relative;

    &-floatingMenu, &-menuBubble {
      position: absolute;
      visibility: hidden;
      opacity: 0;
      transition: opacity 150ms, visibility 150ms;

      &.is-active {
        opacity: 1;
        visibility: visible;
      }

      button {
        display: inline-flex;
        background: transparent;
        border: 0;
        margin-right: 0.25rem;
        border-radius: 2px;
        cursor: pointer;
        color: white;
        transition: background-color 150ms ease;
        height: 24px;
        width: 24px;
        justify-content: center;
        align-items: center;
        padding: 0;

        svg {
          height: 24px;
          width: 24px;
        }

        * {
          color: white;
          @include font(12);
        }

        b {
          font-weight: bold;
        }

        &:last-child {
          margin-right: 0;
        }

        &:hover {
          background-color: rgba(#fff, 0.15);
        }

        &.is-active {
          background-color: rgba(#fff, 0.25);
        }
      }
    }

    &-floatingMenu {
      // needed
      z-index: 1;
      margin-top: -0.5rem;
      right: 8px;

      // visual styling
      display: flex;
      margin-top: -.25rem;

      button {
        padding: 0;
        opacity: .75;
        transition: opacity 150ms ease;
        color: #fff;

        &:hover {
          opacity: 1;
        }
      }
    }

    &-menuBubble {
      // needed
      z-index: 20;
      transform: translateX(-50%);

      // visual styling
      display: flex;
      background: #000;
      border-radius: 3px;
      padding: 0.3rem;
      margin-bottom: 0.5rem;
    }

    &-content {
      /deep/ {
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;

        * {
          caret-color: currentColor;
        }

        ul,
        ol {
          padding-left: 1rem;
          margin: 0;
        }

        ul > li > ul, 
        ul > li > ul * {
          list-style-type: circle;
        }

        li > p,
        li > ol,
        li > ul {
          margin: 0;
        }

        a {
          color: inherit;
        }

        hr {
          margin: .5rem 0;
          height: 2px;
          border: none;
          border-radius: 2px;
          background: $color--background-grey-f0;
        }
      }
    }
  }
</style>