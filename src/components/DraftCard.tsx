import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Split, Shield, Sword, AlertCircle, Sparkles, 
  MessageSquareText, RefreshCw, Wand2, MapPin, Layers, Lightbulb, HelpCircle,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { DraftParagraph } from '../data/types';

interface DraftCardProps {
  para: DraftParagraph;
  idx: number;
  genres: string[];
  loading: boolean;
  updateParaField: (index: number, field: keyof DraftParagraph, value: any) => void;
  handleDeletePara: (index: number) => void;
  handleRegenPara: (index: number, newForkPaths: number, dimension?: string) => void;
  handleRegenFullPara: (index: number) => void;
  handleValidateSentence: (index: number, sentence: string, pIdx?: number) => void;
  handleAdjustSentence: (idx: number, direction: 'up' | 'down', pathIdx?: number) => void;
  handleGenerateForkDetails: (paraIdx: number) => void;
  handleDeleteForkPath: (paraIdx: number, pathIdx: number) => void;
  handleToggleFork: (paraIdx: number) => void;
  updateQuestions: (idx: number, qIdx: number, val: string) => void; // 🚀 新增：更新提問鏈
}

export default function DraftCard({
  para, idx, genres, loading,
  updateParaField, handleDeletePara, handleRegenPara,
  handleRegenFullPara, handleValidateSentence, handleAdjustSentence,
  handleGenerateForkDetails, handleDeleteForkPath, handleToggleFork,
  updateQuestions
}: DraftCardProps) {
  
  const validationTimer = useRef<any>(null);
  const forkValidationTimers = useRef<Record<number, any>>({});

  // 安全更新嵌套物件
  const updateNestedField = (parentField: 'toolsSlide' | 'actionSlide', childField: string, value: any) => {
    const updatedParent = { ...(para[parentField] || {}), [childField]: value };
    updateParaField(idx, parentField, updatedParent);

    if (parentField === 'actionSlide' && childField === 'exampleSentence') {
      if (validationTimer.current) clearTimeout(validationTimer.current);
      validationTimer.current = setTimeout(() => {
        handleValidateSentence(idx, value);
      }, 1500); 
    }
  };

  const updateForkPathSentence = (pIdx: number, value: string) => {
    const newPaths = [...para.paths];
    newPaths[pIdx] = { ...newPaths[pIdx], actionSlide: { ...newPaths[pIdx].actionSlide, exampleSentence: value } };
    updateParaField(idx, 'paths', newPaths);

    if (forkValidationTimers.current[pIdx]) clearTimeout(forkValidationTimers.current[pIdx]);
    forkValidationTimers.current[pIdx] = setTimeout(() => {
      handleValidateSentence(idx, value, pIdx);
    }, 1500);
  };

  return (
    <div className="editor-card bg-white rounded-[24px] p-6 shadow-md border border-[var(--border)] space-y-5">
      {/* 標題列 */}
      <div className="flex items-center gap-3 border-b border-[var(--warm)] pb-4">
        <span className="w-8 h-8 bg-[var(--brown-deep)] text-white rounded-full flex items-center justify-center text-sm font-black shadow-sm shrink-0">{idx + 1}</span>
        <input 
          value={para.title || ''} 
          onChange={(e) => updateParaField(idx, 'title', e.target.value)} 
          className="flex-1 font-black text-[var(--brown-deep)] bg-transparent border-none p-0 focus:ring-0 text-xl" 
          placeholder="輸入分鏡段落標題..." 
        />
        <div className="flex items-center gap-2">
          <button onClick={() => handleDeletePara(idx)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="刪除此段落">
            <Trash2 size={16} />
          </button>
          <button 
            onClick={() => handleToggleFork(idx)} 
            className={`p-2 rounded-xl transition-all ${para.forkEnabled ? 'bg-[var(--amber)] text-white shadow-md' : 'bg-[var(--warm)] text-[var(--brown-light)]'}`}
            title="啟動路徑分歧"
          >
            <Split size={16} />
          </button>
        </div>
      </div>

      {/* 教學重點 */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black text-[var(--brown-light)] uppercase tracking-widest flex items-center gap-1.5 ml-1">
          <Lightbulb size={12} className="text-[var(--amber)]" /> 🎯 教學重點 (Focus)
        </label>
        <textarea 
          value={para.focus || ''} 
          onChange={(e) => updateParaField(idx, 'focus', e.target.value)} 
          className="w-full text-xs font-bold text-[var(--brown-mid)] bg-[var(--warm)]/30 rounded-2xl p-4 border border-[var(--warm)] resize-none h-16 focus:ring-2 focus:ring-[var(--amber)] transition-all" 
          placeholder="本段落想要學生學會什麼？"
        />
      </div>

      {/* 🚀 新增：提問組視覺化編輯器 (TYPE_Q) */}
      <div className="bg-[var(--warm)]/20 p-4 rounded-[20px] border-2 border-dashed border-[var(--border)] space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={14} className="text-[var(--brown-mid)]" />
          <span className="text-[10px] font-black text-[var(--brown-mid)] uppercase tracking-widest">
            視覺提問鏈 (TYPE_Q Editor)
          </span>
        </div>
        <div className="space-y-2">
          {[0, 1, 2].map((qIdx) => (
            <div key={qIdx} className="flex items-start gap-2 group">
              <span className="text-[10px] font-black text-[var(--amber)] mt-2.5 opacity-50">L{qIdx+1}</span>
              <input 
                value={para.questions?.[qIdx] || ""}
                onChange={(e) => updateQuestions(idx, qIdx, e.target.value)}
                placeholder={`輸入 Level ${qIdx+1} ${qIdx === 0 ? '觀察' : qIdx === 1 ? '聯想' : '核心'}提問內容...`}
                className="flex-1 text-[11px] font-medium bg-[var(--cream)] border border-[var(--border)] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🛡️ Tools Slide 區塊 */}
      <div className="rounded-[24px] border-2 border-[var(--amber-light)] overflow-hidden shadow-sm">
        <div className="bg-[var(--amber-light)]/40 px-4 py-2.5 border-b border-[var(--amber-light)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[var(--amber)]" />
            <span className="text-[11px] font-black text-[var(--amber)] tracking-wider uppercase">Page 1: 戰術裝備 (Tools)</span>
          </div>
        </div>
        <div className="p-4 space-y-4 bg-[var(--cream)]/50">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-black text-[var(--amber)] flex items-center gap-1">🗣️ 主持人語氣 (Skin Metaphor)</label>
              <div className="flex items-center gap-1 text-[9px] text-[var(--brown-mid)] bg-[var(--amber-light)]/30 px-2 py-0.5 rounded-full">
                <Sparkles size={10} className="text-[var(--amber)]" />
                <span>專家提示：試試「像說故事一樣」、「像電影預告一樣」、「扮演溫柔的奶奶」、「像 FBI 探員一樣嚴肅」或「講得像睡前故事一樣」</span>
              </div>
            </div>
            <textarea 
              value={para.toolsSlide?.hostDialogue || ''} 
              onChange={(e) => updateNestedField('toolsSlide', 'hostDialogue', e.target.value)} 
              className="w-full text-[11px] font-medium text-[var(--brown-deep)] bg-white rounded-xl p-3 border border-[var(--amber-light)] resize-none h-14 focus:border-[var(--amber)] focus:ring-1 focus:ring-[var(--amber)] transition-all" 
              placeholder="輸入符合角色設定的教學引導..." 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[var(--brown-mid)] ml-1">🎒 詞彙補給站</label>
              <input 
                value={para.toolsSlide?.vocabList?.join(', ') || ''} 
                onChange={(e) => updateNestedField('toolsSlide', 'vocabList', e.target.value.split(',').map(s=>s.trim()))} 
                className="w-full text-[11px] font-bold text-[var(--brown-mid)] bg-white rounded-xl px-3 py-2.5 border border-[var(--warm)] focus:border-[var(--brown-light)] outline-none" 
                placeholder="詞彙1, 詞彙2..." 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[var(--brown-mid)] ml-1">🧩 核心句型骨架</label>
              <input 
                value={para.toolsSlide?.structure || ''} 
                onChange={(e) => updateNestedField('toolsSlide', 'structure', e.target.value)} 
                className="w-full text-[11px] font-bold text-[var(--brown-mid)] bg-white rounded-xl px-3 py-2.5 border border-[var(--warm)] focus:border-[var(--brown-light)] outline-none" 
                placeholder="句型 A 像 B..." 
              />
            </div>
          </div>
        </div>
      </div>

      {/* ⚔️ Action Slide 區塊 */}
      <div className="rounded-[24px] border-2 border-[var(--blue-light)] overflow-hidden shadow-sm">
        <div className="bg-[var(--blue-light)]/60 px-4 py-2.5 border-b border-[var(--blue-light)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sword size={16} className="text-[var(--blue-deep)]" />
            <span className="text-[11px] font-black text-[var(--blue-deep)] tracking-wider uppercase">Page 2: 實戰演練 (Action)</span>
          </div>
        </div>
        <div className="p-4 space-y-4 bg-white">
          <div>
            <label className="text-[10px] font-black text-[var(--amber)] flex items-center gap-1 mb-1.5">🗣️ 主持人語氣 (Skin Metaphor)</label>
            <input 
              value={para.actionSlide?.hostDialogue || ''} 
              onChange={(e) => updateNestedField('actionSlide', 'hostDialogue', e.target.value)} 
              className="w-full text-[11px] font-medium text-[var(--brown-deep)] bg-[var(--cream)] rounded-xl px-3 py-2 border border-[var(--amber-light)] focus:border-[var(--amber)] outline-none" 
              placeholder="呈現示範句時的口白..." 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-[var(--blue-deep)] flex items-center gap-1">
                🦴 寫作示範例句 <span className="text-[8px] font-normal opacity-50 ml-1">(認知校準核心)</span>
              </label>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => handleAdjustSentence(idx, 'down')} 
                  className="w-6 h-6 flex items-center justify-center bg-[var(--coral-light)] text-[var(--coral)] hover:bg-[var(--coral)] hover:text-white rounded-lg transition-all"
                  title="降階"
                >
                  <ChevronDown size={14} />
                </button>
                <button 
                  onClick={() => handleAdjustSentence(idx, 'up')} 
                  className="w-6 h-6 flex items-center justify-center bg-[var(--blue-light)] text-[var(--blue-deep)] hover:bg-[var(--blue-mid)] hover:text-white rounded-lg transition-all"
                  title="升階"
                >
                  <ChevronUp size={14} />
                </button>
              </div>
            </div>
            <textarea 
              value={para.actionSlide?.exampleSentence || ''} 
              onChange={(e) => updateNestedField('actionSlide', 'exampleSentence', e.target.value)} 
              className={`w-full text-[13px] font-bold text-[var(--blue-deep)] bg-[var(--blue-light)]/20 rounded-xl p-4 border transition-all resize-none h-16 ${para.validationHint ? 'border-red-300 ring-2 ring-red-50' : 'border-[var(--blue-light)] focus:border-[var(--blue-mid)]'}`} 
            />
            <AnimatePresence>
              {para.validationHint && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold text-red-600 leading-relaxed">{para.validationHint}</p>
                    <button onClick={() => handleAdjustSentence(idx, 'down')} className="text-[9px] bg-red-500 text-white px-2.5 py-1 rounded-full font-black hover:bg-red-600 transition-colors flex items-center gap-1">
                      <Wand2 size={10} /> 立即修正為符合年級的難度
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[var(--coral)] ml-1 flex items-center gap-1">
                🚑 寫作急救站 (Scaffolding) <span className="text-[8px] font-normal opacity-50">(降階引導)</span>
              </label>
              <textarea 
                value={para.actionSlide?.scaffolding || ''} 
                onChange={(e) => updateNestedField('actionSlide', 'scaffolding', e.target.value)} 
                className="w-full text-xs font-bold text-[var(--coral)] bg-[var(--coral-light)]/20 rounded-xl p-3 border border-[var(--coral-light)] resize-none h-14 focus:border-[var(--coral)] outline-none" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[var(--green-deep)] ml-1 flex items-center gap-1">
                📖 完整範文參考 (Reference Segment)
              </label>
              <textarea 
                value={para.actionSlide?.fullExample || ''} 
                onChange={(e) => updateParaField(idx, 'actionSlide', { ...para.actionSlide, fullExample: e.target.value })} 
                className="w-full text-xs font-medium text-[var(--brown-deep)] bg-[var(--green-light)]/20 rounded-xl p-4 border border-[var(--green-light)] resize-none h-48 focus:border-[var(--green-mid)] outline-none" 
                placeholder="此段落合併後的完整示範內容..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 核心升級：雙階工作流 (Two-Stage Workflow) 與維度選擇 */}
      {para.forkEnabled && (
        <div className="p-5 bg-[var(--warm)]/40 rounded-[28px] space-y-5 border border-[var(--border)] shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Split size={16} className="text-[var(--brown-mid)]" />
              <span className="text-[11px] font-black text-[var(--brown-mid)] uppercase tracking-wider">
                {para.status === 'confirmed' ? "✅ 分歧教學內容已產出" : "⏳ 第一步：確認分支概念"}
              </span>
            </div>
            
            {/* 動態狀態按鈕 */}
            {para.paths && para.paths.length > 0 && para.status !== 'confirmed' && (
              <button 
                onClick={() => handleGenerateForkDetails(idx)} 
                disabled={loading}
                className="px-4 py-1.5 bg-[var(--amber)] text-white rounded-full text-[10px] font-black flex items-center gap-1.5 hover:bg-[var(--brown-deep)] hover:scale-105 transition-all shadow-lg animate-pulse"
              >
                <Wand2 size={12}/> ✨ 產生詳細 Tools & Action 內容
              </button>
            )}
            {para.status === 'confirmed' && (
              <button disabled className="px-4 py-1.5 bg-[var(--green-deep)] text-white rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-sm opacity-80 cursor-not-allowed">
                <Sparkles size={12}/> ✅ 已確認內容
              </button>
            )}
          </div>

          {/* 維度選擇器 (僅在未確認前顯示) */}
          {para.status !== 'confirmed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 p-3 rounded-2xl border border-dashed border-[var(--border)]">
              {/* 水平維度：不同舉例 */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-[var(--green-deep)] flex items-center gap-1.5 ml-1">
                  <MapPin size={12} /> 水平擴展：不同舉例 (內容分流)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "不同主題/科目舉例", desc: "如：體育課 vs 音樂課" },
                    { id: "不同場景/景點舉例", desc: "如：海邊寄信 vs 高山寄信" },
                    { id: "不同對象/人物舉例", desc: "如：媽媽的愛 vs 爸爸的愛" },
                    { id: "不同天氣/季節變化", desc: "如：晴天活動 vs 雨天活動" }
                  ].map(dim => (
                    <button 
                      key={dim.id} 
                      onClick={() => handleRegenPara(idx, para.forkPaths || 2, dim.id)} 
                      className="px-3 py-2 bg-white text-[var(--green-deep)] border border-[var(--green-mid)]/30 rounded-xl text-[10px] font-bold hover:bg-[var(--green-light)] hover:shadow-sm transition-all"
                      title={dim.desc}
                    >
                      {dim.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* 垂直維度：技巧深度 */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-[var(--blue-deep)] flex items-center gap-1.5 ml-1">
                  <Layers size={12} /> 垂直擴展：技巧難度 (層次分流)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "垂直難度分流", desc: "基礎鷹架 vs 進階挑戰" },
                    { id: "五感系列", desc: "視、聽、嗅、味、觸" },
                    { id: "視角系列", desc: "切換人稱或遠近景" },
                    { id: "修辭角度", desc: "比喻、擬人、誇飾" }
                  ].map(dim => (
                    <button 
                      key={dim.id} 
                      onClick={() => handleRegenPara(idx, para.forkPaths || 2, dim.id)} 
                      className="px-3 py-2 bg-white text-[var(--blue-deep)] border border-[var(--blue-mid)]/30 rounded-xl text-[10px] font-bold hover:bg-[var(--blue-light)] hover:shadow-sm transition-all"
                      title={dim.desc}
                    >
                      {dim.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 分支路徑單獨管理區 */}
          <div className="space-y-4">
            <AnimatePresence>
              {para.paths?.map((path, pIdx) => (
                <motion.div 
                  key={pIdx} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm space-y-3 relative group"
                >
                  {/* 單獨刪除按鈕 */}
                  <button 
                    onClick={() => handleDeleteForkPath(idx, pIdx)}
                    className="absolute -top-2 -right-2 p-1.5 bg-white border border-red-100 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                  >
                    <Trash2 size={12} />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[var(--warm)] text-[var(--brown-mid)] rounded-full flex items-center justify-center text-[10px] font-black">
                      {String.fromCharCode(65 + pIdx)}
                    </span>
                    <input 
                      value={path.name} 
                      onChange={(e) => {
                        const newPaths = [...para.paths];
                        newPaths[pIdx].name = e.target.value;
                        updateParaField(idx, 'paths', newPaths);
                      }}
                      className="flex-1 font-bold text-[var(--brown-deep)] text-sm bg-transparent border-none p-0 focus:ring-0"
                      placeholder="分支名稱 (例如：海邊的風景)"
                    />
                  </div>

                  {/* 如果還沒產出詳細內容，顯示「概念編輯區」 */}
                  {para.status !== 'confirmed' ? (
                    <div className="space-y-2">
                      <p className="text-[9px] text-[var(--brown-light)] font-bold">預計寫作維度：{path.dimensions?.join(', ')}</p>
                      <textarea 
                        value={path.concept || ''}
                        onChange={(e) => {
                          const newPaths = [...para.paths];
                          newPaths[pIdx].concept = e.target.value;
                          updateParaField(idx, 'paths', newPaths);
                        }}
                        placeholder="點擊此處可手動輸入此分支的核心概念，輸入完畢後點擊上方「產生詳細內容」..."
                        className="w-full text-[11px] bg-[var(--warm)]/20 p-2 rounded-lg border border-transparent focus:border-[var(--amber)] focus:ring-1 focus:ring-[var(--amber)] h-12 transition-all outline-none"
                      />
                    </div>
                  ) : (
                    /* 產出後的詳細內容編輯區 */
                    <div className="grid grid-cols-1 gap-3 animate-in fade-in">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-[var(--brown-light)] ml-1">🎒 專屬詞彙</span>
                          <input 
                            value={path.toolsSlide.vocabList.join(', ')} 
                            onChange={(e) => {
                              const newPaths = [...para.paths];
                              newPaths[pIdx] = { ...newPaths[pIdx], toolsSlide: { ...newPaths[pIdx].toolsSlide, vocabList: e.target.value.split(',').map(s => s.trim()) } };
                              updateParaField(idx, 'paths', newPaths);
                            }}
                            className="w-full text-[10px] font-bold bg-[var(--warm)]/30 rounded-lg px-2 py-1.5 border-none outline-none" 
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-[var(--brown-light)] ml-1">🧩 專屬句型</span>
                          <input 
                            value={path.toolsSlide.structure} 
                            onChange={(e) => {
                              const newPaths = [...para.paths];
                              newPaths[pIdx] = { ...newPaths[pIdx], toolsSlide: { ...newPaths[pIdx].toolsSlide, structure: e.target.value } };
                              updateParaField(idx, 'paths', newPaths);
                            }}
                            className="w-full text-[10px] font-bold bg-[var(--warm)]/30 rounded-lg px-2 py-1.5 border-none outline-none" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[8px] font-black text-[var(--blue-deep)]">🦴 路徑示範例句</span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleAdjustSentence(idx, 'down', pIdx)}
                              className="w-5 h-5 flex items-center justify-center bg-[var(--coral-light)] text-[var(--coral)] rounded-md hover:bg-[var(--coral)] hover:text-white transition-all"
                              title="降階"
                            >
                              <ChevronDown size={10} />
                            </button>
                            <button 
                              onClick={() => handleAdjustSentence(idx, 'up', pIdx)}
                              className="w-5 h-5 flex items-center justify-center bg-[var(--blue-light)] text-[var(--blue-deep)] rounded-md hover:bg-[var(--blue-mid)] hover:text-white transition-all"
                              title="升階"
                            >
                              <ChevronUp size={10} />
                            </button>
                          </div>
                        </div>
                        <textarea 
                          value={path.actionSlide.exampleSentence} 
                          onChange={(e) => updateForkPathSentence(pIdx, e.target.value)}
                          className={`w-full text-[10px] font-bold bg-[var(--blue-light)]/20 rounded-lg p-2 border transition-all resize-none h-12 outline-none ${path.validationHint ? 'border-red-300 ring-2 ring-red-50' : 'border-transparent'}`} 
                        />
                        <AnimatePresence>
                          {path.validationHint && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 border border-red-100 rounded-lg p-2 flex items-start gap-2 mt-1">
                              <AlertCircle size={12} className="text-red-500 shrink-0 mt-0.5" />
                              <div className="flex-1 space-y-1.5">
                                <p className="text-[9px] font-bold text-red-600 leading-relaxed">{path.validationHint}</p>
                                <button onClick={() => handleAdjustSentence(idx, 'down', pIdx)} className="text-[8px] bg-red-500 text-white px-2 py-1 rounded-full font-black hover:bg-red-600 transition-colors flex items-center gap-1">
                                  <Wand2 size={8} /> 立即修正為符合年級的難度
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 詩歌模組 (保留原本邏輯) */}
      {genres.includes('詩歌仿寫') && para.poemModules && (
        <div className="p-4 bg-[var(--blue-light)]/30 rounded-[20px] border-2 border-[var(--blue-mid)] border-opacity-20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5 text-[var(--blue-deep)]">
            <Sparkles size={16} />
            <span className="text-[11px] font-black uppercase tracking-widest">已包含詩歌四模組：結構/意象/句型/仿寫</span>
          </div>
        </div>
      )}

      {/* 底部微調指令與重新生成 */}
      <div className="pt-5 border-t border-[var(--warm)] space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MessageSquareText size={16} className="text-[var(--brown-light)]" />
          </div>
          <input 
            value={para.feedback || ''} 
            onChange={(e) => updateParaField(idx, 'feedback', e.target.value)} 
            className="w-full pl-11 pr-4 py-3 text-xs font-bold bg-[var(--cream)] border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent text-[var(--brown-deep)] transition-all" 
            placeholder="針對此段落給予 AI 微調指令 (例如：例句要再更幽默一點...)" 
          />
        </div>
        <button 
          onClick={() => handleRegenFullPara(idx)} 
          disabled={loading} 
          className="w-full py-4 bg-[var(--brown-deep)] text-white rounded-[20px] text-xs font-black hover:bg-[var(--brown-mid)] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
          AI 根據指令重新構思本頁分鏡
        </button>
      </div>
    </div>
  );
}