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

    <router-link to="/about">
      <FloatingButton v-tooltip.top-left="`Help & Support`" />
    </router-link>

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
  import FloatingButton from '@/components/ui/FloatingButton'
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
    components: { FloatingButton, Button, Icon, AnnotationItem, Container, Draggable },

    data: () => ({
      userHasNothingSelected: false,
      annotations: null,
      enableWatcher: false
    }),

    methods: {
      createAnnotationItem() {
        this.annotations.push( generateAnnotItemObject() )

        // Scroll to bottom
        const scrollContainer = this.$refs.scrollContainer
        this.$nextTick(() => {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          })
        })
      },

      removeAnnotation( itemId ) {
        const itemArrIndex = this.annotations.findIndex(item => item.id === itemId)
        this.annotations[itemArrIndex].isDeleted = true

        setTimeout(() => {
          this.annotations.splice(itemArrIndex, 1)
        }, 300)
      },

      onDrop( dropResult ) {
        this.annotations = onDrop(this.annotations, dropResult)
      }
    },

    mounted() {
      onmessage = event => {
        if (event.data.length === 0) return
        const msg = event.data.pluginMessage,
              msgValue = msg && msg.value

        switch (msg.type) {
          case 'doInit': 
            this.annotations = msgValue
            this.$nextTick(function() {
              this.enableWatcher = true
            })

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
        if (!this.enableWatcher)
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

      &::-webkit-scrollbar {
        width: 14px;
      }
      
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba(0, 0, 0, .15);
        padding: 2px;
        border: 4px solid white;
        cursor: pointer;
        transform: translateX(10px);
        
        &:hover {
          border-width: 4px 3px;
        }
      }

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

    .floatingButton {
      position: absolute;
      right: 16px;
      bottom: 16px;
      z-index: 2;
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