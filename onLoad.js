const { ipcRenderer } = require('electron')

ipcRenderer.send('ready')

ipcRenderer.on('data', (event, port, location) => {
  document.getElementById('hostname').innerText = port.split('/')[0]
  document.getElementById('location').innerText = location
})

document.getElementById('close').addEventListener('click', () => window.close())