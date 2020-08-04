<template>
  <div class="feedbackView">
    <a @click="$emit('close-view')" href="#">&larr; Back</a>

    <div v-if="!isFeedbackSent">
      <SectionTitle>Send us your Feedback!</SectionTitle>
      <p>If you have any ideas for features, issues or perhaps ways to improve the plugin, we would love to hear from you.</p>
      <br>
      <input type="text" placeholder="Your Name (optional)" v-model="feedbackData.name">
      <br>
      <input type="email" placeholder="Your Email (optional)" v-model="feedbackData.email">
      <br>
      <textarea placeholder="Your Message" v-model="feedbackData.message" />
      <p class="error-line" v-if="isError">Error sending your Feedback. Please try again!</p>
      <p class="error-line" v-if="isNotFilled">Please at least fill in a Feedback-Message! 🥰</p>
      
      <br><br>
      <Button buttonType="primary" @click.native="sendFeedback">Send Feedback</Button>
    </div>

    <div v-else>
      <SectionTitle>Thank you for your Feedback! 🎉</SectionTitle>
      <p>This helps us to continue making this plugin even better.</p>
    </div>

    <br><br>
    <p>
      Feel free to shoot us an email at <a href="mailto:annotate-it@uxtionary.com" target="_blank">annotate-it@uxtionary.com</a>
    </p>
  </div>
</template>

<script>
  import SectionTitle from '@/components/ui/SectionTitle'
  import Button from '@/components/ui/Button'

  export default {
    components: { SectionTitle, Button },

    data: () => ({
      feedbackData: {
        name: '',
        email: '',
        message: ''
      },
      isFeedbackSent: false,
      isError: false,
      isNotFilled: false
    }),

    methods: {
      async sendFeedback() {
        const template = `
          <table>
            <tr><td style="width: 90px;"><b>Name</b></td><td>${this.feedbackData.name || 'Unknown'}</td></tr>
            <tr><td style=""><b>E-Mail</b></td><td>${this.feedbackData.email || 'Unknown'}</td></tr>
            <tr><td style="vertical-align: top"><b>Feedback</b></td><td>${this.feedbackData.message.replace(/(?:\r\n|\r|\n)/g, '<br>')}</td></tr>
          </table>
        `

        if (this.feedbackData.message.length === 0) {
          this.isNotFilled = true
          return
        }
        this.isNotFilled = false

        let that = this

        const res = await fetch(`https://lucid-tesla-62e4f4.netlify.app/.netlify/functions/send-feedback-email`, {
          method: 'POST',
          body: JSON.stringify({ template })
        }).then(response => {
            if (!response.ok) { throw response }
            that.isError = false
            return response.json()
          })
          .then(json => {
            that.isFeedbackSent = true
          })
          .catch(err => {
            that.isError = true
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .feedbackView {
    .sectionTitle {
      margin: 16px 0 0;
      padding-left: 0;
      width: 100%;
    }

    input, textarea {
      width: 260px;
      border-radius: 3px;
      border: 1px solid $color--special-black-1;

      &::placeholder {
        color: $color--black-3;
      }
    }

    input {
      margin-bottom: 8px;
      padding: 0 8px;
      height: 32px;
    }

    textarea {
      height: 80px;
      padding: 8px;
      resize: none;
    }

    .error-line {
      color: $color--red;
      margin-top: 8px;
    }
  }
</style>