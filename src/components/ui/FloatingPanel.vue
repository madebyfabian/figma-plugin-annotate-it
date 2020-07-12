<template>
  <div class="floatingPanel">
    <div class="floatingPanel-header">
      <SectionTitle class="floatingPanel-header-title">{{ title }}</SectionTitle>
      <div class="floatingPanel-header-controls"><!-- Place icon-buttons here --></div>
    </div>

    <slot />
  </div>
</template>

<script>
  import SectionTitle from '@/components/ui/SectionTitle'

  export default {
    components: { SectionTitle },

    props: {
      title: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .floatingPanel {
    width: 200px;
    background: $color--background-white;
    border: 0.5px solid $color--special-black-1;
    border-radius: 3px;
    box-shadow: 0px 3px 14px $color--special-black-1;
    padding-bottom: 12px;
    position: absolute;
    z-index: 3;

    &-header {
      display: flex;

      &-title {
        flex: 1;
        margin: 8px 8px 4px;
      }

      // &-controls {

      // }
    }
  }
</style>