export const config = {
  annotWrapperNodeName: 'Annotate it! – Frame',
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


/**
 * Generates a random string and returns it.
 * @param idLength The length of the id. Defaults to 16.
 */
export const randomId = ( idLength: number = 16 ) => {
  return [...Array(idLength)].map(() => Math.random().toString(32)[2]).join('')
}


/**
 * Returns a new, empty annotation item object.
 */
export const generateAnnotItemObject = ( title = '', content = null ) : Annotation => ({
  id: randomId(),
  title,
  content: content || [{ type: 'paragraph' }],
  isDeleted: false,
  colorThemeId: getUserColorThemes()[0].id
})


/**
 * Returns an array of color themes for the current user.
 */
export const getUserColorThemes = () => ([
  { name: 'Blue', color: '18A0FB', id: 'blvbk3k2fj551h0p' },
  { name: 'Red', color: 'F24822', id: '25s8afhofkgi7185' },
  { name: 'Green', color: '1BC47D', id: 'dd70jmjl2dp78sii' }
])