const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        title: 'Jamboree On The Air Morse Challenge',
        icon: path.join(__dirname, 'morse.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        show: false
    });

    // Load the index.html of the app
    const indexPath = path.join(__dirname, 'index.html');
    mainWindow.loadFile(indexPath);

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Create application menu
    const menu = Menu.buildFromTemplate([
        {
            label: 'Bestand',
            submenu: [
                {
                    label: 'Start Game',
                    accelerator: 'F5',
                    click: () => mainWindow.webContents.executeJavaScript('if(window.morseApp) window.morseApp.startCompetitiveGame();')
                },
                { type: 'separator' },
                {
                    label: 'Afsluiten',
                    accelerator: 'Alt+F4',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: 'Beeld',
            submenu: [
                { role: 'reload', label: 'Herlaaden' },
                { role: 'forceReload', label: 'Geforceerd herladen' },
                { role: 'toggleDevTools', label: 'Ontwikkelaarsgereedschap' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom resetten' },
                { role: 'zoomIn', label: 'Inzoomen' },
                { role: 'zoomOut', label: 'Uitzoomen' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Over',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Over WSJ Morse Programma',
                            message: 'Jamboree On The Air Morse Challenge',
                            detail: 'Versie 1.0.0\n\nOntwikkeld voor de Plusscouts PA3EFR/J\n\nhttps://qrz.pa3efr.nl/WSJ_Morse_programma/'
                        });
                    }
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);

    // Emitted when the window is closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Create window when app is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed (macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
