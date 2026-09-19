# Enrosco — Pesquisa e Checklist de Modelos para Animação de Personagens

> Documento de trabalho consolidado a partir das pesquisas realizadas na conversa.
>
> **Objetivo:** escolher uma solução local para transformar uma imagem de personagem em um vídeo curto, adequada ao notebook disponível, evitando downloads e instalações desnecessárias.
>
> **Importante:** os tempos de geração citados neste documento são estimativas trazidas pelas pesquisas, não benchmarks realizados neste notebook. Quando houve conflito entre fontes, o conflito é mantido em vez de tratado como fato.

---

## 1. Hardware de referência

- Dell Inspiron
- CPU: Intel Core i5-5200U, 2,20 GHz
- RAM: 16 GB
- Sistema: Windows 10 64-bit
- GPU: NVIDIA GeForce 920M
- VRAM: 2 GB DDR3
- CUDA Cores: 384
- Compute Capability: 3.5
- Driver NVIDIA: 425.45
- CUDA reportado pelo `nvidia-smi`: 10.1

### Estratégia de hardware

Para os modelos de vídeo, a orientação de trabalho é considerar a máquina **CPU-first**. A GeForce 920M/Compute Capability 3.5 é uma limitação importante para frameworks modernos.

### Meta do projeto

- Entrada principal: imagem do personagem
- Vídeo desejado: aproximadamente 5–10 segundos
- Limite aceitável: até 15 segundos
- Resolução alta não é prioridade
- Funcionamento é mais importante que velocidade
- Geração lenta é aceitável se o resultado for funcional
- Não é necessário tempo real
- Objetivo inicial: movimento de cabeça, olhos, expressões e pequenos movimentos
- Futuramente: áudio, fala e lip-sync

---

# 2. O que já temos

## FastSDCPU

Já foi validado localmente.

### Localização

`F:\FastSDCPU\fastsdcpu-1.0.0-beta.510`

### Modelo SD1.5 existente

`F:\stable-diffusion-webui-master\models\Stable-diffusion\v1-5-pruned-emaonly.safetensors`

Tamanho aproximado: 4,27 GB.

### LCM-LoRA existente

`C:\Users\nel_j\.cache\huggingface\hub\models--latent-consistency--lcm-lora-sdv1-5\snapshots\cf2fced511dbe7e26c8d1d397e728fbab875db4b\pytorch_lora_weights.safetensors`

Tamanho aproximado: 135 MB.

### Resultado validado

O FastSDCPU conseguiu gerar uma imagem localmente usando SD1.5 + LCM-LoRA em aproximadamente 5 minutos.

**Conclusão:** a parte de geração de imagem local está funcional. O próximo problema é animação/vídeo.

---

# 3. Resumo dos candidatos pesquisados

Foram considerados principalmente:

1. FOMM
2. TPSMM
3. Wav2Lip
4. SadTalker
5. LivePortrait
6. Modelos modernos de vídeo por difusão

A pesquisa convergiu para a ideia de não tentar instalar vários modelos ao mesmo tempo.

A ordem de investigação deve ser decidida somente depois de revisar as informações abaixo.

---

# BLOCO — FOMM
## First Order Motion Model

### O que faz

Recebe uma imagem estática e um vídeo de movimento ("driving video") e transfere o movimento para a imagem.

Fluxo:

`imagem do personagem + vídeo de movimento → personagem animado`

Pode produzir movimentos de cabeça, rosto e outras deformações conforme o vídeo de referência.

### Por que foi considerado

É um dos modelos clássicos para animar uma imagem usando um vídeo de movimento e foi citado como uma alternativa relativamente leve.

### Repositório citado na pesquisa

`AliaksandrSiarohin/first-order-model`

### Serve para nosso notebook?

**Possível, mas com ressalvas.**

A pesquisa apontou que FOMM pode funcionar em CPU, porém a implementação oficial possui problemas documentados relacionados à execução CPU, inclusive erros envolvendo CUDA.

### Conflito importante entre pesquisas

