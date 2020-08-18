import Vue from "vue"

const baseDomain = 'https://annotate-it-functions.netlify.app'

export const store = Vue.observable({
  functionsBaseUrl: baseDomain + '/.netlify/functions'
})