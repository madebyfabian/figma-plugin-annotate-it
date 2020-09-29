<template>
  <div class="grid">
    <main class="scrollContainer" ref="scrollContainer">
      <div class="emptyState" v-if="annotations !== null && annotations.length === 0">
        <div class="emptyState-inner">
          <p>No annotations found on this page.<br>To add, click on the "Add new" button below.</p>
          <AnnotationItem :showSkeleton="true" />
        </div>
      </div>

      <Container 
        @drop="onDrop" 
        drag-handle-selector=".annotationItem-dragHandleButton">

        <Draggable v-for="(annotation, i) in annotations" :key="annotation.id">
          <div class="draggable-item">
            <transition name="slide" :appear="true">
              <AnnotationItem 
                v-if="!annotation.isDeleted"
                :itemKey="i"
                @removeAnnotation="removeAnnotation"
                v-model="annotations[i]"
              />
            </transition>
          </div>
        </Draggable>
      </Container>
    </main>

    <footer>
      <Button 
        buttonType="primary" 
        :disabled="userHasNothingSelected" 
        @click="createAnnotationItem"
        v-tooltip.right="`Add a new annotation`">

        <Icon iconName="plus" />
        Add new
      </Button>
      <p v-if="userHasNothingSelected">To add annotations, please select a frame.</p>
    </footer>
  </div>
</template>

<script>
  import AnnotationItem from '@/components/AnnotationItem'
  import Icon from '@/components/ui/Icon'
  import Button from '@/components/ui/Button'
  import { Container, Draggable } from 'vue-smooth-dnd'
  import { randomId, generateAnnotItemObject } from '@/utils/utils'
  import { store, mutations } from '@/store'

  export default {
    components: { Button, Icon, AnnotationItem, Container, Draggable },

    data: () => ({
      userHasNothingSelected: false
    }),

    computed: {
      'annotations': { get: () => store.annotations, set: mutations.setAnnotations },
      'annotationsStr': () => JSON.stringify(store.annotations),
      'watchAnnotations': { get: () => store.watchAnnotations, set: mutations.setWatchAnnotations }
    },

    methods: {
      updateAnnotation: mutations.updateAnnotation,
      addAnnotation: mutations.addAnnotation,

      async removeAnnotation( itemId ) {
        const annotItem = this.annotations.find(item => item.id === itemId)
        this.updateAnnotation(itemId, { ...annotItem, isDeleted: true })
        
        await this.toggleWatcher(false)
        mutations.removeAnnotation(itemId)
        await this.toggleWatcher(true)
      },

      async toggleWatcher( newVal ) {
        await this.$nextTick()
        this.watchAnnotations = newVal
        return Promise.resolve()
      },

      async createAnnotationItem() {
        this.addAnnotation(generateAnnotItemObject())

        await this.$nextTick()
        this.$refs.scrollContainer.scrollTo({ // Scroll to bottom
          top: this.$refs.scrollContainer.scrollHeight, behavior: 'smooth'
        })
      },

      onDrop( dropResult ) {
        this.annotations = onDrop(this.annotations, dropResult)
      }
    },

    async mounted() {
      onmessage = async event => {
        if (event.data.length === 0) return
        const msg = event.data.pluginMessage,
              msgValue = msg && msg.value

        switch (msg.type) {
          case 'doInit':
            await this.toggleWatcher(false)
            this.annotations = msgValue
            await this.toggleWatcher(true)
            break

          case 'selectionUpdated': 
            this.userHasNothingSelected = !!(msgValue.length === 0)
            break
        }
      }
    },

    watch: {
      annotationsStr( newAnnots_str, oldAnnots_str ) {
        if (!this.watchAnnotations) return
        parent.postMessage({ pluginMessage: {
          type: 'pushAnnotChanges', 
          value: { newAnnots: JSON.parse(newAnnots_str), oldAnnots: JSON.parse(oldAnnots_str) }
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

  .grid {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr min-content;

    main {
      overflow: hidden;
      padding: 24px 0;
      overflow-y: scroll;
      position: relative;
      z-index: 0;

      .emptyState {
        padding: 16px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: $color--background-white;

        &-inner {
          width: 100%;
          
          p {
            @include font(11, bold);
            text-align: center;
            margin-bottom: 24px;
          }
        }
      }
    }

    footer {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 16px;
      border-top: 1px solid $color--background-silver;
      background: $color--background-white;
      position: relative;
      z-index: 1;

      p {
        margin-left: 8px;
        text-align: center;
      }
    }
  }
</style>