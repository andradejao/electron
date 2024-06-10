/**
 * Processo de renderização do index.html
 */

console.log("Processo de Renderização")

// Vinculado ao preload.js
console.log(`Electron: ${api.verElectron()}`)
api.hello()

// Função que é executada ao clicar o botão
function sobre(){
    api.openAbout()
}