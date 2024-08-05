const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, ipcRenderer, dialog } = require('electron')
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
let about // Resolver bug de abrir várias janelas
// Se a janela about não estiver aberta(Bug1)
const aboutWindow = () => {
    if (!about) {
        about = new BrowserWindow({
            width: 360, // largura
            height: 220, // altura
            icon: './src/public/img/panda.png',
            resizable: false, // evitar o redimensionamento
            autoHideMenuBar: true, // esconder menu
            minimizable: false,
            closable: true,
        })
    }
    about.loadFile('./src/views/sobre.html')
    // Reabrir a janela se estiver fechada (Bug1)
    about.on('closed', () => {
        about = null
    })
}

// Janela secundária
const childWindow = () => {
    // Obtém a janela pai (principal)
    const father = BrowserWindow.getFocusedWindow()
    if (father) {
        const child = new BrowserWindow({
            width: 640,
            height: 480,
            icon: './src/public/img/panda.png',
            autoHideMenuBar: true,
            resizable: false,
            parent: father, // estabelece a relação parent
            modal: true
        })
        child.loadFile('./src/views/child.html')
    }
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
                label: 'Janela Secundária',
                click: () => childWindow()
            },
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
    // enviar uma resposta ao renderizador
    event.reply('receive-message', "Hoje é dia de montar pc gamer!")
})
// 3º Exemplo: Recebimento do renderer de uma ação a ser executada
ipcMain.on('open-about', () => {
    aboutWindow()
})

// Dialogs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Caixa simples de mensagem
ipcMain.on('dialog-info', () => {
    dialog.showMessageBox({
        type: 'info',
        title: "Título da mensagem",
        message: "Mensagem",
        buttons: ['Ok']
    })
})

// Caixa de confirmação
ipcMain.on('dialog-warning', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: "Atenção!",
        message: "Confirma a exclusão deste registro?",
        buttons: ['Não', 'Sim']
    }).then((result) => {
        console.log(result)
        if (result.response === 1) {
            console.log("Registro excluído com sucesso")
        }
    })
})

// Explorador de arquivos
ipcMain.on('dialog-select', () => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then((result) => {
        console.log(result)
    })
})