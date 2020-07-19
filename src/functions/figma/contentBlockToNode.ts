import { generateFontNameConfig, generateAnnotItemBodyTextNode } from '@/functions/figma/figmaHelpers'




/**
 * Parses a given Text content in JSON and returns the corresponding Figma Text Node of it.
 */
export default ( options: { contentBlock: ContentBlock, contentBlockIndex: number } ) => {
  const { contentBlock, contentBlockIndex } = options

  // // Remove all childs
  // contentNode.children.forEach(child => child.remove())

  // let i = 0
  // for (const contentBlock of options.content) {
  //   // console.log(JSON.stringify(contentBlock, null, 2))

  //   switch (contentBlock.type) {
  //     case 'paragraph':
  //       // Add all childs with the new value
  //       parseParagraphBlock(contentNode, contentBlock, i === 0)
  //       break
  //   }

  //   i++
  // }

  switch (contentBlock.type) {
    case 'paragraph':
      // Add all childs with the new value
      return parseParagraphBlock(contentBlock, contentBlockIndex === 0)
  }
}


const parseParagraphBlock = ( contentBlock: ContentBlock, isFirst: boolean ) => {
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
              { fontName, textDecoration } = getTextMarkOptions(textPart?.marks)

        textNode.setRangeFontName(start, end, fontName)
        textNode.setRangeTextDecoration(start, end, textDecoration)
      }

      totalLength += textPartContent.length
    }
    
  return textNode
}


const getTextMarkOptions = ( marks: Mark[] ) => {
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