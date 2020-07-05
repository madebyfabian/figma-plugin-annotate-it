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
 * Posts a message to the figma code.
 * @param type The type (name) of the message.
 * @param value The actual value of the message.
 */
export const postMsg = ( type: string, value: string ) => {
  parent.postMessage({ pluginMessage: { type, value }}, '*')
}


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