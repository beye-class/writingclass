export interface Skin {
  id: string;
  type: 'fun' | 'real';
  icon: string;
  name: string;
  desc: string;
  target_reader: string; // 🚀 新增：核心對象感 (Target Reader)
  metaphor: {
    vocab: string;
    sentence: string;
    essay: string;
  };
  tone: string;
  host_style: Record<string, string>;
  vocab_naming: string;
  sentence_naming?: string;
}

const COMMON_REAL_SKINS: Skin[] = [
  {
    id: 'podcast',
    type: 'real',
    icon: '🎙️',
    name: 'Podcast 主持人',
    desc: '詞彙=節目素材，句型=開場/轉場，作文=本集精華',
    target_reader: '聽眾 (強調聽覺陪伴、如同朋友般的口語互動)',
    metaphor: { vocab: '節目素材', sentence: '開場白／轉場語', essay: '本集精華' },
    tone: '親切對話感，像在和聽眾說話',
    host_style: {
      g1: '大家好，歡迎收聽今天的節目！今天我們要聊一個超有趣的主題，準備好了嗎？',
      g2: '歡迎回到我們的節目！今天帶來更多精彩內容，讓我們一起來聊聊吧！',
      g3: '嗨，各位聽眾大家好！我是你們的主持人，今天要聊的主題超有意思，一起來探討吧！',
      g4: '歡迎回到節目！今天這集要聊一個讓我思考很久的問題，相信聽完你也會有很多感觸⋯⋯',
      g5: '大家好，歡迎收聽本集節目。今天要聊的這個議題，我思考了很久，也採訪了很多人，希望能帶給你不同的角度。',
      g6: '最好的節目，是讓聽眾在通勤途中突然停下腳步，因為某句話說進了心裡。今天我們來製作那樣的內容。'
    },
    vocab_naming: '節目用語（如：本集主題、重點摘要、聽眾回饋）'
  },
  {
    id: 'foodyt',
    type: 'real',
    icon: '🍳',
    name: '美食 Youtuber',
    desc: '詞彙=食材描述，句型=試吃反應，作文=影片腳本',
    target_reader: '頻道觀眾/老饕粉絲 (強調食慾勾引與感官共享)',
    metaphor: { vocab: '食材描述', sentence: '試吃反應', essay: '影片腳本' },
    tone: '熱情分享感，感官描寫自然',
    host_style: {
      g1: '大家好！今天要帶大家吃一個超厲害的東西，光是看就讓人口水直流！',
      g2: '各位觀眾好！今天這個東西，我一吃下去就停不下來，趕快來看看！',
      g3: '哈囉大家好！今天帶來一個我最近超愛的東西，光是聞到味道就讓人食指大動！',
      g4: '今天這個東西，我試吃之前完全沒有預期⋯⋯結果一口下去，所有的感官都被打開了！',
      g5: '老饕們，今天這家店我只能說⋯⋯去之前完全不知道，吃了之後再也忘不掉。跟我來！',
      g6: '真正頂尖的美食創作者，能讓觀眾透過螢幕感受到食物的溫度 and 香氣。今天這篇腳本，要做到這種程度。'
    },
    vocab_naming: '食物相關詞（如：入口即化、層次豐富、後韻悠長）'
  },
  {
    id: 'author',
    type: 'real',
    icon: '📖',
    name: '暢銷書作家',
    desc: '詞彙=書稿用詞，句型=章節開頭，作文=新書第一章',
    target_reader: '書迷/潛在讀者 (強調故事共鳴與沉浸感)',
    metaphor: { vocab: '書稿用詞', sentence: '章節開頭公式', essay: '新書第一章' },
    tone: '創作者視角，強調「你就是作家」',
    host_style: {
      g1: '你就是作家！今天我們要寫下第一章，讓讀者看了第一句就想繼續讀下去。',
      g2: '我們的故事今天要更精彩！加入更多細節，讓讀者像真的身歷其境一樣。',
      g3: '你就是這本書的作者！第一章的第一句，要讓讀者放不下書。我們來打造這個開頭。',
      g4: '這一章是整本書的轉折點！作為作者，你要讓讀者在這裡感受到情緒的變化，欲罷不能。',
      g5: '一本好書不只是故事，是一種體驗。今天這一章，要讓讀者在閱讀的過程中感受到情緒的流動。',
      g6: '真正的暢銷書，是因為它說出了某個時代某群人心中最深的渴望。今天這一章，要找到那個共鳴點。'
    },
    vocab_naming: '文學詞彙（如：伏筆、意象、轉折點）'
  },
  {
    id: 'explorer',
    type: 'real',
    icon: '🧭',
    name: '冒險家日記作者',
    desc: '詞彙=探索紀錄，句型=日記開頭，作文=探險日誌',
    target_reader: '未來的冒險者/探險日誌讀者 (強調第一人稱的真實發現感)',
    metaphor: { vocab: '探索紀錄', sentence: '日記體開頭', essay: '探險日誌' },
    tone: '第一人稱投入感，記錄當下',
    host_style: {
      g1: '探險家，拿起日記本！今天發生了一件很特別的事，我要把它完整記錄下來。',
      g2: '今天的冒險更刺激了！拿起日記本，把過程寫得清清楚楚，讓大家也感受到那份興奮！',
      g3: '今天是探險第N天。我站在一個從沒人來過的地方，看著眼前的景象，拿起日記本⋯⋯',
      g4: '今天遇到了意料之外的狀況。我在日記裡如實記下當時的心情和判斷，因為這些細節以後都是珍貴的紀錄。',
      g5: '寫日記不是流水帳。今天我要把當下最真實的感受和思考記下來，讓多年後的自己重讀時，還能感受到那個當下。',
      g6: '最好的探險日記，讓後人讀了能理解那個時代、那個地方、那個人的心境。今天這篇，寫給未來的讀者。'
    },
    vocab_naming: '探索用語（如：發現、紀錄、意外收穫）'
  }
];

