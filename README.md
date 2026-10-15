# Portfólio interativo — Sol Emanuel Calderón Vargas

Portfólio artístico em português para audiovisual, pesquisa, fotografia, video mapping, cenografia, práticas coletivas e experiências interativas. O mestrado abre a navegação como destaque. Os demais itens são organizados em cronologia inversa e em áreas separadas para atuação contínua, experiências em desenvolvimento, séries sem data, perfil e links. O shader monocromático muda de linguagem visual de acordo com o item; toque ou clique revela pigmentos que se expandem e se dissolvem.

## Abrir localmente

- Execute `.\dev-serve.ps1` no PowerShell, ou abra `Portfolio.sln` no Visual Studio e inicie o projeto `Portfolio`. O perfil local usa `http://localhost:5173`.
- O projeto ASP.NET Core serve os arquivos estáticos de `Portfolio/wwwroot`, que é a única cópia do site. Não há segunda versão na raiz do repositório, e nada precisa ser sincronizado à mão.
- Também é possível abrir `Portfolio/wwwroot/index.html` diretamente. Todo o conteúdo e a interação visual funcionam sem permissões de dispositivo.
- O projeto usa alternativas para eventos de toque, atualização de cartões, altura da tela, foco e janela ampliada em navegadores antigos. A validação final ainda deve incluir os aparelhos Android que o artista deseja atender.

## Experiência do portfólio

- **Explorar:** filtra obras, pesquisa, coletivos, oficinas, interativos, apps, formação e perfil; cada tema mostra a quantidade de conteúdos, e a linha acima da cronologia diz quantos estão visíveis, qual tema e busca estão ativos e quantos registros só aparecem no celular. A busca inclui texto, atuação, colaboração, local, especificações e links, com atualização contida para não reagir a cada tecla. No celular, a Minibio é a leitura inicial e a navegação, busca, filtros e ajustes ficam agrupados no menu recolhível, cujo rótulo indica o tema em uso. A cronologia abre em lista vertical, com opção de faixa horizontal, e um aviso explica a ordem dos grupos.
- **Sobre e Contato:** atalhos do cabeçalho levam diretamente à apresentação e aos canais de contato.
- **Serviços e Pesquisa:** páginas editoriais próprias em `#servicos` e `#pesquisa`, disponíveis em qualquer largura de tela — celular, tablet e desktop. A página de Serviços monta sua grade a partir de `window.SERVICES`; a de Pesquisa reúne a pesquisa em andamento e o experimento ligado a ela. O item aberto no cabeçalho, no menu lateral e nos menus do desktop recebe `aria-current="page"`.
- **Navegação por conteúdos:** abre cada registro por seleção, busca ou filtro; a URL usa `#id` e a navegação funciona por teclado, toque ou botões. “Mestrado” fica em destaque próprio. Os períodos e datas conhecidos aparecem em ordem inversa; atuação contínua, desenvolvimento, experimentos e conteúdo sem data ficam em grupos distintos. A cronologia não atribui datas.
- **Ambiente visual e som:** a fumaça procedural é a imagem de fundo principal (modo 1), com camadas em parallax e sombreado que dão volume; toque/clique no espaço visual desloca sua matéria e revela manchas cromáticas na paleta de cada registro. Os modos alternativos são analógico/CRT (0), orgânico psicodélico (2), fluxo (3) e malha digital (4): o analógico usa ruído de sinal, linhas tortas, barra de sincronismo e rasgos; a malha usa célula quadrada, ponto de fuga e nós que acendem — são duas gramáticas opostas, não a mesma grade. Ao trocar de registro, a linguagem anterior se dissolve na seguinte em vez de cortar. O seletor “Efeito visual” fica no painel de ajustes (sempre) e no cabeçalho em telas largas; escolha uma linguagem ou acompanhe o projeto aberto. Arrastar dentro de um mesmo gesto alarga a mancha existente em vez de apagar a tinta anterior. O slider “Distorção” agora muda o comportamento de cada linguagem (linhas tortas no analógico, dobra da fumaça, abertura das pétalas, estiramento do fluxo, profundidade da malha). O fallback Canvas2D oferece as mesmas cinco linguagens de forma simplificada e usa a mesma paleta cossenoidal do shader. Os logotipos S0LE e v1su4rt tocam sequências sintetizadas 8-bit ao clique ou ao foco por teclado. O site não solicita acesso ao microfone e não usa gravações de áudio.
- **Interface dinâmica:** no Modo ambiente, os ajustes, o botão de sair e a dica de interação ficam flutuando sobre o fundo e se apagam depois de alguns segundos sem movimento; qualquer toque, roda do mouse ou tecla os traz de volta. O painel de ajustes se fecha sozinho por inatividade, ao clicar fora e com Esc; dentro do Modo ambiente, o primeiro Esc fecha o painel e o segundo devolve o portfólio. Atalhos quando o foco não está em campo de texto: `A` alterna o Modo ambiente, `C` abre os ajustes, `1` a `5` escolhem a linguagem visual, `0` volta ao efeito por projeto e `X` limpa as manchas.
- **Movimento reduzido:** não há animação contínua. As manchas ficam estáticas após o toque e desaparecem ao fim do intervalo definido; o efeito respeita a preferência do sistema.
- **Sem JavaScript:** a página apresenta um resumo editorial, a ficha do mestrado, o Centro Cultural Ouvidor 63 e links principais. Filtros, navegação dinâmica e shader requerem JavaScript.
- **Imagens:** cada imagem deve ter legenda e descrição alternativa; clicar abre a versão ampliada.

