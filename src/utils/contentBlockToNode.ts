import { generateAnnotItemBodyTextNode } from '@/utils/nodeGenerators'
import {
  config, 
  generateSolidPaint,
  generateFontNameConfig
} from '@/utils/utils'


/**
 * Parses a given Text content in JSON and returns the corresponding Figma Text Node of it.
 */
export default ({ contentBlock, contentBlocksAmount }: { contentBlock: ContentBlock, contentBlocksAmount: number } ) => {
  switch (contentBlock.type) {
    case 'paragraph':
      return generateParagraphBlock(contentBlock, contentBlocksAmount)
    
    case 'horizontal_rule':
      return generateHorizontalRuleBlock()

    case 'bullet_list': case 'ordered_list':
      return generateListBlock(contentBlock, 0)
  }
}



const generateParagraphBlock = ( contentBlock: ContentBlock, contentBlocksAmount: number ) => {
  let totalLength = 0

  const textNode = generateAnnotItemBodyTextNode()

  for (const textPart of contentBlock.content) {
    let textPartContent = textPart.type === 'hard_break' 
      ? '\u2028' // Generates a "lsep" (<br> alternative)
      : textPart.text

    const start = totalLength
    textNode.insertCharacters(start, textPartContent)

    if (textPart.type === 'text') {
      const end = totalLength + textPartContent.length,
            { fontName, textDecoration } = _getTextMarkOptions(textPart?.marks)

      textNode.setRangeFontName(start, end, fontName)
      textNode.setRangeTextDecoration(start, end, textDecoration)
    }

    totalLength += textPartContent.length
  }
    
  return textNode
}


const generateHorizontalRuleBlock = () => {
  const node = figma.createFrame()
  node.name = 'Horizontal Rule'
  node.layoutAlign = 'STRETCH'
  node.layoutMode = 'VERTICAL'
  node.verticalPadding = 12

  const lineNode = figma.createRectangle()
  lineNode.layoutAlign = 'STRETCH'
  lineNode.resize(lineNode.width, 2)
  lineNode.cornerRadius = 2
  lineNode.fills = [ generateSolidPaint({ r: 240, g: 240, b: 240 }) ]

  node.appendChild(lineNode)

  return node
}


const generateListBlock = ( contentBlock: ContentBlock, nestingLevel: number) => {
  const isBulletList = contentBlock.type === 'bullet_list'

  const listWrapperNode = figma.createFrame()
  listWrapperNode.name = isBulletList ? 'Bullet List' : 'Ordered List'
  listWrapperNode.layoutMode = 'VERTICAL'
  listWrapperNode.layoutAlign = 'STRETCH'

  // Loop through the array list-items on the root of the listWrapper
  for (let i = 0, n = contentBlock.content.length; i < n; ++i){
    const { content: listItemContent } = contentBlock.content[i]

    const listItemNode = figma.createFrame()
    listItemNode.name = 'List Item'
    listItemNode.layoutMode = 'HORIZONTAL'
    listItemNode.itemSpacing = 4
    listItemNode.counterAxisSizingMode = 'AUTO'

    // Either the dot or the 1., 2., 3...
    const listItemKeyNode = figma.createText()
    listItemKeyNode.name = 'Key'
    listItemKeyNode.resize(12, listItemKeyNode.height)
    listItemKeyNode.textAlignHorizontal = isBulletList ? 'CENTER' : 'RIGHT'
    listItemKeyNode.characters = isBulletList ? _getBullet(nestingLevel) : `${i + 1}.`
    listItemKeyNode.fontSize = isBulletList ? 18 : config.defaultParagraphTextOptions.fontSize
    listItemKeyNode.lineHeight = config.defaultParagraphTextOptions.lineHeight
    listItemKeyNode.letterSpacing = config.defaultParagraphTextOptions.letterSpacing

    const listItemContentWrapperNode = figma.createFrame()
    listItemContentWrapperNode.name = 'List Content'
    listItemContentWrapperNode.layoutMode = 'VERTICAL'
    listItemContentWrapperNode.resize(279 - ((nestingLevel + 1) * 16), listItemContentWrapperNode.height)

    listItemNode.appendChild(listItemKeyNode)
    listItemNode.appendChild(listItemContentWrapperNode)

    listWrapperNode.appendChild(listItemNode)

    // Loop through the array of paragraph (or other) blocks inside the list item
    for (const listItemChildBlock of listItemContent) {
      switch (listItemChildBlock.type) {
        case 'paragraph':
          const safeParagraphBlock = _generateSafeParagraphBlock(listItemChildBlock)
          listItemContentWrapperNode.appendChild(generateParagraphBlock(safeParagraphBlock, 0))
          break;

        case 'bullet_list': case 'ordered_list':
          listItemContentWrapperNode.appendChild(generateListBlock(listItemChildBlock, nestingLevel + 1))
      }
    }
  }

  return listWrapperNode
}


// --- HELPERS ---

const _getTextMarkOptions = ( marks: Mark[] ) => {
  let isBold = false,
      isItalic = false,
      textDecoration: TextDecoration = 'NONE'

  if (marks)
    for (const mark of marks) {
      switch (mark.type) {
        case 'bold': isBold = true; break
        case 'italic': isItalic = true; break
        case 'underline': textDecoration = 'UNDERLINE'; break
        case 'strike': if (textDecoration === 'NONE') textDecoration = 'STRIKETHROUGH'; break
      }
    }

  return {
    fontName: generateFontNameConfig({ isBold, isItalic }),
    textDecoration
  }
}


const _generateSafeParagraphBlock = ( contentBlock: ContentBlock ) => {
  return <ContentBlock>{
    ...contentBlock,
    content: contentBlock?.content || config.defaultParagraphBlockContent
  }
}


const _getBullet = ( nestingLevel: number ) => {
  switch (nestingLevel) {
    case 0:   return '•'
    default:  return '◦'
  }
}