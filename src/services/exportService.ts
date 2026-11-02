import { ContentProject, Scene } from '../types';

export class ExportService {
  /**
   * Safely copy text to clipboard with modern API and fallback for mobile iframe contexts
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback textarea:', err);
    }

    // Fallback using temporary textarea
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    }
  }

  /**
   * COPIAR PRODUCCIÓN COMPLETA
   * Comprehensive, beautifully organized production dossier
   */
  static generateFullProductionText(project: ContentProject): string {
    const divider = '=======================================================';
    const subDivider = '-------------------------------------------------------';

    let out = `${divider}\n`;
    out += `FICHA TÉCNICA Y PRODUCCIÓN COMPLETA — VIRAL CONTENT AI\n`;
    out += `${divider}\n\n`;

    out += `1. INFORMACIÓN GENERAL\n`;
    out += `${subDivider}\n`;
    out += `• Título del Contenido: ${project.title}\n`;
    out += `• Producto / Servicio: ${project.productName}\n`;
    if (project.productDescription) out += `• Descripción de Oferta: ${project.productDescription}\n`;
    out += `• Plataforma Destino: ${project.platform}\n`;
    out += `• Categoría: ${project.category}\n`;
    out += `• Objetivo Estratégico: ${project.objective}\n`;
    out += `• Formato de Grabación: ${project.format}\n`;
    out += `• Duración Estimada: ~${project.totalEstimatedDurationSeconds} segundos (${project.scenes?.length || 0} escenas)\n`;
    out += `• Estado Actual: ${project.status.toUpperCase()}\n`;
    if (project.scheduledDate) out += `• Fecha Programada: ${project.scheduledDate}\n`;
    if (project.productLink) out += `• Enlace de Destino: ${project.productLink}\n`;
    if (project.characterReference) out += `• Referencia Visual de Personaje: ${project.characterReference}\n`;
    out += `\n`;

    out += `2. ESTRATEGIA DE RETENCIÓN Y GANCHOS (0 a 3 SEGUNDOS)\n`;
    out += `${subDivider}\n`;
    out += `[GANCHO PRINCIPAL]:\n"${project.hook}"\n\n`;

    if (project.hookAlternatives && project.hookAlternatives.length > 0) {
      out += `[ALTERNATIVAS DE GANCHO A/B]:\n`;
      project.hookAlternatives.forEach((alt, idx) => {
        out += `  • Opción ${idx + 1}: "${alt}"\n`;
      });
      out += `\n`;
    }

    out += `3. DESGLOSE TÉCNICO ESCENA POR ESCENA\n`;
    out += `${subDivider}\n\n`;

    project.scenes?.forEach((scene: Scene) => {
      out += `▶ ESCENA ${scene.sceneNumber} (${scene.durationSeconds}s)\n`;
      out += `───────────────────────────────────────────────────────\n`;
      out += `[DIÁLOGO / TEXTO EXACTO QUE DICE]:\n"${scene.spokenText}"\n\n`;
      out += `[ACCIÓN FÍSICA Y MOVIMIENTO]: ${scene.physicalActions}\n`;
      out += `[EXPRESIÓN FACIAL]: ${scene.expressions}\n`;
      out += `[TEXTO EN PANTALLA]: ${scene.onScreenText || 'Sin texto'}\n`;
      out += `[TRANSICIÓN]: ${scene.transitions || 'Corte directo'}\n`;
      out += `[CÁMARA Y ENCUADRE]: ${scene.cameraFraming}\n`;
      out += `[ILUMINACIÓN]: ${scene.lighting}\n`;
      out += `[LOCACIÓN]: ${scene.location}\n`;
      out += `[VESTUARIO]: ${scene.wardrobe}\n`;
      out += `[MÚSICA Y EFECTOS SFX]: ${scene.musicAndAudio}\n\n`;

      out += `[PROMPT IMAGEN IA (Midjourney / FLUX)]:\n${scene.imagePrompt}\n\n`;
      out += `[PROMPT VIDEO IA (Sora / Runway / Kling)]:\n${scene.videoPrompt}\n\n`;

      if (scene.narration) {
        out += `[DIRECCIÓN DE VOZ Y LOCUCIÓN]:\n`;
        out += `  • Tipo de voz: ${scene.narration.voiceType}\n`;
        out += `  • Emoción: ${scene.narration.emotion} | Velocidad: ${scene.narration.speed}\n`;
        out += `  • Pausas marcadas: ${scene.narration.pauses}\n`;
        if (scene.narration.emphasis && scene.narration.emphasis.length > 0) {
          out += `  • Énfasis en: ${scene.narration.emphasis.join(', ')}\n`;
        }
        out += `\n`;
      }
      out += `\n`;
    });

    out += `4. DATOS DE PUBLICACIÓN Y COPYWRITING\n`;
    out += `${subDivider}\n`;
    out += `[LLAMADO A LA ACCIÓN (CTA)]:\n${project.callToAction}\n\n`;
    out += `[DESCRIPCIÓN / CAPTION LISTA PARA PUBLICAR]:\n${project.publishingCopy}\n\n`;
    out += `[HASHTAGS RECOMENDADOS]:\n${project.hashtags?.join(' ') || ''}\n\n`;
    out += `${divider}\n`;
    out += `Generado por VIRAL CONTENT AI • Plataforma Inteligente de Creación y Marketing\n`;

    return out;
  }

