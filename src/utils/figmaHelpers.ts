import { config, generateAnnotItemObject } from '@/utils/utils'


export const generateSolidPaint = ({ r = 0, g = 0, b = 0 }) => {
  return <SolidPaint>{ type: 'SOLID', color: <RGB>{ r: r / 255, g: g / 255, b: b / 255 } }
}


export const getPluginData = ( node: SceneNode, key: string, isJSON = true ) => {
  const data = node.getPluginData(key)
  if (!data) return null
  if (isJSON) return JSON.parse(data) || null
}


export const setPluginData = ( node: SceneNode, key: string, value: any ) => {
  node.setPluginData(key, (typeof value === 'string') ? value : JSON.stringify(value))
}


export const generateFontNameConfig = ({ isBold = false, isItalic = false } = {}) => {
  let style: string

  if (isItalic && !isBold)
    style = 'Italic'
  else {
    style = isBold ? 'Bold' : 'Regular'
    if (isItalic)
      style += ' Italic'
  }

  return <FontName>{ family: 'Roboto', style }
}


/**
 * Find an already existing annotation wrapper-frame on the current page, or create one.
 */
export const getAnnotWrapperNode = ({ createOneIfItDoesNotExist = true } = {}) => {
  let annotWrapperNode = <FrameNode>figma.currentPage.findChild(node => {
    if (node.type !== 'FRAME')
      return false
  
    if (node.name !== config.annotWrapperNodeName)
      return false
  
    return true
  })

  // Create annot wrapper node
  if (!annotWrapperNode && createOneIfItDoesNotExist) {
    annotWrapperNode = figma.createFrame()
    annotWrapperNode.name = config.annotWrapperNodeName
    annotWrapperNode.resize(343, 100)
    annotWrapperNode.fills = [{ type: 'SOLID', color: <RGB> { r: 1, g: 1, b: 1 }}]
    annotWrapperNode.verticalPadding = 8
    annotWrapperNode.itemSpacing = 16
    annotWrapperNode.layoutMode = 'VERTICAL'
  }

  return annotWrapperNode
}


// ---
// Node Generators
// ---


export const generateAnnotItemNode = ( data: Annotation ) => {
  const node = figma.createFrame()

  setPluginData(node, config.annotItemNodePluginDataKey, data)

  node.name = `Annotation ${data.id}`
  node.resize(343, 100)
  node.horizontalPadding = 16
  node.verticalPadding = 16
  node.itemSpacing = 16
  node.layoutMode = 'VERTICAL'
  node.cornerRadius = 12
  node.locked = true

  const headerNode = figma.createFrame()
  headerNode.name = 'Header'
  headerNode.resize(328, 24)
  headerNode.itemSpacing = 8
  headerNode.layoutMode = 'HORIZONTAL'

  const headerAnnotBadgeNode = generateAnnotBadgeNode(1)

  const headerTextNode = figma.createText()
  headerTextNode.name = 'Text'
  headerTextNode.resize(279, headerTextNode.height)
  headerTextNode.layoutAlign = 'CENTER'
  headerTextNode.textAlignVertical = 'CENTER'
  headerTextNode.fontSize = 16
  headerTextNode.fontName = generateFontNameConfig({ isBold: true })
  headerTextNode.characters = 'Title'
  headerTextNode.opacity = .25

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


export const generateAnnotBadgeNode = ( number: number ) => {
  // Main Frame Node
	const node = figma.createComponent()
	node.resize(24, 24)
	node.cornerRadius = 24
	node.layoutMode = 'HORIZONTAL'
	node.fills = [ generateSolidPaint({ r: 24, g: 160, b: 251 }) ]

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

	node.appendChild(textNode)

	const instanceNode = node.createInstance()
  node.remove()
  
  return instanceNode
}
