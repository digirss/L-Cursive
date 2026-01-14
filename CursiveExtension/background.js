// 建立右鍵選單的函數
function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "convertToCursive",
      title: "將選取文字轉為習字帖",
      contexts: ["selection"]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Menu creation failed:', chrome.runtime.lastError);
      } else {
        console.log('Context menu created successfully');
      }
    });
  });
}

// 安裝或更新時建立選單
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated');
  createContextMenu();
});

// Service Worker 啟動時也建立選單
chrome.runtime.onStartup.addListener(() => {
  console.log('Browser startup');
  createContextMenu();
});

// 監聽右鍵點擊事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertToCursive" && info.selectionText) {
    const selectedText = info.selectionText.trim();
    
    if (!selectedText) {
      console.log('No text selected');
      return;
    }
    
    console.log('Converting text:', selectedText.substring(0, 50) + '...');
    
    // 限制長度避免 URL 過長
    const trimmedText = selectedText.substring(0, 8000);
    const encodedText = encodeURIComponent(trimmedText);
    
    // 使用 chrome.runtime.getURL 確保正確的擴充功能 URL
    const viewerUrl = chrome.runtime.getURL('viewer.html') + '?text=' + encodedText;
    
    chrome.tabs.create({ url: viewerUrl }, (newTab) => {
      if (chrome.runtime.lastError) {
        console.error('Failed to open viewer:', chrome.runtime.lastError);
      } else {
        console.log('Viewer opened in tab:', newTab.id);
      }
    });
  }
});

// 初始化時立即創建選單
createContextMenu();
