const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

// Handle requests from preload.js to fetch extensions
ipcMain.handle('get-extensions', async () => {
  const extDir = path.join(__dirname, 'extensions')
  try {
    const files = fs.readdirSync(extDir)
    // Read the text content of every file in the extensions folder
    return files.map(file => fs.readFileSync(path.join(extDir, file), 'utf8'))
  } catch (err) {
    return []
  }
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
