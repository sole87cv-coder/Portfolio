# Portfólio — Sol Emanuel Calderón Vargas

Portfólio com uma página estática de rolagem por idioma: PT-BR em `Portfolio/wwwroot/index.html`, ES em `es/index.html`, EN em `en/index.html` e FR em `fr/index.html`. A leitura segue **Início → Trabalho → Pesquisa → Sobre → Contato**, com os mesmos registros, fatos, IDs e recursos em todas as versões. Textos, fichas, serviços publicados, links e galerias estão no HTML; JavaScript acrescenta interação, não monta nem traduz o conteúdo editorial.

Implementação e demonstração verificadas localmente em Chrome/Playwright; resultados e limitações estão abaixo. A galeria VIVITAR abre no topo, sem duplicar fotos, junto de uma área explícita para experimentar os cinco shaders com mouse, toque, teclado e sensores opcionais. **Opção A escolhida:** o fundo generativo permanece nas margens e as folhas protegem a leitura. Não houve commit, push, deploy ou configuração de domínio.

## Abrir localmente

- Abra `Portfolio/wwwroot/index.html` diretamente para conferir a leitura. Recursos como copiar Pix dependem das condições de segurança do navegador.
- Para servir os mesmos arquivos por HTTP, execute `python -m http.server 8123 --directory Portfolio/wwwroot` na raiz do repositório e abra `http://127.0.0.1:8123/index.html`, se Python já estiver disponível.
- Alternativa local: com o SDK .NET 10 instalado, execute `.\dev-serve.ps1` ou inicie `Portfolio` pelo Visual Studio. O perfil usa `http://localhost:5173` e o projeto tem `TargetFramework` `net10.0`.
- ASP.NET Core serve `wwwroot` apenas no desenvolvimento local; **não participa do deploy estático**.

## Estrutura e fonte de conteúdo

| Arquivo/pasta | Responsabilidade |
| --- | --- |
| `Portfolio/wwwroot/index.html` | Fonte editorial PT-BR: apresentação, trabalhos, pesquisa, formação, contatos, apoio, serviços, links e imagens. |
| `Portfolio/wwwroot/es/index.html`, `en/index.html`, `fr/index.html` | Versões editoriais completas em espanhol, inglês e francês, com os mesmos fatos e IDs. |
| `Portfolio/wwwroot/css/style.css` | Papel, tipografia, cores do sistema, responsividade e composição do canvas. |
| `Portfolio/wwwroot/js/app.js` | Âncoras, registros, pintura, Ambiente, ampliação, Pix, idioma e sensores opt-in da demonstração. |
| `Portfolio/wwwroot/js/shader.js` | Cinco linguagens generativas, manchas, WebGL, alternativa Canvas2D e diagnóstico. |
| `Portfolio/wwwroot/js/audio.js` | Sons 8-bit dos logotipos e feedback breve de menus, chamadas, registros e Ambiente, após acionamento. |
| `Portfolio/wwwroot/js/projects.js` | Contrato de referência dos sete serviços; não deve guardar uma segunda cópia do portfólio. |
| `Portfolio/wwwroot/img/` e `img/responsive/` | Imagens originais e variantes existentes, declaradas explicitamente no HTML. |
| `Portfolio/wwwroot/fonts/chickscratch-aoe.ttf` | Fonte local dos títulos; comprovação da licença de redistribuição pendente (D6). |
| `Portfolio/Program.cs`, `Portfolio/Portfolio.csproj`, `dev-serve.ps1` | Servidor local opcional. |
| `vercel.json` | Configuração existente de publicação estática. |
| `CORRECOES-MANUAIS.txt` | Guia prático de edição para o artista. |

### Contrato de serviços

`projects.js` contém somente `window.SERVICES`, com **sete objetos**, cada um com `id`, `label`, `line` e `status`. Não é um mecanismo de renderização: `app.js` não lê essa lista para construir a página. Os cinco serviços `OK` são escritos manualmente em `#servicos`, dentro de Contato; os dois `CONFIRMAR` ficam fora da página.

| Serviço | Estado | Âncora publicada |
| --- | --- | --- |
| Video mapping e projeção | `OK` | `service-video-mapping` |
| Imagem ao vivo (VJ) | `CONFIRMAR` | Não publicada |
| Videomaker | `OK` | `service-videomaker` |
| Fotografia (book, ensaio, eventos) | `CONFIRMAR` | Não publicada |
| Cenografia e iluminação | `OK` | `service-cenografia-iluminacao` |
| Oficinas | `OK` | `service-oficinas` |
| Aplicativos interativos | `OK` | `service-apps-interativos` |

