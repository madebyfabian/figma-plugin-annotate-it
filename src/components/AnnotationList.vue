<template>
  <div class="AnnotationList">
    <Modal 
      title="Are you sure?"
      :confirmLabel="`Yes, delete every annotation (${allData.annotData.length})`"
      :isOpened="isDeleteConfirmationModalOpened" 
      @close="isDeleteConfirmationModalOpened = false" 
      @confirm="removeAllAnnotationsInGroup">

      <p>
        This will delete all annotations inside this group. There is no way to get them back later!
      </p>
    </Modal>
  
    <header>
      <div class="title">
        <Contenteditable 
          class="title-content"
          ref="titleContent"
          spellcheck="false" 
          placeholder="My annotations"
          v-model="allData.pluginData.connectedFrameAliasName"
          @input="handleTitleChange"
          @keydown.enter="handleTitleChangeDone"
          @blur="handleTitleChangeDone"
          :key="allData.pluginData.connectedFrameId"
        />
     
        <Button
          class="title-button"
          buttonType="icon"
          @click.native="handleTitleChangeIconClick"
          v-tooltip.bottom-right="`Click icon or name to edit group name`">

          <Icon iconName="edit" />
        </Button>

        <Button
          class="title-button"
          buttonType="icon"
          @click.native="isDeleteConfirmationModalOpened = true"
          v-tooltip.bottom-right="`Delete this group`">

          <Icon iconName="trash" />
        </Button>
      </div>

      <Button 
        buttonType="primary" 
        @click="addAnnotDataNewAnnot"
        v-tooltip.left="`Add a new annotation`">

        <Icon iconName="plus" />
        Add new
      </Button>
    </header>

    <main class="scrollContainer" ref="scrollContainer">
      <Container 
        @drop="onDrop" 
        drag-handle-selector=".annotationItem-dragHandleButton">

        <Draggable v-for="(annotation, i) in allData.annotData.filter(annotation => !annotation.isDeleted)" :key="annotation.id">
          <div class="draggable-item">
            <transition name="slide" :appear="true">
              <AnnotationItem 
                :itemKey="i"
                @removeAnnotation="removeAnnotation"
                v-model="allData.annotData[i]"
              />
            </transition>
          </div>
        </Draggable>
      </Container>
    </main>
  </div>
</template>

