import sum from 'hash-sum'
import { Plugin } from "vite"
import { OutputBundle, OutputChunk } from 'rollup'

export function loadingScript({externalSrc, fileName='app', crossorigin=false, crossoriginVal=""}: 
	{externalSrc?: string; fileName?: string, crossorigin?: boolean, crossoriginVal?: string}={}): Plugin {
	return {
		name: 'vite-plugin-loading-script',
		apply: 'build',
		generateBundle(_, bundle: OutputBundle) {
      const newScript = generateLoadingScript(bundle, externalSrc, crossorigin, crossoriginVal)
			this.emitFile({
				type: 'asset',
				fileName: `${fileName}.${sum(newScript)}.js`,
				source: newScript
			});
		}
	}
}

const generateLoadingScript = (bundle: OutputBundle, externalSource?: string, crossorigin?: boolean, crossoriginVal?: string): string => {
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
				scriptCode +=	`${varName}.setAttribute('type', 'module');`
				if (crossorigin) {
					scriptCode +=	`${varName}.setAttribute('crossorigin', '${crossoriginVal}');`
				}
      } else {
        scriptCode += `const ${varName} = document.createElement('link');`
				scriptCode +=	`${varName}.setAttribute('href', '${filename}');`
				scriptCode +=	`${varName}.setAttribute('rel', 'modulepreload');`
      }
    } else if (bundle[key].type === 'asset' && bundle[key].fileName.endsWith('.css')) {
			scriptCode += `const ${varName} = document.createElement('link');`
			scriptCode +=	`${varName}.setAttribute('href', '${filename}');`
			scriptCode +=	`${varName}.setAttribute('rel', 'stylesheet');`
		} else {
			continue
		}
		scriptCode +=	`parent.appendChild(${varName});`
		counter++
	}
	scriptCode += '})()'
	return scriptCode 
}
