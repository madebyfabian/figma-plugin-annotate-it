import config from '@/config'
import { getPluginData, generateFontNameConfig, getAnnotWrapperNode } from '@/functions/figma/figmaHelpers'


export default async () => {
  // Load fonts to use on canvas.
  await Promise.all([
    figma.loadFontAsync(generateFontNameConfig()),
    figma.loadFontAsync(generateFontNameConfig({ isItalic: true })),
    figma.loadFontAsync(generateFontNameConfig({ isBold: true})),
    figma.loadFontAsync(generateFontNameConfig({ isBold: true, isItalic: true }))
  ])

  // First, look if there already exists a annotation wrapper-frame
  let annotWrapperNode = getAnnotWrapperNode(),
      annotData = annotWrapperNode ? getPluginData(annotWrapperNode, config.annotWrapperNodePluginDataKey) : []

	figma.ui.postMessage({
		type: 'doInit',
		value: annotData
  })
}


