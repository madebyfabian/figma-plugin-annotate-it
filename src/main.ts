import { 
	config, 
	getPluginData, 
	generateFontNameConfig
} from '@/utils/utils'
import getAnnotWrapperNode from '@/utils/getAnnotWrapperNode'
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


// let oldCurrSel = null,
// 		nodesStringify = nodes => !(nodes && nodes.length) ? [] : nodes.map(node => !node.removed ? node.name : 'REMOVED')

pushSelectionChange()
figma.on('selectionchange', () => {
	pushSelectionChange()

	// const currSel = figma.currentPage.selection

	// console.log('Selection has changed. Old:', nodesStringify(oldCurrSel), '- New:', nodesStringify(currSel))
	// oldCurrSel = currSel
})


figma.ui.on('message', async msg => {
	const { type: msgType, value: msgValue } = msg

	switch (msgType) {
		case 'pushAnnotChanges': 
			const { newAnnots, oldAnnots } = msgValue
			updateAnnotItems(newAnnots, oldAnnots)

			break
	}
})


if (!figma.currentPage.selection.length)
	figma.notify('Please select a frame to add annotations.')


