declare global {
  // Text Editor
  type Mark = { type: 'bold' | 'italic' | 'strike' | 'underline' }
  type Attrs = { order: number }
  type ContentBlock = {
    type: 'paragraph' | 'text' | 'hard_break' | 'bullet_list' | 'ordered_list' | 'horizontal_rule',
    content?: ContentBlock[],
    attrs?: Attrs,
    text?: string,
    marks?: Mark[]
  }

  // Annotations
  type Annotation = {
    colorThemeId: string,
    content: ContentBlock[],
    id: string,
    isDeleted: boolean,
    title: string
  }

  type AnnotWrapperPluginData = {
    connectedFrameId: string,
    connectedFrameAliasName: string
  }
}


export {
  Mark,
  Attrs,
  ContentBlock,
  Annotation,
  AnnotWrapperPluginData
}