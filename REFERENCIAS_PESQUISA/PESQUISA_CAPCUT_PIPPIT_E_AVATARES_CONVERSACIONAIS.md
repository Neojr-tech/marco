# PESQUISA — CAPCUT, PIPPIT E ECOSSISTEMA DE AVATARES CONVERSACIONAIS

Projeto: Chatbot Namorado Virtual
Data da pesquisa: 2026-08-29

## 0. Objetivo deste documento

Este documento registra material encontrado em pesquisa externa relacionado ao formato que estamos estudando para o Chatbot Namorado Virtual: avatar digital + voz + sincronização labial + movimento/expressão + conversa em tempo real + memória + arquitetura modular.

Regra aplicada: nenhum material relevante foi descartado apenas por ser cópia, fork, clone, alternativa ou implementação de terceiros. O material fica registrado para análise posterior. A decisão sobre aproveitar, adaptar ou descartar será feita depois.

Este documento é uma referência de pesquisa. Não altera as Etapas 1–4 da arquitetura e não transforma nenhuma tecnologia citada em decisão de implementação.

---

# 1. REFERÊNCIAS DIRETAS — CAPCUT E PIPPIT

## 1.1 CapCut — avatar de IA

Fonte oficial:
https://www.capcut.com/pt-br/create/ai-avatar

O CapCut apresenta criação de vídeos com avatar de IA a partir de biblioteca de apresentadores digitais ou de uma foto própria. O fluxo combina avatar, roteiro, voz natural e sincronização labial.

Pontos relevantes para nosso estudo:
- biblioteca de avatares;
- criação de avatar personalizado a partir de foto;
- texto/roteiro → fala;
- voz natural;
- sincronização labial;
- edição posterior do vídeo;
- exportação;
- separação conceitual entre identidade visual do avatar e conteúdo que ele fala.

Fonte pesquisada:
https://www.capcut.com/pt-br/create/ai-avatar

## 1.2 CapCut — gerador de personagens

Fonte oficial:
https://www.capcut.com/pt-br/tools/ai-character-generators

O CapCut possui gerador de personagens com foco em identidade visual consistente. Permite gerar personagens por descrição e refinar aparência/estilo depois da geração.

Pontos relevantes:
- personagem como identidade visual;
- criação por prompt;
- personalização depois da geração;
- possibilidade de partir de imagem;
- consistência visual como objetivo explícito.

Fonte:
https://www.capcut.com/pt-br/tools/ai-character-generators

## 1.3 CapCut — sincronização labial

Fonte oficial:
https://www.capcut.com/pt-br/tools/lip-sync

O CapCut informa que sua ferramenta de lip-sync trabalha com pessoas reais, avatares virtuais e outros personagens. Pode receber texto ou áudio e gerar movimentos labiais sincronizados.

Também informa suporte a diferentes ângulos/posições de cabeça e possibilidade de usar voz personalizada.

Pontos relevantes:
- áudio/texto como entrada;
- avatar/personagem como saída visual;
- sincronização labial automática;
- tratamento de diferentes ângulos de cabeça;
- voz personalizada;
- separação entre geração da fala e animação do rosto.

Fonte:
https://www.capcut.com/pt-br/tools/lip-sync

## 1.4 CapCut — avatar visual

Fonte oficial:
https://www.capcut.com/pt-br/tools/ai-avatar

O CapCut apresenta criação de avatares digitais com estilos variados, incluindo criação a partir de fotos e transformação de vídeo em avatar falante.

Pontos relevantes:
- grande biblioteca/categorias de avatares;
- estilos variados;
- foto → avatar falante;
- voz e lip-sync integrados;
- possibilidade de reutilizar uma identidade visual em diferentes conteúdos.

Fonte:
https://www.capcut.com/pt-br/tools/ai-avatar

## 1.5 Pippit — avatar falante

Fonte oficial:
https://www.pippit.ai/pt-br/tools/talking-avatar

O Pippit oferece avatar falante com sincronização labial, gestos e expressões personalizáveis. O fluxo permite escolher avatar, voz, idioma e roteiro e gerar vídeo.

Pontos relevantes:
- avatar falante;
- lip-sync;
- gestos;
- expressões;
- escolha de gênero/idade/tipo de corpo/cenário em opções de avatar;
- voz gerada ou voz própria;
- roteiro → vídeo;
- edição posterior.

