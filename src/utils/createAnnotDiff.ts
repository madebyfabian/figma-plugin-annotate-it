import Differy from '@netilon/differify'
const differy = new Differy()


/**
 * Takes two arrays of annotations and 
 * @returns a diff of those two.
 */
export default ( newAnnots: Annotation[], oldAnnots: Annotation[] ) => {
  newAnnots = _blockContentSectionToString(newAnnots)
  oldAnnots = _blockContentSectionToString(oldAnnots)

  return differy.compare(oldAnnots, newAnnots)
}


/**
 * Takes an array of annotations
 * e.g. { title: string, content: [{ type: 'paragraph', content: object[] }, ...] }
 * and returns the same array, but all nested contents are stringified, 
 * e.g. { title: string, content: [{ type: 'paragraph', content: string }, ...] }
 */
const _blockContentSectionToString = ( annotArr ) => {
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