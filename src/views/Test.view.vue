<template>
  <div class="grid">
    <div class="simple-page" style="height: 100vh; overflow-y: scroll">
      <button @click="addItem">Add item</button>
      <Container 
        @drop="onDrop" 
        drag-handle-selector=".column-drag-handle">

        <Draggable v-for="(item, i) in items" :key="item.id">
          <div class="draggable-item">
            <transition name="slide" :appear="true">
              <div class="c" v-if="!item.isDeleted">
                <span class="column-drag-handle" style="float:left; padding:0 10px;">&#x2630;</span>
                #{{i}}
                <button @click="() => remove(item.id)">Remove</button>
              </div>
            </transition>
          </div>
        </Draggable>
      </Container>
    </div>
    <pre>
      {{ JSON.stringify(items, null, 2) }}
    </pre>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import { randomId, onDrop } from '@/functions/helpers'

const generateItem = () => {
  const id = randomId()
  return { id , data: '#' + id, isDeleted: false }
}

export default {
  components: { Container, Draggable },

  data () {
    return {
      items: [ generateItem(), generateItem(), generateItem() ]
    }
  },

  methods: {
    onDrop (dropResult) {
      this.items = onDrop(this.items, dropResult)
    },

    remove( itemId ) {
      const itemArrIndex = this.items.findIndex(item => item.id === itemId)
      this.items[itemArrIndex].isDeleted = true

      setTimeout(() => {
        this.items.splice(itemArrIndex, 1)
      }, 300)
    },

    addItem() {
      this.items.push(generateItem())
    }
  }
}
</script>

<style lang="scss" scoped>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
  }

  .c {
    padding: 16px;
    margin-bottom: 24px;
    background: lightblue;

    .column-drag-handle {
      cursor: grab; // move
    }
  }
</style>