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

【版型】TYPE_B Map Page | Slide 02 | ${config.skinMetaphor.essay}結構地圖
## Slide 02：[${config.skinMetaphor.essay}結構地圖]

### 🎧 【AUDIO 聽覺腳本】
**Host 1**：「[介紹文章結構]」
**Host 2**：「[扮演學徒發問或驚嘆]」

### 🖥️ 【VISUAL 視覺畫面】
- **[結構地圖]**：開頭段 → 主體段 → 結尾段
- **🎨 Gemini Prompt**：Art Style: Blueprint | Subject: [結構圖示，如古老藏寶圖或魔法陣]

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

【版型】TYPE_C Tools Page | Slide T[N] | 段落：[段落名稱] — ${config.skinMetaphor.vocab}裝備篇
## Slide T[N]：[段落名稱] — ${config.skinMetaphor.vocab}篇（Tools）

### 🎧 【AUDIO 聽覺腳本】
**Host 1**：「[介紹裝備與詞彙]」
**Host 2**：「[補充句型結構]」

### 🖥️ 【VISUAL 視覺畫面】
- **[🏷️] 視覺容器與材質**：[桌面俯視圖，文字應像實體卡片般散落或排列]
- **[focus 寫作重點]**：[寫作重點描述]
- **[${config.skinMetaphor.vocab}補給站]**：👁️ 視覺 / 💛 感受 / 🤸 動作 / ✨ 特殊
- **[${config.skinMetaphor.sentence}骨架]**：down / core / up 三層句型
- **💡 視覺金句**：[25 字以內金句]
- **🎨 Gemini Prompt**：Art Style: Knolling | Subject: [裝備平鋪圖]

---

【版型】TYPE_D Action Page | Slide A[N] | 段落：[段落名稱] — ${config.skinMetaphor.essay}演練篇
## Slide A[N]：[段落名稱] — ${config.skinMetaphor.essay}篇（Action）

### 🎧 【AUDIO 聽覺腳本】
**Host 1**：「[引導語]」
**Host 2**：「[說出直白爛句子或嘗試改寫]」
**Host 1**：「[給予具體寫作指令並唸出完美範文]」

### 🖥️ 【VISUAL 視覺畫面】
- **[🏷️] 視覺容器與材質**：[側邊/中央的半透明閱讀視窗，完整透出後方的教學情境底圖]
- **[${config.skinMetaphor.essay}示範]**：[範文段落，需標示 V/S/R 色彩]
- **[${config.skinMetaphor.sentence}急救站]**：down / core / up 三層填空模板
- **🎨 Gemini Prompt**：Art Style: ${config.styleName} | Subject: [實戰場景圖] | --style raw

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