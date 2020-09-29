import Vue from "vue"

const baseDomain = 'https://annotate-it-functions.netlify.app'

export const store = Vue.observable({
  functionsBaseUrl: baseDomain + '/.netlify/functions',
  
  activeWrapperId: null,
  annotData: null,
  watchAnnots: null
})

export const mutations = {
  setActiveWrapperId: ( newId ) => {
    store.activeWrapperId = newId
  },

  setAnnotData: ( newData ) => {
    store.annotData = newData
  },

  setWatchAnnots: ( watchAnnots ) => {
    store.watchAnnots = watchAnnots
  }
}