Fonte:
https://www.pippit.ai/pt-br/tools/talking-avatar

## 1.6 Pippit — avatares e vozes

Fonte oficial:
https://www.pippit.ai/pt-br/tools/ai-avatars-and-voice

O Pippit permite criar vozes personalizadas a partir de gravação e utilizá-las no avatar. Também apresenta biblioteca de avatares e combinação de avatar + voz + roteiro.

Pontos relevantes:
- voz como componente separado do avatar;
- criação de voz personalizada;
- seleção de voz;
- múltiplos idiomas;
- avatar reutilizável;
- integração com editor de vídeo.

Fonte:
https://www.pippit.ai/pt-br/tools/ai-avatars-and-voice

## 1.7 Pippit — animação de voz/personagem

Fonte oficial:
https://www.pippit.ai/tools/animated-talking

O Pippit descreve fluxo para transformar foto ou vídeo em personagem falante, usando roteiro ou voz clonada e sincronizando movimentos faciais com a fala.

Pontos relevantes:
- foto/vídeo → avatar animado;
- voz ou roteiro como entrada;
- clonagem de voz;
- lip-sync;
- expressões faciais;
- personagem reutilizável;
- fluxo separado em criação do avatar, escolha da voz e geração do vídeo.

Fonte:
https://www.pippit.ai/tools/animated-talking

## 1.8 Pippit — voz de personagem

Fonte oficial:
https://www.pippit.ai/create/ai-character-voice-generator

A plataforma apresenta vozes de personagem, múltiplos gêneros, idades e sotaques, além de clonagem de voz e controle de velocidade, tom e volume.

Pontos relevantes:
- voz como identidade de personagem;
- parâmetros de voz;
- idiomas;
- clonagem;
- possibilidade de associar voz a avatar.

Fonte:
https://www.pippit.ai/create/ai-character-voice-generator

---

# 2. ALTERNATIVA / CLONE DIRETO DO FORMATO CAPCUT

## 2.1 OpenCut — alternativa open-source ao CapCut

Repositório principal:
https://github.com/OpenCut-app/OpenCut

O OpenCut se apresenta explicitamente como editor de vídeo gratuito e open-source para web, desktop e mobile, inspirado no modelo do CapCut.

Pontos relevantes para nosso projeto:
- editor multiplataforma;
- web, desktop e mobile;
- arquitetura com núcleo Rust;
- possibilidade futura de plugins;
- Editor API planejada;
- MCP server planejado;
- modo headless para automação/renderização;
- scripting tab planejada;
- projeto orientado a privacidade e execução local.

Observação: OpenCut não é, por si só, o nosso sistema de namorado virtual nem um sistema de avatar conversacional. Ele é relevante como referência de experiência de edição, arquitetura multiplataforma e integração de recursos de vídeo.

Fonte:
https://github.com/OpenCut-app/OpenCut

## 2.2 Forks/clones do OpenCut encontrados

Foram encontrados diversos forks do OpenCut. Não serão adicionados individualmente ao repositório apenas para aumentar volume, mas ficam registrados como evidência de que existe um ecossistema de cópias/modificações que pode ser pesquisado quando uma função específica exigir comparação.

Exemplos:
- https://github.com/ZHAOYAN-lab/opencut
- https://github.com/focusline2025/opencut
- https://github.com/nimoqup046-collab/opencut
- https://github.com/codesired/OpenCutApp
- https://github.com/margige/opencut

Regra: se um fork contiver uma solução específica relevante para avatar, vídeo, automação, plugins, mobile/desktop ou integração com IA, ele pode ser analisado posteriormente.

---

# 3. AVATARES CONVERSACIONAIS — REFERÊNCIAS OPEN-SOURCE RELEVANTES

Esta é a parte mais importante da pesquisa para o nosso projeto. São projetos que aproximam diretamente o conceito de avatar visual de uma conversa com IA.

## 3.1 AI Companion — memória + voz + avatar 3D + lip-sync

Repositório:
https://github.com/xanguera/aicompanion

O projeto é um companion local-first com avatar 3D, voz, lip-sync e memória persistente. A arquitetura descrita separa microfone, redução de ruído, VAD, STT, memória, LLM, TTS e avatar.