  /**
   * Copiar únicamente los guiones y escenas completas
   */
  static generateScriptText(project: ContentProject): string {
    let out = `GUION TÉCNICO: ${project.title}\n`;
    out += `Formato: ${project.format} | Duración: ~${project.totalEstimatedDurationSeconds}s\n`;
    out += `Gancho Inicial: "${project.hook}"\n\n`;

    project.scenes?.forEach((s) => {
      out += `--- ESCENA ${s.sceneNumber} (${s.durationSeconds}s) ---\n`;
      out += `DIÁLOGO: "${s.spokenText}"\n`;
      out += `ACCIÓN: ${s.physicalActions}\n`;
      out += `CÁMARA: ${s.cameraFraming}\n`;
      out += `TEXTO EN PANTALLA: ${s.onScreenText || 'Sin texto'}\n\n`;
    });

    out += `CTA: ${project.callToAction}\n`;
    return out;
  }

  /**
   * Copiar diálogos y narraciones (texto fluido listo para teleprompter o clonador de voz)
   */
  static generateDialoguesText(project: ContentProject): string {
    let out = `DIÁLOGOS Y LOCUCIÓN — ${project.title}\n\n`;
    out += `[0-3s] GANCHO:\n"${project.hook}"\n\n`;

    project.scenes?.forEach((s) => {
      out += `[ESCENA ${s.sceneNumber} - ${s.durationSeconds}s]:\n"${s.spokenText}"\n`;
      if (s.narration?.pauses) out += `(Pausas: ${s.narration.pauses})\n`;
      out += `\n`;
    });

    out += `[CIERRE / CTA]:\n"${project.callToAction}"\n`;
    return out;
  }

  /**
   * Copiar todos los prompts de imágenes (Midjourney / FLUX)
   */
  static generateImagePromptsText(project: ContentProject): string {
    let out = `PROMPTS DE IMAGEN (MIDJOURNEY / FLUX / DALL-E) — ${project.title}\n`;
    out += `Relación de aspecto: 9:16 Vertical\n\n`;

    project.scenes?.forEach((s) => {
      out += `// ESCENA ${s.sceneNumber} (${s.durationSeconds}s) - ${s.cameraFraming}\n`;
      out += `${s.imagePrompt}\n\n`;
    });

    return out;
  }

  /**
   * Copiar todos los prompts de video (Sora / Runway / Kling / Luma)
   */
  static generateVideoPromptsText(project: ContentProject): string {
    let out = `PROMPTS DE VIDEO (SORA / RUNWAY GEN-3 / KLING / LUMA) — ${project.title}\n`;
    out += `Formato: 9:16 Cinematográfico\n\n`;

    project.scenes?.forEach((s) => {
      out += `// ESCENA ${s.sceneNumber} (${s.durationSeconds}s) - Acción: ${s.physicalActions}\n`;
      out += `${s.videoPrompt}\n\n`;
    });

    return out;
  }

