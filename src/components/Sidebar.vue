<template>
  <aside>
    <section>
      <SectionTitle class="sectionTitle">Marker Color</SectionTitle>
      <div style="height: 32px; width: 100px; background: #e8e8e8;border-radius: 100px;"></div>
    </section>

    <section>
      <SectionTitle class="sectionTitle">Description Block Color</SectionTitle>
      <div style="height: 32px; width: 100px; background: #e8e8e8;border-radius: 100px;"></div>
    </section>

    <section class="markdown">
      <SectionTitle class="sectionTitle isRegular">You can use <b>Markdown</b> for text formatting:</SectionTitle>
      <p>
        <b>**Bold**</b><br>
        <i>_Italics_</i><br>
        - Unordered<br>
        1. Ordered<br>
        --- Divider
      </p>
    </section>
  </aside>
</template>

<script>
  import SectionTitle from '@/components/ui/SectionTitle'

  export default {
    components: { SectionTitle }
  }
</script>

<style lang="scss" scoped>
  .isRegular {
    font-weight: 400!important;
  }

  aside {
    section {
      margin-bottom: 16px;

      &.markdown p, &.markdown p * {
        line-height: 200%;
      }
      
      .sectionTitle {
        min-width: 100%;
      }
    }
  }
</style>