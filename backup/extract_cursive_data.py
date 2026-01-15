#!/usr/bin/env python3
"""
提取 Hershey Script 字體數據並生成 HTML 檔案
Hershey Fonts 為公共領域 (Public Domain)
"""

import json
import urllib.request

# 下載 Hershey 字體數據
print("正在下載 Hershey 字體數據...")
url = "https://raw.githubusercontent.com/techninja/hersheytextjs/master/hersheytext.json"
with urllib.request.urlopen(url) as response:
    hershey_data = json.loads(response.read().decode('utf-8'))

# 提取 scripts 字體（真正的草寫體）
scripts_font = hershey_data['scripts']
print(f"字體名稱: {scripts_font['name']}")
print(f"字符總數: {len(scripts_font['chars'])}")

# 提取大寫和小寫字母
uppercase_letters = {}
lowercase_letters = {}

# ASCII A-Z 是 65-90，索引是 32-57 (65-33 到 90-33)
# ASCII a-z 是 97-122，索引是 64-89 (97-33 到 122-33)

for ascii_code in range(65, 91):  # A-Z
    char = chr(ascii_code)
    index = ascii_code - 33
    char_data = scripts_font['chars'][index]
    uppercase_letters[char] = {
        'path': char_data['d'],
        'width': char_data['o']
    }

for ascii_code in range(97, 123):  # a-z
    char = chr(ascii_code)
    index = ascii_code - 33
    char_data = scripts_font['chars'][index]
    lowercase_letters[char] = {
        'path': char_data['d'],
        'width': char_data['o']
    }

# 生成 JavaScript 對象字符串
def generate_js_font_data(letters, indent=12):
    lines = []
    for char, data in letters.items():
        path = data['path'].replace('\\', '\\\\').replace('"', '\\"')
        lines.append(f"{' ' * indent}'{char}': {{")
        lines.append(f"{' ' * (indent + 4)}path: \"{path}\",")
        lines.append(f"{' ' * (indent + 4)}width: {data['width']}")
        lines.append(f"{' ' * indent}}},")
    return '\n'.join(lines)

uppercase_js = generate_js_font_data(uppercase_letters)
lowercase_js = generate_js_font_data(lowercase_letters)

print("\n提取完成！正在生成 HTML 檔案...")

