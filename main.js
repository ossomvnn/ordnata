const { app, BrowserWindow } = require('electron');
const path = require('path');


function createWindow() {
    // Erstellt das Browser-Fenster mit den definierten Maßen und Web-Einstellungen.
    const win = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            // Lädt das preload-Skript
            preload: path.join(__dirname, 'preload.js'), 
            // Ermöglicht Node.js-APIs im Renderer (für ältere Electron-Versionen)
            nodeIntegration: true,
            // Deaktiviert die Kontextisolierung (für ältere Electron-Versionen)
            contextIsolation: false 
        }
    });

    // Lädt die Haupt-HTML-Datei.
    win.loadFile('index.html');

    // Optional: DevTools zum Debuggen öffnen
    // win.webContents.openDevTools();
}


// Wenn Electron bereit ist, wird das Fenster erstellt.
app.whenReady().then(() => {
    createWindow();

    // macOS-spezifisches Verhalten: Fenster neu erstellen, wenn das Dock-Icon geklickt wird.
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});


// Beendet die Anwendung, wenn alle Fenster geschlossen sind (außer macOS).
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
