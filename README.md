# Portfólio interativo — Sol Emanuel Calderón Vargas

Portfólio artístico em português para audiovisual, pesquisa, fotografia, video mapping, cenografia, práticas coletivas e experiências interativas. O mestrado abre a navegação como destaque. Os demais itens são organizados em cronologia inversa e em áreas separadas para atuação contínua, experiências em desenvolvimento, séries sem data, perfil e links. O shader monocromático muda de linguagem visual de acordo com o item; toque ou clique revela pigmentos que se expandem e se dissolvem.

## Abrir localmente

- Abra `Portfolio.sln` no Visual Studio e inicie o projeto `Portfolio`; o perfil local usa `http://localhost:5173`.
- O projeto ASP.NET Core serve os arquivos estáticos de `Portfolio/wwwroot`.
- Também é possível abrir `Portfolio/wwwroot/index.html` diretamente. Todo o conteúdo e a interação visual funcionam sem permissões de dispositivo.

## Experiência do portfólio

- **Explorar:** filtra obras, pesquisa, coletivos, oficinas, formação e protótipos; a busca inclui texto, atuação, colaboração, local, especificações e links.
- **Sobre e Contato:** atalhos do cabeçalho levam diretamente à apresentação e aos canais de contato.
- **Navegação por conteúdos:** abre cada registro por seleção, busca ou filtro; a URL usa `#id` e a navegação funciona por teclado, toque ou botões. “Mestrado” fica em destaque próprio. Os períodos e datas conhecidos aparecem em ordem inversa; atuação contínua, desenvolvimento, experimentos e conteúdo sem data ficam em grupos distintos. A cronologia não atribui datas.
- **Ambiente visual e som:** a fumaça procedural é a imagem de fundo principal (modo 1); toque/clique no espaço visual desloca sua matéria e revela manchas cromáticas na paleta de cada registro. Os modos alternativos são analógico/CRT (0), orgânico psicodélico (2), fluido (3) e malha digital (4). O fallback Canvas2D oferece fumaça e equivalentes simplificados; a preferência por movimento reduzido pausa a fumaça. Os logotipos S0LE e v1su4rt tocam sequências sintetizadas 8-bit ao clique ou ao foco por teclado, sem microfone ou arquivos de áudio externos.
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
- `timelineGroup`: `featured`, `dated`, `ongoing`, `development`, `experiments`, `undated` ou `profile`; define o agrupamento da navegação, não a autoria nem uma data.
- `tags`: temas e linguagens para busca e apresentação.
- `specs`: especificações em objetos `{ label, value }` (pares posicionais antigos também são aceitos).
- `images`: objetos `{ src, caption, alt, credit }`; `credit` só deve ser preenchido quando confirmado. Pares posicionais antigos continuam aceitos. Use arquivos locais de `wwwroot/img`. Imagens com variantes WebP podem incluir `width`, `height` e `responsiveWidths` para a galeria escolher a resolução adequada; o original continua a ser usado na ampliação e como alternativa a WebP.
- `links`: objetos `{ label, text, url, copy, copyValue }`; `copy` é opcional. Pares posicionais antigos continuam aceitos.
- `jump`: objetos `{ label, target }`; pares posicionais antigos continuam aceitos e o destino precisa existir.
- `mode`, `hue`: família visual do shader (0 analógico/CRT, 1 fumaça, 2 orgânico psicodélico, 3 fluido, 4 malha digital) e paleta de pigmento associada ao item.
- `sub: true`: apresenta um experimento como subitem no menu lateral.

Ao incluir um projeto, confirme datas, autoria individual/coletiva, função, local, créditos e direitos de uso das imagens. Não publique datas ou papéis ainda incertos como fatos. Escreva o resumo para leitura rápida e use `specs` para dados objetivos.

## Estrutura

- `Portfolio/wwwroot/js/projects.js`: dados editoriais do portfólio.
- `Portfolio/wwwroot/js/app.js`: filtros, busca, navegação, cartões, imagens, links e controles.
- `Portfolio/wwwroot/js/shader.js`: ambiente visual generativo e fallback Canvas2D.
- `Portfolio/wwwroot/css/style.css`: identidade visual e layouts responsivos.
- `Portfolio/wwwroot/img`: retratos e documentação visual.
- `Portfolio/Program.cs` e `Portfolio/Portfolio.csproj`: servidor local ASP.NET Core.

## Publicação

Os arquivos do site ficam em `Portfolio/wwwroot`. Para hospedagem estática, publique o conteúdo dessa pasta na raiz servida pelo provedor. Para executar como aplicação ASP.NET Core, publique o projeto `Portfolio` com o SDK compatível com o `TargetFramework` definido em `Portfolio.csproj`.

Este repositório não contém atualmente uma configuração `vercel.json`; configure o diretório de publicação no provedor conforme a estrutura acima ou adicione uma configuração específica antes de seguir instruções próprias da plataforma.


## Acesso, desempenho e privacidade

- Layout automático prioriza leitura em coluna em telas estreitas; o seletor de visualização serve para prévia, não mede o dispositivo real.
- A preferência do sistema por movimento reduzido pausa a animação contínua. Toques deixam manchas estáticas, que desaparecem sem animação após o intervalo definido.
- Ao deixar a página, o efeito interrompe os quadros; ao retornar, ele é retomado. Se WebGL e Canvas2D não estiverem disponíveis, os efeitos são escondidos e o conteúdo segue navegável.
- Imagens são carregadas sob demanda no cartão atual. A série VIVITAR usa miniaturas WebP responsivas de 480 px e 960 px (ou 720 px nas imagens verticais), com JPEG original como alternativa e para ampliação; outros registros ainda usam os arquivos originais.
- Fontes externas vêm do Google Fonts, com fontes de sistema como alternativa. A página não exige a disponibilidade dessas fontes para leitura.
- Não foi configurado provedor, domínio ou publicação. Para hospedagem estática, a pasta servida é `Portfolio/wwwroot`; configure HTTPS no provedor. Para hospedagem ASP.NET Core, publique o projeto usando o SDK compatível com `net10.0`.
- Confirme os direitos de uso e os créditos das imagens antes da publicação. Os contatos existentes permanecem inalterados e precisam de confirmação do artista para permanecer públicos.

## Modelo editorial para novos registros

Use objetos com campos nomeados para novos conteúdos. A interface continua aceitando temporariamente as listas posicionais dos registros atuais, permitindo migração gradual.

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

- Compile a solução com o SDK .NET 10 instalado.
- Valide a sintaxe dos quatro scripts JavaScript ativos com `node --check`.
- Confira a renderização em celulares, tablets e desktops, incluindo WebGL indisponível, JavaScript desativado, toque, teclado e preferência por movimento reduzido.
- Confirme a leitura e os controles em redes lentas e com economia de dados. Verifique no inspetor do navegador se as miniaturas VIVITAR selecionam variantes WebP adequadas à largura e se JPEG atende navegadores sem suporte.
- Não foi configurado domínio ou publicação neste repositório.
