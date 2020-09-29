import { 
  config, 
  generateSolidPaint, 
  generateRGBA,
  setPluginData,
  generateFontNameConfig,
  generateAnnotItemTitleOptions,
  generateDefaultRelaunchDataOptions,
  getNodeRootParent
} from '@/utils/utils'
import detectNodeCollisions from '@/utils/detectNodeCollisions'



// ---
// Node Generators
// ---

export const generateAnnotWrapperFrame = ( connectedFrameId: string ) => {
  const width = 343, 
        height = 100,
        { x, y } = _calculateAnnotWrapperNodePos({ width, height })

  const annotWrapperNode = figma.createFrame()
  setPluginData(annotWrapperNode, config.annotWrapperNodePluginDataKey, <AnnotWrapperPluginData>{ 
    connectedFrameId: connectedFrameId,
    connectedFrameAliasName: figma.currentPage.findOne(node => node.id === connectedFrameId).name
  })
  annotWrapperNode.setRelaunchData(generateDefaultRelaunchDataOptions())
  annotWrapperNode.resize(width, height)
  annotWrapperNode.x = x
  annotWrapperNode.y = y
  annotWrapperNode.name = config.annotWrapperNodeName
  annotWrapperNode.fills = [ generateSolidPaint({ r: 255, g: 255, b: 255 }) ]
  annotWrapperNode.verticalPadding = 16
  annotWrapperNode.itemSpacing = 16
  annotWrapperNode.layoutMode = 'VERTICAL'
  annotWrapperNode.cornerRadius = 16
  annotWrapperNode.cornerSmoothing = .6 // Like Apple
  annotWrapperNode.effects = [
    <ShadowEffect>{ 
      type: 'DROP_SHADOW',
      color: generateRGBA({ a: .03 }),
      blendMode: 'NORMAL',
      offset: <Vector>{ x: 0, y: -4 },
      radius: 16,
      visible: true
    },

    <ShadowEffect>{ 
      type: 'DROP_SHADOW',
      color: generateRGBA({ a: .07 }),
      blendMode: 'NORMAL',
      offset: <Vector>{ x: 0, y: 10 },
      radius: 15,
      visible: true
    },

    <ShadowEffect>{ 
      type: 'DROP_SHADOW',
      color: generateRGBA({ r: 50, g: 50, b: 93, a: .12 }),
      blendMode: 'NORMAL',
      offset: <Vector>{ x: 0, y: 32 },
      radius: 72,
      visible: true
    }
  ]

  figma.viewport.scrollAndZoomIntoView([
    ...figma.currentPage.selection,
    annotWrapperNode
  ])

  // figma.notify('🎉 You successfully created your first annotation!')

  return annotWrapperNode
}


/**
 * Helper, Is used when the annotation wrapper is initially created.
 */
const _calculateAnnotWrapperNodePos = ( wrapperData: { width: number, height: number }, startAtX?: number ) : { x: number, y: number } => {
  // If there is no current sel, return x = y = 0
  let currSel = figma.currentPage.selection?.[0]
  if (!currSel)
    return { x: 0, y: 0 }
  currSel = getNodeRootParent(currSel)

  if (!startAtX)
    startAtX = currSel.x + currSel.width

  const nodes = figma.currentPage.children.filter(node => {
    return node.x + node.width >= startAtX
  })

  // Loop through every direct page child node, returning only the child with an x higher than the current selection. 
  let pageNodesPosArr = []
  for (const node of nodes) {
    pageNodesPosArr.push({ 
      width:  node.width,
      height: node.height,
      x:      node.x,
      y:      node.y,
      id:     node.id
    })
  }

  // Sort nodes by x position
  pageNodesPosArr.sort((a, b) => a.xEnd - b.xEnd)

  let wantedWrapperPos = { 
    width:  wrapperData.width,
    height: wrapperData.height,
    x:      startAtX + 160,
    y:      currSel.y,
  }

  const detectedCollision = detectNodeCollisions(pageNodesPosArr, wantedWrapperPos).find(nodeObj => {
    return nodeObj.id !== currSel.id
  })

  return detectedCollision
    ? _calculateAnnotWrapperNodePos(wrapperData, detectedCollision.x + detectedCollision.width)
    : { x: wantedWrapperPos.x, y: wantedWrapperPos.y }
}


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