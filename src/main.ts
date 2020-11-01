import { 
	config, 
	getPluginData, 
	setPluginData,
	getAnnotWrapperTitleTextNode,
	toggleTextNodePlaceholderStyles
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

		case 'createFirstAnnot': {
			getAnnotWrapperNode() // Create a new wrapperNode
			await doInit() // Init again 

			figma.ui.postMessage({ type: 'createFirstAnnot_wrapperNodeCreated', value: {} })
			break
		}

		case 'createAnnotGroup': {
			if (figma.currentPage.selection.length !== 1) {
				figma.notify('😄 Please try again by selecing exactly 1 frame!')
				break
			}

			const newWrapperNode = getAnnotWrapperNode() // Create a new wrapperNode
			await doInit() // Init again 

			figma.ui.postMessage({ type: 'createAnnotGroup_wrapperNodeCreated', value: { 
				createdWrapperNodeId: newWrapperNode.id
			}})

			break
		}

		case 'pushAnnotWrapperTitleChange': {
			const { newVal } = msgValue,
						annotWrapperNode = getAnnotWrapperNode({ id: msgValue.wrapperFrameId }),
						oldPluginData = getPluginData(annotWrapperNode, config.annotWrapperNodePluginDataKey)
			
			// Update PluginData.
			setPluginData(annotWrapperNode, config.annotWrapperNodePluginDataKey, <AnnotWrapperPluginData>{ 
				connectedFrameId: oldPluginData.connectedFrameId || null, 
				connectedFrameAliasName: newVal
			})

			// Update visible title textNode.
			const titleTextNode = getAnnotWrapperTitleTextNode(annotWrapperNode)
			toggleTextNodePlaceholderStyles(titleTextNode, newVal, 'annotWrapperTitle')

			break
		}
	}
})