Uma fonte indicou FOMM como candidato inicial por ser antigo e relativamente leve.

Outra análise, do Claude Haiku 4.5, considerou FOMM inadequado para esta máquina e apontou dependência prática de GPU/CUDA.

Portanto:

**FOMM não deve ser instalado antes de uma verificação específica da versão/repositório e do caminho CPU.**

### Requisitos citados

- Python aproximadamente 3.7/3.8 em algumas instalações
- PyTorch 1.x
- Configuração `vox-256.yaml`
- Checkpoint facial:
  - `vox-cpk.pth.tar` — aproximadamente 729 MB
- Alternativa:
  - `vox-adv-cpk.pth.tar` — aproximadamente 716–751 MB
- `taichi-cpk.pth.tar` é voltado para corpo e não é prioridade para o caso facial.

### RAM

Uma implementação relacionada documentou aproximadamente 2,4 GB de RAM em CPU para um caso específico.

Isso não constitui benchmark do nosso notebook.

### Resolução

Normalmente 256×256.

### Tempo

Não existe benchmark confiável encontrado para o i5-5200U.

Uma fonte indicou que vídeos de alguns minutos podem levar horas em CPU; para 5–10 segundos, a expectativa seria de minutos, mas isso é extrapolação.

### Status

⬜ Não instalado  
⬜ Não testado  
⚠️ Precisa confirmar caminho CPU/Windows antes de qualquer download

---

# BLOCO — TPSMM
## Thin-Plate Spline Motion Model

### O que faz

Também transfere movimento de um vídeo de referência para uma imagem estática.

Fluxo:

`imagem do personagem + vídeo de movimento → animação`

É uma evolução relacionada ao FOMM.

### Repositório principal citado

`yoyo-nb/Thin-Plate-Spline-Motion-Model`

### Caminho ONNX citado

`instant-high/Thin-plate-spline-motion-model-ONNX`

Esse fork foi citado como uma alternativa para execução CPU usando ONNX Runtime.

### Serve para nosso notebook?

**Tecnicamente possível, mas com risco e desempenho potencialmente baixo.**

A execução ONNX elimina a dependência de PyTorch durante a inferência, mas não transforma o modelo em algo rápido.

### Requisitos citados

- Modelo facial baseado em VoxCeleb
- Resolução típica: 256×256
- ONNX Runtime CPU no caminho proposto
- 16 GB RAM considerados suficientes pela pesquisa

### Tempo

Uma análise estimou aproximadamente:

- 5 segundos: 15–60 minutos
- 10 segundos: 30–120 minutos

Outra análise foi mais pessimista e mencionou aproximadamente 20–60+ segundos por frame em CPU em determinados cenários.

**Nenhum desses números é benchmark do i5-5200U.**

### Riscos

- Fork de terceiros
- Possível falta de manutenção
- Problemas de conversão para ONNX
- Diferenças de pré-processamento
- Operadores ONNX incompatíveis
- Artefatos
- Instalação mais trabalhosa

### Status

⬜ Não instalado  
⬜ Não testado  
⚠️ Candidato técnico, mas não deve ser baixado sem confirmar a versão ONNX e os arquivos exatos

---

# BLOCO — WAV2LIP
## Lip-sync

### O que faz

Sincroniza movimentos da boca com um áudio.

Fluxo:

`vídeo existente + áudio → vídeo com boca sincronizada`

### O que NÃO faz

Não é um animador completo de imagem estática.

Ele não resolve sozinho:

`imagem parada → cabeça/olhos/corpo se movimentando`

### Repositório citado

`Rudrabha/Wav2Lip`

### Por que é importante

Pode ser usado posteriormente como complemento de outro sistema.

Exemplo:

`imagem → animação facial → vídeo base → Wav2Lip + áudio`

### CPU

A pesquisa indicou que CPU-only é possível.

Também foi mencionada uma conversão para OpenVINO, potencialmente interessante para CPU Intel.

### Requisitos citados

- Python aproximadamente 3.7–3.10
- PyTorch CPU
- Footprint aproximado: 600 MB–1 GB em uma instalação citada
- RAM: relatos acima de 2 GB

