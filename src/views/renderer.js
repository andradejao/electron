/**
 * Processo de renderização do index.html
 */

console.log("Processo de Renderização")

// Vinculado ao preload.js
console.log(`Electron: ${api.verElectron()}`)

// Envio de uma mensagem
api.hello("Oi!")

// Recebimento de uma mensagem
api.answer((event, message) => {
    console.log(`Processo de renderização recebeu uma mensagem: ${message}`)
})

// Função que é executada ao clicar o botão
function sobre() {
    api.openAbout()
}