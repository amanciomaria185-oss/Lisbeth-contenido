import { TrendReference, ViralVideo, ViralVideoSearchResponse } from '../types';

export interface InvestigateTrendsResponse {
  summary: string;
  trends: TrendReference[];
  keyTakeaways: string[];
  groundingSources?: { title: string; url: string }[];
}

export interface AnalyzeLinkResponse {
  originalAnalysis: {
    title?: string;
    detectedFormat?: string;
    hookBreakdown?: string;
    narrativeRhythm?: string;
    productPlacementTactics?: string;
    visualAudioMechanics?: string;
    ctaAnalysis?: string;
  };
  adaptationStrategy: {
    coreInsight?: string;
    adaptedConceptTitle?: string;
    newHookOptionA?: string;
    newHookOptionB?: string;
    sceneBreakdownSummary?: string;
    differentiators?: string;
  };
}

export interface StrategyResponse {
  apiKeyNotice?: string;
  productDiagnostic: {
    coreValueProposition: string;
    primaryPainPoint: string;
    mainObjectionToCrush: string;
    targetAudienceInsights: string;
  };
  antiRepetitionNotice: string;
  angles: {
    id: string;
    name: string;
    type: string;
    hookPrimary: string;
    hookAlternative: string;
    brief: string;
    whyItWorks: string;
  }[];
  recommendedAngleId: string;
  masterScript: any;
}

export const ApiService = {
  async investigateTrends(params: {
    topic: string;
    niche?: string;
    platform?: string;
    productContext?: string;
  }): Promise<InvestigateTrendsResponse> {
    const res = await fetch('/api/investigate-trends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}: Falló la investigación de tendencias`);
    }
    return res.json();
  },

  async analyzeLink(params: {
    url?: string;
    videoDescription?: string;
    targetProduct?: string;
  }): Promise<AnalyzeLinkResponse> {
    const res = await fetch('/api/analyze-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}: Falló el análisis del video`);
    }
    return res.json();
  },

  async generateStrategy(payload: any): Promise<StrategyResponse> {
    const res = await fetch('/api/generate-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}: Falló la generación de estrategia`);
    }
    return res.json();
  },

  async generateScript(payload: any): Promise<any> {
    const res = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}: Falló la generación del guion`);
    }
    return res.json();
  },

  async adaptTrend(payload: any): Promise<any> {
    const res = await fetch('/api/adapt-trend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}: Falló la adaptación de la tendencia`);
    }
    return res.json();
  },

  async generateCalendar(payload: any): Promise<any> {
    const res = await fetch('/api/generate-calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}: Falló la generación del calendario`);
    }
    return res.json();
  },

  async searchViralVideos(params: {
    topic: string;
    platform?: string;
    userProduct?: string;
    niche?: string;
  }): Promise<ViralVideoSearchResponse> {
    const res = await fetch('/api/search-viral-videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}: Falló la búsqueda de videos virales`);
    }
    return res.json();
  },

  async adaptViralStrategy(payload: {
    video: ViralVideo;
    userProduct: string;
    productType?: string;
    productDescription?: string;
    targetAudience?: string;
    objective?: string;
    tone?: string;
    characterReference?: string;
  }): Promise<any> {
    const res = await fetch('/api/adapt-viral-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}: Falló la adaptación de la estrategia viral`);
    }
    return res.json();
  },
};