### Tempo

Uma fonte citou teste de detecção facial em CPU de aproximadamente 60 segundos para 10 segundos de vídeo, mas isso não representa necessariamente o tempo total no nosso notebook.

Outra estimativa para 5 segundos em 512×512 ficou na faixa de 15–45 minutos.

**Não é benchmark do i5-5200U.**

### Status

⬜ Não instalado  
⬜ Não testado  
🟡 Mais adequado como complemento para fala/lip-sync

---

# BLOCO — SADTALKER
## Talking Head a partir de imagem + áudio

### O que faz

Recebe uma imagem e um áudio e gera um vídeo de uma pessoa/personagem falando.

Fluxo:

`imagem + áudio → vídeo de talking head`

Pode produzir movimento de cabeça e expressões sincronizadas com fala.

### Repositório oficial citado

`OpenTalker/SadTalker`

### Por que foi considerado

É mais próximo do objetivo futuro do Enrosco:

`personagem + fala → personagem falando`

Pode reduzir a necessidade de montar manualmente uma cadeia de animação + lip-sync.

### Serve para nosso notebook?

**Tecnicamente possível em CPU, mas provavelmente lento.**

É necessário tratar a 920M como praticamente irrelevante para a execução moderna e planejar CPU.

### Requisitos citados

- Windows 10 possível
- Python aproximadamente 3.8–3.10
- PyTorch CPU-only
- NumPy
- OpenCV
- SciPy
- scikit-image
- imageio / imageio-ffmpeg
- outras dependências conforme a versão
- modelos de detecção/alinhamento facial

A lista definitiva deve ser obtida da versão oficial escolhida antes da instalação.

### Modelos

A pesquisa indicou que são necessários os checkpoints principais do SadTalker e modelos de detecção/alinhamento facial.

Os nomes exatos e a quantidade devem ser confirmados na versão oficial antes do download.

### O que NÃO baixar inicialmente

- GFPGAN
- RestoreFormer
- enhancers
- integrações WebUI
- recursos opcionais

### Espaço

Estimativa levantada:

- código + ambiente: aproximadamente 1–2 GB
- checkpoints: aproximadamente 0,8–2 GB
- total inicial: aproximadamente 2–4 GB
- reserva recomendada: 4–6 GB

Esses valores são estimativas, não medição local.

### RAM

Uma fonte estimou aproximadamente 10–12 GB de RAM.

Isso colocaria o modelo dentro dos 16 GB disponíveis, porém com pouca margem.

### Tempo

Estimativas encontradas:

- 5 segundos: aproximadamente 40 min–2 h
- 10 segundos: aproximadamente 1–4 h

Outra análise foi mais pessimista:

- 5 segundos: aproximadamente 120–180 min
- risco de OOM em 16 GB

**Nenhum desses valores é benchmark do i5-5200U.**

### Configuração inicial recomendada pela pesquisa

- 5 segundos
- resolução ≤512×512
- CPU
- sem enhancer
- sem batch
- áudio curto
- primeiro teste simples

### Status

⬜ Não instalado  
⬜ Não testado  
🟡 Candidato importante para investigação  
⚠️ Precisa validar instalação CPU e tamanho real dos checkpoints antes de baixar

---

# BLOCO — LIVEPORTRAIT

### O que faz

Anima retratos e permite controle de movimento facial/cabeça.

### Pesquisa realizada

Foi citado como alternativa moderna para animação de retratos.

### Problema para nosso hardware

As análises recebidas consideraram a solução menos adequada para este notebook, principalmente por depender de tecnologias/modelos modernos mais pesados.

### Status

⬜ Não instalado  
🔴 Baixa prioridade para o hardware atual

---

# BLOCO — MODELOS MODERNOS DE VÍDEO POR DIFUSÃO

Exemplos citados durante a pesquisa:

- Stable Video Diffusion
- AnimateDiff
- Wan
- CogVideoX
- LTXV

### Problema

Esses modelos são significativamente mais pesados para o hardware disponível.