A lista de serviços é a única referência auxiliar em JavaScript. Descrições de trabalhos, biografia, fichas e legendas não devem ser duplicadas nela; a fonte editorial continua no HTML.

## Leitura e navegação efetivas

- O cabeçalho contém sete controles: S0LE (retorna a Início), Trabalho, Pesquisa, Sobre, Contato, idioma e Ambiente. Em larguras **até 480 px**, JavaScript move o mesmo seletor de idioma para o rodapé, sem duplicá-lo.
- Cada trabalho usa `<details>` e `<summary>` nativos; as fichas usam `<dl>`, `<dt>` e `<dd>`. Abrir e fechar registros não exige JavaScript.
- Links internos usam `#id`. Com JavaScript, o destino e seus `<details>` ancestrais são abertos, a página rola e o foco acompanha o acionamento. A rolagem identifica a seção ativa, atualiza o destaque do cabeçalho e pode substituir a âncora da seção no histórico. Links para registros internos permanecem utilizáveis.
- Os **20 IDs editoriais preservados** são: `mestrado`, `pesquisa-arte-interativa`, `masp`, `v1su4rt`, `licenciatura`, `bogota`, `sucata`, `ouvidor63`, `embarcados`, `fita-ws2811`, `lab-integrado`, `cyber-synth`, `kx-101`, `apps-interativos`, `canal-youtube`, `fotografia-vivitar`, `bio`, `referencias`, `contato` e `apoiar`. As seções e demais elementos têm IDs adicionais; 20 não é a contagem total de IDs do documento.
- **Sem JavaScript, todo o conteúdo editorial publicado continua no mesmo HTML**, com registros nativos, fichas, contatos e galerias. Não há resumo paralelo para manter. Abra os registros aninhados pelos summaries nativos; a revelação automática de uma âncora é um aprimoramento de `app.js`. Os links de imagem abrem o original; Ambiente, som, ampliação em diálogo e cópia assistida não funcionam. Sem JavaScript, links nativos para os quatro idiomas aparecem no rodapé e o seletor fica oculto. Com JavaScript, o seletor é movido do cabeçalho ao rodapé até 480 px.
- A galeria VIVITAR fica aberta em Início, primeiro visualmente; mantém a âncora `#fotografia-vivitar`, as dez fotos, descrições e créditos. A foto 02 abre a sequência, com carregamento prioritário. As galerias rolam horizontalmente, sem avanço automático. Miniaturas começam em cinza e revelam cor por interação. Com JavaScript, o original abre em `<dialog>` com descrição e legenda; fechar devolve o foco à imagem de origem.
- Na abertura, telas largas combinam a fotografia à esquerda com apresentação e demonstração à direita. Até 820 px, a ordem visual é fotografia → demonstração → apresentação; o `h1` mantém a precedência no HTML. Técnica e descrição da série ficam em um disclosure nativo, sem remover conteúdo. São 15 registros e dois disclosures auxiliares, totalizando 17 `<details>` por idioma.
- O Pix usa a chave já publicada. A cópia tenta a área de transferência; se não estiver disponível, seleciona a chave e orienta a cópia manual. Sem JavaScript, a chave continua legível.

## Identidade visual e idiomas

