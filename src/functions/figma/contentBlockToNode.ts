import { generateFontNameConfig, generateAnnotItemBodyTextNode, generateSolidPaint } from '@/functions/figma/figmaHelpers'


/**
 * Parses a given Text content in JSON and returns the corresponding Figma Text Node of it.
 */
export default ( options: { contentBlock: ContentBlock, contentBlockIndex: number } ) => {
  const { contentBlock, contentBlockIndex } = options

  switch (contentBlock.type) {
    case 'paragraph':
      return generateParagraphBlock(contentBlock, contentBlockIndex === 0)
    
    case 'horizontal_rule':
      return generateHorizontalRuleBlock()
  }
}


const generateParagraphBlock = ( contentBlock: ContentBlock, isFirst: boolean ) => {
  const hasPlaceholder = !contentBlock.content && isFirst ? true : false,
        textNode = generateAnnotItemBodyTextNode({ hasPlaceholder })

  let totalLength = 0

  if (contentBlock.content)
    for (const textPart of contentBlock.content) {
      let textPartContent = textPart.type === 'text' 
        ? textPart.text 
        : '\u2028' // Generates a "lsep" (<br> alternative)

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