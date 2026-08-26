import {
  ConversationEnginePayload,
  ConversationEngineResult,
  EngineConfig,
  IConversationEngine,
  MemoryCategory,
} from '../../../types';

export class OfflineSimulatedEngine implements IConversationEngine {
  public providerName = 'Motor Simulado Local / 100% Offline';

  async initialize(_config: EngineConfig): Promise<boolean> {
    return true;
  }

  async sendMessage(payload: ConversationEnginePayload): Promise<ConversationEngineResult> {
    const { message, persona, avatar, user, affectionLevel } = payload;
    const userName = user?.name || user?.nickname || 'meu bem';
    const profession = persona.profession.toLowerCase();
    const traits = persona.personalityTraits;
    const lower = message.toLowerCase();

    let text = '';
    let emotion = 'carinhoso';
    const newMemories: Array<{ category: MemoryCategory; value: string }> = [];
    const suggestedReplies: string[] = [];

    // Memory extraction heuristics
    if (lower.includes('meu nome é') || lower.includes('me chamo')) {
      const match = message.match(/(?:meu nome é|me chamo)\s+([A-Za-zÀ-ÿ]+)/i);
      if (match && match[1]) {
        newMemories.push({ category: 'fato_pessoal', value: `Nome é ${match[1]}` });
      }
    }
    if (lower.includes('gosto de') || lower.includes('amo') || lower.includes('adoro')) {
      const match = message.match(/(?:gosto de|amo|adoro)\s+([^\.,!]+)/i);
      if (match && match[1]) {
        newMemories.push({ category: 'preferencia', value: `Gosta de ${match[1].trim()}` });
      }
    }
    if (lower.includes('meu aniversário') || lower.includes('nasci em')) {
      newMemories.push({ category: 'data_especial', value: `Data comemorativa mencionada: ${message}` });
    }

    // Conversational flow tree
    if (lower.includes('bom dia')) {
      text = `Bom dia, meu amor! Acordei pensando no quanto é bom ter você na minha vida. Já tomou seu café da manhã? Quero que seu dia seja maravilhoso! ☕❤️`;
      emotion = 'apaixonado';
      suggestedReplies.push('Bom dia lindo!', 'Tô tomando café agora', 'Pensou em mim? 😍');
    } else if (lower.includes('boa noite')) {
      text = `Boa noite, ${userName}... Já tô deitado aqui no quarto e tudo o que eu queria era poder te abraçar até você adormecer. Dorme bem e sonha comigo, tá? 🌙✨`;
      emotion = 'carinhoso';
      suggestedReplies.push('Boa noite amor', 'Vou sonhar com certeza', 'Queria esse abraço...');
    } else if (lower.includes('te amo') || lower.includes('te adoro') || lower.includes('gosto de você') || lower.includes('apaixonad')) {
      text = `Você não faz ideia de como meu coração acelerou lendo isso... Eu sou completamente louco por você, ${userName}. Cada dia que converso com você tenho mais certeza de que você é única(o)! ❤️‍🔥`;
      emotion = 'apaixonado';
      suggestedReplies.push('Você me faz tão bem', 'Casa comigo? rs', 'Vem cá me abraçar');
    } else if (lower.includes('como foi seu dia') || lower.includes('o que fez hoje') || lower.includes('trabalhou muito')) {
      if (profession.includes('bombeiro')) {
        text = `Foi um plantão bem agitado no quartel hoje, mas agora que passei a viatura pro próximo turno e tô falando com você, tudo fica leve. E o seu dia, foi muito corrido?`;
      } else if (profession.includes('advogad')) {
        text = `Passei o dia inteiro entre peças processuais e reuniões no escritório, mas a melhor parte do meu dia é exatamente esse momento aqui contigo. Me conta o que você fez hoje!`;
      } else if (profession.includes('médic')) {
        text = `Dia puxado no hospital, mas gratificante. Quando cheguei no vestiário, a primeira coisa que fiz foi olhar se você tinha me mandado mensagem. Como você tá?`;
      } else if (profession.includes('personal')) {
        text = `Dia de muitos treinos e alunos na academia, gastei bastante energia! Agora tô aqui relaxando e recarregando as baterias conversando com você. Como foi por aí?`;
      } else {
        text = `Dia produtivo por aqui, mas nada se compara à sensação de abrir nosso chat e conversar contigo. Me conta todos os detalhes do que aconteceu hoje com você!`;
      }
      emotion = 'alegre';
      suggestedReplies.push('Foi bem tranquilo', 'Tô um pouco cansada(o)', 'Aconteceu algo engraçado!');
    } else if (lower.includes('triste') || lower.includes('chorar') || lower.includes('cansad') || lower.includes('ruim') || lower.includes('chatead')) {
      text = `Ei, vem cá... Respira fundo e deita no meu colo virtual. Ninguém merece passar por momentos difíceis sozinho. Eu tô aqui com você pra tudo, tá me ouvindo? O que aconteceu que te deixou assim?`;
      emotion = 'preocupado';
      newMemories.push({ category: 'emocao', value: 'Dia sensível / precisando de carinho' });
      suggestedReplies.push('Obrigada(o) por estar aqui', 'Foi o trabalho...', 'Só precisava do seu carinho');
    } else if (lower.includes('foto') || lower.includes('selfie') || lower.includes('manda foto') || lower.includes('te ver')) {
      text = `Adoro quando você pede pra me ver! Deixa eu ajeitar o cabelo aqui e te mandar uma foto especial agora mesmo. Clica no botão de galeria/foto ali embaixo que eu preparo pra você 😉📸`;
      emotion = 'sedutor';
      suggestedReplies.push('Tô ansioso(a) pra ver', 'Você é lindo demais', 'Manda logo!');
    } else if (lower.includes('saudade') || lower.includes('saudades') || lower.includes('falta')) {
      text = `Nem me fale de saudade... Conto as horas do meu dia só pra gente trocar mensagens. Se eu pudesse me teletransportar agora, já tava aí na sua porta te esperando com um abraço bem apertado!`;
      emotion = 'apaixonado';
      suggestedReplies.push('Eu queria muito isso', 'Você é um fofo', 'Quando a gente se vê?');
    } else if (lower.includes('ciúme') || lower.includes('ciumes') || lower.includes('amigo') || lower.includes('amiga') || lower.includes('balada') || lower.includes('festa')) {
      if (traits.includes('ciumento') || traits.includes('protetor')) {
        text = `Hummm... não vou negar que me deu uma pontinha de ciúme, viu? Mas confio em você e só quero que você se divirta e fique em segurança. Só não esquece de me mandar mensagem pra eu saber que tá bem! 😉`;
      } else {
        text = `Aproveita muito, ${userName}! Quero te ver sorrindo e se divertindo sempre. Mas não esquece que tem alguém aqui completamente caidinho por você esperando notícias!`;
      }
      emotion = 'brincalhao';
      suggestedReplies.push('Pode deixar meu amor', 'Você é muito fofo', 'Só tenho olhos pra você');
    } else {
      // Trait-driven open responses
      if (traits.includes('brincalhão') || traits.includes('divertido')) {
        text = `Olha só, eu adoro esse seu jeito espontâneo, sabia? Você sempre consegue me tirar um sorriso bobo aqui. Me fala mais sobre isso, ${userName}!`;
        emotion = 'brincalhao';
      } else if (traits.includes('ousado') || traits.includes('intenso')) {
        text = `Gosto de como nossa conversa flui de um jeito tão natural e envolvente... Você tem um magnetismo incrível, ${userName}. O que mais você tá pensando agora?`;
        emotion = 'sedutor';
      } else if (traits.includes('tímido') || traits.includes('romântico')) {
        text = `Sabe que às vezes fico pensando em como tive sorte de te encontrar? Você tem um carinho que me acalma por dentro. O que você gostaria de fazer se a gente estivesse juntos agora?`;
        emotion = 'apaixonado';
      } else {
        text = `Tô aqui prestando atenção em cada detalhe do que você fala. Você é muito especial pra mim, ${userName}. Me conta mais!`;
        emotion = 'carinhoso';
      }
      suggestedReplies.push('Adoro conversar com você', 'O que você tá fazendo agora?', 'Me faz um carinho');
    }

    return {
      text,
      emotion,
      newMemories,
      suggestedReplies,
      affectionDelta: affectionLevel < 90 ? 2 : 1,
      source: 'offline-simulated-engine',
    };
  }

  async resetConversation(_conversationId: string): Promise<boolean> {
    return true;
  }

  async loadContext(_conversationId: string): Promise<any> {
    return null;
  }

  async saveContext(_conversationId: string, _context: any): Promise<boolean> {
    return true;
  }
}
