export default () => {
	figma.ui.postMessage({
		type: 'selectionUpdated',
		value: figma.currentPage.selection
	})
}