// ============================================
// L-Cursive Popup Script - Version 2.0
// ============================================

console.log('[L-Cursive Popup] Script loaded');

document.addEventListener('DOMContentLoaded', function () {
    var textInput = document.getElementById('textInput');
    var convertBtn = document.getElementById('convertBtn');
    var grabBtn = document.getElementById('grabBtn');
    var statusEl = document.getElementById('status');

    // 顯示狀態
    function showStatus(message, type) {
        console.log('[L-Cursive Popup] Status:', type, message);
        statusEl.textContent = message;
        statusEl.className = 'status show ' + type;
    }

    // 隱藏狀態
    function hideStatus() {
        statusEl.className = 'status';
    }

    // 開啟 viewer 頁面
    function openViewer(text) {
        if (!text || text.trim() === '') {
            showStatus('請輸入或貼上文字！', 'error');
            return;
        }

        var cleanText = text.trim().substring(0, 5000);
        var encoded = encodeURIComponent(cleanText);
        var url = chrome.runtime.getURL('viewer.html') + '?text=' + encoded;

        console.log('[L-Cursive Popup] Opening viewer, text length:', cleanText.length);

        chrome.tabs.create({ url: url }, function (tab) {
            if (chrome.runtime.lastError) {
                showStatus('開啟失敗: ' + chrome.runtime.lastError.message, 'error');
                console.error('[L-Cursive Popup] Error:', chrome.runtime.lastError);
            } else {
                console.log('[L-Cursive Popup] Viewer opened, tab:', tab.id);
                window.close();
            }
        });
    }

    // 轉換按鈕點擊
    convertBtn.addEventListener('click', function () {
        console.log('[L-Cursive Popup] Convert button clicked');
        hideStatus();
        var text = textInput.value;
        openViewer(text);
    });

    // 抓取網頁按鈕點擊
    grabBtn.addEventListener('click', function () {
        console.log('[L-Cursive Popup] Grab button clicked');
        hideStatus();
        showStatus('正在抓取網頁內容...', 'loading');

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log('[L-Cursive Popup] Current tabs:', tabs);

            if (!tabs || tabs.length === 0) {
                showStatus('找不到當前分頁', 'error');
                return;
            }

            var tab = tabs[0];
            console.log('[L-Cursive Popup] Current tab URL:', tab.url);

            // 檢查是否可以執行腳本
            if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('about:') || tab.url.startsWith('edge://')) {
                showStatus('無法在此頁面執行抓取', 'error');
                return;
            }

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: function () {
                    return document.body.innerText || document.body.textContent || '';
                }
            }, function (results) {
                console.log('[L-Cursive Popup] Script results:', results);

                if (chrome.runtime.lastError) {
                    showStatus('抓取失敗: ' + chrome.runtime.lastError.message, 'error');
                    console.error('[L-Cursive Popup] Script error:', chrome.runtime.lastError);
                    return;
                }

                if (results && results[0] && results[0].result) {
                    var pageText = results[0].result;
                    var cleanText = pageText.replace(/\s+/g, ' ').trim();

                    console.log('[L-Cursive Popup] Grabbed text length:', cleanText.length);

                    if (cleanText.length < 10) {
                        showStatus('網頁內容太少', 'error');
                        return;
                    }

                    openViewer(cleanText);
                } else {
                    showStatus('無法取得網頁內容', 'error');
                }
            });
        });
    });

    console.log('[L-Cursive Popup] Event listeners attached');
});
