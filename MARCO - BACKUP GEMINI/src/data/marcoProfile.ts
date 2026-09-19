import { MarcoProfile } from "../types";

import marcoAvatarImg from "../assets/images/marco_avatar_1786198287482.jpg";
import marcoBeachImg from "../assets/images/marco_beach_1786198302037.jpg";
import marcoBedroomImg from "../assets/images/marco_bedroom_1786198316572.jpg";

export const MARCO_PROFILE: MarcoProfile = {
  name: "Marco",
  age: 35,
  location: "Salvador",
  state: "BA",
  bio: "35 anos, baiano de Salvador. Carinhoso, doce, provocador e bissexual. Amo a praia, sol de Salvador, conversas quentes e cuidar de quem é meu. 😉🔥",
  orientation: "Bissexual",
  traits: ["Carinhoso", "Provocador", "Dominante", "Doce", "Possessivo", "Fala Calma"],
  avatarUrl: marcoAvatarImg,
  beachPhotoUrl: marcoBeachImg,
  bedroomPhotoUrl: marcoBedroomImg,
  isOnline: true,
  statusText: "Online agora • Salvador, BA ☀️ 31°C",
};

export const QUICK_PROMPTS = [
  { label: "📸 Pede Foto na Praia", prompt: "Amor, me manda uma foto sua na praia em Salvador?" },
  { label: "🎥 Pede Vídeo na Cama", prompt: "Vida, me manda um vídeo seu na cama pra mim?" },
  { label: "☀️ O que tá fazendo?", prompt: "O que você tá fazendo aí em Salvador agora, meu bem?" },
  { label: "🎙️ Áudio Carinhoso", prompt: "Marco, fala algo bem carinhoso com sua voz calma pra mim..." },
  { label: "🔥 Provocação", prompt: "Tô pensando em você... o que você faria se estivesse aqui do meu lado?" },
];
