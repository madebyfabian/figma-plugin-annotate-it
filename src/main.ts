import { config } from '@/utils/utils'
import { getPluginData, generateFontNameConfig, getAnnotWrapperNode } from '@/utils/figmaUtils'
import updateAnnotItems from '@/utils/updateAnnotItems'


figma.showUI(__html__, { 
  width: 487, 
  height: 446
})


const pushSelectionChange = () => figma.ui.postMessage({
	type: 'selectionUpdated',
	value: figma.currentPage.selection
})


const doInit = async () => {
	// Load fonts to use on canvas.
	await Promise.all([
		figma.loadFontAsync(generateFontNameConfig()),
		figma.loadFontAsync(generateFontNameConfig({ isItalic: true })),
		figma.loadFontAsync(generateFontNameConfig({ isBold: true})),
		figma.loadFontAsync(generateFontNameConfig({ isBold: true, isItalic: true }))
	])

	const annotData = [],
				annotWrapperNode = getAnnotWrapperNode({ createOneIfItDoesNotExist: false })

	if (annotWrapperNode) 
		for (const annotItemNode of annotWrapperNode.children) {
			annotData.push(getPluginData(annotItemNode, config.annotItemNodePluginDataKey))
		}

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
			const { newAnnots, oldAnnots } = msgValue
			updateAnnotItems(newAnnots, oldAnnots)

			break
	}
})


if (!figma.currentPage.selection.length)
	figma.notify('Please select a frame to add annotations.')


