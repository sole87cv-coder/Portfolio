/*
  Conteúdo editorial do portfólio.
  Para publicar um trabalho novo, duplique um item, use um id único e preencha
  category, kind, when, title, subtitle, text, tags, specs, images e links.
  Categorias: works, research, collective, interactive, education, profile, info.
  mode: padrão visual do shader (0-4); hue e tone personalizam o ambiente.
*/
window.PROJECTS = [
  {
    id: "bio", category: "profile", kind: "Perfil", when: "Perfil",
    title: "Sol Emanuel Calderón Vargas", subtitle: "Artista audiovisual e pesquisador",
    text: "Artista audiovisual e multiartista colombiano radicado em São Paulo desde 2014. Licenciado em Artes Visuais e mestre em História da Arte pela Unifesp, desenvolve trabalhos entre audiovisual, video mapping, iluminação, cenografia, instalações imersivas e sistemas interativos. Sua prática se entrelaça à experiência da Ocupação Artística Ouvidor 63 e à pesquisa sobre artistas autônomos e nômades, realizada com bolsa FAPESP. Integrante da Sucata Quântica desde 2019, cria cenografias, expografias e dispositivos de iluminação com materiais reaproveitados e tecnologias alternativas. Em diferentes projetos, investiga como imagem, som e luz podem ativar espaços, memórias e formas de criação coletiva.",
    tags: ["Audiovisual", "Video mapping", "Pesquisa", "Cenografia", "Sistemas interativos"],
    specs: [["Origem", "Colômbia; radicado em São Paulo desde 2014"], ["Licenciatura", "Artes Visuais (2016-2019)"], ["Mestrado", "História da Arte, Unifesp (2023-2025)"], ["Atuação coletiva", "Ouvidor 63; Sucata Quântica"]],
    images: [["retrato-capa.jpg", "Retrato de Sol Emanuel Calderón Vargas", "Retrato em preto e branco de Sol Emanuel Calderón Vargas"], ["retrato-rio.jpg", "Sol Emanuel junto ao rio", "Sol Emanuel em pé junto ao rio, com edifícios ao fundo"]],
    jump: [["Ver trabalhos", "memorial"], ["Pesquisa de mestrado", "mestrado"], ["Sucata Quântica", "sucata"]],
    mode: 4, hue: 0.1, tone: [262, 330, 392]
  },
  {
    id: "bogota", category: "education", kind: "Formação", when: "2009-2013",
    title: "Formação em Bogotá", subtitle: "Design, técnicas artísticas e artes visuais",
    text: "Formação inicial na Colômbia, entre design gráfico, técnicas artísticas e artes plásticas e visuais.",
    tags: ["Formação", "Design", "Artes visuais"],
    specs: [["2009", "Design Gráfico, Corporación Escuela de Artes y Letras"], ["2010", "Técnicas Artísticas, Corporación Escuela de Artes y Letras"], ["2010-2013", "Artes Plásticas e Visuais, ASAB, Universidad Distrital Francisco José de Caldas"]],
    mode: 3, hue: 0.2, tone: [220, 262]
  },
  {
    id: "ouvidor63", category: "collective", kind: "Território e atuação", when: "Desde 2014",
    title: "Ocupação Artística Ouvidor 63", subtitle: "Audiovisual, projeção e criação coletiva",
    role: "Artista audiovisual e técnico de projeção", location: "São Paulo, Brasil",
    text: "Atuação em registros audiovisuais, projeções mapeadas, videoinstalações e criação de ambientes visuais para performances, saraus, espetáculos e eventos culturais. A Ouvidor 63 é também o território de convivência e investigação em que a prática artística de Sol se encontra com modos autônomos de criar, aprender e habitar a cidade.",
    tags: ["Video mapping", "Videoinstalação", "Performance", "Espaços autogeridos"], specs: [],
    jump: [["Lab Novas Mídias", "lab63"], ["Pesquisa de mestrado", "mestrado"], ["Memorial da Resistência", "memorial"]],
    mode: 0, hue: 0.3, tone: [196, 247, 294]
  },
  {
    id: "licenciatura", category: "education", kind: "Formação", when: "2016-2019",
    title: "Licenciatura em Artes Visuais", subtitle: "Centro Universitário Estácio de Sá, São Paulo",
    text: "Formação docente em artes realizada em paralelo à atuação na Ocupação Artística Ouvidor 63.",
    tags: ["Formação", "Artes visuais", "Educação"], specs: [],
    mode: 3, hue: 0.4, tone: [247, 294]
  },
  {
    id: "lab63", category: "collective", kind: "Laboratório coletivo", when: "2018",
    title: "Laboratório Novas Mídias (Lab 63)", subtitle: "II Bienal da Ouvidor 63 e programa OCUPAÇÃO",
    role: "Integrante; organização e facilitação de laboratório", location: "Ouvidor 63 e Red Bull Station",
    text: "Integrante do coletivo surgido das experiências da II Bienal da Ouvidor 63, voltado à pesquisa e experimentação em audiovisual e novas mídias. Participou da organização e facilitação de atividades de video mapping, projeções mapeadas, vídeos 360° e experimentações aplicadas às artes cênicas e ao circo. A atuação também se ampliou no programa OCUPAÇÃO, da Red Bull Station.",
    tags: ["Video mapping", "Vídeo 360°", "Artes cênicas", "Circo", "Mediação"], specs: [],
    images: [["lab-novas-midias.jpg", "Sinalização do Laboratório Novas Mídias na Ouvidor 63", "Cartaz do Laboratório Novas Mídias exposto na Ouvidor 63"]],
    links: [["Instagram", "@coletivolab63", "https://www.instagram.com/coletivolab63"]],
    mode: 4, hue: 0.5, tone: [330, 392]
  },
  {
    id: "sucata", category: "collective", kind: "Coletivo e prática", when: "Desde 2019",
    title: "Sucata Quântica", subtitle: "Cenografia, iluminação e upcycling",
    role: "Integrante; cenografia, iluminação e oficinas", collaborators: "Coletivo Sucata Quântica",
    text: "No coletivo Sucata Quântica, Sol desenvolve cenografias, expografias e dispositivos de iluminação com materiais reaproveitados e tecnologias alternativas. Também atua como oficineiro de upcycling no SESC e em organizações sociais, propondo a criação de luminárias, mobiliário e dispositivos cênicos a partir de sucata.",
    tags: ["Upcycling", "Cenografia", "Expografia", "Iluminação", "Oficinas"], specs: [],
    images: [["sucata-van.jpg", "Van da Sucata Quântica montada como estação de trabalho", "Van amarela da Sucata Quântica equipada com ferramentas e materiais de trabalho"]],
    links: [["Site", "sucataquantica.com", "https://www.sucataquantica.com"], ["Instagram", "@sucataquantica", "https://www.instagram.com/sucataquantica"]],
    mode: 2, hue: 0.6, tone: [110, 165, 220]
  },
  {
    id: "mestrado", category: "research", kind: "Pesquisa", when: "2023-2025",
    title: "Constelações da Arte Autônoma", subtitle: "Práticas, conexões e saberes em movimento na Ouvidor 63",
    role: "Pesquisador", location: "Unifesp e Ocupação Artística Ouvidor 63",
    text: "Pesquisa de mestrado em História da Arte na Unifesp, realizada com bolsa FAPESP. A investigação aborda práticas artísticas, território e experiências coletivas na Ocupação Artística Ouvidor 63. Com pesquisa participante, questionários e entrevistas, acompanha trajetórias, redes e saberes de artistas autônomos e nômades, pensando a ocupação como espaço de criação, aprendizagem e reinvenção da vida cotidiana.",
    tags: ["História da Arte", "Pesquisa participante", "FAPESP", "Ouvidor 63"],
    specs: [["Instituição", "Universidade Federal de São Paulo (Unifesp)"], ["Período", "2023-2025"], ["Apoio", "FAPESP, processo 2023/03423-1"]],
    jump: [["Ouvidor 63", "ouvidor63"], ["Voltar à biografia", "bio"]],
    mode: 1, hue: 0.7, tone: [294, 392, 440]
  },
  {
    id: "memorial", category: "works", kind: "Instalação e projeção", when: "Data não informada",
    title: "Ouvidor 63: Habitar a Arte", subtitle: "Projeção audiovisual no Memorial da Resistência",
    role: "Proposta audiovisual: video mapping e projeção no teto", location: "Memorial da Resistência de São Paulo",
    text: "Em diálogo com a exposição dedicada à Ocupação Artística Ouvidor 63, a proposta audiovisual articula video mapping nas escadarias e projeções no teto com registros das atividades dos artistas moradores. A arquitetura torna-se superfície de imagem e espaço de encontro entre memória, ocupação cultural e práticas coletivas. A data da participação ainda precisa ser confirmada.",
    tags: ["Video mapping", "Projeção", "Memória", "Arquitetura"], specs: [],
    images: [["mapping-escadas.jpg", "Projeção mapeada nas escadas", "Video mapping projetado sobre uma escadaria no espaço expositivo"], ["projecao-teto.jpg", "Projeção de luz no teto de uma sala", "Projeção azul no teto de uma sala escura"]],
    links: [["Exposição virtual", "Ouvidor 63: Habitar a Arte", "https://discover.matterport.com/space/EdZkVLG998V"]],
    mode: 0, hue: 0.8, tone: [262, 392]
  },
  {
    id: "masp", category: "workshop", kind: "Oficina coletiva", when: "18 abr 2026",
    title: "Oficina Microcidades · MASP", subtitle: "Com o coletivo Sucata Quântica",
    role: "Participação em atividade educativa", collaborators: "Coletivo Sucata Quântica",
    location: "Vão Livre do MASP, São Paulo",
    text: "Em 18 de abril de 2026, das 15h às 17h, no Vão Livre do MASP, a atividade convidou principalmente crianças a construir coletivamente pequenas cidades imaginárias com materiais reaproveitados. A oficina articulou brincar, experimentação artística e criação coletiva a partir da sucata.",
    tags: ["Oficina", "Sucata", "Criação coletiva", "MASP"], specs: [["Data", "18 de abril de 2026"], ["Local", "Vão Livre do MASP, São Paulo"], ["Coletivo", "Sucata Quântica"]],
    images: [["masp-cartaz.jpg", "Cartaz da oficina Construção de microcidades em sucata", "Cartaz do MASP anuncia a oficina Construção de microcidades em sucata no Vão Livre em 18 de abril"], ["masp-ferramentas.jpg", "Ferramentas usadas na oficina", "Caixa de ferramentas sobre carrinho durante a oficina"], ["masp-oficina.jpg", "Registro audiovisual da Oficina Microcidades", "Registro da oficina sob o Vão Livre do MASP, com a van amarela da Sucata Quântica"]],
    mode: 0, hue: 0.9, tone: [165, 220, 262]
  },
  {
    id: "embarcados", category: "interactive", kind: "Pesquisa de dispositivos", when: "Em desenvolvimento",
    title: "Eletrônica embarcada", subtitle: "ESP32, Arduino e interfaces físicas",
    role: "Pesquisa e desenvolvimento de protótipos audiovisuais",
    text: "Pesquisa de instrumentos e interfaces que conectam luz, som e interação. Os experimentos incluem firmware em PlatformIO, fitas de LED, áudio por DAC e controles acessíveis por botões, potenciômetros ou navegador.",
    tags: ["ESP32", "Arduino", "PlatformIO", "WS2811", "Som"], specs: [],
    mode: 3, hue: 0.0, tone: [262, 330, 392]
  },
  {
    id: "fita-ws2811", sub: true, category: "interactive", kind: "Experimento eletrônico", when: "Em desenvolvimento",
    title: "FitaWS2811", subtitle: "Controle de pixels e movimento",
    text: "Projeto em PlatformIO para Arduino Leonardo que controla e anima uma fita WS2811, explorando endereçamento individual, cor e movimento.",
    tags: ["Arduino Leonardo", "PlatformIO", "WS2811"], specs: [["Placa", "Arduino Leonardo"], ["Saída", "Fita WS2811"], ["Ambiente", "PlatformIO"]],
    mode: 0, hue: 0.02, tone: [262, 330]
  },
  {
    id: "cyber-synth", sub: true, category: "interactive", kind: "Instrumento interativo", when: "ESP32",
    title: "CYBER_SYNTH", subtitle: "Controle pelo celular via Wi-Fi",
    text: "Um ESP32 cria a rede Wi-Fi CYBER_SYNTH e disponibiliza uma interface web. Pelo navegador do celular, o público pode controlar LEDs e um alto-falante 8-bit sem instalar um aplicativo.",
    tags: ["ESP32", "Wi-Fi", "Interface web", "Som 8-bit"], specs: [["Rede", "CYBER_SYNTH"], ["Controle", "Celular via navegador"], ["Sistema", "ESP32"]],
    mode: 1, hue: 0.55, tone: [392, 523]
  },
  {
    id: "kx-101", sub: true, category: "interactive", kind: "Instrumento interativo", when: "ESP32",
    title: "KX-101 groove synth", subtitle: "Sintetizador de botões com luz",
    text: "Quatro botões de arcade disparam grooves sequenciados de Drum and Bass, House, Trance e Hypnotic. Potenciômetros controlam velocidade, volume, eco e ruído; uma fita de 100 pixels responde ao áudio com efeitos de luz sincronizados ao delay.",
    tags: ["ESP32", "Sintetizador", "DAC duplo", "WS2811", "Arcade"],
    specs: [["Botões", "4 botões arcade"], ["Áudio", "DAC duplo"], ["Luzes", "100 pixels WS2811"], ["Controles", "Potenciômetros de velocidade e efeitos"]],
    mode: 2, hue: 0.83, tone: [110, 165, 220, 330]
  },
  {
    id: "v1su4rt", sub: true, category: "interactive", kind: "Experimento audiovisual interativo", when: "2026",
    title: "v1su4rt · ESF-01", subtitle: "Shaders reativos ao ponteiro e ao som",
    text: "Experimento audiovisual para navegador que combina shaders GLSL ES 1.0 e animação generativa. O movimento do ponteiro e o som captado pelo microfone modulam os padrões visuais; há controles de velocidade, distorção, cor e sensibilidade. O microfone só é ativado por escolha do visitante. O recurso de giroscópio não está implementado nesta versão.",
    tags: ["GLSL", "WebGL", "Microfone opcional", "Interação por ponteiro"],
    specs: [["Entradas", "Ponteiro e microfone autorizado pelo visitante"], ["Gráficos", "GLSL ES 1.0 com fallback Canvas2D"], ["Estado", "Experimento web"]],
    mode: 4, hue: 0.7, tone: [330, 440, 660]
  },
  {
    id: "lab-integrado", sub: true, category: "interactive", kind: "Pesquisa em desenvolvimento", when: "Em desenvolvimento",
    title: "Laboratório audiovisual integrado", subtitle: "Do firmware à imagem ao vivo",
    text: "Pesquisa em desenvolvimento para aproximar ferramentas de firmware, visualização, projeção, iluminação e produção audiovisual em um fluxo de trabalho integrado.",
    tags: ["Visual Studio", "TouchDesigner", "Resolume", "Blender", "Lumikit", "Python"],
    specs: [["Código e firmware", "Visual Studio, PlatformIO"], ["Imagem e cena", "TouchDesigner, Resolume Arena, Blender"], ["Luz", "Lumikit e LumikitShow"], ["Prototipagem", "Python"]],
    mode: 3, hue: 0.35, tone: [196, 294, 392]
  },
  {
    id: "referencias", category: "info", kind: "Referências", when: "Links",
    title: "Referências e instituições", subtitle: "Coletivos, espaços e pesquisa",
    text: "Links para acompanhar instituições, coletivos e projetos associados a este portfólio.", tags: [], specs: [],
    links: [["Coletivo", "Lab Novas Mídias · Instagram", "https://www.instagram.com/coletivolab63"], ["Exposição virtual", "Ouvidor 63: Habitar a Arte · Matterport", "https://discover.matterport.com/space/EdZkVLG998V"], ["Instituição", "Memorial da Resistência de São Paulo", "https://memorialdaresistenciasp.org.br"], ["Coletivo", "Sucata Quântica · site", "https://www.sucataquantica.com"], ["Coletivo", "Sucata Quântica · Instagram", "https://www.instagram.com/sucataquantica"], ["Instituição", "MASP", "https://masp.org.br"], ["Pesquisa", "Repositório Unifesp", "https://repositorio.unifesp.br/items/1da13160-2200-4081-a790-5c125b83cfb9"], ["Projeto", "v1su4rt · Instagram", "https://instagram.com/v1su4rt"]],
    mode: 3, hue: 0.95, tone: [392, 494]
  },
  {
    id: "contato", category: "info", kind: "Contato", when: "Contato",
    title: "Contato", subtitle: "Projetos, colaborações e trabalhos audiovisuais",
    text: "Para propostas de trabalho, colaborações, oficinas e projetos audiovisuais, escolha um canal abaixo.", tags: [], specs: [],
    links: [["E-mail", "sol.emanuel@unifesp.br", "mailto:sol.emanuel@unifesp.br", "copy"], ["Instagram", "@v1su4rt", "https://instagram.com/v1su4rt"], ["WhatsApp", "+55 11 95793-6951", "https://wa.me/5511957936951", "copy"]],
    jump: [["Referências e instituições", "referencias"], ["Voltar à biografia", "bio"]],
    mode: 3, hue: 0.9, tone: [523, 659, 784]
  }
];
