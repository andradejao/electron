const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron')
const path = require('node:path') // Relacionado ao preload.js

// Janela principal
const createWindow = () => {
    // nativeTheme.themeSource = 'dark'
    const win = new BrowserWindow({
        width: 800, // largura
        height: 600, // altura
        icon: './src/public/img/panda.png',
        // resizable: false, // evitar o redimensionamento
        // titleBarStyle: 'hidden', // esconder menu e título
        // autoHideMenuBar: true, // esconder menu
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Iniciar a janela com o menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}

// Janela Sobre
const aboutWindow = () => {
    const about = new BrowserWindow({
        width: 360, // largura
        height: 220, // altura
        icon: './src/public/img/panda.png',
        resizable: false, // evitar o redimensionamento
        // autoHideMenuBar: true, // esconder menu
    })

    about.loadFile('./src/views/sobre.html')
}

// Executar a aplicação de forma assíncrona
app.whenReady().then(() => {
    createWindow()
})

// Template do menu personalizado
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Exibir',
        submenu: [
            {
                label: 'Recarregar',
                role: 'reload',
            },
            {
                label: 'Ferramentas de Desenvolvedor',
                role: 'toggleDevTools',
            },
            {
                type: 'separator',
            },
            {
                label: 'Aplicar Zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir Zoom',
                role: 'zoomOut',
            },
            {
                label: 'Restaurar Zoom',
                role: 'resetZoom',
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Docs',
                accelerator: 'Alt+F1',
                click: () => shell.openExternal('https://www.electronjs.org/docs/latest/')
            },
            {
                type: 'separator'
            },
            {
                label: 'Sobre',
                accelerator: 'Alt+F1',
                click: () => aboutWindow()
            }
        ]
    }
]

// Processos 
console.log("Processo Principal")
// 1º Exemplo: de comando que só funciona no node.js
console.log(`Electron: ${process.versions.electron}`)
// 2º Exemplo: Recebimento de uma mensagem do renderer
ipcMain.on('send-message', (event, message) => {
    console.log(`Processo principal recebeu uma mensagem: ${message}`)
})
// 3º Exemplo: Recebimento do renderer de uma ação a ser executada
ipcMain.on('open-about', () => {
    aboutWindow()
})