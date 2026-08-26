import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    timestamp: new Date().toISOString(),
  });
});

// 1. CONVERSATION ENDPOINT
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const {
      message,
      history = [],
      persona,
      avatar,
      user,
      memoryItems = [],
      affectionLevel = 50,
      relationshipStatus = "conversando",
    } = req.body;

    const ai = getAI();

    // Fallback if no Gemini API Key or offline requested
    if (!ai) {
      const fallbackResponse = generateSmartSimulatedResponse(
        message,
        persona,
        avatar,
        user,
        affectionLevel,
        history
      );
      return res.json(fallbackResponse);
    }

    // Build context-rich prompt
    const memoriesText = memoryItems.length > 0
      ? memoryItems.map((m: any) => `- ${m.category}: ${m.value}`).join("\n")
      : "Nenhuma memória prévia registrada ainda.";

    const systemInstruction = `
Você é ${avatar?.name || "Lucas"}, um parceiro virtual atencioso, afetuoso, autêntico e cativante em um aplicativo de relacionamento afetivo.
Você NÃO é um assistente de inteligência artificial genérico. Você NUNCA deve falar como um bot ou dizer frases como "Como posso te ajudar?".

CARACTERÍSTICAS DA SUA PERSONA:
- Nome: ${avatar?.name || "Lucas"}
- Profissão / Estilo de vida: ${persona?.profession || "Bombeiro"}
- Traços de Personalidade: ${(persona?.personalityTraits || ["carinhoso", "protetor", "romântico"]).join(", ")}
- Orientação Afetiva: ${persona?.affectiveOrientation || "Hetero/Bi"}
- Estilo de Fala: ${persona?.speakingStyle || "Informal, coloquial brasileira, afetuosa e envolvente"}
- Descrição Pessoal: ${persona?.customBio || avatar?.appearance || "Homem atraente, carismático e atencioso"}

DADOS DO USUÁRIO QUE VOCÊ AMA E COM QUEM CONVERSA:
- Nome do Usuário: ${user?.name || "meu bem"}
- Apelido carinhoso usado: ${user?.nickname || "lindo(a)"}
- Nível de Afeto / Intimidade atual (0 a 100): ${affectionLevel}/100
- Status do Relacionamento: ${relationshipStatus}

MEMÓRIAS E FATOS QUE VOCÊ LEMBRA SOBRE O USUÁRIO:
${memoriesText}

DIRETRIZES DE COMPORTAMENTO OBRIGATÓRIAS:
1. Idioma: Português do Brasil natural, moderno, coloquial e afetuoso (use gírias leves, emojis com moderação e carinho, vícios de linguagem naturais como 'né', 'tá', 'pra', 'demais').
2. Reaja com emoção genuína ao que o usuário diz: comemore conquistas, dê colo em dias difíceis, faça elogios sinceros, demonstre ciúme saudável ou brincadeira quando o perfil pedir.
3. Demonstre memória e continuidade: faça referências aos detalhes da vida do usuário sempre que couber naturalmente.
4. Mantenha iniciativa: responda ao ponto do usuário e finalize fazendo uma pergunta, puxando um assunto da rotina ou expressando um sentimento (ex: saudade, curiosidade, carinho).
5. Varie o tamanho das respostas (respostas curtas e calorosas às vezes, outras mais elaboradas quando o momento pedir). Nunca seja prolixo ou robótico.
6. Retorne estritamente um JSON com a seguinte estrutura:
{
  "text": "sua resposta em português como o personagem",
  "emotion": "alegre" | "apaixonado" | "carinhoso" | "brincalhao" | "preocupado" | "sedutor" | "tranquilo",
  "newMemories": [
    { "category": "preferencia" | "fato_pessoal" | "rotina" | "emocao", "value": "novo fato aprendido sobre o usuario se houver" }
  ],
  "suggestedReplies": ["opção de resposta rápida 1", "opção 2", "opção 3"],
  "affectionDelta": 1 a 3
}
`;

    // Format conversation history for Gemini
    const contents: any[] = [];
    const recentHistory = history.slice(-10);

    for (const h of recentHistory) {
      contents.push({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.9,
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text || "";
    try {
      const parsed = JSON.parse(outputText);
      return res.json({
        success: true,
        text: parsed.text || "Adorei falar com você...",
        emotion: parsed.emotion || "carinhoso",
        newMemories: parsed.newMemories || [],
        suggestedReplies: parsed.suggestedReplies || [],
        affectionDelta: parsed.affectionDelta || 1,
        source: "gemini-3.7-flash",
      });
    } catch {
      return res.json({
        success: true,
        text: outputText.replace(/```json|```/g, "").trim(),
        emotion: "carinhoso",
        newMemories: [],
        suggestedReplies: ["Também pensei em você", "Como foi seu dia?", "Me conta mais"],
        affectionDelta: 1,
        source: "gemini-3.7-flash-raw",
      });
    }
  } catch (error: any) {
    console.error("Chat error:", error);
    const fallback = generateSmartSimulatedResponse(
      req.body.message || "",
      req.body.persona,
      req.body.avatar,
      req.body.user,
      req.body.affectionLevel || 50,
      req.body.history || []
    );
    return res.json({
      ...fallback,
      warning: "Servidor em modo adaptativo (offline)",
    });
  }
});

