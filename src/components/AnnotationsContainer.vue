<template>
  <div class="container">
    <div class="emptyState">
      <div class="emptyState-inner">
        <p>You have no annotations.<br>To add, click on the "Add new" button below.</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
  .container {
    border: 1px solid $color--background-silver;
    background: $color--background-white;
    // border-bottom: none;
    // border-radius: 4px 4px 0 0;
    border-radius: 4px;
    background: $color--background-grey-f0;

    .emptyState {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;

      p {
        @include font(11, bold);
        text-align: center;
      }
    }
  }
</style>