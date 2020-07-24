import { generateFontNameConfig, generateAnnotItemBodyTextNode, generateSolidPaint } from '@/functions/figma/figmaHelpers'


/**
 * Parses a given Text content in JSON and returns the corresponding Figma Text Node of it.
 */
export default ({ contentBlock, contentBlocksAmount }: { contentBlock: ContentBlock, contentBlocksAmount: number } ) => {
  switch (contentBlock.type) {
    case 'paragraph':
      return generateParagraphBlock(contentBlock, contentBlocksAmount)
    
    case 'horizontal_rule':
      return generateHorizontalRuleBlock()

    // case 'bullet_list':
    //   return generateBulletListBlock(contentBlock)
  }
}



const generateParagraphBlock = ( contentBlock: ContentBlock, contentBlocksAmount: number ) => {
  let totalLength = 0

  // @ts-ignore
  const showPlaceholder = contentBlocksAmount === 1 && _showPlaceholder(contentBlock),
        textNode = generateAnnotItemBodyTextNode({ showPlaceholder })

  if (!showPlaceholder)
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


// const generateBulletListBlock = ( contentBlock: ContentBlock ) => {
//   for (const { content: listItemContent } of contentBlock.content) {
//     console.log(listItemContent)
//   }

//   const testNode = figma.createFrame()
//   return testNode
// }


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


const _showPlaceholder = ( contentBlock: ContentBlock ) => {
  const onlyOneTextPartInsideBlockExists = contentBlock.content.length === 1,
        textContentIsEmpty = contentBlock.content[0]?.text === ' '

  return onlyOneTextPartInsideBlockExists && textContentIsEmpty
}
