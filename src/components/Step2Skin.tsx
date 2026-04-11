import React from 'react';
import { motion } from 'motion/react';
import { skins } from '../data/skins';
import { useAppStore } from '../store/useAppStore';
import { MessageSquareQuote, Sparkles } from 'lucide-react';

interface Step2SkinProps {
  grade: string;
  skinId: string;
  setSkinId: (id: string) => void;
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
}

export default function Step2Skin({ grade, skinId, setSkinId, setStep }: Step2SkinProps) {
  const { customTones, setCustomTone } = useAppStore();

  return (
    <motion.div 
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-[var(--brown-deep)]">選擇敘事皮膚</h2>
        <p className="text-[var(--brown-mid)] font-medium">這將決定 Bee 老師在腳本中的語氣與角色設定</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {skins[grade as keyof typeof skins]?.map((s) => (
          <div
            key={s.id}
            onClick={() => { setSkinId(s.id); setStep(4); }}
            className={`group relative p-8 rounded-[40px] border-4 transition-all text-left space-y-4 cursor-pointer ${
              skinId === s.id ? 'border-[var(--amber)] bg-white shadow-xl' : 'border-transparent bg-white hover:border-[var(--border)] shadow-sm'
            }`}
          >
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-inner ${
              s.type === 'fun' ? 'bg-[var(--amber-light)]' : 'bg-[var(--blue-light)]'
            }`}>
              {s.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--brown-deep)]">{s.name}</h3>
              <p className="text-sm text-[var(--brown-mid)] opacity-70 mt-2 leading-relaxed">{s.desc}</p>
            </div>

            {/* 🚀 新增：自定義語氣編輯區 */}
            <div 
              className="mt-4 pt-4 border-t border-dashed border-[var(--border)] space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--brown-mid)] uppercase tracking-wider">
                  <MessageSquareQuote size={12} />
                  <span>導師語氣設定</span>
                </div>
                <div className="flex items-center gap-1 text-[8px] text-[var(--brown-mid)] bg-[var(--amber-light)]/50 px-2 py-0.5 rounded-full">
                  <Sparkles size={8} className="text-[var(--amber)]" />
                  <span>專家提示：試試「像說故事一樣」、「用靈感碎片引導」、「扮演溫柔的奶奶」或「讓文字在雲朵上跳舞」</span>
                </div>
              </div>
              <input
                type="text"
                value={customTones[s.id] ?? s.tone}
                onChange={(e) => setCustomTone(s.id, e.target.value)}
                placeholder="可在此輸入自訂導師語氣..."
                className="w-full bg-[var(--brown-light)]/5 border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--brown-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/50 transition-all"
              />
            </div>

            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              s.type === 'fun' ? 'bg-[var(--amber)] text-white' : 'bg-[var(--blue-deep)] text-white'
            }`}>
              {s.type === 'fun' ? '趣味沉浸' : '寫實引導'}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
