# Installation
This plugin is built with webpack. Clone the repo, and execute

```
npm install
```
in the root folder to install all dependencies.


# Usage
Just hit 
```
npm start
```

to execute the webpack watcher. If you only want to build it once for production, just type
```
npm run build
```

to execute webpack once and build all your files.

Webpack will create a folder called `dist`, in which all plugin-related files are. So Figma only needs files from this folder.

# Use in Figma
If the plugin is built, you now can import it in Figma, just
1. Open Figma
2. Select `Plugins` in the left Sidebar
3. Click the `+`-Button right next to the Subheadline `Development`
4. On the popup, click `Click to choose a manifest.json file`
5. Now select the `manifest.json` from `dist/manifest.json`