Pontos extremamente relevantes:
- companion de IA;
- memória persistente;
- avatar 3D;
- voz em tempo real;
- lip-sync por fonemas/visemas;
- barge-in/interrupção;
- pipeline de voz;
- processamento local na maior parte do fluxo;
- LLM remoto como componente isolado;
- arquitetura explícita de pipeline.

O README descreve a divisão conceitual: Pipecat como cérebro/pipeline e TalkingHead como boca/avatar.

Tecnologias citadas pelo projeto:
Pipecat, TalkingHead, Kokoro TTS, Whisper, Silero VAD, three.js, Hindsight e OpenAI.

Fonte:
https://github.com/xanguera/aicompanion

## 3.2 Avatar — conversação em tempo real com MuseTalk

Repositório:
https://github.com/sarangKP/Avatar

Sistema de avatar conversacional em tempo real que combina LLM, Kokoro TTS e MuseTalk. O pipeline indicado é:

Usuário → LLM → Kokoro TTS → Whisper features → MuseTalk → navegador

Pontos relevantes:
- streaming;
- geração por sentença;
- TTS e renderização em paralelo;
- áudio e vídeo sincronizados;
- browser como interface;
- possibilidade de Ollama como backend local de LLM;
- avatar baseado em imagem.

Fonte:
https://github.com/sarangKP/Avatar

## 3.3 AvatarAI — foto + voz + conversa em tempo real

Repositório:
https://github.com/PunithVT/ai-avatar-system

Projeto open-source que propõe:

microfone → Whisper STT → LLM → TTS → MuseTalk → vídeo

Pontos relevantes:
- upload de foto;
- clonagem de voz;
- conversa em tempo real;
- lip-sync;
- múltiplos LLMs;
- execução local ou em nuvem;
- streaming por WebSocket;
- autenticação;
- sessões persistentes;
- histórico de conversas;
- detecção de emoção;
- armazenamento local opcional;
- fallback de TTS.

Fonte:
https://github.com/PunithVT/ai-avatar-system

## 3.4 Fork do AvatarAI — material clonado

Repositório:
https://github.com/ussleo/myAvatarAIsystem

É explicitamente um fork do projeto AvatarAI.

Regra aplicada: não descartado por ser clone/fork. Deve permanecer como referência porque alterações em um fork podem conter soluções, ajustes, documentação ou ideias diferentes da origem.

Fonte:
https://github.com/ussleo/myAvatarAIsystem

## 3.5 AvatarAI — outra implementação do mesmo conceito

Repositório:
https://github.com/paulravindraai/ai-avatar-system

Apresenta uma arquitetura semelhante, mas com elementos adicionais descritos no README:
- Claude/GPT/Ollama/vLLM/LM Studio;
- Chatterbox para clonagem de voz;
- Whisper/faster-whisper;
- MuseTalk V1.5;
- streaming de tokens;
- vídeo por sentença via WebSocket;
- barge-in;
- detecção de emoção;
- 23 idiomas;
- armazenamento local;
- JWT e sessões;
- observabilidade.

É especialmente relevante para estudar como uma arquitetura modular pode juntar conversação, voz, avatar e sessões persistentes.

Fonte:
https://github.com/paulravindraai/ai-avatar-system

## 3.6 Real-Time Conversational AI Avatar — Gemini + WebRTC + SyncTalk

Repositório:
https://github.com/sahilaf/Real-Time-Conversational-AI-Avatar

Pipeline descrito:

Frontend ↔ Agent (Gemini + LiveKit) ↔ SyncTalk_2D

O usuário fala pelo navegador, o agente processa a conversa, o áudio é enviado ao servidor do avatar e o vídeo com lip-sync volta pelo LiveKit.

Pontos relevantes:
- Gemini;
- LiveKit;
- WebRTC;
- SyncTalk_2D;
- vídeo e áudio sincronizados;
- arquitetura separada entre agente e renderer/avatar;
- navegador como cliente.

Fonte:
https://github.com/sahilaf/Real-Time-Conversational-AI-Avatar

## 3.7 AI Avatar — Ollama + TalkingHead + WebRTC

Repositório:
https://github.com/hikaneko/ai-avatar

Projeto de avatar conversacional em GPU server.

Pontos relevantes:
- WebRTC;
- LiveKit;
- Silero VAD;
- faster-whisper;
- Ollama;
- Gemini para respostas longas;
- Kokoro TTS;
- TalkingHead;
- avatar 3D GLB;
- blendshapes/visemes para lip-sync;
- possibilidade de usar avatar exportado pelo Avaturn.