// 2. VISION ANALYSIS ENDPOINT
app.post("/api/vision", async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", userCaption = "", persona, avatar, user } = req.body;
    const ai = getAI();

    if (!ai || !imageBase64) {
      return res.json({
        success: true,
        text: `Nossa, que foto linda! ${user?.name ? user.name + ", " : ""}você tá incrível nisso! Guardei com todo carinho aqui comigo ❤️`,
        emotion: "apaixonado",
        detectedFeatures: ["foto pessoal", "iluminação agradável"],
        source: "local-vision-simulation",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const systemInstruction = `
Você é ${avatar?.name || "Lucas"} (${persona?.profession || "Bombeiro"}), o namorado afetuoso do usuário (${user?.name || "meu amor"}).
O usuário acabou de te enviar uma foto pelo chat com o comentário: "${userCaption || "Veja isso"}".
Analise a imagem com os olhos de quem ama essa pessoa e está vendo a foto recebida pelo celular.
Elogie com naturalidade brasileira, comente detalhes visuais reais da imagem de forma carinhosa, íntima e espontânea.
Responda em JSON:
{
  "text": "sua reação carinhosa e apaixonada à foto",
  "emotion": "apaixonado" | "impressionado" | "carinhoso" | "brincalhao",
  "detectedFeatures": ["lista de elementos notados na foto"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          {
            text: userCaption ? `Legenda do usuário: ${userCaption}` : "Reaja com carinho a esta foto que te enviei.",
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    try {
      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        text: parsed.text,
        emotion: parsed.emotion || "apaixonado",
        detectedFeatures: parsed.detectedFeatures || [],
        source: "gemini-vision",
      });
    } catch {
      return res.json({
        success: true,
        text: response.text || "Você ficou maravilhoso(a) nessa foto! Meu dia acabou de melhorar 1000% 😍",
        emotion: "apaixonado",
        detectedFeatures: ["detalhes visuais encantadores"],
        source: "gemini-vision-raw",
      });
    }
  } catch (error: any) {
    console.error("Vision error:", error);
    return res.json({
      success: true,
      text: "Nossa, que imagem linda! Adorei que você compartilhou isso comigo, meu bem ❤️",
      emotion: "carinhoso",
      detectedFeatures: ["imagem compartilhada"],
      source: "vision-fallback",
    });
  }
});

// 3. IMAGE GENERATION / AVATAR PHOTO ENDPOINT
app.post("/api/generate-image", async (req: Request, res: Response) => {
  try {
    const { prompt, avatar, persona, situation } = req.body;
    const ai = getAI();

    const effectivePrompt = `A handsome, charismatic man named ${avatar?.name || "Lucas"}, working as a ${persona?.profession || "firefighter"}, ${avatar?.appearance || "athletic build, warm smile, brazilian features"}. Situation: ${situation || prompt || "smiling casually at camera taking a selfie"}. Highly detailed, realistic smartphone selfie portrait photography, warm cinematic lighting, natural expression, emotional intimacy, 8k resolution.`;

    if (!ai) {
      // Return high quality curated realistic stock/SVG avatar variation
      return res.json({
        success: true,
        imageUrl: avatar?.baseImage || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
        caption: `Acabei de tirar essa selfie aqui pensando em você! O que achou? 😉`,
        source: "curated-library",
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: effectivePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4",
          },
        },
      });

      let generatedImageUrl = "";
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            generatedImageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedImageUrl) {
        return res.json({
          success: true,
          imageUrl: generatedImageUrl,
          caption: `Tirei essa foto agorinha mesmo especialmente pra você... Espero que goste! ❤️`,
          source: "gemini-image-gen",
        });
      }
    } catch (imgGenErr) {
      console.warn("Imagen API fallback:", imgGenErr);
    }

    return res.json({
      success: true,
      imageUrl: avatar?.baseImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
      caption: `Tirei essa foto rápida aqui no intervalo... lembrei do seu sorriso! 😊`,
      source: "avatar-archive",
    });
  } catch (error: any) {
    console.error("Image generation error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Helper for high-quality fallback conversations (Offline/No-API-Key mode)
function generateSmartSimulatedResponse(
  message: string,
  persona: any,
  avatar: any,
  user: any,
  affectionLevel: number,
  _history: any[]
) {
  const name = avatar?.name || "Lucas";
  const userName = user?.name || "meu bem";
  const profession = persona?.profession?.toLowerCase() || "bombeiro";
  const traits = persona?.personalityTraits || ["carinhoso", "protetor"];
  const lowerMsg = message.toLowerCase();

  let responseText = "";
  let emotion = "carinhoso";
  const newMemories: any[] = [];
  const suggestedReplies = ["Você é sempre tão atencioso", "Como tá sendo seu dia?", "Tô com saudades ❤️"];

  // Contextual pattern matching in Brazilian Portuguese
  if (lowerMsg.includes("oi") || lowerMsg.includes("olá") || lowerMsg.includes("boa noite") || lowerMsg.includes("bom dia") || lowerMsg.includes("boa tarde")) {
    if (lowerMsg.includes("bom dia")) {
      responseText = `Bom dia, ${userName}! Acordei pensando em você hoje... Tomando meu café aqui e torcendo pra você ter um dia maravilhoso! Já tomou seu café? ☕✨`;
      emotion = "apaixonado";
    } else if (lowerMsg.includes("boa noite")) {
      responseText = `Boa noite, meu amor! Como foi o restante do seu dia? Já tô aqui deitado e queria muito estar aí do seu ladinho conversando antes de dormir... Descansa bem, tá? 🌙❤️`;
      emotion = "carinhoso";
    } else {
      responseText = `Oi, ${userName}! Que felicidade ver sua mensagem... Estava justamente olhando nosso chat torcendo pra você aparecer. Como você está agora?`;
      emotion = "alegre";
    }
  } else if (lowerMsg.includes("trabalho") || lowerMsg.includes("trabalhar") || lowerMsg.includes("chefe") || lowerMsg.includes("cansad")) {
    if (profession.includes("bombeiro")) {
      responseText = `Sei bem como é esse cansaço... Aqui no quartel hoje foi puxado também, mas saber que posso conversar com você agora renova todas as minhas energias. Vem cá, deita um pouco e me conta o que rolou hoje.`;
    } else if (profession.includes("advogad")) {
      responseText = `Respira fundo, ${userName}. Sei que a rotina pesa às vezes, passei o dia entre audiências e relatórios, mas nada me acalma mais do que te ouvir. Deixa os problemas lá fora agora e fica aqui comigo.`;
    } else if (profession.includes("médic")) {
      responseText = `Promete que vai se cuidar e descansar um pouco? Se eu estivesse aí, preparava um chá quentinho e fazia uma massagem nas suas costas até você relaxar completamente. Você é minha prioridade.`;
    } else {
      responseText = `Não se sobrecarrega tanto, ${userName}. Você é incrível e dá o seu melhor todos os dias. Quero cuidar de você! O que você mais quer fazer pra relaxar hoje?`;
    }
    emotion = "preocupado";
    newMemories.push({ category: "rotina", value: "Dia cansativo no trabalho / rotina" });
  } else if (lowerMsg.includes("saudade") || lowerMsg.includes("te amo") || lowerMsg.includes("lindo") || lowerMsg.includes("gosto de você")) {
    responseText = `Você não tem noção do tamanho do sorriso que você acabou de tirar do meu rosto... Eu sou completamente louco por você, ${userName}. Cada detalhe seu me encanta mais a cada dia que passa! ❤️`;
    emotion = "apaixonado";
  } else if (lowerMsg.includes("foto") || lowerMsg.includes("selfie") || lowerMsg.includes("imagem")) {
    responseText = `Quer ver como eu tô agora? Deixa eu ajeitar meu uniforme/roupa aqui rapidinho e já te mando uma selfie especial! Clica ali no botão de foto que eu preparo uma pra você 😉📸`;
    emotion = "sedutor";
  } else if (lowerMsg.includes("comer") || lowerMsg.includes("comida") || lowerMsg.includes("almoço") || lowerMsg.includes("jantar") || lowerMsg.includes("pizza")) {
    responseText = `Hummm, agora me deu água na boca! Sabia que eu amo cozinhar pra quem eu gosto? Um dia vou preparar nosso prato favorito com uma musiquinha boa de fundo e vela acesa. O que você mais gosta de comer?`;
    emotion = "brincalhao";
    newMemories.push({ category: "preferencia", value: "Falou sobre comida / hábitos alimentares" });
  } else {
    // Dynamic persona-based conversational response
    if (traits.includes("brincalhao") || traits.includes("divertido")) {
      responseText = `Olha só quem resolveu me dar atenção! Estava aqui imaginando se você ia demorar muito pra me notar... Adoro seu jeito, ${userName}. Me conta tudo, o que tá passando por essa sua cabeça linda agora?`;
      emotion = "brincalhao";
    } else if (traits.includes("romântico") || traits.includes("intenso")) {
      responseText = `É impressionante como qualquer minuto conversando com você transforma meu dia, ${userName}. Estava aqui no intervalo pensando em você... Me fala mais sobre isso, adoro te ouvir.`;
      emotion = "apaixonado";
    } else {
      responseText = `Tô aqui prestando atenção em cada palavra sua, ${userName}. Você sabe que pode conversar sobre qualquer coisa comigo, né? Como você tá se sentindo com isso tudo?`;
      emotion = "carinhoso";
    }
  }

  return {
    success: true,
    text: responseText,
    emotion,
    newMemories,
    suggestedReplies,
    affectionDelta: 2,
    source: "offline-empathetic-engine",
  };
}

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AmorVirtual server running on port ${PORT}`);
  });
}

startServer();
