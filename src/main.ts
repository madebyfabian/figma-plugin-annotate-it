import { 
	config, 
	getPluginData, 
	setPluginData,
	generateFontNameConfig,
	getNodeRootParent,
	getAnnotWrapperNodes
} from '@/utils/utils'
import updateAnnotItems from '@/utils/updateAnnotItems'
import updateAnnotItemsV2 from '@/utils/updateAnnotItemsV2'


figma.showUI(__html__, { 
	width: 590, 
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
	
	const allAnnotData = [],
				annotWrappers = getAnnotWrapperNodes()
			
	if (annotWrappers.length) {
		let i = 0 // TEMP
		for (const annotWrapperNode of annotWrappers) {
			const annotData = []
			for (const annotItemNode of annotWrapperNode.children) {
				annotData.push(getPluginData(annotItemNode, config.annotItemNodePluginDataKey))
			}

			// setPluginData(annotWrapperNode, config.annotWrapperNodePluginDataKey, <AnnotWrapperPluginData>{ 
			// 	connectedFrameId: !i ? '323:199' : '557:0',
			// 	connectedFrameAliasName: !i ? 'Dashboard' : 'Overlay'
			// }) // TEMP

			allAnnotData.push({ 
				id: annotWrapperNode.id, 
				pluginData: getPluginData(annotWrapperNode, config.annotWrapperNodePluginDataKey),
				annotData,
			})

			i++ // TEMP
		}
	}

	figma.ui.postMessage({
		type: 'doInitAll',
		value: allAnnotData
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
			// updateAnnotItems(newAnnots, oldAnnots)
			const { activeWrapperId, data } = msgValue 
			console.log('updateAnnotItemsV2')
			updateAnnotItemsV2(activeWrapperId, data)
			break
	}
})