## Atualizar conteúdo

O catálogo está em `Portfolio/wwwroot/js/projects.js`. Cada item usa um objeto com estes campos:

- `id`: identificador único, usado na URL e nos botões de ligação.
- `category`: categoria de navegação: `works`, `research`, `collective`, `workshop`, `interactive`, `apps`, `education`, `profile` ou `info`.
- `kind`, `when`, `title`, `subtitle`, `text`: tipo, data/período, título e conteúdo editorial.
- `role`, `collaborators`, `location`: atuação individual, colaboração e local; preencha apenas quando confirmados.
- `status`: estado editorial opcional, como operacional ou em desenvolvimento, somente se confirmado; não use a data como estado.
- `timelineGroup`: `featured`, `research`, `dated`, `ongoing`, `development`, `experiments`, `undated` ou `profile`; define o rótulo e o agrupamento da navegação, não a autoria nem uma data. Um valor fora dessa lista é exibido como “Séries e conteúdos sem data”.
- `tags`: temas e linguagens para busca e apresentação.
- `featured: true`: destaca o item com o rótulo “Em destaque” na ficha e na cronologia.
- `mobileOnly: true`: apresenta o registro apenas na visualização de celular.
- `specs`: objetos `{ label, value }`.
- `images`: objetos `{ src, caption, alt, credit }`. `src` é o nome do arquivo dentro de `img/`; `credit` só deve ser preenchido quando confirmado e aparece ao fim da legenda. Imagens com variantes WebP podem incluir `width`, `height` e `responsiveWidths` para a galeria escolher a resolução adequada; o original continua a ser usado na ampliação e como alternativa a WebP.
- `links`: objetos `{ label, text, url, copy, copyValue }`. `url` precisa começar com `https:`, `mailto:` ou `tel:`, ou o link não aparece. `copy` é opcional e mostra o botão “Copiar”.
- `jump`: objetos `{ label, target }`; o destino precisa existir.
- `mode`, `hue`: família visual do shader (0 analógico/CRT, 1 fumaça, 2 orgânico psicodélico, 3 fluido, 4 malha digital) e paleta de pigmento associada ao item.
- `sub: true`: apresenta um experimento como subitem no menu lateral.
- `menu: true`: inclui o registro no menu “Projetos” do desktop. Os menus de tema (chips do celular, painel “Explorar por temas”, seletor de prévia) são gerados a partir da lista `topics` em `js/app.js`, com contagem de conteúdos calculada; nenhum deles precisa ser editado no HTML. A lista `window.SERVICES`, no fim de `projects.js`, alimenta ao mesmo tempo o menu “Serviços” e a página de serviços.

A redação dos campos `subtitle` e `text` está em primeira pessoa, na voz do artista. Ao adicionar um registro, escreva na mesma pessoa e não complete datas, papéis, instituições ou créditos por inferência.

Ao incluir um projeto, confirme datas, autoria individual/coletiva, função, local, créditos e direitos de uso das imagens. Não publique datas ou papéis ainda incertos como fatos. Escreva o resumo para leitura rápida e use `specs` para dados objetivos.

## Estrutura

Todo o site existe uma única vez, em `Portfolio/wwwroot`. Não há cópia na raiz do repositório nem pasta de sincronização manual.

