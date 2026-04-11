import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Network, Plus, Trash2, RefreshCw, ChevronRight, Wand2, Bug as Bee, Layout, MessageSquare, Send, Sparkles, GripVertical, Split, X, Edit2, Check } from 'lucide-react';
import { OutlineItem, SocraticMessage } from '../data/types';
import { THINKING_TOOLS_DETAILED, SOCRATIC_SUGGESTIONS } from '../data/strategies';

interface Step2OutlineProps {
  grade: string;
  genres: string[];
  outline: OutlineItem[];
  setOutline: (outline: OutlineItem[]) => void;
  thinkingTool: string;
  setThinkingTool: (tool: string) => void;
  loading: boolean;
  handleGenerateOutline: () => void;
  handleGoNext: () => void;
  socraticHistory: SocraticMessage[];
  socraticInput: string;
  setSocraticInput: (val: string) => void;
  isSocraticLoading: boolean;
  handleSendSocratic: () => void;
  handleRefineOutline: () => void;
  handleStartSocratic: () => void;
  fiveSenses: { visual: string; auditory: string; olfactoryGustatoryTactile: string };
  setFiveSenses: (senses: { visual: string; auditory: string; olfactoryGustatoryTactile: string }) => void;
  skills: string[];
  rhetoricSkills: string[];
  toggleRhetoricSkill: (s: string) => void;
}

