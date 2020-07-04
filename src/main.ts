figma.showUI(__html__, { 
  width: 600, 
  height: 400
})



const onSelectionChange = () => {
	figma.ui.postMessage({
		type: 'selectionchange',
		value: figma.currentPage.selection
	})
}

onSelectionChange()

figma.on('selectionchange', () => { onSelectionChange() })