- `Portfolio/wwwroot/index.html`: marcação, navegação e controles.
- `Portfolio/wwwroot/js/projects.js`: dados editoriais do portfólio.
- `Portfolio/wwwroot/js/app.js`: filtros, busca, navegação, cartões, imagens, links e controles.
- `Portfolio/wwwroot/js/shader.js`: ambiente visual generativo e fallback Canvas2D.
- `Portfolio/wwwroot/js/audio.js`: sequências 8-bit dos logotipos.
- `Portfolio/wwwroot/css/style.css`: identidade visual, tipografia e layouts responsivos.
- `Portfolio/wwwroot/fonts`: fonte dos títulos, hospedada localmente.
- `Portfolio/wwwroot/img`: retratos e documentação visual, com variantes em `img/responsive`.
- `Portfolio/Program.cs` e `Portfolio/Portfolio.csproj`: servidor local ASP.NET Core.
- `dev-serve.ps1`: atalho para subir o servidor de desenvolvimento.
- `CORRECOES-MANUAIS.txt`: guia de manutenção do artista — onde mora cada texto, como alterá-lo, como adicionar conteúdo, imagens, temas e sem quebrar a arquitetura.

## Publicação

Os arquivos do site ficam em `Portfolio/wwwroot`. Para hospedagem estática, publique o conteúdo dessa pasta na raiz servida pelo provedor. Para executar como aplicação ASP.NET Core, publique o projeto `Portfolio` com o SDK compatível com o `TargetFramework` definido em `Portfolio.csproj`.

Este repositório não contém atualmente uma configuração `vercel.json`; configure o diretório de publicação no provedor conforme a estrutura acima ou adicione uma configuração específica antes de seguir instruções próprias da plataforma.


## Acesso, desempenho e privacidade

- Layout automático prioriza leitura em coluna em telas estreitas; no celular, a Minibio aparece primeiro e o Mestrado continua no topo destacado da cronologia. O seletor de visualização serve para prévia, não mede o dispositivo real.
- O menu móvel usa `<details>` quando disponível e alternância por teclado como fallback; o conteúdo editorial básico continua visível sem JavaScript.
- Tablets e desktops mantêm a organização atual; os elementos de navegação retornam às posições originais quando a janela sai da largura de celular.
- A preferência do sistema por movimento reduzido pausa a animação contínua. Toques deixam manchas estáticas, que desaparecem sem animação após o intervalo definido.
- Ao deixar a página, o efeito interrompe os quadros; ao retornar, ele é retomado. Se WebGL e Canvas2D não estiverem disponíveis, os efeitos são escondidos e o conteúdo segue navegável. Se o contexto WebGL se perder durante a visita, o canvas é recriado em Canvas2D e o status explica a simplificação.
- O efeito tem três níveis de detalhe. Aparelhos com até 4 núcleos/memória, telas estreitas, economia de dados ou sinal fraco começam no nível mais simples; nos demais, o shader mede o tempo real dos últimos 36 quadros e, se a mediana passar de 24 ms, desce um nível (reduz octavas, detalhes e resolução) e segura por três segundos antes de tentar de novo. O nível nunca sobe sozinho, para o fundo não ficar oscilando.
- Imagens são carregadas sob demanda no cartão atual. A série VIVITAR usa miniaturas WebP responsivas de 480 px e 960 px (ou 720 px nas imagens verticais), com JPEG original como alternativa e para ampliação; outros registros ainda usam os arquivos originais.
- Fontes: os títulos usam ChickenScratch AOE, hospedada em `Portfolio/wwwroot/fonts/chickscratch-aoe.ttf` e declarada no `@font-face` do `css/style.css` (um único peso; a família fica na variável `--display`). O corpo do texto continua com DM Sans, do Google Fonts, com fontes de sistema como alternativa (`--body`). Sem a rede, o corpo cai na fonte do sistema e os títulos seguem locais.
- Não foi configurado provedor, domínio ou publicação. Para hospedagem estática, a pasta servida é `Portfolio/wwwroot`; configure HTTPS no provedor. Para hospedagem ASP.NET Core, publique o projeto usando o SDK compatível com `net10.0`.
- Confirme os direitos de uso e os créditos das imagens antes da publicação. Os contatos existentes permanecem inalterados e precisam de confirmação do artista para permanecer públicos.

## Modelo editorial para novos registros

Todos os registros e a interface usam objetos com campos nomeados. As antigas listas posicionais foram eliminadas na migração de `projects.js`, e o código não as reconhece mais: um campo nesse formato não aparece na página, e salto, link ou imagem nesse formato gera aviso no console.

