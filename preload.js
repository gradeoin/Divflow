
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  printSilent: (options) => ipcRenderer.invoke('print-silent', options),
  printReceiptSilent: (htmlContent) => ipcRenderer.invoke('print-receipt-silent', htmlContent),
  openKitchenKDS: () => ipcRenderer.send('open-kitchen-kds'),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close')
});
