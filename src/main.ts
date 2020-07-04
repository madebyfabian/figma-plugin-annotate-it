const onSelectionChange = () => {
	figma.ui.postMessage({
		type: 'res__selectionState',
		value: figma.currentPage.selection
	})
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
  width: 716, 
  height: 500
})


figma.on('selectionchange', () => { onSelectionChange() })