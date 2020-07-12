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
 * Re-sorts the given array based on a drop-event.
 * @param arr The original array.
 * @param dropResult The data of the new Result.
 * @returns The new, correctly sorted array.
 */
export const onDrop = ( arr, dropResult ) => {
  const { removedIndex, addedIndex, payload } = dropResult
  if (removedIndex === null && addedIndex === null)
    return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null)
    itemToAdd = result.splice(removedIndex, 1)[0]

  if (addedIndex !== null)
    result.splice(addedIndex, 0, itemToAdd)
  
  return result
}


/**
 * Returns a new, empty annotation item object.
 * @param title
 * @param rawMarkdown 
 */
export const generateAnnotationItem = ( title = '', rawMarkdown = '' ) => ({
  id: randomId(),
  title,
  content: { rawMarkdown, parsedMdast: null },
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