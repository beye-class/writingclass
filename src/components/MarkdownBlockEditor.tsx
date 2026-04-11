import React from 'react';
import { Trash2, Edit3, Wand2, FileText, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function MarkdownBlockEditor() {
  const { mdOutput, setMdOutput, handleTransformToYAML, isConverting } = useAppStore();

  if (!mdOutput) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--brown-light)] opacity-50">
        <FileText size={48} className="mb-4" />
        <p className="font-black tracking-widest">尚未生成 Markdown 腳本</p>
      </div>
    );
  }

  // 🚀 終極修復：放棄危險的 Lookahead，改用「捕獲群組 (Capturing Group)」精準切分
  // 這樣切出來的陣列會是：[ "前言...", "【版型】", "內容A...", "Layout", "內容B..." ]
  const parts = mdOutput.split(/(【版型】|版型|\[Layout\]|Layout)/i);
  
  // 手動將切碎的陣列無縫重組為正確的卡片區塊
  const chunks: string[] = [parts[0]];
  for (let i = 1; i < parts.length; i += 2) {
    chunks.push(parts[i] + (parts[i + 1] || ''));
  }

  // 更新單一區塊內容
  const updateChunk = (idx: number, newVal: string) => {
    const newChunks = [...chunks];
    newChunks[idx] = newVal;
    setMdOutput(newChunks.join('')); 
  };

  // 刪除單一區塊
  const deleteChunk = (idx: number) => {
    if (window.confirm('確定要刪除這頁投影片嗎？刪除後，它將不會被轉譯到最終的 YAML 中！')) {
      const newChunks = chunks.filter((_, i) => i !== idx);
      setMdOutput(newChunks.join('')); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-[var(--amber-light)]/30 border border-[var(--amber)] rounded-2xl p-4 flex items-start gap-3">
        <CheckCircle className="text-[var(--amber)] shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-sm font-black text-[var(--brown-deep)]">最終腳本審閱站 (Human-in-the-Loop)</h3>
          <p className="text-xs font-medium text-[var(--brown-mid)] mt-1">
            這裡呈現的是 AI 剛生成的 Markdown 腳本。您可以手動修改錯字，或是直接刪除覺得多餘的投影片。確認無誤後，再點擊最下方的按鈕轉譯成 YAML！
          </p>
        </div>
      </div>

      {/* 渲染所有重組好的區塊 */}
      <div className="space-y-6">
        {chunks.map((chunk, idx) => {
          // 過濾掉因為 AI 亂換行產生的純空白幽靈區塊
          if (chunk.trim().length === 0) return null;

          const isPreamble = !/(?:【版型】|版型|\[Layout\]|Layout)/i.test(chunk);
          
          // 只抓取該行的文字當作標題，避免抓到整坨內文
          const titleMatch = chunk.match(/(?:【版型】|版型|\[Layout\]|Layout)[^\n]*/i);
          const blockTitle = isPreamble ? '📄 專案設定與規格表 (不可刪除)' : `🖼️ ${titleMatch ? titleMatch[0].trim() : `Slide 區塊 ${idx}`}`;

          return (
            <div key={idx} className="bg-white rounded-[20px] shadow-sm border border-[var(--border)] overflow-hidden group transition-all hover:shadow-md">
              <div className="bg-[var(--warm)]/50 px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-black text-[var(--brown-deep)] tracking-wider">
                  {blockTitle}
                </span>
                {!isPreamble && (
                  <button 
                    onClick={() => deleteChunk(idx)}
                    className="p-1.5 bg-white text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-[var(--border)] shadow-sm"
                    title="刪除此頁投影片"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="p-3 relative">
                <div className="absolute top-5 right-5 text-[var(--brown-light)] opacity-30 pointer-events-none">
                  <Edit3 size={24} />
                </div>
                <textarea
                  value={chunk}
                  onChange={(e) => updateChunk(idx, e.target.value)}
                  className="w-full text-[13px] font-medium leading-relaxed text-[var(--brown-deep)] bg-transparent border-none focus:ring-0 outline-none resize-none"
                  rows={chunk.split('\n').length + 1}
                  style={{ minHeight: isPreamble ? '150px' : '250px' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-6 mt-12 flex justify-center z-20">
        <button 
          onClick={handleTransformToYAML}
          disabled={isConverting}
          className="px-8 py-4 bg-[var(--blue-deep)] text-white rounded-full text-sm font-black shadow-[0_8px_30px_rgba(40,84,115,0.3)] hover:bg-[var(--blue-mid)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 size={18} className={isConverting ? "animate-spin" : ""} /> 
          {isConverting ? "NotebookLM 驅動引擎轉譯中..." : "✅ 確認腳本無誤，一鍵轉譯為 NotebookLM 專用 YAML"}
        </button>
      </div>
    </div>
  );
}
