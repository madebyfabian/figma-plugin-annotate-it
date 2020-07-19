import Differy from '@netilon/differify'
import contentBlockToNode from '@/functions/figma/contentBlockToNode'
import { generateAnnotItemNode, getAnnotWrapperNode } from '@/functions/figma/figmaHelpers'

const differy = new Differy()


export default ( msgValue: { newAnnots: object[], oldAnnots: object[] } ) => {
  const diff = differy.compare(msgValue.oldAnnots, msgValue.newAnnots)

  // console.clear()

  if (diff.changes > 1) {
    // There are more than 1 change at a time. We should check if the ids has changed.
    // (Which would mean that we would have to re-initiate every item, due to the changed order of items.)
    const firstItem = diff._[0]
    if (firstItem.status === 'MODIFIED' && firstItem._.id.status === 'MODIFIED') {
      console.log('Detected a change of the id. This means the order has changed and we now have to re-initiate every item.')
      return
    }
  }

  for (const item of diff._) {
    if (item.status === 'ADDED')
      handleAddedItem(item)
    else 
    if (item.status === 'DELETED')
      handleDeletedItem(item)
    else 
    if (item.status === 'MODIFIED')
      handleModifiedItem(item)
  }
}


const handleAddedItem = ( item: any ) => {
  const { current: newItem } = item

  console.log('Adding:', newItem)
  
  generateAnnotItemNode(newItem)
}


const handleDeletedItem = ( item: any ) => {
  const { original: deletedItem } = item

  console.log('Deleting:', deletedItem.id)
  // @TODO implement deleting items in Figma.
}


const handleModifiedItem = ( item: any ) => {
  const itemId = item._.id.current,
        annotWrapperNode = getAnnotWrapperNode(),
        // @ts-ignore
        annotNode : FrameNode = annotWrapperNode.findChild(node => node.name.includes(itemId))

  // Loop through item entries (id, title, content, ...)
  let doneChanges = 0
  for (let entryName of Object.keys(item._)) {
    const { changes, current: newValue } = item._[entryName]
    if (!changes)
      continue

    switch (entryName) {
      case 'title':
        // @ts-ignore
        const titleNode : TextNode = annotNode.findOne(node => node.name === 'Text')
        titleNode.characters = newValue.length === 0 ? 'Title' : newValue
        titleNode.opacity = newValue.length === 0 ? .25 : 1
        break
    
      case 'content':
        handleModifiedItem_content(item, entryName, annotNode)
    }

    if (entryName !== 'content')
      console.log(`Detected a change in ${entryName}. The new value is:`, newValue)
      // @TODO implement these changes in Figma.

    doneChanges++
    if (doneChanges === item.changes)
      break
  }
}


const handleModifiedItem_content = ( item: any, entryName: string, annotNode: FrameNode ) => {
  let doneContentChanges = 0,
      contentBlockIndex = -1

  const bodyNode = <FrameNode>annotNode.findChild(node => node.name === 'Body')

  for (const contentBlock of item._[entryName]._) {
    contentBlockIndex++

    if (!contentBlock.changes)
      continue

    switch (contentBlock.status) {
      case 'ADDED':
        const newContentBlock = _generateSafeAddedContentBlock(contentBlock.current),
              newNode = contentBlockToNode({ contentBlock: newContentBlock, contentBlockIndex })

        // console.log(`ADDED (line ${contentBlockIndex + 1})`, newContentBlock)
        bodyNode.insertChild(contentBlockIndex, newNode)
        contentBlockIndex++
        break
    
      case 'DELETED':
        // console.log(`REMOVED (line ${contentBlockIndex + 1})`, contentBlock)
        bodyNode.children[contentBlockIndex].remove()
        contentBlockIndex--
        break
        
      case 'MODIFIED':
        const modifyContentBlock = _generateSafeModifiedContentBlock(contentBlock),
              modifiedNode = contentBlockToNode({ contentBlock: modifyContentBlock, contentBlockIndex })

        // console.log(`MODIFIED (on line ${contentBlockIndex + 1})`, modifyContentBlock)
        bodyNode.children[contentBlockIndex].remove()
        bodyNode.insertChild(contentBlockIndex, modifiedNode)
        break
    }

    doneContentChanges++
    if (doneContentChanges === item._[entryName].changes)
      break
  }
}


const _generateSafeAddedContentBlock = ( contentBlock: any ) => {
  return { 
    ...contentBlock, 
    content: contentBlock?.content 
      ? JSON.parse(contentBlock.content) // when content is already something
      : [{ type: 'text', text: ' ' }] // when content is undefined
  }
}


const _generateSafeModifiedContentBlock = ( contentBlock: any ) => {
  return {
    type: contentBlock._.type.current,
    content: contentBlock._.content.current
      ? JSON.parse(contentBlock._.content.current) // when content is already something
      : [{ type: 'text', text: ' ' }] // when content is undefined
  }
}