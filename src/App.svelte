<script>
  // Import routes
  import routes from './router'
  import Router from 'svelte-spa-router'


  // Import global styles.
  import './global.scss' 

  // Import global styles from figma-components
  import { GlobalCSS } from 'figma-plugin-ds-svelte'; 

  // import { Button, Input, SelectMenu, Checkbox } from 'figma-plugin-ds-svelte';

</script>

<body>
  <Router {routes}/>
</body>

<style lang="scss">
  body {
    margin: 16px;
  }
  // $red: red;

  // @mixin test {
  //   color: blue;
  // }
  
  // div {
  //   height: 10px;
  // }
  
  // main {
  //   h1 {
  //     @include test;
  //     background: $red;
  //   }
  // }
</style>
