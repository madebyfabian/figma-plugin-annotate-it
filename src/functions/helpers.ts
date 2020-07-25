/**
 * Generates a random string and returns it.
 * @param idLength The length of the id. Defaults to 16.
 */
export const randomId = ( idLength: number = 16 ) => {
  return [...Array(idLength)].map(() => Math.random().toString(32)[2]).join('')
}


/**
 * Posts a message to the figma code.
 * @param type The type (name) of the message.
 * @param value The actual value of the message.
 */
export const postMsg = ( type: string, value: string ) => {
  parent.postMessage({ pluginMessage: { type, value }}, '*')
}


/**
 * Returns a new, empty annotation item object.
 * @param title
 * @param content 
 */
export const generateAnnotationItem = ( title = '', content = null ) : Annotation => ({
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