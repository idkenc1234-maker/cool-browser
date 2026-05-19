const tabsBar = document.getElementById('tabs-bar');
const newTabBtn = document.getElementById('new-tab-btn');
const webviewContainer = document.getElementById('webview-container');
const urlInput = document.getElementById('url-input');
const goBtn = document.getElementById('go-btn');
const bookmarkBtn = document.getElementById('bookmark-btn');
const bookmarksBar = document.getElementById('bookmarks-bar');

let tabs = [];
let activeTabId = null;

// --- TAB SYSTEM LOGIC ---
function createTab(url = 'https://www.google.com') {
  const tabId = 'tab-' + Date.now();

  const tabButton = document.createElement('button');
  tabButton.id = 'btn-' + tabId;
  tabButton.textContent = 'New Tab ';
  tabButton.style.cssText = "background: #333; color: white; border: none; padding: 5px 15px; cursor: pointer; border-radius: 3px 3px 0 0; font-size: 12px; display: flex; align-items: center; gap: 5px;";
  
  const closeBtn = document.createElement('span');
  closeBtn.textContent = '×';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(tabId);
  });
  tabButton.appendChild(closeBtn);

  const webview = document.createElement('webview');
  webview.id = 'view-' + tabId;
  webview.src = url;
  webview.style.cssText = "width: 100%; height: 100%; display: none;";
  
  webview.addEventListener('did-stop-loading', () => {
    tabButton.firstChild.textContent = webview.getTitle().substring(0, 10) + '... ';
    if (activeTabId === tabId) {
      urlInput.value = webview.getURL();
    }
  });

  tabsBar.insertBefore(tabButton, newTabBtn);
  webviewContainer.appendChild(webview);
  
  tabs.push({ id: tabId, button: tabButton, webview: webview });

  tabButton.addEventListener('click', () => switchTab(tabId));
  switchTab(tabId);
}

function switchTab(tabId) {
  tabs.forEach(tab => {
    if (tab.id === tabId) {
      tab.webview.style.display = 'flex';
      tab.button.style.background = '#444';
      urlInput.value = tab.webview.getURL();
      activeTabId = tabId;
    } else {
      tab.webview.style.display = 'none';
      tab.button.style.background = '#222';
    }
  });
}

function closeTab(tabId) {
  const tabIndex = tabs.findIndex(tab => tab.id === tabId);
  if (tabIndex === -1) return;

  tabs[tabIndex].button.remove();
  tabs[tabIndex].webview.remove();
  tabs.splice(tabIndex, 1);

  if (activeTabId === tabId && tabs.length > 0) {
    switchTab(tabs[tabs.length - 1].id);
  } else if (tabs.length === 0) {
    createTab();
  }
}

goBtn.addEventListener('click', () => {
  let url = urlInput.value.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  if (activeTab) {
    activeTab.webview.src = url;
  }
});

urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') goBtn.click();
});

newTabBtn.addEventListener('click', () => createTab());

// --- BOOKMARK SYSTEM LOGIC ---
function displayBookmarks() {
  bookmarksBar.innerHTML = '<span style="color: #aaa; font-size: 12px; margin-right: 5px;">Bookmarks:</span>';
  let bookmarks = JSON.parse(localStorage.getItem('cool-bookmarks')) || [];
  
  bookmarks.forEach((url) => {
    const btn = document.createElement('button');
    btn.textContent = url.replace('https://', '').replace('http://', '').substring(0, 15) + '...';
    btn.style.cssText = "background: #444; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;";
    
    btn.addEventListener('click', () => {
      const activeTab = tabs.find(tab => tab.id === activeTabId);
      if (activeTab) {
        activeTab.webview.src = url;
        urlInput.value = url;
      }
    });
    bookmarksBar.appendChild(btn);
  });
}

bookmarkBtn.addEventListener('click', () => {
  const currentUrl = urlInput.value.trim();
  if (currentUrl) {
    let bookmarks = JSON.parse(localStorage.getItem('cool-bookmarks')) || [];
    if (!bookmarks.includes(currentUrl)) {
      bookmarks.push(currentUrl);
      localStorage.setItem('cool-bookmarks', JSON.stringify(bookmarks));
      displayBookmarks();
    }
  }
});

// Start with one tab and load bookmarks
createTab();
displayBookmarks();
