import sum from 'hash-sum'
import { Plugin } from "vite"
import { OutputBundle, OutputChunk } from 'rollup'

export function loadingScript({externalSrc, fileName='app'}: {externalSrc?: string; fileName?: string}={}): Plugin {
	return {
		name: 'vite-plugin-loading-script',
		apply: 'build',
		generateBundle(_, bundle: OutputBundle) {
      const newScript = generateLoadingScript(bundle, externalSrc)
			this.emitFile({
				type: 'asset',
				fileName: `${fileName}.${sum(newScript)}.js`,
				source: newScript
			});
		}
	}
}

const generateLoadingScript = (bundle: OutputBundle, externalSource?: string): string => {
	let scriptCode = "(function () {let scriptTag = document.getElementsByTagName('script');scriptTag = scriptTag[scriptTag.length - 1];const parent = scriptTag.parentNode;"
	let counter = 0;
	for (const key in bundle) {
		const filename = externalSource ? externalSource + bundle[key].fileName : bundle[key].fileName
		const varName = `file${counter}`
    if (bundle[key].type === 'chunk') {
      const chunk = bundle[key] as OutputChunk
      if (chunk.isEntry) {
        scriptCode += `const ${varName} = document.createElement('script');`
				scriptCode +=	`${varName}.setAttribute('src', '${filename}');`
      } else {
        scriptCode += `const ${varName} = document.createElement('link');`
				scriptCode +=	`${varName}.setAttribute('href', '${filename}');`
				scriptCode +=	`${varName}.setAttribute('rel', 'modulepreload');`
      }
    } else if (bundle[key].type === 'asset') {
			scriptCode += `const ${varName} = document.createElement('link');`
			scriptCode +=	`${varName}.setAttribute('href', '${filename}');`
			scriptCode +=	`${varName}.setAttribute('rel', 'stylesheet');`
		}
		scriptCode +=	`parent.appendChild(${varName});`
		counter++
	}
	scriptCode += '})()'
	return scriptCode 
}
