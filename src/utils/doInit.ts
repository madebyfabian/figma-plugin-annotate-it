import { 
	config, 
	getPluginData, 
	generateFontNameConfig,
	getAnnotWrapperNodes, 
	setPluginData
} from '@/utils/utils'


export default async () => {
	// Load fonts to use on canvas.
	await Promise.all([
		figma.loadFontAsync(generateFontNameConfig()),
		figma.loadFontAsync(generateFontNameConfig({ isItalic: true })),
		figma.loadFontAsync(generateFontNameConfig({ isBold: true})),
		figma.loadFontAsync(generateFontNameConfig({ isBold: true, isItalic: true }))
	])

	const value = [],
				annotWrappers = getAnnotWrapperNodes()

	if (annotWrappers.length) {
		for (const wrapperNode of annotWrappers) {
			let annotData = wrapperNode.children.map(itemNode => getPluginData(itemNode, config.annotItemNodePluginDataKey)),
					pluginData = getPluginData(wrapperNode, config.annotWrapperNodePluginDataKey)

			if (!pluginData) {
				pluginData = <AnnotWrapperPluginData>{ connectedFrameId: null, connectedFrameAliasName: null }
				setPluginData(wrapperNode, config.annotWrapperNodePluginDataKey, pluginData)
			}

			value.push({ id: wrapperNode.id, pluginData, annotData })
		}
	}

	figma.ui.postMessage({ type: 'doInit', value })
}