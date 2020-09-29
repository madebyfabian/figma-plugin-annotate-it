<template>
  <div class="sidebar" :class="{ 'fadeOut': !annotData || !annotData.length }">
    <div class="sidebar-header">
      <SectionTitle>Groups</SectionTitle>
      <Button 
        buttonType="icon" 
        :disabled="!annotData || !annotData.length"
        @click="createNewAnnotGroup"
        v-tooltip.right="`Create new annotation-group`">

        <Icon iconName="plus" />
      </Button>
    </div>

    <div class="sidebar-frames" v-if="annotData && annotData.length">
      <div
        class="sidebar-frameItem"
        v-for="(annotWrapperFrame, i) in annotData"
        :key="i"
        @click="selectedWrapperFrameId = annotWrapperFrame.id"
        :class="annotWrapperFrame.id === selectedWrapperFrameId ? 'isActive' : null">

        {{ annotWrapperFrame.pluginData.connectedFrameAliasName || 'My annotations' }}
      </div>
    </div>

    <div class="sidebar-emptyState" v-else>No annotation-groups<br>on this page.</div>
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
      'annotData': () => store.annotData,
      'selectedWrapperFrameId': { get: () => store.selectedWrapperFrameId, set: mutations.setSelectedWrapperFrameId }
    },

    methods: {
      createNewAnnotGroup() {
        parent.postMessage({ pluginMessage: {
          type: 'createAnnotGroup', 
          value: {}
        }}, '*')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sidebar {
    &.fadeOut {
      opacity: .25;
    }

    &-header {
      padding: 12px 16px 8px;
      display: flex;
      justify-content: space-between;

      button {
        margin-right: -8px;
        background: transparent;
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

    &-createGroup {
      padding: 12px 0 0 0;
      margin: 12px 16px 0;
      border-top: 1px solid $color--background-silver;

      &.sidebarIsEmpty {
        border: none;
        margin-top: 0;
        padding-top: 0;
      }

      &-disabledHelper {
        padding: 4px 0 0 24px;
        color: $color--black-3;
      }
    }
  }
</style>