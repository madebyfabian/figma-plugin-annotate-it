import { 
  config, 
  generateSolidPaint, 
  setPluginData,
  generateFontNameConfig,
  generateAnnotItemTitleOptions
} from '@/utils/utils'



// ---
// Node Generators
// ---

export const generateAnnotItemNode = ( data: Annotation, badgeNumber: number ) => {
  const node = figma.createFrame()

  setPluginData(node, config.annotItemNodePluginDataKey, data)

  node.name = `Annotation ${data.id}`
  node.resize(343, 100)
  node.horizontalPadding = 16
  node.verticalPadding = 16
  node.itemSpacing = 16
  node.layoutMode = 'VERTICAL'
  node.locked = true

  const headerNode = figma.createFrame()
  headerNode.name = 'Header'
  headerNode.resize(328, 24)
  headerNode.itemSpacing = 8
  headerNode.layoutMode = 'HORIZONTAL'
  headerNode.counterAxisSizingMode = 'AUTO'

  const headerAnnotBadgeNode = generateAnnotBadgeNode(badgeNumber, data.id)

  const titleOptions = generateAnnotItemTitleOptions(data.title)
  const headerTextNode = figma.createText()
  headerTextNode.characters = titleOptions.characters
  headerTextNode.opacity = titleOptions.opacity
  headerTextNode.name = 'Header/Text'
  headerTextNode.resize(279, headerTextNode.height)
  headerTextNode.layoutAlign = 'CENTER'
  headerTextNode.textAlignVertical = 'CENTER'
  headerTextNode.fontSize = 16
  headerTextNode.fontName = generateFontNameConfig({ isBold: true })

  headerNode.appendChild(headerAnnotBadgeNode)
  headerNode.appendChild(headerTextNode)

  const bodyNode = figma.createFrame()
  bodyNode.name = 'Body'
  bodyNode.layoutMode = 'VERTICAL'
  bodyNode.layoutAlign = 'MAX'
  bodyNode.resize(279, bodyNode.height)
  
  const bodyPlaceholderNode = generateAnnotItemBodyTextNode()
  bodyNode.appendChild(bodyPlaceholderNode)

  node.appendChild(headerNode)
  node.appendChild(bodyNode)

  return node
}


export const generateAnnotItemBodyTextNode = ({ showPlaceholder = true } = {}) => {
  const textNode = figma.createText()
  textNode.characters = showPlaceholder ? 'Your annotation description goes here' : ' '
  textNode.opacity = showPlaceholder ? .25 : 1
  textNode.layoutAlign = 'STRETCH'
  textNode.fontName = generateFontNameConfig()
  textNode.fontSize = config.defaultParagraphTextOptions.fontSize
  textNode.lineHeight = config.defaultParagraphTextOptions.lineHeight
  textNode.letterSpacing = config.defaultParagraphTextOptions.letterSpacing
  return textNode
}


export const generateAnnotBadgeNode = ( number = 0, annotId = <string>null) => {
  // Main Frame Node
  const componentNode = figma.createComponent()
  componentNode.name = `${config.annotBadgeNodeName} ${annotId}`
	componentNode.resize(24, 24)
	componentNode.cornerRadius = 24
	componentNode.layoutMode = 'HORIZONTAL'
	componentNode.fills = [ generateSolidPaint({ r: 24, g: 160, b: 251 }) ]

	// Text Frame inside Main Frame
  const textNode = figma.createText()
	textNode.fontSize = 12
	textNode.characters = number.toString()
	textNode.fills = [ generateSolidPaint({ r: 255, g: 255, b: 255 }) ]
	textNode.resize(24, 24)
	textNode.textAlignHorizontal = 'CENTER'
	textNode.fontName = generateFontNameConfig({ isBold: true })
	textNode.lineHeight = { value: 24, unit: 'PIXELS' }
	textNode.locked = true

  componentNode.appendChild(textNode)

  const instanceNode = componentNode.createInstance()
  componentNode.remove()
  return instanceNode
}