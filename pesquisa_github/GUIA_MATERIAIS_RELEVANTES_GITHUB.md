# GUIA — MATERIAIS RELEVANTES ENCONTRADOS NO GITHUB

Projeto: Chatbot Namorado Virtual
Objetivo: preservar referências externas relevantes para futura auditoria e integração. Este arquivo não substitui as Etapas 1–4 e não incorpora código de terceiros.

## 1. MEMÓRIA DE AGENTES — mem0
Fonte: https://github.com/mem0ai/mem0/blob/19cb89aff472325c707f64b2f34ae6afdbf7faf7/mem0/configs/prompts.py
Arquivo: mem0/configs/prompts.py

Relevante porque apresenta extração separada de memória do usuário e do agente, fatos pequenos e recuperáveis, preferências/dados importantes, saída estruturada, e operações de ADD/UPDATE/DELETE/NONE para manter memória sem duplicações e contradições.

Aplicação possível: referência para UserMemory, CharacterMemory e atualização de memórias. Não adotar os prompts literalmente.

## 2. MEMÓRIA LOCAL + PERFIL — Hermes Desktop
Fonte: https://github.com/fathah/hermes-desktop/blob/main/src/main/memory.ts
Arquivo: src/main/memory.ts

Relevante porque implementa separação entre memória geral e perfil do usuário, leitura/escrita segura, adicionar/atualizar/remover entradas, limites de caracteres, estatísticas e sincronização controlada.

Aplicação possível: referência para limites e ciclo de vida da memória. Não substitui o modelo relacional definido na Etapa 3.

## 3. DESIGN DE COMPANION — Tabby / Claude Code Agent Monitor
Fonte: https://github.com/hoangsonww/Claude-Code-Agent-Monitor/blob/main/docs/superpowers/specs/2026-05-28-tabby-companion-design.md
Arquivo: docs/superpowers/specs/2026-05-28-tabby-companion-design.md

Relevante porque separa avatar visual, cérebro/comportamento e apresentação; usa estados de humor derivados de eventos; mantém personalidade separada da renderização; e usa componentes visuais alimentados por estado. Também aborda acessibilidade e redução de movimento.

Aplicação possível: referência para futura camada de comportamento do avatar e reação a eventos.

## 4. AI COMPANION COM VOZ, PERSONALIDADE E MEMÓRIA — TerminalSkills
Fonte: https://github.com/TerminalSkills/skills/blob/main/use-cases/build-ai-companion-with-voice.md
Arquivo: use-cases/build-ai-companion-with-voice.md

Relevante porque organiza o companion em entrada → recuperação de memória → personalidade/contexto → resposta → atualização de memória, e trata personalidade, memória persistente, janela recente de conversa e multimodalidade como componentes distintos.

Aplicação possível: referência para validar a combinação histórico recente + memória + personalidade antes do ai-gateway e, futuramente, voz/multimodalidade.

## 5. CRITÉRIO DE USO
Estas referências foram selecionadas por acrescentarem material diretamente relacionado a: memória persistente, personalidade/persona, comportamento de avatar, contexto conversacional, orquestração de IA e voz/multimodalidade.

São MATERIAL DE PESQUISA. Antes de qualquer incorporação prática, verificar licença, compatibilidade com as Etapas 1–4 e necessidade real. Ideias podem ser adaptadas; código de terceiros não deve ser incorporado automaticamente.

## 6. REGRA PARA NOVOS MATERIAIS
Novos materiais públicos só devem entrar nesta pasta quando tiverem relação clara com arquitetura de AI companion, personalidade/persona, comportamento de avatar, memória, contexto conversacional, ai-gateway/orquestração, voz/visão/multimodalidade ou segurança/privacidade relevante.

Materiais sem valor técnico direto serão descartados para evitar transformar o repositório em depósito de código.