<script>
  import AnnotationItem from '@/components/AnnotationItem'
  import Button from '@/components/ui/Button'
  import Icon from '@/components/ui/Icon'
  import { Container, Draggable } from 'vue-smooth-dnd'
  import { store, mutations } from '@/store'
  import { generateAnnotItemObject } from '@/utils/utils'
  import Contenteditable from '@/components/ui/Contenteditable'
  import Modal from '@/components/ui/Modal'


  export default {
    components: { AnnotationItem, Container, Draggable, Button, Icon, Contenteditable, Modal },

    computed: {
      'allData'() { return store.annotData.find(el => el.id === this.selectedWrapperFrameId) },
      'data_str'() { return JSON.stringify(this.allData.annotData) },
      'watchAnnotations': { get: () => store.watchAnnotations, set: mutations.setWatchAnnotations },
      'selectedWrapperFrameId': () => store.selectedWrapperFrameId
    },

    data: () => ({
      isDeleteConfirmationModalOpened: false
    }),

    methods: {
      async toggleWatcher( newVal ) {
        await this.$nextTick()
        this.watchAnnotations = newVal
        return Promise.resolve()
      },

      async removeAnnotation( itemId ) {
        const annotItem = this.allData.annotData.find(item => item.id === itemId)
        mutations.updateAnnotDataAnnot(this.selectedWrapperFrameId, itemId, { ...annotItem, isDeleted: true })

        // Now "really" delete it.
        await this.toggleWatcher(false)
        mutations.updateAnnotDataAnnot(this.selectedWrapperFrameId, itemId, null, true) 
        await this.toggleWatcher(true)
      },

      async removeAllAnnotationsInGroup() {
        const wrapperFrameId = this.selectedWrapperFrameId

        for (const annot of this.allData.annotData) {
          await this.removeAnnotation(annot.id)
        }
      },

      onDrop( dropResult ) {
        mutations.updateAnnotDataAnnots(this.selectedWrapperFrameId, onDrop(this.allData.annotData, dropResult))
      },

      async addAnnotDataNewAnnot() {
        mutations.addAnnotDataNewAnnot(this.selectedWrapperFrameId, generateAnnotItemObject())

        await this.$nextTick()
        this.$refs.scrollContainer.scrollTo({ // Scroll to bottom
          top: this.$refs.scrollContainer.scrollHeight, behavior: 'smooth'
        })
      },


      // Contenteditable-related
      handleTitleChangeIconClick() {
        this.$setFocusVisible(true)
        const $el = this.$refs.titleContent.$el
        $el.focus()
        document.getSelection().collapse($el.firstChild, $el.firstChild.length)
      },

      handleTitleChange( newVal ) {
        newVal = newVal.trim()
        parent.postMessage({ pluginMessage: {
          type: 'pushAnnotWrapperTitleChange', 
          value: { 
            wrapperFrameId: this.selectedWrapperFrameId,
            newVal
          }
        }}, '*')
      },

      handleTitleChangeDone( e ) {
        e.preventDefault()

        // Empty the user-selection.
        window.getSelection().empty()

        // Remove focus.
        this.$refs.titleContent.$el.blur()
      }
    },

    watch: {
      data_str( newAnnots_str, oldAnnots_str ) {
        if (!this.watchAnnotations) return
        parent.postMessage({ pluginMessage: {
          type: 'pushAnnotChanges', 
          value: { 
            wrapperFrameId: this.selectedWrapperFrameId,
            newAnnots: JSON.parse(newAnnots_str), 
            oldAnnots: JSON.parse(oldAnnots_str)
          }
        }}, '*')
      }
    }
  }

  /**
   * Re-sorts the given array based on a drop-event.
   * @param arr The original array.
   * @param dropResult The data of the new Result.
   * @returns The new, correctly sorted array.
   */
  const onDrop = ( arr, dropResult ) => {
    const { removedIndex, addedIndex, payload } = dropResult
    if (removedIndex === null && addedIndex === null)
      return arr

    const result = [...arr]
    let itemToAdd = payload

    if (removedIndex !== null)
      itemToAdd = result.splice(removedIndex, 1)[0]

    if (addedIndex !== null)
      result.splice(addedIndex, 0, itemToAdd)
    
    return result
  }
</script>

<style lang="scss" scoped>
  .smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper {
    overflow: visible;
  }

  .AnnotationList {
    position: relative;
    display: grid;
    height: 100vh;
    grid-template-rows: min-content 1fr min-content;

    header {
      height: 56px;
      border-bottom: 1px solid $color--background-silver;
      background: $color--background-white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px 0 16px;

      .title {
        display: flex;
        align-items: center;
        margin-right: .75rem;

        &-content {
          // Fake input
          @include font(13, 'bold');
          border-radius: 3px;
          padding: .5rem;
          padding-right: 2rem;
          margin-left: -8px;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          cursor: text;
          max-width: 300px;
          line-height: 1.25;

          &:empty:before {
            content: attr(placeholder);
            @include font(13, 'bold');
            line-height: 1.25;
            opacity: .5;
          }
        }

        &-button {
          margin: -8px 0;
          z-index: 2;
          position: relative;

          &:first-of-type {
            margin-left: -32px;
            margin-right: 8px;
          }

          .icon {
            opacity: .5;
          }
        }
      }
    }

    main {
      overflow: hidden;
      padding: 24px 0 0;
      overflow-y: scroll;
      position: relative;
      z-index: 0;
    }
  }
</style>