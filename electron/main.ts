const path = require('path');
const { app, BrowserWindow } = require('electron');

const isDev = process.env.IS_DEV == 'true' ? true : false;

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#21222c',
        webPreferences: {
            preload: path.join(__dirname, 'preload.ts'),
            nodeIntegration: true,
            webSecurity: false
        }
    });

    // mainWindow.removeMenu();

    mainWindow.maximize();

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:8080'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    );

    if (isDev) mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on(
        'activate',
        () => BrowserWindow.getAllWindows().length === 0 && createWindow()
    );
});

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
