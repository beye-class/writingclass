import React, { useState, useMemo } from 'react';
import { Info, Presentation, Mic2, FileJson, Copy, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { skins, COMMON_REAL_SKINS } from '../data/skins'; // 🚀 引入皮膚庫

export default function PostProductionGuide() {
  // 🚀 從 Store 抓取 topic 與 skinId 來產生動態 Prompt
  const { topic, skinId } = useAppStore();
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(type);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  // ==========================================
  // 🎭 動態生成角色與語氣設定 (Dynamic Persona)
  // ==========================================
  const currentSkin = useMemo(() => {
    return Object.values(skins).flat().find(s => s.id === skinId) || COMMON_REAL_SKINS.find(s => s.id === skinId);
  }, [skinId]);

  const skinName = currentSkin?.name || '專業導師';
  const skinTone = currentSkin?.tone || '專業、清晰';
  const vocabMetaphor = currentSkin?.metaphor?.vocab || '核心詞彙';

  // 🚀 動態賦予 Host 2 的靈魂人設
  let host2Role = "The 'Curious Apprentice' coach. Asks innocent questions, tries to write but sometimes writes too plainly or literally, allowing Host 1 to refine it into a masterpiece.";
  
  if (currentSkin?.type === 'fun') {
    host2Role = "The 'Messy/Chaotic' coach. Energetic but often gives literal, exaggerated, or funny bad examples showing what happens when the technique goes wrong.";
  } else if (skinId === 'lawyer') {
    host2Role = "The 'Intern Lawyer'. Sometimes makes logical leaps or weak arguments that Host 1 has to object to and fix with strong evidence.";
  } else if (skinId === 'news_anchor') {
    host2Role = "The 'Field Reporter'. Gives raw, unpolished, and slightly panicked on-site observations that Host 1 refines into professional news copy.";
  }

  // ==========================================
  // 📜 詠唱咒語組合區
  // ==========================================
  const audioPrompt = `Strictly generate a role-play dialogue in Traditional Chinese (Taiwanese Mandarin).
CRITICAL INSTRUCTION: DO NOT SUMMARIZE.
Read the uploaded YAML file strictly. 

**The Scenario:** Two coaches teaching how to write about "${topic || '本日主題'}" using the persona of [${skinName}].
**Tone:** ${skinTone}

**Characters:**
1. **Host 1 (Lead Coach):** The "${skinName}". Professional, embodies the tone, uses metaphors like "${vocabMetaphor}".
2. **Host 2 (Co-Host):** ${host2Role}

Please generate the dialogue batch by batch to avoid cutting off.
**Task 1:** Start by generating the exact Audio Script for P1 to P3.`;

  const slidePrompt = `請讀取我剛剛上傳的 YAML 結構腳本檔案。
這份檔案包含了完整的「簡報分鏡與排版指令」，請嚴格解析 YAML 節點，依序生成完整投影片。不得跳頁或合併。

⚠️ 投影片生成最高準則：
1. 【文字逐字鎖定】：投影片畫面上的文字，必須 100% 一字不漏地複製 YAML 中 visual_layer 的內容。絕對禁止自行刪減、潤飾或翻譯。
2. 【排版強制防呆】：請嚴格遵守檔案頂部 ui_layout_protocol 定義的排版法則，並以 markdown 格式清楚標示。

因為單次字數限制，請分批產出：
👉 【任務 1】：請先精準解析並產出 P1 到 P3 的投影片內容。`;

  return (
    <div className="bg-white border border-[var(--border)] rounded-[16px] p-6 shadow-sm space-y-8">
      {/* 標頭區 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--amber)]/10 rounded-full flex items-center justify-center text-[var(--amber)]">
          <Info size={20} />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-[var(--brown-deep)]">NotebookLM 實戰詠唱指南</h2>
          <p className="text-[13px] text-[var(--brown-mid)]">請先下載 TXT 檔並上傳至 NotebookLM，再複製以下咒語使用。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 🎙️ Podcast 語音生成咒語 */}
        <div className="bg-[var(--coral-light)]/30 border border-[var(--coral)]/20 rounded-2xl p-5 relative group">
          <div className="flex items-center gap-2 text-[var(--coral)] font-bold mb-3">
            <Mic2 size={18} />
            <span>生成 Podcast 雙人對話 (Audio)</span>
          </div>
          <p className="text-xs text-[var(--brown-mid)] mb-3">強制 NotebookLM 扮演雙教練，並使用「分批生成」突破字數限制。</p>
          <pre className="bg-white p-3 rounded-lg text-[11px] text-[var(--brown-deep)] font-mono whitespace-pre-wrap border border-[var(--border)] h-40 overflow-y-auto custom-scrollbar">
            {audioPrompt}
          </pre>
          <button 
            onClick={() => copyToClipboard(audioPrompt, 'audio')}
            className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm text-[var(--brown-light)] hover:text-[var(--coral)] transition-colors border border-[var(--border)]"
            title="複製語音咒語"
          >
            {copiedScript === 'audio' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>

        {/* 🖥️ 簡報圖文生成咒語 */}
        <div className="bg-[var(--blue-light)]/50 border border-[var(--blue-mid)]/20 rounded-2xl p-5 relative group">
          <div className="flex items-center gap-2 text-[var(--blue-deep)] font-bold mb-3">
            <Presentation size={18} />
            <span>生成視覺簡報企劃 (Visual)</span>
          </div>
          <p className="text-xs text-[var(--brown-mid)] mb-3">導入「逐字鎖定」與「分批產出」策略，防止 AI 幻覺與偷工減料。</p>
          <pre className="bg-white p-3 rounded-lg text-[11px] text-[var(--brown-deep)] font-mono whitespace-pre-wrap border border-[var(--border)] h-40 overflow-y-auto custom-scrollbar">
            {slidePrompt}
          </pre>
          <button 
            onClick={() => copyToClipboard(slidePrompt, 'slide')}
            className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm text-[var(--brown-light)] hover:text-[var(--blue-deep)] transition-colors border border-[var(--border)]"
            title="複製簡報咒語"
          >
            {copiedScript === 'slide' ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* YAML 結構說明 */}
      <div className="pt-6 border-t border-dashed border-[var(--border)]">
        <div className="flex items-center gap-2 text-[var(--brown-mid)] font-bold mb-3 text-[14px]">
          <FileJson size={16} />
          <span>最新 V-MAX YAML 結構說明</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-[8px] font-mono text-[11px] text-slate-600 overflow-x-auto">
          <pre>{`notebooklm_driver:
  system_role: "..." # 渲染系統核心指令
  ui_layout_protocol: "..." # 版型對應規則
metadata:
  version: "10.0"
slides:
  - slide_number: "P1" # 絕對頁碼
    layout_type: "TYPE_A"
    audio_script: |
      Host 1：「...」
    visual_layer:
      - type: "image"
        description: "..."
      - type: "text_overlay"
        content: "..."`}</pre>
        </div>
      </div>
    </div>
  );
}