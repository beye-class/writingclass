import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { gradeConfig } from '../data/grades';
import { skins } from '../data/skins';
import { styleLib } from '../data/styles';
import { THINKING_TOOLS_DETAILED } from '../data/strategies';
import { layoutSkills } from '../data/layouts';
import { PromptFactory } from '../data/prompts';
import { Skin, DraftParagraph, OutlineItem, SocraticMessage } from '../data/types';
import {
  generateOutline, generateDraft, regenerateForkPaths,
  regenerateParagraph, generateSingleParagraph, validateSentence,
  adjustSentenceDifficulty, generateFullScriptStream, generateSocraticQuestion, 
  refineOutlineWithDialogue, generateDetailedForkContent, analyzePoemStructure
} from '../services/gemini';

let globalAbortController: AbortController | null = null;

const handleError = (set: any, err: any, fallbackMessage: string) => {
  const msg = err.message || '';
  if (msg.includes('API_KEY_MISSING') || msg.includes('API Key')) {
    set({ showKeyModal: true, loading: false });
  } else {
    set({ error: msg || fallbackMessage, loading: false });
  }
};

// ============================================================================
// 🧩 切片 1：UI 與系統狀態 (UI & System Slice)
// 負責管理彈窗、錯誤、通知、分頁與 API Key 等全域狀態
// ============================================================================
interface UISlice {
  step: number;
  loading: boolean;
  error: string | null;
  showRules: boolean;
  showKeyModal: boolean;
  showRestartConfirm: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  apiKeyInput: string;
  apiKeys: string[];
  isLoaded: boolean;
  activeTab: 'md' | 'yaml' | 'preview' | 'guide';

  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setShowRules: (show: boolean) => void;
  setShowKeyModal: (show: boolean) => void;
  setShowRestartConfirm: (show: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  setApiKeyInput: (input: string) => void;
  setApiKeys: (keys: string[]) => void;
  addApiKey: (key: string) => void;
  removeApiKey: (index: number) => void;
  setIsLoaded: (loaded: boolean) => void;
  setActiveTab: (tab: 'md' | 'yaml' | 'preview' | 'guide') => void;
}

const createUISlice: StateCreator<SharedState, [], [], UISlice> = (set) => ({
  step: 1, loading: false, error: null, showRules: false, showKeyModal: false, showRestartConfirm: false,
  toast: null, apiKeyInput: '', apiKeys: [], isLoaded: false, activeTab: 'preview',
  
  setStep: (step) => set({ step }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setShowRules: (show) => set({ showRules: show }),
  setShowKeyModal: (show) => set({ showKeyModal: show }),
  setShowRestartConfirm: (show) => set({ showRestartConfirm: show }),
  showToast: (message, type = 'success') => { set({ toast: { message, type } }); setTimeout(() => set({ toast: null }), 3000); },
  setApiKeyInput: (apiKeyInput) => set({ apiKeyInput }),
  setApiKeys: (apiKeys) => set({ apiKeys }),
  addApiKey: (key) => set((state) => ({ apiKeys: [...state.apiKeys, key] })),
  removeApiKey: (index) => set((state) => ({ apiKeys: state.apiKeys.filter((_, i) => i !== index) })),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setActiveTab: (activeTab) => set({ activeTab }),
});

// ============================================================================
// 🧩 切片 2：專案資料與業務邏輯 (Project & Business Logic Slice)
// 負責管理大綱、草稿、皮膚、五感設定等核心編輯器邏輯
// ============================================================================
interface ProjectSlice {
  grade: string; topic: string; lastTopic: string; genres: string[]; skills: string[]; rhetoricSkills: string[];
  notes: string; originalPoem: string; poemStructure: string; outline: OutlineItem[]; thinkingTool: string;
  skinId: string; styleId: string; cat: string; search: string; drafts: DraftParagraph[];
  image: string | null; fiveSenses: { visual: string; auditory: string; olfactoryGustatoryTactile: string; };
  customTones: Record<string, string>; socraticHistory: SocraticMessage[]; socraticInput: string; isSocraticLoading: boolean; isDeconstructingPoem: boolean;

  setGrade: (v: string) => void; setTopic: (v: string) => void; setGenres: (v: string[]) => void;
  setSkills: (v: string[]) => void; setRhetoricSkills: (v: string[]) => void; setNotes: (v: string) => void;
  setOriginalPoem: (v: string) => void; setPoemStructure: (v: string) => void; setOutline: (v: OutlineItem[]) => void; setThinkingTool: (v: string) => void;
  setSkinId: (v: string) => void; setStyleId: (v: string) => void; setCat: (v: string) => void; setSearch: (v: string) => void;
  setDrafts: (v: DraftParagraph[]) => void; setImage: (v: string | null) => void;
  setFiveSenses: (v: any) => void; setCustomTone: (skin: string, tone: string) => void;
  setSocraticHistory: (v: SocraticMessage[]) => void; setSocraticInput: (v: string) => void;
  
  toggleGenre: (g: string) => void; toggleSkill: (s: string) => void; toggleRhetoricSkill: (s: string) => void;
  handleGoStep2: () => void; handleGenerateOutline: () => Promise<void>; handleGoDraft: (sId?: string) => Promise<void>;
  handleRegenPara: (idx: number, paths: number, dim?: string) => Promise<void>; handleRegenFullPara: (idx: number) => Promise<void>;
  handleAddPara: () => Promise<void>; updateParaField: (idx: number, f: keyof DraftParagraph, v: any) => void;
  updateQuestions: (idx: number, qIdx: number, val: string) => void; handleValidateSentence: (idx: number, s: string, pIdx?: number) => Promise<void>;
  handleAdjustSentence: (idx: number, dir: 'up' | 'down', pIdx?: number) => Promise<void>; handleDeletePara: (idx: number) => void;
  handleDeleteForkPath: (pIdx: number, pathIdx: number) => void; handleToggleFork: (pIdx: number) => Promise<void>;
  handleGenerateForkDetails: (pIdx: number) => Promise<void>; handleSmoothTransitions: () => Promise<void>;
  handleValidateSentences: () => Promise<void>; handleClearDrafts: () => void; handleSendSocratic: () => Promise<void>;
  handleRefineOutline: () => Promise<void>; handleStartSocratic: () => Promise<void>; handleDeconstructPoem: () => Promise<void>;
  resetProjectSettings: () => void;
}

const createProjectSlice: StateCreator<SharedState, [], [], ProjectSlice> = (set, get) => ({
  grade: 'g3', topic: '', lastTopic: '', genres: ['記敘文'], skills: ['五感描寫'], rhetoricSkills: [], notes: '', originalPoem: '', poemStructure: '',
  outline: [], thinkingTool: '曼陀羅', skinId: 'minecraft', styleId: '01', cat: 'ALL', search: '', drafts: [], image: null,
  fiveSenses: { visual: '', auditory: '', olfactoryGustatoryTactile: '' }, customTones: {}, socraticHistory: [], socraticInput: '', isSocraticLoading: false, isDeconstructingPoem: false,

  setGrade: (v) => set({ grade: v }), setTopic: (v) => set({ topic: v }), setGenres: (v) => set({ genres: v }),
  setSkills: (v) => set({ skills: v }), setRhetoricSkills: (v) => set({ rhetoricSkills: v }), setNotes: (v) => set({ notes: v }),
  setOriginalPoem: (v) => set({ originalPoem: v }), setPoemStructure: (v) => set({ poemStructure: v }), setOutline: (v) => set({ outline: v }), setThinkingTool: (v) => set({ thinkingTool: v }),
  setSkinId: (v) => set({ skinId: v }), setStyleId: (v) => set({ styleId: v }), setCat: (v) => set({ cat: v }), setSearch: (v) => set({ search: v }),
  setDrafts: (v) => set({ drafts: v }), setImage: (v) => set({ image: v }), setFiveSenses: (v) => set({ fiveSenses: v }),
  setCustomTone: (skin, tone) => set((s) => ({ customTones: { ...s.customTones, [skin]: tone } })),
  setSocraticHistory: (v) => set({ socraticHistory: v }), setSocraticInput: (v) => set({ socraticInput: v }),

  toggleGenre: (g) => { const c = get().genres; set({ genres: c.includes(g) ? (c.length > 1 ? c.filter(i => i !== g) : c) : [...c, g] }); },
  toggleSkill: (s) => { const c = get().skills; set({ skills: c.includes(s) ? (c.length > 1 ? c.filter(i => i !== s) : c) : [...c, s] }); },
  toggleRhetoricSkill: (s) => { const c = get().rhetoricSkills; set({ rhetoricSkills: c.includes(s) ? c.filter(i => i !== s) : [...c, s] }); },
  
  handleDeconstructPoem: async () => {
    const s = get();
    if (!s.originalPoem.trim()) {
      set({ error: '請先輸入原詩參考，才能進行拆解喔！' });
      return;
    }
    set({ isDeconstructingPoem: true, error: null });
    try {
      const result = await analyzePoemStructure(s.originalPoem);
      set({ poemStructure: result });
    } catch (e: any) {
      handleError(set, e, '拆解句型失敗');
    } finally {
      set({ isDeconstructingPoem: false });
    }
  },

  handleGoStep2: () => {
    const s = get(); if (!s.topic.trim()) { set({ error: '請輸入作文題目' }); return; }
    if (s.lastTopic && s.topic !== s.lastTopic) { if (s.socraticHistory.length > 0 || s.outline.length > 0) set({ socraticHistory: [], outline: [], drafts: [] }); }
    set({ lastTopic: s.topic, error: null, step: 2 });
  },
  
  handleGenerateOutline: async () => {
    const s = get(); set({ loading: true, error: null });
    try {
      const grade = gradeConfig[s.grade as keyof typeof gradeConfig];
      let notes = s.originalPoem ? `${s.notes}\n【原詩參考】\n${s.originalPoem}` : s.notes;
      if (s.poemStructure) {
        notes += `\n【強制保留的句型結構】\n${s.poemStructure}`;
      }
      const res = await generateOutline(s.topic, s.genres.join('、'), grade.label, s.skills, notes, s.image || undefined, s.fiveSenses, s.rhetoricSkills);
      set({ outline: res });
    } catch (e: any) { handleError(set, e, '生成大綱失敗'); } finally { set({ loading: false }); }
  },

  handleGoDraft: async (sId) => {
    const s = get();
    const targetStyle = styleLib.find(st => st.id === (sId || s.styleId)) || styleLib[0];
    const skin = (skins[s.grade as keyof typeof skins] || []).find(sk => sk.id === s.skinId) || (skins[s.grade as keyof typeof skins] || [])[0];
    set({ loading: true, error: null });
    try {
      const res = await generateDraft(s.topic, s.genres.join('、'), s.grade, gradeConfig[s.grade as keyof typeof gradeConfig].label, skin as Skin, s.outline, 2, undefined, s.image || undefined, targetStyle.name, s.fiveSenses);
      set({ drafts: res, step: 5, activeTab: 'preview' });
    } catch (e: any) { handleError(set, e, '生成草稿失敗'); } finally { set({ loading: false }); }
  },

  handleRegenPara: async (idx, paths, dim) => {
    const s = get(); set({ loading: true, error: null });
    try {
      const skin = (skins[s.grade as keyof typeof skins] || []).find(sk => sk.id === s.skinId) || (skins[s.grade as keyof typeof skins] || [])[0];
      const style = styleLib.find(st => st.id === s.styleId) || styleLib[0];
      const p = s.drafts[idx];
      const res = await regenerateForkPaths(s.topic, s.genres.join('、'), s.grade, gradeConfig[s.grade as keyof typeof gradeConfig].label, skin as Skin, p, paths, dim || p.paths?.[0]?.dimensions?.[0] || "五感系列", p.feedback, s.image || undefined, style.name);
      const next = [...s.drafts]; next[idx] = { ...res, status: 'concept', isForkConfirmed: false }; set({ drafts: next });
    } catch (e: any) { handleError(set, e, '分歧失敗'); } finally { set({ loading: false }); }
  },

  handleRegenFullPara: async (idx) => {
    const s = get(); set({ loading: true, error: null });
    try {
      const skin = (skins[s.grade as keyof typeof skins] || []).find(sk => sk.id === s.skinId) || (skins[s.grade as keyof typeof skins] || [])[0];
      const style = styleLib.find(st => st.id === s.styleId) || styleLib[0];
      const res = await regenerateParagraph(s.topic, s.genres.join('、'), s.grade, gradeConfig[s.grade as keyof typeof gradeConfig].label, skin as Skin, s.drafts[idx], s.drafts[idx].feedback || "優化", s.drafts[idx].forkPaths, s.image || undefined, style.name);
      const next = [...s.drafts]; next[idx] = res; set({ drafts: next });
    } catch (e: any) { handleError(set, e, '重刷失敗'); } finally { set({ loading: false }); }
  },

  handleAddPara: async () => {
    const s = get(); set({ loading: true, error: null });
    try {
      const skin = (skins[s.grade as keyof typeof skins] || []).find(sk => sk.id === s.skinId) || (skins[s.grade as keyof typeof skins] || [])[0];
      const style = styleLib.find(st => st.id === s.styleId) || styleLib[0];
      const res = await generateSingleParagraph(s.topic, s.genres.join('、'), s.grade, gradeConfig[s.grade as keyof typeof gradeConfig].label, skin as Skin, s.drafts, 2, s.image || undefined, style.name);
      set({ drafts: [...s.drafts, res] });
    } catch (e: any) { handleError(set, e, '新增失敗'); } finally { set({ loading: false }); }
  },

  updateParaField: (idx, f, v) => { const next = [...get().drafts]; next[idx] = { ...next[idx], [f]: v }; set({ drafts: next }); },
  
  updateQuestions: (idx, qIdx, v) => { 
    const next = [...get().drafts]; 
    if (!next[idx].questions) next[idx].questions = ["", "", ""]; 
    next[idx].questions![qIdx] = v; 
    set({ drafts: next }); 
  },
  
  handleValidateSentence: async (idx, s, pIdx?: number) => {
    if (!s.trim()) return;
    try {
      const res = await validateSentence(s, gradeConfig[get().grade as keyof typeof gradeConfig].label);
      const next = [...get().drafts]; 
      if (pIdx !== undefined) {
        const nextPaths = [...next[idx].paths];
        nextPaths[pIdx] = { ...nextPaths[pIdx], validationHint: res.isValid ? undefined : res.hint };
        next[idx] = { ...next[idx], paths: nextPaths };
      } else {
        next[idx] = { ...next[idx], validationHint: res.isValid ? undefined : res.hint };
      }
      set({ drafts: next });
    } catch (e) {}
  },

  handleAdjustSentence: async (idx, dir, pIdx) => {
    const s = get(); const str = pIdx !== undefined ? s.drafts[idx].paths[pIdx]?.actionSlide?.exampleSentence : s.drafts[idx].actionSlide?.exampleSentence;
    if (!str) return;
    set({ loading: true });
    try {
      const res = await adjustSentenceDifficulty(str, gradeConfig[s.grade as keyof typeof gradeConfig].label, dir);
      const next = [...s.drafts];
      if (pIdx !== undefined) {
        const nextPaths = [...next[idx].paths]; nextPaths[pIdx] = { ...nextPaths[pIdx], actionSlide: { ...nextPaths[pIdx].actionSlide, exampleSentence: res } };
        next[idx] = { ...next[idx], paths: nextPaths };
      } else {
        next[idx] = { ...next[idx], actionSlide: { ...next[idx].actionSlide, exampleSentence: res } };
      }
      set({ drafts: next }); await get().handleValidateSentence(idx, res, pIdx);
    } catch (e) { set({ error: '調整失敗' }); } finally { set({ loading: false }); }
  },

  handleDeletePara: (idx) => set({ drafts: get().drafts.filter((_, i) => i !== idx) }),
  handleDeleteForkPath: (pIdx, pathIdx) => {
    const next = [...get().drafts]; next[pIdx].paths = next[pIdx].paths.filter((_, i) => i !== pathIdx);
    next[pIdx].forkPaths = next[pIdx].paths.length; if (next[pIdx].paths.length === 0) next[pIdx].forkEnabled = false; set({ drafts: next });
  },

  handleToggleFork: async (pIdx) => {
    const s = get(); const para = s.drafts[pIdx]; const next = [...s.drafts];
    if (para.forkEnabled) {
      set({ loading: true });
      try {
        next[pIdx].paths = []; next[pIdx].forkEnabled = false; next[pIdx].isForkConfirmed = false; next[pIdx].status = 'confirmed';
        const skin = (skins[s.grade as keyof typeof skins] || []).find(sk => sk.id === s.skinId) || (skins[s.grade as keyof typeof skins] || [])[0];
        const res = await regenerateParagraph(s.topic, s.genres.join('、'), s.grade, gradeConfig[s.grade as keyof typeof gradeConfig].label, skin as Skin, next[pIdx], "移除分支，合併為單一段落");
        next[pIdx] = { ...res, status: 'confirmed' }; set({ drafts: next });
      } catch (e) { set({ error: "切換失敗" }); } finally { set({ loading: false }); }
    } else {
      next[pIdx].forkEnabled = true; next[pIdx].status = 'concept'; set({ drafts: next });
    }
  },

  handleGenerateForkDetails: async (pIdx) => {
    const s = get(); const para = s.drafts[pIdx]; if (!para.paths || para.paths.length === 0) return;
    set({ loading: true, error: null });
    try {
      const skin = (skins[s.grade as keyof typeof skins] || []).find(sk => sk.id === s.skinId) || (skins[s.grade as keyof typeof skins] || [])[0];
      const style = styleLib.find(st => st.id === s.styleId) || styleLib[0];
      const res = await generateDetailedForkContent(s.topic, s.genres.join('、'), gradeConfig[s.grade as keyof typeof gradeConfig].label, skin as Skin, para.title, para.focus, para.paths, s.image || undefined, style.name);
      const next = [...s.drafts]; next[pIdx] = { ...next[pIdx], paths: res, isForkConfirmed: true, status: 'confirmed' }; set({ drafts: next });
    } catch (e: any) { handleError(set, e, '生成詳細分支失敗'); } finally { set({ loading: false }); }
  },

  handleSmoothTransitions: async () => {
    const s = get(); if (s.drafts.length < 2) return; set({ loading: true, error: null });
    try {
      const skin = (skins[s.grade as keyof typeof skins] || []).find(sk => sk.id === s.skinId) || (skins[s.grade as keyof typeof skins] || [])[0];
      const style = styleLib.find(st => st.id === s.styleId) || styleLib[0];
      const { smoothTransitions } = await import('../services/gemini');
      const res = await smoothTransitions(s.topic, s.genres.join('、'), gradeConfig[s.grade as keyof typeof gradeConfig].label, skin as Skin, s.drafts, style.name);
      set({ drafts: res }); get().showToast("銜接優化完成！");
    } catch (e: any) { handleError(set, e, '優化失敗'); } finally { set({ loading: false }); }
  },

  // 🚀 序列化校準 (解決隱患一：API 併發風暴)
  handleValidateSentences: async () => {
    const s = get(); if (s.drafts.length === 0) return; set({ loading: true, error: null });
    try {
      const gradeLabel = gradeConfig[s.grade as keyof typeof gradeConfig].label;
      const { validateSentence } = await import('../services/gemini');
      
      const next = [...s.drafts];
      for (let i = 0; i < next.length; i++) {
        const sentence = next[i].actionSlide?.exampleSentence;
        if (sentence && sentence.trim() !== '') {
          const res = await validateSentence(sentence, gradeLabel);
          next[i] = { ...next[i], validationHint: res.isValid ? "" : res.hint };
        }
        
        if (next[i].forkEnabled && next[i].paths && next[i].paths.length > 0) {
          const newPaths = [...next[i].paths];
          for (let j = 0; j < newPaths.length; j++) {
            const pathSentence = newPaths[j].actionSlide?.exampleSentence;
            if (pathSentence && pathSentence.trim() !== '') {
              const res = await validateSentence(pathSentence, gradeLabel);
              newPaths[j] = { ...newPaths[j], validationHint: res.isValid ? "" : res.hint };
            }
          }
          next[i] = { ...next[i], paths: newPaths };
        }

        // 延遲 500 毫秒避免撞到 Rate Limit
        if (i < next.length - 1) await new Promise(resolve => setTimeout(resolve, 500));
      }
      set({ drafts: next }); get().showToast("校準完成！");
    } catch (e: any) { handleError(set, e, '校準失敗'); } finally { set({ loading: false }); }
  },

  handleClearDrafts: () => { 
    set({ 
      drafts: [], outline: [], topic: '', notes: '', originalPoem: '', poemStructure: '',
      socraticHistory: [], lastTopic: '', 
      fiveSenses: { visual: '', auditory: '', olfactoryGustatoryTactile: '' }, 
      step: 1, showRestartConfirm: false 
    }); 
    useAppStore.persist.clearStorage();
  },
  
  handleSendSocratic: async () => {
    const s = get(); if (!s.socraticInput.trim() || s.isSocraticLoading) return;
    const history = [...s.socraticHistory, { role: 'user', content: s.socraticInput } as SocraticMessage];
    set({ socraticHistory: history, socraticInput: '', isSocraticLoading: true });
    try { 
      let notes = s.notes;
      if (s.poemStructure) notes += `\n【強制保留的句型結構】\n${s.poemStructure}`;
      const next = await generateSocraticQuestion(s.topic, s.genres, gradeConfig[s.grade as keyof typeof gradeConfig].label, notes, history, s.originalPoem); 
      set({ socraticHistory: [...history, { role: 'ai', content: next }] }); 
    } 
    catch (e) { handleError(set, e, '引導失敗'); } finally { set({ isSocraticLoading: false }); }
  },
  
  handleRefineOutline: async () => {
    const s = get(); set({ loading: true });
    try { 
      let notes = s.notes;
      if (s.poemStructure) notes += `\n【強制保留的句型結構】\n${s.poemStructure}`;
      const res = await refineOutlineWithDialogue(s.topic, s.genres, gradeConfig[s.grade as keyof typeof gradeConfig].label, notes, s.socraticHistory, s.thinkingTool, s.originalPoem, s.rhetoricSkills); 
      set({ outline: res }); 
    } 
    catch (e) { handleError(set, e, '優化大綱失敗'); } finally { set({ loading: false }); }
  },
  
  handleStartSocratic: async () => {
    const s = get(); if (s.socraticHistory.length > 0) return; set({ isSocraticLoading: true });
    try { 
      let notes = s.notes;
      if (s.poemStructure) notes += `\n【強制保留的句型結構】\n${s.poemStructure}`;
      const res = await generateSocraticQuestion(s.topic, s.genres, gradeConfig[s.grade as keyof typeof gradeConfig].label, notes, [], s.originalPoem); 
      set({ socraticHistory: [{ role: 'ai', content: res }] }); 
    } 
    catch (e) { handleError(set, e, '啟動失敗'); } finally { set({ isSocraticLoading: false }); }
  },

  resetProjectSettings: () => {
    set({
      topic: '',
      notes: '',
      originalPoem: '',
      poemStructure: '',
      image: null,
      genres: [],
      skills: [],
      rhetoricSkills: [],
      outline: [],
      drafts: [],
      mdOutput: '',
      yamlOutput: '',
      socraticHistory: [],
      error: null,
      step: 1
    });
  }
});

// ============================================================================
// 🧩 切片 3：腳本串流與轉譯 (Script & Output Slice)
// 負責大量且頻繁更新的 Markdown 串流以及 YAML 轉譯
// ============================================================================
interface ScriptSlice {
  mdOutput: string; yamlOutput: string; isGeneratingStream: boolean; isConverting: boolean;
  setMdOutput: (v: string) => void; setYamlOutput: (v: string) => void; setIsGeneratingStream: (v: boolean) => void;
  handleGenerate: () => Promise<void>; handleTransformToYAML: () => Promise<void>; handleStopGeneration: () => void;
}

const createScriptSlice: StateCreator<SharedState, [], [], ScriptSlice> = (set, get) => ({
  mdOutput: '', yamlOutput: '', isGeneratingStream: false, isConverting: false,
  setMdOutput: (v) => set({ mdOutput: v }), setYamlOutput: (v) => set({ yamlOutput: v }), setIsGeneratingStream: (v) => set({ isGeneratingStream: v }),
  
  handleGenerate: async () => {
    const s = get();
    set({ loading: true, error: null, mdOutput: '', activeTab: 'preview', isGeneratingStream: true });
    globalAbortController = new AbortController();

    const currentGrade = gradeConfig[s.grade as keyof typeof gradeConfig];
    const skin = (skins[s.grade as keyof typeof skins] || []).find(sk => sk.id === s.skinId) || (skins[s.grade as keyof typeof skins] || [])[0];
    const style = styleLib.find(st => st.id === s.styleId) || styleLib[0];
    const tool = THINKING_TOOLS_DETAILED.find(t => t.name === s.thinkingTool);
    const layout = layoutSkills?.find(l => l.id === 'skel-v8') || layoutSkills[0];
    
    const layoutConfigObj = {
      styleId: style.id, styleName: style.name, gradeLabel: currentGrade.label, genres: s.genres.join('、'),
      thinkingTool: s.thinkingTool, skinnedToolName: tool?.skinMapping[s.skinId] || s.thinkingTool,
      skinName: skin.name, skinMetaphor: skin.metaphor
    };

    const layoutSpecTable = layout ? layout.generateSpecTable(layoutConfigObj) : "";
    const masterBlueprint = layout ? layout.generateTemplate(layoutConfigObj) : "";
    const skinTone = s.customTones[s.skinId] ?? skin.tone;

    const basePrompt = PromptFactory.buildBasePrompt(
      skin.name, skinTone, skin.metaphor.vocab, 
      skin.metaphor.sentence, style.name, masterBlueprint
    );

    let batonSentence = "接下來，讓我們一起進入這段精彩的旅程吧！"; 

    // 🚀 核心優化：動態生成 NotebookLM Audio 客製化指令 (不閒扯、高聚焦對比)
    const audioPrompt = `## 🎙️ NotebookLM Audio 語音生成專用指令 (請複製貼上至 Customize 框)
\`\`\`text
Strictly generate a role-play dialogue in Traditional Chinese (Taiwanese Mandarin).

**CRITICAL INSTRUCTION: DO NOT SUMMARIZE THE DOCUMENT.**
* **BAD:** "This script is about ${s.topic}..." (Do NOT do this).
* **GOOD:** "Welcome to the writing studio! Or is it a disaster zone?" (DO this).

**The Scenario:**
You are acting as two writing coaches. You are teaching students how to write about "${s.topic}" using **${s.skills.join(', ')}**.

**Characters:**
1.  **Host 1 (${skin.name} Coach):** The "Professional" coach. Focuses on BEAUTY and structure. Uses specific writing vocabulary and metaphors like "${skin.metaphor.vocab}".
2.  **Host 2 (Ah Jie):** The "Messy/Curious" coach. Focuses on DISASTER. Often provides a bad or literal example (e.g., chaotic action, messy writing) that Host 1 has to fix.

**Content Flow (Follow this strictly):**
1.  **Immediate Hook:** Host 1 sets the beautiful scene for "${s.topic}". Host 2 interrupts with a funny, chaotic observation.
2.  **The Technique:** Explain the core writing skills. Don't just list them, demonstrate them!
3.  **The Examples (Masterpiece vs. Disaster):**
    * **Host 1's Example (Beautiful):** Provide a vivid, well-structured example based on the text.
    * **Host 2's Example (Funny):** Provide a chaotic, messy example showing what happens when the technique goes wrong.
4.  **The Conclusion:** Tell students to look at their own experiences. Give a strong call to action!

**Tone:** Creative, chaotic, funny. Focus on VISUAL details and techniques. Do not stray off-topic.
\`\`\``;

    try {
      // 🚀 將 Audio 指令印在 Markdown 最頂端
      set({ mdOutput: `# ${s.topic} 沉浸式寫作特訓（${skin.name} Edition）\n\n${audioPrompt}\n\n---\n\n## Part 1：任務簡報\n\n` });

      // Chunk 1: 開場
      const introPrompt = PromptFactory.buildIntroChunk(basePrompt, s.topic);
      let introChunkText = "";
      await generateFullScriptStream(introPrompt, s.image || undefined, (chunk) => {
        introChunkText += chunk;
        set((state) => ({ mdOutput: state.mdOutput + chunk }));
      }, style.name, globalAbortController.signal);
      
      const introDialogues = introChunkText.match(/Host 2(?:\*\*)?：「([^」]+)」/g);
      if (introDialogues) batonSentence = introDialogues[introDialogues.length - 1].replace(/Host 2(?:\*\*)?：「|」/g, "").slice(-30);

      set((state) => ({ mdOutput: state.mdOutput + '\n\n---\n\n## Part 2：核心教學循環\n\n' }));

      // Chunk 2: 核心段落迴圈
      for (let i = 0; i < s.drafts.length; i++) {
        if (globalAbortController?.signal.aborted) throw new Error('AbortError');
        const paraPrompt = PromptFactory.buildParaChunk(basePrompt, i + 1, s.drafts[i], batonSentence);
        
        let paraChunkText = "";
        await generateFullScriptStream(paraPrompt, undefined, (chunk) => {
          paraChunkText += chunk;
          set((state) => ({ mdOutput: state.mdOutput + chunk }));
        }, style.name, globalAbortController.signal);
        
        const dialogues = paraChunkText.match(/Host 2(?:\*\*)?：「([^」]+)」/g);
        if (dialogues) batonSentence = dialogues[dialogues.length - 1].replace(/Host 2(?:\*\*)?：「|」/g, "").slice(-30);

        set((state) => ({ mdOutput: state.mdOutput + '\n\n' }));
      }

      // Chunk 3: 戰術分歧
      const forkDrafts = s.drafts.filter(d => d.forkEnabled && d.paths && d.paths.length > 0);
      if (forkDrafts.length > 0) {
        set((state) => ({ mdOutput: state.mdOutput + '---\n\n## Part 3：戰術分歧路徑\n\n' }));
        for (const p of forkDrafts) {
          if (globalAbortController?.signal.aborted) throw new Error('AbortError');
          const forkIndex = s.drafts.indexOf(p) + 1;
          const forkPrompt = PromptFactory.buildForkChunk(basePrompt, forkIndex, p.paths!);
          await generateFullScriptStream(forkPrompt, undefined, (chunk) => set((state) => ({ mdOutput: state.mdOutput + chunk })), style.name, globalAbortController.signal);
          set((state) => ({ mdOutput: state.mdOutput + '\n\n' }));
        }
      }

      // Chunk 4: 結尾
      set((state) => ({ mdOutput: state.mdOutput + '---\n\n## Part 4：結尾統整\n\n' }));
      const outroPrompt = PromptFactory.buildOutroChunk(basePrompt, batonSentence);
      await generateFullScriptStream(outroPrompt, undefined, (chunk) => set((state) => ({ mdOutput: state.mdOutput + chunk })), style.name, globalAbortController.signal);

      set((state) => ({ mdOutput: layoutSpecTable + '\n\n' + state.mdOutput }));

    } catch (err: any) { 
      if (err.message !== 'AbortError') handleError(set, err, '生成腳本失敗'); 
    } finally { 
      set({ loading: false, isGeneratingStream: false }); 
      globalAbortController = null; 
    }
  },

  // 🚀 已修復：捕獲重組引擎 (徹底解決碎塊與重複規格表問題)
  handleTransformToYAML: async () => {
    const s = get(); if (!s.mdOutput) return;
    set({ isConverting: true, yamlOutput: '', activeTab: 'yaml' });
    const style = styleLib.find(st => st.id === s.styleId) || styleLib[0];

    // 🚀 捕獲重組引擎：精準切分 Markdown 區塊，確保與編輯器邏輯一致
    const parts = s.mdOutput.split(/(【版型】|版型|\[Layout\]|Layout)/i);
    const allChunks: string[] = [parts[0]];
    for (let i = 1; i < parts.length; i += 2) {
      allChunks.push(parts[i] + (parts[i + 1] || ''));
    }
    
    // 過濾掉可能存在的純空白幽靈區塊
    const validChunks = allChunks.filter(c => c.trim().length > 0);
    
    // 🚀 核心邏輯：判斷第一個區塊是否為「前言/規格表」
    // 如果第一個區塊不包含版型標籤，它就是 preamble
    const hasPreamble = validChunks.length > 0 && !/(?:【版型】|版型|\[Layout\]|Layout)/i.test(validChunks[0]);
    
    const preamble = hasPreamble ? validChunks[0] : "";
    const slides = hasPreamble ? validChunks.slice(1) : validChunks;

    try {
      if (slides.length > 0) {
        const firstSlidePrompt = PromptFactory.buildYamlTransform(preamble + slides[0], 1);
        await generateFullScriptStream(firstSlidePrompt, undefined, (chunk) => set((state) => ({ yamlOutput: state.yamlOutput + chunk })), style.name);
        set((state) => ({ yamlOutput: state.yamlOutput + '\n' }));
      }
      for (let i = 1; i < slides.length; i++) {
        const chunkPrompt = PromptFactory.buildYamlChunkTransform(slides[i], i + 1);
        await generateFullScriptStream(chunkPrompt, undefined, (chunk) => set((state) => ({ yamlOutput: state.yamlOutput + chunk })), style.name);
        set((state) => ({ yamlOutput: state.yamlOutput + '\n' }));
      }
    } catch (e) { set({ error: "YAML 轉譯失敗" }); } 
    finally { set({ isConverting: false }); }
  },

  handleStopGeneration: () => { if (globalAbortController) { globalAbortController.abort(); set({ isGeneratingStream: false, loading: false }); } }
});

// ============================================================================
// 🎯 總合型別與導出
// ============================================================================
type SharedState = UISlice & ProjectSlice & ScriptSlice;

export const useAppStore = create<SharedState>()(
  persist(
    (...a) => ({
      ...createUISlice(...a),
      ...createProjectSlice(...a),
      ...createScriptSlice(...a),
    }),
    {
      name: 'bee-teacher-storage',
      version: 1,
      partialize: (state) => ({ 
        topic: state.topic, outline: state.outline, drafts: state.drafts, notes: state.notes, 
        originalPoem: state.originalPoem, poemStructure: state.poemStructure, socraticHistory: state.socraticHistory, lastTopic: state.lastTopic, 
        thinkingTool: state.thinkingTool, step: state.step, grade: state.grade, genres: state.genres, 
        skills: state.skills, rhetoricSkills: state.rhetoricSkills, skinId: state.skinId, styleId: state.styleId, 
        apiKeys: state.apiKeys, activeTab: state.activeTab, 
        fiveSenses: state.fiveSenses, customTones: state.customTones 
      })
    }
  )
);