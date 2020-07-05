<template>
  <div class="grid">
    <Sidebar />

    <main>
      <AnnotationsContainer class="content" />

      <footer>
        <Button :disabled="userHasNothingSelected">
          <Icon iconName="plus" />
          Add new
        </Button>
        <p v-if="userHasNothingSelected">To add annotations, please select a frame.</p>
      </footer>
    </main>
    
    <div class="bottom-content">
      <div class="left">
        
      </div>
      <Button buttonType="primary" :disabled="true">Place annotations</Button>
    </div>
  </div>
</template>

<script>
  import Sidebar from '@/components/Sidebar'
  import AnnotationsContainer from '@/components/AnnotationsContainer'

  import Icon from '@/components/ui/Icon'
  import Button from '@/components/ui/Button'

  import { postMsg } from '@/functions/helpers'

  export default {
    components: { Sidebar, Button, Icon, AnnotationsContainer },

    data: () => ({
      userHasNothingSelected: false
    }),

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
    }
  }
</script>

<style lang="scss" scoped>
  .grid {
    height: 100%;
    display: grid;
    grid-template-columns: 176px 1fr;
    grid-template-rows: 1fr min-content;
    gap: 16px 8px;

    main {
      display: grid;
      grid-template-rows: 1fr min-content;

      .content {
        height: 100%;
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

    .bottom-content {
      grid-column: 2 / 3;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;

        button {
          margin-right: 8px;
        }
      }
    }
  }
</style>