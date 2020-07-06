let pluginStartupComplete = false


const onSelectionChange = () => {
	figma.ui.postMessage({
		type: 'res__selectionState',
		value: figma.currentPage.selection
	})

	if (!pluginStartupComplete) {
		pluginStartupComplete = true

		if (!figma.currentPage.selection.length)
			figma.notify('Please select a frame to add annotations.')
	}
}


figma.ui.on('message', async msg => {
	const { type: msgType, value: msgValue } = msg

	switch (msgType) {
		case 'req__selectionState':
			onSelectionChange()
			break
	
		default:
			break
	}
})


figma.showUI(__html__, { 
  width: 663, 
  height: 432
})


figma.on('selectionchange', () => { onSelectionChange() })