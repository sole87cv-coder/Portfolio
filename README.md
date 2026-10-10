# Portfólio interativo — Sol Emanuel Calderón Vargas

Portfólio artístico em português para audiovisual, pesquisa, video mapping, cenografia, práticas coletivas e experiências interativas. A navegação combina filtros por tipo, busca textual, cartões com links diretos e um ambiente generativo opcional. A leitura funciona sem microfone e sem efeitos visuais.

## Abrir localmente

- Abra `Portfolio.sln` no Visual Studio e inicie o projeto `Portfolio`; o perfil local usa `http://localhost:5173`.
- O projeto ASP.NET Core serve os arquivos estáticos de `Portfolio/wwwroot`.
- Também é possível abrir `Portfolio/wwwroot/index.html` diretamente. Nesse caso, recursos de microfone podem exigir HTTPS ou localhost.

## Experiência do portfólio

- **Explorar:** filtra obras, pesquisa, coletivos, oficinas, formação e protótipos; a busca inclui texto, atuação, colaboração, local, especificações e links.
- **Sobre e Contato:** atalhos do cabeçalho levam diretamente à apresentação e aos canais de contato.
- **Linha do tempo:** seleciona os itens, atualiza o endereço com `#id` e permite navegar por teclado, toque ou botões.
- **Ambiente visual:** WebGL com fallback Canvas2D quando disponível; se nenhum contexto gráfico iniciar, os efeitos são ocultados e o conteúdo segue acessível. Ponteiro e toque atualizam a posição do ambiente; velocidade, distorção e cor podem ser ajustadas.
- **Microfone:** opcional, ativado por escolha do visitante. O nível sonoro é analisado localmente, sem gravação.
- **Imagens:** cada imagem deve ter legenda e descrição alternativa; clicar abre a versão ampliada.

## Atualizar conteúdo

O catálogo está em `Portfolio/wwwroot/js/projects.js`. Cada item usa um objeto com estes campos:

- `id`: identificador único, usado na URL e nos botões de ligação.
- `category`: categoria de navegação: `works`, `research`, `collective`, `workshop`, `interactive`, `education`, `profile` ou `info`.
- `kind`, `when`, `title`, `subtitle`, `text`: tipo, data/período, título e conteúdo editorial.
- `role`, `collaborators`, `location`: atuação individual, colaboração e local; preencha apenas quando confirmados.
- `status`: estado editorial opcional, como operacional ou em desenvolvimento, somente se confirmado; não use a data como estado.
- `tags`: temas e linguagens para busca e apresentação.
- `specs`: especificações em objetos `{ label, value }` (pares posicionais antigos também são aceitos).
- `images`: objetos `{ src, caption, alt, credit }`; `credit` só deve ser preenchido quando confirmado. Pares posicionais antigos continuam aceitos. Use arquivos locais de `wwwroot/img`.
- `links`: objetos `{ label, text, url, copy, copyValue }`; `copy` é opcional. Pares posicionais antigos continuam aceitos.
- `jump`: objetos `{ label, target }`; pares posicionais antigos continuam aceitos e o destino precisa existir.
- `mode`, `hue`, `tone`: aparência e sinal sonoro da interação do item.
- `sub: true`: apresenta um experimento como subitem no menu lateral.

Ao incluir um projeto, confirme datas, autoria individual/coletiva, função, local, créditos e direitos de uso das imagens. Não publique datas ou papéis ainda incertos como fatos. Escreva o resumo para leitura rápida e use `specs` para dados objetivos.

## Estrutura

- `Portfolio/wwwroot/js/projects.js`: dados editoriais do portfólio.
- `Portfolio/wwwroot/js/app.js`: filtros, busca, navegação, cartões, imagens, links e controles.
- `Portfolio/wwwroot/js/shader.js`: ambiente visual generativo e fallback Canvas2D.
- `Portfolio/wwwroot/js/audio.js`: microfone opcional e sinais sonoros.
- `Portfolio/wwwroot/css/style.css`: identidade visual e layouts responsivos.
- `Portfolio/wwwroot/img`: retratos e documentação visual.
- `Portfolio/Program.cs` e `Portfolio/Portfolio.csproj`: servidor local ASP.NET Core.

## Publicação

Os arquivos do site ficam em `Portfolio/wwwroot`. Para hospedagem estática, publique o conteúdo dessa pasta na raiz servida pelo provedor. Para executar como aplicação ASP.NET Core, publique o projeto `Portfolio` com o SDK compatível com o `TargetFramework` definido em `Portfolio.csproj`.

Este repositório não contém atualmente uma configuração `vercel.json`; configure o diretório de publicação no provedor conforme a estrutura acima ou adicione uma configuração específica antes de seguir instruções próprias da plataforma.


