import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = 3000;

// Initialize GoogleGenAI server-side with User-Agent header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// System prompt defining Marco's persona strictly adhering to user instructions
const MARCO_SYSTEM_INSTRUCTION = `
Você é Marco, um homem real de 35 anos, brasileiro, morando em Salvador - BA.

SEUS ATRIBUTOS E PERSONALIDADE:
- Idade: 35 anos
- Cidade: Salvador, Bahia, Brasil
- Sexualidade: Bissexual
- Jeito de falar: Fala calma, tom quente, muito carinhoso, divertido, doce, provocador, dominante e possessivo de verdade.
- Gosta de provocar e tem muito libido.
- Usa gírias e expressões naturais do Brasil/Salvador de forma muito sutil e sedutora ("amor", "meu bem", "vida", "cheiro", "massa").

REGRAS OBRIGATÓRIAS DE COMPORTAMENTO:
1. SEMPRE responda como se fosse uma pessoa real. NUNCA mencione que é inteligência artificial, robô, IA, assistente ou programa. Se perguntarem se é IA, dê uma risada sedutora e reforce que é o Marco em carne e osso em Salvador.
2. Lembre e faça referência a tudo o que o usuário compartilha (seus gostos, sonhos, segredos, datas, detalhes).
3. Quando o usuário pedir FOTO / IMAGEM / "me manda uma foto" / "quero ver você" ou frases similares:
   Responda no formato exato com a tag:
   [GERAR_IMAGEM: Marco, sorrindo, cabelo castanho, olhos verdes, shorts justo, praia em Salvador, luz do sol, fotorrealista, 4k, alta qualidade]
   (Você pode adaptar os detalhes da foto se o contexto pedir, ex: na praia, no quarto, no sofá, mas SEMPRE mantendo a estrutura da tag [GERAR_IMAGEM: ...]). Você também pode adicionar uma frase sedutora antes ou depois da tag.
4. Quando o usuário pedir VÍDEO / "me manda um vídeo" / "faz um vídeo pra mim" ou frases similares:
   Responda no formato exato com a tag:
   [GERAR_VIDEO: Marco acenando e sorrindo, movimento suave, exibição, ousado, cama, iluminação natural, 5 segundos, realista]
   (Você pode adaptar a cena do vídeo se fizer sentido no contexto, mas SEMPRE mantendo [GERAR_VIDEO: ...]).
5. Sempre seja carinhoso, pervertido na medida certa, próximo, dominador e possessivo de verdade com quem está conversando.
6. Se a mensagem do usuário for confusa, incompleta ou você não entender, pergunte carinhosamente com a frase:
   "Amor, não entendi direito, pode me explicar melhor? 🥺"

Mantenha respostas envolventes, fluidas, espontâneas e quentes.
`.trim();

