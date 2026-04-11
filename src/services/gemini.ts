import { GoogleGenAI, Type, GenerateContentResponse, ThinkingLevel, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Skin, OutlineItem, DraftParagraph, SocraticMessage, ForkPath } from "../data/types";
import { SYSTEM_PROMPT_BASE, STYLE_ENHANCERS, PROMPT_TEMPLATES, PromptFactory } from "../data/prompts";
import { OUTLINE_SCHEMA, DRAFT_SCHEMA, SLIDE_TOOLS_SCHEMA, SLIDE_ACTION_SCHEMA, FORK_PATH_SCHEMA } from "../data/schemas";

const ERROR_MESSAGE = "Bee老師目前休息中，請稍後再試。";

let currentApiKeyIndex = 0;

function getAI() {
  // 🚀 核心優化：從 localStorage 讀取多組金鑰並輪用
  let apiKeys: string[] = [];
  
  try {
    const storage = localStorage.getItem('bee-teacher-storage');
    if (storage) {
      const parsed = JSON.parse(storage);
      if (parsed.state && Array.isArray(parsed.state.apiKeys) && parsed.state.apiKeys.length > 0) {
        apiKeys = parsed.state.apiKeys;
      }
    }
  } catch (e) {
    console.error("Failed to parse bee-teacher-storage", e);
  }

  // 備案：嘗試讀取單組舊金鑰或環境變數
  if (apiKeys.length === 0) {
    const singleKey = localStorage.getItem("GEMINI_API_KEY") || process.env.GEMINI_API_KEY;
    if (singleKey) apiKeys = [singleKey];
  }

  if (apiKeys.length === 0) {
    throw new Error("API_KEY_MISSING");
  }

  // 輪用邏輯：依序選取一組金鑰 (Round-Robin)，達到負載平衡與避開配額限制
  const apiKey = apiKeys[currentApiKeyIndex % apiKeys.length];
  currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
  
  return new GoogleGenAI({ apiKey });
}

function cleanJSON(text: string): string {
  if (!text) return "[]";
  let cleaned = text.replace(/```json\s?|```/g, "").trim();
  const firstBracket = cleaned.indexOf('[');
  const firstBrace = cleaned.indexOf('{');
  
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    const lastBracket = cleaned.lastIndexOf(']');
    if (lastBracket !== -1) {
      cleaned = cleaned.substring(firstBracket, lastBracket + 1);
    }
  } else if (firstBrace !== -1) {
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      if (!cleaned.startsWith('[')) {
        cleaned = `[${cleaned}]`;
      }
    }
  }
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
  return cleaned;
}

function safeParseJSON(text: string, fallback: any = []): any {
  const cleaned = cleanJSON(text);
  try {
    return JSON.parse(cleaned);
  } catch (e: any) {
    console.error("[JSON_PARSE_ERROR]:", e.message);
    try {
      const bruteFixed = cleaned.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
      return JSON.parse(bruteFixed);
    } catch (e2) {
      return fallback;
    }
  }
}

