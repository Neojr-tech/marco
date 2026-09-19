export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  imagePrompt?: string | null;
  videoPrompt?: string | null;
  generatedImage?: string | null;
  audioUrl?: string | null;
  isAudioLoading?: boolean;
  status?: "sent" | "delivered" | "read";
}

export interface UserMemory {
  name?: string;
  nickname?: string;
  likes?: string[];
  dreams?: string[];
  importantDates?: string[];
  notes?: string[];
}

export interface MarcoProfile {
  name: string;
  age: number;
  location: string;
  state: string;
  bio: string;
  orientation: string;
  traits: string[];
  avatarUrl: string;
  beachPhotoUrl: string;
  bedroomPhotoUrl: string;
  isOnline: boolean;
  statusText: string;
}
