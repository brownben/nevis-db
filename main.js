const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const PouchDB = require('pouchdb')
const express = require('express')
const os = require('os')

let win
const appDataPath = app.getPath('appData') + '\\Nevis-Database\\'

function setup () {
  // Set up Database Server
  let expressApp = express()
  expressApp.use('/',
    require('express-pouchdb')(
      PouchDB.defaults({
        prefix: appDataPath + 'databases\\',
      }),
      {
        logPath: appDataPath + 'databases\\log.txt',
        configPath: appDataPath + 'databases\\config.json',
      })
  )
  expressApp.listen(5984)

  // Set up Electron
  let options = {
    width: 575,
    height: 185,
    frame: false,
    resizable: false,
    icon: './assets/NevisDBLogo.png',
    show: false,
  }
  win = new BrowserWindow(options)
  win.loadURL('file://' + path.join(__dirname, './index.html'))
  win.on('ready-to-show', () => {
    win.show()
    win.webContents.send('resize', win.getSize())
    win.focus()
  })
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', setup)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('ready', (event, arg) => {
  let networkInterfaces = os.networkInterfaces()['Wireless Network Connection']
  networkInterfaces = networkInterfaces.filter(address => address.family === 'IPv4')
  event.sender.send('data', networkInterfaces[0].cidr, appDataPath)
})