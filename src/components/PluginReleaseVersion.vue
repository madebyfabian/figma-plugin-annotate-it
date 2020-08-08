<template>
  <p class="pluginReleaseVersion" v-if="pluginGithubData.version">
    <br><br>
    <i>Annotate it! {{ pluginGithubData.version }}@{{ pluginGithubData.date }}</i>
  </p>
</template>

<script>
  export default {
    data: () => ({
      pluginGithubData: {
        version: null,
        date: null
      }
    }),

    async created() {
      const apiRes = await fetch('https://api.github.com/repos/madebyfabian/figma-plugin-annotate-it/releases/latest')
      const apiData = await apiRes.json()
      
      this.pluginGithubData.version = apiData.name
      this.pluginGithubData.date = apiData.published_at
    }
  }
</script>

<style lang="scss" scoped>
  .pluginReleaseVersion {
    opacity: .75; 
    text-align: right;
  }
</style>