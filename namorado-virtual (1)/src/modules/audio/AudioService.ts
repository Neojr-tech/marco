import { IAudioEngine, Persona } from '../../types';

export class AudioService implements IAudioEngine {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  public isListening = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public async speakText(text: string, persona: Persona): Promise<void> {
    if (!this.synth) return;

    this.stopSpeaking();

    // Clean text of markdown and emoji symbols for smooth speech
    const cleanText = text
      .replace(/[*_~`]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';

    // Tailor pitch and rate to persona personality
    if (persona.personalityTraits.includes('tímido') || persona.personalityTraits.includes('romântico')) {
      utterance.pitch = 0.95;
      utterance.rate = 0.92;
    } else if (persona.personalityTraits.includes('ousado') || persona.personalityTraits.includes('dominante')) {
      utterance.pitch = 0.85;
      utterance.rate = 1.0;
    } else if (persona.personalityTraits.includes('brincalhão') || persona.personalityTraits.includes('divertido')) {
      utterance.pitch = 1.05;
      utterance.rate = 1.05;
    } else {
      utterance.pitch = 0.9;
      utterance.rate = 0.98;
    }

    // Select Portuguese male voice if available
    const voices = this.synth.getVoices();
    const ptVoices = voices.filter((v) => v.lang.startsWith('pt'));
    const ptMale = ptVoices.find((v) => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('homem') || v.name.toLowerCase().includes('lucas') || v.name.toLowerCase().includes('felipe') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('ricardo'));
    
    if (ptMale) {
      utterance.voice = ptMale;
    } else if (ptVoices.length > 0) {
      utterance.voice = ptVoices[0];
    }

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public startRecognition(
    onResult: (text: string) => void,
    onError: (err: any) => void
  ): void {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      onError('Reconhecimento de voz não suportado neste navegador.');
      return;
    }

    try {
      this.recognition = new SpeechRec();
      this.recognition.lang = 'pt-BR';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        onResult(transcript);
      };

      this.recognition.onerror = (err: any) => {
        this.isListening = false;
        onError(err);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      onError(e);
    }
  }

  public stopRecognition(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
  }
}
