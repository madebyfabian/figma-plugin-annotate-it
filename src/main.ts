import { 
	config, 
	getPluginData, 
	setPluginData
} from '@/utils/utils'
import updateAnnotItems from '@/utils/updateAnnotItems'
import getAnnotWrapperNode from '@/utils/getAnnotWrapperNode'
import doInit from '@/utils/doInit'


figma.showUI(__html__, { 
  width: 590,
  height: 486
})


const pushSelectionChange = () => figma.ui.postMessage({
	type: 'selectionUpdated',
	value: figma.currentPage.selection
})


doInit()
figma.on('currentpagechange', () => doInit())


pushSelectionChange()
figma.on('selectionchange', () => pushSelectionChange())


figma.ui.on('message', async msg => {
	const { type: msgType, value: msgValue } = msg

	switch (msgType) {
		case 'pushAnnotChanges': 
			const { newAnnots, oldAnnots } = msgValue
			updateAnnotItems(newAnnots, oldAnnots, msgValue.wrapperFrameId)
			break

		case 'createFirstAnnot':
			// Create a new wrapperNode
			getAnnotWrapperNode()

			// Init again 
			await doInit()

			figma.ui.postMessage({ type: 'wrapperNodeCreated', value: {} })
			break

		case 'pushAnnotWrapperTitleChange':
			const { newVal } = msgValue,
						annotWrapperNode = getAnnotWrapperNode({ id: msgValue.wrapperFrameId }),
						oldPluginData = getPluginData(annotWrapperNode, config.annotWrapperNodePluginDataKey)
						
			setPluginData(annotWrapperNode, config.annotWrapperNodePluginDataKey, <AnnotWrapperPluginData>{ 
				connectedFrameId: oldPluginData.connectedFrameId || null, 
				connectedFrameAliasName: newVal
			})
	}
})