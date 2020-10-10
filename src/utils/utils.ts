import getAnnotWrapperNode from "./getAnnotWrapperNode"

export const config = {
  annotWrapperNodeName: 'Annotate it! – Frame',
  annotBadgeNodeName: 'Annotate it! – Badge',
  annotWrapperNodePluginDataKey: 'annotWrapperConnectedFrameId',
  annotItemNodePluginDataKey: 'annotStore',

  /**
   * Helper to fill an empty contentBlock paragraph with an empty space to avoid figma errors
   */
  defaultParagraphBlockContent: [ { type: 'text', text: ' ' } ],

  /**
   * @returns A few default options for the styling of annotation paragraphs.
   */
  defaultParagraphTextOptions: {
    fontSize: 14,
    lineHeight: <LineHeight>{ value: 19, unit: 'PIXELS' },
    letterSpacing: <LetterSpacing>{ value: 0.5, unit: 'PERCENT' }
  }
}



// ---
// Figma API Extensions
// ---

export const generateSolidPaint = ({ r = 0, g = 0, b = 0 }) => {
  return <SolidPaint>{ type: 'SOLID', color: generateRGBA({ r, g, b }) }
}


export const generateRGBA = ({ r = 0, g = 0, b = 0, a = <number>null }) : RGB | RGBA => {
  const color = { r: r / 255, g: g / 255, b: b / 255 }
  return a ? <RGBA>{ ...color, a } : <RGB>color
}


/**
 * Converts figmas RGBA { r: .5, g: .75, b: .2 } to regular RGBA { r: 120, g: 215, b: 40  }
 */
export const figmaRGBAToRealRGBA = ({ r = 0, g = 0, b = 0, a = <number>null }) => {
  const color = { r: r * 255, g: g * 255, b: b * 255 }
  return a ? <RGBA>{ ...color, a } : <RGB>color
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


export const generateAnnotItemTitleOptions = ( title?: string ) => {
  return {
    opacity: title.length ? 1 : .25,
    characters: title.length ? title : 'Title'
  }
}


export const generateDefaultRelaunchDataOptions = ({ singleItem = false } = {}) => {
  const str = `${singleItem ? 'Edit this Annotation' : 'Edit the Annotation items inside'} with "Annotate it!"`
  return singleItem
    ? { editAnnotation: str }
    : { editAnnotations: str }
}



// ---
// General Utils
// ---

/**
 * Generates a random string and returns it.
 * @param idLength The length of the id. Defaults to 16.
 */
export const randomId = ( idLength: number = 16 ) => {
  return [...Array(idLength)].map(() => Math.random().toString(32)[2]).join('')
}


export const getAllAnnotWrapperNodes = () => {
  return <[FrameNode]>figma.currentPage.findChildren(node => 
    node.type === 'FRAME' && node.name === config.annotWrapperNodeName
  )
}


export const generateAnnotItemObject = ( title = '', content = null ) : Annotation => ({
  id: randomId(),
  title,
  content: content || [{ type: 'paragraph' }],
  isDeleted: false,
  colorThemeId: getUserColorThemes()[0].id
})


export const getUserColorThemes = () => {
  return [
    { name: 'Blue', color: generateRGBA({ r: 24, g: 160, b: 251 }), id: 'blvbk3k2fj551h0p' },
    { name: 'Red', color: generateRGBA({ r: 242, g: 72, b: 34 }), id: '25s8afhofkgi7185' },
    { name: 'Green', color: generateRGBA({ r: 27, g: 196, b: 125 }), id: 'dd70jmjl2dp78sii' }
  ].map(theme => ({ ...theme, color: figmaRGBAToRealRGBA(theme.color) }))
}


export const checkIfNodeIsBadge = ( node: SceneNode, id?: string ) => {
  return node.type === 'INSTANCE' && node.name.includes(config.annotBadgeNodeName + (id ? ` ${id}` : ''))
}


/**
 * @returns a list of Marker Badge Nodes for a specific id on the current page.
 */
export const getAnnotMarkerBadgeNodes = ( id: string ) => {
  return <InstanceNode[]>figma.currentPage.findAll(node => {
    return !node.parent.parent.name.includes(id) && checkIfNodeIsBadge(node, id)
  })
}


/**
 * Loops through annot item nodes and updates the number inside the badge.
 */
export const updateAnnotItemsBadgeIndex = ( annotWrapperNode: FrameNode ) => {
  for (let i = 0; i < annotWrapperNode.children.length; i++) {
    const newChars = (i + 1).toString(),
          annotItemNode = <FrameNode>annotWrapperNode.children[i],
          id = annotItemNode.name.replace('Annotation ', '')

    // Get the Badge node inside the annotation item
    const annotItemBadgeNode = _getAnnotItemBadgeNode(annotItemNode, id),
          annotItemBadgeTextNode = <TextNode>annotItemBadgeNode.findChild(node => node.type === 'TEXT')
    annotItemBadgeTextNode.characters = newChars

    // Get the Marker Badge node on the page.
    const annotMarkerBadgeNodes = getAnnotMarkerBadgeNodes(id)

    if (!annotMarkerBadgeNodes.length)
      console.log('Failed to find the annot marker for annot ${id} on the page.')
    else {
      for (const badgeNode of annotMarkerBadgeNodes) {
        const annotMarkerBadgeTextNode = <TextNode>badgeNode.findChild(node => node.type === 'TEXT')
        annotMarkerBadgeTextNode.characters = newChars
      }
    }
  }
}


export const updateAnnotItemBadgeColor = ( annotWrapperId: string, annotId: string, newColorId: string ) => {
  const colorThemeData = getUserColorThemes().find(theme => theme.id === newColorId),
        newFills = [ generateSolidPaint({ 
          r: colorThemeData.color.r,
          g: colorThemeData.color.g,
          b: colorThemeData.color.b
        }) ]

  const annotWrapperNode = getAnnotWrapperNode({ createOneIfItDoesNotExist: false, id: annotWrapperId })
  if (!annotWrapperNode)
    return

  const annotItemNode = <FrameNode>annotWrapperNode.findChild(node => node.name.includes(annotId))
  if (!annotItemNode)
    return

  // Get the Badge node inside the annotation item
  const annotItemBadgeNode = _getAnnotItemBadgeNode(annotWrapperNode, annotId)
  annotItemBadgeNode.fills = newFills

  // Get all marker badges on the page.
  const annotMarkerBadgeNodes = getAnnotMarkerBadgeNodes(annotId)
  for (const node of annotMarkerBadgeNodes) {
    node.fills = newFills
  }
}


const _getAnnotItemBadgeNode = ( annotItemNode: FrameNode, annotId: string ) => {
  return <InstanceNode>annotItemNode.findOne(node => checkIfNodeIsBadge(node, annotId))
}