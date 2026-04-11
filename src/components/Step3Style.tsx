import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';

interface StyleItem {
  id: string;
  name: string;
  en: string;
  cat: string;
}

interface Step3StyleProps {
  cat: string;
  setCat: (cat: string) => void;
  search: string;
  setSearch: (search: string) => void;
  styleId: string;
  setStyleId: (id: string) => void;
  filteredStyles: StyleItem[];
  onSelectStyle: (id: string) => void;
}

export default function Step3Style({ 
  cat, setCat, search, setSearch, styleId, setStyleId, filteredStyles, onSelectStyle 
}: Step3StyleProps) {
  return (
    <motion.div 
      key="step3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-[var(--brown-deep)]">選擇視覺風格</h2>
          <p className="text-[var(--brown-mid)] font-medium">這將決定 AI 生成圖片的提示詞與畫面感</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brown-light)]" size={18} />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋風格名稱..."
              className="pl-12 pr-6 py-3 bg-white rounded-2xl border border-[var(--border)] font-bold text-sm outline-none focus:border-[var(--amber)] w-full md:w-64 shadow-sm"
            />
          </div>
          <select 
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="px-6 py-3 bg-white rounded-2xl border border-[var(--border)] font-bold text-sm outline-none focus:border-[var(--amber)] shadow-sm"
          >
            <option value="ALL">所有類別</option>
            <option value="A">A: 經典插畫</option>
            <option value="B">B: 現代數位</option>
            <option value="C">C: 藝術派系</option>
            <option value="B1">B1: 奇幻冒險</option>
            <option value="B2">B2: 溫馨療癒</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredStyles.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              console.log("[STEP3_DEBUG] Style selected:", s.id, s.name);
              onSelectStyle(s.id);
            }}
            className={`group p-4 rounded-3xl border-2 transition-all text-left space-y-3 ${
              styleId === s.id ? 'border-[var(--amber)] bg-[var(--amber-light)]' : 'border-transparent bg-white hover:border-[var(--border)] shadow-sm'
            }`}
          >
            <div className="aspect-square bg-[var(--warm)] rounded-2xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🎨
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--brown-deep)] truncate">{s.name}</h3>
              <p className="text-[10px] text-[var(--brown-mid)] opacity-50 font-bold truncate uppercase">{s.en}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
