# Portfólio — Sol Emanuel Calderón Vargas

Site estático multilíngue servido localmente por um projeto ASP.NET Core opcional. A fonte publicada é `Portfolio/wwwroot`; `dist/` é uma cópia gerada para a Vercel. O conteúdo fica nas quatro páginas HTML. CSS e JavaScript são compartilhados entre português, espanhol, inglês e francês.

## Abrir e conferir no computador

Para ver a página principal, abra `Portfolio/wwwroot/index.html`. Para testar recursos do navegador que precisam de HTTP, como microfone, execute na raiz do repositório:

```powershell
python -m http.server 8123 --directory Portfolio/wwwroot
```

Então abra `http://localhost:8123/`. Outra opção, se o .NET 10 estiver instalado, é executar `./dev-serve.ps1` e abrir `http://localhost:5173`.

No celular, use um servidor acessível pela rede local ou um endereço HTTPS. Permissões de microfone exigem contexto seguro; abrir um arquivo HTML diretamente não substitui esse teste.

## Onde atualizar

| Conteúdo | Arquivos principais |
| --- | --- |
| Texto, títulos, projetos, créditos e links | `Portfolio/wwwroot/index.html` e as versões `es/index.html`, `en/index.html`, `fr/index.html` |
| Aparência e adaptação a telas | `Portfolio/wwwroot/css/style.css` |
| Navegação, conteúdo interativo e controles | `Portfolio/wwwroot/js/app.js` |
| Imagem generativa e shaders | `Portfolio/wwwroot/js/shader.js` e `fractal.js` |
| Microfone e som | `Portfolio/wwwroot/js/audio.js` |
| Dados de referência dos serviços | `Portfolio/wwwroot/js/projects.js` |
| Configuração da publicação estática | `vercel.json` |

### Acrescentar uma nova experiência ao portfólio

1. Escolha a seção adequada em `Portfolio/wwwroot/index.html` e acrescente o novo registro perto de trabalhos relacionados. Preserve os elementos e classes usados pelos registros existentes (`details`, `summary`, `record`, `sheet`) para manter navegação e aparência.
2. Escreva o texto em português e traduza o mesmo fato para `es/index.html`, `en/index.html` e `fr/index.html`. Mantenha os mesmos IDs e a mesma ordem de navegação nas quatro páginas. IDs são destinos de links: não os reutilize nem os renomeie sem atualizar todos os links que apontam para eles.
3. Coloque mídias novas em `Portfolio/wwwroot/img/`. Use nomes descritivos, texto `alt` que explique o conteúdo, créditos e dimensões da imagem. Para fotos, siga o padrão de galeria existente e inclua as variantes em `img/responsive/` somente quando forem preparadas.
4. Atualize texto alternativo e legenda em cada idioma. Não publique serviços marcados `CONFIRMAR` em `projects.js` ou no HTML sem confirmar antes que estão disponíveis.
5. Execute as verificações abaixo, abra as quatro páginas e confira especialmente a largura de celular, navegação, mídia e controles interativos.

### Regras para manter o projeto simples

- Edite a fonte em `Portfolio/wwwroot`; não edite `dist/`, `bin/`, `obj/` ou `.vs/` como conteúdo do site.
- Mantenha os caminhos de recursos relativos para que a página abra localmente e funcione no endereço publicado.
- Não apague imagens apenas porque não aparecem na página: algumas referências estão comentadas como material pendente. Confira também comentários de galeria e `PENDENCIAS.md` antes de remover mídia.
- `projects.js` mantém um contrato auxiliar carregado pelas páginas. Os registros visíveis são editoriais e ficam no HTML; não crie uma segunda cópia das descrições em JavaScript.
- Atualize os quatro idiomas na mesma alteração. Confira `PENDENCIAS.md` e `CORRECOES-MANUAIS.txt` para pendências editoriais e convenções detalhadas já registradas.

## Verificações locais

Com Node.js, na raiz:

```powershell
node tools/validate-site.mjs
node --check Portfolio/wwwroot/js/app.js
node --check Portfolio/wwwroot/js/audio.js
node --check Portfolio/wwwroot/js/fractal.js
node --check Portfolio/wwwroot/js/projects.js
node --check Portfolio/wwwroot/js/shader.js
```

O verificador confere links e arquivos locais, destinos internos, IDs duplicados ou ausentes nas traduções, `lang`, título e `alt`. Ele é uma verificação estática: não substitui abrir o site, testar microfone com permissão nem conferir o celular físico. Para verificar também o projeto local em .NET, execute `dotnet build Portfolio/Portfolio.csproj` com o SDK correspondente instalado.

## Publicação

A Vercel copia `Portfolio/wwwroot` para `dist` segundo `vercel.json`. Não há publicação automática configurada neste guia. Depois das verificações, revise as alterações no Git e faça o push manual quando quiser publicar. O README descreve a rotina; não faça commit, push ou deploy sem solicitação explícita.
