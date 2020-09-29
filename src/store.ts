import Vue from "vue"


export const store = Vue.observable({
  functionsBaseUrl: 'https://annotate-it-functions.netlify.app/.netlify/functions',
  annotations: null,
  watchAnnotations: false
})


export const mutations = {
  setAnnotations: ( newArr: Array<object> ) => store.annotations = newArr,
  updateAnnotation: ( itemId: string, annotObj: object ) => {
    store.annotations = store.annotations.map((item: any) => (item.id === itemId) ? annotObj : item)
  },
  addAnnotation: ( newObj: object ) => {
    store.annotations.push(newObj)
  },
  removeAnnotation: ( itemId: string ) => {
    store.annotations = store.annotations.filter(( item: any ) => item.id !== itemId)
  },

  setWatchAnnotations: ( newVal: boolean ) => store.watchAnnotations = newVal
}