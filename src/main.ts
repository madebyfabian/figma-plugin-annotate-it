let pluginStartupComplete = false


const onSelectionChange = async () => {
	const currSelNodes = figma.currentPage.selection
	figma.ui.postMessage({
		type: 'res__selectionState',
		value: currSelNodes
	})

	if (!pluginStartupComplete) {
		pluginStartupComplete = true

		if (!figma.currentPage.selection.length)
			figma.notify('Please select a frame to add annotations.')
	}
}


const rgbChanger = ( originalValue: number ) => originalValue / 255

const createAnnotationBadge = async ( 
	number: number,
	posX: number,
	posY: number
) : Promise<InstanceNode> => {
	// Load Fonts
	await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })

	// Main Frame Node
	const componentNode = figma.createComponent()
	const newRGB : RGB = { r: rgbChanger(24), g: rgbChanger(160), b: rgbChanger(251) }
	componentNode.resize(24, 24)
	componentNode.cornerRadius = 24
	componentNode.layoutMode = 'HORIZONTAL'
	componentNode.fills = [ { type: 'SOLID', color: newRGB  } ]

	// Text Frame inside Main Frame
	const textNode = figma.createText()
	textNode.fontSize = 12
	textNode.characters = number.toString()
	textNode.fills = [ { type: 'SOLID', color: <RGB> { r: 1, g: 1, b: 1 } } ]
	textNode.resize(24, 24)
	textNode.textAlignHorizontal = 'CENTER'
	// textNode.fontName = { family: 'Roboto', style: 'Medium' }
	textNode.lineHeight = { value: 24, unit: 'PIXELS' }
	textNode.locked = true

	componentNode.appendChild(textNode)

	const instanceNode = componentNode.createInstance()
	componentNode.remove()

	instanceNode.x = posX
	instanceNode.y = posY
	
	return instanceNode
}


figma.ui.on('message', async msg => {
	const { type: msgType, value: msgValue } = msg

	switch (msgType) {
		case 'req__selectionState':
			onSelectionChange()
			break

		case 'req__createAnnotationItem': {
			const currSel = figma.currentPage.selection?.[0]
			if (currSel) {
				const annotationPosX = currSel.absoluteTransform[0][2] - 32,
							annotationPosY = currSel.absoluteTransform[1][2] + ((currSel.height / 2 - (24 / 2)))

				const badge = await createAnnotationBadge(1, annotationPosX, annotationPosY)
				figma.currentPage.appendChild(badge)
			}
		}
	
		default:
			break
	}
})


figma.showUI(__html__, { 
  width: 487, 
  height: 446
})


figma.on('selectionchange', () => { onSelectionChange() })