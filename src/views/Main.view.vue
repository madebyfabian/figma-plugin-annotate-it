<template>
  <main>
    <p class="test">Test →</p>
  </main>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
  .test {
    @include text(14, bold);
    font-size: 100px;
    line-height: 100%;
    font-weight: 100;
    color: $color--blue;
    transition: font-weight 1s ease;

    &:hover {
      font-weight: 900;
    }
  }
</style>