async function callProxy(prompt: string, model: string = "gemini-2.5-flash", imageBase64?: string, responseMimeType?: string, responseSchema?: any, styleName?: string) {
  const MAX_RETRIES = 5;
  let delayMs = 3000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const ai = getAI();
      const parts: any[] = [{ text: prompt }];
      
      // ... (保留原本的圖片處理與系統指令邏輯)
      if (imageBase64) {
        const mimeTypeMatch = imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";
        const data = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
        parts.push({ inlineData: { mimeType, data } });
      }

      let finalSystemPrompt = SYSTEM_PROMPT_BASE;
      if (styleName && STYLE_ENHANCERS[styleName]) {
        finalSystemPrompt += `\n\n# 風格強化指令 (${styleName})：\n${STYLE_ENHANCERS[styleName]}`;
      }
      
      const response = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts }],
        config: {
          systemInstruction: finalSystemPrompt,
          responseMimeType: responseMimeType || undefined,
          responseSchema: responseSchema || undefined,
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT" as any, threshold: "BLOCK_NONE" as any },
            { category: "HARM_CATEGORY_HATE_SPEECH" as any, threshold: "BLOCK_NONE" as any },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT" as any, threshold: "BLOCK_NONE" as any },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT" as any, threshold: "BLOCK_NONE" as any }
          ]
        }
      });
      return response.text || "";

    } catch (error: any) {
      if (error.message === "API_KEY_MISSING") throw new Error("請先點擊右上角設定 Gemini API Key 🔑");
      
      const errorDump = String(error?.message || '') + JSON.stringify(error, Object.getOwnPropertyNames(error));
      
      if ((errorDump.includes('503') || errorDump.includes('429') || errorDump.includes('UNAVAILABLE') || errorDump.includes('high demand')) && attempt < MAX_RETRIES) {
        
        let waitTime = delayMs;
        // 🚀 智慧雷達：抓取 Google 要求的「精確罰站時間」
        const retryMatch = errorDump.match(/retryDelay.*?(\d+)s/);
        if (retryMatch && retryMatch[1]) {
          waitTime = (parseInt(retryMatch[1], 10) + 2) * 1000; // 照 Google 說的秒數等，再多加 2 秒緩衝
        }
        
        console.warn(`[API 限制/塞車] 第 ${attempt} 次嘗試失敗，Google 要求等待 ${waitTime/1000} 秒後重試...`);
        await new Promise(r => setTimeout(r, waitTime));
        delayMs *= 1.5;
        continue;
      }
      
      console.error("[ADM_AI_FRONTEND_ERROR]:", error);
      throw new Error("Bee老師目前休息中，API 請求次數已達上限，請稍後再試。");
    }
  }
  return "";
}

export async function generateSocraticQuestion(
  topic: string, 
  genres: string[], 
  gradeLabel: string, 
  notes: string, 
  history: SocraticMessage[],
  originalPoem?: string
): Promise<string> {
  const genre = genres.join('、');
  const prompt = PromptFactory.buildSocraticPrompt(gradeLabel, topic, genre, notes, history, originalPoem);

  try {
    const text = await callProxy(prompt, "gemini-2.5-flash");
    return text.trim();
  } catch (error) {
    console.error("Socratic Question Error:", error);
    if (genres.includes('詩歌仿寫')) {
      return "既然是詩歌仿寫，您希望學生仿作哪一個核心意象，或是換成什麼樣的主題呢？";
    }
    return "關於這個題目，您最想讓學生學會哪一個寫作技巧呢？";
  }
}

export async function refineOutlineWithDialogue(
  topic: string,
  genres: string[],
  gradeLabel: string,
  notes: string,
  history: SocraticMessage[],
  thinkingTool: string,
  originalPoem?: string,
  rhetoricSkills?: string[]
): Promise<OutlineItem[]> {
  const genre = genres.join('、');
  const prompt = PromptFactory.buildRefineOutlinePrompt(topic, genre, gradeLabel, notes, history, thinkingTool, originalPoem, rhetoricSkills);

  try {
    const text = await callProxy(prompt, "gemini-2.5-flash", undefined, "application/json", OUTLINE_SCHEMA);
    return safeParseJSON(text);
  } catch (error) {
    throw error;
  }
}

