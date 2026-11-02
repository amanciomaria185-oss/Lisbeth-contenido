import { ContentProject, UserProfile, GenerationHistoryItem, TrendReference } from '../types';

const USERS_KEY = 'viral_ai_users';
const CURRENT_USER_KEY = 'viral_ai_current_user_id';
const PROJECTS_KEY = 'viral_ai_projects';
const TRENDS_KEY = 'viral_ai_saved_trends';
const HISTORY_KEY = 'viral_ai_history';

// Default Demo User
const DEFAULT_USER: UserProfile = {
  id: 'user_amancio_01',
  email: 'amanciomaria185@gmail.com',
  fullName: 'María Amancio',
  brandName: 'Impacto Digital & Salud',
  niche: 'Alimentación Saludable y Bienestar',
  targetAudience: 'Personas de 25-45 años ocupadas que buscan perder peso y comer sano sin dietas restrictivas ni pasar hambre.',
  defaultTone: 'Empático, Firme y Revelador',
  defaultCta: 'Descarga el ebook en el enlace de mi perfil con 50% de descuento',
  socialHandles: {
    tiktok: '@salud.viral',
    instagram: '@maria.recetasfit',
    youtube: '@ImpactoDigitalSalud',
  },
  characterVisualPrompt: 'Mujer de 32 años, cabello castaño claro ondulado recogido en coleta baja, ropa deportiva minimalista beige y terracota, cocina moderna luminosa de mármol blanco.',
  createdAt: new Date().toISOString(),
};

