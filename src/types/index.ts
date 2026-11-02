export type ContentStatus = 'idea' | 'pendiente' | 'en_produccion' | 'listo' | 'publicado';

export type ContentCategory =
  | 'Educación'
  | 'Entretenimiento'
  | 'Marketing'
  | 'Inspiración'
  | 'Consejos'
  | 'Tutoriales'
  | 'Promoción'
  | 'Ventas'
  | 'Marca personal'
  | 'Tendencias'
  | 'Historias y experiencias';

export type Platform =
  | 'TikTok'
  | 'Instagram Reels'
  | 'YouTube Shorts'
  | 'Facebook Reels'
  | 'Multiplataforma';

export interface SceneNarration {
  voiceType: string;
  emotion: string;
  speed: string;
  pauses: string;
  emphasis: string[];
}

export interface Scene {
  sceneNumber: number;
  durationSeconds: number;
  spokenText: string;
  physicalActions: string;
  expressions: string;
  location: string;
  wardrobe: string;
  lighting: string;
  cameraFraming: string;
  musicAndAudio: string;
  transitions: string;
  onScreenText: string;
  imagePrompt: string;
  videoPrompt: string;
  narration: SceneNarration;
}

export interface ContentProject {
  id: string;
  userId: string;
  title: string;
  productName: string;
  productDescription?: string;
  platform: Platform;
  objective: string;
  status: ContentStatus;
  category: ContentCategory;
  format: string;
  hook: string;
  hookAlternatives?: string[];
  totalEstimatedDurationSeconds: number;
  scenes: Scene[];
  callToAction: string;
  publishingCopy: string;
  hashtags: string[];
  productLink?: string;
  scheduledDate?: string; // YYYY-MM-DD or ISO
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  characterReference?: string;
  notes?: string;
}

export interface TrendMetrics {
  views: string;
  likes: string;
  comments: string;
  shares: string;
  isVerified: boolean;
  note: string;
}

export interface TrendReference {
  id: string;
  title: string;
  platform: string;
  url: string;
  creator: string;
  date: string;
  metrics: TrendMetrics;
  contentType: string;
  hook: string;
  communicationStrategy: string;
  viralFactor: string;
  adaptationStrategy: string;
  groundingSources?: { title: string; url: string }[];
}

export interface StrategyAngle {
  id: string;
  name: string;
  type: string;
  hookPrimary: string;
  hookAlternative: string;
  brief: string;
  whyItWorks: string;
}

export interface ProductDiagnostic {
  coreValueProposition: string;
  primaryPainPoint: string;
  mainObjectionToCrush: string;
  targetAudienceInsights: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  brandName: string;
  niche: string;
  targetAudience: string;
  defaultTone: string;
  defaultCta: string;
  socialHandles?: {
    tiktok?: string;
    instagram?: string;
    youtube?: string;
  };
  characterVisualPrompt?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface GenerationHistoryItem {
  id: string;
  userId: string;
  type: 'strategy' | 'script' | 'trend_adaptation' | 'calendar' | 'link_analysis' | 'viral_search';
  title: string;
  promptOrInput: string;
  timestamp: string;
  resultId?: string;
}

export interface ViralVideoMetric {
  views: string;
  likes: string;
  comments: string;
  shares: string;
  isVerified: boolean;
  note: string;
}

export interface ViralVideoCreator {
  name: string;
  handle: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface ViralVideo {
  id: string;
  title: string;
  platform: 'TikTok' | 'Instagram Reels' | 'Facebook Reels' | 'YouTube Shorts';
  videoUrl: string;
  embedUrl?: string;
  videoId?: string;
  thumbnailUrl?: string;
  creator: ViralVideoCreator;
  publishedDate: string;
  metrics: ViralVideoMetric;
  durationSeconds?: number;
  
  // 6. Análisis del gancho y guion
  hookAnalysis: {
    hookText: string;
    hookType: string;
    hookTechnique: string;
    retentionPotential: string;
  };
  scriptAnalysis: {
    narrativePacing: string;
    structureTimeline: string;
    spokenBreakdown: string;
  };

  // 7. Análisis de la estrategia publicitaria y de venta
  salesStrategyAnalysis: {
    strategyType: string;
    funnelRole: string;
    conversionMechanism: string;
    objectionHandling: string;
  };

  // 8. Cómo presenta y promociona el producto
  productPresentation: {
    revealTiming: string;
    placementStyle: string;
    framingTactics: string;
  };

  // 9. Qué elementos podrían explicar su viralidad
  viralFactors: {
    psychologicalTriggers: string[];
    audioSoundFactor: string;
    visualPacingFactor: string;
    whyItBlewUpSummary: string;
  };

  suggestedAdaptationAngles?: string[];
  tags: string[];
}

export interface ViralVideoSearchResponse {
  query: string;
  platform: string;
  summary: string;
  videos: ViralVideo[];
  groundingSources?: { title: string; url: string }[];
  searchTips?: string[];
}