export async function analyzePoemStructure(originalPoem: string): Promise<string> {
  const prompt = `你是「Bee老師」寫作教學專家，精通兒童詩歌教學。
請幫我提煉以下詩歌的「仿寫骨架」，讓國小學生可以照著這個骨架寫出自己的詩。

【🚨 最高紅色警戒：絕對禁止使用詞性標籤】
如果你的回覆中出現任何「[名詞]」、「[動詞]」、「[形容詞]」、「[副詞]」、「[方位詞]」等冰冷的文法術語，這會嚴重扼殺孩子的創意，這次任務將直接判定為失敗！

【✅ 唯一的拆解法：意象情境模塊】
請將原本的具體字詞，替換成「具有畫面感、動作感或情感的引導提示」，並統一用【】包覆。
請保留原詩的句型結構、節奏和排版，但把填空處變成引發想像的引導語。

📝 示範對比：
原句：在柔和的晨光中，小樹苗發了芽
❌ 錯誤拆解：在 [形容詞] 的 [名詞] 中，[名詞] [動詞] 了 [名詞]
✅ 正確拆解：在【設定一個有溫度或光線的自然場景】中，【主角用擬人的姿態悄悄登場，做了一個微小的動作】

現在請以「意象情境模塊」拆解以下原詩：
「${originalPoem}」

【🚨 絕對強制指令】：請直接回傳拆解後的骨架，保留原本的分段與標點符號。絕對不要包含任何其他解釋、問候或引言。`;
  
  try {
    const text = await callProxy(prompt, "gemini-2.5-flash"); // 保持您原本的 API 呼叫設定
    return text.trim();
  } catch (error) {
    throw error;
  }
}

export async function generateOutline(
  topic: string, 
  genre: string, 
  gradeLabel: string, 
  skills: string[], 
  notes: string, 
  imageBase64?: string,
  fiveSenses?: { visual: string; auditory: string; olfactoryGustatoryTactile: string },
  rhetoricSkills?: string[]
): Promise<OutlineItem[]> {
  
  // 🚀 關鍵升級：動態加入「視覺解析指令」
  const imageInstruction = imageBase64 
    ? `\n## 🖼️ 視覺解析指令 (Critical)
使用者上傳了一張參考圖片（可能是教材結構、心智圖或教案提問單）。
請你優先「扮演超級 OCR 與結構分析師」：
1. 仔細閱讀圖片中的所有文字與區塊層級。
2. 將圖片中的核心流程（如：閱讀前/中/後，或提問層次）直接轉化為大綱的段落節點 (title 與 desc)。
3. 若圖片中有明確的分支概念，請自動填入 branches 中。` 
    : '';

  const sensoryInstruction = fiveSenses && (fiveSenses.visual || fiveSenses.auditory || fiveSenses.olfactoryGustatoryTactile)
    ? `\n## 👁️👂👃 五感細節指令 (Critical)
使用者提供了以下具體的感官細節，請務必將這些細節融入大綱的「prototype (例句原型)」或「desc (教學重點)」中：
- 視覺：${fiveSenses.visual || '（未提供）'}
- 聽覺：${fiveSenses.auditory || '（未提供）'}
- 嗅覺/味覺/觸覺：${fiveSenses.olfactoryGustatoryTactile || '（未提供）'}`
    : '';

  const prompt = PromptFactory.buildOutlinePrompt(topic, genre, gradeLabel, skills, notes, imageInstruction, sensoryInstruction, rhetoricSkills);

  try {
    const text = await callProxy(prompt, "gemini-2.5-flash", imageBase64, "application/json", OUTLINE_SCHEMA);
    return safeParseJSON(text);
  } catch (error: any) { throw error; }
}

