
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let kitchenWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 680,
    title: 'Restro-OS Enterprise POS — The Grand Estate',
    backgroundColor: '#0f172a',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, 'admin.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (kitchenWindow) kitchenWindow.close();
  });
}

function createKitchenWindow() {
  if (kitchenWindow) {
    kitchenWindow.focus();
    return;
  }

  kitchenWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    title: 'Kitchen Display System (KDS) — Restro-OS',
    backgroundColor: '#0b0f19',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  kitchenWindow.loadFile(path.join(__dirname, 'kitchen.html'));
  kitchenWindow.on('closed', () => {
    kitchenWindow = null;
  });
}

// IPC Hardware Handlers
ipcMain.handle('print-silent', async (event, options = {}) => {
  if (!mainWindow) return false;
  return new Promise((resolve) => {
    mainWindow.webContents.print({
      silent: true,
      printBackground: true,
      deviceName: options.deviceName || '',
      copies: options.copies || 1
    }, (success, failureReason) => {
      if (!success) console.log('Silent print error:', failureReason);
      resolve(success);
    });
  });
});

// Silent receipt printing via hidden worker window
ipcMain.handle('print-receipt-silent', async (event, htmlContent) => {
  let printWin = new BrowserWindow({
    width: 380,
    height: 600,
    show: false,
    webPreferences: { nodeIntegration: false }
  });

  printWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

  printWin.webContents.on('did-finish-load', () => {
    printWin.webContents.print({
      silent: true,
      printBackground: true
    }, (success) => {
      printWin.close();
      printWin = null;
    });
  });

  return true;
});

ipcMain.on('open-kitchen-kds', () => {
  createKitchenWindow();
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