- ChickenScratch AOE é carregada localmente por `@font-face`, com peso 400. Títulos manuscritos têm pelo menos 28 px: fotografia e demonstração usam 28 px, os demais `h3` usam 30 px; o `h1` da abertura varia de 36 a 50 px e os `h2` começam em 42 px.
- O corpo usa fontes serifadas do sistema (`Iowan Old Style`, `Palatino Linotype`, Palatino, Georgia), de **18 a 20 px** e entrelinha 1,65. Rótulos, fichas e legendas podem ter 16 px; dicas e mensagens auxiliares da demonstração usam 14–16 px. Não há carregamento de Google Fonts.
- Folhas e cabeçalho usam fundo de papel com **90% de opacidade**, sem reduzir a opacidade do texto. As folhas têm bordas arredondadas, desfoque do fundo de 14 px e névoa em duas camadas que não capturam cliques: atmosfera de 18–26 s e véus orgânicos com máscara SVG procedural, deslocamento e blur, em 32 s (38 s no rodapé). Movimento reduzido desativa a animação; transparência reduzida torna a folha opaca e remove a névoa. A textura é local, embutida no CSS.
- Menus usam contornos, realce da seção ativa e respostas visuais ao foco/hover; chamadas principais têm botões de maior destaque. Registros e serviços têm fichas próprias. O logo S0LE original aparece no cabeçalho e na abertura; v1su4rt permanece no rodapé. Até 380 px, o cabeçalho distribui os controles em duas linhas, sem ocultar as seções.
- O padrão é claro; `prefers-color-scheme: dark` aplica a paleta escura conforme o sistema. Preferência por transparência reduzida torna as folhas opacas.
- **Opção A escolhida:** no tema claro, `#gl` usa `invert(1) hue-rotate(180deg)`, `mix-blend-mode: multiply` e opacidade `.55`. No escuro, não há filtro; a composição é normal e a opacidade `.7`. A revisão original das 30 capturas manteve as cinco linguagens nas margens, sem comprometer o texto protegido pelas folhas. Os resultados de contraste originais abaixo correspondem às folhas com 98% de opacidade; não são a medição das novas superfícies translúcidas.
- **PT-BR, ES, EN e FR** têm conteúdo completo em HTML próprio, com `lang="pt-BR"`, `lang="es"`, `lang="en"` e `lang="fr"`. O seletor tem quatro opções ativas e usa destinos relativos explícitos: `index.html`, `es/index.html`, `en/index.html` e `fr/index.html`, conservando a âncora do registro em leitura. Recursos e links também são relativos, para funcionar por HTTP e ao abrir o HTML diretamente por `file://`. Os IDs permanecem iguais em todas as páginas.
- CSS, JavaScript, fontes e imagens são compartilhados. As mensagens de retorno à leitura e cópia do Pix vêm de atributos localizados no HTML; não há tradução editorial feita por JS. Sem JS, o seletor fica oculto e links de idioma funcionam no rodapé.
- Ao editar um fato, mantenha as quatro versões coerentes. `hreflang` e os demais endereços absolutos de SEO só serão definidos após confirmação do domínio. Domínio, `canonical`, `og:url` e `sitemap` permanecem pendentes.

### Verificação dos idiomas — 2026-11-12

**303/303 verificações aprovadas por HTTP e 303/303 por `file://`**, em Chrome/Playwright nas quatro páginas, com **78 capturas** em 320/390/820/1440 px e claro/noite, incluindo menu ativo, névoa, serviços e apoio. As 12 trocas entre idiomas foram testadas em cada protocolo e preservam a âncora, abrindo os ancestrais do registro. Foram conferidas unicidade e equivalência dos IDs, os 15 registros e dois disclosures auxiliares (17 `<details>`), as 20 fotos públicas, logos, CSS/fonte local, links, créditos, mensagens de Pix/Ambiente, ampliação, retorno do foco, navegação sem JS e alvos ≥ 44 px. Os rótulos do menu não quebram; até 380 px, os controles ficam em duas linhas. O som foi medido com Web Audio real: onda quadrada, ganho `.018`, duração de 105 ms no menu, sem autoplay/hover; teclado, mute e navegação sem AudioContext foram testados. Névoa não intercepta cliques, texto mantém opacidade integral, e preferências de movimento/transparência reduzidos são respeitadas. Nenhum erro de página, aviso de console, resposta local de erro ou falha de carregamento de arquivo/recurso.

A abertura direta antes falhava com `ERR_FILE_NOT_FOUND` por usar caminhos iniciados em `/`, que apontavam para a raiz do disco. Os quatro HTMLs agora usam recursos relativos; opções de idioma e links sem JS apontam explicitamente para `index.html`.

Evidências adicionais: `relatorio-idiomas.json`, `relatorio-idiomas-arquivo.json`, `idiomas-*.png` e `idiomas-arquivo-*.png` na pasta local de evidências. Larguras são emuladas no navegador; não houve publicação remota.

## Ambiente generativo

A seção em leitura fornece `data-mode` e `data-hue` ao shader. Sem movimento reduzido, a troca de linguagem dissolve uma na outra em cerca de 800 ms.

