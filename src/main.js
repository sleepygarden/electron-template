const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// URL Strings
const mainURL = 'file://' + __dirname + '/frontend/index.html';

var mainWindow;

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({ width: 800, height: 700});
    mainWindow.loadURL(mainURL);
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
