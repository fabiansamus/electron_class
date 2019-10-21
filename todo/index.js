const electron = require("electron")

const { app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true } });
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(MenuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

function createAddWindow() {
    addWindow = new BrowserWindow({ width: 350, height: 200, title: 'Add New Todo', webPreferences: { nodeIntegration: true } });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
    // addWindow = null;

});

const MenuTemplate = [{
        label: 'File',
        submenu: [{
                label: 'New Todo',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Todos',
                click() {
                    mainWindow.webContents.send('todo:clear')
                }
            },
            {
                label: 'Quit',
                // accelerator:(() =>{ immediate invocation function })(),
                // 
                // trusty operator ternary expression
                accelerator: process.platform === "darwin" ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [{
            label: 'Todo'
        }]
    }
];

if (process.platform === 'darwin') {
    MenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    // production
    // development 
    // staging
    // test
    MenuTemplate.push({
        // only see this if is not on the production envioroment
        label: 'Developer!!!',
        submenu: [{
                role: 'reload'
            },
            {
                label: 'Toggle Development Tools',
                accelerator: process.platform === "darwin" ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                // reference to windows that is curently been click on
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}