| Modo interno | Linguagem | Seção automática | Tecla de escolha |
| --- | --- | --- | --- |
| `0` | Analógico/CRT | Contato | `4` |
| `1` | Fumaça | Início | `1` |
| `2` | Orgânico | Sobre | `2` |
| `3` | Fluxo | Trabalho | `3` |
| `4` | Malha digital | Pesquisa | `5` |

A numeração das teclas não é a numeração interna dos modos. `0` no teclado restaura o modo automático da seção; `X` limpa manchas; `A` alterna Ambiente; `Esc` retorna à leitura quando Ambiente está ativo. Atalhos são ignorados em campos de edição, com modificadores e enquanto a imagem ampliada está aberta.

- Na leitura, clique, toque ou arrasto pinta **fora das folhas e controles**, ou na área dedicada `#demo-stage` dentro da demonstração. No toque, o gesto vertical permanece reservado à rolagem; o arrasto horizontal intencional pode pintar. O efeito mantém até seis depósitos de pigmento por canvas.
- Ambiente oculta e desativa cabeçalho, conteúdo e rodapé, levando **o mesmo botão** para fora do cabeçalho, com o texto “Voltar à leitura”. Permanecem esse botão e a dica “Toque ou arraste para pintar. Esc retorna à leitura.”
- Em Ambiente, a primeira mancha-fantasma é agendada para **3,5 s** e as seguintes para **7 s**. Cessam na primeira mancha efetivamente feita pelo visitante e não retornam ao reentrar em Ambiente na mesma sessão de página. Não existem com movimento reduzido.
- Com `prefers-reduced-motion: reduce`, há **zero quadros contínuos em repouso**. A inicialização e eventos ainda desenham quadros pontuais: o contador total não precisa ser zero. Cada depósito fica estático, conserva sua âncora e expira em **4 s**, sem expansão ou dissolução animada; a troca de modo é imediata.
- WebGL indisponível ou perdido leva à alternativa Canvas2D, com versões simplificadas dos cinco modos. Sem nenhum backend gráfico, o canvas é ocultado e o conteúdo continua acessível. A página oculta não mantém a animação.
- Qualidade tem níveis 0–2. Telas até 820 px, sinais de capacidade limitada ou economia de dados começam no nível 0, DPR máximo 1 e intervalo de agendamento de 34 ms. Nos demais, o limite inicial de DPR é 1,5; a mediana de 36 quadros acima de 24 ms pode reduzir a qualidade, com espera de 3 s entre reduções. Não há aumento automático de nível.
- Sons 8-bit são sintetizados após acionamento dos logotipos, menus principais, chamadas de abertura, registros e Ambiente. O feedback de menu é discreto (ganho `.018`, sequências de 105–160 ms, intervalo mínimo de 140 ms); esses sons não usam o microfone nem gravações e não tocam no hover ou automaticamente. `SoleAudio.muted` também bloqueia os sons novos sem interromper a navegação.

### Demonstração interativa

`#demonstracao` contém uma prévia gráfica de 172 px de altura, seletor dos cinco efeitos e botão Limpar. Uma segunda instância do mesmo `createShader`, sempre em qualidade 0/DPR máximo 1, desenha somente quando visível e fora de Ambiente. A prévia compartilha som e orientação com o fundo; Limpar apaga ambos os canvases. Informações de privacidade ficam recolhíveis, mas estados e erros dos sensores permanecem visíveis.