Esse projeto é particularmente interessante para nosso estudo porque mostra uma combinação de **Ollama + avatar 3D + voz + WebRTC**.

Fonte:
https://github.com/hikaneko/ai-avatar

## 3.8 CyberVerse — agente digital com chamada de vídeo

Repositório:
https://github.com/dsd2077/CyberVerse

Projeto de plataforma de agente humano digital com chamadas de vídeo em tempo real.

Pontos relevantes:
- personagem configurável;
- múltiplas imagens de referência;
- imagem ativa/fixa/aleatória;
- voz;
- personalidade;
- mensagem de boas-vindas;
- system prompt;
- avatar baseado em plugins;
- WebRTC;
- LiveKit;
- módulos plugáveis de avatar, modelo multimodal, LLM, TTS e ASR;
- histórico por personagem;
- clonagem de voz;
- entrada por texto e voz;
- interrupção da fala;
- pausa e retomada de sessão.

Este é um dos projetos mais próximos conceitualmente da arquitetura que estamos construindo.

Fonte:
https://github.com/dsd2077/CyberVerse

## 3.9 Linly-Talker

Repositório:
https://github.com/ch1ckenk/Linly-Talker

Sistema de diálogo com humano digital que integra ASR, TTS, LLM e múltiplas tecnologias de avatar.

Pontos relevantes:
- conversa multimodal;
- imagens de personagem;
- conversa multi-turno;
- memória/contexto de diálogo;
- clonagem de voz;
- Whisper/FunASR;
- Edge TTS;
- GPT-SoVITS;
- Qwen;
- Gemini-Pro;
- SadTalker;
- Wav2Lip;
- ER-NeRF;
- MuseTalk;
- múltiplos modelos selecionáveis.

A versão atual também aponta para Linly-Talker-Stream, arquitetura WebRTC com conversa full-duplex e interrupção natural.

Fonte:
https://github.com/ch1ckenk/Linly-Talker

## 3.10 Linly-Talker-Stream

Repositório localizado:
https://github.com/chenhao324/avatar

A versão Stream adiciona:
- WebRTC;
- streaming de áudio/vídeo;
- baixa latência;
- conversa full-duplex;
- barge-in/interrupção;
- pipeline modular;
- reaproveitamento de ASR/LLM/TTS/avatar.

É uma referência importante para a futura decisão HTTP vs WebSocket/WebRTC do nosso projeto.

Fonte:
https://github.com/chenhao324/avatar

## 3.11 LiveTalking / MetaHuman Stream e variantes

Projetos encontrados:
- https://github.com/eracs/metahuman-stream
- https://github.com/liunix61/LiveTalking4Avatar
- https://github.com/abc-zone/metahuman-LiveTalking
- https://github.com/aimin-git/metahuman-stream

Características recorrentes:
- digital human em tempo real;
- Wav2Lip;
- MuseTalk;
- ER-NeRF;
- Ultralight-Digital-Human;
- clonagem de voz;
- interrupção do avatar enquanto fala;
- WebRTC/RTMP;
- vídeos de movimento quando o avatar não está falando;
- múltiplas conexões;
- streaming de áudio e vídeo.

Não são duplicados idênticos em termos de código, mas pertencem ao mesmo ecossistema de implementação e devem ser tratados como material de referência.

---

# 4. OUTRAS REFERÊNCIAS DE ARQUITETURA DE COMPANION

## 4.1 AI Companion / Riko Project

Repositório:
https://github.com/AiMLESS2k/ai-companion

Pontos relevantes:
- memória de conversa;
- geração de voz;
- reconhecimento de fala;
- configuração de personalidade em YAML;
- prompts armazenados em configuração;
- histórico persistente;
- personalidade configurável sem alterar o código principal.

Isso conversa diretamente com nossas entidades Persona, CharacterMemory, UserMemory e com a ideia de manter personalidade/configuração desacopladas do motor de IA.

Fonte:
https://github.com/AiMLESS2k/ai-companion

## 4.2 AI Agent Digital Human — personalidade + emoção + memória

Repositório:
https://github.com/Haohao-end/AI-Agent-Digital-Human

