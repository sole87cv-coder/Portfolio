/*
  Itens do portfólio em ordem cronológica.
  sub:true  -> aparece como subitem, recuado sob o item anterior
  images    -> [arquivo em img/, legenda]
  jump      -> botões que levam a outro item: [rótulo, id]
  mode      -> padrão do shader (0 a 4); hue só desloca a fase
  Datas marcadas "a confirmar" precisam da sua revisão.
*/
window.PROJECTS = [
  { id: "bio", when: "Biografia", title: "Sol Emanuel Calderón Vargas", subtitle: "Artista audiovisual e multiartista",
    text: "Colombiano, vive em São Paulo há mais de 12 anos. Licenciado em Artes Visuais e mestre em História da Arte pela Unifesp, trabalha entre audiovisual, video mapping, iluminação, cenografia e instalações imersivas. Sua pesquisa e produção se entrelaçam na experiência da Ocupação Artística Ouvidor 63, onde atua desde 2014. Com bolsa da FAPESP, pesquisou práticas, conexões e saberes de artistas autônomos e nômades nesse espaço. Integra o coletivo Sucata Quântica desde 2019 e cria cenografias, expografias e dispositivos de iluminação com materiais reaproveitados. Suas obras aproximam imagem, som, arquitetura e memória, explorando como a criação coletiva transforma os espaços e os modos de habitá-los.",
    tags: ["Audiovisual", "Video mapping", "Iluminação", "Cenografia", "Instalações imersivas"],
    specs: [["Origem", "Colômbia, em São Paulo há 12+ anos"], ["Licenciatura", "Artes Visuais (2016–2019)"], ["Mestrado", "História da Arte, Unifesp (2023–2025)"], ["Coletivos", "Ouvidor 63 (2014), Sucata Quântica (2019)"]],
    images: [["retrato-capa.jpg"], ["retrato-rio.jpg"]],
    jump: [["Ouvidor 63", "ouvidor63"], ["Sucata Quântica", "sucata"], ["Mestrado", "mestrado"]],
    mode: 4, hue: 0.1, tone: [262, 330, 392] },

  { id: "bogota", when: "2009–2013", title: "Formação em Bogotá", subtitle: "Design, técnicas artísticas e artes visuais",
    text: "Os primeiros anos de formação, na Colômbia, entre o design gráfico, as técnicas artísticas e as artes plásticas e visuais.",
    tags: [], specs: [["2009", "Design Gráfico, Corporación Escuela de Artes y Letras"], ["2010", "Técnicas Artísticas, Corporación Escuela de Artes y Letras"], ["2010–2013", "Artes Plásticas e Visuais, ASAB, Universidad Distrital Francisco José de Caldas"]],
    mode: 3, hue: 0.2, tone: [220, 262] },

  { id: "ouvidor63", when: "Desde 2014", title: "Ocupação Ouvidor 63", subtitle: "Artista audiovisual e técnico de projeção",
    text: "Atuação em registros audiovisuais, projeções mapeadas, videoinstalações e criação de ambientes visuais para performances, saraus, espetáculos e eventos culturais. É o território em que a prática artística e a pesquisa de Sol se encontram.",
    tags: ["Video mapping", "Videoinstalação", "Performance"], specs: [],
    jump: [["Lab Novas Mídias", "lab63"], ["Memorial da Resistência", "memorial"]],
    mode: 0, hue: 0.3, tone: [196, 247, 294] },

  { id: "licenciatura", when: "2016–2019", title: "Licenciatura em Artes Visuais", subtitle: "Centro Universitário Estácio de Sá, São Paulo",
    text: "Formação docente em artes, em paralelo ao trabalho na Ouvidor 63.", tags: [], specs: [],
    mode: 3, hue: 0.4, tone: [247, 294] },

  { id: "lab63", when: "2018", title: "Laboratório Novas Mídias (Lab63)", subtitle: "II Bienal da Ouvidor 63 e Red Bull Station",
    text: "Integrante do coletivo nascido das experiências e da realização da II Bienal da Ouvidor 63, voltado à pesquisa, experimentação e prática profissional em audiovisual e novas mídias. Organização e facilitação de laboratório de video mapping, projeções mapeadas, vídeos 360° e experimentações aplicadas às artes cênicas e ao circo. A atuação se ampliou no programa OCUPAÇÃO, da Red Bull Station.",
    tags: ["Video mapping", "Vídeo 360°", "Artes cênicas", "Circo"], specs: [],
    images: [["lab-novas-midias.jpg", "Sinalização do Lab Novas Mídias na Ouvidor 63"]],
    links: [["Instagram", "@coletivolab63", "https://www.instagram.com/coletivolab63"]],
    mode: 4, hue: 0.5, tone: [330, 392] },

  { id: "sucata", when: "Desde 2019", title: "Sucata Quântica", subtitle: "Cenografia, iluminação e upcycling",
    text: "Cenografias, expografias e dispositivos de iluminação com materiais reaproveitados e tecnologias alternativas. Como oficineiro de upcycling no SESC e em organizações sociais, ministra oficinas de luminárias, mobiliário e dispositivos cênicos feitos de sucata.",
    tags: ["Upcycling", "Cenografia", "Expografia", "Oficinas"], specs: [],
    images: [["sucata-van.jpg", "Van da Sucata Quântica montada como estação de trabalho"]],
    links: [["Site", "sucataquantica.com", "https://www.sucataquantica.com"], ["Instagram", "@sucataquantica", "https://www.instagram.com/sucataquantica"]],
    mode: 2, hue: 0.6, tone: [110, 165, 220] },

  { id: "mestrado", when: "2023–2025", title: "Mestrado em História da Arte e pesquisa FAPESP", subtitle: "Unifesp",
    text: "Pesquisa participante no projeto Ocupações: arte, espaço e reinvenção da vida cotidiana a partir da ocupação cultural Ouvidor 63, com foco em práticas artísticas, território e experiências coletivas. Articulou entrevistas e registros das trajetórias e redes de artistas autônomos e nômades que constituem esse espaço.",
    tags: ["História da Arte", "Pesquisa participante", "FAPESP"], specs: [],
    jump: [["Voltar à biografia", "bio"]],
    mode: 1, hue: 0.7, tone: [294, 392, 440] },

  { id: "memorial", when: "Data a confirmar", title: "Memorial da Resistência", subtitle: "Ouvidor 63: Habitar a Arte",
    text: "Em diálogo com a exposição temporária Ouvidor 63: Habitar a Arte, o Memorial da Resistência apresenta oficinas, performances e atividades de artistas-moradores da Ocupação, espaço autogerido que une luta por moradia e prática artística. A proposta audiovisual de Sol: video mapping em escala que faz as escadas da ocupação aparecerem no espaço, e projeção no teto de ações feitas pelos artistas da Ouvidor 63.",
    tags: ["Video mapping", "Projeção"], specs: [],
    images: [["mapping-escadas.jpg", "Video mapping das escadas, com a marca ON projetada"], ["projecao-teto.jpg", "Projeção de luz azul no teto de uma sala"]],
    links: [["Exposição virtual", "Visitar no Matterport", "https://discover.matterport.com/space/EdZkVLG998V"]],
    mode: 0, hue: 0.8, tone: [262, 392] },

  { id: "masp", when: "18 abr 2026", title: "Oficina Microcidades · MASP", subtitle: "Com o coletivo Sucata Quântica",
    text: "Sábado, 18 de abril de 2026, das 15h às 17h, no Vão Livre: atividade no Museu de Arte de São Paulo Assis Chateaubriand dedicada à criação de microcidades com materiais reaproveitados. A ação convidou principalmente crianças a construir coletivamente pequenas cidades imaginárias a partir de sucata, estimulando criatividade, consciência ambiental e experimentação artística pelo brincar.",
    tags: ["Oficina", "Sucata", "Criação coletiva"], specs: [],
    images: [["masp-cartaz.jpg", "Cartaz da oficina Construção de microcidades em sucata, no Vão Livre do MASP"], ["masp-ferramentas.jpg", "Caixa de ferramentas da oficina sobre um carrinho"], ["masp-oficina.jpg", "Quadro do vídeo da Oficina Microcidades sob o vão do MASP"]],
    mode: 0, hue: 0.9, tone: [165, 220, 262] },

  { id: "embarcados", when: "Em curso", title: "Eletrônica embarcada", subtitle: "ESP32, Arduino Leonardo e afins",
    text: "Instrumentos, luz e interfaces feitos à mão: firmware em PlatformIO, fitas de LED, áudio por DAC e interfaces web. Os subitens abaixo mostram cada projeto.",
    tags: ["ESP32", "Arduino Leonardo", "PlatformIO", "WS2811"], specs: [],
    mode: 3, hue: 0.0, tone: [262, 330, 392] },

  { id: "fita-ws2811", sub: true, when: "Início", title: "FitaWS2811", subtitle: "Os primeiros pixels",
    text: "Projeto em PlatformIO para Arduino Leonardo que acende e anima uma fita WS2811. Base de tudo o que veio depois: endereçar cada pixel e controlar cor e movimento.",
    tags: ["Arduino Leonardo", "PlatformIO", "WS2811"], specs: [["Placa", "Arduino Leonardo"], ["Saída", "Fita WS2811"], ["Ambiente", "PlatformIO"]],
    mode: 0, hue: 0.02, tone: [262, 330] },

  { id: "cyber-synth", sub: true, when: "ESP32", title: "CYBER_SYNTH", subtitle: "Controle pelo celular via Wi-Fi",
    text: "Um ESP32 vira ponto de acesso Wi-Fi (rede CYBER_SYNTH) e entrega uma interface web. Do celular, o visitante controla LEDs e um alto-falante 8-bit sem instalar nada.",
    tags: ["ESP32", "Wi-Fi AP", "Web UI", "Som 8-bit"], specs: [["Rede", "CYBER_SYNTH"], ["Controle", "Celular via navegador"], ["Arquivos", "main, web, leds"]],
    mode: 1, hue: 0.55, tone: [392, 523] },

  { id: "kx-101", sub: true, when: "ESP32", title: "KX-101 groove synth", subtitle: "Sintetizador de botões com luz",
    text: "Quatro botões de arcade disparam quatro grooves sequenciados: Drum and Bass, House, Trance e Hypnotic. Dois potenciômetros mexem em velocidade, volume, eco e ruído, e a fita de 100 pixels responde com ecos de luz sincronizados ao delay do áudio.",
    tags: ["ESP32", "DAC duplo", "WS2811", "Arcade"],
    specs: [["Botões", "4 arcade (GPIO 32, 33, 27, 14)"], ["Áudio", "DAC duplo (GPIO 25 e 26)"], ["LEDs", "100 pixels WS2811 (GPIO 5)"], ["Potenciômetros", "GPIO 34 e 35"], ["Mixagem", "Ganho por voz e soft-clipping"]],
    mode: 2, hue: 0.83, tone: [110, 165, 220, 330] },

  { id: "v1su4rt", sub: true, when: "2026", title: "v1su4rt · ESF-01", subtitle: "Shaders que respondem a você",
    text: "PWA estático publicado no GitHub Pages. Os shaders reagem ao microfone e ao giroscópio, com controle de sensibilidade para cada sensor.",
    tags: ["PWA", "GLSL", "Microfone", "Giroscópio"], specs: [["Entrada", "Microfone e giroscópio"], ["Gráficos", "GLSL ES 1.0 com fallback Canvas2D"], ["Publicação", "GitHub Pages"]],
    mode: 4, hue: 0.7, tone: [330, 440, 660] },

  { id: "lab-integrado", sub: true, when: "Em curso", title: "Laboratório audiovisual integrado", subtitle: "Uma ferramenta só, em vez de várias",
    text: "A meta é unir toda a cadeia de ferramentas em um ambiente único, do firmware ao visual ao vivo.",
    tags: ["Visual Studio 2026", "TouchDesigner", "Resolume Arena 7", "Blender", "Lumikit", "Python", "Git"],
    specs: [["Código", "Visual Studio 2026, PlatformIO"], ["Visual", "TouchDesigner, Resolume Arena 7, Blender"], ["Luz", "Lumikit e LumikitShow"], ["Versão", "Git Bash e GitKraken"]],
    mode: 3, hue: 0.35, tone: [196, 294, 392] },

  { id: "referencias", when: "Referências", title: "Links de referência", subtitle: "Para ver mais de perto",
    text: "Sites, redes e leituras ligados aos lugares, coletivos e instituições deste portfólio.", tags: [], specs: [],
    links: [
      ["--", "Ouvidor 63"],
      ["Lab Novas Mídias", "Instagram @coletivolab63", "https://www.instagram.com/coletivolab63"],
      ["II Bienal", "Dissertação (USP) sobre a II Bienal da Ouvidor 63", "https://teses.usp.br/teses/disponiveis/16/16136/tde-06102021-224109"],
      ["Leitura", "Ocupa Ouvidor 63: arte, ocupação e artivismos (UFMG)", "https://periodicos.ufmg.br/index.php/indisciplinar/article/view/32708"],
      ["--", "Memorial da Resistência"],
      ["Exposição virtual", "Ouvidor 63: Habitar a Arte (Matterport)", "https://discover.matterport.com/space/EdZkVLG998V"],
      ["Site", "memorialdaresistenciasp.org.br", "https://memorialdaresistenciasp.org.br"],
      ["--", "Sucata Quântica"],
      ["Site", "sucataquantica.com", "https://www.sucataquantica.com"],
      ["Instagram", "@sucataquantica", "https://www.instagram.com/sucataquantica"],
      ["--", "Instituições"],
      ["MASP", "masp.org.br", "https://masp.org.br"],
        ["Unifesp", "unifesp.br", "https://repositorio.unifesp.br/items/1da13160-2200-4081-a790-5c125b83cfb9"],
            ["--", "v1su4rt"],
      ["Instagram", "@v1su4rt", "https://instagram.com/v1su4rt"]
    ],
    mode: 3, hue: 0.95, tone: [392, 494] },

  { id: "contato", when: "Agora", title: "Contato", subtitle: "Vamos conversar",
    text: "Projetos, colaborações e trabalhos audiovisuais. Abra o canal que preferir ou copie o contato.", tags: [], specs: [],
    links: [
      ["E-mail", "sol.emanuel@unifesp.br", "mailto:sol.emanuel@unifesp.br", "copy"],
      ["Instagram", "@v1su4rt", "https://instagram.com/v1su4rt"],
      ["WhatsApp", "+55 11 95793-6951", "https://wa.me/5511957936951", "copy"]
    ],
    jump: [["Links de referência", "referencias"], ["Voltar à biografia", "bio"]],
    mode: 3, hue: 0.9, tone: [523, 659, 784] }
];
