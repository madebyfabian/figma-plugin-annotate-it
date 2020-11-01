import { 
  config, 
  generateSolidPaint, 
  setPluginData,
  generateFontNameConfig,
  toggleTextNodePlaceholderStyles,
  generateDefaultRelaunchDataOptions
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

  const headerTextNode = figma.createText()
  toggleTextNodePlaceholderStyles(headerTextNode, data.title, 'annotItemTitle')
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
  
  node.appendChild(headerNode)
  node.appendChild(bodyNode)

  // Hide the bodyNode by default, because it will be empty on creation.
  bodyNode.visible = false

  return node
}


export const generateAnnotItemBodyTextNode = () => {
  const textNode = figma.createText()
  textNode.layoutAlign = 'STRETCH'
  textNode.fontName = generateFontNameConfig()
  textNode.fontSize = config.defaultParagraphTextOptions.fontSize
  textNode.lineHeight = config.defaultParagraphTextOptions.lineHeight
  textNode.letterSpacing = config.defaultParagraphTextOptions.letterSpacing
  return textNode
}


export const generateAnnotBadgeNode = ( number = 0, annotId = <string>null ) => {
  // Main Frame Node
  const componentNode = figma.createComponent()
  componentNode.setRelaunchData(generateDefaultRelaunchDataOptions({ singleItem: true }))
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


export const generateAnnotWrapperTitleNode = ( titleValue: string ) => {
  // Frame Node
  const frameNode = figma.createFrame()
  frameNode.name = config.annotWrapperNodeTitleName
  frameNode.locked = true
  frameNode.layoutMode = 'VERTICAL'
  frameNode.counterAxisSizingMode = 'AUTO'
  frameNode.verticalPadding = 8
  frameNode.horizontalPadding = 16  
  frameNode.layoutAlign = 'STRETCH'
  frameNode.fills = []

  // Text node
  const textNode = figma.createText()
  textNode.layoutAlign = 'STRETCH'
  textNode.name = 'Label'
  textNode.fontName = generateFontNameConfig({ isBold: true })
  textNode.fontSize = 20
  textNode.letterSpacing = <LetterSpacing>{ value: -1.5, unit: 'PERCENT' }
  textNode.characters = titleValue
  textNode.fills = [ generateSolidPaint({ a: .5 }) ]

  frameNode.appendChild(textNode)
  return frameNode
}