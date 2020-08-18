<template>
  <div :class="a11yClass">
    <MainView />

    <transition name="slide" mode="out-in">
      <AboutView 
        class="view"
        v-if="isAboutViewOpened"
        @close-view="isAboutViewOpened = false" />

      <FeedbackView 
        class="view"
        v-if="isFeedbackViewOpened"
        @close-view="isFeedbackViewOpened = false" />
    </transition>

    <FloatingButton 
      buttonType="secondary"
      class="floatingButton-feedback"
      @click.native="isFeedbackViewOpened = true"
      v-tooltip.top-left="`Send Feedback & Get Support`"
    />

    <FloatingButton 
      class="floatingButton-about"
      @click.native="isAboutViewOpened = true"
      v-tooltip.top-left="`Help & Credits`"
    />
  </div>
</template>

<script>
  import '@/scss/tooltip.scss'
  import '@/scss/main.scss'

  import { store } from '@/store'

  // @ts-ignore
  import MainView from '@/views/Main.view.vue'

  // @ts-ignore
  import AboutView from '@/views/About.view.vue'

  // @ts-ignore
  import FeedbackView from '@/views/Feedback.view.vue'

  import FloatingButton from '@/components/ui/FloatingButton'


  export default {
    name: "App",

    components: { MainView, AboutView, FeedbackView, FloatingButton },

    data: () => ({
      a11yClass: 'using-keyboard',
      isAboutViewOpened: false,
      isFeedbackViewOpened: false
    }),

    methods: {
      a11yClassChange( usingKeyboard ) {
        this.a11yClass = usingKeyboard ? 'using-keyboard' : 'using-mouse'
      }
    },

    async mounted() {
      window.addEventListener('keydown', (e) => this.a11yClassChange(true))
      window.addEventListener('mousedown', (e) => this.a11yClassChange(false))
      window.addEventListener('touchstart', (e) => this.a11yClassChange(false))

      // Analytics
      try {
        const apiRes = await fetch('https://json.geoiplookup.io/'), // alternative:  https://api.ipdata.co/?api-key=test
              apiData = await apiRes.json()

        const newData = {
          // From IP API
          user_ip: apiData.ip,
          user_location: apiData.country_code,

          // From Window
          user_screen_resolution: `${window.screen.width}x${window.screen.height}`,

          // From window.navigator
          user_language: navigator.language,

          // Gets parsed server-side.
          _userAgent: navigator.userAgent
        }

        await fetch(store.functionsBaseUrl + '/log-analytics', {
          method: 'POST',
          body: JSON.stringify(newData)
        })
      } catch (error) {
        console.error(error)
      }
    }
  };
</script>

<style lang="scss">
  .floatingButton {
    position: absolute;
    bottom: 16px;
    z-index: 2;

    &-about {
      right: 16px;
    }

    &-feedback {
      right: 60px;
    }
  }

  .view {
    height: 100vh;
    padding: 16px;
    max-height: 100vh;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 9999;

    user-select: text!important;
    /deep/ * {
      user-select: text!important;
    }
  }
</style>