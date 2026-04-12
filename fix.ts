import * as fs from 'fs';

let content = fs.readFileSync('src/data/prompts.ts', 'utf8');

const startMarker = 'export const PROMPT_TEMPLATES = {';
const endMarker = 'export const PromptFactory = {';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const newTemplates = `export const PROMPT_TEMPLATES = {
  gradeRules: \`
## 🛑 年級認知校準規則 (Grade Calibration Rules)
1. 嚴格遵守各年級的修辭禁令。
2. 確保例句長度與結構符合該年齡段的認知負荷。
3. 嚴禁在例句中使用非文學的「皮膚黑話」。\`,
  
  gradeSpecs: \`
## 📊 各年級教學規格參考 (Grade Specifications)
- 一年級：限感官摹寫、疊字。禁用成語、暗喻。
- 二年級：比喻限「像」句。禁用暗喻、假設複句。
- 三年級：明喻、擬人。禁用暗喻、排比。
- 四年級：誇飾、轉折複句。
- 五年級：暗喻、排比、設問。
- 六年級：借代、引用、倒裝句。\`,

  forkRules: \`
## 🔱 分歧路徑設計原則 (Forking Logic)
1. **維度絕對掛鉤 (Dimension-Driven)**：每個分歧路徑的 \\\`exampleSentence\\\` 與 \\\`fullExample\\\` 必須與該路徑的 \\\`dimensions\\\` (維度) 緊密關聯。
   - 若維度是「視覺」，則內容必須充滿色彩、光影與形狀的描寫。
   - 若維度是「聽覺」，則內容必須專注於聲音、節奏與擬聲詞。
   - 若維度是「基礎 vs 進階」，則進階版必須在修辭與意象深度上有顯著提升。
2. **實質內容切換 (Content Variation)**：每條路徑必須描寫【完全不同】的具體對象或視角。嚴禁只是微調字詞，必須具備顯著的「畫面感差異」。
3. **場景化示範**：示範例句必須具備該主題的「具象感」，讓學生一眼就能看出不同路徑的寫作特色。\`,

  poemRules: \`
## 🚨 詩歌仿寫最高鐵律：結構鏡像與自然語感 (CRITICAL POETRY RULES)
因為這是「詩歌仿寫」，絕對禁止寫成冗長、囉嗦的散文，也禁止寫出語意不通順的硬湊句子！

1. **行數與節奏鏡像 (Rhythm Mirroring)**：仿寫的行數必須與「原詩」完全相同。每一行的字數長短、停頓節奏，必須盡可能「貼齊原詩」的對應行！
   - 如果原詩第一行是短句，仿寫就必須是短句。
   - 如果原詩第三行比較長，仿寫也可以比較長。
2. **自然語感優先**：嚴禁為了字數整齊而寫出文法奇怪的句子（例如：「想寫最美字學多」）。寧可字數稍微不同，也要確保唸起來優美、通順、符合小學生的自然語氣！
3. **意象模塊法**：請用具備畫面感的「意象與情境模塊」來建構骨架。
4. ⚠️【物性邏輯防呆】：仿寫的意象必須「絕對符合」主角真實的物理特性。\`
};

`;
  
  content = content.substring(0, startIdx) + newTemplates + content.substring(endIdx);
  fs.writeFileSync('src/data/prompts.ts', content);
  console.log('Fixed PROMPT_TEMPLATES successfully');
} else {
  console.log('Could not find markers');
}
