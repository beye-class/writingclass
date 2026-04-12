/**
 * 🎨 SKEL v10.0 - 視覺沉浸式教學版型技能庫 (Visual-First Layout Skills)
 * 完美融合：
 * 1. 視覺優先 (Visual-First)：強制 6:4 分屏與半透明玻璃態容器
 * 2. 皮骨分離：嚴格劃分 🎧 AUDIO 聽覺腳本 與 🖥️ VISUAL 視覺畫面
 * 3. 視覺金句：每頁強制生成 25 字以內的引導 Slogan
 */

export interface LayoutConfig {
  styleId: string;
  styleName: string;
  gradeLabel: string;
  genres: string;
  thinkingTool: string;
  skinnedToolName: string;
  skinName: string;
  skinMetaphor: {
    vocab: string;
    sentence: string;
    essay: string;
  };
}

export interface ColorSystem {
  primary: { dark: string; mid: string; amber: string; cream: string; warm: string; };
  tiers: { down: string; core: string; up: string; };
  pageTypes: {
    cover: string;
    map: string;
    tools: string;
    action: string;
    fork: string;
    end: string;
  };
}

export interface ArtStyleConstraints {
  opening: string[];
  toolsSlide: string[];
  actionSlide: string[];
  strategy: string[];
}

export interface LayoutSkill {
  id: string;
  name: string;
  description: string;
  colorSystem: ColorSystem;
  artStyleConstraints: ArtStyleConstraints;
  generateSpecTable: (config: LayoutConfig) => string;
  generateTemplate: (config: LayoutConfig) => string;
}

