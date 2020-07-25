import pushSelectionChange from '@/functions/figma/pushSelectionChange'
import updateAnnotItems from '@/functions/figma/updateAnnotItems'

import config from '@/config'
import { getPluginData, generateFontNameConfig, getAnnotWrapperNode } from '@/functions/figma/figmaHelpers'


figma.showUI(__html__, { 
  width: 487, 
  height: 446
})


const doInit = async () => {
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


doInit()
figma.on('currentpagechange', () => doInit())


pushSelectionChange()
figma.on('selectionchange', () => pushSelectionChange())


figma.ui.on('message', async msg => {
	const { type: msgType, value: msgValue } = msg

	switch (msgType) {
		// case 'req__createAnnotationItem': {
		// 	const currSel = figma.currentPage.selection?.[0]
		// 	if (currSel) {
		// 		const annotationPosX = currSel.absoluteTransform[0][2] - 32,
		// 					annotationPosY = currSel.absoluteTransform[1][2] + ((currSel.height / 2 - (24 / 2)))

		// 		const badge = await createAnnotationBadge(1, annotationPosX, annotationPosY)
		// 		figma.currentPage.appendChild(badge)
		// 	}
		// }

		case 'pushAnnotChanges': 
			updateAnnotItems(msgValue)
			break
	}
})


if (!figma.currentPage.selection.length)
	figma.notify('Please select a frame to add annotations.')


