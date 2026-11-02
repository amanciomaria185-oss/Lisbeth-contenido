export class SpeechService {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  static getSpanishVoices(): SpeechSynthesisVoice[] {
    const all = this.getVoices();
    return all.filter((v) => v.lang.startsWith('es') || v.lang.startsWith('ES'));
  }

  static speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      voiceName?: string;
      onEnd?: () => void;
      onError?: () => void;
    }
  ): void {
    if (!this.synth) return;
    this.stop();

    // Clean text from bracketed tags like [Pausa 1s] for audio output, but replace with slight punctuation
    const cleanText = text
      .replace(/\[Pausa.*?\]/gi, '...')
      .replace(/\[Énfasis:.*?\]/gi, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;

    const voices = this.getVoices();
    if (options?.voiceName) {
      const match = voices.find((v) => v.name === options.voiceName);
      if (match) utterance.voice = match;
    } else {
      const esVoice = voices.find((v) => v.lang.startsWith('es'));
      if (esVoice) utterance.voice = esVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      options?.onError?.();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  static stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  static isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }
}
