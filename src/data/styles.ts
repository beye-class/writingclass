import { StyleDefinition } from './types';

/**
 * ⚒️ 專案架構師 v10.0 - 視覺風格矩陣 v8.0 全量對齊版 (含 3D 皮克斯)
 */
export const styleLib: StyleDefinition[] = [
  // --- A 類：繪畫／手繪風 ---
  {
    id: 'A1', cat: 'A', name: '吉卜力', en: 'Ghibli', scene: '記敘文',
    color: '溫暖自然', font: '手寫體', metaphor: '少女意境、故事性強',
    image_prompt: 'Studio Ghibli style, hand-painted anime art, lush greenery, warm golden lighting, --ar 16:9',
    text_prompt: '強調手繪感與自然光影，呈現溫馨氛圍。', checklist: '手繪感✓ 溫暖光影✓'
  },
  {
    id: 'A2', cat: 'A', name: '新海誠', en: 'Shinkai', scene: '描寫文 / Action',
    color: '高對比、光斑', font: '寫實字體', metaphor: '光線散景、都市情感 🔒 Mix',
    image_prompt: 'Makoto Shinkai style, hyper-realistic sky, lens flares, high contrast, cinematic anime background, --ar 16:9',
    text_prompt: 'Art Style: Shinkai. Mood: Cinematic. Lighting: Lens flares.', checklist: '光影細膩✓ 壯闊天空✓'
  },
  {
    id: 'A3', cat: 'A', name: '水彩', en: 'Watercolor', scene: '記敘文 / 描寫文',
    color: '透明感', font: '柔和字體', metaphor: '暈染、詩意',
    image_prompt: 'Soft watercolor painting, wet-on-wet technique, paper texture, pastel colors, --ar 16:9',
    text_prompt: '強調透明感與色彩暈染。', checklist: '暈染效果✓ 紙張質感✓'
  },
  {
    id: 'A4', cat: 'A', name: '色鉛筆', en: 'Colored Pencil', scene: '記敘文',
    color: '柔和暖調', font: '童趣字體', metaphor: '童趣、手感、溫馨',
    image_prompt: 'Colored pencil drawing, waxy texture, soft warm tones, childlike innocence, --ar 16:9',
    text_prompt: '呈現蠟質質感與細膩排線。', checklist: '手感排線✓ 溫馨色調✓'
  },
  {
    id: 'A5', cat: 'A', name: '水墨', en: 'Ink Wash', scene: '描寫文',
    color: '黑白、朱紅', font: '書法體', metaphor: '留白、意境、東方美',
    image_prompt: 'Traditional Chinese Ink wash, brush strokes, negative space, Zen minimalism, --ar 16:9',
    text_prompt: '強調筆觸與留白美學。', checklist: '禪意留白✓'
  },
  {
    id: 'A6', cat: 'A', name: '浮世繪', en: 'Ukiyo-e', scene: '描寫文',
    color: '礦物顏料色', font: '古典字體', metaphor: '版畫感、強對比、日式傳統',
    image_prompt: 'Ukiyo-e woodblock print, bold outlines, mineral pigments, traditional Japanese art, --ar 16:9',
    text_prompt: '呈現大膽輪廓與扁平透視。', checklist: '版畫質感✓'
  },
  {
    id: 'A7', cat: 'A', name: '塗鴉', en: 'Doodle', scene: '想像文',
    color: '原子筆色', font: '手寫字體', metaphor: '隨性、線條感、創意爆發',
    image_prompt: 'Hand-drawn doodle, ballpoint pen lines, grid notebook background, bullet journal aesthetic, --ar 16:9',
    text_prompt: '隨性線條，適合創意發想。', checklist: '隨性線條✓'
  },
  {
    id: 'A8', cat: 'A', name: '美式漫畫', en: 'Comics', scene: '議論文',
    color: '高飽和色彩', font: '爆炸體', metaphor: '分格、對話框、動感',
    image_prompt: 'American comic book style, bold lines, halftone dots, action lines, dynamic composition, --ar 16:9',
    text_prompt: '使用分格設計與動作線條。', checklist: '動態分格✓'
  },

  // --- B 類：設計／數位風 ---
  {
    id: 'B1', cat: 'B', name: '扁平向量', en: 'Flat Vector', scene: '說明文',
    color: '大膽純色', font: '無襯線體', metaphor: '乾淨、icon感、現代',
    image_prompt: 'Modern Flat Design, clean geometric shapes, bold solid colors, minimalist vector art, --ar 16:9',
    text_prompt: '簡潔幾何形狀。', checklist: '幾何圖形✓'
  },
  {
    id: 'B2', cat: 'B', name: '資訊圖', en: 'Infographic', scene: '說明文',
    color: '邏輯配色', font: '技術字體', metaphor: '數據視覺化、流程清晰',
    image_prompt: 'Isometric infographic, clean blocks, technical lines, logical structure, --ar 16:9',
    text_prompt: '強調流程與數據結構。', checklist: '流程清晰✓'
  },
  {
    id: 'B3', cat: 'B', name: '像素積木', en: 'Voxel', scene: '說明文',
    color: '積木原色', font: '像素字體', metaphor: '遊戲感、立體像素 🔒 Mix',
    image_prompt: 'Voxel art, 3D pixel blocks, isometric view, LEGO-like aesthetic, --ar 16:9',
    text_prompt: '3D 像素立體化。', checklist: '立體像素✓'
  },
  {
    id: 'B4', cat: 'B', name: '工程藍圖', en: 'Blueprint', scene: '說明文 / Tools',
    color: '藍底白線', font: '等寬字', metaphor: '結構清晰、專業感 🔒 Mix',
    image_prompt: 'Technical blueprint, white lines on blue grid, cross-section, schematic diagram, --ar 16:9',
    text_prompt: 'Art Style: Blueprint. Composition: Schematic diagram with labels.', checklist: '專業藍圖✓'
  },
  {
    id: 'B5', cat: 'B', name: '賽博龐克', en: 'Cyberpunk', scene: '想像文 / Slide 0',
    color: '霓虹色調', font: '未來感', metaphor: '未來都市、高對比 🔒 Mix',
    image_prompt: 'Cyberpunk city, neon lights, high contrast, futuristic atmosphere, rain-slicked streets, --ar 16:9',
    text_prompt: 'Art Style: Cyberpunk. Lighting: Neon glow.', checklist: '霓虹氛圍✓'
  },
  {
    id: 'B6', cat: 'B', name: '偵探線索牆', en: 'Detective Board', scene: '議論文 / Tools',
    color: '木質感', font: '手寫筆跡', metaphor: '紅線連接、照片釘板 🔒 Mix',
    image_prompt: 'Detective evidence board, pinned photos, red string connections, handwritten notes, --ar 16:9',
    text_prompt: 'Art Style: Detective Board. Negative Prompt: No people.', checklist: '懸疑感✓'
  },
  {
    id: 'B7', cat: 'B', name: '黑板', en: 'Chalkboard', scene: '議論文 / Tools',
    color: '黑白', font: '粉筆字', metaphor: '教室質感、手寫感 🔒 Mix',
    image_prompt: 'Chalkboard background, white chalk drawings, messy erase marks, classroom aesthetic, --ar 16:9',
    text_prompt: 'Art Style: Chalkboard. Style: Handwritten sketches.', checklist: '教室感✓'
  },
  {
    id: 'B8', cat: 'B', name: 'Knolling', en: 'Knolling', scene: 'Tools 頁通用',
    color: '背景單純', font: '無', metaphor: '俯拍平鋪、物件排列整齊 🔒 Mix',
    image_prompt: 'Knolling photography, top-down flat lay, neatly organized items, symmetrical, --ar 16:9',
    text_prompt: 'Art Style: Knolling. Composition: Top-down flat lay.', checklist: '排列整齊✓'
  },
  {
    id: 'B9', cat: 'B', name: '數據實驗室', en: 'Data Lab', scene: '說明文 / 實驗報告',
    color: '冷色調、科技藍', font: '無襯線體', metaphor: '精密儀器、數據流、實驗感',
    image_prompt: 'High-tech laboratory aesthetic, data visualization overlays, glowing UI elements, clean glass surfaces, blue and white color palette, --ar 16:9',
    text_prompt: '強調精密感與數據視覺化。', checklist: '數據疊層✓ 科技感✓'
  },
  {
    id: 'B10', cat: 'B', name: '極簡百科', en: 'Modern Wiki', scene: '說明文 / 知識科普',
    color: '高對比黑白、純淨', font: '襯線體 / 黑體', metaphor: '權威感、版面留白、圖鑑感',
    image_prompt: 'Minimalist encyclopedia layout, high-quality object photography on plain white background, clean typography, structured labels, editorial aesthetic, --ar 16:9',
    text_prompt: '強調版面留白與權威圖鑑感。', checklist: '純淨留白✓ 標籤化設計✓'
  },
  {
    id: 'B11', cat: 'B', name: '數位拆解', en: 'Exploded View', scene: '說明文 / 構造解析',
    color: '中性灰、點綴色', font: '技術等寬字', metaphor: '零件拆解、構造美學、邏輯清晰',
    image_prompt: 'Exploded view diagram of a complex object, floating parts, technical connecting lines, clean studio lighting, neutral background, --ar 16:9',
    text_prompt: '展現物體內部構造與零件關係。', checklist: '零件拆解✓ 構造邏輯✓'
  },

  // --- C 類：書籍／插畫風 ---
  {
    id: 'C1', cat: 'C', name: '繪本', en: 'Storybook', scene: '記敘文 / Action',
    color: '溫馨飽和', font: '圓潤體', metaphor: '故事感、溫馨 🔒 Mix',
    image_prompt: 'Children storybook illustration, soft colors, rounded shapes, whimsical, --ar 16:9',
    text_prompt: 'Art Style: Storybook. Mood: Gentle.', checklist: '溫馨故事感✓'
  },
  {
    id: 'C2', cat: 'C', name: '立體彈跳書', en: 'Pop-up Book', scene: '記敘文 / End-2',
    color: '紙質感', font: '立體字', metaphor: '3D立體感、翻書概念',
    image_prompt: 'Pop-up book, 3D paper engineering, layered paper art, deep shadows, --ar 16:9',
    text_prompt: '展現 3D 紙張層次。', checklist: '立體摺痕✓'
  },
  {
    id: 'C3', cat: 'C', name: '科普雜誌', en: 'Science Mag', scene: '說明文 / Slide 0',
    color: '整潔白底', font: '黑體', metaphor: '版面整潔、知識感 🔒 Mix',
    image_prompt: 'Science magazine layout, clean typography, editorial photography, diagram overlays, --ar 16:9',
    text_prompt: 'Art Style: Science Mag. Composition: Layout with text placeholders.', checklist: '專業排版✓'
  },
  {
    id: 'C4', cat: 'C', name: '軟陶', en: 'Clay', scene: '描寫文',
    color: '黏土色', font: '圓潤字', metaphor: '立體質感、溫暖色調',
    image_prompt: 'Claymorphism, 3D render, soft clay texture, stop-motion look, --ar 16:9',
    text_prompt: '呈現軟陶捏塑質感。', checklist: '黏土質感✓'
  },
  {
    id: 'C5', cat: 'C', name: '剪紙', en: 'Paper Cut', scene: '想像文',
    color: '鮮豔層次', font: '剪紙體', metaphor: '剪影、層次感、民俗美',
    image_prompt: 'Layered paper cut art, vibrant colors, subtle shadows, folk art style, --ar 16:9',
    text_prompt: '呈現紙張層疊陰影。', checklist: '剪影層次✓'
  },

  // --- 🚀 D 類：特殊風格 (權重優化版) ---
  {
    id: 'D1', 
    cat: 'D', 
    name: '3D 皮克斯', 
    en: '3D Pixar', 
    scene: '冒險故事、生動角色描寫、高動態場景',
    color: '明亮高飽和、溫暖電影光影', 
    font: '圓潤活潑', 
    metaphor: '角色動畫、皮克斯電影大片',
    image_prompt: 'High-end 3D render, Pixar movie style, (CGI masterpiece:1.2), ultra-detailed textures, (soft cinematic rim lighting:1.3), vivid colors, volumetric lighting, Octane render, 8k resolution, (charming character design:1.2), --ar 16:9',
    text_prompt: 'Art Style: Pixar Animation. Focus on character-driven narratives and emotional depth. High-quality surface textures and cinematic character lighting.',
    checklist: '次表面散射質感✓ 電影級三點照明✓ 生動表情特徵✓'
  }
];