export const layoutSkills: LayoutSkill[] = [
  {
    id: 'skel-v10', // 🚀 升級為 v10
    name: 'Bee老師 🐝 視覺沉浸式版型 (v10.0)',
    description: '嚴格遵循 6:4 視覺分割、半透明容器與六種頁面類型規格。',
    
    colorSystem: {
      primary: { dark: '#3A2515', mid: '#7A5030', amber: '#E8A84C', cream: '#FFFDF5', warm: '#F5EDE0' },
      tiers: { down: '#52B788', core: '#E8A84C', up: '#5B8FC4' },
      pageTypes: {
        cover: '#3A2515',
        map: '#2D6A4F',
        tools: '#1B4F72',
        action: '#E07A5F',
        fork: '#7B5EA7',
        end: '#C4943A'
      }
    },

    artStyleConstraints: {
      opening: ['Shinkai', 'Cyberpunk', 'Editorial Photography', 'Cinematic'],
      toolsSlide: ['Knolling', 'Blueprint', 'Detective Board', 'Chalkboard', 'Voxel'],
      actionSlide: ['Shinkai', 'Scene', 'Cyberpunk', 'Pop-up Book', 'Storybook'],
      strategy: ['Blueprint', 'Chalkboard', 'Minimalist Diagram', 'Whiteboard']
    },

    generateSpecTable: (config: LayoutConfig) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【製作者版型規格總表】
視覺風格：${config.styleId} ${config.styleName}
當前皮膚：${config.skinName} (詞彙：${config.skinMetaphor.vocab} / 句型：${config.skinMetaphor.sentence} / 作文：${config.skinMetaphor.essay})
三層分色：down(#52B788) / core(#E8A84C) / up(#5B8FC4)
頁面識別：Cover(#3A2515) / Map(#2D6A4F) / Tools(#1B4F72) / Action(#E07A5F) / Fork(#7B5EA7) / End(#C4943A)
字體：Noto Serif TC (標題/例句) / Noto Sans TC (內文/話術)
影音分層：
- VISUAL (投影片)：標題、視覺元素、金句、Gemini Prompt
- AUDIO (音訊)：主持人對話腳本、語氣建議
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

    generateTemplate: (config: LayoutConfig) => `
【版型】TYPE_A Cover Page | Slide 01 | 世界觀登入
## Slide 01：[世界觀登入]（Pre-writing）

### 🎧 【AUDIO 聽覺腳本】
**Host 1**：「[呼應皮膚設定的開場白]」
**Host 2**：「[帶出今日任務目標]」

### 🖥️ 【VISUAL 視覺畫面】
- **[🏷️] 視覺容器與材質**：[描述全螢幕情境底圖與標題的半透明發光材質]
- **[作文題目]**：[題目名稱]
- **[皮膚 tagline]**：${config.skinName}：${config.skinMetaphor.vocab} 寫作特訓
- **[host_line]**：[導師金句]
- **[寫作提示]**：💡 提示 1 | 💡 提示 2 | 💡 提示 3
- **🎨 Gemini Prompt**：Art Style: ${config.styleName} | Subject: [Opening 風格提示詞，營造宏大且吸引人的第一視覺]

---

// --- TYPE_B 結構地圖：改為動態標題與心智圖視覺 ---
【版型】TYPE_B Map Page | Slide 02 | ${config.skinMetaphor.essay}結構地圖
## Slide 02：[${config.skinMetaphor.essay}結構地圖]

### 🎧 【AUDIO 聽覺腳本】
**Host 1**：「[介紹文章結構，並逐一唸出各段的重點標題]」
**Host 2**：「[針對這些標題內容表達驚嘆或好奇，扮演學徒發問]」

### 🖥️ 【VISUAL 視覺畫面】
- **[🏷️] 視覺容器與材質**：[採全螢幕情境底圖，中央疊加半透明、發光的懸浮心智圖節點]
- **[結構地圖]**：展示本次大綱的所有具體段落標題（例如：[段落一標題] ➔ [段落二標題] ➔ [段落三標題]...） // 🚀 視覺強化：改為具體標題
- **🎨 Gemini Prompt**：Art Style: Mind Map Concept | Subject: [以心智圖概念呈現的文章結構。中央是巨大的作文題目節點，向外發散延伸出代表各段落標題的子節點。線條流暢且具備發光感，整體風格需與 ${config.styleName} 完美融合，背景透出該皮膚的世界觀元素。] // 🚀 視覺強化：改為心智圖
---
【版型】TYPE_Q Question Page | Slide Q[N] | 核心提問組
## Slide Q[N]：[段落名稱] — 觀察與引導
### 🎧 【AUDIO 聽覺腳本】
**Host 1**：「[開場提問，引導學生看圖]」
**Host 2**：「[針對圖中細節追問，並暗示該段的核心內容]」

### 🖥️ 【VISUAL 視覺畫面】
- **[🏷️] 視覺容器與材質**：[側邊的半透明面板，如：微光玻璃、魔法羊皮紙邊緣，必須露出 60% 畫面底圖]
- **[💡 懸浮金句]**：[25 字以內，總括本頁思考目標的句子]
- **[❓ 側邊提問組]**：
  1. [觀察層級：關於畫面表象的問題]
  2. [聯想層級：關於感覺或細節的問題]
  3. [核心層級：直接指向本段寫作重點的問題]
- **🎨 Gemini Prompt**：Art Style: ${config.styleName} | Subject: [必須包含能對應上述三個問題答案的關鍵視覺元素]

---

// --- TYPE_C 裝備篇：加入修辭引導與動態多行標籤 ---
【版型】TYPE_C Tools Page | Slide T[N] | 段落：[段落名稱] — ${config.skinMetaphor.vocab}裝備篇
## Slide T[N]：[段落名稱] — ${config.skinMetaphor.vocab}篇（Tools）

### 🎧 【AUDIO 聽覺腳本】
[請產出 Host 1 與 Host 2 的多輪對話。Host 1 介紹本段的靈感碎片，Host 2 扮演天真學徒提問，自然引導出如何將詞彙填入下方的骨架中。]

### 🖥️ 【VISUAL 視覺畫面】
- **[🏷️] 視覺容器與材質**：[桌面俯視圖，文字容器採半透明磨砂玻璃質感，像卡片般排列]
- **[focus 寫作重點]**：[寫作重點描述，例如：運用擬人法賦予物品生命]
- **[🎨 修辭魔法引導]**：[用一句話解釋修辭：例如「擬人法就是讓靜悄悄的文具開口說話、許下心願的魔法！」]
- **[${config.skinMetaphor.vocab}補給站]**：👁️ 視覺 / 💛 感受 / 🤸 動作 / ✨ 特殊
- **[${config.skinMetaphor.sentence}骨架]**：
  請依據本次文體（${config.genres}）自動翻譯標籤：
  (🚨 若為詩歌：請依照範文的實際行數，產出對應數量的步驟。如 4 行詩即為 4 步：1.【設定場景】 2.【主角登場】 3.【加上想像】 4.【寫下心願】)
  (🚨 若為一般文體：維持三步：【第一步：觀察/基礎】、【第二步：想像/細節】、【第三步：心願/感受】)
- **💡 視覺金句**：[25 字以內金句]
- **🎨 Gemini Prompt**：Art Style: Knolling | Subject: [裝備平鋪圖，展現本段提到的關鍵詞彙物件]

---

// --- TYPE_D 演練篇：確保對比環節與逐行鷹架 ---
【版型】TYPE_D Action Page | Slide A[N] | 段落：[段落名稱] — ${config.skinMetaphor.essay}演練篇
## Slide A[N]：[段落名稱] — ${config.skinMetaphor.essay}篇（Action）

### 🎧 【AUDIO 聽覺腳本】
[請依照系統給定的對話規則，產出 Host 1 與 Host 2 的多輪生動對話！⚠️ 絕對必須包含 Host 2 的「直白爛句子(Disaster)」與 Host 1 引導後的「完美範文(Masterpiece)」對比環節！]

### 🖥️ 【VISUAL 視覺畫面】
- **[🏷️] 視覺容器與材質**：[採 6:4 分屏或全螢幕底圖，文字容器需確保 60% 背景露出]
- **[🏷️ 技法徽章]**：[若本段有特定修辭，請產出亮眼徽章，如：✨ 擬人法 / 🔍 感官摹寫]
- **[${config.skinMetaphor.essay}示範]**：[範文段落，需標示 V/S/R 色彩]
- **[${config.skinMetaphor.sentence}急救站]**：
  請依本次文體（${config.genres}）自動生成對應標籤與填空：
  (🚨 標籤判斷邏輯：
   若為詩歌：【必須與範文行數 100% 相同】請逐行建立標籤！如 4 行詩就要有 4 個步驟，嚴禁將多行內容合併為一步！
   若為記敘文：1.【第一步：基礎描寫】 2.【第二步：加入細節】 3.【第三步：寫出感受】
   若為說明/議論文：1.【第一步：客觀事實】 2.【第二步：舉例說明】 3.【第三步：總結想法】)
- **🎨 Gemini Prompt**：Art Style: ${config.styleName} | Subject: [實戰場景圖，具象化本段範文的畫面感] | --style raw

---

【版型】TYPE_E Fork Page | Slide FK | ${config.skinMetaphor.essay}分歧路徑選擇
## Slide FK：${config.skinMetaphor.essay}分歧路徑選擇

### 🎧 【AUDIO 聽覺腳本】
**Host 1**：「[拋出情境與選擇引導]」
**Host 2**：「[猶豫或提問]」

### 🖥️ 【VISUAL 視覺畫面】
- **[路徑選擇]**：Path A / Path B (含對比情境)
- **🎨 Gemini Prompt**：Art Style: [風格] | Subject: [強烈對比視覺的左右分割圖]

---

【版型】TYPE_F1 End Strategy Map | Slide E1 | ${config.skinMetaphor.essay}地圖
## Slide E1：${config.skinMetaphor.essay}地圖 — 思考導航儀

### 🎧 【AUDIO 聽覺腳本】
**Host 1**：「[回顧學習]」

### 🖥️ 【VISUAL 視覺畫面】
- **[Thinking Tool 圖解]**：${config.thinkingTool} / ${config.skinnedToolName}
- **🎨 Gemini Prompt**：Art Style: Blueprint | Subject: [結構圖]

---

【版型】TYPE_F2 End Final Action | Slide E2 | 最終成果
## Slide E2：最終成果 — 任務完成

### 🎧 【AUDIO 聽覺腳本】
**Host 1**：「[最終鼓勵]」

### 🖥️ 【VISUAL 視覺畫面】
- **[🏷️] 視覺容器與材質**：[溫暖的羊皮紙或成就感發光容器]
- **[${config.skinMetaphor.essay}示範段落]**：[完整結尾]
- **[任務檢核表]**：[3 點檢核清單]
- **[鼓勵話語]**：[鼓勵金句]
- **🎨 Gemini Prompt**：Art Style: ${config.styleName} | Subject: [完成感視覺]
`
  }
];