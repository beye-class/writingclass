/**
 * ⚒️ 專案架構師 v10.0 - 思考工具處方箋 v8.0 全量整合
 */

export const SPIRAL_STAGES = {
  OBSERVATION: "第一螺旋：感官攝影機（看聽聞觸）",
  EMOTION: "第二螺旋：情緒層：引導學生感受內心顏色",
  RHETORIC: "第三螺旋：修辭魔法陣（比喻、擬人）",
  STRUCTURE: "第四螺旋：結構建築師（起承轉合）"
};

export interface ThinkingToolDetail {
  id: string;
  name: string;
  problem: string; // 針對的寫作問題
  description: string;
  genres: string[];
  gradeAdaptation: {
    low: string;    // G1-2
    mid: string;    // G3-4
    high: string;   // G5-6
  };
  skinMapping: Record<string, string>; // 皮膚化變形名稱
}

export const THINKING_TOOLS_DETAILED: ThinkingToolDetail[] = [
  {
    id: 'story-mountain',
    name: '故事山',
    problem: '解決流水帳、沒有起伏',
    description: '強調起承轉合與高潮設計',
    genres: ['記敘文', '想像文', '童話故事', '劇本', '遊記'],
    gradeAdaptation: { low: '簡化版（起/中/尾）', mid: '完整版', high: '加強高潮設計' },
    skinMapping: {
      magic: '魔法冒險地圖',
      minecraft: '傳說任務進度條',
      explorer: '旅程路線圖',
      podcast: '本集精華曲線圖',
      author: '小說架構圖'
    }
  },
  {
    id: 'mandala',
    name: '曼陀羅',
    problem: '解決腦袋空白、不知寫什麼',
    description: '水平擴散發想主題內容',
    genres: ['所有文類'],
    gradeAdaptation: { low: '4 格版（中心+4方向）', mid: '9 格完整版', high: '雙層曼陀羅' },
    skinMapping: {
      magic: '魔法陣能量格',
      minecraft: '3×3 工作台合成格',
      nature: '元素週期擴展圖',
      podcast: '節目概念網路圖',
      foodyt: '食材風味發想格'
    }
  },
  {
    id: 'five-senses',
    name: '五感圖',
    problem: '解決描寫貧乏、只寫事實',
    description: '視聽嗅味觸五向描寫提醒',
    genres: ['描寫文', '記敘文', '抒情文', '童詩創作', '遊記'],
    gradeAdaptation: { low: '最適合（具象感官）', mid: '進階感官描述', high: '感官與情感融合' },
    skinMapping: {
      nature: '觀察標本採集表',
      photo: '多感官鏡頭切換表',
      food: '廚師感官品鑑表',
      foodyt: '五感食記清單'
    }
  },
  {
    id: 'oreo',
    name: 'OREO 框架',
    problem: '解決議論結構鬆散',
    description: '觀點→理由→例子→觀點',
    genres: ['議論文', '讀書報告', '說明文'],
    gradeAdaptation: { low: '不建議使用', mid: '簡化版（O-R-O）', high: '完整版' },
    skinMapping: {
      podcast: '社論論述結構',
      author: '邏輯推論鏈',
      magic: '真理辯論陣'
    }
  },
  {
    id: '5w1h',
    name: '5W1H',
    problem: '解決內容空洞、缺乏細節',
    description: '人事時地物完整填充',
    genres: ['記敘文', '說明文', '小日記', '遊記', '劇本'],
    gradeAdaptation: { low: '3W版（誰/什麼/哪裡）', mid: '完整版', high: '加強 How/Why 分析' },
    skinMapping: {
      explorer: '探險現場六要素表',
      nature: '實驗紀錄六要素',
      podcast: '新聞特派員採訪單',
      photo: '攝影場景六要素'
    }
  },
  {
    id: 'poetry-deconstructor',
    name: '詩歌結構拆解器',
    problem: '解決仿寫難度過高，學生不知從何下筆',
    description: '拆解原詩結構為「固定句型 + 可替換空格」，降低認知負荷',
    genres: ['詩歌仿寫', '童詩創作'],
    gradeAdaptation: { low: '單句替換（名詞/顏色）', mid: '兩句連動替換（動作+名詞）', high: '整段結構保留，意象全面翻新' },
    skinMapping: {
      podcast: '歌詞改編公式',
      magic: '咒語替換法則',
      photo: '濾鏡套用模板',
      nature: '生態觀察填空',
      minecraft: '指令方塊變數',
      food: '食譜替換公式'
    }
  },
  {
    id: 'spatial-tour-map',
    name: '移步換景導覽圖',
    problem: '解決遊記變流水帳，缺乏空間動線與重點',
    description: '建立空間動線，定點放大五感描寫，略過無聊過場',
    genres: ['遊記', '記敘文', '描寫文'],
    gradeAdaptation: { low: '2個定點觀察', mid: '3個景點＋轉場連接詞', high: '多景點＋今昔對比與情感' },
    skinMapping: {
      podcast: '外景節目走位圖',
      nature: '棲地生態踏查路線',
      magic: '魔法森林尋寶圖',
      photo: '攝影師取景動線',
      food: '美食街試吃攻略',
      minecraft: '探索座標地圖'
    }
  },
  {
    id: 'emotion-curve',
    name: '情緒心電圖',
    problem: '解決敘事乾癟，缺乏內心戲與人物溫度',
    description: '標記事件發生前、中、後的情緒起伏與內心獨白',
    genres: ['記敘文', '抒情文', '讀書報告'],
    gradeAdaptation: { low: '單一情緒轉換（哭到笑）', mid: '三段式情緒轉折（期待→失望→驚喜）', high: '複雜情緒與內心 OS 交戰' },
    skinMapping: {
      podcast: '聽眾心跳指數波浪',
      nature: '動物警戒度變化圖',
      magic: '魔力波動監測儀',
      photo: '情感曝光值曲線',
      food: '酸甜苦辣風味曲線'
    }
  },
  {
    id: 'metaphor-matrix',
    name: '萬物聯想放大鏡',
    problem: '解決比喻俗套，缺乏跨界想像力',
    description: '透過「抓特徵 ➔ 找替身 ➔ 組裝」產生高級修辭',
    genres: ['童詩創作', '描寫文', '想像文'],
    gradeAdaptation: { low: '外觀相似聯想（像蘋果）', mid: '動態與聲音聯想（像踢踏舞）', high: '抽象情感具象化（像憂鬱的藍）' },
    skinMapping: {
      podcast: '跨界音效合成器',
      nature: '仿生特徵對照表',
      magic: '變形咒語解析圖',
      photo: '濾鏡特效疊加器',
      minecraft: '素材合成工作台'
    }
  }
];

