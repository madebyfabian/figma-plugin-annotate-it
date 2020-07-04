<template>
  <main :class="a11yClass">
    <MainView />
  </main>
</template>

<script>
  import MainView from './views/Main.view'

  export default {
    name: "App",

    components: { MainView },

    data() {
      return {
        'a11yClass': 'using-keyboard'
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
  @import url('https://rsms.me/inter/inter.css');

  * {
    font-family: 'Inter var', system-ui, sans-serif!important;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &:focus { 
      outline: none;
    }
  }

  *:not(html) {
    font-size: 11px;
    letter-spacing: 0.055px;
  }

  html {
    font-size: 16px;
  }

  body {
    margin: 0;
  }

  *, *::after, *::before {
    box-sizing: border-box;
    line-height: 16px;
  }

  .using-keyboard *:focus {
    box-shadow: 0 0 0 2px #18a0fb!important;
  }
  
  body {
    color: #333;
    overflow: hidden;
  }
</style>