import React, { useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Plus, Sparkles, Copy, Download, Settings2, Square, Wand2, Share2, 
  ChevronLeft, Shield, FileCode, Cpu, Presentation, RefreshCw, LayoutTemplate,
  MessageSquare, Info
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore'; 
import { skins } from '../data/skins';
import DraftCard from './DraftCard'; 
import MarkdownBlockEditor from './MarkdownBlockEditor';
import PostProductionGuide from './PostProductionGuide';
import { DraftParagraph } from '../data/types';

// 🚀 新增：即時視覺預覽組件 (WYSIWYG 引擎)
const TIER_COLORS = {
  down: { bg: 'rgba(82, 183, 136, 0.1)', border: '#52B788' },
  core: { bg: 'rgba(232, 168, 76, 0.1)', border: '#E8A84C' },
  up: { bg: 'rgba(91, 143, 196, 0.1)', border: '#5B8FC4' }
};

const PAGE_TYPE_COLORS: Record<string, string> = {
  TYPE_A: '#3A2515', // Cover
  TYPE_B: '#2D6A4F', // Map
  TYPE_C: '#1B4F72', // Tools
  TYPE_D: '#E07A5F', // Action
  TYPE_E: '#7B5EA7', // Fork
  TYPE_F1: '#C4943A', // End Strategy
  TYPE_F2: '#C4943A', // End Final
};

function SlidePreview({ mdContent }: { mdContent: string }) {
  const { skinId, grade } = useAppStore();
  const gradeSkins = (skins as any)[grade] || [];
  const currentSkin = gradeSkins.find((s: any) => s.id === skinId) || gradeSkins[0];
  const metaphor = currentSkin?.metaphor || { vocab: '詞彙', sentence: '句型', essay: '作文' };

  const slides = useMemo(() => {
    if (!mdContent) return [];
    const cleanContent = mdContent.replace(/^━+[\s\S]*?━+\n*/, '');
    const chunks = cleanContent.split(/(?=【版型】)/);
    return chunks.filter(c => c.includes('## Slide'));
  }, [mdContent]);

  if (slides.length === 0) {
    return <EmptyState text="等待 AI 生成，幻燈片將即時渲染於此。" />;
  }

  return (
    <div className="grid grid-cols-1 gap-12 pb-20">
      {slides.map((slide, index) => {
        // 提取版型資訊
        const layoutMatch = slide.match(/【版型】(TYPE_[A-Z0-9]+)/);
        const layoutType = layoutMatch ? layoutMatch[1] : 'TYPE_C';
        
        // 拆分 AUDIO 與 VISUAL
        const visualSplit = slide.split(/### .*?VISUAL.*?\n/i);
        const visualPart = visualSplit[1] || "";
        const audioSplit = visualSplit[0].split(/### .*?AUDIO.*?\n/i);
        const audioPart = audioSplit[1] || "";
        
        // 提取標題
        const titleMatch = slide.match(/## (Slide .*?)\n/);
        const title = titleMatch ? titleMatch[1] : `Slide ${index + 1}`;

        return (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col gap-6"
          >
            {/* 🖥️ 投影片視覺預覽 (Slide Box) */}
            <div className="aspect-video bg-[#FFFDF5] border-2 border-[var(--border)] rounded-[16px] shadow-2xl overflow-hidden flex flex-col relative group font-sans">
              {/* 1.3 頁面類型識別色 (左上角色條) */}
              <div 
                className="absolute left-0 top-0 w-[8px] h-full z-10" 
                style={{ backgroundColor: PAGE_TYPE_COLORS[layoutType] || '#3A2515' }}
              />
              
              {/* 視覺內容渲染區 */}
              <div className="flex-1 pl-[24px] pr-8 py-8 overflow-y-auto custom-scrollbar relative">
                {/* 頁碼標示 */}
                <div className="absolute top-4 right-6 text-[10px] text-[var(--brown-mid)] font-sans">
                  {title}
                </div>

                {/* 根據版型渲染不同內容 */}
                <div className="h-full">
                  {renderVisualContent(layoutType, visualPart, title, metaphor)}
                </div>
              </div>

              {/* 4. 版權標示規格 (全域強制) */}
              <div className="absolute bottom-[12px] right-[16px] text-[10px] text-[var(--brown-mid)] font-sans">
                ©Bee老師 🐝作文教室
              </div>
              
              {/* Tools/Action 頁面底部橫線 */}
              {(layoutType === 'TYPE_C' || layoutType === 'TYPE_D') && (
                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[var(--amber)]" />
              )}
            </div>

            {/* 🎧 聽覺腳本附註 (Audio Notes) */}
            <div className="bg-white/40 backdrop-blur-sm border-2 border-[var(--border)] rounded-[24px] p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--amber)] opacity-50" />
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-[var(--amber)] text-white rounded-lg shadow-sm">
                  <MessageSquare size={14} />
                </div>
                <span className="text-[11px] font-black tracking-widest text-[var(--brown-mid)] uppercase">Audio Script / NotebookLM Notes</span>
              </div>
              <div className="markdown-preview text-[13px] text-[var(--brown-deep)]/80 leading-relaxed italic pl-2">
                {audioPart.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{audioPart}</ReactMarkdown>
                ) : (
                  <p className="opacity-40">⚠️ 尚未生成聽覺腳本內容</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// 🚀 視覺內容渲染引擎
function renderVisualContent(type: string, content: string, title: string, metaphor: any) {
  if (!content.trim()) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[var(--brown-light)] opacity-40 italic gap-2">
        <LayoutTemplate size={32} />
        <p>⚠️ 尚未生成視覺畫面內容</p>
      </div>
    );
  }

  // 輔助函數：提取特定標籤內容
  const extract = (tag: string) => {
    const regex = new RegExp(`- \\*\\*\\[${tag}\\]\\*\\*：(.*?)(?=\\n- |\\n🎨|$)`, 's');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  const extractBySuffix = (suffix: string) => {
    const regex = new RegExp(`- \\*\\*\\[.*${suffix}\\]\\*\\*：(.*?)(?=\\n- |\\n🎨|$)`, 's');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  const extractSection = (title: string) => {
    const regex = new RegExp(`- \\*\\*${title}\\*\\*：(.*?)(?=\\n- |\\n🎨|$)`, 's');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  const extractPrompt = () => {
    const match = content.match(/🎨 Gemini Prompt：(.*?)(?=\n|$)/s);
    return match ? match[1].trim() : '';
  };

  const slogan = content.match(/💡 (.*?)(?=\n|$)/)?.[1] || '';

  switch (type) {
    case 'TYPE_A': // Cover
      return (
        <div className="h-full flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[400px] h-[400px] bg-[var(--amber)]/10 rounded-full blur-3xl" />
          </div>
          <div className="z-10 text-center flex flex-col items-center gap-4">
            <span className="text-4xl">🐝</span>
            <h1 className="text-[36px] font-serif font-bold text-[var(--brown-deep)] leading-[1.3]">
              {extract('作文題目') || '未命名作文題目'}
            </h1>
            <p className="text-[15px] italic text-[var(--brown-mid)] font-sans">
              {extract('皮膚 tagline') || slogan}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-4xl">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[var(--warm)] p-4 rounded-[12px] border-l-4 border-[var(--amber)] shadow-sm">
                <p className="text-[13px] text-[var(--brown-deep)]">💡 寫作提示 {i}</p>
              </div>
            ))}
          </div>
          <div className="absolute bottom-12 left-0 w-full px-8">
            <div className="bg-[var(--brown-deep)] text-white p-4 rounded-l-[8px] italic text-[15px] font-sans">
              🗣️ {extract('host_line') || '準備好開始今天的寫作特訓了嗎？'}
            </div>
          </div>
        </div>
      );

    case 'TYPE_B': // Map
      return (
        <div className="h-full flex flex-col">
          <h2 className="text-[20px] font-bold text-[var(--green-deep)] mb-8 flex items-center gap-2">
            📝 {title.split('：')[1] || '文章結構地圖'}
          </h2>
          <div className="flex-1 flex items-center justify-center gap-4">
            {['開頭段', '主體段', '結尾段'].map((step, i) => (
              <React.Fragment key={i}>
                <div className={`flex-1 max-w-[200px] p-5 rounded-[12px] border-2 bg-white shadow-md ${
                  i === 0 ? 'border-[var(--green-mid)]' : i === 1 ? 'border-[var(--amber)]' : 'border-[var(--blue-mid)]'
                }`}>
                  <h3 className="font-bold text-[15px] mb-3">{step}</h3>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-slate-100 rounded" />
                    <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
                  </div>
                </div>
                {i < 2 && <span className="text-[var(--amber)] text-2xl">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      );

    case 'TYPE_Q': // Question
      const questionGroup = extract('引導式提問組');
      // 嘗試解析 1. 2. 3. 格式
      const questions = questionGroup ? questionGroup.split('\n').filter(q => q.trim().match(/^\d+\./)) : [];

      return (
        <div className="h-full flex flex-col gap-6">
          <div className="bg-[var(--brown-deep)] text-white px-6 py-4 -mx-6 -mt-8 flex items-center gap-3">
            <span className="text-xl">❓</span>
            <h2 className="text-[20px] font-bold">{title.split('：')[1] || '核心提問組'}</h2>
          </div>
          <div className="bg-[var(--warm)] px-4 py-2 -mx-6 italic text-[12px] text-[var(--brown-mid)] text-center">
            💡 {extract('思考金句') || slogan}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            {questions.length > 0 ? (
              <div className="w-full max-w-[85%] space-y-4">
                {questions.map((q, i) => (
                  <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--amber)] text-[var(--brown-deep)] flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </span>
                    <p className="text-[18px] font-serif font-bold text-[var(--brown-deep)] leading-snug">
                      {q.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[28px] font-serif font-black text-[var(--brown-deep)] text-center leading-tight max-w-[80%]">
                {extract('核心提問') || '提問內容生成中...'}
              </div>
            )}
            <div className="p-4 bg-white/50 rounded-2xl border-2 border-dashed border-[var(--amber)] text-[var(--brown-mid)] text-sm italic">
              🔍 {extract('視覺容器與材質') || '觀察畫面中的細節...'}
            </div>
          </div>
          <GeminiPromptBox prompt={extractPrompt()} />
        </div>
      );

    case 'TYPE_C': // Tools
      return (
        <div className="h-full flex flex-col gap-6">
          <div className="bg-[var(--brown-deep)] text-white px-6 py-4 -mx-6 -mt-8 flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <h2 className="text-[20px] font-bold">{title.split('：')[1] || '戰術裝備篇'}</h2>
          </div>
          <div className="bg-[var(--warm)] px-4 py-2 -mx-6 italic text-[12px] text-[var(--brown-mid)]">
            {slogan}
          </div>
          <div className="bg-[var(--amber-light)] border-l-4 border-[var(--amber)] p-3 text-[15px] font-bold">
            📌 {extract('focus 寫作重點') || '寫作重點'}
          </div>
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="space-y-4">
              <h3 className="text-[15px] font-bold flex items-center gap-2">🎒 {metaphor.vocab}補給站</h3>
              <div className="grid grid-cols-2 gap-2">
                {['👁️ 視覺', '💛 感受', '🤸 動作', '✨ 特殊'].map(v => (
                  <div key={v} className="bg-white p-2 rounded border border-[var(--border)] text-[13px]">
                    {v}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[15px] font-bold flex items-center gap-2">🦴 {metaphor.sentence}骨架</h3>
              <div className="space-y-2">
                {['down', 'core', 'up'].map(tier => (
                  <div key={tier} className="flex items-center gap-2 p-2 rounded" style={{ 
                    backgroundColor: TIER_COLORS[tier as keyof typeof TIER_COLORS].bg,
                    borderLeft: `4px solid ${TIER_COLORS[tier as keyof typeof TIER_COLORS].border}`
                  }}>
                    <span className="text-[11px] font-bold uppercase w-10">{tier}</span>
                    <div className="h-2 flex-1 bg-white/50 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-[15px] font-bold flex items-center gap-2">🔮 修辭增幅</h3>
            <div className="grid grid-cols-3 gap-3">
              {['down', 'core', 'up'].map(tier => (
                <div key={tier} className="p-3 rounded border" style={{ 
                  backgroundColor: TIER_COLORS[tier as keyof typeof TIER_COLORS].bg,
                  borderColor: TIER_COLORS[tier as keyof typeof TIER_COLORS].border
                }}>
                  <span className="text-[11px] font-bold uppercase block mb-1">{tier}</span>
                  <div className="h-4 bg-white/50 rounded" />
                </div>
              ))}
            </div>
          </div>
          <GeminiPromptBox prompt={extractPrompt()} />
        </div>
      );

    case 'TYPE_D': // Action
      return (
        <div className="h-full flex flex-col gap-6">
          <div className="bg-[var(--coral)] text-white px-6 py-4 -mx-6 -mt-8 flex items-center gap-3">
            <span className="text-xl">✍️</span>
            <h2 className="text-[20px] font-bold">{title.split('：')[1] || '實戰演練篇'}</h2>
          </div>
          <div className="space-y-4 flex-1">
            <h3 className="text-[15px] font-bold flex items-center gap-2">🦴 {metaphor.essay}示範</h3>
            <div className="bg-white p-6 rounded-[12px] shadow-md border border-[var(--border)] font-serif text-[17px] leading-[1.8]">
              {extractBySuffix('示範') || '示範內容生成中...'}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[15px] font-bold flex items-center gap-2">🚑 {metaphor.sentence}急救站</h3>
            <div className="space-y-2">
              {['down', 'core', 'up'].map(tier => (
                <div key={tier} className="flex items-center gap-2 p-3 rounded border" style={{ 
                  backgroundColor: TIER_COLORS[tier as keyof typeof TIER_COLORS].bg,
                  borderColor: TIER_COLORS[tier as keyof typeof TIER_COLORS].border,
                  borderLeftWidth: '4px'
                }}>
                  <span className="text-[11px] font-bold uppercase w-10">{tier}</span>
                  <div className="flex-1 border-b border-dashed border-[var(--brown-mid)] h-4" />
                </div>
              ))}
            </div>
          </div>
          <GeminiPromptBox prompt={extractPrompt()} />
        </div>
      );

    case 'TYPE_E': // Fork
      return (
        <div className="h-full flex flex-col gap-6">
          <div className="bg-[var(--purple-deep)] text-white px-6 py-4 -mx-6 -mt-8 flex items-center gap-3" style={{ backgroundColor: '#7B5EA7' }}>
            <span className="text-xl">🔀</span>
            <h2 className="text-[20px] font-bold">{title.split('：')[1] || '分歧路徑選擇'}</h2>
          </div>
          <div className="flex-1 flex items-center justify-center gap-4">
            {['Path A', 'Path B', 'Path C'].map((path, i) => (
              <div key={i} className="flex-1 max-w-[240px] bg-white rounded-[16px] border-2 border-transparent hover:border-[var(--amber)] transition-all shadow-lg overflow-hidden flex flex-col">
                <div className="h-20 flex items-center justify-center text-3xl" style={{ backgroundColor: i === 0 ? 'rgba(82, 183, 136, 0.1)' : i === 1 ? 'rgba(91, 143, 196, 0.1)' : 'rgba(123, 94, 167, 0.1)' }}>
                  {i === 0 ? '👁️' : i === 1 ? '👂' : '🤲'}
                </div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <h3 className="font-bold text-[16px]">{path}</h3>
                  <div className="text-[11px] bg-slate-100 px-2 py-1 rounded-full w-fit">路徑標籤</div>
                  <div className="border-t pt-2">
                    <p className="text-[11px] font-bold text-[var(--brown-mid)] mb-1">詞彙預覽</p>
                    <div className="h-4 bg-slate-50 rounded" />
                  </div>
                  <div className="border-t pt-2">
                    <p className="text-[11px] font-bold text-[var(--brown-mid)] mb-1">示範句預覽</p>
                    <div className="h-8 bg-slate-50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[var(--amber-light)] border border-[var(--amber)] p-3 rounded text-[13px] text-center">
            💡 選好路徑後，翻到對應的 Tools + Action 頁
          </div>
        </div>
      );

    case 'TYPE_F1': // End Strategy
      return (
        <div className="h-full flex flex-col gap-6">
          <div className="bg-[#C4943A] text-white px-6 py-4 -mx-6 -mt-8 flex items-center gap-3">
            <span className="text-xl">🗺️</span>
            <h2 className="text-[20px] font-bold">{title.split('：')[1] || '戰術地圖 — 思考導航儀'}</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-[60%] aspect-square bg-white border-2 border-dashed border-[var(--amber)] rounded-full flex items-center justify-center text-[var(--amber)]">
              Thinking Tool 圖解區
            </div>
            <p className="text-[15px] font-bold">📌 使用時機說明</p>
          </div>
        </div>
      );

    case 'TYPE_F2': // End Final
      return (
        <div className="h-full flex flex-col gap-6">
          <div className="bg-[#C4943A] text-white px-6 py-4 -mx-6 -mt-8 flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <h2 className="text-[20px] font-bold">{title.split('：')[1] || '最終成果 — 任務完成'}</h2>
          </div>
          <div className="bg-white p-6 rounded-[12px] border-l-4 border-[var(--amber)] shadow-md font-serif text-[17px]">
            {extractBySuffix('示範段落') || '結尾示範內容生成中...'}
          </div>
          <div className="space-y-4">
            <h3 className="text-[15px] font-bold flex items-center gap-2">✅ 任務檢核表</h3>
            <div className="flex gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[var(--brown-mid)] rounded" />
                  <span className="text-[13px]">檢核點 {i}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto bg-[var(--amber)] text-[var(--brown-deep)] p-3 rounded-[8px] text-center font-bold">
            🎉 恭喜完成任務！你做得太棒了！
          </div>
        </div>
      );

    default:
      return <div>{content}</div>;
  }
}

function GeminiPromptBox({ prompt }: { prompt: string }) {
  if (!prompt) return null;
  return (
    <div className="mt-auto bg-[#F5F5F5] border border-[#CCCCCC] rounded-[8px] p-3 font-mono text-[10px] text-gray-500">
      <p className="font-bold mb-1">🎨 Gemini 圖像提示（製作者參考，不進投影片正文）</p>
      <p className="whitespace-pre-wrap">{prompt}</p>
    </div>
  );
}

export default function Step4Draft({
  drafts, loading, genres, isGeneratingStream,
  handleAddPara, updateParaField, handleDeletePara,
  handleRegenPara, handleRegenFullPara, handleGenerate, handleStopGeneration,
  copyToClipboard, copyForNotebookLM,
  handleBackToStep, handleValidateSentence, handleAdjustSentence,
  handleGenerateForkDetails, handleDeleteForkPath, handleToggleFork
}: any) {
  
  const store = useAppStore();
  const { mdOutput, yamlOutput, activeTab, setActiveTab, handleTransformToYAML, isConverting, topic } = store;
  const outputEndRef = useRef<HTMLDivElement>(null);

  // 🚀 動態檔名下載函數
  const handleDownload = () => {
    // 根據當前頁籤決定要下載 MD 還是 YAML
    let content = store.activeTab === 'yaml' ? store.yamlOutput : store.mdOutput;
    // 🚨 關鍵修正：如果是 YAML 頁籤，強制將副檔名改為 'txt'，以符合 NotebookLM 的上傳限制
    const extension = store.activeTab === 'yaml' ? 'txt' : 'md';
    
    if (!content) {
      store.showToast('請先產生內容再點擊下載！', 'error');
      return;
    }

    // 🚀 核心修復：如果是 YAML，清除 AI 產生的 ```yaml 與 ``` 標籤
    if (store.activeTab === 'yaml') {
      content = content
        .replace(/```[a-z]*\n?/gi, '') // 移除開頭的 ```yaml
        .replace(/```/g, '')           // 移除結尾的 ```
        .trim();                       // 清除多餘空白與換行
    }

    // 清理檔名中的特殊字元
    const safeTopic = store.topic ? store.topic.replace(/[/\\?%*:|"<>]/g, '-') : '未命名腳本';
    const fileName = `${safeTopic}_NotebookLM腳本.${extension}`;

    // 建立 Blob 並觸發瀏覽器下載
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if ((isGeneratingStream || isConverting) && outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [mdOutput, yamlOutput, isGeneratingStream, isConverting]);

  // 🚀 全新 Marp 簡報匯出引擎 (直連 mdOutput)
  const handleDownloadMarp = () => {
    if (!store.mdOutput) {
      store.showToast("請先產生腳本內容，再下載簡報！", "error");
      return;
    }

    // 1. 建立高質感的 Marp 標頭與 CSS 樣式
    const marpHeader = `---
marp: true
theme: default
paginate: true
size: 16:9
style: |
  section {
    background-color: #FAFAFA;
    color: #333;
    font-family: 'Noto Sans TC', sans-serif;
  }
  h1 { color: #3A2515; font-size: 2.2em; border-bottom: 4px solid #E8A84C; padding-bottom: 0.2em; }
  h2 { color: #2D6A4F; font-size: 1.6em; }
  h3 { color: #1B4F72; font-size: 1.2em; }
  strong { color: #E07A5F; }
  blockquote { 
    border-left: 6px solid #E8A84C; 
    background: #FFF0D4; 
    border-radius: 0 12px 12px 0;
    padding: 1em;
  }
---

`;

    // 2. 清理與格式化 mdOutput
    let marpContent = store.mdOutput
      // 將頂部的 Audio 提示詞區塊隱藏，不讓它出現在投影片上
      .replace(/## 🎙️ NotebookLM Audio[\s\S]*?---\n/i, '') 
      // 將【版型】標記轉換為 HTML 註解，這樣編輯器看得到，但放映時會隱藏
      .replace(/(【版型】.*?|\[Layout\].*?)\n/gi, '\n')
      // 確保 Part 1, Part 2 標題前面有強制換頁
      .replace(/## Part/g, '---\n\n## Part');

    // 3. 組合最終內容
    const finalMarp = marpHeader + marpContent;

    // 4. 觸發下載
    const safeTopic = store.topic ? store.topic.replace(/[/\\?%*:|"<>]/g, '-') : '未命名簡報';
    const fileName = `${safeTopic}_Bee老師Marp簡報.md`;

    const blob = new Blob([finalMarp], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6 overflow-hidden">
      {/* 左側：分鏡編排區 */}
      <div className="w-full md:w-[45%] flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar pb-32 relative">
        <div className="flex flex-col gap-3 sticky top-0 bg-[var(--cream)] py-4 z-20 border-b border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => handleBackToStep(4)} className="text-[10px] font-bold text-[var(--brown-mid)] hover:text-[var(--amber)] bg-white px-3 py-1.5 rounded-full border border-[var(--border)] shadow-sm"><ChevronLeft size={12} className="inline"/> 風格</button>
            <button onClick={() => handleBackToStep(3)} className="text-[10px] font-bold text-[var(--brown-mid)] hover:text-[var(--amber)] bg-white px-3 py-1.5 rounded-full border border-[var(--border)] shadow-sm"><ChevronLeft size={12} className="inline"/> 皮膚</button>
            <button onClick={() => handleBackToStep(2)} className="text-[10px] font-bold text-[var(--brown-mid)] hover:text-[var(--amber)] bg-white px-3 py-1.5 rounded-full border border-[var(--border)] shadow-sm"><ChevronLeft size={12} className="inline"/> 骨架</button>
            <button onClick={() => handleBackToStep(1)} className="text-[10px] font-bold text-[var(--brown-mid)] hover:text-[var(--amber)] bg-white px-3 py-1.5 rounded-full border border-[var(--border)] shadow-sm"><ChevronLeft size={12} className="inline"/> 題目</button>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-black flex items-center gap-2 text-[var(--brown-deep)]"><Settings2 size={18} className="text-[var(--amber)]"/> 分鏡草稿工作室</h3>
            <div className="flex gap-2">
              <button 
                onClick={useAppStore.getState().handleSmoothTransitions} 
                disabled={loading || drafts.length < 2}
                className="text-[10px] font-bold text-[var(--blue-deep)] hover:text-[var(--brown-deep)] transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[var(--border)] disabled:opacity-50"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> 優化銜接
              </button>
              <button 
                onClick={useAppStore.getState().handleValidateSentences} 
                disabled={loading || drafts.length === 0}
                className="text-[10px] font-bold text-[var(--coral)] hover:text-[var(--brown-deep)] transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[var(--border)] disabled:opacity-50"
              >
                <Shield size={12} className={loading ? 'animate-spin' : ''} /> 認知校準
              </button>
              <button onClick={handleAddPara} className="text-xs font-bold text-[var(--amber)] hover:text-[var(--brown-deep)] transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[var(--border)]"><Plus size={14} /> 插入新頁面</button>
            </div>
          </div>
        </div>

        {drafts.map((para: DraftParagraph, idx: number) => (
          <DraftCard 
            key={idx} idx={idx} para={para} genres={genres} 
            loading={loading || isGeneratingStream} 
            updateParaField={updateParaField} 
            handleDeletePara={handleDeletePara} 
            handleRegenPara={handleRegenPara} 
            handleRegenFullPara={handleRegenFullPara} 
            handleValidateSentence={handleValidateSentence} 
            handleAdjustSentence={handleAdjustSentence} 
            handleGenerateForkDetails={handleGenerateForkDetails}
            handleDeleteForkPath={handleDeleteForkPath}
            handleToggleFork={handleToggleFork}
            updateQuestions={useAppStore.getState().updateQuestions}
          />
        ))}

        {/* ===== 🚀 修正：將啟動引擎按鈕移到這裡（所有卡片的最下方） ===== */}
        <div className="mt-12 pt-12 pb-32 flex flex-col items-center justify-center border-t-2 border-dashed border-[var(--warm)]">
          <div className="bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-[var(--border)] mb-6 shadow-sm">
            <p className="text-[12px] font-black text-[var(--brown-mid)] tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--amber)]" />
              所有分鏡與提問確認完畢後，即可產出最終腳本
            </p>
          </div>
          
          {isGeneratingStream ? (
            <button 
              onClick={handleStopGeneration}
              className="px-12 py-5 bg-[var(--coral)] text-white rounded-full text-lg font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
            >
              <Square size={22} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
              停止生成內容
            </button>
          ) : (
            <button 
              onClick={handleGenerate}
              disabled={loading || drafts.length === 0}
              className="px-12 py-5 bg-[var(--brown-deep)] text-white rounded-full text-lg font-black shadow-2xl hover:bg-[var(--amber)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Wand2 size={22} className="group-hover:rotate-12 transition-transform" /> 
              啟動 AI 分段串流引擎
            </button>
          )}
          
          <p className="mt-6 text-[10px] text-[var(--brown-light)] italic">
            💡 提示：點擊後 AI 將依照您的設定，逐段生成完整的教學腳本與視覺指令。
          </p>
        </div>
      </div>

      {/* 右側：三分頁渲染區 */}
      <div className="flex-1 bg-[var(--warm)] rounded-[40px] shadow-inner border-4 border-[var(--border)] flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-[var(--border)] bg-white/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
           
            {/* 🚀 新增：四分頁切換 */}
            <div className="flex bg-[var(--warm)] p-1 rounded-2xl shadow-inner">
               <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-white text-[var(--brown-deep)] shadow-sm' : 'text-[var(--brown-light)] hover:text(--brown-mid)'}`}><LayoutTemplate size={14}/> 視覺預覽</button>
               <button onClick={() => setActiveTab('md')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'md' ? 'bg-white text-[var(--brown-deep)] shadow-sm' : 'text-[var(--brown-light)] hover:text(--brown-mid)'}`}><Shield size={14}/> MD 代碼</button>
               <button onClick={() => setActiveTab('yaml')} disabled={!mdOutput && !yamlOutput} className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'yaml' ? 'bg-[var(--brown-deep)] text-white shadow-sm' : 'text-[var(--brown-light)] hover:text(--brown-mid) disabled:opacity-30'}`}><Cpu size={14}/> YAML 封蠟</button>
               <button onClick={() => setActiveTab('guide')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'guide' ? 'bg-[var(--amber)] text-white shadow-sm' : 'text-[var(--brown-light)] hover:text(--brown-mid)'}`}><Info size={14}/> 製作指南</button>
            </div>

           <div className="flex gap-2">
             {activeTab !== 'yaml' && mdOutput && (
               <>
                 <button onClick={handleTransformToYAML} disabled={isConverting} className="px-4 py-2 bg-[var(--amber)] text-white rounded-xl text-xs font-black flex items-center gap-2 hover:bg-[var(--brown-mid)] transition-all shadow-sm"><Sparkles size={14}/> 轉換 YAML</button>
                 <button onClick={copyForNotebookLM} className="p-2 bg-white text-[var(--brown-mid)] rounded-xl" title="複製 NotebookLM 指令"><Share2 size={18}/></button>
                 <button 
                   onClick={handleDownload} 
                   className="p-3 bg-white text-[var(--brown-deep)] border border-[var(--border)] rounded-2xl hover:bg-[var(--warm)] transition-colors shadow-sm"
                   title={`下載 ${activeTab.toUpperCase()} 檔案`}
                 >
                   <Download size={18} />
                 </button>
               </>
             )}
             {activeTab === 'yaml' && yamlOutput && (
               <>
                 <button onClick={handleTransformToYAML} disabled={isConverting} className="p-2 bg-white text-[var(--brown-mid)] rounded-xl"><RefreshCw size={18} className={isConverting?'animate-spin':''}/></button>
                 <button onClick={handleDownloadMarp} className="p-2 bg-white text-[var(--brown-mid)] rounded-xl" title="匯出簡報"><Presentation size={18}/></button>
                 <button 
                   onClick={handleDownload} 
                   className="p-3 bg-white text-[var(--brown-deep)] border border-[var(--border)] rounded-2xl hover:bg-[var(--warm)] transition-colors shadow-sm"
                   title={`下載 ${activeTab.toUpperCase()} 檔案`}
                 >
                   <Download size={18} />
                 </button>
               </>
             )}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* 🚀 視覺預覽區 */}
            {activeTab === 'preview' && (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                <SlidePreview mdContent={mdOutput} />
              </motion.div>
            )}

            {activeTab === 'md' && (
              <motion.div key="md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                <MarkdownBlockEditor />
              </motion.div>
            )}

            {activeTab === 'yaml' && (
              <motion.div key="yaml" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[11px] bg-slate-800 text-green-400 p-6 rounded-3xl shadow-inner">
                {yamlOutput ? <pre className="whitespace-pre-wrap leading-relaxed">{yamlOutput}</pre> : <EmptyState text="等待 YAML 轉譯..." />}
              </motion.div>
            )}

            {activeTab === 'guide' && (
              <motion.div key="guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <PostProductionGuide />
              </motion.div>
            )}

          </AnimatePresence>
          <div ref={outputEndRef} className="h-10" />
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-full py-20 flex flex-col items-center justify-center text-[var(--brown-light)] opacity-50 text-center">
      <LayoutTemplate size={48} className="mb-4" />
      <p className="font-bold">{text}</p>
    </div>
  );
}
