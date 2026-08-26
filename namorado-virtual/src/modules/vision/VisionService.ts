import { Avatar, IVisionEngine, Persona, UserProfile } from '../../types';

export class VisionService implements IVisionEngine {
  async analyzeImage(
    imageBase64: string,
    caption: string,
    persona: Persona,
    avatar: Avatar,
    user: UserProfile
  ): Promise<{ text: string; emotion: string; detectedFeatures: string[] }> {
    try {
      const res = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          userCaption: caption,
          persona,
          avatar,
          user,
        }),
      });

      if (!res.ok) {
        throw new Error(`Vision endpoint error: ${res.status}`);
      }

      const data = await res.json();
      return {
        text: data.text || 'Nossa, que foto linda! Adorei que você compartilhou isso comigo ❤️',
        emotion: data.emotion || 'apaixonado',
        detectedFeatures: data.detectedFeatures || ['foto do usuário'],
      };
    } catch (err) {
      console.warn('Vision API error, using local reaction:', err);
      return {
        text: `Nossa, ${user?.name || 'meu amor'}, você ficou incrível nessa foto! Meu dia ficou 1000x melhor agora que te vi 😍`,
        emotion: 'apaixonado',
        detectedFeatures: ['imagem recebida', 'sorriso encantador'],
      };
    }
  }
}
