<template>
  <div class="container">
    <div class="emptyState">
      <div class="emptyState-inner">
        <p>No annotations found on this page.<br></p>
        <AnnotationItem :showSkeleton="true" />
      </div>
    </div>
  </div>
</template>

<script>
  import AnnotationItem from '@/components/AnnotationItem'

  export default {
    components: { AnnotationItem }
  }
</script>

<style lang="scss" scoped>
  .container {
    border: 1px solid $color--background-silver;
    background: $color--background-white;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    padding: 16px;

    .emptyState {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;

      &-inner {
        width: 100%;
        
        p {
          @include font(11, bold);
          text-align: center;
          margin-bottom: 16px;
        }
      }
    }
  }
</style>