O notebook possui apenas 2 GB de VRAM e uma GPU antiga com Compute Capability 3.5.

Mesmo com CPU/offload, a expectativa é de desempenho muito ruim e instalação mais complexa.

### Status

⬜ Não testar neste momento  
🔴 Fora do foco para o hardware atual

---

# 4. Comparação qualitativa

| Modelo | Entrada | Movimento geral | Fala/lip-sync | CPU possível | Complexidade | Situação |
|---|---|---|---|---|---|---|
| FOMM | imagem + vídeo | Sim | Não diretamente | ⚠️ | Média | Verificar CPU |
| TPSMM | imagem + vídeo | Sim | Não diretamente | Sim via ONNX | Alta | Verificar fork |
| Wav2Lip | vídeo + áudio | Não | Sim | Sim | Média | Complemento |
| SadTalker | imagem + áudio | Sim | Sim | Sim, lento | Média/Alta | Investigar |
| LivePortrait | imagem + controle | Sim | Parcialmente | ⚠️ | Alta | Baixa prioridade |
| Vídeo por difusão | imagem/texto | Sim | Variável | ⚠️ Muito pesado | Muito alta | Evitar |

---

# 5. Conclusões importantes da pesquisa

## O que parece consenso

1. A GeForce 920M não deve ser considerada a base da solução.
2. CPU-only é a estratégia mais segura para o notebook.
3. Não precisamos de vídeo em tempo real.
4. 5–10 segundos são suficientes para o primeiro teste.
5. Resolução 256×256 ou semelhante pode ser aceitável.
6. Não devemos instalar enhancers ou recursos extras no primeiro teste.
7. Wav2Lip sozinho não resolve animação de uma imagem parada.
8. Modelos modernos de vídeo por difusão são pouco adequados ao hardware.

## O que continua incerto

1. Tempo real de geração no i5-5200U.
2. Consumo real de RAM de cada solução.
3. Compatibilidade exata das versões atuais com Windows 10.
4. Qual versão de PyTorch funciona sem conflitos.
5. Quais checkpoints são realmente mínimos na versão escolhida.
6. Se FOMM CPU funciona de forma confiável no ambiente atual.
7. Se o fork ONNX do TPSMM funciona sem adaptações.

---

# 6. Regra de instalação do projeto

**Não instalar vários modelos em paralelo.**

Cada candidato terá seu próprio bloco.

Para cada bloco:

- ⬜ não iniciado
- 🟡 em andamento
- ✅ funcionando
- ❌ descartado

E sempre registrar:

### O que faz
### Por que estamos testando
### Compatibilidade com o notebook
### O que já temos
### O que falta
### Onde pegar
### Tamanho
### Onde instalar
### Comando exato
### Teste
### Resultado esperado
### Resultado obtido
### Status

---

# 7. Regra de segurança contra confusão

Antes de qualquer download:

1. Confirmar repositório.
2. Confirmar versão/commit.
3. Confirmar Python.
4. Confirmar PyTorch.
5. Confirmar dependências.
6. Confirmar exatamente quais modelos são necessários.
7. Confirmar tamanho aproximado.
8. Confirmar local de instalação.
9. Só então baixar.

**Não baixar modelos “por garantia”.**

---

# 8. Estado atual do projeto

## Imagens

✅ FastSDCPU funcionando  
✅ SD1.5 local disponível  
✅ LCM-LoRA disponível  
✅ Imagem de teste gerada localmente

## Vídeo

⬜ Nenhum modelo de vídeo instalado  
⬜ Nenhum checkpoint de vídeo baixado  
⬜ Nenhum ambiente SadTalker criado  
⬜ Nenhum FOMM testado  
⬜ Nenhum TPSMM testado  
⬜ Nenhum Wav2Lip testado

## Próxima atividade

**Não começar instalação imediatamente.**

Primeiro revisar a pesquisa consolidada e decidir qual candidato merece o primeiro teste.

Quando o teste começar, trabalhar **um bloco por vez**, registrando cada caminho, arquivo, comando e resultado neste documento.