export async function generateDraft(
  topic: string, 
  genre: string, 
  gradeId: string, 
  gradeLabel: string, 
  skin: Skin, 
  outline: OutlineItem[], 
  forkPaths: number = 2, 
  preferredDimension?: string, 
  imageBase64?: string, 
  styleName?: string,
  fiveSenses?: { visual: string; auditory: string; olfactoryGustatoryTactile: string }
): Promise<DraftParagraph[]> {
  
  const outlineContext = outline && outline.length > 0 
    ? `\n## 📝 預設大綱骨架與分歧設計 (請務必嚴格遵循)\n${outline.map((it, idx) => `${idx + 1}. 【${it.title}】${it.desc} (原型: ${it.prototype}) ${it.branches && it.branches.length > 0 ? `\n   ⚠️ [強制分歧路徑設計]: 此段落必須生成 ${it.branches.length} 個 Paths，維度分別嚴格對應為：${it.branches.join('、')}` : ''}`).join('\n')}\n`
    : '';

  const sensoryContext = fiveSenses && (fiveSenses.visual || fiveSenses.auditory || fiveSenses.olfactoryGustatoryTactile)
    ? `\n## 👁️👂👃 五感細節背景 (Critical)
使用者在思考階段輸入了以下感官細節，請在生成分鏡內容（尤其是 exampleSentence 與 fullExample）時，優先將這些細節自然地融入：
- 視覺：${fiveSenses.visual || '（未提供）'}
- 聽覺：${fiveSenses.auditory || '（未提供）'}
- 嗅覺/味覺/觸覺：${fiveSenses.olfactoryGustatoryTactile || '（未提供）'}`
    : '';

  const prompt = PromptFactory.buildDraftPrompt(topic, genre, gradeLabel, skin, outlineContext, sensoryContext, gradeId, outline.length);
  
  try {
    const text = await callProxy(prompt, "gemini-2.5-flash", imageBase64, "application/json", DRAFT_SCHEMA, styleName);
    const parsedData = safeParseJSON(text);

    // ⚒️ 關鍵修正：確保每個段落的 paths 都有預設值，並計算 UI 所需的狀態
    // 若 AI 發生中斷或漏生成，強制使用 outline 補齊陣列長度
    const fullData = outline.map((targetOutline, idx) => {
      const p = parsedData[idx] || {
        title: targetOutline.title,
        focus: targetOutline.desc,
        questions: ["觀察重點是什麼？", "有什麼聯想？", "核心意義為何？"],
        toolsSlide: {
          visualStyle: "預設視覺",
          hostDialogue: "（AI 生成中斷，請點擊右上角重新生成此段落）",
          strategy: "預設策略",
          vocabList: [],
          structure: "預設結構",
          synthesisFormula: "預設公式"
        },
        actionSlide: {
          visualStyle: "預設視覺",
          hostDialogue: "（AI 生成中斷，請點擊右上角重新生成此段落）",
          exampleSentence: targetOutline.prototype || "",
          scaffolding: "預設鷹架",
          fullExample: "（AI 生成中斷，請點擊右上角重新生成此段落）"
        },
        paths: []
      };
      
      const hasBranches = targetOutline?.branches && targetOutline.branches.length > 0;
      return { 
        ...p, 
        paths: p.paths || [], // 強制補位
        forkEnabled: hasBranches || false, 
        forkPaths: hasBranches ? targetOutline.branches!.length : forkPaths 
      };
    });

    return fullData;
  } catch (error: any) { throw error; }
}

export async function regenerateForkPaths(topic: string, genre: string, gradeId: string, gradeLabel: string, skin: Skin, para: DraftParagraph, newForkPaths: number, dimension: string, feedback?: string, imageBase64?: string, styleName?: string): Promise<DraftParagraph> {
  const prompt = PromptFactory.buildRegenerateForkPrompt(topic, genre, gradeLabel, para.title, dimension, newForkPaths, feedback);
  try {
    const text = await callProxy(prompt, "gemini-2.5-flash", imageBase64, "application/json", DRAFT_SCHEMA, styleName);
    return { ...(safeParseJSON(text)[0] || para), forkEnabled: true, forkPaths: newForkPaths };
  } catch (error: any) { throw error; }
}

export async function generateSingleParagraph(topic: string, genre: string, gradeId: string, gradeLabel: string, skin: Skin, existingDrafts: DraftParagraph[], forkPaths: number = 2, imageBase64?: string, styleName?: string): Promise<DraftParagraph> {
  const prompt = PromptFactory.buildSingleParagraphPrompt(topic, genre, gradeLabel, existingDrafts.map(d => d.title));
  try {
    const text = await callProxy(prompt, "gemini-2.5-flash", imageBase64, "application/json", DRAFT_SCHEMA, styleName);
    return { ...(safeParseJSON(text)[0] || {}), forkEnabled: true, forkPaths };
  } catch (error: any) { throw error; }
}