export const GENRES = ['記敘文', '抒情文', '說明文', '議論文', '童話故事', '書信', '詩歌仿寫', '小日記', '讀書報告', '劇本', '童詩創作', '遊記'];
export const SKILLS = ['五感描寫', '動作分解', '對話設計', '心理描摹', '修辭運用', '結構佈局'];

export const SOCRATIC_SUGGESTIONS: Record<string, string[]> = {
  '記敘文': ['這件事發生在哪裡？', '當時你的心情如何？', '有沒有什麼特別的對話？', '幫我想個大綱'],
  '抒情文': ['你想表達什麼樣的情感？', '有哪些事物讓你聯想到這種感覺？', '最後你的心情有什麼轉變？', '幫我想個大綱'],
  '說明文': ['你想介紹的主題是什麼？', '它有哪些特徵或功能？', '為什麼大家需要了解它？', '幫我想個大綱'],
  '議論文': ['你的主要觀點是什麼？', '有什麼理由支持你的觀點？', '可以舉出什麼具體的例子嗎？', '幫我想個大綱'],
  '詩歌仿寫': ['原詩的核心意象是什麼？', '你想換成什麼樣的主題？', '你想保留原詩的哪種節奏感？', '幫我寫這首詩'],
  '遊記': ['你去了哪裡？', '那裡的風景有什麼特別之處？', '這次旅行最難忘的一刻是什麼？', '幫我想個大綱'],
  'default': ['你想寫的主題是什麼？', '你想讓讀者感受到什麼？', '有沒有什麼特別的細節想分享？', '幫我想個大綱']
};