// Initial Seed Projects
const SEED_PROJECTS: ContentProject[] = [
  {
    id: 'proj-healthy-ebook-01',
    userId: 'user_amancio_01',
    title: 'El Mito del Desayuno Saludable: Lo que la Industria te Oculta',
    productName: 'Ebook "Recetas Rápidas Antiinflamatorias en 15 Minutos"',
    productDescription: 'Guía práctica digital con 60 desayunos y cenas antiinflamatorias que reducen la hinchazón en 7 días sin cocinar horas.',
    platform: 'TikTok',
    objective: 'Ventas y Confianza',
    status: 'listo',
    category: 'Educación',
    format: 'Talking Head con B-Roll Dinámico y Texto Cinematográfico',
    hook: 'Si sigues desayunando avena con leche creyendo que es saludable, necesitas ver esto antes de mañana.',
    hookAlternatives: [
      'El 90% de los desayunos "fit" en realidad están inflamando tu abdomen a las 11 AM.',
      'Deja de comprar galletas de avena del supermercado hasta que conozcas este ingrediente invisible.'
    ],
    totalEstimatedDurationSeconds: 42,
    callToAction: 'Toca el enlace de mi perfil para descargar las 60 recetas antiinflamatorias listas en 15 minutos.',
    publishingCopy: '¿Te sientes pesado a mitad de mañana aunque "comas sano"? 👇 La mayoría de personas caen en la trampa del falso desayuno fitness. En mi nuevo ebook te revelo 60 combinaciones antiinflamatorias reales que activan tu metabolismo. Enlace directo con precio especial en mi bio 🥑✨',
    hashtags: ['#recetassaludables', '#desayunofit', '#antiinflamatorio', '#nutricionconsciente', '#ebookrecetas'],
    productLink: 'https://pay.hotmart.com/ebook-recetas-saludables',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    isFavorite: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    characterReference: 'Mujer de 32 años, cabello castaño en coleta, sudadera beige, cocina blanca y madera.',
    scenes: [
      {
        sceneNumber: 1,
        durationSeconds: 4,
        spokenText: 'Si sigues desayunando avena con leche creyendo que es saludable, necesitas ver esto antes de mañana.',
        physicalActions: 'Mirada fija a cámara sosteniendo un bowl de desayuno, luego baja el bowl con gesto de advertencia sincera.',
        expressions: 'Expresión seria de revelación amistosa, ceja levemente levantada.',
        location: 'Cocina minimalista iluminada por luz natural suave.',
        wardrobe: 'Sudadera beige neutra moderna sin logos, cabello recogido limpio.',
        lighting: 'Luz principal suave a 45 grados, luz de recorte cálida en el cabello.',
        cameraFraming: 'Primer plano medio (Medium Close-Up) a la altura de los ojos en formato vertical 9:16.',
        musicAndAudio: 'Subgrave de tensión suave con un sutil "whoosh" al mover el bowl.',
        transitions: 'Corte directo rápido con zoom in sutil.',
        onScreenText: '🚨 CUIDADO CON TU DESAYUNO "FIT"',
        imagePrompt: 'Photorealistic vertical 9:16 shot of a confident 32yo woman in neutral beige minimalist hoodie holding a ceramic breakfast bowl in a bright modern Scandinavian kitchen, warm morning softbox lighting, 85mm lens f/1.8 shallow depth of field.',
        videoPrompt: 'Woman holding a modern ceramic bowl looks seriously directly into the camera lens with a candid expression, subtle slow push-in camera movement, natural daylight highlights in eyes.',
        narration: {
          voiceType: 'Voz femenina cálida pero con autoridad científica',
          emotion: 'Reveladora y cercana',
          speed: 'Dinámica y pausada en las palabras clave',
          pauses: '[Pausa 0.5s] después de "avena con leche"',
          emphasis: ['creyendo que es saludable', 'antes de mañana'],
        },
      },
      {
        sceneNumber: 2,
        durationSeconds: 9,
        spokenText: 'La mayoría mezcla carbohidratos simples con azúcares ocultos y provocan un pico de glucosa que a las dos horas te deja sin energía y con ansiedad incontrolable.',
        physicalActions: 'Señala un gráfico simple en pantalla y muestra una comparación visual de digestión lenta vs pico de azúcar.',
        expressions: 'Gesticulación con manos abiertas explicando con claridad y convicción.',
        location: 'La misma cocina con barra de mármol.',
        wardrobe: 'La misma ropa beige para continuidad visual.',
        lighting: 'Luz de relleno neutra para eliminar sombras duras.',
        cameraFraming: 'Plano medio con espacio a la derecha para elementos gráficos interactivos.',
        musicAndAudio: 'Sonido "pop" cuando aparece la animación del pico de glucosa.',
        transitions: 'Transición rápida por barrido whip-pan.',
        onScreenText: '📉 PICO DE GLUCOSA = FATIGA Y ANSIEDAD',
        imagePrompt: '9:16 medium shot, woman pointing casually to a translucent graphic overlay, clean kitchen backdrop, high quality cinematic framing.',
        videoPrompt: 'Presenter speaks fluently while gently gesturing with right hand to emphasize points, handheld camera slight organic stabilization motion.',
        narration: {
          voiceType: 'Explicación fluida y pedagógica',
          emotion: 'Preocupación constructiva',
          speed: 'Media',
          pauses: '[Pausa 1s] antes de "ansiedad incontrolable"',
          emphasis: ['pico de glucosa', 'sin energía'],
        },
      },
      {
        sceneNumber: 3,
        durationSeconds: 15,
        spokenText: 'La solución no es morirte de hambre ni tomar batidos raros. Es cambiar el orden y combinar grasas buenas con proteínas antiinflamatorias. Como estos pancakes de tres ingredientes que tardas 6 minutos en hacer.',
        physicalActions: 'Muestra un plato recién hecho, esponjoso, con frutos rojos frescos, partiendo un trozo con tenedor.',
        expressions: 'Sonrisa entusiasta de satisfacción y apetito real.',
        location: 'Detalle de la mesa de madera con plato apetitoso.',
        wardrobe: 'La misma sudadera beige, mangas arremangadas.',
        lighting: 'Luz cenital lateral que resalta la textura dorada de los pancakes.',
        cameraFraming: 'Plano detalle (Close-Up) al plato y luego cambia al rostro satisfecho.',
        musicAndAudio: 'Música lofi chill alegre y motivadora que sube sutilmente de volumen.',
        transitions: 'Match cut suave del tenedor al rostro.',
        onScreenText: '🥞 6 MINUTOS • 3 INGREDIENTES • CERO HINCHAZÓN',
        imagePrompt: 'Macro shot 9:16 of delicious fluffy keto anti-inflammatory pancakes with fresh blueberries on rustic ceramic plate, appetizing steam rising, shallow focus.',
        videoPrompt: 'Macro camera tilts down from presenter face to hot steaming fluffy pancakes, fork gently cuts a piece showing soft texture, cinematic color grading.',
        narration: {
          voiceType: 'Tono enérgico y optimista',
          emotion: 'Alivio y practicidad',
          speed: 'Rápida y fluida',
          pauses: '[Pausa 0.8s] antes de "6 minutos"',
          emphasis: ['no es morirte de hambre', '6 minutos'],
        },
      },
      {
        sceneNumber: 4,
        durationSeconds: 14,
        spokenText: 'Compilé 60 combinaciones exactas como esta en mi nuevo Ebook Antiinflamatorio para que nunca más dudes qué desayunar o cenar. Toca el enlace de mi perfil y descárgalo hoy con precio de lanzamiento.',
        physicalActions: 'Sostiene una tablet mostrando la portada elegante del ebook digital, luego apunta con el dedo índice arriba hacia la biografía.',
        expressions: 'Confianza total y llamada directa sin titubeos.',
        location: 'Cocina en plano medio.',
        wardrobe: 'Mismo vestuario beige.',
        lighting: 'Iluminación cálida y acogedora.',
        cameraFraming: 'Plano medio americano vertical 9:16 con gráfica del ebook a un lado.',
        musicAndAudio: 'Efecto de brillo "chime" al mostrar la tablet, música llega a su remate.',
        transitions: 'Corte limpio.',
        onScreenText: '📖 ENLACE EN BIO • 60 RECETAS LISTAS',
        imagePrompt: '9:16 vertical shot of cheerful woman holding an elegant minimalist digital tablet displaying a recipe ebook cover, pointing upwards smiling, clean studio kitchen background.',
        videoPrompt: 'Presenter holds up tablet showing ebook cover with a warm encouraging smile, points toward the top of the screen to indicate bio link, smooth finish.',
        narration: {
          voiceType: 'Voz clara de invitación y llamada a la acción',
          emotion: 'Inspiradora y resolutiva',
          speed: 'Firme y cadenciosa',
          pauses: '[Pausa 1s] antes de "Toca el enlace de mi perfil"',
          emphasis: ['60 combinaciones', 'precio de lanzamiento'],
        },
      },
    ],
  },
  {
    id: 'proj-affiliate-tools-02',
    userId: 'user_amancio_01',
    title: '3 Herramientas de IA para Crear Contenido que las Agencias Ocultan',
    productName: 'Suscripción Viral Content AI Pro',
    productDescription: 'Plataforma con modelos de IA para investigar videos virales y armar fichas de producción.',
    platform: 'Instagram Reels',
    objective: 'Autoridad y Tráfico',
    status: 'en_produccion',
    category: 'Marketing',
    format: 'Pantalla dividida con captura de pantalla y cámara frontal',
    hook: 'Si pagas más de $500 al mes a una agencia de contenido por guiones genéricos, estás perdiendo dinero.',
    hookAlternatives: [
      'Esta sola plataforma reemplazó a 3 personas en mi equipo de marketing.',
      'El truco que usan los creadores de 1M de seguidores para no quedarse nunca sin ideas.'
    ],
    totalEstimatedDurationSeconds: 45,
    callToAction: 'Comenta "VIRAL" y te envío el acceso directo por mensaje privado.',
    publishingCopy: 'No necesitas contratar una agencia costosa para sonar profesional. La clave está en estructurar ganchos que detengan el scroll. Comenta VIRAL abajo y te envío la herramienta secreta 👇🚀',
    hashtags: ['#marketingdigital', '#creaciondecontenido', '#iaherramientas', '#emprendimiento'],
    scheduledDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    scenes: [
      {
        sceneNumber: 1,
        durationSeconds: 5,
        spokenText: 'Si pagas más de $500 al mes a una agencia de contenido por guiones genéricos, estás perdiendo dinero.',
        physicalActions: 'Gesto de incredulidad mirando la pantalla de la laptop y luego volteando hacia la cámara frontal.',
        expressions: 'Gesto de complicidad con la audiencia.',
        location: 'Escritorio de oficina moderna con setup minimalista.',
        wardrobe: 'Camisa oscura casual relajada.',
        lighting: 'Luz ambiental suave con luz azulada de fondo en el escritorio.',
        cameraFraming: 'Plano medio cerrado.',
        musicAndAudio: 'Efecto de dinero cayendo o caja registradora.',
        transitions: 'Corte abrupto.',
        onScreenText: '💸 ¿SIGUES PAGANDO $500 AL MES POR GUIONES?',
        imagePrompt: '9:16 portrait of creator sitting at clean dark wood desk with MacBook Pro, moody cinematic rim lighting, 50mm lens.',
        videoPrompt: 'Creator turns from laptop to look right into camera lens with a candid smirk, quick zoom in to emphasize hook.',
        narration: {
          voiceType: 'Voz masculina o femenina ejecutiva y directa',
          emotion: 'Desafiante y reveladora',
          speed: 'Rápida',
          pauses: '[Pausa 0.5s] tras $500',
          emphasis: ['perdiendo dinero'],
        },
      },
    ],
  },
];

