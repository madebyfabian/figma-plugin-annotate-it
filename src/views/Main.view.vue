<template>
  <main>
    <Button>
      Hinzufügen
    </Button>
    <br><br>
    <Button buttonType="primary">
      Hinzufügen
    </Button>
    <br><br>
    <Button buttonType="icon">
      <Icon iconName="plus" />
    </Button>
  </main>
</template>

<script>
  import Button from '@/components/Button'

  import Icon from '@/components/Icon'

  export default {
    components: { Button, Icon },

    data: () => ({ })
  }
</script>

<style lang="scss" scoped>
  // 
</style>