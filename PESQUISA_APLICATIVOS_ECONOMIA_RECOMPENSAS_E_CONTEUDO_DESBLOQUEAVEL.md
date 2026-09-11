# Pesquisa — Economia, recompensas e conteúdo desbloqueável

## Observações para o Chatbot Namorado Virtual

### 1. Recompensas e moeda interna
- Considerar uma moeda/crédito interno para quantificar recompensas e consumo.
- Prever bônus diário/24h e tarefas simples como formas de obtenção gratuita.
- A moeda/crédito poderá ser utilizada em conversa e em recursos multimídia, conforme regras que serão definidas.
- A implementação deve permitir alterar valores e custos sem reconstruir o aplicativo.

### 2. Consumo de conversa
- Preferência atual do projeto: controlar o consumo da conversa por quantidade de caracteres, em vez de tempo de permanência na conversa.
- A razão é evitar que usuários com ritmos diferentes de interação sejam prejudicados por um limite baseado simplesmente em tempo.
- A unidade exata (caracteres, tokens ou outra medida técnica equivalente) deverá ser definida na implementação, preservando a regra de consumo por quantidade de conteúdo.

### 3. Conteúdo visual progressivo
Foi observado em aplicativos semelhantes que o conteúdo visual do personagem pode ser desbloqueado gradualmente conforme a interação do usuário.

Possibilidades observadas:
- foto de perfil liberada inicialmente;
- uma ou mais fotos adicionais bloqueadas;
- fotos adicionais liberadas após determinada progressão de conversa/interação;
- possibilidade de desbloqueio por moeda/créditos ou compra;
- alguns personagens possuem poucas imagens, outros possuem mais;
- vídeos curtos não são obrigatórios para todos os personagens;
- quando existem vídeos, normalmente são poucos;
- a quantidade de fotos e vídeos pode variar de personagem para personagem.

A regra desejada para o projeto não deve obrigar todos os personagens a terem a mesma quantidade de mídia.

### 4. Vídeos curtos
- Alguns personagens poderão possuir vídeos curtos.
- A existência e a quantidade de vídeos será variável por personagem.
- O conteúdo poderá ser desbloqueado progressivamente e/ou mediante moeda interna ou compra, conforme regras futuras.
- A arquitetura deve permitir personagens sem vídeo, com um vídeo ou com múltiplos vídeos.

### 5. Avatar criado pelo usuário
- O usuário poderá gerar um avatar dentro do aplicativo.
- Esse avatar gerado não deve automaticamente ser considerado um personagem individual permanente.
- Poderá existir uma opção de aquisição para torná-lo individual, conforme plano/regras do produto.
- Caso não seja adquirido, deverá ser possível disponibilizar o avatar para utilização pelo próprio aplicativo, conforme regras que serão definidas.

### 6. Roupas e personalização visual
- Alguns recursos de troca de roupa/aparência poderão consumir moeda/créditos ou estar vinculados a compra/plano.
- A arquitetura deve permitir acrescentar esse tipo de conteúdo sem reconstruir o núcleo do aplicativo.

### 7. Planos
- Deve existir estrutura preparada para plano gratuito e planos pagos.
- Recursos e limites podem variar conforme o plano.
- Publicidade em plano gratuito foi observada em outros aplicativos, mas NÃO faz parte da implementação imediata e deve permanecer fora do escopo atual.

## Princípio de implementação
Essas funcionalidades fazem parte do produto que queremos testar e, portanto, não devem ser tratadas como ideias para uma versão futura apenas. A primeira construção completa deverá possuir a estrutura funcional necessária para testá-las, mesmo que valores, nomes da moeda, preços, quantidades e alguns gatilhos sejam provisórios.

O objetivo é testar o produto completo e depois decidir o que permanece, o que é ajustado e o que é substituído.

## Referência externa — exemplos observados
Exemplos pesquisados para estudo de mecanismos de recompensa/consumo:
- MadeYu — créditos/login diário e conteúdo visual/geração de imagem e vídeo.
- Fotor — sistema de créditos e recompensas/check-in.
- PixAI — sistema de missões e recompensas.
- AI Girlfriend 2 — Stars, check-in, recompensas e uso em recursos de relacionamento/mídia.

Esses exemplos são referências de análise de produto, não requisitos para copiar funcionalidades ou interfaces.
