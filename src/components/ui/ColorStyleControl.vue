<template>
  <div class="colorStyleControl">
    <div 
      class="control" 
      
      :class="{ floatingPanelIsOpened: floatingPanelIsOpened }">

      <div class="styleItem" v-tooltip.right="`Select a color for your annotation`" @click="floatingPanelIsOpened = !floatingPanelIsOpened">
        <div class="styleItem-colorFill" :style="{ backgroundColor: '#' + currentColorTheme.color }" />
        {{ currentColorTheme.name }}
      </div>

      <transition name="slideDown">
      <FloatingPanel v-if="floatingPanelIsOpened" title="Marker Color Themes">
        <div 
          class="styleItem"
          :class="{ isSelected: theme.id == value }"
          @click="() => selectColorTheme(theme.id)"
          v-for="(theme, i) in userColorThemes"
          :key="i">

          <div class="styleItem-colorFill" :style="{ backgroundColor: '#' + theme.color }" />
          {{ theme.name }}
        </div>
      </FloatingPanel>
    </transition>
    </div>

    
  </div>
</template>

<script>
  import FloatingPanel from '@/components/ui/FloatingPanel'

  import { getUserColorThemes } from '@/utils/utils'

  export default {
    props: {
      value: {
        type: String,
        required: true
      }
    },

    components: { FloatingPanel },

    data: () => ({
      floatingPanelIsOpened: false,
      userColorThemes: getUserColorThemes()
    }),

    methods: {
      selectColorTheme( themeId ) {
        this.floatingPanelIsOpened = false

        // Emit a change if the current ID isn't the same as the selected one
        if (this.value !== themeId)
          this.$emit('input', themeId)
      }
    },

    computed: {
      currentColorTheme() {
        return this.userColorThemes.find( theme => theme.id == this.value )
      }
    }
  }
</script>

<style lang="scss" scoped>
.colorStyleControl {
  position: relative;
}
  .styleItem {
    display: grid;
    grid-template-columns: 18px 1fr;
    gap: 8px;
    align-items: center;
    height: 32px;

    &-colorFill {
      border-radius: 100%;
      box-shadow: 0 0 0 1px $color--white;
      height: 18px;
      width: 18px;
    }
  }

  .control {
    padding: 0 8px; 
    border-radius: 3px;
    background: $color--background-white;
    display: inline-flex;
    position: relative;

    &:hover, &.floatingPanelisOpened {
      background: $color--special-hover-fill;
    }

    .styleItem {
      display: inline-grid;
    }
  }

  .floatingPanel {
    // transform: translateY(calc(-100% + 32px));
    bottom: calc(100% - 32px);

    .styleItem {
      padding-left: 16px;
      min-width: 128px;
      width: 100%;

      &.isSelected {
        background-color: $color--special-selection-a;
      }

      &:hover:not(.isSelected) {
        background-color: $color--background-silver;
      }
    } 
  }
</style>