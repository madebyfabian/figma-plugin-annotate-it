<template>
  <FocusVisible>
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
      v-tooltip.top-right="`Send Feedback & Get Support`"
    />

    <FloatingButton 
      class="floatingButton-about"
      @click.native="isAboutViewOpened = true"
      v-tooltip.top-right="`Help & Credits`"
    />
  </FocusVisible>
</template>

<script>
  import '@/scss/tooltip.scss'
  import '@/scss/main.scss'

  import { store } from '@/store'
  import FloatingButton from '@/components/ui/FloatingButton'
  import FocusVisible from 'vue-focus-visible'

  // Views
  import MainView from '@/views/Main.view.vue'
  import AboutView from '@/views/About.view.vue'
  import FeedbackView from '@/views/Feedback.view.vue'


  export default {
    name: "App",

    components: { FocusVisible, MainView, AboutView, FeedbackView, FloatingButton },

    data: () => ({
      isAboutViewOpened: false,
      isFeedbackViewOpened: false
    }),

    async mounted() {
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

        // await fetch(store.functionsBaseUrl + '/log-analytics', {
        //   method: 'POST',
        //   body: JSON.stringify(newData)
        // })
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
      left: 16px;
    }

    &-feedback {
      left: 60px;
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