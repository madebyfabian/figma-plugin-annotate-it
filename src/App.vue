<template>
  <main :class="a11yClass">
    <router-view/>
  </main>
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

  *:not(html), *::after, *::before {
    @include font;
    color: $color--black-8;
    box-sizing: border-box;
  }

  body {
    margin: 16px;
    overflow: hidden;
  }

  .using-keyboard *:focus {
    box-shadow: 0 0 0 2px #18a0fb!important;
  }
</style>