// Helper to get from local storage safely
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error storing key ${key}:`, e);
  }
}

export const StorageService = {
  // USERS
  getCurrentUser(): UserProfile {
    const users = this.getUsers();
    const currentId = localStorage.getItem(CURRENT_USER_KEY);
    if (currentId) {
      const found = users.find((u) => u.id === currentId);
      if (found) return found;
    }
    // Default to first user
    if (users.length === 0) {
      this.saveUser(DEFAULT_USER);
      localStorage.setItem(CURRENT_USER_KEY, DEFAULT_USER.id);
      return DEFAULT_USER;
    }
    localStorage.setItem(CURRENT_USER_KEY, users[0].id);
    return users[0];
  },

  getUsers(): UserProfile[] {
    const users = getStored<UserProfile[]>(USERS_KEY, []);
    if (users.length === 0) {
      users.push(DEFAULT_USER);
      setStored(USERS_KEY, users);
    }
    return users;
  },

  saveUser(user: UserProfile): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    setStored(USERS_KEY, users);
    localStorage.setItem(CURRENT_USER_KEY, user.id);
  },

  switchUser(userId: string): UserProfile | null {
    const users = this.getUsers();
    const found = users.find((u) => u.id === userId);
    if (found) {
      localStorage.setItem(CURRENT_USER_KEY, found.id);
      return found;
    }
    return null;
  },

  // PROJECTS / FICHAS DE PRODUCCIÓN
  getProjects(userId?: string): ContentProject[] {
    const currentUserId = userId || this.getCurrentUser().id;
    let allProjects = getStored<ContentProject[]>(PROJECTS_KEY, []);
    if (allProjects.length === 0) {
      allProjects = [...SEED_PROJECTS];
      setStored(PROJECTS_KEY, allProjects);
    }
    return allProjects.filter((p) => p.userId === currentUserId);
  },

  getProjectById(id: string): ContentProject | undefined {
    const all = getStored<ContentProject[]>(PROJECTS_KEY, []);
    return all.find((p) => p.id === id);
  },

  saveProject(project: ContentProject): void {
    const all = getStored<ContentProject[]>(PROJECTS_KEY, []);
    const idx = all.findIndex((p) => p.id === project.id);
    project.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      all[idx] = project;
    } else {
      project.createdAt = project.createdAt || new Date().toISOString();
      all.unshift(project);
    }
    setStored(PROJECTS_KEY, all);
  },

  deleteProject(id: string): void {
    const all = getStored<ContentProject[]>(PROJECTS_KEY, []);
    const filtered = all.filter((p) => p.id !== id);
    setStored(PROJECTS_KEY, filtered);
  },

  duplicateProject(id: string): ContentProject | null {
    const original = this.getProjectById(id);
    if (!original) return null;
    const duplicated: ContentProject = {
      ...original,
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      title: `${original.title} (Copia)`,
      status: 'idea',
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.saveProject(duplicated);
    return duplicated;
  },

  toggleFavorite(id: string): boolean {
    const project = this.getProjectById(id);
    if (!project) return false;
    project.isFavorite = !project.isFavorite;
    this.saveProject(project);
    return project.isFavorite;
  },

  // TRENDS
  getSavedTrends(): TrendReference[] {
    return getStored<TrendReference[]>(TRENDS_KEY, []);
  },

  saveTrend(trend: TrendReference): void {
    const all = this.getSavedTrends();
    if (!all.some((t) => t.id === trend.id)) {
      all.unshift(trend);
      setStored(TRENDS_KEY, all);
    }
  },

  removeTrend(id: string): void {
    const all = this.getSavedTrends().filter((t) => t.id !== id);
    setStored(TRENDS_KEY, all);
  },

  // HISTORY
  getHistory(userId?: string): GenerationHistoryItem[] {
    const currentUserId = userId || this.getCurrentUser().id;
    const history = getStored<GenerationHistoryItem[]>(HISTORY_KEY, []);
    return history.filter((h) => h.userId === currentUserId);
  },

  addHistory(item: Omit<GenerationHistoryItem, 'id' | 'timestamp'>): void {
    const history = getStored<GenerationHistoryItem[]>(HISTORY_KEY, []);
    const newItem: GenerationHistoryItem = {
      ...item,
      id: 'hist_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    history.unshift(newItem);
    setStored(HISTORY_KEY, history.slice(0, 100)); // limit to last 100 items
  },

  // EXPORT UTILITIES
  exportProjectMarkdown(project: ContentProject): string {
    return `# FICHA DE PRODUCCIÓN VIRAL CONTENT AI
