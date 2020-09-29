<template>
  <button 
    :type="type"
    :buttonType="buttonType"
    :class="{ isActive }"
    :tabindex="type === 'tertiary' ? 1 : 0"
    ref="button"
    :disabled="disabled"
    @click="onClick">
    
    <slot />
  </button>
</template>

<script>
  let lastState = null

  export default {
    props: {
      'type': {
        type: String,
        default: 'button',
        validator: (value) => {
          return [ 'button', 'submit', 'reset' ].includes(value)
        }
      },

      'buttonType': {
        type: String,
        default: 'standard',
        validator: (value) => {
          return [ 'primary', 'standard', 'tertiary', 'icon', 'iconDraggable' ].includes(value)
        }
      },

      'isActive': {
        type: Boolean,
        default: false
      },

      'disabled': {
        type: Boolean,
        default: false
      }
    },

    methods: {
      onClick() {
        if (this.$refs && this.$refs.button)
          this.$refs.button.blur()
          
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss" scoped>
  button {
    @include font(11, medium);
    height: 2rem;
    text-align: center;
    padding: 0 15px;
    line-height: 30px;
    border-radius: 6px;
    border: none;
    flex-shrink: 0;
    box-shadow: inset 0 0 0 1px $color--black-8;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;

    &:not([buttonType=icon]) {
      svg {
        margin-left: -8px;
      }
    }
    
    &[buttonType=primary] {
      background: $color--blue;
      color: $color--white;
      box-shadow: none;

      /deep/ * {
        color: $color--white;
      }

      &:not(:disabled) {
        &:active, &:focus {
          box-shadow: inset 0 0 0 2px $color--black-3!important;
        }
      }

      &:disabled {
        background: $color--black-3;
      }
    }

    &[buttonType=standard] {
      background: $color--background-white;

      &:not(:disabled) {
        &:active, &:focus {
          box-shadow: inset 0 0 0 2px $color--blue!important;
        }
      }

      &:disabled {
        color: $color--black-3;
        /deep/ * { color: $color--black-3 }
        box-shadow: inset 0 0 0 1px $color--black-3;
      }
    }

    &[buttonType^=tertiary] {
      background: $color--background-white;
      transition: opacity 150ms ease;
      box-shadow: none;
      cursor: pointer;
      padding: 0;

      &:disabled {
        color: $color--black-3;
        /deep/ * { color: $color--black-3 }
      }
    }

    &[buttonType^=icon] {
      border-radius: 2px;
      box-shadow: none;
      width: 32px;
      padding: 0;
      // /deep/ * {
      //   color: $color--blue;
      // }

      &:not(:disabled) {
        &:hover {
          background: $color--special-hover-fill;
        }

        &:active, &:focus {
          box-shadow: 0 0 0 2px $color--blue;
        }
        
        &.isActive {
          background: $color--blue;
          /deep/ * {
            color: $color--white;
          }
          
          &:active, &:focus {
            box-shadow: inset 0 0 0 2px $color--black-3;
          }
        }
      }

      &:disabled {
        /deep/ * {
          color: $color--black-3;
        }
      }
    }

    &[buttonType=iconDraggable] {
      width: 24px;

      /deep/ svg {
        transform: translateX(4px);
      }

      &:active, &:focus {
        box-shadow: none!important;
      }
    }
  }
</style>