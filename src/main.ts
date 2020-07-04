figma.showUI(__html__, { 
  width: 716, 
  height: 500
})


const onSelectionChange = () => {
	figma.ui.postMessage({
		type: 'selectionchange',
		value: figma.currentPage.selection
	})
}

onSelectionChange()

figma.on('selectionchange', () => { onSelectionChange() })