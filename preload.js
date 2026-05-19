const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', async () => {
  // 1. Password detection logic (From Prototype 1.1)
  const passwordInputs = document.querySelectorAll('input[type="password"]')
  passwordInputs.forEach(input => {
    const form = input.closest('form')
    if (form) {
      form.addEventListener('submit', () => {
        const usernameInput = form.querySelector('input[type="text"], input[type="email"]')
        const username = usernameInput ? usernameInput.value : ''
        const password = input.value
        if (password) ipcRenderer.send('detected-password', { username, password })
      })
    }
  })

  // 2. Extension Engine Logic
  // Ask main.js for the text of all extension files
  const extensions = await ipcRenderer.invoke('get-extensions')
  
  extensions.forEach(code => {
    try {
      // Create a script tag inside the website and execute the extension code
      const script = document.createElement('script')
      script.textContent = code
      document.documentElement.appendChild(script)
    } catch (err) {
      console.error("Failed to run extension:", err)
    }
  })
})
