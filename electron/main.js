// Create a new file: electron/main.js
import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

let serverProcess = null
let collectorProcess = null

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Load the frontend
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

function startBackendServices() {
  // Start the server
  serverProcess = spawn('node', ['server/index.js'], {
    cwd: path.join(__dirname, '../..'),
    stdio: 'inherit'
  })

  // Start the collector
  collectorProcess = spawn('node', ['collector/index.js'], {
    cwd: path.join(__dirname, '../..'),
    stdio: 'inherit'
  })
}

app.whenReady().then(() => {
  startBackendServices()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // Kill backend processes
  if (serverProcess) serverProcess.kill()
  if (collectorProcess) collectorProcess.kill()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  // Cleanup
  if (serverProcess) serverProcess.kill()
  if (collectorProcess) collectorProcess.kill()
})
