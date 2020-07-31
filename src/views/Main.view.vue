<template>
  <div class="grid">
    <main class="scrollContainer" ref="scrollContainer">
      <div class="emptyState" v-if="!annotations || !annotations.length">
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

    <!-- for debugging: -->
    <!-- <pre style="position: fixed; overflow-y: scroll; bottom: 0; right: 0; 
    z-index: 999; background: #eee; height: 150px; width: 300px; 
    box-shadow: 0 5px 10px 0 rgba(0,0,0,.1); padding: 10px; font-size: 9px; border-radius: 8px">{{ JSON.stringify(annotations, null, 2) }}</pre> -->
  </div>
</template>

<script>
  import AnnotationItem from '@/components/AnnotationItem'
  import Icon from '@/components/ui/Icon'
  import Button from '@/components/ui/Button'
  import { Container, Draggable } from 'vue-smooth-dnd'
  import { randomId, generateAnnotItemObject } from '@/utils/utils'


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
  

  export default {
    components: { Button, Icon, AnnotationItem, Container, Draggable },

    data: () => ({
      userHasNothingSelected: false,
      annotations: null,
      watchAnnotations: false
    }),

    methods: {
      async disableWatcher() {
        await this.$nextTick()
        this.watchAnnotations = false
        return Promise.resolve()
      },

      async enableWatcher() {
        await this.$nextTick()
        this.watchAnnotations = true
        return Promise.resolve()
      },

      async createAnnotationItem() {
        this.annotations.push( generateAnnotItemObject() )

        // Scroll to bottom
        const scrollContainer = this.$refs.scrollContainer
        await this.$nextTick()
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        })
      },

      async removeAnnotation( itemId ) {
        const itemArrIndex = this.annotations.findIndex(item => item.id === itemId)
        this.annotations[itemArrIndex].isDeleted = true

        await this.disableWatcher()
        this.annotations.splice(itemArrIndex, 1)
        await this.enableWatcher()
      },

      onDrop( dropResult ) {
        this.annotations = onDrop(this.annotations, dropResult)
      }
    },

    mounted() {
      onmessage = async event => {
        if (event.data.length === 0) return
        const msg = event.data.pluginMessage,
              msgValue = msg && msg.value

        switch (msg.type) {
          case 'doInit':
            await this.disableWatcher()
            this.annotations = msgValue
            await this.enableWatcher()

            break

          case 'selectionUpdated': 
            this.userHasNothingSelected = !!(msgValue.length === 0)
            break
        }
      }
    },

    computed: {
      annotations_str() { // For getting the old value inside the watcher
        return JSON.stringify(this.annotations)
      }
    },

    watch: {
      annotations_str( newAnnots_str, oldAnnots_str ) {
        if (!this.watchAnnotations)
          return

        parent.postMessage({ pluginMessage: {
          type: 'pushAnnotChanges', 
          value: { 
            newAnnots: JSON.parse(newAnnots_str), 
            oldAnnots: JSON.parse(oldAnnots_str)
          }
        }}, '*')
      }
    }
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