export const skins: Record<string, Skin[]> = {
  g1: [
    {
      id: 'magic', type: 'fun', icon: '🪄', name: '魔法森林', desc: '詞彙=魔法寶石，句型=魔杖，作文=魔藥',
      target_reader: '見習小巫師 (強調驚喜感與魔法互動)',
      metaphor: { vocab: '魔法寶石', sentence: '魔杖揮舞法', essay: '完成的魔藥' },
      tone: '充滿驚喜，語氣溫柔神奇',
      host_style: { g1: '歡迎來到魔法森林！今天我們要收集魔法寶石，學會用魔杖揮出美麗的句子，最後釀出一瓶讓人驚嘆的魔藥！' },
      vocab_naming: '寶石名（如：閃光石、彩虹珠）', sentence_naming: '魔法咒語'
    },
    {
      id: 'toy', type: 'fun', icon: '🧸', name: '玩具王國', desc: '詞彙=零件，句型=組裝說明書，作文=修好玩具',
      target_reader: '工廠小幫手 (強調動手組裝與趣味性)',
      metaphor: { vocab: '零件', sentence: '組裝說明書', essay: '修好的玩具' },
      tone: '親切活潑，像在玩積木',
      host_style: { g1: '今天我們要修好一個壞掉的玩具！先找到需要的零件，再按照說明書一步一步組裝，就能完成！' },
      vocab_naming: '零件名（如：紅色齒輪、彈簧）', sentence_naming: '組裝步驟'
    },
    {
      id: 'food', type: 'fun', icon: '🍳', name: '小小廚神', desc: '詞彙=新鮮食材，句型=食譜秘方，作文=美味大餐',
      target_reader: '廚房小幫手 (強調五感體驗與開心烹飪)',
      metaphor: { vocab: '新鮮食材', sentence: '食譜秘方', essay: '美味大餐' },
      tone: '開心烹飪感，食物擬人化',
      host_style: { g1: '今天我們要下廚囉！把新鮮食材洗乾淨，照著食譜秘方一步一步做，就能端出美味大餐！' },
      vocab_naming: '食材名（如：香甜蘋果、鮮紅番茄）', sentence_naming: '食譜步驟'
    },
    {
      id: 'photo', type: 'real', icon: '📷', name: '小攝影師', desc: '詞彙=畫面元素，句型=特寫/廣角，作文=精選相簿',
      target_reader: '攝影展觀眾 (強調畫面捕捉與視覺聚焦)',
      metaphor: { vocab: '畫面元素', sentence: '特寫鏡頭／廣角鏡頭', essay: '精選相簿' },
      tone: '觀察者語氣，強調「看見」',
      host_style: { g1: '拿起你的相機！今天我們要拍出最漂亮的照片。先找到想拍的畫面，再決定要用特寫還是廣角！' },
      vocab_naming: '鏡頭裡的主角（如：陽光、笑臉）'
    },
    {
      id: 'nature', type: 'real', icon: '🔍', name: '自然觀察員', desc: '詞彙=採集標本，句型=放大鏡，作文=觀察日記',
      target_reader: '自然科學愛好者 (強調細節發現與客觀紀錄)',
      metaphor: { vocab: '採集標本', sentence: '放大鏡觀察', essay: '觀察日記' },
      tone: '科學探索感，細心記錄',
      host_style: { g1: '帶上你的放大鏡，我們去自然觀察！把看到的東西仔細記錄在觀察日記裡。' },
      vocab_naming: '觀察紀錄（如：翠綠葉片、粗糙樹皮）'
    },
    {
      id: 'paint', type: 'real', icon: '🎨', name: '繪本小畫家', desc: '詞彙=調色盤，句型=線條勾勒，作文=手繪故事書',
      target_reader: '繪本小讀者 (強調色彩、線條與想像力)',
      metaphor: { vocab: '調色盤', sentence: '線條勾勒', essay: '手繪故事書' },
      tone: '藝術創作感，溫柔引導',
      host_style: { g1: '打開調色盤，我們要畫一本故事書！先選好顏色，再用線條把畫面勾勒出來。' },
      vocab_naming: '顏色與筆觸（如：溫暖橘、輕柔曲線）'
    },
    ...COMMON_REAL_SKINS
  ],
  g2: [
    {
      id: 'magic', type: 'fun', icon: '🪄', name: '魔法森林', desc: '詞彙=魔法寶石，句型=魔杖，作文=魔藥',
      target_reader: '見習小巫師 (強調驚喜感與魔法互動)',
      metaphor: { vocab: '魔法寶石', sentence: '魔杖揮舞法', essay: '完成的魔藥' },
      tone: '充滿驚喜，語氣溫柔神奇',
      host_style: { g2: '魔法森林的寶石今天又多了幾顆！學會這些詞彙，揮動魔杖，就能寫出讓人驚嘆的句子！' },
      vocab_naming: '寶石名（如：閃光石、彩虹珠）', sentence_naming: '魔法咒語'
    },
    {
      id: 'toy', type: 'fun', icon: '🧸', name: '玩具王國', desc: '詞彙=零件，句型=組裝說明書，作文=修好玩具',
      target_reader: '工廠小幫手 (強調動手組裝與趣味性)',
      metaphor: { vocab: '零件', sentence: '組裝說明書', essay: '修好的玩具' },
      tone: '親切活潑，像在玩積木',
      host_style: { g2: '王國裡又有新零件送來了！找到正確的材料，按照說明書，我們能修好更複雜的玩具！' },
      vocab_naming: '零件名（如：紅色齒輪、彈簧）', sentence_naming: '組裝步驟'
    },
    {
      id: 'food', type: 'fun', icon: '🍳', name: '小小廚神', desc: '詞彙=新鮮食材，句型=食譜秘方，作文=美味大餐',
      target_reader: '廚房小幫手 (強調五感體驗與開心烹飪)',
      metaphor: { vocab: '新鮮食材', sentence: '食譜秘方', essay: '美味大餐' },
      tone: '開心烹飪感，食物擬人化',
      host_style: { g2: '廚神們，今天的食材更豐富了！掌握新的秘方，我們能做出更多種美味料理！' },
      vocab_naming: '食材名（如：香甜蘋果、鮮紅番茄）', sentence_naming: '食譜步驟'
    },
    {
      id: 'photo', type: 'real', icon: '📷', name: '小攝影師', desc: '詞彙=畫面元素，句型=特寫/廣角，作文=精選相簿',
      target_reader: '攝影展觀眾 (強調畫面捕捉與視覺聚焦)',
      metaphor: { vocab: '畫面元素', sentence: '特寫鏡頭／廣角鏡頭', essay: '精選相簿' },
      tone: '觀察者語氣，強調「看見」',
      host_style: { g2: '今天的拍攝任務更進階了！學會用不同角度描述畫面，讓你的相簿更豐富！' },
      vocab_naming: '鏡頭裡的主角（如：陽光、笑臉）'
    },
    {
      id: 'nature', type: 'real', icon: '🔍', name: '自然觀察員', desc: '詞彙=採集標本，句型=放大鏡，作文=觀察日記',
      target_reader: '自然科學愛好者 (強調細節發現與客觀紀錄)',
      metaphor: { vocab: '採集標本', sentence: '放大鏡觀察', essay: '觀察日記' },
      tone: '科學探索感，細心記錄',
      host_style: { g2: '今天的觀察任務更仔細了！用放大鏡看清楚每一個細節，記錄下來分享給大家。' },
      vocab_naming: '觀察紀錄（如：翠綠葉片、粗糙樹皮）'
    },
    {
      id: 'paint', type: 'real', icon: '🎨', name: '繪本小畫家', desc: '詞彙=調色盤，句型=線條勾勒，作文=手繪故事書',
      target_reader: '繪本小讀者 (強調色彩、線條與想像力)',
      metaphor: { vocab: '調色盤', sentence: '線條勾勒', essay: '手繪故事書' },
      tone: '藝術創作感，溫柔引導',
      host_style: { g2: '今天的故事書要加入更多細節！選好顏色，把每個畫面都描述得清清楚楚。' },
      vocab_naming: '顏色與筆觸（如：溫暖橘、輕柔曲線）'
    },
    ...COMMON_REAL_SKINS
  ],
  g3: [
    {
      id: 'minecraft', type: 'fun', icon: '⛏️', name: '創世建築師', desc: '詞彙=材質包，句型=藍圖結構，作文=宏偉建築',
      target_reader: '建築小隊成員 (強調藍圖規劃與創造力)',
      metaphor: { vocab: '材質包', sentence: '藍圖結構', essay: '宏偉建築' },
      tone: '充滿創造力，語氣積極',
      host_style: { g3: '建築師們，準備好建造你的世界了嗎？收集材質包，規劃藍圖，打造最宏偉的建築！' },
      vocab_naming: '方塊名（如：黑曜石、紅石粉）', sentence_naming: '建築工法'
    },
    {
      id: 'pokemon', type: 'fun', icon: '⚡', name: '幻獸訓練家', desc: '詞彙=捕捉球，句型=進化之石，作文=道館挑戰',
      target_reader: '同行訓練家 (強調策略、熱血與進化)',
      metaphor: { vocab: '捕捉球', sentence: '進化之石', essay: '道館挑戰' },
      tone: '熱血冒險感',
      host_style: { g3: '訓練家，目標是成為大師！用捕捉球收集詞彙，用進化之石強化句型，贏得道館挑戰！' },
      vocab_naming: '精靈球（如：超級球、高級球）', sentence_naming: '技能指令'
    },
    {
      id: 'scifi', type: 'fun', icon: '🚀', name: '星際探險隊', desc: '詞彙=能量礦石，句型=導航路徑，作文=星球報告',
      target_reader: '星際總部/艦隊成員 (強調未知探索與科幻設定)',
      metaphor: { vocab: '能量礦石', sentence: '導航路徑', essay: '星球報告' },
      tone: '科幻探索感',
      host_style: { g3: '探險隊員，目標是未知的星系！收集能量礦石，設定導航路徑，完成你的星球報告！' },
      vocab_naming: '礦石名（如：星辰砂、脈衝晶）', sentence_naming: '航行指令'
    },
    {
      id: 'scified', type: 'real', icon: '🔭', name: '科幻小說編輯', desc: '詞彙=世界觀設定，句型=場景建構，作文=出版手稿',
      target_reader: '科幻小說讀者 (強調世界觀的嚴謹與畫面感)',
      metaphor: { vocab: '世界觀設定', sentence: '場景建構公式', essay: '出版手稿' },
      tone: '專業編輯視角，要求嚴謹的世界觀',
      host_style: { g3: '歡迎來到出版社！這份手稿將帶讀者進入一個全新的世界，讓我們從世界觀設定開始打造！' },
      vocab_naming: '科幻設定詞（如：時間軸、位元接口、重力場）'
    },
    {
      id: 'walkthru', type: 'real', icon: '🗺️', name: '攻略 UP 主', desc: '詞彙=步驟指令，句型=教學流程，作文=圖文攻略',
      target_reader: '需要教學的新手玩家 (強調步驟清晰與實用性)',
      metaphor: { vocab: '步驟指令', sentence: '教學流程', essay: '圖文攻略' },
      tone: '教學分享感，清晰有條理',
      host_style: { g3: '大家好，今天要教你一個超實用的方法！跟著我的步驟一步一步來，保證學會！' },
      vocab_naming: '說明用語（如：首先、注意、關鍵步驟）'
    },
    {
      id: 'reelmaker', type: 'real', icon: '🌍', name: '短影音旅遊創作者', desc: '詞彙=地點氛圍詞，句型=鏡頭切換，作文=Reel 腳本',
      target_reader: '滑手機的短影音觀眾 (強調前三秒抓眼球與視覺轉換)',
      metaphor: { vocab: '地點氛圍詞', sentence: '鏡頭切換語', essay: 'Reel 腳本' },
      tone: '視覺化敘事，帶出場景感',
      host_style: { g3: '跟我一起去這個超美的地方！第一個鏡頭，先帶大家看看這裡最吸引人的畫面⋯⋯' },
      vocab_naming: '鏡頭語言（如：空拍、特寫、轉場）'
    },
    {
      id: 'playwright', type: 'real', icon: '🎭', name: '劇本編劇', desc: '詞彙=場景指示，句型=對白結構，作文=第一幕劇本',
      target_reader: '舞台劇觀眾/演員 (強調對白張力與場景調度)',
      metaphor: { vocab: '場景指示', sentence: '對白結構', essay: '第一幕劇本' },
      tone: '導演思維，重視人物與衝突',
      host_style: { g3: '燈光亮起，第一幕開始！身為編劇，你要讓觀眾在開場三分鐘內就被故事抓住。' },
      vocab_naming: '劇本術語（如：場景切換、角色動機、高潮轉折）'
    },
    {
      id: 'viralwriter', type: 'real', icon: '💬', name: '爆款貼文寫手', desc: '詞彙=吸睛開頭，句型=金句結構，作文=病毒式貼文',
      target_reader: '社群媒體粉絲 (強調流量密碼與情緒共鳴)',
      metaphor: { vocab: '吸睛開頭', sentence: '金句結構', essay: '病毒式貼文' },
      tone: '數位寫作感，精準抓住讀者',
      host_style: { g3: '你有三秒鐘抓住讀者的眼球。第一句話決定一切。讓我們來寫那個讓人忍不住按讚分享的開頭！' },
      vocab_naming: '社群用語（如：共鳴點、行動呼籲、破題句）'
    },
    ...COMMON_REAL_SKINS
  ],
  g4: [
    {
      id: 'minecraft', type: 'fun', icon: '⛏️', name: '創世建築師', desc: '詞彙=材質包，句型=藍圖結構，作文=宏偉建築',
      target_reader: '建築小隊成員 (強調藍圖規劃與創造力)',
      metaphor: { vocab: '材質包', sentence: '藍圖結構', essay: '宏偉建築' },
      tone: '充滿創造力，語氣積極',
      host_style: { g4: '建築師們，今天的工程更具挑戰性！優化你的材質包，精確執行藍圖，完成這座宏偉建築！' },
      vocab_naming: '方塊名（如：黑曜石、紅石粉）', sentence_naming: '建築工法'
    },
    {
      id: 'pokemon', type: 'fun', icon: '⚡', name: '幻獸訓練家', desc: '詞彙=捕捉球，句型=進化之石，作文=道館挑戰',
      target_reader: '同行訓練家 (強調策略、熱血與進化)',
      metaphor: { vocab: '捕捉球', sentence: '進化之石', essay: '道館挑戰' },
      tone: '熱血冒險感',
      host_style: { g4: '訓練家，這場道館賽需要更強的策略！選擇正確的捕捉球，讓句型完美進化，贏得勝利！' },
      vocab_naming: '精靈球（如：超級球、高級球）', sentence_naming: '技能指令'
    },
    {
      id: 'scifi', type: 'fun', icon: '🚀', name: '星際探險隊', desc: '詞彙=能量礦石，句型=導航路徑，作文=星球報告',
      target_reader: '星際總部/艦隊成員 (強調未知探索與科幻設定)',
      metaphor: { vocab: '能量礦石', sentence: '導航路徑', essay: '星球報告' },
      tone: '科幻探索感',
      host_style: { g4: '探險隊員，我們進入了深空區域！精煉能量礦石，計算最優導航路徑，提交詳細的星球報告！' },
      vocab_naming: '礦石名（如：星辰砂、脈衝晶）', sentence_naming: '航行指令'
    },
    {
      id: 'scified', type: 'real', icon: '🔭', name: '科幻小說編輯', desc: '詞彙=世界觀設定，句型=場景建構，作文=出版手稿',
      target_reader: '科幻小說讀者 (強調世界觀的嚴謹與畫面感)',
      metaphor: { vocab: '世界觀設定', sentence: '場景建構公式', essay: '出版手稿' },
      tone: '專業編輯視角，要求嚴謹的世界觀',
      host_style: { g4: '這份手稿的世界觀很有潛力！現在我們要讓讀者一翻開第一頁就感覺被吸進那個世界。' },
      vocab_naming: '科幻設定詞（如：時間軸、位元接口、重力場）'
    },
    {
      id: 'walkthru', type: 'real', icon: '🗺️', name: '攻略 UP 主', desc: '詞彙=步驟指令，句型=教學流程，作文=圖文攻略',
      target_reader: '需要教學的新手玩家 (強調步驟清晰與實用性)',
      metaphor: { vocab: '步驟指令', sentence: '教學流程', essay: '圖文攻略' },
      tone: '教學分享感，清晰有條理',
      host_style: { g4: '今天的攻略難度提升了！除了步驟，我們還要告訴讀者每一步「為什麼這樣做」，才是真正完整的攻略。' },
      vocab_naming: '說明用語（如：首先、注意、關鍵步驟）'
    },
    {
      id: 'reelmaker', type: 'real', icon: '🌍', name: '短影音旅遊創作者', desc: '詞彙=地點氛圍詞，句型=鏡頭切換，作文=Reel 腳本',
      target_reader: '滑手機的短影音觀眾 (強調前三秒抓眼球與視覺轉換)',
      metaphor: { vocab: '地點氛圍詞', sentence: '鏡頭切換語', essay: 'Reel 腳本' },
      tone: '視覺化敘事，帶出場景感',
      host_style: { g4: '今天這個地方，光是鏡頭帶過去還不夠！我們要用文字讓觀眾感受到那個氛圍，像真的站在那裡一樣。' },
      vocab_naming: '鏡頭語言（如：空拍、特寫、轉場）'
    },
    {
      id: 'playwright', type: 'real', icon: '🎭', name: '劇本編劇', desc: '詞彙=場景指示，句型=對白結構，作文=第一幕劇本',
      target_reader: '舞台劇觀眾/演員 (強調對白張力與場景調度)',
      metaphor: { vocab: '場景指示', sentence: '對白結構', essay: '第一幕劇本' },
      tone: '導演思維，重視人物與衝突',
      host_style: { g4: '第一幕要建立懸念！角色登場、衝突浮現，每一句對白都要有目的，推動故事往前走。' },
      vocab_naming: '劇本術語（如：場景切換、角色動機、高潮轉折）'
    },
    {
      id: 'viralwriter', type: 'real', icon: '💬', name: '爆款貼文寫手', desc: '詞彙=吸睛開頭，句型=金句結構，作文=病毒式貼文',
      target_reader: '社群媒體粉絲 (強調流量密碼與情緒共鳴)',
      metaphor: { vocab: '吸睛開頭', sentence: '金句結構', essay: '病毒式貼文' },
      tone: '數位寫作感，精準抓住讀者',
      host_style: { g4: '一篇爆款貼文不只靠開頭！中間要有共鳴點，結尾要有行動呼籲，讓讀者忍不住留言或分享。' },
      vocab_naming: '社群用語（如：共鳴點、行動呼籲、破題句）'
    },
    ...COMMON_REAL_SKINS
  ],
  g5: [
    {
      id: 'rpg', type: 'fun', icon: '⚔️', name: '異世界勇者', desc: '詞彙=掉落寶物，句型=技能樹，作文=傳說任務',
      target_reader: '冒險小隊成員 (強調史詩感、技能與挑戰)',
      metaphor: { vocab: '掉落寶物', sentence: '技能樹', essay: '傳說任務' },
      tone: '史詩冒險感',
      host_style: { g5: '勇者們，最終魔王就在前方！收集稀有掉落寶物，點滿你的技能樹，完成這場傳說任務！' },
      vocab_naming: '裝備名（如：龍鱗甲、聖劍）', sentence_naming: '技能連招'
    },
    {
      id: 'youtu', type: 'fun', icon: '🎬', name: '頂尖實況主', desc: '詞彙=流量密碼，句型=腳本節奏，作文=爆紅影片',
      target_reader: '直播聊天室粉絲 (強調直播節奏、社群互動)',
      metaphor: { vocab: '流量密碼', sentence: '腳本節奏', essay: '爆紅影片' },
      tone: '現代潮流感',
      host_style: { g5: '各位實況主，今天的直播要衝上發燒榜！掌握流量密碼，控制腳本節奏，製作出爆紅影片！' },
      vocab_naming: '頻道術語（如：訂閱、小鈴鐺）', sentence_naming: '剪輯點'
    },
    {
      id: 'escape', type: 'fun', icon: '🔍', name: '密室逃脫偵探', desc: '詞彙=關鍵線索，句型=邏輯解鎖，作文=破案報告',
      target_reader: '偵探助手/委託人 (強調邏輯推理與解謎懸念)',
      metaphor: { vocab: '關鍵線索', sentence: '邏輯解鎖', essay: '破案報告' },
      tone: '懸疑推理感',
      host_style: { g5: '偵探，時間不多了！找出所有關鍵線索，用邏輯解鎖重重機關，寫出完美的破案報告！' },
      vocab_naming: '證物名（如：指紋、密碼函）', sentence_naming: '推理邏輯'
    },
    {
      id: 'debater', type: 'real', icon: '⚖️', name: '辯論隊教練', desc: '詞彙=論點彈藥，句型=攻防結構，作文=比賽稿',
      target_reader: '評審與對手 (強調邏輯攻防與強烈說服力)',
      metaphor: { vocab: '論點彈藥', sentence: '攻防結構', essay: '比賽稿' },
      tone: '策略性思考，強調說服與反駁',
      host_style: { g5: '選手們，今天的辯題已確認。先整理你的論點彈藥，設想對方的反駁，再構建無懈可擊的攻防架構。' },
      vocab_naming: '辯論術語（如：立論、駁論、總結陳詞）'
    },
    {
      id: 'scified', type: 'real', icon: '🔭', name: '科幻小說編輯', desc: '詞彙=世界觀設定，句型=場景建構，作文=出版手稿',
      target_reader: '科幻小說讀者 (強調世界觀的嚴謹與畫面感)',
      metaphor: { vocab: '世界觀設定', sentence: '場景建構公式', essay: '出版手稿' },
      tone: '專業編輯視角',
      host_style: { g5: '這份稿子有潛力成為經典。但世界觀要更嚴密，場景要讓讀者一秒入戲。我們來逐字打磨。' },
      vocab_naming: '科幻設定詞（如：時間軸、位元接口、重力場）'
    },
    {
      id: 'walkthru', type: 'real', icon: '🗺️', name: '攻略 UP 主', desc: '詞彙=步驟指令，句型=教學流程，作文=圖文攻略',
      target_reader: '需要教學的新手玩家 (強調步驟清晰與實用性)',
      metaphor: { vocab: '步驟指令', sentence: '教學流程', essay: '圖文攻略' },
      tone: '教學分享感',
      host_style: { g5: '這次的攻略我研究了很久才整理出來。跟著做，你不只學會怎麼做，還能理解背後的邏輯。' },
      vocab_naming: '說明用語（如：首先、注意、關鍵步驟）'
    },
    {
      id: 'reelmaker', type: 'real', icon: '🌍', name: '短影音旅遊創作者', desc: '詞彙=地點氛圍詞，句型=鏡頭切換，作文=Reel 腳本',
      target_reader: '滑手機的短影音觀眾 (強調前三秒抓眼球與視覺轉換)',
      metaphor: { vocab: '地點氛圍詞', sentence: '鏡頭切換語', essay: 'Reel 腳本' },
      tone: '視覺化敘事',
      host_style: { g5: '這個地方，我第一次去的時候完全沒想到會這樣。三十秒的影片要把那種感覺完整傳遞——這就是我們今天的挑戰。' },
      vocab_naming: '鏡頭語言（如：空拍、特寫、轉場）'
    },
    {
      id: 'playwright', type: 'real', icon: '🎭', name: '劇本編劇', desc: '詞彙=場景指示，句型=對白結構，作文=第一幕劇本',
      target_reader: '舞台劇觀眾/演員 (強調對白張力與場景調度)',
      metaphor: { vocab: '場景指示', sentence: '對白結構', essay: '第一幕劇本' },
      tone: '導演思維',
      host_style: { g5: '好的劇本，台詞之外還有很多東西。人物的動作、沉默、空間——今天我們要把這些全都寫進去。' },
      vocab_naming: '劇本術語（如：場景切換、角色動機、高潮轉折）'
    },
    {
      id: 'viralwriter', type: 'real', icon: '💬', name: '爆款貼文寫手', desc: '詞彙=吸睛開頭，句型=金句結構，作文=病毒式貼文',
      target_reader: '社群媒體粉絲 (強調流量密碼與情緒共鳴)',
      metaphor: { vocab: '吸睛開頭', sentence: '金句結構', essay: '病毒式貼文' },
      tone: '數位寫作感',
      host_style: { g5: '真正的爆款內容，是因為說出了別人心裡想說卻說不出來的話。今天我們來練習：找到那句話，然後說得比任何人都好。' },
      vocab_naming: '社群用語（如：共鳴點、行動呼籲、破題句）'
    },
    ...COMMON_REAL_SKINS
  ],
  g6: [
    {
      id: 'rpg', type: 'fun', icon: '⚔️', name: '異世界勇者', desc: '詞彙=掉落寶物，句型=技能樹，作文=傳說任務',
      target_reader: '冒險小隊成員 (強調史詩感、技能與挑戰)',
      metaphor: { vocab: '掉落寶物', sentence: '技能樹', essay: '傳說任務' },
      tone: '史詩冒險感，提升至思辨層次',
      host_style: { g6: '勇者，真正的力量來自於對世界的理解。收集寶物，磨練技能，這場任務將考驗你的智慧與靈魂。' },
      vocab_naming: '裝備名（如：龍鱗甲、聖劍）', sentence_naming: '技能連招'
    },
    {
      id: 'youtu', type: 'fun', icon: '🎬', name: '頂尖實況主', desc: '詞彙=流量密碼，句型=腳本節奏，作文=爆紅影片',
      target_reader: '直播聊天室粉絲 (強調直播節奏、社群互動)',
      metaphor: { vocab: '流量密碼', sentence: '腳本節奏', essay: '爆紅影片' },
      tone: '現代潮流感，提升至思辨層次',
      host_style: { g6: '實況主，爆紅只是一瞬，影響力才是永恆。用流量密碼傳遞深度，用節奏掌控全場，製作出有靈魂的影片。' },
      vocab_naming: '頻道術語（如：訂閱、小鈴鐺）', sentence_naming: '剪輯點'
    },
    {
      id: 'escape', type: 'fun', icon: '🔍', name: '密室逃脫偵探', desc: '詞彙=關鍵線索，句型=邏輯解鎖，作文=破案報告',
      target_reader: '偵探助手/委託人 (強調邏輯推理與解謎懸念)',
      metaphor: { vocab: '關鍵線索', sentence: '邏輯解鎖', essay: '破案報告' },
      tone: '懸疑推理感，提升至思辨層次',
      host_style: { g6: '偵探，真相往往隱藏在最深處。找出線索，解開邏輯，你的報告將揭示這個世界的運作規律。' },
      vocab_naming: '證物名（如：指紋、密碼函）', sentence_naming: '推理邏輯'
    },
    {
      id: 'debater', type: 'real', icon: '⚖️', name: '辯論隊教練', desc: '詞彙=論點彈藥，句型=攻防結構，作文=比賽稿',
      target_reader: '評審與對手 (強調邏輯攻防與強烈說服力)',
      metaphor: { vocab: '論點彈藥', sentence: '攻防結構', essay: '比賽稿' },
      tone: '策略性思考，強調說服與反駁',
      host_style: { g6: '最強的辯手，不只能反駁對方，更能在反駁中展現自己更深刻的思考。今天的文章，要做到這一層。' },
      vocab_naming: '辯論術語（如：立論、駁論、總結陳詞）'
    },
    {
      id: 'scified', type: 'real', icon: '🔭', name: '科幻小說編輯', desc: '詞彙=世界觀設定，句型=場景建構，作文=出版手稿',
      target_reader: '科幻小說讀者 (強調世界觀的嚴謹與畫面感)',
      metaphor: { vocab: '世界觀設定', sentence: '場景建構公式', essay: '出版手稿' },
      tone: '專業編輯視角',
      host_style: { g6: '科幻文學最難的不是創造新世界，而是讓讀者相信那個世界是真實的。今天這份手稿，要通過這個最高標準的檢驗。' },
      vocab_naming: '科幻設定詞（如：時間軸、位元接口、重力場）'
    },
    {
      id: 'walkthru', type: 'real', icon: '🗺️', name: '攻略 UP 主', desc: '詞彙=步驟指令，句型=教學流程，作文=圖文攻略',
      target_reader: '需要教學的新手玩家 (強調步驟清晰與實用性)',
      metaphor: { vocab: '步驟指令', sentence: '教學流程', essay: '圖文攻略' },
      tone: '教學分享感',
      host_style: { g6: '真正的大師級攻略，讓人讀完不只會做，還能舉一反三。今天我們要寫的，是那種程度的攻略。' },
      vocab_naming: '說明用語（如：首先、注意、關鍵步驟）'
    },
    {
      id: 'reelmaker', type: 'real', icon: '🌍', name: '短影音旅遊創作者', desc: '詞彙=地點氛圍詞，句型=鏡頭切換，作文=Reel 腳本',
      target_reader: '滑手機的短影音觀眾 (強調前三秒抓眼球與視覺轉換)',
      metaphor: { vocab: '地點氛圍詞', sentence: '鏡頭切換語', essay: 'Reel 腳本' },
      tone: '視覺化敘事',
      host_style: { g6: '最好的旅遊影片，讓人看完之後想立刻訂機票。今天這篇腳本，要有那種讓人心動的力量。' },
      vocab_naming: '鏡頭語言（如：空拍、特寫、轉場）'
    },
    {
      id: 'playwright', type: 'real', icon: '🎭', name: '劇本編劇', desc: '詞彙=場景指示，句型=對白結構，作文=第一幕劇本',
      target_reader: '舞台劇觀眾/演員 (強調對白張力與場景調度)',
      metaphor: { vocab: '場景指示', sentence: '對白結構', essay: '第一幕劇本' },
      tone: '導演思維',
      host_style: { g6: '偉大的劇本，是讓演員有無限詮釋空間的文字。今天我們要寫的，是那種留白恰到好處的第一幕。' },
      vocab_naming: '劇本術語（如：場景切換、角色動機、高潮轉折）'
    },
    {
      id: 'viralwriter', type: 'real', icon: '💬', name: '爆款貼文寫手', desc: '詞彙=吸睛開頭，句型=金句結構，作文=病毒式貼文',
      target_reader: '社群媒體粉絲 (強調流量密碼與情緒共鳴)',
      metaphor: { vocab: '吸睛開頭', sentence: '金句結構', essay: '病毒式貼文' },
      tone: '數位寫作感',
      host_style: { g6: '改變世界的文字，不一定是長篇大論。有時候一句話就夠了。今天我們來練習：把最複雜的思想，用最精準的語言說出來。' },
      vocab_naming: '社群用語（如：共鳴點、行動呼籲、破題句）'
    },
    ...COMMON_REAL_SKINS
  ]
};