# 生成完整的 HTML 內容
html_content = f'''<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>英文書寫體筆順教學網</title>
    <style>
        * {{ box-sizing: border-box; }}
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            margin: 0;
        }}

        h1 {{
            color: #fff;
            margin-bottom: 20px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }}

        .card {{
            background: white;
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
            margin-bottom: 20px;
            width: 100%;
            max-width: 600px;
        }}

        .current-letter {{
            font-size: 24px;
            color: #667eea;
            margin-bottom: 15px;
            font-weight: 600;
        }}

        .keyboard-section {{
            max-width: 600px;
            width: 100%;
            background: white;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            margin-bottom: 20px;
        }}

        .keyboard-title {{
            font-size: 14px;
            color: #888;
            margin-bottom: 12px;
            text-align: left;
            font-weight: 500;
        }}

        .keyboard {{
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 6px;
        }}

        button.key-btn {{
            width: 38px;
            height: 38px;
            border: 2px solid #e0e0e0;
            background: #fff;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            color: #333;
            transition: all 0.2s ease;
            font-family: 'Georgia', serif;
        }}

        button.key-btn:hover {{
            background: #f0f4ff;
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }}

        button.key-btn.active {{
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-color: transparent;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }}

        svg#canvas {{
            border: 1px solid #eee;
            border-radius: 12px;
            background-color: #fffdf5;
            display: block;
            margin: 0 auto;
        }}

        .line-grid {{ stroke: #e8e8e8; stroke-width: 1; }}
        .line-mid {{ stroke: #c8d8ff; stroke-width: 1.5; stroke-dasharray: 8,4; }}
        .line-base {{ stroke: #ffaaaa; stroke-width: 2.5; }}

        .stroke-path {{
            fill: none;
            stroke: #2c3e50;
            stroke-width: 2.5;
            stroke-linecap: round;
            stroke-linejoin: round;
        }}

        .controls {{
            margin-top: 18px;
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }}
        
        .btn {{
            padding: 10px 24px;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }}

        .btn-replay {{
            background: linear-gradient(135deg, #ff9800, #f57c00);
        }}
        .btn-replay:hover {{ 
            background: linear-gradient(135deg, #f57c00, #e65100);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
        }}

        .btn-speed {{
            background: linear-gradient(135deg, #4CAF50, #388E3C);
        }}
        .btn-speed:hover {{
            background: linear-gradient(135deg, #388E3C, #2E7D32);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
        }}

        .info-text {{
            font-size: 13px;
            color: #888;
            margin-top: 15px;
        }}

        .footer {{
            color: rgba(255,255,255,0.7);
            font-size: 12px;
            margin-top: 20px;
            text-align: center;
        }}
        .footer a {{ color: rgba(255,255,255,0.9); }}
    </style>
</head>
<body>

    <h1>✍️ 英文書寫體筆順練習</h1>

    <div class="card">
        <div class="current-letter" id="currentLetterDisplay">Letter: A</div>
        <svg width="550" height="280" viewBox="0 0 550 280" id="canvas">
            <!-- 四線格背景 -->
            <line x1="30" y1="80" x2="520" y2="80" class="line-grid" />
            <line x1="30" y1="140" x2="520" y2="140" class="line-mid" />
            <line x1="30" y1="200" x2="520" y2="200" class="line-base" />
            <line x1="30" y1="250" x2="520" y2="250" class="line-grid" />

            <g id="letter-container">
                <!-- 筆畫路徑會被 JS 插入這裡 -->
            </g>
        </svg>

        <div class="controls">
            <button class="btn btn-replay" onclick="replayAnimation()">
                <span>↺</span> 重播筆順
            </button>
            <button class="btn btn-speed" onclick="toggleSpeed()">
                <span>⏱</span> <span id="speedLabel">速度: 正常</span>
            </button>
        </div>
        <p class="info-text">點擊下方字母開始學習筆順 · 這是真正的 Cursive 草寫體</p>
    </div>

    <div class="keyboard-section">
        <div class="keyboard-title">大寫字母 (Uppercase Cursive)</div>
        <div class="keyboard" id="keyboard-upper"></div>
    </div>

    <div class="keyboard-section">
        <div class="keyboard-title">小寫字母 (Lowercase Cursive)</div>
        <div class="keyboard" id="keyboard-lower"></div>
    </div>

    <div class="footer">
        字體數據來源：Hershey Fonts - Script 1-stroke (Public Domain, 1967)<br>
        由 Dr. A.V. Hershey 於美國海軍武器實驗室開發
    </div>

    <script>
        // ============================================================
        // Hershey Script Font Data (Public Domain)
        // Source: "Script 1-stroke" from Hershey Fonts
        // Original work by Dr. A.V. Hershey, U.S. Naval Weapons Laboratory, 1967
        // ============================================================
        
        const cursiveFontData = {{
            // === 大寫字母 ===
{uppercase_js}

            // === 小寫字母 ===
{lowercase_js}
        }};

        // 全域變數
        let currentLetter = 'A';
        let animationSpeed = 1;
        let speedIndex = 0;
        const speeds = [
            {{ value: 1, label: '正常' }},
            {{ value: 0.5, label: '慢速' }},
            {{ value: 2, label: '快速' }}
        ];

        // 初始化
        window.onload = function() {{
            createKeyboard();
            loadLetter('A');
        }};

        // 建立鍵盤按鈕
        function createKeyboard() {{
            const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const lower = "abcdefghijklmnopqrstuvwxyz";

            const upperContainer = document.getElementById('keyboard-upper');
            const lowerContainer = document.getElementById('keyboard-lower');

            upper.split('').forEach(char => {{
                upperContainer.appendChild(createBtn(char));
            }});

            lower.split('').forEach(char => {{
                lowerContainer.appendChild(createBtn(char));
            }});
        }}

        function createBtn(char) {{
            const btn = document.createElement('button');
            btn.innerText = char;
            btn.className = 'key-btn';
            btn.onclick = () => loadLetter(char);
            return btn;
        }}

        // 解析 Hershey 路徑成 SVG 路徑
        function hersheyToSVG(hersheyPath) {{
            // Hershey 格式：使用字母來表示座標 (每個字母 = ASCII - 82)
            // M = 移動到, L = 畫線到, 空格 = 抬筆
            let svgPath = '';
            const coords = hersheyPath.trim().split(' ');
            
            for (let i = 0; i < coords.length; i++) {{
                const coord = coords[i];
                if (coord.length === 0) continue;
                
                // 第一個字符是命令 (M 或 L)
                const command = coord[0];
                const rest = coord.substring(1);
                
                // 解析座標對
                const pairs = [];
                for (let j = 0; j < rest.length; j += 2) {{
                    if (j + 1 < rest.length) {{
                        const x = rest.charCodeAt(j) - 82;
                        const y = rest.charCodeAt(j + 1) - 82;
                        pairs.push([x, y]);
                    }}
                }}
                
                // 轉換成 SVG 命令
                pairs.forEach((pair, idx) => {{
                    const [x, y] = pair;
                    if (idx === 0) {{
                        svgPath += `${{command}}${{x}},${{y}} `;
                    }} else {{
                        svgPath += `L${{x}},${{y}} `;
                    }}
                }});
            }}
            
            return svgPath.trim();
        }}

        // 載入字母
        function loadLetter(char) {{
            currentLetter = char;
            
            document.getElementById('currentLetterDisplay').innerText = `Letter: ${{char}}`;

            document.querySelectorAll('.key-btn').forEach(b => b.classList.remove('active'));
            Array.from(document.querySelectorAll('.key-btn'))
                .filter(b => b.innerText === char)
                .forEach(b => b.classList.add('active'));

            const charData = cursiveFontData[char];
            const container = document.getElementById('letter-container');
            container.innerHTML = '';

            if (charData && charData.path) {{
                // Hershey 路徑直接就是 SVG path 格式
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", charData.path);
                path.setAttribute("class", "stroke-path");
                
                // 縮放並置中
                const scale = 8;  // Hershey 字體通常很小，需要放大
                const offsetX = 275 - (charData.width * scale / 2);
                const offsetY = 80;  // 對齊到頂線
                
                path.setAttribute("transform", `translate(${{offsetX}}, ${{offsetY}}) scale(${{scale}}, ${{scale}})`);
                
                container.appendChild(path);

                // 執行動畫
                animatePath(path);
            }}
        }}

        // 動畫函式
        function animatePath(path) {{
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.getBoundingClientRect();

            const baseDuration = length / 150;
            const duration = Math.max(0.5, baseDuration) / animationSpeed;

            path.style.transition = `stroke-dashoffset ${{duration}}s ease-in-out`;
            path.style.strokeDashoffset = '0';
        }}

        // 重播
        function replayAnimation() {{
            loadLetter(currentLetter);
        }}

        // 切換速度
        function toggleSpeed() {{
            speedIndex = (speedIndex + 1) % speeds.length;
            animationSpeed = speeds[speedIndex].value;
            document.getElementById('speedLabel').innerText = `速度: ${{speeds[speedIndex].label}}`;
        }}
    </script>
</body>
</html>
'''

# 寫入文件
output_file = 'cursive_learning.html'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"✅ 成功生成 {{output_file}}")
print("這個版本使用了真正的 Hershey Script 1-stroke 草寫體數據！")
