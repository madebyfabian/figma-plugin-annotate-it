<script>
  import './global.scss' // Import global styles.
  let test = 'world'

  let obj = { haha: true }
  console.log(obj?.omg)
</script>

<main>
  <h1>Hello { test }!</h1>
  <div>lol</div>
</main>

<style lang="scss">
  $red: red;

  @mixin test {
    color: blue;
  }
  
  div {
    height: 10px;
  }
  
  main {
    h1 {
      @include test;
      background: $red;
    }
  }
</style>
