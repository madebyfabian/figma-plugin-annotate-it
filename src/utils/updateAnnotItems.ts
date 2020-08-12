import { 
  generateAnnotItemNode,
  generateAnnotBadgeNode
} from '@/utils/nodeGenerators'
import getAnnotWrapperNode from '@/utils/getAnnotWrapperNode'
import contentBlockToNode from '@/utils/contentBlockToNode'
import detectNodeCollisions from '@/utils/detectNodeCollisions'
import Differy from '@netilon/differify'
const differy = new Differy()
import { 
  config,
  setPluginData,
  generateAnnotItemTitleOptions,
  updateAnnotItemsBadgeIndex,
  getAnnotMarkerBadgeNodes,
  checkIfNodeIsBadge,
  updateAnnotItemBadgeColor
} from '@/utils/utils'


export default ( newAnnots: Annotation[], oldAnnots: Annotation[] ) => {
  const annotWrapperNode = getAnnotWrapperNode(),
        diff = _createAnnotDiff(newAnnots, oldAnnots),
        annotArr = diff._

  // console.clear()

  // Check if any id of any annotation has changed
  let reorderingMode = false
  for (const annotDiffObj of annotArr) {
    if (annotDiffObj.status === 'MODIFIED' && annotDiffObj._.id.status === 'MODIFIED') {
      reorderingMode = true; break
    }
  }
  
  // Loop through array of diff objects
  for (let i = 0; i < annotArr.length; i++) {
    const annotDiffObj = annotArr[i]

    // Handle annotation items reordering
    if (reorderingMode) {
      const annotNode = annotWrapperNode.findChild(node => node.name.includes(annotDiffObj._.id.current))  
      annotWrapperNode.appendChild(annotNode)
      continue
    }    
    
    switch (annotDiffObj.status) {
      case 'ADDED': {
        const { current: newItem } = annotDiffObj,
              currSel = figma.currentPage.selection?.[0]

        // Get index for annotation badge
        const annotIndex = annotWrapperNode.children.length + 1
        annotWrapperNode.appendChild(generateAnnotItemNode(newItem, annotIndex))

        // Get the node for the badge marker item
        const badgeMarkerNode = generateAnnotBadgeNode(annotIndex, newItem.id)
        if (currSel) {
          const { x, y } = _calculateAnnotMarkerBadgePosition(currSel, badgeMarkerNode)
          badgeMarkerNode.x = x
          badgeMarkerNode.y = y
        }

        figma.currentPage.appendChild(badgeMarkerNode)

        break
      }

      case 'MODIFIED': {
        const { _: item } = annotDiffObj

        if (item.isDeleted.current === true)
          _deleteAnnotItem(item, annotWrapperNode)
        else {
          // Update annot item
          const annotNode = <FrameNode>annotWrapperNode.findChild(node => node.name.includes(item.id.original))

          // Save the "real" modified annot item object (wihout diff-things)
          const modifiedItemWithoutDiff = newAnnots[i]
          setPluginData(annotNode, config.annotItemNodePluginDataKey, modifiedItemWithoutDiff)

          let doneChanges = 0

          // Loop through item entries (id, title, content, ...)
          for (let entryName of Object.keys(item)) {
            const { changes, current: newValue } = item[entryName]
            if (!changes)
              continue

            switch (entryName) {
              case 'title':
                const titleNode = <TextNode>annotNode.findOne(node => node.name === 'Header/Text'),
                      titleOptions = generateAnnotItemTitleOptions(newValue)
                titleNode.characters = titleOptions.characters
                titleNode.opacity = titleOptions.opacity
                break
            
              case 'content':
                _handleModifiedItemContent(annotDiffObj, entryName, annotNode)
                break

              case 'colorThemeId':
                updateAnnotItemBadgeColor(item.id.current, newValue)
            }

            // console.log(`Detected a change in ${entryName}`)

            doneChanges++
            if (doneChanges === annotDiffObj.changes)
              break
          }
        }

        break
      } // end case 'MODIFIED'
    } // end switch
  } // end for (... of ...)

  if (reorderingMode)
    // Update the badge's indexes
    updateAnnotItemsBadgeIndex(annotWrapperNode)
}


const _deleteAnnotItem = ( deletedItem: any, annotWrapperNode: FrameNode ) => {
  const annotId = deletedItem.id.current,
        annotNode = <FrameNode>annotWrapperNode.findChild(node => node.name.includes(annotId))

  annotNode.remove()

  // If the annotWrapper node is empty after removing the itemNode, remove the wrapper too.
  if (annotWrapperNode.children.length === 0)
    annotWrapperNode.remove()

  // Get all badge marker items
  const badgeMarkerNodes = getAnnotMarkerBadgeNodes(annotId)
  for (const node of badgeMarkerNodes) {
    node.remove()
  }
    
  // Update the badge's indexes
  updateAnnotItemsBadgeIndex(annotWrapperNode)
}


