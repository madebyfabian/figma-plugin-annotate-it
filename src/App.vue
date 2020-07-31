<template>
  <div :class="a11yClass">
    <MainView />

    <transition name="slide" mode="out-in">
      <AboutView 
        v-if="isAboutViewOpened"
        @closeView="isAboutViewOpened = false" />
    </transition>

    <FloatingButton 
      @click.native="isAboutViewOpened = true"
      v-tooltip.top-left="`Help & Support`"
    />
  </div>
</template>

<script>
  import '@/scss/tooltip.scss'
  import '@/scss/main.scss'

  // @ts-ignore
  import MainView from '@/views/Main.view.vue'

  // @ts-ignore
  import AboutView from '@/views/About.view.vue'

  import FloatingButton from '@/components/ui/FloatingButton'


  export default {
    name: "App",

    components: { MainView, AboutView, FloatingButton },

    data: () => ({
      a11yClass: 'using-keyboard',
      isAboutViewOpened: false
    }),

    methods: {
      a11yClassChange( usingKeyboard ) {
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
  .floatingButton {
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 2;
  }

  .aboutView {
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 9999;
  }
</style>