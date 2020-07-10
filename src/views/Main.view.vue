<template>
  <div class="grid">
    <main>
      <div class="emptyState" v-if="!annotations || !annotations.length">
        <div class="emptyState-inner">
          <p>No annotations found on this page.<br>To add, click on the "Add new" button below.</p>
          <AnnotationItem :showSkeleton="true" />
        </div>
      </div>

      <div class="defaultState" v-else>
        <AnnotationItem 
          v-for="(annotation, i) of annotations" 
          :key="i"
          :itemKey="i"
          @removeAnnotation="removeAnnotation"
          v-model="annotations[i]"
        />
      </div>
    </main>

    <router-link to="/about">
      <FloatingButton v-tooltip.top-left="`Help & About`" />
    </router-link>

    <footer>
      <Button 
        buttonType="primary" 
        :disabled="userHasNothingSelected" 
        @click="createAnnotationItem"
        v-tooltip.right="`Adds a new annotation`">

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

  import { postMsg } from '@/functions/helpers'

  export default {
    components: { FloatingButton, Button, Icon, AnnotationItem },

    data: () => ({
      userHasNothingSelected: false,
      annotations: [{
          title: '', content: { rawMarkdown: '', parsedMdast: null }
        },{
          title: '', content: { rawMarkdown: '', parsedMdast: null }
        },{
          title: '', content: { rawMarkdown: '', parsedMdast: null }
        },{
          title: '', content: { rawMarkdown: '', parsedMdast: null }
        },{
          title: '', content: { rawMarkdown: '', parsedMdast: null }
        }]
    }),

    methods: {
      createAnnotationItem() {
        this.annotations.push({
          title: '', content: { rawMarkdown: '', parsedMdast: null }
        })

        postMsg('req__createAnnotationItem', {})
      },

      removeAnnotation( itemKey ) {
        this.annotations.splice(itemKey, 1)
      }
    },

    created() {
      postMsg('req__selectionState', {})

      onmessage = event => {
        if (event.data.length === 0)
          return

        const msg = event.data.pluginMessage,
              msgValue = msg && msg.value

        switch (msg.type) {
          case 'res__selectionState': {
            this.userHasNothingSelected = !!(msgValue.length === 0)
            break
          }
        
          default:
            break
        }
      }
    },

    watch: {
      annotations: {
        deep: true,
        immediate: true,
        handler( newValue ) {
          // console.log(JSON.stringify(newValue, null, 2))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .grid {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr min-content;

    main {
      overflow: hidden;
      padding: 16px;
      overflow-y: scroll;

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
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        &-inner {
          width: 100%;
          
          p {
            @include font(11, bold);
            text-align: center;
            margin-bottom: 16px;
          }
        }
      }

      .defaultState {
        display: grid;
        gap: 8px;
      }
    }

    .floatingButton {
      position: absolute;
      right: 16px;
      bottom: 16px;
    }

    footer {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 16px;
      border-top: 1px solid $color--background-silver;
      background: $color--background-white;

      

      p {
        margin-left: 8px;
        text-align: center;
      }
    }
  }
</style>