## Acesso, desempenho e privacidade

- Layout automático prioriza leitura em coluna em telas estreitas; o seletor de visualização serve para prévia, não mede o dispositivo real.
- A preferência do sistema por movimento reduzido pausa a animação contínua. Em aparelhos com poucos núcleos lógicos, a resolução do efeito é limitada e a atualização desacelerada.
- Ao deixar a página, o efeito interrompe os quadros; ao retornar, ele é retomado. Se WebGL e Canvas2D não estiverem disponíveis, os efeitos são escondidos e o conteúdo segue navegável.
- Imagens são carregadas sob demanda no cartão atual. As miniaturas ainda usam os arquivos originais; preparar versões menores continua recomendado antes de uma publicação com rede lenta.
- Fontes externas vêm do Google Fonts, com fontes de sistema como alternativa. A página não exige a disponibilidade dessas fontes para leitura.
- Microfone é opcional e requer contexto seguro (HTTPS ou localhost) e autorização do navegador. O código analisa o nível de áudio no aparelho, não envia nem grava o fluxo. O visitante pode desligá-lo ou restaurar os ajustes para encerrar a captura.
- Não foi configurado provedor, domínio ou publicação. Para hospedagem estática, a pasta servida é `Portfolio/wwwroot`; configure HTTPS no provedor. Para hospedagem ASP.NET Core, publique o projeto usando o SDK compatível com `net10.0`.
- Confirme os direitos de uso e os créditos das imagens antes da publicação. Os contatos existentes permanecem inalterados e precisam de confirmação do artista para permanecer públicos.

## Modelo editorial para novos registros

Use objetos com campos nomeados para novos conteúdos. A interface continua aceitando temporariamente as listas posicionais dos registros atuais, permitindo migração gradual.

```js
{
  id: "identificador-unico",
  category: "works", // works, research, collective, workshop, interactive, education, profile, info
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
  mode: 0, hue: 0, tone: [262, 330]
}
```

### Checklist antes de adicionar ou publicar

- [ ] O `id` é único, curto, sem espaços e estável para links diretos.
- [ ] Categoria, tipo, estado e período correspondem ao registro; cronologia não substitui estado.
- [ ] Autoria individual, ação coletiva, colaboração e papel estão diferenciados e confirmados.
- [ ] Título, texto, instituição, local, créditos e resultados não foram inferidos.
- [ ] Cada imagem existe em `wwwroot/img`, tem legenda, descrição alternativa e crédito/permissão confirmados.
- [ ] Cada URL usa `https:`, `mailto:` ou `tel:` e leva ao conteúdo esperado.
- [ ] Cada salto aponta para um `id` existente.
- [ ] Contatos pessoais foram explicitamente aprovados para divulgação.
- [ ] A leitura continua compreensível sem shader, áudio, microfone ou link externo.

A inicialização verifica IDs, categorias, destinos de salto, protocolos de link e nomes de arquivo de imagem e registra avisos no console. Imagens ausentes são ocultadas; confirme esses avisos antes de publicar.

## Pendências editoriais conhecidas

- Confirmar se “Ouvidor 63: Habitar a Arte” foi obra realizada, proposta ou documentação; confirmar data, papel e créditos.
- Confirmar titulação formal e referência final da pesquisa de mestrado de 2023–2025.
- Confirmar autoria, colaboração e créditos das imagens em cada registro.
- Confirmar publicação do e-mail institucional e do WhatsApp pessoal.
- Confirmar estado atual dos protótipos e se há demonstrações autorizadas.
- Revisar a legenda/contexto fotográfico de `retrato-capa.jpg`.

## Validação desta revisão

- Revisão estática da navegação, busca, filtros, fallback gráfico, microfone, diálogo, modo ambiente e layout responsivo.
- `node --check` foi executado nos quatro scripts JavaScript e passou.
- O servidor ASP.NET Core iniciou na porta local 5174. A conexão pelo navegador de teste e por requisição HTTP do ambiente foi bloqueada por timeout/permissão de socket, então a inspeção visual em navegador não pôde ser concluída.
- A porta 5173 já estava ocupada em uma tentativa inicial; a instância de validação usou 5174.
- Compilação do projeto, teste físico, rede lenta e simulação de navegador sem WebGL ainda dependem de validação adicional.
- A branch `aprimoramentos-portfolio` foi criada. Havia modificações não commitadas em arquivos do projeto antes desta revisão; elas foram preservadas. Os commits serão limitados ao escopo que puder ser separado dessas alterações.

## Rollback

Reverta os commits desta revisão na ordem inversa à sua criação. Como o diretório já tinha alterações sem commit no início, confira o diff da branch e mantenha essas alterações ao fazer rollback.
