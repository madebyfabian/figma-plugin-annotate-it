<template>
  <p class="pluginReleaseVersion" v-if="version && date">
    <br><br>
    <i>Annotate it! {{ version }}@{{ date }}</i>
  </p>
</template>

<script>
  export default {
    data: () => ({
      version: `v${VERSION}`, // VERSION is defined in webpack
      date: null
    }),

    async created() {
      const apiRes = await fetch(`https://api.github.com/repos/madebyfabian/figma-plugin-annotate-it/releases/tags/${this.version}`)
      const apiData = await apiRes.json()
      
      this.date = apiData.published_at
    }
  }
</script>

<style lang="scss" scoped>
  .pluginReleaseVersion {
    opacity: .75; 
    text-align: right;
  }
</style>