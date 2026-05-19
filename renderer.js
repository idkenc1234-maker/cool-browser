const webview = document.getElementById('view')
const urlInput = document.getElementById('url-input')
const goBtn = document.getElementById('go-btn')
const backBtn = document.getElementById('back-btn')
const forwardBtn = document.getElementById('forward-btn')
const navBar = document.getElementById('nav-bar')
const dlBtn = document.getElementById('dl-btn')

const path = require('path') // 👈 Imports paths tool

// Password UI elements
const pwdPrompt = document.getElementById('password-prompt')
const savePwdBtn = document.getElementById('save-pwd-btn')
const ignorePwdBtn = document.getElementById('ignore-pwd-btn')
let pendingPassword = null;

function navigate() {
    let url = urlInput.value.trim()

    // EASTER EGG 1: Matrix Mode
    if (url.toLowerCase() === 'matrix') {
        navBar.style.backgroundColor = '#00ff00'
        navBar.style.borderBottom = '1px solid #003300'
        urlInput.style.backgroundColor = '#000000'
        urlInput.style.color = '#00ff00'
        alert('Wake up, Neo... The browser has you.')
        return;
    }

    // EASTER EGG 2: The Barrel Roll
    if (url.toLowerCase() === 'flip') {
        webview.style.transition = 'transform 2s ease-in-out'
        webview.style.transform = 'rotate(360deg)'
        setTimeout(() => { webview.style.transform = 'none' }, 2000)
        urlInput.value = webview.getURL()
        return;
    }

    // EASTER EGG 3: Duck Attack!
    if (url.toLowerCase() === 'ducks') {
        for (let i = 0; i < 20; i++) {
            const duck = document.createElement('div');
            duck.innerText = '🦆';
            duck.style.position = 'fixed';
            duck.style.fontSize = Math.random() * 30 + 20 + 'px';
            duck.style.left = Math.random() * window.innerWidth + 'px';
            duck.style.top = Math.random() * window.innerHeight + 'px';
            duck.style.zIndex = '9999';
            duck.style.pointerEvents = 'none';
            duck.style.transition = 'all 4s ease-in-out';
            document.body.appendChild(duck);
            setInterval(() => {
                duck.style.left = Math.random() * window.innerWidth + 'px';
                duck.style.top = Math.random() * window.innerHeight + 'px';
            }, 3000);
        }
        urlInput.value = webview.getURL();
        return;
    }

    // Normal navigation logic
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url
    }
    webview.loadURL(url)
}

// 📥 Fixed Download Navigation path
dlBtn.addEventListener('click', () => {
    const fullPath = 'file://' + path.join(__dirname, 'downloads.html')
    webview.loadURL(fullPath)
    urlInput.value = 'browser://downloads'
})

goBtn.addEventListener('click', navigate)
urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') navigate() })
backBtn.addEventListener('click', () => { if (webview.canGoBack()) webview.goBack() })
forwardBtn.addEventListener('click', () => { if (webview.canGoForward()) webview.goForward() })
webview.addEventListener('did-navigate', (event) => { urlInput.value = event.url })

// Password catch logic
const { ipcRenderer } = require('electron');
ipcRenderer.on('detected-password', (event, data) => {
    pendingPassword = data;
    pwdPrompt.style.display = 'block';
})

savePwdBtn.addEventListener('click', () => {
    if (pendingPassword) {
        const currentSite = new URL(webview.getURL()).hostname;
        localStorage.setItem(`pwd_${currentSite}`, JSON.stringify(pendingPassword));
        alert('Password saved locally!');
    }
    pwdPrompt.style.display = 'none';
})

ignorePwdBtn.addEventListener('click', () => {
    pwdPrompt.style.display = 'none';
    pendingPassword = null;
})