Pontos relevantes:
- agente com avatar em tempo real;
- voz expressiva;
- WebRTC;
- Azure Speech Avatar;
- controle de estilo de voz por emoção;
- memória de contexto via Redis;
- agente com ferramentas;
- entrada de chat processada por backend.

A arquitetura mostra outra possibilidade de separar emoção detectada, resposta textual e estilo vocal/expressivo.

Fonte:
https://github.com/Haohao-end/AI-Agent-Digital-Human

## 4.3 AIAvatar-Pi — companion de baixa latência

Repositório:
https://github.com/uezo/aiavatar-pi

Pontos relevantes:
- AI companion;
- resposta de voz sub-segundo como objetivo;
- lip-sync;
- piscar automático;
- movimento baseado em vídeo;
- WebSocket;
- arquitetura modular entre áudio, imagem, movimento e controle.

É uma referência principalmente para comportamento visual e baixa latência, mesmo tendo foco em dispositivos edge/Raspberry Pi.

Fonte:
https://github.com/uezo/aiavatar-pi

## 4.4 Digital Human — pipeline de streaming e blendshapes

Repositório:
https://github.com/Kiyoakiiii/digital-human

Pontos relevantes:
- pipeline assíncrono;
- reconhecimento de fala em streaming;
- tokens do LLM em streaming;
- segmentação inteligente de frases;
- TTS paralelo;
- animação facial sincronizada;
- otimização de latência.

Fonte:
https://github.com/Kiyoakiiii/digital-human

---

# 5. TECNOLOGIAS RECORRENTES ENCONTRADAS

A pesquisa revelou um padrão muito consistente entre projetos diferentes.

## Entrada
- Microfone
- Texto
- Imagem/foto
- Vídeo

## Compreensão
- VAD
- Whisper / faster-whisper
- outros ASR

## Inteligência
- LLM remoto
- LLM local
- Ollama
- Gemini
- Claude
- GPT
- Qwen

## Memória
- histórico de conversa
- memória persistente
- extração de fatos
- Redis
- Hindsight
- arquivos locais/JSON

## Voz
- TTS
- Kokoro
- GPT-SoVITS
- Chatterbox
- XTTS
- Edge TTS
- clonagem de voz

## Avatar
- TalkingHead
- MuseTalk
- Wav2Lip
- SadTalker
- ER-NeRF
- SyncTalk_2D
- Ultralight-Digital-Human
- GLB / WebGL / three.js

## Transporte
- HTTP
- WebSocket
- WebRTC
- LiveKit

## Comportamento visual
- lip-sync
- visemes
- blendshapes
- piscar
- expressões
- gestos
- vídeos de idle/movimento
- interrupção/barge-in

---

# 6. PADRÃO ARQUITETURAL QUE APARECE REPETIDAMENTE

A pesquisa não muda nossa arquitetura. Ela apenas mostra que várias implementações independentes chegaram a uma divisão semelhante:

```text
USUÁRIO
   ↓
Texto / Voz
   ↓
ASR / Entrada
   ↓
MEMÓRIA + CONTEXTO
   ↓
LLM / AGENTE
   ↓
RESPOSTA TEXTUAL
   ↓
TTS
   ↓
ÁUDIO + TIMESTAMPS / FONEMAS
   ↓
AVATAR / LIP-SYNC / EXPRESSÕES
   ↓
VÍDEO + ÁUDIO
   ↓
WEB / MOBILE / DESKTOP
```

Isso é uma observação da pesquisa, não uma nova decisão de arquitetura.

---

# 7. RELAÇÃO COM A ARQUITETURA DAS ETAPAS 1–4

Sem alterar as etapas oficiais, os materiais encontrados ajudam a validar áreas que já estavam previstas:

- `Persona` → referências de personagem configurável e personalidade separada.
- `Avatar` → bibliotecas, fotos, vídeos e modelos 2D/3D.
- `Character` → projetos que associam imagem, voz, personalidade e prompt a um personagem.
- `Conversation` → sessões persistentes e conversas multi-turno.
- `Message` → histórico textual e multimodal.
- `UserMemory` → memória persistente e extração de fatos.
- `CharacterMemory` → configuração persistente de personalidade/personagem.
- `Relationship` → conceito de companion e personalização por usuário.
- `ai-gateway` → múltiplos projetos demonstram LLM/TTS/avatar intercambiáveis.
- `vision` → vários sistemas aceitam imagem como entrada.
- `voice` → TTS, ASR e clonagem aparecem como módulos independentes.
- `video` → avatar rendering pode ser separado do agente conversacional.
- WebSocket/WebRTC → aparecem repetidamente nos sistemas de baixa latência.

