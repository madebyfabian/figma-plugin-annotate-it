<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <SectionTitle>Groups</SectionTitle>
      <Button buttonType="icon">
        <Icon iconName="plus" />
      </Button>
    </div>

    <div class="sidebar-frames" v-if="annotData && annotData.length">
      <router-link
        class="sidebar-frameItem"
        v-for="(annotWrapperFrame, i) in annotData"
        :key="i"
        :to="{ name: 'Main', params: { wrapperFrameId: annotWrapperFrame.id } }"
        :class="annotWrapperFrame.id === currWrapperFrameId ? 'isActive' : null">

        Group {{annotWrapperFrame.id}}
      </router-link>
    </div>

    <div class="sidebar-emptyState" v-else>No annotation-frames<br>on this page.</div>
  </div>
</template>

<script>
  import { store, mutations } from '@/store'
  import SectionTitle from '@/components/ui/SectionTitle'
  import Button from '@/components/ui/Button'
  import Icon from '@/components/ui/Icon'

  export default {
    components: { SectionTitle, Button, Icon },

    computed: {
      annotData: () => store.annotData,
      currWrapperFrameId() {
        return this.$route.params.wrapperFrameId
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sidebar {
    background: $color--background-grey-f0;

    &-header {
      padding: 16px 16px 8px;
      display: flex;
      justify-content: space-between;

      button {
        margin-right: -8px;
        background: transparent!important;
      }
    }

    &-emptyState {
      padding: 0 16px;
      color: $color--black-3;
    }

    &-frameItem {
      padding: 8px 16px;
      width: 100%;
      cursor: pointer;
      display: block;
      appearance: none;
      color: $color--black-8;
      position: relative;

      &:hover {
        box-shadow: inset 0 0 0 1px $color--special-hover-fill;
      }

      &.isActive {
        background: $color--special-hover-fill;
        color: $color--black;
        
        &::before {
          content: '';
          height: 100%;
          width: 2px;
          border-radius: 0px 4px 4px 0;
          background: $color--blue;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }
</style>