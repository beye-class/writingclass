/**
 * ⚒️ 專案架構師 v10.0 - 核心類型定義
 * 確保與 schemas.ts 100% 同步
 */

export interface Skin {
  id: string;
  type: 'fun' | 'real';
  icon: string;
  name: string;
  desc: string;
  target_reader: string;
  metaphor: {
    vocab: string;
    sentence: string;
    essay: string;
  };
  tone: string;
  host_style: Record<string, string>;
  vocab_naming: string;
  sentence_naming?: string;
}

export interface StyleDefinition {
  id: string;
  cat: string;
  name: string;
  en: string;
  scene: string;
  color: string;
  font: string;
  metaphor: string;
  image_prompt: string;
  text_prompt: string;
  checklist: string;
}

export interface GradeInfo {
  label: string;
  para: number;
  words: string;
  vocabCards: number;
  forkMode: string;
  rule: string;
}

export type GradeConfig = Record<string, GradeInfo>;

export interface OutlineItem { 
  id: string; 
  title: string; 
  desc: string; 
  prototype: string; 
  calibration: string; 
  branches?: string[]; 
}

export interface SlideTools {
  visualStyle: string;
  hostDialogue: string;
  strategy: string;
  vocabList: string[];
  structure: string;
  synthesisFormula: string;
}

export interface SlideAction {
  visualStyle: string;
  hostDialogue: string;
  exampleSentence: string;
  scaffolding: string;
  fullExample: string; 
}

export interface ForkPath { 
  name: string; 
  dimensions: string[]; 
  concept?: string; // 🚀 新增：核心概念句，供老師手動輸入
  toolsSlide: SlideTools;   
  actionSlide: SlideAction; 
  validationHint?: string;
  validationLevel?: 'too_simple' | 'appropriate' | 'too_difficult';
}

export interface PoemModules { 
  stanzaAnalysis: string; 
  imageryReplacement: string; 
  sentenceSkeleton: string; 
  fullImitation: string; 
}

/**
 * 段落草稿定義
 * forkEnabled/forkPaths 為前端 UI 邏輯控制
 * 其餘欄位必須與 schemas.ts 結構一致
 */
export interface DraftParagraph { 
  title: string; 
  focus: string; 
  toolsSlide: SlideTools;   
  actionSlide: SlideAction; 
  paths: ForkPath[];          // 預設為陣列，防止解析時 map 失敗
  poemModules?: PoemModules;  // 僅在詩歌仿寫時存在
  
  // 🚀 新增：提問鏈 (Questioning Chain)
  questions?: string[];       // 每一段專屬的階梯提問 (如: 觀察/聯想/核心)

  // --- 以下為 UI 運行狀態 ---
  forkEnabled?: boolean; 
  forkPaths?: number; 
  feedback?: string; 
  validationHint?: string; 
  validationLevel?: 'too_simple' | 'appropriate' | 'too_difficult';
  isForkConfirmed?: boolean; 
  
  // 🚀 新增：雙階工作流狀態 (Two-Stage Workflow)
  status?: 'concept' | 'confirmed' | 'generating'; 
}

export interface SocraticMessage {
  role: 'user' | 'ai';
  content: string;
}