Nada disso deve ser incorporado automaticamente ao código. É material de comparação.

---

# 8. PONTOS QUE MERECEM ANÁLISE POSTERIOR

Não são decisões. São perguntas que os materiais levantaram e que poderão alimentar futuras decisões:

1. Avatar 2D ou 3D para a primeira versão?
2. Avatar baseado em imagem/vídeo ou avatar 3D com GLB/blendshapes?
3. Lip-sync gerado por vídeo (MuseTalk/Wav2Lip) ou por visemes/blendshapes (TalkingHead)?
4. Voz local, cloud ou híbrida?
5. WebSocket ou WebRTC para conversa de voz/vídeo?
6. Barge-in desde a primeira versão ou depois?
7. Memória local, banco próprio, Hindsight/Redis ou combinação?
8. Como separar identidade do personagem, voz, avatar, personalidade e histórico?
9. Como manter consistência visual do avatar?
10. Como tratar estados de idle, falando, ouvindo, pensando e interrompido?
11. Como fazer fallback quando geração de vídeo/voz estiver indisponível?
12. Como manter o LLM substituível sem alterar o avatar?
13. Como manter o avatar substituível sem alterar a conversa?
14. Como transportar o mesmo personagem entre mobile, web e desktop?

---

# 9. REGRA DE USO DESTE MATERIAL

Este documento é uma biblioteca de referências, não uma lista de tecnologias obrigatórias.

Nenhum projeto será descartado por:
- ser fork;
- ser clone;
- ser uma implementação alternativa;
- não resolver o projeto inteiro;
- usar outra linguagem;
- usar outra plataforma;
- não ser executável no computador atual;
- parecer pequeno ou incompleto.

O material poderá fornecer apenas um retalho: uma ideia de interface, um método de memória, uma forma de sincronizar boca e voz, um padrão de WebRTC, uma organização de personalidade, um fallback, um modelo de dados, um comportamento de avatar ou uma solução de baixa latência.

A decisão de descarte ocorrerá somente depois da análise.

---

# 10. LINKS PRINCIPAIS PARA CONSULTA

CapCut — Avatar:
https://www.capcut.com/pt-br/create/ai-avatar

CapCut — Character Generator:
https://www.capcut.com/pt-br/tools/ai-character-generators

CapCut — Lip Sync:
https://www.capcut.com/pt-br/tools/lip-sync

Pippit — Talking Avatar:
https://www.pippit.ai/pt-br/tools/talking-avatar

Pippit — Avatars & Voice:
https://www.pippit.ai/pt-br/tools/ai-avatars-and-voice

OpenCut:
https://github.com/OpenCut-app/OpenCut

AI Companion:
https://github.com/xanguera/aicompanion

Avatar / MuseTalk:
https://github.com/sarangKP/Avatar

AvatarAI:
https://github.com/PunithVT/ai-avatar-system

CyberVerse:
https://github.com/dsd2077/CyberVerse

Linly-Talker:
https://github.com/ch1ckenk/Linly-Talker

Linly-Talker-Stream:
https://github.com/chenhao324/avatar

LiveTalking:
https://github.com/liunix61/LiveTalking4Avatar

AI Avatar + Ollama:
https://github.com/hikaneko/ai-avatar

AI Companion / Riko:
https://github.com/AiMLESS2k/ai-companion

AI Agent Digital Human:
https://github.com/Haohao-end/AI-Agent-Digital-Human

Digital Human streaming:
https://github.com/Kiyoakiiii/digital-human

AIAvatar-Pi:
https://github.com/uezo/aiavatar-pi

Real-Time Conversational AI Avatar:
https://github.com/sahilaf/Real-Time-Conversational-AI-Avatar

---

## STATUS

Pesquisa registrada no repositório como material de referência.

Nenhuma decisão de arquitetura foi alterada.
Nenhum projeto foi descartado por ser clone/fork.
Nenhum código de terceiros foi incorporado ao projeto.
As referências devem ser analisadas individualmente antes de qualquer adoção.
