<template>
  <div class="about-us">
    <router-link to="/">&larr; Back</router-link>
    <SectionTitle>Help</SectionTitle>
    <ul>
      <li>Select a frame on your figma page to add annotation to.</li>
      <li>Click Add New button to add an annotation.</li>
      <li>Select a color for your marker if you’d like to create annotations for different purposes.</li>
    </ul>
  </div>
</template>

<script>
  import SectionTitle from '@/components/ui/SectionTitle'

  export default {
    components: { SectionTitle }
  }
</script>

<style lang="scss" scoped>
  .about-us {
    padding: 16px;

    ul {
      padding-left: 1.5rem;
    }
  }
</style>