- **Mouse e toque:** mover o cursor deforma o campo sem tinta; clicar ou arrastar pinta na prévia e no fundo. No celular, um toque pinta, arrasto horizontal intencional pinta e gesto vertical rola a página. As fotos mantêm sua galeria horizontal nativa.
- **Teclado na prévia:** setas deslocam o ponto; Enter ou Espaço pinta; Esc limpa a prévia e desliga os sensores.
- **Permissões:** dois botões contextuais, fora do menu fixo, ligam/desligam cada entrada; durante a solicitação, outro clique cancela. Nada é solicitado ao carregar a página.
- **Microfone:** `getUserMedia` pede somente áudio após o clique. Web Audio calcula RMS, graves (60–400 Hz), agudos (1.800–6.500 Hz) e ataques, com envelopes suaves. A análise usa FFT 2048 e atualiza os sinais a cada 32 ms, ou 400 ms com movimento reduzido. A fonte conecta apenas ao analisador, nunca ao alto-falante. Não há gravação, upload, eco ou `MediaRecorder` no código de produção. Tracks e AudioContext são encerrados ao desligar.
- **Movimento:** dados de orientação do celular, usando `DeviceOrientationEvent` (não acesso bruto ao giroscópio). Quando disponível, `requestPermission()` ocorre no gesto explícito. A primeira amostra calibra a posição; inclinação relativa considera a rotação da tela, é limitada e suavizada. Ausência de dados por 6 s encerra a espera/entrada com mensagem, sem fingir suporte.
- As entradas modulam suavemente luz, névoa e indicador; nunca deformam fotografias ou texto. WebGL e Canvas2D recebem os sinais. Com movimento reduzido, não há parallax nem movimento do indicador: apenas intensidade discreta, atualizada no máximo a cada 400 ms.
- Sair de Início, entrar em Ambiente, ampliar uma foto, pressionar Esc, ocultar ou abandonar a página desliga as entradas. Voltar não as religa. Permissões concedidas depois de cancelar não reativam sensores; streams tardios são encerrados.
- HTTPS ou localhost são necessários; abertura por arquivo depende das permissões do navegador. Recusa, contexto inseguro e ausência de API/dados têm mensagens nas quatro línguas. Sem JS, os botões ficam ocultos e uma explicação permanece; fotos e leitura funcionam.
- Testes usam áudio de dispositivo falso do Chrome com processamento Web Audio real e eventos de orientação simulados. **Microfone e sensores em celular físico ainda não foram verificados.** Não é comprovação dos outros aplicativos nem alteração de seus repositórios.

### Verificação da experiência — 2026-11-12

**197/197 verificações por HTTP e 197/197 por `file://`** em testes finitos com contextos isolados. Incluem os quatro idiomas, 320/390/820/1440 px nos dois temas, mouse, toque nativo emulado, teclado, consentimento/recusa e encerramento dos sensores, pausa da prévia fora da tela, preservação das fotos e leitura sem JS. WebGL e Canvas2D foram exercitados com os cinco modos: comparação direta dos pixels do canvas confirma resposta visual e invariância dos sinais geométricos com movimento reduzido. A captura direta preserva o buffer apenas na instrumentação de teste, sem alterar a configuração de produção.

A suíte adicional de encerramento e repouso dos sensores aprovou **15/15 verificações em cada protocolo**, nos dois backends. O teste focado de contraste aprovou **40/40 combinações**, mínimo **5,2484:1**, em 390×900 px, dois temas, cinco modos, quatro links de menu focados e intensidade máxima. Amostra texto visível do menu e painel, excluindo texto encoberto pelo cabeçalho; não certifica contraste de todo o portfólio.

Evidências na pasta local: `interacao-20261112-http.json`, `interacao-20261112-arquivo.json`, `interacao-20261112-*.png`, `ciclo-sensores-*.json` e `contraste-foco-demo.json`. Não é teste em celular físico nem certificação integral de acessibilidade; não houve publicação.

### API preservada e diagnóstico

`window.createShader(canvas)` devolve a instância usada por `app.js`:

- `setTarget(mode, hue)`: define modo interno 0–4 e paleta.
- `addStain(x, y, vx, vy)`: deposita pigmento; coordenadas normalizadas de 0 a 1, origem superior esquerda; velocidades normalizadas têm limite interno.
- `releasePointer()`: encerra o gesto e libera os depósitos ativos.
- `clearStains()`: apaga depósitos e estado do ponteiro.
- `pulse()`: solicita um pulso visual.
- `setInput(level, x, y, bass, treble, attack)`: intensidade e bandas de 0 a 1, orientação relativa de −1 a 1; os três últimos argumentos são opcionais. Limites internos e ambos os backends; movimento reduzido mantém somente intensidade luminosa.
- `setPointer(x, y, vx, vy)`: define influência do ponteiro sem criar tinta; coordenadas normalizadas de 0 a 1 e velocidades limitadas.
- `setActive(active)`: suspende ou retoma o agendamento de desenhos da instância, usado na prévia fora da tela.
- `params`: parâmetros `speed`, `warp`, `pigment` (padrões 1, 0,6 e 1; `speed` 0 com movimento reduzido).
- `invalidate()`: solicita redesenho pontual após alterações diretas de parâmetros.
- `stats()`: diagnóstico com `quality`, `dpr`, `frameDelay`, `backend` (`webgl`, `canvas2d`, `none`), `frames`, `stains`, `stainCoords`, `target`, `mode`, `previousMode`, `mix`, `active` e `input` (`level`, `x`, `y`, `bass`, `treble`, `attack`).

