<template>
  <div class="grid">
    <Sidebar />

    <main>
      <div class="container" v-bar>
        <div class="container-scrollContent">
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
        </div>
      </div>

      <footer>
        <Button buttonType="primary" :disabled="userHasNothingSelected" @click="createAnnotationItem">
          <Icon iconName="plus" />
          Add new
        </Button>
        <p v-if="userHasNothingSelected">To add annotations, please select a frame.</p>
      </footer>
    </main>
  </div>
</template>

<script>
  import Sidebar from '@/components/Sidebar'
  import AnnotationItem from '@/components/AnnotationItem'

  import Icon from '@/components/ui/Icon'
  import Button from '@/components/ui/Button'

  import { postMsg } from '@/functions/helpers'

  export default {
    components: { Sidebar, Button, Icon, AnnotationItem },

    data: () => ({
      userHasNothingSelected: false,
      annotations: []
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
          console.log(JSON.stringify(newValue, null, 2))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .grid {
    height: 100%;
    display: grid;
    grid-template-columns: 168px 1fr;
    gap: 16px 8px;

    main {
      display: grid;
      max-height: calc(100vh - 16px - 16px); // 100% minus plugins padding 16px * 2
      grid-template-rows: 1fr min-content;

      .container {
        height: 100%;
        border: 1px solid $color--background-silver;
        background: $color--background-white;
        border-bottom: none;
        border-radius: 4px 4px 0 0;
        overflow: hidden;
        flex: 1;

        &-scrollContent {
          padding: 16px;
          padding-right: 24px;
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
      
      footer {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 16px;
        border-radius: 0px 0px 4px 4px;
        border: 1px solid $color--background-silver;
        background: $color--background-white;

        p {
          margin-left: 8px;
          text-align: center;
        }
      }
    }
  }
</style>