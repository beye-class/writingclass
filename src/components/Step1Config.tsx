import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, AlertCircle, ChevronRight, ImageIcon, Upload, X, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import { gradeConfig } from '../data/grades';
import { GENRES } from '../data/strategies';
import { useAppStore } from '../store/useAppStore';

interface Step1ConfigProps {
  grade: string; setGrade: (g: string) => void;
  genres: string[]; toggleGenre: (g: string) => void;
  skills: string[]; toggleSkill: (s: string) => void;
  topic: string; setTopic: (t: string) => void;
  notes: string; setNotes: (n: string) => void;
  originalPoem: string; setOriginalPoem: (p: string) => void; // 🚀 新增：原詩專屬狀態
  poemStructure: string; setPoemStructure: (p: string) => void;
  image: string | null; setImage: (img: string | null) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showRules: boolean; setShowRules: (show: boolean) => void;
  error: string | null;
  handleGoStep2: () => void;
}

export default function Step1Config({
  grade, setGrade, genres, toggleGenre, skills, toggleSkill,
  topic, setTopic, notes, setNotes, originalPoem, setOriginalPoem, poemStructure, setPoemStructure, // 🚀 新增：解構屬性
  image, setImage, handleImageUpload,
  showRules, setShowRules, error, handleGoStep2
}: Step1ConfigProps) {
  const currentGrade = gradeConfig[grade as keyof typeof gradeConfig];
  const { resetProjectSettings } = useAppStore();

  return (
    <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-12 gap-8">
      <div className="md:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-[var(--border)] shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-[var(--brown-deep)]">基礎設定</h2>
              <p className="text-[var(--brown-mid)] font-medium">讓我們開始規劃您的教學主題</p>
            </div>
            
            <button
              onClick={() => {
                if (window.confirm('🐝 Bee老師提醒：確定要清空所有已輸入的資料嗎？(包含題目、筆記與原詩)')) {
                  resetProjectSettings();
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-red-100 hover:border-red-200 shadow-sm bg-white"
            >
              <Trash2 size={16} />
              一鍵清空
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--brown-light)] flex items-center gap-2">
              <BookOpen size={14} /> 選擇年級
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(gradeConfig).map(([id, cfg]: [string, any]) => (
                <button key={id} onClick={() => setGrade(id)} className={`p-3 rounded-2xl border-2 transition-all text-sm font-bold ${grade === id ? 'border-[var(--amber)] bg-[var(--amber-light)] text-[var(--brown-deep)]' : 'border-[var(--border)] hover:border-[var(--brown-light)]'}`}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--brown-light)]">文章類型 (可複選)</label>
            <div className="grid grid-cols-2 gap-2">
              {GENRES.map(g => (
                <button key={g} onClick={() => toggleGenre(g)} className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${genres.includes(g) ? 'bg-[var(--amber-light)] border-[var(--amber)] text-[var(--brown-deep)]' : 'bg-white border-[var(--border)] text-[var(--brown-mid)] hover:border-[var(--brown-light)]'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--brown-light)]">核心技法 (可複選)</label>
            <div className="grid grid-cols-2 gap-2">
              {['五感描寫', '動作分解', '對話設計', '心理描摹', '修辭運用', '結構佈局'].map(s => (
                <button key={s} onClick={() => toggleSkill(s)} className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${skills.includes(s) ? 'bg-[var(--blue-light)] border-[var(--blue)] text-[var(--brown-deep)]' : 'bg-white border-[var(--border)] text-[var(--brown-mid)] hover:border-[var(--brown-light)]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-[var(--border)] border-opacity-30">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--brown-light)] flex items-center gap-2">
                <ImageIcon size={14} /> 參考圖片 (選填)
              </label>
            </div>
            {!image && (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[var(--border)] rounded-2xl cursor-pointer hover:bg-[var(--warm)] transition-all">
                <div className="flex flex-col items-center justify-center">
                  <Upload size={20} className="text-[var(--brown-light)] mb-1" />
                  <p className="text-[10px] font-bold text-[var(--brown-mid)]">點擊上傳圖片</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}

            <AnimatePresence>
              {image && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="relative mt-4"
                >
                  <div className="relative inline-block w-full">
                    <img src={image} alt="參考教材" className="w-full h-48 object-cover rounded-2xl border-4 border-[var(--warm)] shadow-sm" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 text-[var(--coral)] rounded-full hover:bg-[var(--coral)] hover:text-white transition-colors shadow-sm backdrop-blur-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {/* 🚀 新增：AI 視覺分析啟動提示 */}
                  <div className="mt-2 flex items-center gap-2 bg-[var(--blue-light)]/50 border border-[var(--blue-mid)] border-opacity-30 p-2.5 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-[var(--blue-mid)] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Sparkles size={12} />
                    </div>
                    <p className="text-[11px] font-bold text-[var(--blue-deep)] leading-tight">
                      AI 視覺分析已啟動！<br/>
                      <span className="font-medium opacity-80">系統將自動辨識圖片中的心智圖、樹狀圖或結構層級，並轉化為教學大綱。</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-[var(--blue-light)] p-5 rounded-3xl border border-[var(--blue-mid)] border-opacity-20 space-y-3">
          <button onClick={() => setShowRules(!showRules)} className="w-full flex items-center justify-between group">
            <h4 className="text-xs font-black text-[var(--blue-deep)] uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={14} /> 年級規範
            </h4>
            <motion.div animate={{ rotate: showRules ? 180 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="text-[var(--blue-deep)] opacity-50 group-hover:opacity-100">
              <ChevronRight size={14} />
            </motion.div>
          </button>
          <AnimatePresence>
            {showRules && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="text-xs text-[var(--blue-deep)] opacity-80 leading-relaxed pt-1 border-t border-[var(--blue-deep)] border-opacity-10">
                  {currentGrade.rule}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="md:col-span-8 space-y-6">
        <div className="bg-white p-8 rounded-[40px] border border-[var(--border)] shadow-lg space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-[var(--brown-deep)] tracking-tight">今天想寫什麼題目？</h2>
            <input 
              type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：我最難忘的一件事、夏天的味道..."
              className="w-full p-5 bg-[var(--warm)] rounded-3xl border-none text-xl font-bold placeholder:text-[var(--brown-light)] placeholder:opacity-50 focus:ring-4 focus:ring-[var(--amber)] focus:ring-opacity-20 transition-all"
            />
          </div>

          {/* 🚀 新增：動態顯示「專屬原詩欄位」 (當選擇詩歌仿寫時出現) */}
          <AnimatePresence>
            {genres.includes('詩歌仿寫') && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-[var(--blue-deep)] flex items-center gap-2">
                    📜 原詩參考 (詩歌仿寫專用)
                  </label>
                  <textarea 
                    value={originalPoem} onChange={(e) => setOriginalPoem(e.target.value)}
                    placeholder="請貼上要讓學生仿寫的原始詩歌內容..."
                    className="w-full h-40 p-5 bg-[var(--blue-light)] rounded-3xl border border-[var(--blue-mid)] border-opacity-20 text-sm font-medium resize-none focus:ring-4 focus:ring-[var(--blue-mid)] focus:ring-opacity-30 transition-all text-[var(--blue-deep)] placeholder:text-[var(--blue-deep)] placeholder:opacity-50"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-[var(--blue-deep)] flex items-center gap-2">
                      🧩 請輸入要保留的句型結構 (詩歌仿寫專用)
                    </label>
                    <button
                      onClick={useAppStore.getState().handleDeconstructPoem}
                      disabled={useAppStore(s => s.isDeconstructingPoem) || !originalPoem.trim()}
                      className="flex items-center gap-1 text-xs font-bold text-[var(--blue-deep)] bg-[var(--blue-light)] hover:bg-[var(--blue-mid)] hover:text-white px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {useAppStore(s => s.isDeconstructingPoem) ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {useAppStore(s => s.isDeconstructingPoem) ? '拆解中...' : 'AI 幫我拆解'}
                    </button>
                  </div>
                  <textarea 
                    value={poemStructure} onChange={(e) => setPoemStructure(e.target.value)}
                    placeholder="例如：[自然現象] 是一把 [物品]，[動作] 了 [名詞]..."
                    className="w-full h-24 p-5 bg-[var(--blue-light)] rounded-3xl border border-[var(--blue-mid)] border-opacity-20 text-sm font-medium resize-none focus:ring-4 focus:ring-[var(--blue-mid)] focus:ring-opacity-30 transition-all text-[var(--blue-deep)] placeholder:text-[var(--blue-deep)] placeholder:opacity-50"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--brown-light)]">補充筆記 / 教學重點</label>
            <textarea 
              value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="有什麼特別想強調的內容或學生的痛點嗎？"
              className="w-full h-32 p-5 bg-[var(--warm)] rounded-3xl border-none text-sm font-medium resize-none focus:ring-4 focus:ring-[var(--amber)] focus:ring-opacity-20 transition-all"
            />
          </div>
          {error && (
            <div className="p-4 bg-[var(--coral-light)] text-[var(--coral)] rounded-2xl flex items-center gap-3 text-sm font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          <button onClick={handleGoStep2} className="w-full py-5 bg-[var(--brown-deep)] text-white rounded-3xl font-black text-lg hover:bg-[var(--brown-mid)] transition-all shadow-xl shadow-[var(--brown-deep)]/10 flex items-center justify-center gap-3">
            下一步：設定大綱骨架 <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}