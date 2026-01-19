// Preload script for secure context isolation
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform
});
