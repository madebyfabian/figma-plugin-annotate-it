<template>
  <h2 
    class="sectionTitle"
    :type="type">

    <slot />
  </h2>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'default',
        validator: (value) => 
          [ 'default', 'large' ].includes(value)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sectionTitle {
    padding: 8px;
    margin: 0 -8px;
    background: $color--background-white;

    &[type=default] {
      min-height: 32px;
      width: 128px;
      @include font(11, bold);
    }

    &[type=large] {
      min-height: 40px;
      width: 160px;
      @include font(14, bold);
    }
  }
</style>