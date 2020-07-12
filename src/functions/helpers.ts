// @ts-nocheck

import scssConfigVariables from '@/scss/_config.scss';

/**
 * Checks if the needed fonts are locally installed, and if not, they get downloaded and implemented.
 */
export const loadFonts = async () => {
  try {
    const requiredFonts = _generateRequiredWeightsArr('Inter')
    if (requiredFonts) { // If the parsing of the weights from .scss has worked 
      const fontsAvailable = requiredFonts.every(font => document.fonts.check(font) === true)
      console.log('Are the fonts available on my machine?', fontsAvailable)
      if (fontsAvailable) // If fonts are available on the machine, don't do anything.
        return 
    }

    const fontFace = await new FontFace('Inter', `url(https://rsms.me/inter/font-files/Inter-roman.var.woff2?3.13)`, { 
      style: 'normal', 
      weight: '100 900'
    }).load()
    document.fonts.add(fontFace)

    const fontFaceItalic = await new FontFace('Inter', `url(https://rsms.me/inter/font-files/Inter-italic.var.woff2?3.13)`, { 
      style: 'italic', 
      weight: '100 900'
    }).load()
    document.fonts.add(fontFaceItalic)
  } catch (err) {
    console.error(err)
  }
}


/**
 * Generates a random string and returns it.
 * @param idLength The length of the id. Defaults to 16.
 */
export const randomId = ( idLength: boolean = 16 ) => {
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


/**
 * @returns {array} Some kind of ['400 1em Roboto', '600 1em Roboto']
 */
const _generateRequiredWeightsArr = ( fontFaceName ) => {
  try {
    // First, get the list of needed font-weights from the _config.scss
    let fontWeights = scssConfigVariables['fontWeights']

    // Sass map syntax () to {}
    fontWeights = fontWeights.replace('(', '{').replace(')', '}')

    const fontWeightsObj = JSON.parse(fontWeights)

    const arr = []
    for (const fontWeight of Object.values(fontWeightsObj)) {
      arr.push(`${fontWeight} 1em ${fontFaceName}`)
    }

    return arr
  } catch (error) {
    console.error(error)
  }
}