export interface StyleDefinition {
  id: string;
  cat: string;
  name: string;
  en: string;
  scene: string;
  color: string;
  font: string;
  metaphor: string;
  image_prompt: string;
  text_prompt: string;
  checklist: string;
}

export const styleLib: StyleDefinition[] = [
  { id:'01', cat:'A', name:'熱血少年戰鬥', en:'Shonen Battle', scene:'喚醒動機、挑戰困難概念',
    color:'黑白紅高對比', font:'毛筆/Impact粗斜', metaphor:'教師=解說員 難點=怪物 解法=必殺技',
    image_prompt:'Anime key visual, student holding pen like sword, shonen manga, fish-eye lens, speed lines, impact sparks, --ar 16:9 --niji 6',
    text_prompt:'Structure: Battle Analysis Format（攻擊模式→反擊技→必殺技）', checklist:'集中線✓ 紅黑強對比✓' },
  { id:'02', cat:'A', name:'Vtuber 學院', en:'Vtuber Academy', scene:'線上直播、高互動課程',
    color:'明亮高彩度動漫配色', font:'動漫風/圓體', metaphor:'老師=Avatar 學生=聊天室觀眾',
    image_prompt:'Vtuber stream overlay, education theme, chalkboard bg, space for avatar bottom left, --ar 16:9',
    text_prompt:'Livestream format with audience interaction cues（Call out互動）', checklist:'左下Avatar✓ 聊天室區塊✓' },
  { id:'03', cat:'A', name:'像素復古風', en:'Pixel Art Retro', scene:'遊戲攻略式教學、電腦科學',
    color:'RGB高飽和：紅綠藍黃紫', font:'點陣字 Press Start 2P', metaphor:'巫師NPC 學生=Player 1',
    image_prompt:'Pixel art landscape, 16-bit SNES era, vibrant colors, dithering, retro HUD overlay, --ar 16:9',
    text_prompt:'Game Walkthrough format; Terms: Level, Enemy, Cheat Code', checklist:'藍底白框對話框✓ 像素清晰✓' },
  { id:'04', cat:'A', name:'集換式英雄卡牌', en:'Trading Card Heroes', scene:'歷史人物、化學元素、生物',
    color:'依屬性分類（紅=力 藍=智）', font:'奇幻襯線體/數字粗體', metaphor:'知識點=戰鬥單位（Hero/Item）',
    image_prompt:'Trading card design, fantasy art, detailed portrait, ornate gold border, --ar 2:3',
    text_prompt:'Extract: Attributes, Strengths, Weaknesses for Card Stats', checklist:'雷達圖✓ 金屬邊框✓' },
  { id:'05', cat:'A', name:'黏土擬真世界', en:'Claymorphism World', scene:'國小低年級、無壓力學習',
    color:'馬卡龍色系：粉紅粉藍鵝黃', font:'圓體 Rounded Fonts', metaphor:'波波（Q）vs 博士（A）',
    image_prompt:'3D render, clay style, pastel colors, floating geometry, soft shadows, children education',
    text_prompt:'Roleplay: Bobo (Curious) vs Dr. Clay (Wise)；語氣親切童趣', checklist:'圖示有內陰影外發光✓' },
  { id:'06', cat:'A', name:'學習漫畫風', en:'Manga Science', scene:'科學原理、歷史故事',
    color:'黑白線稿 Ink', font:'爆炸體/狀聲詞字', metaphor:'Q版博士（Chibi Scientist）',
    image_prompt:'Manga panel, educational, black and white ink, screentones, speed lines, chibi scientist, --ar 3:4',
    text_prompt:'Script: Panel description, Sound FX, Dialogue；語氣誇張戲劇性', checklist:'狀聲詞✓ 網點質感✓' },
  { id:'07', cat:'A', name:'遊戲化任務地圖', en:'Gamified Quest Map', scene:'課程進度總覽、章節導航',
    color:'鮮豔遊戲地圖色', font:'遊戲介面字體', metaphor:'冒險者；主線任務→掉落寶物',
    image_prompt:'Gamified map interface, floating islands connected by path, level selection screen, --ar 16:9',
    text_prompt:'Quest Log: (Main Quest, Side Quest, Rewards)；語氣冒險公會', checklist:'Start按鈕✓ XP條✓' },
  { id:'08', cat:'A', name:'虛擬立體書', en:'Digital Pop-Up Book', scene:'故事敘述、歷史流程',
    color:'紙張原色、飽和插圖色', font:'印刷字體', metaphor:'說書人；封面→展開→驚喜',
    image_prompt:'Pop-up book style, 3D paper engineering, vivid illustrations, deep shadows',
    text_prompt:'Storybook flow with Surprise Reveal moments', checklist:'明顯投影✓ 摺疊痕跡✓' },
  { id:'09', cat:'B', name:'工程藍圖風', en:'Technical Blueprint', scene:'STEM、機械結構、系統原理',
    color:'背景#002FA7 線條白', font:'等寬字 Consolas/Courier New', metaphor:'系統分析師；型號/組件/原理',
    image_prompt:'Technical blueprint, cyanotype, white lines on blue grid, cross-section, schematics, --ar 16:9',
    text_prompt:'Technical Specification Table (Model, Components, Mechanism)', checklist:'背景#002FA7✓ 線條極細✓' },
  { id:'10', cat:'B', name:'神經網絡心智圖', en:'Mind Map Node Network', scene:'知識體系建構、關聯性展示',
    color:'深色背景 分支青/洋紅/琥珀', font:'Noto Sans Black / JetBrains Mono', metaphor:'大腦神經網絡；連結=突觸',
    image_prompt:'Mind map visualization, neural network aesthetic, glowing connections, dark bg, --ar 16:9',
    text_prompt:'Convert text to Nested List / JSON structure', checklist:'背景深色✓ 連結線發光✓' },
  { id:'11', cat:'B', name:'康乃爾筆記法', en:'Cornell Note System', scene:'筆記示範、生成 Flashcards',
    color:'紙張白/米色 重點螢光色', font:'美學手寫體', metaphor:'自我學習者；Cue→Note→Summary',
    image_prompt:'Cornell note sheet, handwritten, highlighter accents, cue column left, flat lay, --ar 3:4',
    text_prompt:'Cornell Format (Cue, Note, Summary) for Flashcard gen', checklist:'總結欄✓ 左問右答✓' },
  { id:'12', cat:'B', name:'學術期刊風', en:'Scientific Journal', scene:'建立權威感、長文閱讀',
    color:'白紙黑字', font:'Times New Roman 襯線', metaphor:'研究學者；摘要→前言→分析→參考文獻',
    image_prompt:'Scientific journal layout, double column, detailed diagram, white bg, --ar 8.5:11',
    text_prompt:'Academic Abstract & Introduction structure；語氣學術權威', checklist:'雙欄✓ Fig.標註✓' },
  { id:'13', cat:'B', name:'新創募資簡報', en:'Startup Pitch Deck', scene:'商業提案、解決問題報告',
    color:'藍黃配色（企業色）', font:'粗體無襯線 Bold Sans', metaphor:'創業者；痛點→解方→價值→CTA',
    image_prompt:'Startup pitch deck, corporate memphis, bold typography, blue and yellow, --ar 16:9',
    text_prompt:'Pitch Deck Flow (Problem, Solution, Value, CTA)；關鍵數據放大3倍', checklist:'數據放大3倍✓ CTA✓' },
  { id:'14', cat:'B', name:'等距微縮世界', en:'Isometric Tiny World', scene:'系統架構、生態系、工廠流程',
    color:'豐富色彩 Voxel方塊感', font:'清晰無襯線', metaphor:'觀察者God View；Zone A→B→C',
    image_prompt:'Isometric diorama, voxel art, 3D render, cross-section, tilt-shift, --ar 1:1',
    text_prompt:'Spatial Prepositions and Zones (A/B/C)；語氣導覽員', checklist:'30度視角✓ 剖面細節✓' },
  { id:'15', cat:'B', name:'瑞士國際主義', en:'Swiss International Style', scene:'社會科學、極致客觀內容',
    color:'黑白紅', font:'Helvetica（極大vs極小）', metaphor:'客觀記錄者；層級化大綱1.0→1.1',
    image_prompt:'Swiss international style poster, Josef Muller-Brockmann, grid-based, red and black, --ar 2:3',
    text_prompt:'Hierarchical Outline (Decimal numbering)；語氣冷靜機能主義', checklist:'標題內文對比極大✓ 嚴格左對齊✓' },
  { id:'16', cat:'B', name:'Aesthetic Notion筆記', en:'Aesthetic Notion', scene:'整理歸納、邏輯梳理',
    color:'低飽和度 Muted Colors', font:'Inter / Segoe UI', metaphor:'筆記整理者；Toggles/Callouts/Kanban',
    image_prompt:'Flat lay study desk, Notion dashboard, muted palette, minimal, --ar 4:3',
    text_prompt:'Notion Markdown (Toggles, Callouts, Kanban)；語氣條理分明', checklist:'Emoji✓ Callout色塊✓' },
  { id:'17', cat:'B', name:'深色代碼霓虹', en:'Dark Mode Neon', scene:'理科、程式教學',
    color:'底黑#000000 線青/洋紅', font:'程式碼字體 Monospace', metaphor:'開發者；If（重要）{ Highlight }',
    image_prompt:'Dark mode UI, neon code syntax highlighting, terminal aesthetic, cyan accents',
    text_prompt:'Code Block logic for explanations；語氣邏輯精確', checklist:'背景全黑✓ Code Block✓' },
  { id:'18', cat:'C', name:'即時通訊介面', en:'Chat Interface', scene:'數位原住民微學習、降低閱讀恐懼',
    color:'背景粉嫩漸層 氣泡灰(左)/藍(右)', font:'系統UI字體', metaphor:'左灰=老師(Q) 右藍=學生(A)',
    image_prompt:'Mobile chat app, text bubbles, user avatars, clean UI, pastel bg, --ar 9:16',
    text_prompt:'Teacher/Student Dialogue; Use Reply Quote；語氣口語自然', checklist:'氣泡顏色正確✓ 時間戳記✓' },
  { id:'19', cat:'C', name:'Lo-Fi 讀書室', en:'Lo-Fi Study Lounge', scene:'自習、閱讀引導、陪伴式學習',
    color:'背景深紫/靛藍 光暖黃', font:'Courier New / 像素字', metaphor:'溫柔伴讀者；語氣低語',
    image_prompt:'Lo-fi hip hop, anime style, night city, muted purple and blue, warm lamp, --ar 16:9 --niji 6',
    text_prompt:'Tone: Gentle companion；伴讀語句：開場→引導→轉場', checklist:'有貓咪✓ 光影暖色✓' },
  { id:'20', cat:'C', name:'Y2K 數位辣妹', en:'Y2K Cyber-Retro', scene:'資訊科技、歷史回顧、強調潮',
    color:'底黑 強調霓虹粉/綠', font:'變形寬體/點陣字', metaphor:'系統/駭客；System Boot→Warning→Output',
    image_prompt:'Y2K aesthetic, chrome 3D text, neon green and hot pink, glitch effect, wireframe globes, --ar 4:3',
    text_prompt:'System Log / Error Message style；語氣機械化警告', checklist:'螢光粉/綠✓ 金屬質感✓' },
  { id:'21', cat:'C', name:'街頭塗鴉反叛風', en:'Street Art Graffiti', scene:'歷史回顧、打破迷思',
    color:'紅磚色、水泥灰、噴漆紅', font:'噴漆字Stencil/手寫麥克筆', metaphor:'地下領袖；真相→打破規則',
    image_prompt:'Graffiti street art mural, vibrant spray paint, drip effect, urban wall texture, --ar 16:9',
    text_prompt:'Manifesto, aggressive tone, Truth Revealed；語氣強烈揭露', checklist:'噴漆圈圈代替紅框✓ 牆面背景✓' },
  { id:'22', cat:'C', name:'拼貼誌手作感', en:'Creative Chaos Zine', scene:'人文社會、創意寫作',
    color:'黑白照片混搭螢光塗鴉', font:'剪報字體/手寫體', metaphor:'編輯；大標題→小編筆記→剪報案例',
    image_prompt:'Mixed media collage, zine aesthetic, ripped paper textures, washi tape, --ar 3:4',
    text_prompt:'Magazine Column (Editor\'s Note + Case Study)；語氣個人化隨興', checklist:'圖片微旋轉✓ 膠帶/撕紙✓' },
  { id:'23', cat:'C', name:'無印極簡風', en:'Muji Zen Minimalism', scene:'理性、冷靜的視覺秩序',
    color:'白#FFFFFF 深灰#333333', font:'Helvetica 僅兩種大小', metaphor:'客觀陳述者；Bullet Points',
    image_prompt:'Minimalist educational poster, Bauhaus influence, ample negative space, muted palette, --ar 2:3',
    text_prompt:'Simplify text to Bullet Points only；語氣冷靜極簡', checklist:'留白佔版面 40% 以上✓ 僅黑白灰✓' },
  { id:'24', cat:'C', name:'暗黑學院風', en:'Dark Academia', scene:'文學、歷史、哲學',
    color:'深棕色調、金色、暖光', font:'僅限襯線字體 Serif Only', metaphor:'學院教授；諸位學者…',
    image_prompt:'Dark academia still life, old leather books, vintage microscope, candlelight, moody, --ar 16:9',
    text_prompt:'Tone: Professor lecturing scholars (Distinguished scholars...)；語氣學院講座', checklist:'全用襯線字體✓ 深棕金色調✓' },
  { id:'25', cat:'C', name:'玻璃擬態 UI', en:'Glassmorphism', scene:'資訊量大的圖解、儀表板',
    color:'背景鮮豔漸層 卡片白20-40%透', font:'清晰白色無襯線', metaphor:'現代OS儀表板；定義/數據/案例',
    image_prompt:'Glassmorphism UI, dashboard, frosted glass cards, background blur, vivid gradient, --ar 16:9',
    text_prompt:'Modular Information Cards；語氣現代科技', checklist:'卡片半透明磨砂✓ 背景鮮豔模糊✓' },
  { id:'26', cat:'C', name:'AR 科技介面', en:'Augmented Reality HUD', scene:'物理、天文、高科技主題',
    color:'線亮青色Cyan 底黑', font:'等寬字體 Monospace', metaphor:'系統AI；啟動→掃描→威脅評估',
    image_prompt:'First-person HUD view, augmented reality interface, floating holographic labels, --ar 16:9',
    text_prompt:'System Scan Report (Status, Analysis, Threat)；語氣系統回報', checklist:'線亮青色✓ 準星與邊框✓' },
  { id:'27', cat:'C', name:'吉卜力式自然風', en:'Ghibli Nature', scene:'自然科學、人文、治癒系',
    color:'鼠尾草綠、天空藍、奶油黃', font:'手寫風格楷體', metaphor:'探索者；日誌：地點/天氣/紀錄者/發現',
    image_prompt:'Ghibli style landscape, oil painting texture, lush greenery, soft clouds, warm tones',
    text_prompt:'Exploration Journal Log；語氣感性觀察', checklist:'手繪邊框✓ 油畫質感✓' },
  { id:'28', cat:'C', name:'卡哇伊貼紙美學', en:'Kawaii Sticker Bomb', scene:'國小、生活化主題',
    color:'豐富多彩、粉嫩', font:'可愛圓體', metaphor:'收藏家；普通→傳說→史詩',
    image_prompt:'Vector stickers, white die-cut border, grid background, pastel kawaii, cute characters',
    text_prompt:"Categorize info into Collectibles with Rarity levels；語氣熱情分享", checklist:'貼紙有白邊✓ 方格紙背景✓' },
  { id:'29', cat:'C', name:'韓系條漫卷軸', en:'Webtoon Scroll', scene:'故事性強、手機閱讀',
    color:'柔和光影', font:'適合螢幕閱讀字體', metaphor:'讀者；單點→懸念（Cliffhanger）',
    image_prompt:'Webtoon style panel, vertical composition, scrolling format, soft lighting',
    text_prompt:'Episodic format with Cliffhangers；語氣劇情推進', checklist:'長條形構圖✓ 大量留白✓' },
  { id:'30', cat:'C', name:'電子墨水閱讀器', en:'E-Ink / Paperwhite', scene:'長篇沈浸式閱讀',
    color:'黑白灰高對比', font:'Bookerly 襯線體', metaphor:'讀者；Chapter One→內文',
    image_prompt:'E-ink display, Kindle Paperwhite aesthetic, high contrast black and white, no glare',
    text_prompt:'Novel Chapter format；語氣沉靜文學', checklist:'僅黑白灰✓ 邊距足夠✓' },
  { id:'B01', cat:'B1', name:'黏土擬真3D軟陶', en:'Claymorphism & Plasticine', scene:'國小低年級、生活常識、引發好奇心',
    color:'馬卡龍粉彩：薄荷綠、奶油黃、嫩粉紅', font:'圓體 Nunito/Fredoka One', metaphor:'好奇球 vs 博士帽球；問答互動',
    image_prompt:'3D render, claymorphism style, soft inflated shapes, plasticine texture, cute pastel color palette, rounded edges, bright studio lighting, emboss shading, --ar 4:3 --v 6.0',
    text_prompt:'Design Q&A with two clay characters; use discovery-exclamation tone', checklist:'形狀有膨脹感✓ 馬卡龍粉彩✓' },
  { id:'B02', cat:'B1', name:'溫暖吉卜力自然風', en:'Warm Ghibli Nature', scene:'自然科學、語文故事、散文、治癒型內容',
    color:'翠綠、天藍、奶油白、金黃光暈', font:'手寫體或圓潤中文字體', metaphor:'小探險家（學生）＋精靈嚮導（教師）',
    image_prompt:'Anime style oil painting, Studio Ghibli background art, Hayao Miyazaki style, lush green grass, fluffy cumulus clouds, sunlight filtering through trees, Komorebi light, hand-painted texture, --ar 16:9 --niji 6',
    text_prompt:'Frame content as naturalist field notes; add hand-drawn botanical borders', checklist:'油畫筆觸感✓ 天空有積雨雲✓' },
  { id:'B03', cat:'B1', name:'虛擬立體書與剪紙', en:'Digital Pop-Up & Paper Cut', scene:'故事敘述、歷史流程、繪本導讀',
    color:'溫暖紙色＋彩色剪紙圖案', font:'圓體手寫感字體', metaphor:'說書人；故事角色從書頁中跳出來',
    image_prompt:'Paper cutout art style, pop-up book illustration, layered paper textures, distinct heavy shadows showing depth, origami elements, open book perspective, warm paper tones, --ar 4:3',
    text_prompt:'Design page-turn reveal mechanic; one concept per page spread', checklist:'多層紙張陰影感✓ 立體深度✓' },
  { id:'B04', cat:'B1', name:'清新水彩繪圖', en:'Fresh Watercolor', scene:'語文課、詩歌、散文、美感教育',
    color:'夢幻粉彩：淡藍、嫩綠、蜜桃粉', font:'優雅手寫體（襯線感）', metaphor:'無固定角色，以意象為主',
    image_prompt:'Soft watercolor painting, wet-on-wet technique, paper texture, pastel colors, bleeding color edges, dreamy atmosphere, botanical illustration style, --ar 3:2',
    text_prompt:'Structure as sensory journey: sight → sound → feeling → reflection', checklist:'顏色邊緣自然暈染感✓ 紙張纖維紋理✓' },
  { id:'B05', cat:'B1', name:'療癒色鉛筆', en:'Healing Colored Pencil', scene:'輔導課、繪本、低年級情緒教育',
    color:'暖色系：奶油黃、橘紅、草綠，略帶褪色感', font:'仿手寫字體，略帶歪斜感', metaphor:'簡單圓臉人物；溫柔鼓勵語氣',
    image_prompt:'Colored pencil illustration, waxy texture, visible hatching, soft warm tones, rough paper grain, childlike innocence, slightly imperfect lines, --ar 1:1',
    text_prompt:'Use affirming second-person tone; imperfect is beautiful', checklist:'蠟質排線感✓ 手繪不完美感✓' },
  { id:'B06', cat:'B1', name:'奇幻傳說繪本', en:'Fantasy Storybook', scene:'語文故事、歷史傳說、神話、角色流',
    color:'飽和暖色：深琥珀、森林綠、魔法紫、金色光暈', font:'裝飾性首字母；古典閱讀字體', metaphor:'傳說英雄；說書老師',
    image_prompt:'Vintage storybook collage, mixed media textures, whimsical fantasy, magical realism, warm saturated colors, ornate decorative borders, aged parchment background, --ar 4:5',
    text_prompt:'Frame as legendary tale; use narrative past tense with moral revelation', checklist:'羊皮紙紋理感✓ 裝飾性邊框✓' },
  { id:'B07', cat:'B2', name:'熱血少年戰鬥B', en:'Shonen Battle (B)', scene:'喚醒動機、挑戰困難概念、考前複習衝刺',
    color:'高對比：黑、白、紅', font:'毛筆字；Impact 粗斜體', metaphor:'教師＝解說員；難點＝怪物；解法＝必殺技',
    image_prompt:'Shonen manga style, dynamic angle, fish-eye lens, speed lines, impact sparks, intense facial expression, vibrant colors (red, black, white), --ar 16:9 --niji 6',
    text_prompt:'Define: Commentator vs Monster; Structure: Battle Analysis Format', checklist:'速度線✓ 紅黑對比強烈✓' },
  { id:'B08', cat:'B2', name:'韓系條漫卷軸B', en:'Webtoon Scroll (B)', scene:'故事性內容、手機閱讀、情感引導',
    color:'鮮豔單柔和：珊瑚橘、薰衣草紫、清晨藍', font:'圓潤無襯線；對話框手寫感', metaphor:'兩位個性對比的主角進行對話',
    image_prompt:'Webtoon style panel, vertical composition, manhwa art style, vibrant digital coloring, beautiful characters, scrolling format, soft emotional lighting, --ar 9:16',
    text_prompt:'One emotional beat per panel; end with cliffhanger', checklist:'垂直構圖✓ 每格只有一個焦點✓' },
  { id:'B09', cat:'B2', name:'Lo-Fi 讀書室B', en:'Lo-Fi Study Lounge (B)', scene:'自習材料、伴讀情境、長篇閱讀',
    color:'低飽和：紫藍夜色＋暖黃燈光', font:'細緻無襯線；行距寬鬆', metaphor:'讀書中的貓靜靜陪伴',
    image_prompt:'Lo-fi hip hop aesthetic, anime style illustration, messy desk, rain on glass, night time city skyline, muted purple and blue tones, warm yellow desk lamp, sleeping cat, --ar 16:9',
    text_prompt:'Use gentle second-person, slow pace; include rest encouragement', checklist:'色調低飽和✓ 有陪伴感生物（貓）✓' },
  { id:'B10', cat:'B2', name:'Y2K 數位復古科技', en:'Y2K Cyber-Retro (B)', scene:'資訊科技史、網路文化、2000年代懷舊',
    color:'霓虹綠、亮粉紅、電腦藍、黑底', font:'等寬點陣字體；鍍鉻 3D 效果', metaphor:'駭客學員 vs 系統 AI',
    image_prompt:'Y2K aesthetic, early 2000s internet style, chrome 3D text, glitch effect, matrix code, retro browser windows, neon green and hot pink, CRT scanlines, --ar 4:3',
    text_prompt:'Use system-boot format: <<< INIT >>> DATA LOADED; include fake error popups', checklist:'鍍鉻或故障感✓ 復古視窗 UI✓' },
  { id:'B11', cat:'B2', name:'Vtuber 學院B', en:'Vtuber Academy (B)', scene:'線上直播課、高互動需求、社群感強的教學',
    color:'明亮高彩度：粉紫、水藍、螢光黃', font:'動漫風圓體；直播風格字幕條', metaphor:'老師＝VTuber；學生＝聊天室觀眾',
    image_prompt:'Vtuber stream overlay design, education theme, space for camera in bottom left, chat box on right, cute anime mascot, high quality UI design, vibrant colors, --ar 16:9',
    text_prompt:'Script with audience interaction: include 刷777 moments; CTA at end', checklist:'左下角 Avatar 空間✓ 聊天室欄位✓' },
  { id:'B12', cat:'B2', name:'新海誠光影', en:'Shinkai Cinematic', scene:'情感引導、回憶性文本、散文、課文情境鋪陳',
    color:'電影感：暮光橘粉、藍紫夜空、白色光暈', font:'細緻優雅的無襯線', metaphor:'遠方的人物剪影；引導者為旁白',
    image_prompt:'Makoto Shinkai style, hyper-realistic sky, lens flares, emotional lighting, cinematic anime background, high contrast, dramatic sunset or starry night, --ar 16:9 --niji 6',
    text_prompt:'Art Style: Shinkai. Mood: Cinematic. Focus on emotional resonance and visual metaphors.', checklist:'光影細膩✓ 情感氛圍✓' },
  { id:'B13', cat:'B2', name:'學習漫畫風B', en:'Manga Science (B)', scene:'科學原理、歷史故事、流程說明',
    color:'黑白為主，偶有單一強調色', font:'漫畫手寫感；對話框字體圓潤', metaphor:'Q版科學家（教師）+ 好奇學生',
    image_prompt:'Educational manga style, black and white ink, screentones, speed lines, chibi scientist character, distinct speech bubbles, multiple panel layout, --ar 3:4',
    text_prompt:'Use manga dialogue; include ??! reaction moments', checklist:'網點感✓ 對話框漫畫風格✓' },
  { id:'B14', cat:'B2', name:'暗黑學院風B', en:'Dark Academia (B)', scene:'文學、歷史、哲學、古文、維多利亞風格課文',
    color:'深棕、金、奶油、墨黑；暖燭光調', font:'襯線體：Times New Roman；首字母大型裝飾', metaphor:'學者教授（引導者）+ 求知學徒',
    image_prompt:'Dark academia aesthetic, old leather books, vintage microscope, warm candlelight, moody atmosphere, classical library background, Victorian Gothic, aged parchment, --ar 16:9',
    text_prompt:'Use academic lecture tone; include Latin phrases or classical allusions', checklist:'燭光氛圍✓ 色調深棕金✓' },
  { id:'B15', cat:'B3', name:'遊戲化任務地圖B', en:'Gamified Quest Map (B)', scene:'課程進度總覽、單元導覽、任務導向學習',
    color:'鮮豔卡通：草綠地圖、藍色海洋、金色寶箱', font:'遊戲 UI 字體（粗體、帶邊框）', metaphor:'學生＝冒險者；教師＝NPC嚮導；難點＝Boss',
    image_prompt:'Video game level map, winding path, level markers, treasure chests, vibrant cartoon style, vector illustration, flat design with slight depth, RPG overworld map, --ar 16:9',
    text_prompt:'Set: Main Quest vs Side Quest; mark Boss encounters; end with reward chest', checklist:'清楚路徑✓ 各站有圖示標記✓' },
  { id:'B16', cat:'B3', name:'集換式英雄卡牌B', en:'Trading Card Heroes (B)', scene:'歷史人物介紹、化學元素、生物物種',
    color:'依稀有度配色：普通=銀、稀有=金、傳說=彩虹全息', font:'中世紀裝飾字體；清晰等寬體（數據）', metaphor:'每個知識點＝一張英雄卡；技能＝重要屬性',
    image_prompt:'Trading card design, fantasy art style, detailed character portrait, ornate gold border, stats panel, elemental icons, holographic foil effect, --ar 2:3',
    text_prompt:'Format: Name / Rarity / Ability description / Stats grid', checklist:'金邊框✓ 數據面板區✓' },
  { id:'B17', cat:'B3', name:'等距微縮世界B', en:'Isometric Voxel & Tiny World', scene:'系統架構說明、生態系介紹、空間關係',
    color:'清新飽和：天藍底座、白色建築、綠色植被', font:'簡潔無襯線；引線指向元件', metaphor:'微縮人物在場景中工作；解說員語氣',
    image_prompt:'Isometric diorama, voxel art style, 3D render, cross-section view, cute miniature characters, detailed environment, tilt-shift effect, bright colors, --ar 1:1',
    text_prompt:'Use spatial prepositions; annotate with leader lines', checklist:'等角 45度視角✓ 微縮人物✓' },
  { id:'B18', cat:'B3', name:'像素復古風B', en:'Pixel Art Retro (B)', scene:'電腦科學、遊戲化評量、8-bit 懷舊主題',
    color:'復古遊戲配色：限制性 8-16 色；主色鮮明', font:'點陣字體：Press Start 2P', metaphor:'主角像素人物；敵人＝知識難點怪物',
    image_prompt:'Pixel art, 16-bit style, SNES era graphics, dithering texture, retro game interface overlay with hearts and score, vibrant limited color palette, --ar 16:9',
    text_prompt:'Frame as game walkthrough; use HP/MP/Score metaphors', checklist:'像素方塊清晰可見✓ HUD 元素（血條/分數）✓' },
  { id:'B19', cat:'B4', name:'工程藍圖', en:'Engineering Blueprint', scene:'STEM、系統原理、機械結構說明',
    color:'深藍底 #0b1623 配橙色高光；或白底藍線', font:'等寬工程字體；標尺刻度標示', metaphor:'工程師視角；系統元件化',
    image_prompt:'Technical engineering blueprint, exploded view, white wireframes, angular leader lines, drafting grid lines, dark blue background, orange accent highlights, flat schematic lighting, --ar 16:9',
    text_prompt:'Format as spec sheet; use technical numbering and callouts', checklist:'製圖格線✓ 引線標注✓' },
  { id:'B20', cat:'B4', name:'深色代碼霓虹B', en:'Dark Mode Neon (B)', scene:'程式教學、資料科學、演算法說明',
    color:'黑底＋螢光色：電藍、霓虹綠、紫色高光', font:'等寬字體 Fira Code；螢光色代碼區塊', metaphor:'程式設計師視角；Bug＝敵人；解法＝patch',
    image_prompt:'Scientific schematic, blueprint style, glowing neon blue lines on black background, futuristic UI, data visualization streams, high contrast, code-like elements, --ar 16:9',
    text_prompt:'Use code block styling; include complexity notation', checklist:'黑底螢光✓ 代碼區塊感✓' },
  { id:'B21', cat:'B4', name:'AR 科技介面B', en:'Augmented Reality HUD (B)', scene:'物理、天文、生物解剖、空間概念',
    color:'透明藍綠＋白色文字；背景為真實場景照片', font:'等寬字體 Monospace；細線框', metaphor:'探索者戴著 AR 眼鏡掃描目標',
    image_prompt:'First-person view through smart glasses, augmented reality interface overlay (HUD), floating holographic text labels, neon blue wireframes, sci-fi educational aesthetic, --ar 16:9',
    text_prompt:'Format as system scan report; use scanning/analysis narrative', checklist:'第一人稱視角感✓ AR 標籤浮層✓' },
  { id:'B22', cat:'B4', name:'無印極簡風B', en:'Muji Zen Minimalism (B)', scene:'極致簡潔需求、冥想/正念主題、高端品牌感',
    color:'米色/灰/磚紅；極克制，最多三色', font:'細緻無襯線；字號層次嚴謹', metaphor:'無角色；以物件和空間說話',
    image_prompt:'Minimalist educational poster, Bauhaus influence, ample negative space, grid system, clean typography, muted color palette, natural paper white, --ar 2:3',
    text_prompt:'Strict: one idea per slide; use white space as design element', checklist:'留白佔版面 40% 以上✓ 最多三色✓' },
  { id:'B23', cat:'B4', name:'瑞士國際主義B', en:'Swiss International Style (B)', scene:'社會科學、客觀分析、新聞媒體主題',
    color:'紅黑為主；照片黑白處理；最多一個強調色', font:'Helvetica / Neue Haas Grotesk；左對齊', metaphor:'客觀報導者；數據自己說話',
    image_prompt:'Swiss international style poster, grid-based layout, bold sans-serif typography, asymmetrical composition, red and black color scheme, modernist design, --ar 2:3',
    text_prompt:'One column per argument; use flush left alignment', checklist:'明顯網格排版✓ 無襯線粗體✓' },
  { id:'B24', cat:'B4', name:'學術期刊風B', en:'Scientific Journal (B)', scene:'建立知識權威感、研究報告、科學論文導讀',
    color:'黑白為主；圖表用藍或紅單色', font:'襯線體：Times New Roman / Georgia', metaphor:'研究者視角；數據＝論據',
    image_prompt:'Scientific journal page layout, double column text, detailed diagram, figure captions, serif typography, academic aesthetic, white paper background, --ar 8.5:11',
    text_prompt:'Use IMRaD structure; add Fig. captions; cite with superscripts', checklist:'雙欄排版✓ Fig. 圖說格式✓' },
  { id:'B25', cat:'B4', name:'新創募資簡報B', en:'Startup Pitch Deck (B)', scene:'商業提案、問題解決方案展示、說服性簡報',
    color:'藍＋黃為主；或品牌主色＋白底', font:'粗體無襯線（標題）；細體無襯線（正文）', metaphor:'創業者對投資人；問題＝市場痛點',
    image_prompt:'Startup pitch deck slide, modern corporate memphis style, bold typography, clean vector art, flat design, professional and persuasive, minimal but impactful, --ar 16:9',
    text_prompt:'Pain → Solution structure; use CTA headlines; bold the key number', checklist:'每頁只有一個核心論點✓ 關鍵數字夠大✓' },
  { id:'B26', cat:'B4', name:'神經網絡心智圖B', en:'Mind Map Node (B)', scene:'知識體系建構、概念關聯、複習總整理',
    color:'深色底＋彩色節點；越重要越亮', font:'輕量無襯線；節點內文字要簡潔', metaphor:'整理者視角；各概念為節點',
    image_prompt:'Neural network mind map visualization, glowing connection lines, dark background, colorful nodes with hierarchy, knowledge graph style, interconnected concepts, --ar 16:9',
    text_prompt:'Max 3 hierarchy levels; keep node labels to 3 words max', checklist:'放射狀層次✓ 連線有發光感✓' },
  { id:'B27', cat:'B4', name:'玻璃擬態UIB', en:'Glassmorphism (B)', scene:'資訊量大的圖解、儀表板、數位科技主題',
    color:'鮮豔漸層背景＋白色半透明卡片', font:'細緻無襯線白色字體', metaphor:'系統管理者視角；資訊＝模組卡片',
    image_prompt:'Glassmorphism UI design, frosted glass cards with background blur, vivid gradient background, white outline cards, clean icons, futuristic interface, --ar 16:9',
    text_prompt:'Organize as card modules; hierarchy: overview → detail → action', checklist:'卡片半透明毛玻璃感✓ 背景夠鮮豔✓' },
  { id:'B28', cat:'B4', name:'現代扁平設計', en:'Modern Flat Design', scene:'數學規則說明、App 介面教學、通用教育',
    color:'大膽原色或莫蘭迪色；單色主題', font:'粗體無襯線；字號對比明確', metaphor:'設計師視角；資訊模組化',
    image_prompt:'Modern flat design illustration, bold geometric shapes, clean vector art, bright solid colors, no shadows, corporate memphis style, --ar 16:9',
    text_prompt:'Use numbered steps; icon+label pairs; no decorative text', checklist:'無陰影✓ 使用純色幾何✓' },
  { id:'B29', cat:'B4', name:'新擬物化科技', en:'Neumorphism', scene:'互動設計教學、UI/UX 概念、現代科技美學',
    color:'低對比單色系：米白、淺灰、淡藍', font:'輕量無襯線；顏色略深於背景', metaphor:'使用者操作者視院',
    image_prompt:'Neumorphism UI design, soft shadow emboss effect, monochromatic light gray background, subtle depth, tactile feel, clean rounded shapes, --ar 16:9',
    text_prompt:'Describe interaction states: default → hover → active', checklist:'明暗兩側軟陰影✓ 背景和元件同色系✓' },
  { id:'B30', cat:'B4', name:'熱成像數據科技', en:'Thermal / Heatmap', scene:'數據分析、物理熱力學、統計分布、注意力地圖',
    color:'低→高：藍→綠→黃→紅→白（溫度色階）', font:'等寬字體；顏色對比數據區', metaphor:'科學家視角；顏色＝強度訊號',
    image_prompt:'Thermal heatmap visualization, temperature color gradient (blue to red), scientific data overlay, infrared camera aesthetic, contour lines, analytical style, --ar 16:9',
    text_prompt:'Describe by temperature zone; identify hotspots and coldspots', checklist:'藍→紅色階✓ 圖例色條✓' },
  { id:'B31', cat:'B4', name:'便當盒風格', en:'Bento Box Grid', scene:'多概念並陳、Apple 風格產品介紹、功能對比',
    color:'深色底（黑/深藍）＋各格自有主色；或全白極簡', font:'大標題粗體；格內文字中等', metaphor:'策展人視角；每格一個主題',
    image_prompt:'Bento box grid layout, Apple-style product showcase, unequal rectangle grid, rounded corners, dark background with colorful accent cells, clean modern aesthetic, --ar 16:9',
    text_prompt:'Each cell = one concept; main cell headline + supporting cells', checklist:'格子大小不等✓ 每格各有獨立主題✓' },
  { id:'B32', cat:'B5', name:'康乃爾筆記法B', en:'Cornell Note System (B)', scene:'筆記示範、複習策略、主動學習技巧',
    color:'米白紙底＋螢光黃/粉/綠；藍色鋼筆線條', font:'仿手寫字體；各欄字號有層次', metaphor:'學習者視角；整理思考的過程可見',
    image_prompt:'Cornell note-taking sheet, handwritten notes, aesthetic handwriting, highlighter accents, cue column left, summary box bottom, flat lay, notebook paper texture, --ar 3:4',
    text_prompt:'Left: keywords only; Right: explanation; Bottom: one-sentence summary', checklist:'三區分欄✓ 螢光筆畫記感✓' },
  { id:'B33', cat:'B5', name:'電子墨水閱讀器B', en:'E-Ink Reader (B)', scene:'長篇閱讀、深度閱讀教材、沉浸式文本',
    color:'純黑文字＋米白背景；無彩色', font:'優質閱讀襯線體：Bookerly / Georgia', metaphor:'讀者視角；無角色干擾',
    image_prompt:'E-ink display screen, kindle paperwhite aesthetic, high contrast black and white, paper texture, sharp typography, no glare, wide margins, --ar 3:4',
    text_prompt:'Wide margins; chapter structure; pull quotes in italic', checklist:'高對比黑白✓ 行距寬鬆✓' },
  { id:'B34', cat:'B5', name:'Aesthetic Notion筆記', en:'Aesthetic Notion (B)', scene:'整理歸納、個人知識庫、PKM 個人知識管理',
    color:'莫蘭迪色系：奶茶、粉灰、sage綠', font:'Notion 系統字體；Emoji 輔助分類', metaphor:'知識整理者；資訊以 Block 為單位',
    image_prompt:'Flat lay photography, open laptop showing Notion dashboard, aesthetic stationery, muted Morandi color palette, minimal and organized, coffee shop ambiance, --ar 4:3',
    text_prompt:'Use callout boxes, toggle lists, and emoji category headers', checklist:'莫蘭迪色感✓ 模擬 Notion 介面結構✓' },
  { id:'B35', cat:'B5', name:'拼貼誌手作感B', en:'Zine / Collage (B)', scene:'人文社會、創意寫作、打破規範主題',
    color:'龐克配色：黃底黑字、紅色強調；或褪色復古感', font:'剪報拼貼字體；手寫斜體注記', metaphor:'自由表達者；規則可以被打破',
    image_prompt:'Mixed media collage art, zine aesthetic, ripped paper textures, vintage photographs, punk graphic design, chaotic but artistic layout, washi tape elements, --ar 3:4',
    text_prompt:'Use manifesto tone; mix fonts; rotate text blocks; break the grid', checklist:'撕紙邊緣感✓ 排版刻意不整齊✓' },
  { id:'B36', cat:'B5', name:'復古漫畫動作藍圖', en:'Retro-Comic Blueprint', scene:'產品發布說明、問題解決展示、機制揭示',
    color:'黃底紅藍點綴；或藍底白線混搭漫畫色塊', font:'Comic-style 字體；狀聲詞特效字', metaphor:'超級英雄＝解決方案；反派＝問題',
    image_prompt:'Retro-comic book style, bold black outlines, Ben-Day dots shading, motion lines, jagged explosion bubbles, dynamic action composition, yellow and red palette, --ar 16:9',
    text_prompt:'Use comic panel structure; add SFX words; hero vs villain framing', checklist:'Ben-Day dots 網點✓ 鋸齒爆炸框✓' },
  { id:'B37', cat:'B5', name:'即時通訊介面B', en:'Chat Interface (B)', scene:'微學習、角色扮演對話、降低陌生感',
    color:'粉彩背景：粉藍、淡綠；氣泡用白或主色', font:'系統 UI 字體；氣泡內字體中等', metaphor:'教師＝藍色氣泡（左）；學生＝灰色氣泡（右）',
    image_prompt:'Mobile chat app interface, text bubbles, user avatars, cute sticker reactions, clean UI, pastel background, smartphone screen view, --ar 9:16',
    text_prompt:'Left: teacher blue bubble; Right: student gray bubble; include emoji', checklist:'對話氣泡✓ 頭像區分角色✓' },
  { id:'B38', cat:'B5', name:'街頭塗鴉反叛風B', en:'Street Art Graffiti (B)', scene:'打破迷思、社會議題、批判性思考',
    color:'鮮豔噴漆色：螢光橘、電藍、亮紅；深灰底', font:'模版噴刷體；手寫塗鴉字', metaphor:'街頭藝術家視角；批評者與被批評者',
    image_prompt:'Graffiti street art mural, vibrant spray paint colors, drip effect, urban concrete wall texture, bold tag typography, stencil art elements, Banksy-inspired, --ar 16:9',
    text_prompt:'Use manifesto headlines; red circle for emphasis; reveal truth structure', checklist:'噴漆滴落效果✓ 水泥牆紋理感✓' },
  { id:'B39', cat:'B5', name:'水墨科技卷軸', en:'Sumi-e Tech Scroll', scene:'古文、古典詩詞、東方美學與科技融合主題',
    color:'墨黑、水墨灰、宣紙米白；偶有朱紅印章點綴', font:'毛筆字（標題）；細明體（正文）', metaphor:'學者文人視角；知識如詩般呈現',
    image_prompt:'Sumi-e ink wash painting, Chinese calligraphy scroll, black ink brushstrokes on rice paper, negative space (liubai), red stamp seal, subtle circuit board elements fusion, --ar 9:16',
    text_prompt:'Open with classical quote; use vertical text flow; end with reflection', checklist:'明顯留白✓ 毛筆墨跡感✓' },
  { id:'B40', cat:'B5', name:'教育手繪筆記', en:'Educational Sketch-Note', scene:'視覺筆記示範、觀念速寫、工作坊紀錄',
    color:'黑白線稿＋1-3個強調色螢光筆', font:'仿手寫字體；大小區別層次', metaphor:'現場聆聽者視角；即時記錄感',
    image_prompt:'Educational sketchnote style, hand-drawn icons, bullet points with simple illustrations, marker pen feel, 2-3 highlight colors on white paper, visual note-taking aesthetic, --ar 4:3',
    text_prompt:'Max 5 words per point; every concept has an icon; use banners for headers', checklist:'每個概念有對應圖示✓ 手繪線條感✓' },
  { id:'B41', cat:'B5', name:'復古浮世繪', en:'Retro Ukiyo-e', scene:'日本文化、東亞歷史、傳統藝術主題',
    color:'傳統礦物色：靛藍、朱紅、黃土、墨黑', font:'仿日式木版印刷字形', metaphor:'以傳統人物或自然場景作為知識載體',
    image_prompt:'Ukiyo-e woodblock print style, bold black outlines, flat mineral pigment colors, Hokusai wave pattern, traditional Japanese aesthetic, --ar 2:3',
    text_prompt:'Use historical narration; describe scene then explain cultural context', checklist:'粗黑輪廓線✓ 礦物色平塗感✓' },
  { id:'B42', cat:'B5', name:'孔版印刷復古普普', en:'Risograph / Retro-Pop', scene:'文化活動、演講海報、獨立出版物',
    color:'孔版標準色：螢光粉、電藍、螢光黃（每次最多雙色）', font:'圓潤普普字體；或粗體 Grotesque', metaphor:'海報設計師視角；訊息要在3秒內傳達',
    image_prompt:'Risograph print style, two-color overlay, slight misregistration, halftone dots, fluorescent pink and blue, paper texture visible, indie publication aesthetic, --ar 2:3',
    text_prompt:'Minimal text: headline + one subhead only; bold colors', checklist:'套印偏差感✓ 只用雙色✓' },
  { id:'B43', cat:'B5', name:'賽博龐克 HUD', en:'Cyberpunk HUD', scene:'未來科技、反烏托邦主題、科幻概念',
    color:'霓虹紫/電藍/螢光粉；深黑底', font:'等寬字體；中文用粗體方形字', metaphor:'駭客或網路偵探視角',
    image_prompt:'Cyberpunk HUD interface, neon purple and electric blue, rain-soaked night city, holographic display overlays, scanlines, dark atmospheric background, --ar 16:9',
    text_prompt:'Use system alert format; include HUD corner elements; mission-based structure', checklist:'HUD 四角元素✓ 霓虹發光感✓' },
  { id:'B44', cat:'B5', name:'美式復古餐廳海報', en:'American Diner', scene:'生活化比喻、美式文化主題、輕鬆有趣的內容',
    color:'紅＋黃＋白；或青綠＋珊瑚粉復古配色', font:'復古廣告字體：Rockwell、Playbill', metaphor:'熱情的服務生介紹今日特餐（課程內容）',
    image_prompt:'American retro diner poster, 1950s style typography, bold red and yellow, vintage advertisement aesthetic, star burst shapes, checkered pattern, worn paper texture, --ar 2:3',
    text_prompt:"Use today's special menu format; mix font sizes dramatically", checklist:'復古廣告字體✓ 紅黃配色✓' },
  { id:'B45', cat:'B5', name:'卡哇伊貼紙大爆炸', en:'Kawaii Sticker Bomb (B)', scene:'國小低年級、生活課程、獎勵集點設計',
    color:'明亮活潑：粉紅、水藍、嫩黃、薄荷綠', font:'超圓潤字體；文字有可愛描邊', metaphor:'小動物或食物造型角色；每個知識點是一張貼紙',
    image_prompt:'Kawaii sticker bomb, white die-cut border stickers, grid paper background, cute animal and food characters, bright pastel colors, flat lay style, --ar 1:1',
    text_prompt:'Each concept = one sticker; use collection/achievement framing', checklist:'白色模切邊框感✓ 貼紙分散排列✓' },
  { id:'B46', cat:'B5', name:'新國風水墨', en:'Neo-Traditional Ink', scene:'古文、古典詩詞、歷史、傳統文化',
    color:'墨黑＋朱紅點綴；偶有金色；宣紙米白底', font:'毛筆楷書（標題）；細明體（正文）', metaphor:'學者文人或傳統工匠；知識蘊含在意境中',
    image_prompt:'Neo-traditional Chinese ink wash painting, Sumi-e brushstrokes, negative space (liubai), mountain mist, contemporary composition, red seal stamp, rice paper texture, --ar 16:9',
    text_prompt:'Open with classical allusion; use minimal text with bold calligraphy title', checklist:'大量留白✓ 毛筆書法感✓ 印章點綴✓' }
];