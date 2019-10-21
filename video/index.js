const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain } = electron;
let mainWindow;

app.on("ready", () => {
    // console.log("app is now ready");
    mainWindow = new BrowserWindow({
        webPreferences: { nodeIntegration: true }
    });
    mainWindow.loadURL(`file:/${__dirname}/index.html`);
    // mainWindow.loadURL('https://www.opentimeclock.com/free.html');
});

ipcMain.on('video:submit', (event, path) => {

    ffmpeg.ffprobe(path, (err, metadata) => {

        mainWindow.webContents.send('video:matadata', metadata.format.duration);
    });
});