  /**
   * Copiar vestuario, ubicación, iluminación y ambientación (Dirección de Arte)
   */
  static generateArtDirectionText(project: ContentProject): string {
    let out = `DIRECCIÓN DE ARTE, VESTUARIO Y AMBIENTACIÓN — ${project.title}\n\n`;
    if (project.characterReference) {
      out += `• IDENTIDAD VISUAL DE PERSONAJE:\n${project.characterReference}\n\n`;
    }

    project.scenes?.forEach((s) => {
      out += `ESCENA ${s.sceneNumber}:\n`;
      out += `  • Vestuario: ${s.wardrobe}\n`;
      out += `  • Locación: ${s.location}\n`;
      out += `  • Iluminación: ${s.lighting}\n`;
      out += `  • Cámara y Ángulo: ${s.cameraFraming}\n`;
      out += `  • Música / Efectos Sonoros: ${s.musicAndAudio}\n\n`;
    });

    return out;
  }

  /**
   * Copiar descripción, hashtags y CTA
   */
  static generatePublishingText(project: ContentProject): string {
    let out = `COPY DE PUBLICACIÓN Y HASHTAGS — ${project.title}\n\n`;
    out += `${project.publishingCopy}\n\n`;
    out += `CTA: ${project.callToAction}\n`;
    if (project.productLink) out += `Enlace: ${project.productLink}\n`;
    out += `\nHashtags:\n${project.hashtags?.join(' ') || ''}\n`;
    return out;
  }

  /**
   * DESCARGAR EN FORMATO TXT
   */
  static downloadTxt(project: ContentProject): void {
    const text = this.generateFullProductionText(project);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const filename = `Ficha_Produccion_${project.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)}.txt`;
    this.triggerDownload(blob, filename);
  }