const _handleModifiedItemContent = ( item: any, entryName: string, annotNode: FrameNode ) => {
  const bodyNode = <FrameNode>annotNode.findChild(node => node.name === 'Body')

  const diffObj = item._[entryName],
        contentBlockArr = diffObj._,
        contentBlocksAmount = contentBlockArr.filter(b => b.status !== 'DELETED').length

  let doneContentChanges = 0,
      expectedContentChanges = diffObj.changes,
      figmaNodeListIndex = -1

  for (let i = 0; i < contentBlockArr.length; i++) {
    figmaNodeListIndex++

    const contentBlock = contentBlockArr[i]
    if (!contentBlock.changes)
      continue

    switch (contentBlock.status) {
      case 'ADDED':
        const newContentBlock = _generateSafeAddedContentBlock(contentBlock.current),
              newNode = contentBlockToNode({ contentBlock: newContentBlock, contentBlocksAmount })

        console.log(`ADDED (line ${i + 1})`, newContentBlock)
        bodyNode.insertChild(figmaNodeListIndex, newNode)
        break
    
      case 'DELETED':
        console.log(`REMOVED (line ${i + 1})`, contentBlock)
        bodyNode.children[figmaNodeListIndex].remove()
        figmaNodeListIndex--
        break
        
      case 'MODIFIED':
        const modifiedContentBlock = _generateSafeModifiedContentBlock(contentBlock),
              modifiedNode = contentBlockToNode({ contentBlock: modifiedContentBlock, contentBlocksAmount })

        console.log(`MODIFIED (on line ${i + 1})`, modifiedContentBlock)

        // Only remove the old block if there is some!
        if (bodyNode.children.length !== 0)
          bodyNode.children[figmaNodeListIndex].remove()
        
        bodyNode.insertChild(figmaNodeListIndex, modifiedNode)

        break
    }

    doneContentChanges++
    if (doneContentChanges === expectedContentChanges)
      break
  }

  bodyNode.visible = true
  if (bodyNode.children.length === 1 && bodyNode.children[0].type === 'TEXT')
    bodyNode.visible = bodyNode.children[0].characters.trim().length ? true : false
}


const _generateSafeAddedContentBlock = ( contentBlock: any ) => {
  return { 
    ...contentBlock, 
    content: contentBlock?.content 
      ? JSON.parse(contentBlock.content) // when content is already something
      : config.defaultParagraphBlockContent // when content is undefined
  }
}


const _generateSafeModifiedContentBlock = ( contentBlock: any ) => {
  return {
    type: contentBlock._.type.current,
    content: contentBlock._.content.current
      ? JSON.parse(contentBlock._.content.current) // when content is already something
      : config.defaultParagraphBlockContent // when content is undefined
  }
}


/**
 * Takes two arrays of annotations and 
 * @returns a diff of those two.
 */
const _createAnnotDiff = ( newAnnots: Annotation[], oldAnnots: Annotation[] ) => {
  newAnnots = _createAnnotDiff_blockContentSectionToString(newAnnots)
  oldAnnots = _createAnnotDiff_blockContentSectionToString(oldAnnots)

  return differy.compare(oldAnnots, newAnnots)
}


/**
 * Takes an array of annotations
 * e.g. { title: string, content: [{ type: 'paragraph', content: object[] }, ...] }
 * and returns the same array, but all nested contents are stringified, 
 * e.g. { title: string, content: [{ type: 'paragraph', content: string }, ...] }
 */
const _createAnnotDiff_blockContentSectionToString = ( annotArr ) => {
  return annotArr.map(annot => { // Loop through every annotation in the array.
    return { 
      ...annot,
      content: annot.content.map(annotContentBlock => { // Loop through every content block
        return {
          ...annotContentBlock, 
          content: JSON.stringify(annotContentBlock.content)
        }
      })
    }
  })
}


const _calculateAnnotMarkerBadgePosition = ( currSel: SceneNode, badgeMarkerNode: SceneNode, startAtY?: number ) => {
  const spaceBetweenSelAndBadge = badgeMarkerNode.width - 8 // 8px overlap

  if (!startAtY)
    startAtY = currSel.absoluteTransform[1][2] + ((currSel.height / 2 - (badgeMarkerNode.width / 2)))

  let wantedPos = {
    x: currSel.absoluteTransform[0][2] - spaceBetweenSelAndBadge,
    y: startAtY,
    width: badgeMarkerNode.width,
    height: badgeMarkerNode.height
  }

  const collidableNodes = figma.currentPage.findChildren(node => checkIfNodeIsBadge(node)),
        detectedCollision = detectNodeCollisions(collidableNodes, wantedPos).find(nodeObj => {
          return nodeObj.id !== badgeMarkerNode.id
        })

  return detectedCollision
    ? _calculateAnnotMarkerBadgePosition(currSel, badgeMarkerNode, startAtY + badgeMarkerNode.height + 8)
    : { x: wantedPos.x, y: wantedPos.y }
}