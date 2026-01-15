import os

# 定義資料夾名稱
folder_name = "CursiveExtension"

# 確保資料夾存在
if not os.path.exists(folder_name):
    os.makedirs(folder_name)

# 1. manifest.json 內容
manifest_content = """{
  "manifest_version": 3,
  "name": "英文書寫體習字帖產生器",
  "version": "1.0",
  "description": "將網頁文章、選取文字或貼上的內容轉換為英文書寫體習字帖 (PDF Ready)",
  "permissions": [
    "activeTab",
    "scripting",
    "contextMenus",
    "storage"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "製作習字帖"
  },
  "background": {
    "service_worker": "background.js"
  },
  "icons": {
    "16": "icon.png", 
    "48": "icon.png",
    "128": "icon.png"
  }
}"""

# 2. background.js 內容
background_content = """// 建立右鍵選單的函數
function createContextMenu() {
  // 先移除舊的選單（避免重複）
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "convertToCursive",
      title: "將選取文字轉為習字帖",
      contexts: ["selection"]
    });
  });
}

// 安裝或更新時建立選單
chrome.runtime.onInstalled.addListener(() => {
  createContextMenu();
});

// Service Worker 啟動時也建立選單（確保重新載入後仍然有效）
chrome.runtime.onStartup.addListener(() => {
  createContextMenu();
});

// 監聽右鍵點擊事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertToCursive" && info.selectionText) {
    chrome.storage.local.set({ 'cursiveText': info.selectionText }, () => {
      chrome.tabs.create({ url: 'viewer.html' });
    });
  }
});

// 初始化時立即創建選單（針對開發模式重新載入的情況）
createContextMenu();
"""

# 3. popup.html 內容
popup_content = """<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <style>
        body { width: 300px; padding: 15px; font-family: 'Segoe UI', sans-serif; }
        h3 { margin-top: 0; color: #333; }
        textarea { width: 100%; height: 100px; margin-bottom: 10px; box-sizing: border-box; padding: 5px; border: 1px solid #ccc; border-radius: 4px;}
        button { 
            width: 100%; padding: 10px; margin-bottom: 8px; 
            background: #4CAF50; color: white; border: none; 
            cursor: pointer; border-radius: 4px; font-size: 14px;
            transition: 0.2s;
        }
        button:hover { background: #45a049; }
        .secondary { background: #2196F3; }
        .secondary:hover { background: #0b7dda; }
    </style>
</head>
<body>
    <h3>習字帖產生器</h3>
    
    <textarea id="inputText" placeholder="在此貼上純文字..."></textarea>
    <button id="btnFromInput">轉換貼上的文字</button>
    
    <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">

    <button id="btnFromPage" class="secondary">抓取當前網頁內容</button>

    <script>
        document.getElementById('btnFromInput').addEventListener('click', () => {
            const text = document.getElementById('inputText').value;
            if(text) {
                chrome.storage.local.set({ 'cursiveText': text }, () => {
                    chrome.tabs.create({ url: 'viewer.html' });
                });
            }
        });

        document.getElementById('btnFromPage').addEventListener('click', async () => {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => document.body.innerText, 
            }, (results) => {
                if (results && results[0]) {
                    const pageText = results[0].result;
                    const cleanText = pageText.replace(/\\s+/g, ' ').substring(0, 5000); 
                    chrome.storage.local.set({ 'cursiveText': cleanText }, () => {
                        chrome.tabs.create({ url: 'viewer.html' });
                    });
                }
            });
        });
    </script>
</body>
</html>"""

