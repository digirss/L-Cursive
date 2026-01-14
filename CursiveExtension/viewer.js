// ============================================
// L-Cursive Viewer Script - Version 2.0
// ============================================

console.log('[L-Cursive Viewer] Script loaded');
console.log('[L-Cursive Viewer] URL:', window.location.href);

// 從 URL 取得文字
function getTextFromURL() {
    try {
        var params = new URLSearchParams(window.location.search);
        var text = params.get('text');
        console.log('[L-Cursive Viewer] Raw text param exists:', !!text);
        if (text) {
            var decoded = decodeURIComponent(text);
            console.log('[L-Cursive Viewer] Decoded text length:', decoded.length);
            return decoded;
        }
    } catch (e) {
        console.error('[L-Cursive Viewer] Error parsing URL:', e);
    }
    return null;
}

// 顯示錯誤
function showError() {
    var container = document.getElementById('pageContainer');
    var errorHTML = '<div class="error-box">';
    errorHTML += '<h2>⚠️ 沒有收到文字內容</h2>';
    errorHTML += '<p>請使用以下方式來產生習字帖：</p>';
    errorHTML += '<ol>';
    errorHTML += '<li>在網頁上<strong>選取文字</strong>後，按<strong>右鍵</strong>選擇「將選取文字轉為習字帖」</li>';
    errorHTML += '<li>點擊瀏覽器工具列的<strong>插件圖示</strong>，貼上文字後按「轉換」</li>';
    errorHTML += '<li>點擊插件圖示，選擇「抓取當前網頁內容」</li>';
    errorHTML += '</ol>';
    errorHTML += '</div>';
    container.innerHTML = errorHTML;
}

// 渲染習字帖
function renderWorksheet(text) {
    console.log('[L-Cursive Viewer] Rendering worksheet');

    var container = document.getElementById('pageContainer');
    container.innerHTML = '';

    // 建立頁面
    var page = document.createElement('div');
    page.className = 'page';

    var content = document.createElement('div');
    content.className = 'content';
    content.textContent = text;

    var footer = document.createElement('div');
    footer.className = 'branding-footer';
    footer.innerHTML = 'L.egion <span>|</span> By 1PxAi';

    page.appendChild(content);
    page.appendChild(footer);
    container.appendChild(page);

    console.log('[L-Cursive Viewer] Worksheet rendered');
}

// 列印功能
function doPrint() {
    window.print();
}

// 主程式
function init() {
    console.log('[L-Cursive Viewer] Initializing...');

    // 綁定列印按鈕
    var printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', doPrint);
    }

    var text = getTextFromURL();

    if (!text || text.trim() === '') {
        console.log('[L-Cursive Viewer] No text found, showing error');
        showError();
    } else {
        console.log('[L-Cursive Viewer] Text found, rendering');
        renderWorksheet(text);
    }
}

// 頁面載入完成後執行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('[L-Cursive Viewer] Script initialization scheduled');
