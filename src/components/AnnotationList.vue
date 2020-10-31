<template>
  <div class="AnnotationList">
    <header>
      <div class="title">
        <div 
          contenteditable
          class="title-content"
          spellcheck="false"
          ref="titleContent"
          @input="handleTitleChange"
          @keydown.enter="handleTitleChangeDone"
          @blur="handleTitleChangeDone"
          v-tooltip.bottom-right="`Click icon or name to edit frame name`">

          <span 
            v-if="allData.pluginData.connectedFrameAliasName.length === 0"
            v-text="`My annotations`"
            style="position: absolute; left: 0; opacity: .25;"
          />

          <span v-text="allData.pluginData.connectedFrameAliasName" />

          <Icon 
            class="title-icon" 
            iconName="edit"
          />
        </div>
      </div>

      <Button 
        buttonType="primary" 
        @click="addAnnotDataNewAnnot"
        v-tooltip.left="`Add a new annotation`">

        <Icon iconName="plus" />
        New annotation
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


  export default {
    components: { AnnotationItem, Container, Draggable, Button, Icon },

    computed: {
      'allData'() { return store.annotData.find(el => el.id === this.selectedWrapperFrameId) },
      'data_str'() { return JSON.stringify(this.allData.annotData) },
      'watchAnnotations': { get: () => store.watchAnnotations, set: mutations.setWatchAnnotations },
      'selectedWrapperFrameId': () => store.selectedWrapperFrameId
    },

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

      handleTitleChange( e ) {
        let newVal = e.target.innerText.trim()
        this.allData.pluginData.connectedFrameAliasName = newVal

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
        this.$refs.titleContent.blur()
      }
    },

    watch: {
      data_str( newAnnots_str, oldAnnots_str ) {
        // console.log('watch data exectuded', this.watchAnnotations)
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

        &-content {
          // Fake input
          border-radius: 3px;
          padding: 4px 8px;
          margin-left: -8px;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;

          span {
            @include font(13, 'bold');
          }
        }

        &-icon {
          opacity: .33;
          margin: -8px -10px -8px 0;
          position: relative;
          z-index: 0;
          pointer-events: none;
          user-select: none;
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