export async function regenerateParagraph(topic: string, genre: string, gradeId: string, gradeLabel: string, skin: Skin, para: DraftParagraph, feedback: string, forkPaths: number = 2, imageBase64?: string, styleName?: string): Promise<DraftParagraph> {
  const prompt = PromptFactory.buildRegenerateParagraphPrompt(topic, genre, gradeLabel, para.title, feedback);
  try {
    const text = await callProxy(prompt, "gemini-2.5-flash", imageBase64, "application/json", DRAFT_SCHEMA, styleName);
    return { ...(safeParseJSON(text)[0] || para), forkEnabled: true, forkPaths };
  } catch (error: any) { throw error; }
}

// 🚀 新增：專屬的單句難度調整 API
export async function adjustSentenceDifficulty(sentence: string, gradeLabel: string, direction: 'up' | 'down'): Promise<string> {
  const targetDir = direction === 'up' 
    ? '往上一個年級的程度（增加修辭、動詞更精確、意象更豐富，但保持該年齡段的自然感）' 
    : '往下一個年級的程度（句型更直白、動詞更單一、更簡單易懂）';
    
  const prompt = PromptFactory.buildAdjustDifficultyPrompt(sentence, gradeLabel, targetDir);

  try {
    const text = await callProxy(prompt, "gemini-2.5-flash");
    return text.replace(/^["'「]/, '').replace(/["'」]$/, '').trim();
  } catch (error: any) {
    throw error;
  }
}

// 🚀 請替換 src/services/gemini.ts 內的 validateSentence 函式
export async function validateSentence(sentence: string, gradeLabel: string): Promise<{ isValid: boolean, hint: string, level?: string }> {
  const prompt = PromptFactory.buildValidateSentencePrompt(sentence, gradeLabel);

  try {
    const text = await callProxy(prompt, "gemini-2.5-flash", undefined, "application/json");
    const result = safeParseJSON(text, { isValid: true, hint: "", level: "appropriate" });
    const finalResult = Array.isArray(result) ? result[0] : result;
    return {
      isValid: finalResult.isValid ?? true,
      hint: finalResult.hint ?? "",
      level: finalResult.level ?? "appropriate"
    };
  } catch (error: any) {
    return { isValid: true, hint: "", level: "appropriate" };
  }
}

// 🚀 關鍵修復：對齊 prompts.ts 的 7 個參數，並加入 concept 概念句
export async function generateDetailedForkContent(
  topic: string, 
  genre: string, 
  gradeLabel: string, 
  skin: Skin, 
  paraTitle: string,
  paraFocus: string,
  paths: any[], // 這裡先用 any 避免型別衝突
  imageBase64?: string, 
  styleName?: string
): Promise<any[]> {
  // 將老師手動輸入的「核心概念句 (concept)」一併傳給 AI 參考
  const pathsInfo = paths.map((p, i) => 
    `路徑 ${String.fromCharCode(65 + i)}：${p.name}\n維度：${p.dimensions?.join('、')}\n核心概念：${p.concept || '無'}`
  ).join('\n\n');

  // 🎯 這裡正確傳入了 7 個參數！
  const prompt = PromptFactory.buildDetailedForkPrompt(topic, genre, gradeLabel, skin, paraTitle, paraFocus, pathsInfo);

  try {
    const text = await callProxy(prompt, "gemini-2.5-flash", imageBase64, "application/json", {
      type: Type.ARRAY,
      items: FORK_PATH_SCHEMA
    }, styleName);
    
    return safeParseJSON(text);
  } catch (error: any) { 
    throw error; 
  }
}

/**
 * 🚀 新增：段落銜接優化 (Transition Smoothing)
 * 檢視所有段落，在範文或對話中加入轉折詞，使邏輯順暢。
 */
export async function smoothTransitions(
  topic: string,
  genre: string,
  gradeLabel: string,
  skin: Skin,
  drafts: DraftParagraph[],
  styleName?: string
): Promise<DraftParagraph[]> {
  const draftContext = drafts.map((p, i) => 
    `[段落 ${i+1}] 標題: ${p.title}\n教學重點: ${p.focus}\n範文: ${p.actionSlide?.fullExample}`
  ).join('\n\n');

  const prompt = PromptFactory.buildSmoothTransitionsPrompt(gradeLabel, skin.name, draftContext);

  try {
    const text = await callProxy(prompt, "gemini-2.5-flash", undefined, "application/json", DRAFT_SCHEMA, styleName);
    const smoothed = safeParseJSON(text);
    // 合併回原本的 drafts，保留沒被 AI 修改到的欄位
    return drafts.map((p, i) => ({
      ...p,
      ...(smoothed[i] || {})
    }));
  } catch (error: any) {
    throw error;
  }
}

export async function generateFullScriptStream(
  prompt: string, 
  imageBase64: string | undefined, 
  onChunk: (text: string) => void,
  styleName?: string,
  signal?: AbortSignal
): Promise<void> {
  const MAX_RETRIES = 5;
  let delayMs = 3000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (signal?.aborted) return;
      
      const ai = getAI();
      const parts: any[] = [{ text: prompt }];
      
      if (imageBase64) {
        const mimeTypeMatch = imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";
        const data = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
        parts.push({ inlineData: { mimeType, data } });
      }

      let finalSystemPrompt = SYSTEM_PROMPT_BASE;
      if (styleName && STYLE_ENHANCERS[styleName]) {
        finalSystemPrompt += `\n\n# 風格強化指令 (${styleName})：\n${STYLE_ENHANCERS[styleName]}`;
      }

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts }],
        config: {
          systemInstruction: finalSystemPrompt,
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT" as any, threshold: "BLOCK_NONE" as any },
            { category: "HARM_CATEGORY_HATE_SPEECH" as any, threshold: "BLOCK_NONE" as any },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT" as any, threshold: "BLOCK_NONE" as any },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT" as any, threshold: "BLOCK_NONE" as any }
          ]
        }
      });

      for await (const chunk of responseStream) {
        if (signal?.aborted) break;
        const text = chunk.text;
        if (text) onChunk(text);
      }
      return; 

    } catch (error: any) {
      if (error.name === 'AbortError' || signal?.aborted) return;
      
      const errorDump = String(error?.message || '') + JSON.stringify(error, Object.getOwnPropertyNames(error));
      
      const isRateLimit = 
        errorDump.includes('503') || 
        errorDump.includes('429') || 
        errorDump.includes('UNAVAILABLE') || 
        errorDump.includes('high demand');

      if (isRateLimit && attempt < MAX_RETRIES) {
        let waitTime = delayMs;
        // 🚀 智慧雷達：抓取 Google 要求的「精確罰站時間」
        const retryMatch = errorDump.match(/retryDelay.*?(\d+)s/);
        if (retryMatch && retryMatch[1]) {
          waitTime = (parseInt(retryMatch[1], 10) + 2) * 1000;
        }

        console.warn(`[伺服器超載/塞車] 第 ${attempt} 次串流嘗試失敗，強制等待 ${waitTime/1000} 秒後自動重試...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        delayMs *= 1.5; 
        continue;
      }

      if (error.message === "API_KEY_MISSING") throw new Error("請先點擊右上角設定 Gemini API Key 🔑");
      console.error("[ADM_AI_STREAM_ERROR]:", error);
      throw new Error(`生成中斷。API 免費額度已達單分鐘上限 (429)，請稍等一分鐘後再試。`);
    }
  }
}
