<template>
  <div :class="a11yClass">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: "App",

    data() {
      return {
        a11yClass: 'using-keyboard'
      }
    },

    methods: {
      a11yClassChange(usingKeyboard) {
        this.a11yClass = usingKeyboard ? 'using-keyboard' : 'using-mouse'
      }
    },

    mounted() {
      window.addEventListener('keydown', (e) => this.a11yClassChange(true))
      window.addEventListener('mousedown', (e) => this.a11yClassChange(false))
      window.addEventListener('touchstart', (e) => this.a11yClassChange(false))
    }
  };
</script>

<style lang="scss">
  * {
    font-family: 'Inter', system-ui, sans-serif!important;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &:focus { 
      outline: none;
    }
  }

  :root {
    --color--blue: #18A0FB;
    --color--red: #F24822;

    --color--black: #000;
    --color--black-8: rgba(0, 0, 0, .8);
    --color--black-3: rgba(0, 0, 0, .3);
    --color--white: #fff;

    --color--background-white: #fff;
    --color--background-grey-f0: #f0f0f0;
    --color--background-silver: #E5E5E5;

    --color--special-hover-fill: rgba(0, 0, 0, 0.06);
    --color--special-black-1: rgba(0, 0, 0, 0.1);
  }

  *:not(html), *::after, *::before {
    @include font;
    color: $color--black-8;
    box-sizing: border-box;
  }

  body {
    margin: 16px;
    overflow: hidden;
  }

  b, strong {
    font-weight: 600;
  }

  p {
    margin: 0;
  }

  // .using-keyboard *:focus {
  //   box-shadow: 0 0 0 2px #18a0fb!important;
  // }



  .vb > .vb-dragger {
    z-index: 5;
    width: 12px;
    right: 0;
    cursor: pointer;
  }
  .vb > .vb-dragger > .vb-dragger-styler {
    backface-visibility: hidden;
    transform: rotate3d(0,0,0,0);
    transition:
      background-color 100ms ease-out,
      margin 100ms ease-out,
      height 100ms ease-out;
    background-color: $color--black-3;
    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
  }
</style>