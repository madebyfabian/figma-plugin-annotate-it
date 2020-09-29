<template>
  <div class="grid">
    <Sidebar :annotData="NEWannotData" />

    <main class="scrollContainer" ref="scrollContainer">
      <div v-if="activeAnnotData !== null && activeAnnotData.length === 0" class="emptyState" >
        <div class="emptyState-inner">
          <p>No annotations found on this page.<br>To add, click on the "Add new" button below.</p>
          <AnnotationItem :showSkeleton="true" />
        </div>
      </div>

      <div v-else>
        <header>
          header
        </header>

        <Container 
          @drop="onDrop" 
          drag-handle-selector=".annotationItem-dragHandleButton">

          <Draggable 
            v-for="(annotation, i) in activeAnnotData" 
            :key="annotation.id">

            <div class="draggable-item">
              <transition name="slide" :appear="true">
                <AnnotationItem 
                  v-if="!annotation.isDeleted"
                  :itemKey="i"
                  @removeAnnotation="removeAnnotation"
                  v-model="activeAnnotData[i]"
                />
              </transition>
            </div>
          </Draggable>
        </Container>
      </div>
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
    </footer>
  </div>
</template>

<script>
  import { store, mutations } from '@/store'
  import AnnotationItem from '@/components/AnnotationItem'
  import Sidebar from '@/components/Sidebar'
  import Icon from '@/components/ui/Icon'
  import Button from '@/components/ui/Button'
  import { Container, Draggable } from 'vue-smooth-dnd'
  import { randomId, generateAnnotItemObject } from '@/utils/utils'


  export default {
    components: { Button, Icon, AnnotationItem, Container, Draggable, Sidebar },

    data: () => ({
      userHasNothingSelected: false,
      NEWannotData: null // new
    }),

    computed: {
      annotations_str() { // For getting the old value inside the watcher
        return JSON.stringify(this.activeAnnotData)
      },

      activeWrapperId: () => store.activeWrapperId,
      watchAnnots: () => store.watchAnnots,

      activeAnnotData: {
        get() {
          if (!this.NEWannotData)
            return null
          const frameData = this.NEWannotData.find(frame => frame.id === this.activeWrapperId)
          if (!frameData)
            return null
          return ('annotData' in frameData) ? frameData.annotData : null
        },

        set( newValue ) {
          const index = this.NEWannotData.findIndex(frame => frame.id === this.activeWrapperId)
          this.NEWannotData[index] = newValue
        }
      }
    },

    methods: {
      async watcher( enable = true ) {
        await this.$nextTick()
        this.setWatchAnnots(enable)
        return Promise.resolve()
      },

      async createAnnotationItem() {
        this.NEWannotData.push( generateAnnotItemObject() )

        // Scroll to bottom
        const scrollContainer = this.$refs.scrollContainer
        await this.$nextTick()
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        })
      },

      async removeAnnotation( itemId ) {
        const itemArrIndex = this.NEWannotData.findIndex(item => item.id === itemId)
        this.NEWannotData[itemArrIndex].isDeleted = true

        await this.watcher(false)
        this.NEWannotData.splice(itemArrIndex, 1)
        await this.watcher(true)
      },

      onDrop( dropResult ) {
        this.NEWannotData = onDrop(this.NEWannotData, dropResult)
      },

      setActiveWrapperId: mutations.setActiveWrapperId,
      setWatchAnnots: mutations.setWatchAnnots
    },

    mounted() {
      onmessage = async event => {
        if (event.data.length === 0) return
        const msg = event.data.pluginMessage,
              msgValue = msg && msg.value

        switch (msg.type) {
          case 'doInitAll':
            await this.watcher(false)
            this.NEWannotData = msgValue
            if (msgValue.length)
              this.setActiveWrapperId(msgValue[0].id)
            await this.watcher(true)
            break

          case 'selectionUpdated': 
            this.userHasNothingSelected = !!(msgValue.length === 0)
            break
        }
      }
    },

    watch: {
      annotations_str( newAnnots_str, oldAnnots_str ) {
        if (!this.watchAnnots)
          return

        parent.postMessage({ pluginMessage: {
          type: 'pushAnnotChanges', 
          value: { 
            activeWrapperId: this.activeWrapperId,
            data: {
              newAnnots: JSON.parse(newAnnots_str), 
              oldAnnots: JSON.parse(oldAnnots_str)
            }
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

  .grid {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr min-content;
    grid-template-columns: 160px 1fr;

    aside.sidebar {
      grid-column: 1 / 2;
      grid-row: 1 / 3;
      background: $color--background-grey-f0;
    }

    main {
      overflow: hidden;
      padding: 24px 0;
      overflow-y: scroll;
      position: relative;
      z-index: 0;
      grid-column: 2 / 3;

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

      header {
        height: 56px;
        background: $color--background-white;
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