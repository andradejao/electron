const { contextBridge, ipcRenderer } = require('electron')

// Gerenciamento de processos (desempenho e segurança)
contextBridge.exposeInMainWorld('api', {
    verElectron: () => process.versions.electron,
    hello: (message) => ipcRenderer.send('send-message', message),
    answer: (message) => ipcRenderer.on('receive-message', message),
    openAbout: () => ipcRenderer.send('open-about'),
    info: () => ipcRenderer.send('dialog-info'),
    warning: () => ipcRenderer.send('dialog-warning'),
    select: () => ipcRenderer.send('dialog-select')
    
})

// Inserir data na página
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-br', options)
}

// Interagir diretamente no DOM do doc HTML (index.html)
window.addEventListener('DOMContentLoaded', () => {
    const dataAtual = document.getElementById('dataAtual').innerHTML = obterData()
})