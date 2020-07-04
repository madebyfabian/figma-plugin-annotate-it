<script>
  // import { link } from 'svelte-spa-router'
  import AnnotationItem from '../components/AnnotationItem.svelte'

  $: isFrameSelected = false

  onmessage = event => {
    const msg = event.data.pluginMessage
    console.log(msg)

    switch (msg.type) {
      case 'selectionchange':
        console.log('ja moin', msg.value.length)
        if (msg.value.length !== 0)
          isFrameSelected = true
        else
          isFrameSelected = false

        break
    }
  }

  import { Button } from 'figma-plugin-ds-svelte'
</script>



<main>
  <p>Select a frame to start annotating your designs.</p>
  <AnnotationItem></AnnotationItem>
  <Button class="place-annotations-btn" disabled={ !isFrameSelected }>Place annotations</Button>
</main>

<style>
  :global(.place-annotations-btn) {
    position: fixed;
    bottom: 16px;
    right: 16px;
    height: 32px;
    border: none;
    background: var(--blue);
    border-radius: 3px;
    padding: 0 16px;
    color: #fff;
    outline: none;
  }
</style>


<!-- <a href="/about" use:link>About</a> -->