<template>
  <div class="modal" v-if="isOpened">
    <FocusLock>
      <div 
        class="modal-container"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription">

        <div class="modal-header" id="modalTitle">
          {{ title }}
          
          <Button 
            buttonType="icon" 
            @click.native="closeModal" 
            aria-label="Close modal">

            <Icon iconName="plus" style="transform: rotate(45deg) scale(1.25)" />
          </Button>
        </div>

        <section 
          class="modal-content"
          id="modalDescription">

          <slot />
        </section>

        <div class="modal-footer">
          <Button 
            buttonType="standard" 
            @click.native="closeModal"
            v-text="`Cancel`" 
          />

          <Button 
            buttonType="primary" 
            :isDanger="true" 
            @click.native="confirmModal"
            v-text="confirmLabel" 
          />
        </div>
      </div>
    </FocusLock>
  </div>
</template>

<script>
  import Button from '@/components/ui/Button'
  import Icon from '@/components/ui/Icon'
  import FocusLock from 'vue-focus-lock'

  export default {
    components: { Button, Icon, FocusLock },

    props: {
      isOpened:     { type: Boolean, required: true },
      title:        { type: String, default: '' },
      confirmLabel: { type: String, default: 'Okay' }
    },

    methods: {
      closeModal() {
        this.$emit('close')
      },

      confirmModal() {
        this.$emit('confirm')
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(#fff, .75);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;

    &-container {
      border-radius: 3px;
      background: $color--white;
      box-shadow: 0 2px 14px rgba(0,0,0,.15), 0 0 0 0.5px rgba(0,0,0,.2);
      width: 320px;
      margin-bottom: 20vh;
    }

    &-header, &-content, &-footer {
      padding: 0 .75rem;
    }

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding-right: 4px;
      border-bottom: 1px solid rgba(0,0,0,.1);
      @include font(11, 'bold');
    }

    &-content {
      padding: 1rem .75rem;
    }

    &-footer {
      border-top: 1px solid rgba(0,0,0,.1);
      height: 66px;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      
      button {
        margin-left: .5rem;
      }
    }
  }
</style>