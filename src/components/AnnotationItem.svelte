<article class="annotation-item">
  <div class="id">#1</div>
  <div class="input-group">
    <input class="input-group__title" type="text" placeholder="Title">
    <div class="input-group__description" contenteditable placeholder="Description" bind:innerHTML={ values.description }></div>
  </div>
</article>

<style lang="scss">
  .annotation-item {
    display: flex;

    .id {
      width: 40px;
      padding-top: 16px;
      padding-left: 8px;
    }

    .input-group {
      max-width: 400px;
      flex: 1;

      &__title, &__description {
        padding: 16px;
        width: 100%;
        border: 1px solid rgba(#000, .25);

        &:focus { 
          outline: none;
        }
      }

      &__title {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        
      }

      &__description {
        height: 200px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        border-top: none;
      }
    }
  }
</style>

<script>
  import marked from 'marked'

  let values = {
    description: `
      Haha<br>
      Omg, yeah!
    `
  }
  
</script>