  /**
   * DESCARGAR EN FORMATO DOCX (Word Document XML compatible)
   * Formatted HTML document that Microsoft Word, Google Docs, LibreOffice and Pages open seamlessly.
   */
  static downloadDocx(project: ContentProject): void {
    const title = project.title || 'Ficha de Producción';
    const docHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
  h1 { color: #6d28d9; font-size: 24pt; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px; margin-bottom: 15px; }
  h2 { color: #4338ca; font-size: 16pt; margin-top: 25px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
  h3 { color: #0f172a; font-size: 13pt; margin-top: 15px; }
  .badge { display: inline-block; padding: 4px 10px; background: #ede9fe; color: #6d28d9; border-radius: 4px; font-weight: bold; font-size: 10pt; }
  .box { background: #f8fafc; border-left: 4px solid #8b5cf6; padding: 12px 16px; margin: 12px 0; border-radius: 0 8px 8px 0; }
  .prompt-box { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 10px 14px; font-family: 'Courier New', monospace; font-size: 9.5pt; color: #334155; margin: 8px 0; border-radius: 6px; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 10pt; }
  th { background-color: #f1f5f9; color: #475569; font-weight: bold; }
  .footer { margin-top: 40px; font-size: 9pt; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
</style>
</head>
<body>
  <h1>FICHA DE PRODUCCIÓN VIRAL CONTENT AI</h1>
  <p><span class="badge">${project.platform}</span> &nbsp; <span class="badge">${project.category}</span> &nbsp; <span class="badge">~${project.totalEstimatedDurationSeconds}s</span></p>

  <h2>1. INFORMACIÓN GENERAL</h2>
  <table>
    <tr><th width="30%">Título</th><td>${project.title}</td></tr>
    <tr><th>Producto / Ebook</th><td>${project.productName}</td></tr>
    ${project.productDescription ? `<tr><th>Descripción</th><td>${project.productDescription}</td></tr>` : ''}
    <tr><th>Objetivo</th><td>${project.objective}</td></tr>
    <tr><th>Formato</th><td>${project.format}</td></tr>
    <tr><th>Estado</th><td>${project.status.toUpperCase()}</td></tr>
    ${project.scheduledDate ? `<tr><th>Fecha de Publicación</th><td>${project.scheduledDate}</td></tr>` : ''}
    ${project.productLink ? `<tr><th>Enlace de Venta</th><td><a href="${project.productLink}">${project.productLink}</a></td></tr>` : ''}
    ${project.characterReference ? `<tr><th>Referencia Visual</th><td>${project.characterReference}</td></tr>` : ''}
  </table>

  <h2>2. ESTRATEGIA Y GANCHOS (0 a 3 SEGUNDOS)</h2>
  <div class="box">
    <strong>GANCHO PRINCIPAL:</strong><br>
    <em>"${project.hook}"</em>
  </div>

  ${
    project.hookAlternatives && project.hookAlternatives.length > 0
      ? `<h3>Alternativas de Gancho A/B:</h3>
         <ul>
           ${project.hookAlternatives.map((alt) => `<li>${alt}</li>`).join('')}
         </ul>`
      : ''
  }

  <h2>3. DESGLOSE ESCENA POR ESCENA</h2>
  ${project.scenes
    ?.map(
      (s) => `
    <div style="margin-bottom: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
      <h3>ESCENA ${s.sceneNumber} (${s.durationSeconds}s)</h3>
      <div class="box">
        <strong>Texto que dice:</strong><br>
        "${s.spokenText}"
      </div>
      <p><strong>Acciones y gestos:</strong> ${s.physicalActions} (${s.expressions})</p>
      <p><strong>Cámara y encuadre:</strong> ${s.cameraFraming} &bull; <strong>Iluminación:</strong> ${s.lighting} &bull; <strong>Locación:</strong> ${s.location}</p>
      <p><strong>Vestuario:</strong> ${s.wardrobe} &bull; <strong>Música/SFX:</strong> ${s.musicAndAudio} &bull; <strong>Texto en pantalla:</strong> ${s.onScreenText || 'Ninguno'}</p>
      
      <p><strong>Prompt Imagen (Midjourney / FLUX):</strong></p>
      <div class="prompt-box">${s.imagePrompt}</div>

      <p><strong>Prompt Video (Sora / Runway / Kling):</strong></p>
      <div class="prompt-box">${s.videoPrompt}</div>

      ${
        s.narration
          ? `<p><strong>Dirección de Voz:</strong> ${s.narration.voiceType} &bull; Emoción: ${s.narration.emotion} &bull; Velocidad: ${s.narration.speed} &bull; Pausas: ${s.narration.pauses}</p>`
          : ''
      }
    </div>
  `
    )
    .join('')}

  <h2>4. COPYWRITING DE PUBLICACIÓN</h2>
  <div class="box">
    <strong>Llamado a la Acción (CTA):</strong><br>
    ${project.callToAction}
  </div>
  <p><strong>Descripción para publicar:</strong></p>
  <div class="prompt-box" style="white-space: pre-line;">${project.publishingCopy}</div>
  <p><strong>Hashtags:</strong> ${project.hashtags?.join(' ') || ''}</p>

  <div class="footer">
    Generado por VIRAL CONTENT AI &bull; Plataforma Inteligente de Creación y Marketing
  </div>
</body>
</html>`;

    const blob = new Blob(['\ufeff' + docHtml], {
      type: 'application/msword;charset=utf-8',
    });
    const filename = `Ficha_Produccion_${project.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)}.doc`;
    this.triggerDownload(blob, filename);
  }

  /**
   * DESCARGAR EN FORMATO PDF
   * Generates a printer-ready window with custom styles that prompts the user's browser print dialog to save as PDF
   */
  static downloadPdf(project: ContentProject): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback if popup blocked: offer download TXT and alert
      alert('Por favor permite ventanas emergentes para generar el documento PDF imprimible.');
      this.downloadTxt(project);
      return;
    }

    const title = project.title || 'Ficha de Producción';
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${title} — Ficha de Producción</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; font-size: 11pt; padding: 20px; }
    h1 { color: #6d28d9; font-size: 20pt; border-bottom: 2px solid #8b5cf6; padding-bottom: 6px; margin-bottom: 12px; }
    h2 { color: #4338ca; font-size: 14pt; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
    h3 { color: #1e293b; font-size: 12pt; margin-top: 14px; margin-bottom: 6px; }
    .badge { display: inline-block; padding: 3px 8px; background: #ede9fe; color: #6d28d9; border-radius: 4px; font-weight: 600; font-size: 9pt; }
    .box { background: #f8fafc; border-left: 4px solid #8b5cf6; padding: 10px 14px; margin: 10px 0; border-radius: 0 6px 6px 0; }
    .prompt-box { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 8px 12px; font-family: monospace; font-size: 9pt; color: #334155; margin: 6px 0; border-radius: 6px; page-break-inside: avoid; }
    .scene-card { border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 15px; page-break-inside: avoid; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; font-size: 9.5pt; }
    th { background: #f8fafc; color: #475569; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background: #ede9fe; padding: 12px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
    <span style="font-weight: bold; color: #6d28d9;">Documento listo para Guardar como PDF o Imprimir</span>
    <button onclick="window.print()" style="background: #6d28d9; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
      Imprimir / Guardar como PDF
    </button>
  </div>

  <h1>FICHA TÉCNICA DE PRODUCCIÓN — VIRAL CONTENT AI</h1>
  <p>
    <span class="badge">${project.platform}</span>
    <span class="badge">${project.category}</span>
    <span class="badge">~${project.totalEstimatedDurationSeconds}s</span>
    <span class="badge">${project.status.toUpperCase()}</span>
  </p>

  <h2>1. INFORMACIÓN GENERAL</h2>
  <table>
    <tr><th width="25%">Título</th><td>${project.title}</td></tr>
    <tr><th>Producto / Oferta</th><td>${project.productName}</td></tr>
    <tr><th>Objetivo</th><td>${project.objective}</td></tr>
    <tr><th>Formato</th><td>${project.format}</td></tr>
    ${project.scheduledDate ? `<tr><th>Fecha de Publicación</th><td>${project.scheduledDate}</td></tr>` : ''}
    ${project.productLink ? `<tr><th>Enlace de Venta</th><td>${project.productLink}</td></tr>` : ''}
  </table>

  <h2>2. GANCHO INICIAL (0-3s)</h2>
  <div class="box">
    <strong>"${project.hook}"</strong>
  </div>
  ${
    project.hookAlternatives && project.hookAlternatives.length > 0
      ? `<div><strong>Alternativas A/B:</strong> ${project.hookAlternatives.map((a) => `<br>&bull; ${a}`).join('')}</div>`
      : ''
  }

  <h2>3. GUION Y DIRECCIÓN TÉCNICA ESCENA POR ESCENA</h2>
  ${project.scenes
    ?.map(
      (s) => `
    <div class="scene-card">
      <h3>ESCENA ${s.sceneNumber} (${s.durationSeconds}s) &bull; ${s.cameraFraming}</h3>
      <div class="box">
        <strong>Diálogo / Texto que dice:</strong><br>
        "${s.spokenText}"
      </div>
      <p><strong>Acciones y gestos:</strong> ${s.physicalActions} (${s.expressions})</p>
      <p><strong>Locación:</strong> ${s.location} &bull; <strong>Iluminación:</strong> ${s.lighting} &bull; <strong>Vestuario:</strong> ${s.wardrobe}</p>
      <p><strong>Música y SFX:</strong> ${s.musicAndAudio} &bull; <strong>Texto en pantalla:</strong> ${s.onScreenText || 'Sin texto'}</p>
      
      <p><strong>Prompt Imagen (Midjourney / FLUX):</strong></p>
      <div class="prompt-box">${s.imagePrompt}</div>

      <p><strong>Prompt Video (Sora / Runway):</strong></p>
      <div class="prompt-box">${s.videoPrompt}</div>

      ${
        s.narration
          ? `<p><strong>Dirección de Voz:</strong> ${s.narration.voiceType} (${s.narration.emotion}, ${s.narration.speed}) &bull; Pausas: ${s.narration.pauses}</p>`
          : ''
      }
    </div>
  `
    )
    .join('')}

  <h2>4. PUBLICACIÓN Y COPYWRITING</h2>
  <div class="box">
    <strong>CTA:</strong> ${project.callToAction}
  </div>
  <p><strong>Texto de Publicación:</strong></p>
  <div class="prompt-box" style="white-space: pre-line;">${project.publishingCopy}</div>
  <p><strong>Hashtags:</strong> ${project.hashtags?.join(' ') || ''}</p>

  <script>
    window.onload = function() {
      // Automatically prompt print dialog after page renders
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }

  /**
   * Helper to trigger a file download in the browser
   */
  private static triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}
