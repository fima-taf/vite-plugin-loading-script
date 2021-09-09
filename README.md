# vite-plugin-loading-script
Vite plugin for wrapping and loading the generated files/assets with a single script into the DOM instead of `index.html.`


## Why?
**In most cases it is recommended to run the application as a stand alone app** however there are situations in which your application needs to be 'injected' into another application. In this case the generated `index.html` is not being used and you need all the generated files/assets in the other application but Vite adding those files only into `index.html`.

It is possible to manually add all the generated files/assets into the other app but it'll take more time and can cause problems if the file names were copied incorrectly or to bundle all the code into a single js and css files (which will cause performace and loading issues).

This plugin will generate a single script that will load all the other files/assets into the DOM of any other application.  
It's basically a 'wrapping' script that uses `iife` and will add the `<script>` and `<link>` tags into any other app that Vite by default generates only into its `index.html` file.


## Installation
```
npm install vite-plugin-loading-script -D
```

## How to use?
```js
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { loadingScript } from 'vite-plugin-loading-script'

export default defineConfig({
	plugins: [vue(), loadingScript(/** options **/)]
})
```

## Options
```ts
{
  externalSrc: string, // Will prefix a url to load from.
  fileName: 'app', // app.[hash].js
  crossorigin: false, // Will add the 'crossorigin' attribute to the entry script
  crossoriginVal: string // The value to set for the 'crossorigin' attribute
}
```

## License
MIT