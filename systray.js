const { app, Menu, Tray, BrowserWindow } = require('electron')

function run() {
  let tray = null
  app.whenReady().then(() => {
    tray = new Tray('./icon.png', [32, 32])
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Item1', type: 'radio' },
      { label: 'Item2', type: 'radio' },
      { label: 'Item3', type: 'radio', checked: true },
      { label: 'Item4', type: 'radio' },
    ])
    tray.setToolTip('Posentegra')
    tray.setContextMenu(contextMenu)
  })
}
run()
