<template>
  <div :class="a11yClass">
    <transition name="slide" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  import '@/scss/tooltip.scss'

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
  @font-face {
    font-family: 'Inter var';
    font-weight: 100 900;
    font-style: normal;
    font-named-instance: 'Regular';
    font-display: swap;
    src: url('https://rsms.me/inter/font-files/Inter-roman.var.woff2?3.13') format('woff2');
  }

  @font-face {
    font-family: 'Inter var';
    font-weight: 100 900;
    font-style: italic;
    font-named-instance: 'Italic';
    font-display: swap;
    src: url('https://rsms.me/inter/font-files/Inter-italic.var.woff2?3.13') format('woff2');
  }

  * {
    font-family: 'Inter var', system-ui, sans-serif!important;
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
    --color--background-22: #222;

    --color--special-hover-fill: rgba(0, 0, 0, 0.06);
    --color--special-black-1: rgba(0, 0, 0, 0.1);
    --color--special-selection-a: #DAEBF7;
  }

  *:not(html), *::after, *::before {
    @include font;
    color: $color--black-8;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    overflow: hidden;
  }

  b, strong {
    font-weight: 600;
  }

  p {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: $color--blue;
  }

  p a, ol a, ul a {
    text-decoration: underline;
  }

  // .using-keyboard *:focus {
  //   box-shadow: 0 0 0 2px #18a0fb!important;
  // }

  .scrollContainer {
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
  }


  // "slide" transition
  .slide-enter-active,
  .slide-leave-active {
    transition-duration: 300ms;
    // transition-duration: 1s;
    transition-property: height, opacity, transform;
    transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
    overflow: hidden;
  }

  .slide-enter,
  .slide-leave-active {
    opacity: 0;
  }

  .slide-enter {
    transform: translate(-1em, 0);
  }

  .slide-leave-active {
    transform: translate(1em, 0);
  }


  // "slideDown" transition
  .slideDown-enter-active,
  .slideDown-leave-active {
    transition-duration: 150ms;
    transition-property: opacity, transform;
    transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
    overflow: hidden;
  }

  .slideDown-enter,
  .slideDown-leave-active {
    opacity: 0;
  }

  .slideDown-enter,
  .slideDown-leave-active {
    transform: translateY(-1em);
  }
</style>