import { Avatar, IVideoEngine, MediaItem, Persona } from '../../types';

export class VideoService implements IVideoEngine {
  private mediaItems: MediaItem[] = [];

  constructor(initialMedia: MediaItem[] = []) {
    this.mediaItems = initialMedia;
  }

  public setMediaItems(items: MediaItem[]) {
    this.mediaItems = items;
  }

  public getPersonaVideos(avatarId: string): MediaItem[] {
    return this.mediaItems.filter((m) => m.avatarId === avatarId && m.type === 'video');
  }

  public async generateStoryClip(avatar: Avatar, persona: Persona, theme: string): Promise<MediaItem> {
    // In production, can call Veo via /api/generate-video. Here we construct a high quality responsive story item.
    const fallbackVideos = [
      'https://assets.mixkit.co/videos/preview/mixkit-young-man-smiling-happily-at-the-camera-42468-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-handsome-man-drinking-coffee-and-smiling-41804-large.mp4',
    ];

    const chosenVideo = fallbackVideos[Math.floor(Math.random() * fallbackVideos.length)];

    const newVideo: MediaItem = {
      id: `vid_${Date.now()}`,
      avatarId: avatar.id,
      personaId: persona.id,
      type: 'video',
      url: chosenVideo,
      title: `Recado em Vídeo: ${theme}`,
      description: `Vídeo espontâneo gravado por ${avatar.name} (${persona.profession}).`,
      situation: theme,
      isPremium: true,
      durationSeconds: 15,
      unlockCostCredits: 3,
      unlocked: true,
      createdAt: new Date().toISOString(),
    };

    this.mediaItems.unshift(newVideo);
    return newVideo;
  }

  public unlockVideo(mediaId: string): boolean {
    const item = this.mediaItems.find((m) => m.id === mediaId);
    if (!item) return false;
    item.unlocked = true;
    return true;
  }
}