# 4. viewer.html 內容
viewer_content = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>英文習字帖預覽</title>
    <link href="https://fonts.googleapis.com/css2?family=Sacramento&display=swap" rel="stylesheet">
    <style>
        :root { --line-height: 24mm; --font-size: 16mm; --text-color: #b0b0b0; }
        body { font-family: 'Segoe UI', sans-serif; background: #555; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; }
        
        .controls { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; width: 210mm; box-sizing: border-box; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);}
        .btn { background: #e74c3c; color: white; padding: 10px 20px; border: none; cursor: pointer; font-size: 16px; border-radius: 4px; font-weight: bold;}
        .btn:hover { background: #c0392b; }
        
        .page { background: white; width: 210mm; min-height: 297mm; padding: 20mm; box-sizing: border-box; position: relative; overflow: hidden; margin-bottom: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.5); }
        
        .content {
            width: 100%; height: 100%;
            font-family: 'Sacramento', cursive;
            font-size: var(--font-size); line-height: var(--line-height); color: var(--text-color);
            white-space: pre-wrap; word-break: break-word;
            background-image: 
                linear-gradient(to right, #aaccff 100%, transparent 0),
                linear-gradient(to right, #aaccff 60%, transparent 0),
                linear-gradient(to right, #ff9999 100%, transparent 0),
                linear-gradient(to right, #aaccff 100%, transparent 0);
            background-size: 100% 1px, 10px 1px, 100% 2px, 100% 1px;
            background-repeat: repeat-x;
            background-position: 0 6mm, 0 12mm, 0 18mm, 0 24mm;
            background-attachment: local;
        }

        @media print {
            @page { margin: 0; size: A4; }
            body { background: none; padding: 0; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .controls { display: none; }
            .page { margin: 0; box-shadow: none; page-break-after: always; width: 100%; }
        }
    </style>
</head>
<body>
    <div class="controls">
        <button class="btn" onclick="window.print()">🖨️ 列印 / 另存 PDF (Save as PDF)</button>
        <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">列印設定請勾選「背景圖形 (Background graphics)」</p>
    </div>
    
    <div id="pageContainer"></div>

    <script>
        chrome.storage.local.get(['cursiveText'], (result) => {
            const text = result.cursiveText || "Please select some text or paste text in the popup to generate worksheet.";
            const container = document.getElementById('pageContainer');
            
            // 簡易分頁邏輯 (每 800 字元大概分一頁，這只是粗略估算，實際依賴 CSS 自動流動)
            // 由於 CSS 設置完善，我們放入一個長頁面，瀏覽器列印時會自動切割
            const page = document.createElement('div');
            page.className = 'page';
            
            const content = document.createElement('div');
            content.className = 'content';
            content.innerText = text;
            
            page.appendChild(content);
            container.appendChild(page);
        });
    </script>
</body>
</html>"""

# 5. README.md 內容
readme_content = """# 英文書寫體習字帖產生器 (Chrome Extension)

這是一個簡單的 Chrome 擴充功能，可以將任何網頁上的英文文字，或是您貼上的純文字，瞬間轉換成標準的「英文書寫體（Cursive）」習字帖，並支援匯出成高品質 PDF 供列印練習。

## 功能介紹
1. **右鍵轉換**：選取網頁上的任何一段英文，點擊滑鼠右鍵，選擇「將選取文字轉為習字帖」。
2. **純文字轉換**：點擊瀏覽器右上角的插件圖示，貼上文字，按下轉換。
3. **整頁抓取**：點擊插件圖示，選擇「抓取當前網頁內容」，快速製作整頁習字帖。

## 安裝教學
1. 下載並解壓縮此資料夾（如果您是透過 Python 腳本生成，則已在資料夾中）。
2. 開啟 Chrome 瀏覽器，在網址列輸入 `chrome://extensions/` 並按下 Enter。
3. 開啟右上角的 **「開發者模式 (Developer mode)」** 開關（通常在右上角）。
4. 點擊左上角的 **「載入未封裝項目 (Load unpacked)」** 按鈕。
5. 選擇本資料夾 `CursiveExtension`。

## 如何列印 / 存成 PDF
1. 轉換後會開啟一個新分頁顯示習字帖。
2. 點擊頁面上的 **「🖨️ 列印 / 另存 PDF」** 按鈕。
3. 在列印視窗中：
   - **目的地**：選擇「另存為 PDF (Save as PDF)」。
   - **更多設定**：**務必勾選「背景圖形 (Background graphics)」**，否則格線會消失！
   - **邊界**：建議設為「無」或「最小」。

## 技術說明
- 使用字體：Google Fonts (Sacramento)
- 隱私權：所有轉換皆在瀏覽器本地完成，不會上傳任何數據到伺服器。
- 格式：針對 A4 紙張優化。
"""

# 將檔案寫入資料夾
files = {
    "manifest.json": manifest_content,
    "background.js": background_content,
    "popup.html": popup_content,
    "viewer.html": viewer_content,
    "README.md": readme_content
}

for filename, content in files.items():
    with open(os.path.join(folder_name, filename), "w", encoding="utf-8") as f:
        f.write(content)

print(f"成功！已建立資料夾 '{folder_name}'。")
print("請打開 Chrome -> 擴充功能 -> 載入未封裝項目，並選擇此資料夾。")
