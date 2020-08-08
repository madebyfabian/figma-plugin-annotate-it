<template>
  <div class="aboutView scrollContainer">
    <a @click="$emit('close-view')" href="#">&larr; Back</a>

    <SectionTitle>Help</SectionTitle>
    <ul>
      <li>Select a frame on your figma page to add annotation to.</li>
      <li>Click <b>Add New</b> button to add an annotation.</li>
      <li>Select a color for your marker if you’d like to create annotations for different purposes.</li>
      <li>Click on the <span class="inlineIconWrap"><Icon iconName="trash" /></span> button to remove an annotation (the numbers will update auto-magically).</li>
      <li>
        You can also use some <b>Markdown</b> for formatting your annotation description:
        <ul>
          <li>
            <span class="mark">**</span><b>Bold</b><span class="mark">**</span>
            <span>or <b><kbd>CMD</kbd> + <kbd>B</kbd></b></span>
          </li>
          <li>
            <span class="mark">_</span><i>Italics</i><span class="mark">_</span>
            <span>or <b><kbd>CMD</kbd> + <kbd>I</kbd></b></span>
          </li>
          <li>
            <span class="mark">~</span><s>Strikethrough</s><span class="mark">~</span>
            <span>or <b><kbd>CMD</kbd> + <kbd>D</kbd></b></span>
          </li>
          <li>
            <u>Underline</u>
            <span>with <b><kbd>CMD</kbd> + <kbd>U</kbd></b></span>
          </li>
          <li><span class="mark">-</span> Unordered List<br></li>
          <li><span class="mark">1.</span> Ordered List</li>
          <li><span class="mark">---</span> Divider</li>
        </ul>
      </li>
    </ul>

    <SectionTitle>Credits</SectionTitle>
    <p>
      <b>Developed by:</b> Fabian – <a href="https://twitter.com/madebyfabian" target="_blank">@madebyfabian on Twitter</a><br>
      <b>Designed by:</b> Sonali – <a href="https://twitter.com/sonaliagrawal" target="_blank">@sonaliagrawal on Twitter</a>
    </p>
    
    <PluginReleaseVersion />
  </div>
</template>

<script>
  import SectionTitle from '@/components/ui/SectionTitle'
  import Icon from '@/components/ui/Icon'
  import PluginReleaseVersion from '@/components/PluginReleaseVersion'

  export default {
    components: { SectionTitle, Icon, PluginReleaseVersion },
  }
</script>

<style lang="scss" scoped>
  .aboutView {
    overflow-y: scroll;

    .inlineIconWrap {
      height: 16px; //same as line-height;
      margin-top: -16px;
      transform: translateY(10px) translateX(8px);
      display: inline-flex;
      align-items: center;
      margin-left: -16px;
    }

    kbd {
      background: $color--background-silver;
      border-radius: 3px;
      padding: 0 4px;
      font-size: 10px;
      font-weight: 600;
    }

    .sectionTitle {
      margin: 16px 0 0;
      padding-left: 0;
    }

    ul {
      margin: 0;
      padding-left: 1rem;

      li {
         margin: 4px 0;
      }

      li ul {
        list-style-type: none;
        padding-left: 0;

        span {
          opacity: .66;

          &.mark {
            color: $color--blue;
            opacity: 1;
          }
        }
      }
    }
  }
</style>