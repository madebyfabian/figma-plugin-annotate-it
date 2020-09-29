import { 
  config, 
  generateSolidPaint,
  generateRGBA,
  generateDefaultRelaunchDataOptions,
  getNodeRootParent
} from '@/utils/utils'
import detectNodeCollisions from '@/utils/detectNodeCollisions'

/**
 * Find an already existing annotation wrapper-frame on the current page, or create one.
 */
export default ({ createOneIfItDoesNotExist = true } = {}) => {
  let annotWrapperNode = <FrameNode>figma.currentPage.findChild(node => {
    if (node.type !== 'FRAME') return false
    if (node.name !== config.annotWrapperNodeName) return false
    return true
  })

  // Create annot wrapper node
  if (!annotWrapperNode && createOneIfItDoesNotExist) {
    const width = 343, 
          height = 100,
          { x, y } = _calculateAnnotWrapperNodePos({ width, height })

    annotWrapperNode = figma.createFrame()
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

    figma.notify('🎉 You successfully created your first annotation!')
  }

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