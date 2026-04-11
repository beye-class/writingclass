import { Type } from "@google/genai";

/**
 * ⚒️ 專案架構師 v10.0 - GenAI 結構定義
 * 嚴格對應 types.ts
 */

export const OUTLINE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      desc: { type: Type.STRING },
      prototype: { type: Type.STRING, description: "符合該年級程度的例句原型" },
      calibration: { type: Type.STRING, description: "說明此段落如何符合該年級的認知標準" },
      branches: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: "分歧路徑名稱" 
      }
    },
    required: ["id", "title", "desc", "prototype", "calibration"]
  }
};

export const SLIDE_TOOLS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    visualStyle: { type: Type.STRING },
    hostDialogue: { type: Type.STRING },
    strategy: { type: Type.STRING },
    vocabList: { type: Type.ARRAY, items: { type: Type.STRING } },
    structure: { type: Type.STRING },
    synthesisFormula: { type: Type.STRING }
  },
  required: ["visualStyle", "hostDialogue", "strategy", "vocabList", "structure", "synthesisFormula"]
};

export const SLIDE_ACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    visualStyle: { type: Type.STRING },
    hostDialogue: { type: Type.STRING },
    exampleSentence: { type: Type.STRING },
    scaffolding: { type: Type.STRING },
    fullExample: { type: Type.STRING }
  },
  required: ["visualStyle", "hostDialogue", "exampleSentence", "scaffolding", "fullExample"]
};

// 獨立的 ForkPath Schema
export const FORK_PATH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    dimensions: { type: Type.ARRAY, items: { type: Type.STRING } },
    concept: { type: Type.STRING, description: "核心概念句" },
    toolsSlide: SLIDE_TOOLS_SCHEMA,
    actionSlide: SLIDE_ACTION_SCHEMA
  },
  required: ["name", "dimensions", "toolsSlide", "actionSlide"] // concept 為可選，因為有時由老師手動輸入
};

export const DRAFT_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING }, 
      focus: { type: Type.STRING }, 
      // 🚀 新增：要求 AI 在草稿階段就產出提問陣列
      questions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3個階梯式提問：1.觀察問 2.聯想問 3.核心問，需對應 actionSlide 的範文內容"
      },
      toolsSlide: SLIDE_TOOLS_SCHEMA,
      actionSlide: SLIDE_ACTION_SCHEMA,
      paths: {
        type: Type.ARRAY,
        items: FORK_PATH_SCHEMA
      },
      poemModules: {
        type: Type.OBJECT,
        properties: {
          stanzaAnalysis: { type: Type.STRING },
          imageryReplacement: { type: Type.STRING },
          sentenceSkeleton: { type: Type.STRING },
          fullImitation: { type: Type.STRING }
        }
      }
    },
    // 🚀 將 questions 加入 required 確保 AI 一定會生成
    required: ["title", "focus", "questions", "toolsSlide", "actionSlide", "paths"] // paths 必填以確保有空陣列，poemModules 可選
  }
};
