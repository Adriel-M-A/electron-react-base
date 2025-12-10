// setup.js
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const filesToUpdate = ['package.json', 'electron-builder.yml', 'src/renderer/index.html']

rl.question('¿Cuál es el nombre de tu nuevo proyecto (ej. super-notas)? ', (appName) => {
  rl.question('¿Cuál es el App ID (ej. com.adriel.notas)? ', (appId) => {
    rl.question('¿Título de la ventana (Product Name)? ', (productName) => {
      console.log('\nActualizando archivos...')

      // 1. Actualizar package.json
      updateFile('package.json', (content) => {
        const json = JSON.parse(content)
        json.name = appName
        json.description = `Application ${productName}`
        json.version = '0.0.1'
        return JSON.stringify(json, null, 2)
      })

      // 2. Actualizar electron-builder.yml
      updateFile('electron-builder.yml', (content) => {
        let newContent = content.replace(/appId: .*/g, `appId: ${appId}`)
        newContent = newContent.replace(/productName: .*/g, `productName: ${productName}`)
        newContent = newContent.replace(/executableName: .*/g, `executableName: ${appName}`)
        return newContent
      })

      // 3. Actualizar HTML Title
      updateFile('src/renderer/index.html', (content) => {
        return content.replace(/<title>.*<\/title>/, `<title>${productName}</title>`)
      })

      console.log('\n¡Listo! Tu proyecto ha sido configurado.')
      console.log('Ahora puedes borrar este archivo: rm setup.js')
      rl.close()
    })
  })
})

function updateFile(filePath, processContent) {
  const fullPath = path.join(__dirname, filePath)
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8')
    const newContent = processContent(content)
    fs.writeFileSync(fullPath, newContent)
    console.log(`✅ ${filePath} actualizado.`)
  } else {
    console.log(`❌ No se encontró ${filePath}`)
  }
}