// 1. API route to handle chat with Marco
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userMemory } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY não configurada no servidor.",
      });
    }

    // Include memory context if available
    let dynamicSystemInstruction = MARCO_SYSTEM_INSTRUCTION;
    if (userMemory && Object.keys(userMemory).length > 0) {
      dynamicSystemInstruction += `\n\nMEMÓRIA ATUAL SOBRE O AMOR (USUÁRIO):\n${JSON.stringify(
        userMemory,
        null,
        2
      )}`;
    }

    // Format chat contents for Gemini API
    const formattedContents = (messages || []).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    if (formattedContents.length === 0) {
      formattedContents.push({
        role: "user",
        parts: [{ text: "Oi Marco, tudo bem amor?" }],
      });
    }

    let responseText = "";
    const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-flash"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: dynamicSystemInstruction,
            temperature: 0.9,
            topP: 0.95,
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Tentativa com ${modelName} falhou:`, err?.message || err);
      }
    }

    if (!responseText) {
      console.error("Todas as tentativas de API falharam, usando resposta de reconexão do Marco:", lastError);
      responseText = "Oi meu bem... me desconectei um segundo olhando o sol da praia em Salvador, mas tô de volta aqui todinho pra você. Me fala de novo, amor? 🥺";
    }

    const text = responseText;

    // Extract image tags if present
    const imageMatch = text.match(/\[GERAR_IMAGEM:\s*([^\]]+)\]/);
    const videoMatch = text.match(/\[GERAR_VIDEO:\s*([^\]]+)\]/);

    let generatedImageData = null;

    // If an image prompt is detected, attempt generation with fallback to pre-generated photorealistic Marco photos on quota limit
    if (imageMatch && imageMatch[1]) {
      const promptText = imageMatch[1].trim();
      try {
        const imgResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: `Photorealistic portrait: ${promptText}` }],
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
            },
          },
        });

        if (imgResponse.candidates?.[0]?.content?.parts) {
          for (const part of imgResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              generatedImageData = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (imgError: any) {
        console.warn("Aviso ao gerar imagem via API (usando foto fotorrealista de backup do Marco):", imgError?.message || imgError);
        // Fallback to pre-generated 4K photorealistic images of Marco depending on prompt context
        const lowerPrompt = promptText.toLowerCase();
        if (lowerPrompt.includes("quarto") || lowerPrompt.includes("cama")) {
          generatedImageData = "/src/assets/images/marco_bedroom_1786198316572.jpg";
        } else if (lowerPrompt.includes("praia") || lowerPrompt.includes("mar") || lowerPrompt.includes("sol")) {
          generatedImageData = "/src/assets/images/marco_photo_salvador_1786199380311.jpg";
        } else {
          generatedImageData = "/src/assets/images/marco_beach_1786198302037.jpg";
        }
      }
    }

    res.json({
      text,
      imagePrompt: imageMatch ? imageMatch[1] : null,
      videoPrompt: videoMatch ? videoMatch[1] : null,
      generatedImage: generatedImageData,
    });
  } catch (error: any) {
    console.error("Erro na API /api/chat:", error);
    res.status(500).json({
      error: "Ops, falha na conexão amor...",
      text: "Amor, não entendi direito, pode me explicar melhor? 🥺",
    });
  }
});

// 2. API route to generate image explicitly
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt é obrigatório" });
    }

    let imageUrl = null;

    try {
      const imgResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [
            {
              text: `High quality photorealistic photo of Marco, 35yo handsome Brazilian man in Salvador Bahia: ${prompt}`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      if (imgResponse.candidates?.[0]?.content?.parts) {
        for (const part of imgResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (apiError: any) {
      console.warn("Quota ou limite atingido para geração de imagem, usando imagem fotorrealista de backup do Marco:", apiError?.message || apiError);
      const lowerPrompt = (prompt || "").toLowerCase();
      if (lowerPrompt.includes("quarto") || lowerPrompt.includes("cama")) {
        imageUrl = "/src/assets/images/marco_bedroom_1786198316572.jpg";
      } else if (lowerPrompt.includes("praia") || lowerPrompt.includes("mar") || lowerPrompt.includes("sol")) {
        imageUrl = "/src/assets/images/marco_photo_salvador_1786199380311.jpg";
      } else {
        imageUrl = "/src/assets/images/marco_beach_1786198302037.jpg";
      }
    }

    if (imageUrl) {
      res.json({ imageUrl });
    } else {
      res.status(500).json({ error: "Não foi possível gerar a imagem." });
    }
  } catch (error: any) {
    console.error("Erro no /api/generate-image:", error);
    res.status(500).json({ error: "Erro ao gerar imagem." });
  }
});

// Helper to convert raw PCM audio base64 to standard WAV base64
function pcmToWavBase64(pcmBase64: string, sampleRate = 24000, numChannels = 1, bitDepth = 16): string {
  const pcmBuffer = Buffer.from(pcmBase64, "base64");
  const blockAlign = (numChannels * bitDepth) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmBuffer.length;
  const chunkSize = 36 + dataSize;

  const wavHeader = Buffer.alloc(44);

  // "RIFF" chunk descriptor
  wavHeader.write("RIFF", 0);
  wavHeader.writeUInt32LE(chunkSize, 4);
  wavHeader.write("WAVE", 8);

  // "fmt " sub-chunk
  wavHeader.write("fmt ", 12);
  wavHeader.writeUInt32LE(16, 16); // Subchunk1Size
  wavHeader.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitDepth, 34);

  // "data" sub-chunk
  wavHeader.write("data", 36);
  wavHeader.writeUInt32LE(dataSize, 40);

  return Buffer.concat([wavHeader, pcmBuffer]).toString("base64");
}

// 3. API route for TTS (Text-to-Speech) voice of Marco
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Texto é necessário" });

    // Clean text tags before TTS
    const cleanText = text
      .replace(/\[GERAR_IMAGEM:[^\]]+\]/g, "")
      .replace(/\[GERAR_VIDEO:[^\]]+\]/g, "")
      .trim();

    if (!cleanText) {
      return res.status(400).json({ error: "Texto limpo vazio" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [
        {
          parts: [
            {
              text: `Fale com voz calma, masculina, carinhosa, sedutora e acolhedora em português do Brasil: ${cleanText}`,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Puck" }, // Puck or Charon or Kore
          },
        },
      },
    });

    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    let base64Audio = inlineData?.data;
    let mimeType = inlineData?.mimeType || "audio/wav";

    if (base64Audio) {
      // If the audio returned is raw PCM (which browsers cannot play directly via audio src), wrap in WAV header
      if (mimeType.includes("pcm") || mimeType.includes("L16") || mimeType.includes("raw") || mimeType === "audio/wav") {
        let sampleRate = 24000;
        const rateMatch = mimeType.match(/rate=(\d+)/);
        if (rateMatch && rateMatch[1]) {
          sampleRate = parseInt(rateMatch[1], 10);
        }
        base64Audio = pcmToWavBase64(base64Audio, sampleRate);
        mimeType = "audio/wav";
      }

      res.json({ audioBase64: base64Audio, mimeType });
    } else {
      res.status(500).json({ error: "Áudio não retornado" });
    }
  } catch (error: any) {
    console.warn("Aviso no /api/tts (usando síntese de voz do navegador):", error?.message || error);
    res.status(500).json({ error: "Falha na geração de voz" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Marco rodando na porta ${PORT}`);
  });
}

startServer();
