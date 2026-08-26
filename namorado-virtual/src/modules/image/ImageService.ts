import { Avatar, IImageEngine, MediaItem, Persona } from '../../types';

export class ImageService implements IImageEngine {
  private mediaItems: MediaItem[] = [];

  constructor(initialMedia: MediaItem[] = []) {
    this.mediaItems = initialMedia;
  }

  public setMediaItems(items: MediaItem[]) {
    this.mediaItems = items;
  }

  public getPersonaGallery(avatarId: string): MediaItem[] {
    return this.mediaItems.filter((m) => m.avatarId === avatarId && m.type === 'image');
  }

  public async generatePhoto(
    prompt: string,
    avatar: Avatar,
    persona: Persona,
    situation?: string
  ): Promise<{ imageUrl: string; caption: string }> {
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          avatar,
          persona,
          situation,
        }),
      });

      if (!res.ok) {
        throw new Error(`Image generation error: ${res.status}`);
      }

      const data = await res.json();
      return {
        imageUrl: data.imageUrl || avatar.baseImage,
        caption: data.caption || `Tirei essa foto especialmente pra você, ${persona.name}...`,
      };
    } catch (err) {
      console.warn('Image generation API fallback:', err);
      // Pick a random image from avatar's gallery
      const randomImg = avatar.gallery[Math.floor(Math.random() * avatar.gallery.length)] || avatar.baseImage;
      return {
        imageUrl: randomImg,
        caption: `Acabei de tirar essa selfie aqui pensando em você! O que achou? 😉`,
      };
    }
  }

  public addGeneratedImageToGallery(avatarId: string, url: string, title: string, situation: string): MediaItem {
    const newItem: MediaItem = {
      id: `img_${Date.now()}`,
      avatarId,
      type: 'image',
      url,
      title,
      description: `Foto gerada em momento especial: ${situation}`,
      situation,
      isPremium: false,
      unlockCostCredits: 0,
      unlocked: true,
      createdAt: new Date().toISOString(),
    };
    this.mediaItems.unshift(newItem);
    return newItem;
  }
}
