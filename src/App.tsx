import React, { useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  RefreshCw, 
  Bug as Bee,
  Key,
  Trash2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from './store/useAppStore'; 
import { styleLib } from './data/styles';

// Import Subcomponents
import Step1Config from './components/Step1Config';
import Step2Outline from './components/Step2Outline';
import Step2Skin from './components/Step2Skin';
import Step3Style from './components/Step3Style';
import Step4Draft from './components/Step4Draft';

export default function App() {
  const store = useAppStore();

  useEffect(() => {
    // 🚀 核心優化：檢查是否有儲存的金鑰
    if (store.apiKeys.length === 0) {
      const savedKey = localStorage.getItem('GEMINI_API_KEY');
      if (savedKey) {
        store.setApiKeys([savedKey]);
      } else if (!process.env.GEMINI_API_KEY) {
        store.setShowKeyModal(true);
      }
    }
    store.setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveApiKey = () => {
    if (store.apiKeyInput.trim()) {
      store.addApiKey(store.apiKeyInput.trim());
      store.setApiKeyInput('');
    }
    if (store.apiKeys.length > 0 || store.apiKeyInput.trim()) {
      store.setShowKeyModal(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => store.setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text?: string) => {
    const content = text || store.mdOutput;
    navigator.clipboard.writeText(content);
    store.showToast('已複製到剪貼簿');
  };

  const copyForNotebookLM = () => {
    const content = `---
教學專案：Bee老師🐝 作文教室 (v7.7)
生成時間：${new Date().toLocaleString()}
---

# 📚 教學來源文件：${store.topic || '未命名主題'}

## 📝 教學腳本本體
${store.mdOutput}

---
*文件結尾：此文件優化用於 NotebookLM 來源分析*`;
    navigator.clipboard.writeText(content);
    store.showToast('✨ 已優化 NotebookLM 專用格式並複製至剪貼簿！');
  };

  const filteredStyles = useMemo(() => {
    return styleLib.filter(s => {
      const matchCat = store.cat === 'ALL' || s.cat === store.cat;
      const matchSearch = s.name.includes(store.search) || s.en.toLowerCase().includes(store.search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [store.cat, store.search]);

  if (!store.isLoaded) return null;

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--amber)] rounded-full flex items-center justify-center text-white shadow-md animate-bee-spin">
            <Bee size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--brown-deep)] flex items-center gap-2 drop-shadow-sm">
              Bee老師🐝
              <span className="text-sm px-3 py-1 bg-white/60 text-[var(--brown-mid)] rounded-full border border-[var(--border)] shadow-sm backdrop-blur-md">
                作文教室
              </span>
            </h1>
            <p className="text-xs text-[var(--brown-light)] font-bold tracking-widest uppercase mt-1">沉浸式分鏡引擎 v7.7</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 bg-[var(--warm)] p-1 rounded-full border border-[var(--border)]">
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                store.step === s ? 'bg-white text-[var(--brown-deep)] shadow-sm' : 
                store.step > s ? 'text-[var(--brown-light)]' : 'text-[var(--brown-light)] opacity-50'
              }`}
            >
              STEP {s}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {(store.drafts.length > 0 || store.outline.length > 0 || store.socraticHistory.length > 0) && (
            <button 
              onClick={() => store.setShowRestartConfirm(true)} 
              className="px-3 py-1.5 flex items-center gap-1 hover:bg-red-50 rounded-full transition-colors text-red-400 font-bold text-xs" 
              title="清除進度重新開始"
            >
               重新開始
            </button>
          )}
          <button 
            onClick={() => store.setShowKeyModal(true)} 
            className="p-2 hover:bg-[var(--warm)] text-[var(--brown-mid)] hover:text-[var(--amber)] rounded-full transition-colors"
            title="設定 Gemini API Key"
          >
            <Key size={20} />
          </button>

          {store.step > 1 && (
            <button 
              onClick={() => store.setStep((store.step - 1) as any)}
              className="px-3 py-1.5 flex items-center gap-1 hover:bg-[var(--warm)] rounded-full transition-colors text-[var(--brown-mid)] font-bold text-xs"
            >
              <ChevronLeft size={16} /> 返回上一步
            </button>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-[var(--warm)] rounded-full transition-colors text-[var(--brown-mid)]"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        <AnimatePresence mode="wait">
          {store.step === 1 && (
            <Step1Config 
              grade={store.grade} setGrade={store.setGrade}
              genres={store.genres} toggleGenre={store.toggleGenre}
              skills={store.skills} toggleSkill={store.toggleSkill}
              topic={store.topic} setTopic={store.setTopic}
              notes={store.notes} setNotes={store.setNotes}
              originalPoem={store.originalPoem} setOriginalPoem={store.setOriginalPoem}
              poemStructure={store.poemStructure} setPoemStructure={store.setPoemStructure}
              image={store.image} setImage={store.setImage}
              handleImageUpload={handleImageUpload}
              showRules={store.showRules} setShowRules={store.setShowRules}
              error={store.error}
              handleGoStep2={store.handleGoStep2}
            />
          )}

          {store.step === 2 && (
            <Step2Outline 
              grade={store.grade}
              genres={store.genres}
              outline={store.outline}
              setOutline={store.setOutline}
              thinkingTool={store.thinkingTool}
              setThinkingTool={store.setThinkingTool}
              loading={store.loading}
              handleGenerateOutline={store.handleGenerateOutline}
              handleGoNext={() => store.setStep(3)}
              socraticHistory={store.socraticHistory}
              socraticInput={store.socraticInput}
              setSocraticInput={store.setSocraticInput}
              isSocraticLoading={store.isSocraticLoading}
              handleSendSocratic={store.handleSendSocratic}
              handleRefineOutline={store.handleRefineOutline}
              handleStartSocratic={store.handleStartSocratic}
              fiveSenses={store.fiveSenses}
              setFiveSenses={store.setFiveSenses}
              skills={store.skills}
              rhetoricSkills={store.rhetoricSkills}
              toggleRhetoricSkill={store.toggleRhetoricSkill}
            />
          )}

          {store.step === 3 && (
            <Step2Skin 
              grade={store.grade}
              skinId={store.skinId}
              setSkinId={store.setSkinId}
              setStep={(step) => store.setStep(step)}
            />
          )}

          {store.step === 4 && (
            <Step3Style 
              search={store.search} setSearch={store.setSearch}
              cat={store.cat} setCat={store.setCat}
              styleId={store.styleId} setStyleId={store.setStyleId}
              filteredStyles={filteredStyles}
              onSelectStyle={(id) => {
                store.setStyleId(id);
                store.handleGoDraft(id);
              }}
            />
          )}

          {store.step === 5 && (
            <Step4Draft 
              drafts={store.drafts}
              loading={store.loading}
              genres={store.genres}
              isGeneratingStream={store.isGeneratingStream}
              handleAddPara={store.handleAddPara}
              updateParaField={store.updateParaField}
              handleDeletePara={store.handleDeletePara}
              handleRegenFullPara={store.handleRegenFullPara}
              handleRegenPara={store.handleRegenPara}
              handleGenerate={store.handleGenerate}
              handleStopGeneration={store.handleStopGeneration}
              copyToClipboard={copyToClipboard}
              copyForNotebookLM={copyForNotebookLM}
              handleBackToStep={(target: number) => store.setStep(target as any)}
              handleValidateSentence={store.handleValidateSentence}
              handleAdjustSentence={store.handleAdjustSentence}
              handleGenerateForkDetails={store.handleGenerateForkDetails}
              handleDeleteForkPath={store.handleDeleteForkPath}
              handleToggleFork={store.handleToggleFork}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Loading Overlay */}
      {store.loading && store.step !== 5 && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 bg-[var(--amber)] rounded-full flex items-center justify-center text-white shadow-2xl animate-bee-spin">
            <Bee size={40} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-black text-[var(--brown-deep)]">Bee 老師正在思考中...</h3>
            <p className="text-sm text-[var(--brown-mid)] font-medium animate-pulse">正在為您規劃最棒的寫作引導</p>
          </div>
        </div>
      )}

      {/* 重新開始確認彈出視窗 */}
      <AnimatePresence>
        {store.showRestartConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl border-8 border-[var(--warm)] text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw size={40} />
              </div>
              <h3 className="text-2xl font-black text-[var(--brown-deep)] mb-3">確定要重新開始嗎？</h3>
              <p className="text-[var(--brown-mid)] font-medium mb-8">這將會清除目前所有的寫作進度、大綱與對話紀錄，且無法復原喔！</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => store.setShowRestartConfirm(false)}
                  className="flex-1 py-4 bg-[var(--warm)] text-[var(--brown-deep)] rounded-2xl font-black hover:bg-gray-200 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={store.handleClearDrafts}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                >
                  確定重開
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* API Key 設定彈出視窗 */}
      <AnimatePresence>
        {store.showKeyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border-4 border-[var(--warm)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[var(--amber-light)] text-[var(--amber)] rounded-full flex items-center justify-center shrink-0">
                  <Key size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[var(--brown-deep)]">API 金鑰設定</h2>
                  <p className="text-xs font-bold text-[var(--brown-light)]">Gemini API Key Setup</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <p className="text-sm text-[var(--brown-mid)] font-medium leading-relaxed">
                  Bee 老師現在支援 <strong>多組 API Key 輪用</strong>。系統會隨機切換金鑰以避開配額限制。
                </p>

                {store.apiKeys.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[var(--brown-light)] uppercase tracking-widest pl-2">已儲存的金鑰 ({store.apiKeys.length})</label>
                    <div className="max-h-40 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                      {store.apiKeys.map((key, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[var(--cream)] border border-[var(--warm)] rounded-xl p-3 group">
                          <div className="flex-1 font-mono text-[10px] text-[var(--brown-deep)] truncate">
                            {key.slice(0, 10)}...{key.slice(-4)}
                          </div>
                          <button 
                            onClick={() => store.removeApiKey(idx)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--brown-light)] uppercase tracking-widest pl-2">新增金鑰</label>
                  <div className="flex gap-2">
                    <input 
                      type="password"
                      value={store.apiKeyInput}
                      onChange={(e) => store.setApiKeyInput(e.target.value)}
                      placeholder="輸入 AIzaSy 開頭的金鑰..."
                      className="flex-1 bg-[var(--cream)] border-2 border-[var(--warm)] rounded-2xl p-4 text-[var(--brown-deep)] focus:ring-2 focus:ring-[var(--amber)] outline-none transition-all font-mono text-sm"
                    />
                    <button 
                      onClick={() => {
                        if (store.apiKeyInput.trim()) {
                          store.addApiKey(store.apiKeyInput.trim());
                          store.setApiKeyInput('');
                        }
                      }}
                      className="px-4 bg-[var(--brown-deep)] text-white rounded-2xl font-black hover:bg-[var(--amber)] transition-colors shadow-md text-xs"
                    >
                      新增
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => store.setShowKeyModal(false)}
                    className="flex-1 py-3.5 bg-[var(--warm)] text-[var(--brown-deep)] rounded-2xl font-black hover:bg-gray-200 transition-colors"
                  >
                    關閉
                  </button>
                  {store.apiKeys.length > 0 && (
                    <button 
                      onClick={() => store.setShowKeyModal(false)}
                      className="flex-1 py-3.5 bg-[var(--brown-deep)] text-white rounded-2xl font-black hover:bg-[var(--amber)] transition-colors shadow-lg"
                    >
                      完成設定
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Toast 通知 */}
      <AnimatePresence>
        {store.toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 bg-[var(--brown-deep)] text-white rounded-full shadow-2xl font-bold flex items-center gap-2 border-2 border-[var(--amber)]"
          >
            <Sparkles size={16} className="text-[var(--amber)]" />
            {store.toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--brown-light);
        }
      `}</style>
    </div>
  );
}