**Título:** ${project.title}
**Producto/Ebook:** ${project.productName}
**Plataforma:** ${project.platform} | **Estado:** ${project.status.toUpperCase()}
**Categoría:** ${project.category} | **Duración Estimada:** ${project.totalEstimatedDurationSeconds}s
**Fecha de Publicación:** ${project.scheduledDate || 'Por programar'}

---

## ESTRATEGIA Y GANCHO (0-3s)
**Gancho Principal:**
> "${project.hook}"

${project.hookAlternatives && project.hookAlternatives.length > 0 ? `**Alternativas de Gancho A/B:**\n${project.hookAlternatives.map((h, i) => `- Opción ${i + 1}: ${h}`).join('\n')}\n` : ''}

**Objetivo:** ${project.objective}
**Formato de Grabación:** ${project.format}
**Llamado a la Acción (CTA):** ${project.callToAction}

---

## DESGLOSE ESCENA POR ESCENA

${project.scenes
  .map(
    (s) => `### ESCENA ${s.sceneNumber} (${s.durationSeconds}s)
- **Texto que dice:** "${s.spokenText}"
- **Acciones físicas:** ${s.physicalActions}
- **Expresión facial:** ${s.expressions}
- **Locación:** ${s.location}
- **Vestuario:** ${s.wardrobe}
- **Iluminación:** ${s.lighting}
- **Cámara y Encuadre:** ${s.cameraFraming}
- **Música y SFX:** ${s.musicAndAudio}
- **Texto en Pantalla:** ${s.onScreenText}
- **Transición:** ${s.transitions}

#### Prompt para Imagen (Midjourney / FLUX):
\`\`\`
${s.imagePrompt}
\`\`\`

#### Prompt para Video IA (Sora / Runway / Kling):
\`\`\`
${s.videoPrompt}
\`\`\`

#### Dirección de Voz:
- Tipo de voz: ${s.narration.voiceType}
- Emoción: ${s.narration.emotion} | Velocidad: ${s.narration.speed}
- Pausas: ${s.narration.pauses}
- Énfasis: ${s.narration.emphasis.join(', ')}
`
  )
  .join('\n---\n\n')}

---

## COPYWRITING DE PUBLICACIÓN
\`\`\`
${project.publishingCopy}

${project.hashtags.join(' ')}
\`\`\`
`;
  },
};