export default function Step2Outline({
  grade, genres, outline, setOutline, thinkingTool, setThinkingTool, loading, handleGenerateOutline, handleGoNext,
  socraticHistory, socraticInput, setSocraticInput, isSocraticLoading, handleSendSocratic, handleRefineOutline, handleStartSocratic,
  fiveSenses, setFiveSenses, skills, rhetoricSkills, toggleRhetoricSkill
}: Step2OutlineProps) {

  const [viewMode, setViewMode] = useState<'list' | 'mindmap'>('list');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // 若一進來發現沒有大綱，自動請求 AI 生成
  useEffect(() => {
    if (outline.length === 0 && !loading) {
      handleGenerateOutline();
    }
    handleStartSocratic();
  }, []);

  const updateOutline = (index: number, field: keyof OutlineItem, value: string) => {
    const next = [...outline];
    next[index] = { ...next[index], [field]: value };
    setOutline(next);
  };

  const addNode = () => {
    const newNodeId = Date.now().toString();
    setOutline([...outline, { 
      id: newNodeId, 
      title: '新段落', 
      desc: '', 
      prototype: '請輸入示範句', 
      calibration: '請輸入校準說明',
      branches: [] 
    }]);
    if (viewMode === 'mindmap') {
      setEditingNodeId(newNodeId);
    }
  };

  const removeNode = (index: number) => {
    setOutline(outline.filter((_, i) => i !== index));
  };

  const handleReorder = (newOrder: OutlineItem[]) => {
    setOutline(newOrder);
  };

  const handleReorderChildren = (newChildren: OutlineItem[]) => {
    setOutline([outline[0], ...newChildren]);
  };

  // 🚀 新增：分歧路徑 (Branches) 管理函式
  const addBranch = (pIdx: number) => {
    const next = [...outline];
    next[pIdx] = { ...next[pIdx], branches: [...(next[pIdx].branches || []), '新維度'] };
    setOutline(next);
  };

  const updateBranch = (pIdx: number, bIdx: number, val: string) => {
    const next = [...outline];
    const updatedBranches = [...(next[pIdx].branches || [])];
    updatedBranches[bIdx] = val;
    next[pIdx] = { ...next[pIdx], branches: updatedBranches };
    setOutline(next);
  };

  const removeBranch = (pIdx: number, bIdx: number) => {
    const next = [...outline];
    const updatedBranches = [...(next[pIdx].branches || [])];
    updatedBranches.splice(bIdx, 1);
    next[pIdx] = { ...next[pIdx], branches: updatedBranches };
    setOutline(next);
  };

  return (
    <motion.div 
      key="step2-outline" 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }} 
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-[var(--brown-deep)] flex items-center justify-center gap-3">
          <Network size={32} className="text-[var(--amber)]" /> 建立寫作心智圖
        </h2>
        <p className="text-[var(--brown-mid)] font-medium">在決定風格與生成細節前，我們先把文章的「骨架」搭起來。</p>
        
        <div className="flex justify-center gap-2 mt-4">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-[var(--brown-deep)] text-white' : 'bg-white text-[var(--brown-mid)] border border-[var(--border)]'}`}
          >
            清單模式
          </button>
          <button 
            onClick={() => setViewMode('mindmap')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'mindmap' ? 'bg-[var(--brown-deep)] text-white' : 'bg-white text-[var(--brown-mid)] border border-[var(--border)]'}`}
          >
            心智圖模式
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* 🚀 左側：蘇格拉底引導對話 */}
        <div className="md:col-span-4 flex flex-col h-[600px] bg-white rounded-[32px] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="p-4 bg-[var(--blue-light)] border-b border-[var(--blue-mid)] border-opacity-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--blue-deep)] rounded-full flex items-center justify-center text-white shadow-sm">
                <Bee size={16} />
              </div>
              <span className="text-sm font-black text-[var(--blue-deep)]">引導專家 Bee 老師</span>
            </div>
            {genres.includes('詩歌仿寫') && (
              <span className="px-2 py-0.5 bg-[var(--amber)] text-white text-[10px] font-black rounded-full animate-pulse">
                詩歌模式
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[var(--warm)]/10">
            {socraticHistory.length === 0 && !isSocraticLoading && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-[var(--warm)] rounded-full flex items-center justify-center mx-auto text-[var(--brown-light)]">
                  <MessageSquare size={32} />
                </div>
                <p className="text-xs text-[var(--brown-mid)] font-bold">點擊下方按鈕開始與 Bee 老師對話</p>
              </div>
            )}
            {socraticHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[var(--brown-deep)] text-white rounded-tr-none' 
                    : 'bg-white text-[var(--brown-deep)] rounded-tl-none border border-[var(--border)]'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isSocraticLoading && (
              <div className="flex justify-start">
                <div className="bg-[var(--warm)] p-3 rounded-2xl rounded-tl-none border border-[var(--border)]">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[var(--brown-light)] rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-[var(--brown-light)] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-[var(--brown-light)] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--border)] bg-white space-y-3">
            {genres.includes('詩歌仿寫') && socraticHistory.length < 3 && (
              <div className="p-2 bg-[var(--amber-light)]/20 rounded-lg border border-[var(--amber-light)]/30 mb-2">
                <p className="text-[10px] text-[var(--brown-deep)] font-bold flex items-center gap-1">
                  <Sparkles size={10} className="text-[var(--amber)]" /> 專家提示：請告訴 Bee 老師您想仿作的主題或核心意象。
                </p>
              </div>
            )}
            
            {/* 🚀 新增：蘇格拉底引導建議按鈕 */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(SOCRATIC_SUGGESTIONS[genres[0]] || SOCRATIC_SUGGESTIONS['default']).map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSocraticInput(s);
                  }}
                  className="px-2.5 py-1 bg-white border border-[var(--border)] rounded-full text-[9px] font-black text-[var(--brown-mid)] hover:border-[var(--amber)] hover:text-[var(--amber)] transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="relative">
              <input 
                value={socraticInput}
                onChange={(e) => setSocraticInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendSocratic()}
                placeholder={genres.includes('詩歌仿寫') ? "輸入仿作主題或意象..." : "回答 Bee 老師的問題..."}
                className="w-full pl-4 pr-10 py-3 bg-[var(--warm)] rounded-xl text-xs font-bold border-none focus:ring-2 focus:ring-[var(--amber)] transition-all"
              />
              <button 
                onClick={handleSendSocratic}
                disabled={isSocraticLoading || !socraticInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[var(--amber)] hover:bg-white rounded-lg transition-all disabled:opacity-30"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleRefineOutline}
                disabled={loading || socraticHistory.length < 2}
                className="flex-1 py-2.5 bg-[var(--blue-deep)] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-[var(--blue-mid)] transition-all shadow-md disabled:opacity-50"
              >
                <Sparkles size={14} /> 優化大綱
              </button>
              {socraticHistory.length === 0 && (
                <button 
                  onClick={handleStartSocratic}
                  disabled={isSocraticLoading}
                  className="flex-1 py-2.5 bg-[var(--amber)] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-[var(--amber-mid)] transition-all shadow-md"
                >
                  <Bee size={14} /> 開始引導
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 🚀 右側：大綱編輯與預覽 */}
        <div className="md:col-span-8 bg-white p-8 rounded-[40px] border-4 border-[var(--warm)] shadow-xl relative min-h-[600px] overflow-hidden flex flex-col">
          {/* 右上角重刷按鈕 */}
          <button 
            onClick={handleGenerateOutline} 
            disabled={loading}
            className="absolute top-6 right-6 p-3 bg-[var(--blue-light)] text-[var(--blue-deep)] rounded-2xl font-black hover:bg-[var(--blue-mid)] hover:text-white transition-all flex items-center gap-2 text-xs z-10"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> AI 重新構思
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mt-12">
            {loading && outline.length === 0 ?
              <div className="h-full flex flex-col items-center justify-center text-[var(--brown-mid)] opacity-50 space-y-4">
                <Wand2 size={40} className="animate-pulse" />
                <p className="font-bold">Bee 老師正在為您繪製心智圖...</p>
              </div>
            :
              <div className="space-y-8">
                {/* 思考工具選擇器 */}
                <div className="p-6 bg-[var(--warm)]/30 rounded-[32px] border-2 border-dashed border-[var(--border)]">
                  <div className="flex items-center gap-3 mb-4 text-[var(--brown-deep)] font-black">
                    <Layout size={20} className="text-[var(--amber)]" /> 選擇結尾思考工具 (Thinking Tool)
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {THINKING_TOOLS_DETAILED.map(tool => {
                      // 根據年級適配性標記（簡化邏輯：高年級專用工具在低年級顯示警告）
                      const isTooComplex = (grade.startsWith('g1') || grade.startsWith('g2')) && tool.id === 'oreo';
                      
                      return (
                        <button
                          key={tool.id}
                          onClick={() => setThinkingTool(tool.name)}
                          disabled={isTooComplex}
                          className={`group relative px-6 py-3 rounded-2xl font-black text-sm transition-all ${
                            thinkingTool === tool.name 
                              ? 'bg-[var(--amber)] text-white shadow-lg scale-105' 
                              : 'bg-white text-[var(--brown-mid)] border-2 border-[var(--border)] hover:border-[var(--amber)]'
                          } ${isTooComplex ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                          <div>{tool.name}</div>
                          <div className="text-[9px] font-medium opacity-70 group-hover:opacity-100">{tool.problem}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🚀 新增：修辭子分類選擇器 */}
                <AnimatePresence>
                  {skills.includes('修辭運用') && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-[var(--amber-light)]/20 rounded-[32px] border-2 border-dashed border-[var(--amber-light)]/50 space-y-4">
                        <div className="flex items-center gap-3 text-[var(--brown-deep)] font-black">
                          <Sparkles size={20} className="text-[var(--amber)]" /> 指定修辭技巧 (Rhetorical Devices)
                        </div>
                        <p className="text-xs text-[var(--brown-mid)] font-medium">請選擇您想在文章中運用的具體修辭，AI 將會在大綱中為您安排示範。</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {['明喻', '暗喻', '擬人', '擬物', '誇飾', '排比', '設問', '反問', '借代', '引用', '倒裝', '對偶', '頂真', '層遞'].map(r => (
                            <button
                              key={r}
                              onClick={() => toggleRhetoricSkill(r)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                rhetoricSkills.includes(r)
                                  ? 'bg-[var(--amber)] text-white shadow-md scale-105'
                                  : 'bg-white text-[var(--brown-mid)] border border-[var(--border)] hover:border-[var(--amber)]'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 🚀 新增：五感圖詳細描述欄位 */}
                <AnimatePresence>
                  {thinkingTool === '五感圖' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-[var(--blue-light)]/30 rounded-[32px] border-2 border-[var(--blue-mid)] border-opacity-20 space-y-4">
                        <div className="flex items-center gap-3 text-[var(--blue-deep)] font-black">
                          <Sparkles size={20} className="text-[var(--blue-mid)]" /> 五感細節補給站
                        </div>
                        <p className="text-xs text-[var(--blue-deep)] opacity-70 font-medium">請輸入您想在文章中強調的感官細節，AI 將會優先將其納入大綱中。</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--blue-deep)] uppercase tracking-widest">👁️ 視覺細節</label>
                            <textarea 
                              value={fiveSenses.visual}
                              onChange={(e) => setFiveSenses({ ...fiveSenses, visual: e.target.value })}
                              placeholder="看到什麼？顏色、形狀、光影..."
                              className="w-full h-24 text-xs p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-[var(--blue-mid)] resize-none shadow-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--blue-deep)] uppercase tracking-widest">👂 聽覺細節</label>
                            <textarea 
                              value={fiveSenses.auditory}
                              onChange={(e) => setFiveSenses({ ...fiveSenses, auditory: e.target.value })}
                              placeholder="聽到什麼？聲音的大小、節奏、語氣..."
                              className="w-full h-24 text-xs p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-[var(--blue-mid)] resize-none shadow-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--blue-deep)] uppercase tracking-widest">👃👅✋ 嗅覺/味覺/觸覺</label>
                            <textarea 
                              value={fiveSenses.olfactoryGustatoryTactile}
                              onChange={(e) => setFiveSenses({ ...fiveSenses, olfactoryGustatoryTactile: e.target.value })}
                              placeholder="聞到、嚐到或摸到什麼？味道、質感、溫度..."
                              className="w-full h-24 text-xs p-3 bg-white rounded-xl border-none focus:ring-2 focus:ring-[var(--blue-mid)] resize-none shadow-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {viewMode === 'list' ?
                  /* 📋 清單模式 */
                  <div className="relative border-l-4 border-[var(--amber-light)] ml-6 pl-10 py-4 space-y-8">
                  <Reorder.Group axis="y" values={outline} onReorder={handleReorder} className="space-y-8">
                    <AnimatePresence mode="popLayout">
                      {outline.map((item, idx) => (
                        <Reorder.Item 
                          key={item.id}
                          value={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative bg-white p-6 rounded-3xl shadow-sm border-2 border-[var(--border)] hover:border-[var(--amber)] transition-colors group"
                        >
                          <div className="absolute -left-[56px] top-6 w-8 h-8 bg-[var(--amber)] rounded-full border-4 border-white shadow-md flex items-center justify-center text-white text-[10px] font-black">
                            {idx + 1}
                          </div>
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-3 cursor-grab active:cursor-grabbing text-[var(--brown-light)] opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical size={20} />
                            </div>
                            <div className="flex-1 space-y-3">
                              <input 
                                value={item.title}
                                onChange={(e) => updateOutline(idx, 'title', e.target.value)}
                                placeholder="段落標題"
                                className="w-full text-xl font-black text-[var(--brown-deep)] border-none p-0 focus:ring-0 bg-transparent placeholder:opacity-30"
                              />
                              <textarea 
                                value={item.desc}
                                onChange={(e) => updateOutline(idx, 'desc', e.target.value)}
                                placeholder="這段想寫什麼？"
                                className="w-full h-16 text-sm text-[var(--brown-mid)] bg-[var(--warm)]/50 rounded-xl p-3 border-none resize-none focus:ring-2 focus:ring-[var(--amber-light)]"
                              />
                              
                              {/* 🚀 列表模式的分歧路徑 (Branches) UI */}
                              <div className="bg-[var(--blue-light)]/40 p-3 rounded-xl border border-[var(--blue-mid)] border-opacity-20 mt-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-black text-[var(--blue-deep)] flex items-center gap-1">
                                    <Split size={12}/> 段落分歧路徑 (Fork)
                                  </span>
                                  <button onClick={() => addBranch(idx)} className="text-[10px] font-bold text-[var(--blue-mid)] hover:text-[var(--blue-deep)] transition-colors">
                                    + 新增維度
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {item.branches?.map((b, bIdx) => (
                                    <div key={bIdx} className="flex items-center gap-1 bg-white border border-[var(--blue-mid)] border-opacity-30 px-2 py-1 rounded-md shadow-sm">
                                      <input 
                                        value={b} 
                                        onChange={(e) => updateBranch(idx, bIdx, e.target.value)} 
                                        className="text-xs font-bold text-[var(--blue-deep)] w-20 bg-transparent outline-none focus:border-b border-[var(--blue-mid)]" 
                                      />
                                      <button onClick={() => removeBranch(idx, bIdx)} className="text-red-300 hover:text-red-500 transition-colors">
                                        <X size={12}/>
                                      </button>
                                    </div>
                                  ))}
                                  {(!item.branches || item.branches.length === 0) && (
                                    <span className="text-[10px] text-[var(--brown-light)] opacity-50 italic">此段落為單一推進，無分歧寫作路徑。</span>
                                  )}
                                </div>
                              </div>

                            </div>
                            <button onClick={() => removeNode(idx)} className="p-2 text-[var(--coral)] opacity-0 group-hover:opacity-100 hover:bg-[var(--coral-light)] rounded-xl transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                  <button onClick={addNode} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[var(--border)] border-dashed rounded-2xl text-[var(--brown-light)] hover:text-[var(--amber)] hover:border-[var(--amber)] transition-all font-bold text-sm">
                    <Plus size={16} /> 新增段落節點
                  </button>
                </div>
              :
                /* 🕸️ 心智圖模式 (Mind Map View) */
                <div className="flex flex-col items-center justify-start space-y-12 py-10 min-h-full">
                <div className="relative w-full max-w-3xl mx-auto">
                  {/* 根節點 (第 1 段) */}
                  <div className="flex justify-center mb-16">
                    <motion.div 
                      layout
                      className={`bg-[var(--amber)] text-white px-8 py-4 rounded-full font-black text-xl shadow-xl z-10 relative min-w-[200px] text-center group ${editingNodeId === outline[0]?.id ? 'ring-4 ring-[var(--amber-light)]' : ''}`}
                    >
                      {editingNodeId === outline[0]?.id ? (
                        <div className="space-y-2">
                          <input 
                            value={outline[0]?.title || ''}
                            onChange={(e) => updateOutline(0, 'title', e.target.value)}
                            placeholder="寫作主題"
                            className="bg-white/20 border-none text-center w-full focus:ring-0 placeholder:text-white/50 rounded-lg py-1"
                            autoFocus
                          />
                          <textarea 
                            value={outline[0]?.desc || ''}
                            onChange={(e) => updateOutline(0, 'desc', e.target.value)}
                            placeholder="主題描述..."
                            className="w-full text-xs p-2 bg-white text-[var(--brown-mid)] rounded-lg border-none shadow-inner resize-none h-16 focus:ring-0"
                          />
                          <button 
                            onClick={() => setEditingNodeId(null)}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-[var(--amber)] p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                          >
                            <Check size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-center gap-2">
                            <span>{outline[0]?.title || '未命名主題'}</span>
                            <button 
                              onClick={() => setEditingNodeId(outline[0].id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-md transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-56 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                             <div className="bg-white text-[var(--brown-mid)] p-3 rounded-xl border border-[var(--amber-light)] shadow-lg text-[10px] text-left font-medium">
                               {outline[0]?.desc || '無描述'}
                             </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* 子節點 (第 2 段之後) */}
                  <Reorder.Group 
                    axis="x" 
                    values={outline.slice(1)} 
                    onReorder={handleReorderChildren}
                    className="flex flex-wrap justify-center gap-12 relative"
                  >
                    <AnimatePresence mode="popLayout">
                      {outline.slice(1).map((item, idx) => (
                        <Reorder.Item 
                          key={item.id} 
                          value={item}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="relative flex flex-col items-center group w-56"
                        >
                          {/* 連接線 */}
                          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-[var(--amber-light)]" />
                          
                          {/* 節點卡片 */}
                          <div className={`bg-white p-4 rounded-[24px] border-2 shadow-md w-full text-center relative transition-all z-10 ${editingNodeId === item.id ? 'border-[var(--amber)] ring-2 ring-[var(--amber-light)]' : 'border-[var(--amber-light)] hover:border-[var(--amber)]'}`}>
                            <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing text-[var(--brown-light)] opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical size={14} />
                            </div>
                            
                            {editingNodeId === item.id ? (
                              <div className="space-y-2 pt-2">
                                <input 
                                  value={item.title}
                                  onChange={(e) => updateOutline(idx + 1, 'title', e.target.value)}
                                  className="text-sm font-black text-[var(--brown-deep)] block w-full text-center bg-[var(--warm)]/30 rounded-lg border-none focus:ring-1 focus:ring-[var(--amber)] p-1"
                                  placeholder="段落標題"
                                  autoFocus
                                />
                                <textarea 
                                  value={item.desc}
                                  onChange={(e) => updateOutline(idx + 1, 'desc', e.target.value)}
                                  className="text-[10px] text-[var(--brown-mid)] w-full text-center bg-[var(--warm)]/30 rounded-md p-1.5 border-none focus:ring-1 focus:ring-[var(--amber-light)] resize-none h-14 custom-scrollbar"
                                  placeholder="段落描述..."
                                />
                                <button 
                                  onClick={() => setEditingNodeId(null)}
                                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--amber)] text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                  <Check size={12} />
                                </button>
                              </div>
                            ) : (
                              <div className="py-2">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <span className="text-sm font-black text-[var(--brown-deep)]">{item.title}</span>
                                  <button 
                                    onClick={() => setEditingNodeId(item.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-[var(--brown-light)] hover:text-[var(--amber)] transition-all"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                </div>
                                <p className="text-[10px] text-[var(--brown-mid)] line-clamp-2 px-2">
                                  {item.desc || '尚無描述...'}
                                </p>
                              </div>
                            )}
                            
                            <div className="absolute -top-3 -right-3 w-6 h-6 bg-[var(--amber)] text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-sm">
                              {idx + 2}
                            </div>

                            <button 
                              onClick={() => removeNode(idx + 1)}
                              className="absolute -bottom-3 -right-3 w-7 h-7 bg-[var(--coral)] text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* 🚀 心智圖模式的 Branches 懸掛區 */}
                          <div className="mt-3 w-full flex flex-col items-center gap-2">
                            <button 
                              onClick={() => addBranch(idx + 1)} 
                              className="text-[10px] font-bold text-[var(--blue-mid)] flex items-center gap-1 hover:text-[var(--blue-deep)] bg-white px-3 py-1 rounded-full shadow-sm border border-[var(--blue-light)] transition-all"
                            >
                              <Plus size={10}/> 分歧維度
                            </button>
                            
                            {item.branches && item.branches.length > 0 && (
                              <div className="flex flex-col gap-1.5 w-full">
                                {item.branches.map((b, bIdx) => (
                                  <div key={bIdx} className="flex items-center justify-between bg-[var(--blue-light)] border border-[var(--blue-mid)] border-opacity-30 px-2 py-1.5 rounded-lg w-full shadow-sm">
                                    <Split size={10} className="text-[var(--blue-deep)] opacity-50 shrink-0"/>
                                    <input 
                                      value={b} 
                                      onChange={(e) => updateBranch(idx + 1, bIdx, e.target.value)} 
                                      className="text-[10px] font-bold text-[var(--blue-deep)] bg-transparent outline-none flex-1 text-center" 
                                      placeholder="維度名稱" 
                                    />
                                    <button onClick={() => removeBranch(idx + 1, bIdx)} className="text-red-300 hover:text-red-500 shrink-0"><X size={12}/></button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Reorder.Item>
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                  
                  {/* 新增按鈕 */}
                  <div className="relative flex flex-col items-center mt-12">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-[var(--border)] border-dashed border-l" />
                    <button 
                      onClick={addNode}
                      className="w-12 h-12 rounded-full border-2 border-dashed border-[var(--border)] flex items-center justify-center text-[var(--brown-light)] hover:border-[var(--amber)] hover:text-[var(--amber)] transition-all bg-white shadow-sm"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  </div>

  {/* 底部導航 */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleGoNext} 
          disabled={loading || outline.length === 0}
          className="px-8 py-4 bg-[var(--brown-deep)] text-white rounded-full font-black text-lg hover:bg-[var(--brown-mid)] transition-all shadow-xl flex items-center gap-3 disabled:opacity-50"
        >
          骨架確認，下一步選皮膚 <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}