A instância `shader` é local à função de `app.js`, não `window.shader`. Inspecione `shader.stats()` com o depurador pausado nesse escopo, sem criar outro shader para o mesmo canvas. `frames` conta desenhos acumulados; comparar leituras em repouso verifica ausência de atividade contínua. `stainCoords` usa a origem superior esquerda, antes da conversão interna para WebGL. Esses dados não certificam contraste nem aparência.

## Imagens, autoria e decisões editoriais

A autoria fotográfica e a autorização de uso das fotografias foram confirmadas pelo artista **Sol Emanuel Calderón Vargas em 2026-11-11**. Há **20 fotografias com legenda publicadas** e **32 sem legenda ocultas em comentários HTML**: 15 de Ouvidor 63, 15 de Sucata Quântica e dois retratos. O crédito sozinho não substitui a legenda. Os logotipos de marca no cabeçalho, na abertura e no rodapé não entram nessa contagem.

As **quatro capturas de aplicativos** e **três ilustrações conceituais** continuam ocultas, com crédito/autorização e identificação editorial pendentes. Não são fotografias nem comprovação de protótipos. As variantes WebP da série VIVITAR usam `srcset` explícito; o JPEG é alternativa e original de ampliação. Outras imagens usam os arquivos declarados no HTML.

Decisões de manutenção:

- **D1:** chamada principal de Início: “Imagem, som e luz para ativar espaços, memórias e formas de criação coletiva.” Alternativas comentadas não são cópia publicada.
- **D2:** preservar os canais existentes: e-mail principal, Instagram, WhatsApp, e-mail institucional e chave Pix. Não acrescentar contatos ou URLs não fornecidos.
- **D3:** publicar somente os cinco serviços `OK`; os dois `CONFIRMAR` não são oferta pública.
- **D4:** claro por padrão, escuro conforme o sistema; Opção A escolhida após revisão visual e contraste amostrado.
- **D5:** grafia pública **Psycovisao**.
- **D6:** licença da fonte local pendente de comprovação; crédito de fonte não comprova licença.
- **D7:** Matterport identificado como **“Ouvidor 63: Habitar a Arte (tour virtual)”**, não como Memorial da Resistência.
- **D8:** fotografia sem legenda permanece oculta até aprovação editorial.
- **D9:** créditos adicionais de equipe não confirmados permanecem omitidos, sem inventar nomes ou funções.

O título definitivo, a defesa, a referência ABNT e o vínculo do endereço do Repositório Unifesp com a dissertação ainda exigem confirmação. Descrições e especificações não confirmadas de aplicativos e protótipos não devem ser restauradas como fatos. O acompanhamento detalhado e a matriz das 59 imagens estão em `PENDENCIAS.md`.

## Editar e conferir

Use `CORRECOES-MANUAIS.txt` para editar parágrafos no HTML, acrescentar `<details>`, fichas, links e imagens. Preserve os IDs e não replique conteúdo em JavaScript. Não inferir datas, instituições, papéis, resultados, créditos ou permissões.

### Resultados históricos da reconstrução — 2026-11-11

A tabela registra a versão inicial, anterior às folhas a 90%, névoa refinada, VIVITAR no topo e sensores. Não certifica contraste ou carregamento desta revisão. Testes em Chrome/Playwright, com toque emulado pelo CDP e servidor ASP.NET em `http://localhost:5173`:

