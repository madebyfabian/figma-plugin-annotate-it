import Differy from '@netilon/differify'
import contentToNodes from '@/functions/figma/contentToNodes'
import { generateAnnotItemNode, getAnnotWrapperNode } from '@/functions/figma/figmaHelpers'

const differy = new Differy()


export default ( msgValue: { newAnnots: object[], oldAnnots: object[] } ) => {
  const diff = differy.compare(msgValue.oldAnnots, msgValue.newAnnots)

  console.clear()

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
  let doneChanges = 0

  const itemId = item._.id.current,
        annotWrapperNode = getAnnotWrapperNode(),
        // @ts-ignore
        annotNode : FrameNode = annotWrapperNode.findChild(node => node.name.includes(itemId))

  // Loop through item entries (id, title, content, ...)
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
        // @ts-ignore
        const contentNode : FrameNode = annotNode.findChild(node => node.name === 'Body')
        contentToNodes({ content: JSON.parse(newValue), contentNode })
    }

    if (entryName !== 'content')
      console.log(`Detected a change in ${entryName}. The new value is:`, newValue)
      // @TODO implement these changes in Figma.

    doneChanges++
    if (doneChanges === item.changes)
      break
  }
}