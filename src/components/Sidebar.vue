<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <SectionTitle>Frames</SectionTitle>
    </div>

    <div class="sidebar-emptyState" v-if="!annotData || !annotData.length">No annotation-frames<br>on this page.</div>

    <div
      v-else
      v-for="(annotWrapperFrame, i) in annotData"
      :key="i" 
      @click="() => setActiveWrapperId(annotWrapperFrame.id)"
      class="frameItem"
      :class="activeWrapperId === annotWrapperFrame.id ? 'isActive' : null">
      <!-- {{ annotWrapperFrame.pluginData.connectedFrameAliasName }} -->
      (Name)
    </div>
  </aside>
</template>

<script>
  import { store, mutations } from '@/store'
  import SectionTitle from '@/components/ui/SectionTitle'

  export default {
    components: { SectionTitle },
    props: {
      'annotData': Array
    },
    computed: {
      activeWrapperId: () => store.activeWrapperId,
    },
    methods: {
      async setActiveWrapperId( newId ) {
        mutations.setWatchAnnots(false)
        await this.$nextTick()
        mutations.setActiveWrapperId(newId)
        await this.$nextTick()
        mutations.setWatchAnnots(true)
      }
    },
    updated() {
      console.log(this.annotData)
    }
  }
</script>

<style lang="scss" scoped>
  .sidebar {
    &-header {
      padding: 16px 16px 8px;
    }

    &-emptyState {
      padding: 0 16px;
      color: $color--black-3;
    }
    
    .frameItem {
      padding: 8px 16px;
      width: 100%;
      cursor: pointer;

      &:hover {
        box-shadow: inset 0 0 0 1px $color--special-hover-fill;
      }

      &.isActive {
        background: $color--special-hover-fill;
      }
    }
  }
</style>