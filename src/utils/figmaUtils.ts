import { config, generateAnnotItemObject } from '@/utils/utils'
import { filter } from 'vue/types/umd'


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
    const width = 343, 
          height = 100

    annotWrapperNode = figma.createFrame()
    annotWrapperNode.name = config.annotWrapperNodeName
    annotWrapperNode.resize(343, 100)
    annotWrapperNode.fills = [{ type: 'SOLID', color: <RGB> { r: 1, g: 1, b: 1 }}]
    annotWrapperNode.verticalPadding = 8
    annotWrapperNode.itemSpacing = 16
    annotWrapperNode.layoutMode = 'VERTICAL'

    const { x, y } = _calculateAnnotWrapperNodePos({ width, height })
    console.log('x', x, '- y', y)
    annotWrapperNode.x = x
    annotWrapperNode.y = y
  }

  return annotWrapperNode
}


/**
 * Loops through annot item nodes and updates the number inside the badge.
 */
export const updateAnnotItemsBadgeIndex = ( annotWrapperNode: FrameNode ) => {
  for (let i = 0; i < annotWrapperNode.children.length; i++) {
    const annotItemNode = <FrameNode>annotWrapperNode.children[i]

    const annotItemBadgeNode = <TextNode>annotItemNode.findOne(node => node.type === 'TEXT' && node.name === 'Badge/Text')
    annotItemBadgeNode.characters = (i + 1).toString()
  }
}


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
  node.cornerRadius = 12
  node.locked = true

  const headerNode = figma.createFrame()
  headerNode.name = 'Header'
  headerNode.resize(328, 24)
  headerNode.itemSpacing = 8
  headerNode.layoutMode = 'HORIZONTAL'

  const headerAnnotBadgeNode = generateAnnotBadgeNode(badgeNumber)

  const headerTextNode = figma.createText()
  headerTextNode.name = 'Header/Text'
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
  const node = figma.createFrame()
  node.name = 'Badge'
	node.resize(24, 24)
	node.cornerRadius = 24
	node.layoutMode = 'HORIZONTAL'
	node.fills = [ generateSolidPaint({ r: 24, g: 160, b: 251 }) ]

	// Text Frame inside Main Frame
  const textNode = figma.createText()
  textNode.name = 'Badge/Text'
	textNode.fontSize = 12
	textNode.characters = number.toString()
	textNode.fills = [ generateSolidPaint({ r: 255, g: 255, b: 255 }) ]
	textNode.resize(24, 24)
	textNode.textAlignHorizontal = 'CENTER'
	textNode.fontName = generateFontNameConfig({ isBold: true })
	textNode.lineHeight = { value: 24, unit: 'PIXELS' }
	textNode.locked = true

  node.appendChild(textNode)
  return node

	// const instanceNode = node.createInstance()
  // node.remove()
  
  // return instanceNode
}


// Internal Helpers

/**
 * Is used when the annotation wrapper is initially created.
 */
const _calculateAnnotWrapperNodePos = ( wrapperData: { width: number, height: number } ) => {
  let x = 0, y = 0

  // console.clear()

  // If there is no current sel, return
  const currSel = figma.currentPage.selection?.[0]
  if (!currSel)
    return { x, y }

  return _loop(currSel.x + currSel.width, currSel)
}


const _loop = ( startAtX: number, currSel: any ) => {
  const filteredChilds = figma.currentPage.children.filter(node => {
    return node.x + node.width >= startAtX
  })

  // Loop through every direct page child node, returning only the child with an x higher than the current selection. 
  let pageNodesPosDataArr = []
  for (const node of filteredChilds) {
    pageNodesPosDataArr.push({ 
      width:  node.width,
      height: node.height,
      x:      node.x,
      y:      node.y,
      name:   node.name,
      id:     node.id
    })
  }

  // Sort nodes by x position
  pageNodesPosDataArr.sort((a, b) => a.xEnd - b.xEnd)

  let wantedWrapperPosData = { 
    width:  currSel.width,
    height: currSel.height,
    x:      startAtX + 160,
    y:      currSel.y,
  }

  const foundCollisionPosData = pageNodesPosDataArr.find(nodePosData => {
    return nodePosData.id !== currSel.id && _doCollide(nodePosData, wantedWrapperPosData)
  })

  console.log(foundCollisionPosData)

  return foundCollisionPosData 
    ? _loop(foundCollisionPosData.x + foundCollisionPosData.width, currSel)
    : { x: wantedWrapperPosData.x, y: wantedWrapperPosData.y }
}


// const _numIsBetween = ( num: number, a: number, b: number ) => {
//   let min = Math.min.apply(Math, [a, b]),
//       max = Math.max.apply(Math, [a, b])

//   let isBetween = num >= min && num <= max

//   console.log('The number', num, (isBetween ? 'IS' : 'IS NOT'), 'between', min, 'and', max)

//   return isBetween;
// }

const _doCollide = (a, b) => {
  // console.log('Do\n',a, '\nand\n', b, '\ncollide?')
  return !(
      ((a.y + a.height) < (b.y)) ||
      (a.y > (b.y + b.height)) ||
      ((a.x + a.width) < b.x) ||
      (a.x > (b.x + b.width))
  );
} 