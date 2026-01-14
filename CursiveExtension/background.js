// ============================================
// L-Cursive Extension - Background Service Worker
// Version 2.0 - Complete Rewrite
// ============================================

console.log('[L-Cursive] Background script loaded');

// 建立右鍵選單
function setupContextMenu() {
  // 先清除所有現有選單
  chrome.contextMenus.removeAll(function () {
    console.log('[L-Cursive] Cleared existing menus');

    // 建立新選單
    chrome.contextMenus.create({
      id: 'cursive-convert',
      title: '📝 將選取文字轉為習字帖',
      contexts: ['selection']
    }, function () {
      if (chrome.runtime.lastError) {
        console.error('[L-Cursive] Menu creation error:', chrome.runtime.lastError.message);
      } else {
        console.log('[L-Cursive] Context menu created successfully');
      }
    });
  });
}

// 當擴充功能安裝或更新時
chrome.runtime.onInstalled.addListener(function (details) {
  console.log('[L-Cursive] onInstalled:', details.reason);
  setupContextMenu();
});

// 當瀏覽器啟動時
chrome.runtime.onStartup.addListener(function () {
  console.log('[L-Cursive] onStartup');
  setupContextMenu();
});

// 處理右鍵選單點擊
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  console.log('[L-Cursive] Menu clicked:', info.menuItemId);

  if (info.menuItemId === 'cursive-convert') {
    var text = info.selectionText;

    if (!text || text.trim() === '') {
      console.log('[L-Cursive] No text selected');
      return;
    }

    console.log('[L-Cursive] Selected text length:', text.length);

    // 編碼文字並開啟 viewer
    var encoded = encodeURIComponent(text.substring(0, 5000));
    var url = chrome.runtime.getURL('viewer.html') + '?text=' + encoded;

    console.log('[L-Cursive] Opening viewer URL');

    chrome.tabs.create({ url: url }, function (newTab) {
      if (chrome.runtime.lastError) {
        console.error('[L-Cursive] Tab creation error:', chrome.runtime.lastError.message);
      } else {
        console.log('[L-Cursive] Viewer opened in tab:', newTab.id);
      }
    });
  }
});

// 立即設置選單（Service Worker 每次載入時）
setupContextMenu();

console.log('[L-Cursive] Background script initialization complete');