| Verificação | Resultado |
| --- | --- |
| Suíte principal | **89/89** verificações aprovadas, incluindo a matriz visual |
| Limites de interação e qualidade | **16/16** aprovadas |
| Matriz visual | **30/30** combinações: 390, 820 e 1440 px × claro/noite × modos 0–4; 30 capturas revistas |
| Contraste de texto visível | **2.885.200** amostras em sete posições de leitura por combinação; mínimo normal **4,8664:1**, grande **5,9352:1** |
| Contraste no tema noite | Mínimo normal **8,4459:1**, grande **8,6964:1** |
| Cinco manchas atrás da folha | **30/30** combinações aprovadas; mínimo normal **4,8177:1**, títulos **13,1192:1** |
| Âncoras e preservação | **22/22** destinos com ancestrais abertos por JS, incluindo os 20 IDs antigos, `servicos` e `pesquisa`; 20 URLs antigas mantidas |
| Imagens | Todos os **88 arquivos** preservados; 20 fotos publicadas com dimensões, lazy, alt, legenda e crédito; nenhuma foto carregada antes de abrir registros |
| Interface inicial | 6 controles visíveis a 390 px; 7 a 820/1440 px; idioma no rodapé a 390 px, com e sem JS |
| Toque e teclado | Todos os alvos ≥ 44 px após abrir registros; sem overflow lateral; rolagem vertical sem pintura, pintura fora das folhas e em Ambiente; skip link, Enter/Espaço, foco, Esc e retorno do foco aprovados |
| Movimento reduzido | Delta de quadros **0** em repouso; pixels da mancha estáticos e expiração em 4 s, em WebGL e Canvas2D; sem fantasmas |
| Ambiente e adaptação | Fantasmas em 3,5/7 s, parada permanente após pintura; dissolve de 800 ms; mediana de 36 quadros e intervalo de 3 s entre reduções conferidos |
| Seção ativa | Observer conferido ao cruzar a linha de leitura em 1440×600 e 390×844 |
| Alternativa gráfica | WebGL desligado e perda de contexto recuperam Canvas2D, mantendo a página |
| Pix e ampliação | Cópia e recusa de permissão aprovadas; diálogo, Esc, retorno do foco e separação entre legenda e crédito conferidos |
| Sintaxe e build | Quatro scripts com sintaxe válida; `dotnet build Portfolio.sln`: **0 avisos, 0 erros** |
| Console | Nenhum aviso capturado e nenhum erro de página na suíte principal |

A medição exclui registros fechados, texto encoberto pelo cabeçalho e conteúdo recortado pela rolagem das galerias. Captura o fundo com os glifos transparentes e calcula a razão WCAG a partir da cor do texto e dos pixels atrás dele. Os mínimos superam os limites AA de 4,5:1 para texto normal e 3:1 para grande. O teste com manchas é adicional e amostra a folha do hero, sem imagens.

Evidências locais fora do código de produção: `C:/Users/sole8/Documents/Qoder/2026-11-11/14a7cc60/evidencias/`. O pacote reúne as 30 capturas da matriz, montagem, copy PT-BR extraída do HTML, SERVICES, três relatórios JSON e scripts de teste. Há 20 capturas adicionais de capítulos, leitura sem JS, movimento reduzido e Canvas2D na pasta de evidências.

**Limites:** verificação local em navegador com toque emulado, não em celular físico; 320/480/600 px não integram a matriz executada. Não é certificação integral de acessibilidade nem teste de publicação remota. Licença da fonte, domínio e dados editoriais pendentes continuam a exigir confirmação.

Antes de cada publicação ou após mudanças, repita leitura sem JS, âncoras, teclado, foco, toque, ampliação, Pix, Ambiente, movimento reduzido e alternativa Canvas2D. Alterações de paleta, transparência ou shader exigem nova matriz de contraste. Confira contatos, serviços, imagens, decisões D1–D9 e `PENDENCIAS.md` antes de publicar informações novas.

## Publicar no Vercel

O **`vercel.json` existe** na raiz e define:

```json
{
  "framework": null,
  "installCommand": "",
  "buildCommand": "mkdir -p dist && cp -R Portfolio/wwwroot/. dist/",
  "outputDirectory": "dist"
}
```

A implantação copia os arquivos estáticos para `dist`; não compila ASP.NET e não precisa de SDK .NET, npm ou dependências de aplicação. A fonte permanece `Portfolio/wwwroot`; `dist` é saída de implantação, não outro local de edição.

Ao importar o repositório, mantenha a pasta raiz na raiz do repositório para ler essa configuração. Confira no painel os comandos herdados, a pasta de saída, a integração e **qual branch é de produção**. A branch de produção não foi confirmada: não há promessa de publicação automática por push em `master`.

Para outro provedor estático, publique o conteúdo de `Portfolio/wwwroot` como raiz servida. Só após confirmar domínio e publicação devem ser definidos os endereços absolutos de SEO e as referências das quatro versões de idioma. Esta revisão não executa deploy nem configura domínio.
