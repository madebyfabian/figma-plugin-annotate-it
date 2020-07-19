import doInit from '@/functions/figma/doInit'
import pushSelectionChange from '@/functions/figma/pushSelectionChange'
import updateAnnotItems from '@/functions/figma/updateAnnotItems'


figma.showUI(__html__, { 
  width: 487, 
  height: 446
})


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