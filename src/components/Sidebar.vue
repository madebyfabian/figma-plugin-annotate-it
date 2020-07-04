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

    <section>
      <SectionTitle class="sectionTitle isRegular">You can use <b>Markdown</b> for text formatting.</SectionTitle>
      <div style="height: 32px; width: 100px; background: #e8e8e8;border-radius: 100px;"></div>
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
      
      .sectionTitle {
        min-width: 100%;
      }
    }
  }
</style>