# Portfólio interativo S0LE · v1su4rt

Site estático com linha do tempo, shaders WebGL interativos e microfone.
Empacotado como projeto do Visual Studio 2026 (ASP.NET Core vazio servindo `wwwroot`).

## Abrir no Visual Studio 2026
1. Abra `Portfolio.sln`.
2. Pressione F5 (ou Ctrl+F5). O site abre em http://localhost:5173.
   Requer o SDK do .NET 10, que acompanha o Visual Studio 2026.

## Sem Visual Studio
Abra `Portfolio/wwwroot/index.html` direto no navegador.
O microfone exige `localhost` ou HTTPS, então prefira rodar pelo Visual Studio.

## Editar o conteúdo
Tudo fica em `Portfolio/wwwroot/js/projects.js`:
- troque o campo `when` pela data real de cada etapa;
- ajuste título, texto, tags e specs;
- `mode` escolhe o padrão do shader (0 a 4) e `hue` a cor base.

## Arquivos
- `js/shader.js`: fundo WebGL (GLSL ES 1.0) com fallback Canvas2D
- `js/audio.js`: microfone e tons 8-bit
- `js/app.js`: linha do tempo, controles e interação
- `css/style.css`: layout responsivo (celular, tablet e desktop)

## Publicar
Copie o conteúdo de `wwwroot` para o GitHub Pages ou qualquer hospedagem estática.

## Conteúdo e fotos
- Fotos em `Portfolio/wwwroot/img` (já reduzidas para a web). Para trocar, mantenha o nome ou edite `images` em `projects.js`.
- `sub: true` em um item o coloca como subitem recuado (usado nos projetos ESP32 e Leonardo).
- `jump` cria botões que levam a outro item, ligando biografia, formação e obras.
- Itens com "Data a confirmar" precisam da sua revisão.

## Novidades desta versão
- Logos interativos no topo: o logo Se leva à biografia (e revela a cor ao passar o mouse); o v1su4rt leva ao projeto. Ambos pulsam com o microfone.
- Menu "Shader e vista": escolha Automática, Desktop, Tablet ou Celular para pré-visualizar cada layout.
- Fotos ampliam ao clicar. O item "Links de referência" reúne os links; edite em `projects.js`.
- Contatos como links, com botão de copiar para e-mail e WhatsApp.
