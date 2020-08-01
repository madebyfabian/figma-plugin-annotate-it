import { config } from '@/utils/utils'


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
    annotWrapperNode.resize(width, height)
    annotWrapperNode.x = x
    annotWrapperNode.y = y
    annotWrapperNode.name = config.annotWrapperNodeName
    annotWrapperNode.fills = [{ type: 'SOLID', color: <RGB> { r: 1, g: 1, b: 1 }}]
    annotWrapperNode.verticalPadding = 8
    annotWrapperNode.itemSpacing = 16
    annotWrapperNode.layoutMode = 'VERTICAL'
  }

  return annotWrapperNode
}


/**
 * Helper, Is used when the annotation wrapper is initially created.
 */
const _calculateAnnotWrapperNodePos = ( wrapperData: { width: number, height: number }, startAtX?: number ) => {
  // If there is no current sel, return x = y = 0
  const currSel = figma.currentPage.selection?.[0]
  if (!currSel)
    return { x: 0, y: 0 }

  if (!startAtX)
    startAtX = currSel.x + currSel.width

  const filteredChilds = figma.currentPage.children.filter(node => {
    return node.x + node.width >= startAtX
  })

  // Loop through every direct page child node, returning only the child with an x higher than the current selection. 
  let pageNodesPosArr = []
  for (const node of filteredChilds) {
    pageNodesPosArr.push({ 
      width:  node.width,
      height: node.height,
      x:      node.x,
      y:      node.y,
      name:   node.name,
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

  const foundCollisionPosData = pageNodesPosArr.find(nodePosData => {
    const doCollide = !(
      ((nodePosData.y + nodePosData.height) < (wantedWrapperPos.y)) ||
      (nodePosData.y > (wantedWrapperPos.y + wantedWrapperPos.height)) ||
      ((nodePosData.x + nodePosData.width) < wantedWrapperPos.x) ||
      (nodePosData.x > (wantedWrapperPos.x + wantedWrapperPos.width))
    )

    return nodePosData.id !== currSel.id && doCollide
  })

  return foundCollisionPosData
    ? _calculateAnnotWrapperNodePos(wrapperData, foundCollisionPosData.x + foundCollisionPosData.width)
    : { x: wantedWrapperPos.x, y: wantedWrapperPos.y }
}