```js
{
  id: "identificador-unico",
  category: "works", // works, research, collective, workshop, interactive, apps, education, profile, info
  kind: "tipo confirmado",
  status: "estado confirmado",
  when: "data ou período confirmado",
  title: "título confirmado",
  subtitle: "resumo curto",
  text: "descrição factual, sem completar lacunas por inferência",
  role: "atuação individual confirmada",
  collaborators: "créditos coletivos confirmados",
  location: "local confirmado",
  tags: ["tema"],
  specs: [{ label: "Instituição", value: "Nome confirmado" }],
  images: [{ src: "arquivo.jpg", caption: "Legenda", alt: "Descrição visual", credit: "Crédito confirmado" }],
  links: [{ label: "Documentação", text: "Abrir documentação", url: "https://exemplo.org" }],
  jump: [{ label: "Ver pesquisa relacionada", target: "id-existente" }],
  mode: 0, hue: 0
}
```

Cada aplicativo deve ter um registro próprio, com o nome público confirmado em `title` (por exemplo, Psycovisao, Urut e v1su4rt), URL específica e estado confirmado. Evite o rótulo genérico “aplicativo” como único identificador.

### Checklist antes de adicionar ou publicar

- [ ] O `id` é único, curto, sem espaços e estável para links diretos.
- [ ] Categoria, tipo, estado e período correspondem ao registro; cronologia não substitui estado.
- [ ] Autoria individual, ação coletiva, colaboração e papel estão diferenciados e confirmados.
- [ ] Título, texto, instituição, local, créditos e resultados não foram inferidos.
- [ ] Cada imagem existe em `wwwroot/img` (e suas variantes, quando declaradas, em `wwwroot/img/responsive`), tem legenda, descrição alternativa e crédito/permissão confirmados.
- [ ] Cada URL usa `https:`, `mailto:` ou `tel:` e leva ao conteúdo esperado.
- [ ] Cada salto aponta para um `id` existente.
- [ ] Contatos pessoais foram explicitamente aprovados para divulgação.
- [ ] A leitura continua compreensível sem shader ou link externo.

A inicialização verifica IDs, categorias, destinos de salto, protocolos de link e nomes de arquivo de imagem e registra avisos no console. Imagens ausentes são ocultadas; confirme esses avisos antes de publicar.

## Pendências editoriais conhecidas

- O artista confirmou que a exposição do Memorial da Resistência foi uma extensão da pesquisa apoiada pela FAPESP, com video mapping da escada e direção e criação do vídeo projetado no teto. Confirmar a data da exposição e créditos adicionais da equipe, quando aplicáveis.
- Confirmar o título formal e a referência final da pesquisa de mestrado de 2023–2025.
- Confirmar créditos e direitos de uso das imagens em cada registro.
- Confirmar publicação do e-mail institucional e do WhatsApp pessoal.
- Confirmar estado atual dos protótipos e se há demonstrações autorizadas.
- Revisar a legenda/contexto fotográfico de `retrato-capa.jpg` e a identificação contextual das fotos VIVITAR.

## Validação antes da publicação

- Compile a solução com o SDK .NET 10 instalado: `dotnet build Portfolio.sln`. Um `obj/` antigo gera avisos falsos de arquivo ausente; reconstrua antes de confiar em um 404 do `dotnet run --no-build`.
- Abra `http://localhost:5173` com `.\dev-serve.ps1` e confira o console do navegador: a inicialização deve terminar sem avisos.
- Valide a sintaxe dos quatro scripts ativos em `Portfolio/wwwroot/js` (`app.js`, `audio.js`, `projects.js`, `shader.js`) com `node --check`. O Node não precisa estar no `PATH` do sistema; use o executável distribuído com o editor.
- Confira a renderização em celulares, tablets e desktops, incluindo WebGL indisponível, JavaScript desativado, toque, teclado e preferência por movimento reduzido.
- Veja as cinco linguagens do fundo em um aparelho real, com o dedo: o arrasto deve deixar tinta contínua (sem sumir no meio do gesto), a troca de registro deve dissolver a linguagem anterior e os ajustes devem reaparecer ao menor movimento. As medidas automáticas confirmam estrutura, movimento e custo, não a aparência; os tempos de 4,2 s (Modo ambiente) e 9 s para apagar os ajustes são escolha editorial e podem ser ajustados em `bumpChrome`.
- Teste os menus de desktop, a busca, os filtros por tema e cada `jump`, link de serviço e link de projeto.
- Confirme a leitura e os controles em redes lentas e com economia de dados. Verifique no inspetor do navegador se as miniaturas VIVITAR selecionam variantes WebP adequadas à largura e se JPEG atende navegadores sem suporte.
- Não foi configurado domínio ou publicação neste repositório.
