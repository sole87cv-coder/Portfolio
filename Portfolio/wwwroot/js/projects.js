/* Dados editoriais do portfólio. timelineGroup separa cronologia e estados contínuos. mode 0-4 seleciona a linguagem visual do shader; hue define a paleta cromática do toque. */
window.PROJECTS = [
  {
    "id": "mestrado",
    "menu": true,
    "category": "research",
    "kind": "Pesquisa",
    "when": "2023-2025",
    "featured": true,
    "title": "Mestrado",
    "subtitle": "Constelações da Arte Autônoma · Práticas, conexões e saberes em movimento na Ouvidor 63",
    "role": "Pesquisador",
    "location": "Unifesp e Ocupação Artística Ouvidor 63",
    "text": "Pesquisa de mestrado em História da Arte na Unifesp, feita com bolsa FAPESP. Começa num lugar concreto: a Ocupação Artística Ouvidor 63. Com pesquisa participante, questionários e entrevistas, acompanho trajetórias, redes e saberes de artistas autônomos e nômades. A ocupação aparece aqui como espaço de criação, de aprendizagem e de reinvenção da vida cotidiana.",
    "tags": [
      "História da Arte",
      "Pesquisa participante",
      "FAPESP",
      "Ouvidor 63"
    ],
    "specs": [
      {
        "label": "Instituição",
        "value": "Universidade Federal de São Paulo (Unifesp)"
      },
      {
        "label": "Período",
        "value": "2023-2025"
      },
      {
        "label": "Apoio",
        "value": "FAPESP, processo 2023/03423-1"
      }
    ],
    "images": [
      {
        "src": "mestrado-gt-grupo-de-pesquisa.webp",
        "width": 588,
        "height": 324,
        "caption": "Sessões de grupo de trabalho do Grupo de Pesquisa"
      },
      {
        "src": "mestrado-trajetorias-em-revolta.webp",
        "width": 837,
        "height": 640,
        "caption": "Capa do livro Trajetórias em Revolta"
      },
      {
        "src": "mestrado-projeto-ocupacoes-cartaz.webp",
        "width": 641,
        "height": 643,
        "caption": "Cartaz do Projeto Ocupações"
      }
    ],
    "jump": [
      {
        "label": "Centro Cultural Ouvidor 63",
        "target": "ouvidor63"
      }
    ],
    "mode": 1,
    "hue": 0.7,
    "timelineGroup": "featured"
  },
  {
    "id": "pesquisa-arte-interativa",
    "mobileOnly": true,
    "category": "research",
    "kind": "Pesquisa em andamento",
    "when": "Em andamento",
    "title": "Arte interativa",
    "subtitle": "Descolonização da linguagem artística e sensível por meio de linguagens tecnológicas",
    "text": "Investigo outras formas de perceber o mundo, feitas de comunicação sensível: imagem, som, toque, presença. A pesquisa está em curso, e os registros visuais entram à medida que ficam prontos.",
    "tags": [
      "Arte interativa",
      "Linguagens tecnológicas",
      "Comunicação sensível"
    ],
    "specs": [
      {
        "label": "Estado",
        "value": "Pesquisa em andamento · registros visuais serão acrescentados posteriormente"
      }
    ],
    "jump": [
      {
        "label": "Ver experimento v1su4rt · ESF-01",
        "target": "v1su4rt"
      }
    ],
    "timelineGroup": "research"
  },
  {
    "id": "masp",
    "menu": true,
    "category": "workshop",
    "kind": "Oficina coletiva",
    "when": "18 abr 2026",
    "title": "Oficina Microcidades · MASP",
    "subtitle": "Com o coletivo Sucata Quântica",
    "role": "Participação em atividade educativa",
    "collaborators": "Coletivo Sucata Quântica",
    "location": "Vão Livre do MASP, São Paulo",
    "text": "Em 18 de abril de 2026, das 15h às 17h, no Vão Livre do MASP, convidamos principalmente crianças a construir juntas pequenas cidades imaginárias com material reaproveitado. O brincar virou experimentação artística e a sucata virou cidade: criação coletiva do começo ao fim.",
    "tags": [
      "Oficina",
      "Sucata",
      "Criação coletiva",
      "MASP"
    ],
    "specs": [
      {
        "label": "Data",
        "value": "18 de abril de 2026"
      },
      {
        "label": "Local",
        "value": "Vão Livre do MASP, São Paulo"
      },
      {
        "label": "Coletivo",
        "value": "Sucata Quântica"
      }
    ],
    "images": [
      {
        "src": "masp-cartaz.jpg",
        "caption": "Cartaz da oficina Construção de microcidades em sucata",
        "alt": "Cartaz do MASP anuncia a oficina Construção de microcidades em sucata no Vão Livre em 18 de abril"
      },
      {
        "src": "masp-ferramentas.jpg",
        "caption": "Ferramentas usadas na oficina",
        "alt": "Caixa de ferramentas sobre carrinho durante a oficina"
      },
      {
        "src": "masp-oficina.jpg",
        "caption": "Registro audiovisual da Oficina Microcidades",
        "alt": "Registro da oficina sob o Vão Livre do MASP, com a Kombi amarela da Sucata Quântica"
      }
    ],
    "mode": 3,
    "hue": 0.9,
    "timelineGroup": "dated"
  },
  {
    "id": "v1su4rt",
    "menu": true,
    "sub": true,
    "category": "interactive",
    "kind": "Experimento audiovisual interativo",
    "when": "2026",
    "title": "v1su4rt · ESF-01",
    "subtitle": "Shader interativo de pigmento digital",
    "text": "Experimento audiovisual que roda no navegador, com shaders GLSL ES 1.0 e animação generativa. A base é cinza; cada toque ou clique faz nascer uma mancha de pigmento que se espalha e depois se dissolve de volta no cinza.",
    "tags": [
      "GLSL",
      "WebGL",
      "Interação por ponteiro e toque",
      "Pigmento digital"
    ],
    "specs": [
      {
        "label": "Entradas",
        "value": "Ponteiro e toque"
      },
      {
        "label": "Gráficos",
        "value": "GLSL ES 1.0 com fallback Canvas2D"
      },
      {
        "label": "Estado",
        "value": "Experimento web"
      }
    ],
    "mode": 4,
    "hue": 0.7,
    "timelineGroup": "dated"
  },
  {
    "id": "licenciatura",
    "category": "education",
    "kind": "Formação",
    "when": "2016-2019",
    "title": "Licenciatura em Artes Visuais",
    "subtitle": "Centro Universitário Estácio de Sá, São Paulo",
    "text": "Formação docente em Artes, cursada ao mesmo tempo em que eu já trabalhava na Ocupação Artística Ouvidor 63.",
    "tags": [
      "Formação",
      "Artes visuais",
      "Educação"
    ],
    "specs": [],
    "mode": 0,
    "hue": 0.4,
    "timelineGroup": "dated"
  },
  {
    "id": "bogota",
    "category": "education",
    "kind": "Formação",
    "when": "2009-2013",
    "title": "Formação em Bogotá",
    "subtitle": "Design, técnicas artísticas e artes visuais",
    "text": "Primeira formação, na Colômbia, entre design gráfico, técnicas artísticas e artes plásticas e visuais. Um começo em várias direções, parecido com o jeito que trabalho hoje.",
    "tags": [
      "Formação",
      "Design",
      "Artes visuais"
    ],
    "specs": [
      {
        "label": "2009",
        "value": "Design Gráfico, Corporación Escuela de Artes y Letras"
      },
      {
        "label": "2010",
        "value": "Técnicas Artísticas, Corporación Escuela de Artes y Letras"
      },
      {
        "label": "2010-2013",
        "value": "Artes Plásticas e Visuais, ASAB, Universidad Distrital Francisco José de Caldas"
      }
    ],
    "mode": 0,
    "hue": 0.2,
    "timelineGroup": "dated"
  },
  {
    "id": "sucata",
    "menu": true,
    "category": "collective",
    "kind": "Coletivo e prática",
    "when": "Desde 2019",
    "title": "Sucata Quântica",
    "subtitle": "Cenografia, iluminação e upcycling",
    "role": "Integrante; cenografia, iluminação e oficinas",
    "collaborators": "Coletivo Sucata Quântica",
    "text": "No coletivo Sucata Quântica crio cenografias, expografias e dispositivos de iluminação com materiais reaproveitados e tecnologias alternativas. Também conduzo oficinas de upcycling no SESC e em organizações sociais, onde sucata vira luminária, mobiliário e dispositivo cênico.",
    "tags": [
      "Upcycling",
      "Cenografia",
      "Expografia",
      "Iluminação",
      "Oficinas"
    ],
    "specs": [],
    "images": [
      {
        "src": "sucata-van.jpg",
        "caption": "Kombi da Sucata Quântica montada como estação de trabalho",
        "alt": "Kombi amarela da Sucata Quântica equipada com ferramentas e materiais de trabalho"
      },
      {
        "src": "sucata-cinema.webp",
        "width": 961,
        "height": 1464,
        "caption": ""
      },
      {
        "src": "sucata-raios-e-trovoes.webp",
        "width": 1600,
        "height": 918,
        "caption": ""
      },
      {
        "src": "sucata-jam-session.webp",
        "width": 585,
        "height": 995,
        "caption": ""
      },
      {
        "src": "sucata-a-luz-do-sons.webp",
        "width": 1600,
        "height": 918,
        "caption": ""
      },
      {
        "src": "sucata-historico-102030.webp",
        "width": 770,
        "height": 571,
        "caption": ""
      },
      {
        "src": "sucata-historico-102346.webp",
        "width": 834,
        "height": 541,
        "caption": ""
      },
      {
        "src": "sucata-historico-102547.webp",
        "width": 663,
        "height": 794,
        "caption": ""
      },
      {
        "src": "sucata-historico-102912.webp",
        "width": 812,
        "height": 540,
        "caption": ""
      },
      {
        "src": "sucata-historico-104244.webp",
        "width": 727,
        "height": 549,
        "caption": ""
      },
      {
        "src": "sucata-historico-104818.webp",
        "width": 457,
        "height": 262,
        "caption": ""
      },
      {
        "src": "sucata-historico-105202.webp",
        "width": 776,
        "height": 509,
        "caption": ""
      },
      {
        "src": "sucata-historico-114305.webp",
        "width": 824,
        "height": 675,
        "caption": ""
      },
      {
        "src": "sucata-historico-114557.webp",
        "width": 543,
        "height": 456,
        "caption": ""
      },
      {
        "src": "sucata-historico-101139.webp",
        "width": 800,
        "height": 791,
        "caption": ""
      },
      {
        "src": "sucata-historico-101528.webp",
        "width": 855,
        "height": 785,
        "caption": ""
      }
    ],
    "links": [
      {
        "label": "Site",
        "text": "sucataquantica.com",
        "url": "https://www.sucataquantica.com"
      },
      {
        "label": "Instagram",
        "text": "@sucataquantica",
        "url": "https://www.instagram.com/sucataquantica"
      }
    ],
    "mode": 3,
    "hue": 0.6,
    "timelineGroup": "ongoing"
  },
  {
    "id": "ouvidor63",
    "menu": true,
    "category": "collective",
    "kind": "Atuação cultural e projetos audiovisuais",
    "when": "Desde 2014",
    "title": "Centro Cultural Ouvidor 63",
    "subtitle": "Espaço de criação coletiva, pesquisa e experimentação audiovisual",
    "role": "Artista audiovisual e técnico de projeção na Ouvidor 63; participação na organização e facilitação do Lab 63; no Memorial da Resistência, direção e criação do vídeo projetado no teto e apresentação do video mapping da escada.",
    "location": "São Paulo, Brasil",
    "text": "Centro Cultural Ouvidor 63 é um espaço de criação coletiva, convivência e experimentação artística. Meu trabalho ali é audiovisual: registros, projeções mapeadas, videoinstalações e ambientes visuais para performances, saraus e eventos culturais. No Laboratório Novas Mídias (Lab 63), nascido das experiências da II Bienal da Ouvidor 63, ajudo a organizar e facilitar atividades de video mapping, vídeo 360° e experimentações ligadas às artes cênicas e ao circo. A exposição do Memorial da Resistência foi uma extensão da pesquisa apoiada pela FAPESP: apresentei o video mapping da escada e dirigi e criei o vídeo projetado no teto, que mostra atividades dos artistas da Ouvidor 63.",
    "tags": [
      "Video mapping",
      "Videoinstalação",
      "Performance",
      "Espaços autogeridos",
      "Vídeo 360°",
      "Artes cênicas",
      "Circo",
      "Mediação",
      "Projeção",
      "Memória",
      "Arquitetura"
    ],
    "specs": [
      {
        "label": "Atuação na Ouvidor 63",
        "value": "Registros audiovisuais, projeções mapeadas, videoinstalações e ambientes visuais."
      },
      {
        "label": "Lab 63 · 2018",
        "value": "Laboratório Novas Mídias ligado à II Bienal da Ouvidor 63; participação na organização e facilitação de atividades. O trabalho também se ampliou no programa OCUPAÇÃO, da Red Bull Station."
      },
      {
        "label": "Memorial da Resistência",
        "value": "Extensão da pesquisa apoiada pela FAPESP: video mapping da escada e vídeo sobre atividades dos artistas da Ouvidor 63 projetado no teto, com direção e criação de Sol."
      },
      {
        "label": "Data da exposição",
        "value": "6 de dezembro de 2025."
      }
    ],
    "jump": [
      {
        "label": "Pesquisa de mestrado",
        "target": "mestrado"
      }
    ],
    "mode": 2,
    "hue": 0.3,
    "images": [
      {
        "src": "lab-novas-midias.jpg",
        "caption": "Sinalização do Laboratório Novas Mídias",
        "alt": "Cartaz do Laboratório Novas Mídias exposto na Red Bull Station"
      },
      {
        "src": "mapping-escadas.jpg",
        "caption": "Projeção mapeada nas escadas",
        "alt": "Video mapping projetado sobre uma escadaria no espaço expositivo"
      },
      {
        "src": "projecao-teto.jpg",
        "caption": "Projeção de luz no teto de uma sala no Memorial da Resistência",
        "alt": "Projeção no teto, moradores da Ouvidor 63 performando"
      },
      {
        "src": "ouvidor-memoria-0000.webp",
        "width": 1080,
        "height": 487,
        "caption": ""
      },
      {
        "src": "ouvidor-memoria-0003.webp",
        "width": 960,
        "height": 960,
        "caption": ""
      },
      {
        "src": "ouvidor-freak-000.webp",
        "width": 1600,
        "height": 900,
        "caption": ""
      },
      {
        "src": "ouvidor-img-0122.webp",
        "width": 1192,
        "height": 1600,
        "caption": ""
      },
      {
        "src": "ouvidor-img-0172.webp",
        "width": 1600,
        "height": 1067,
        "caption": ""
      },
      {
        "src": "ouvidor-img-0214.webp",
        "width": 1600,
        "height": 1067,
        "caption": ""
      },
      {
        "src": "ouvidor-img-0228.webp",
        "width": 1600,
        "height": 1252,
        "caption": ""
      },
      {
        "src": "ouvidor-img-0290.webp",
        "width": 1413,
        "height": 1600,
        "caption": ""
      },
      {
        "src": "ouvidor-s0le-0019.webp",
        "width": 1600,
        "height": 1066,
        "caption": ""
      },
      {
        "src": "ouvidor-s0le-0025.webp",
        "width": 1600,
        "height": 1066,
        "caption": ""
      },
      {
        "src": "ouvidor-sole-000.webp",
        "width": 1600,
        "height": 746,
        "caption": ""
      },
      {
        "src": "ouvidor-000.webp",
        "width": 1600,
        "height": 1200,
        "caption": ""
      },
      {
        "src": "ouvidor-003.webp",
        "width": 1274,
        "height": 1600,
        "caption": ""
      },
      {
        "src": "ouvidor-123159.webp",
        "width": 657,
        "height": 551,
        "caption": ""
      },
      {
        "src": "ouvidor-123448.webp",
        "width": 632,
        "height": 496,
        "caption": ""
      }
    ],
    "links": [
      {
        "label": "Instagram",
        "text": "@coletivolab63",
        "url": "https://www.instagram.com/coletivolab63"
      },
      {
        "label": "Exposição virtual",
        "text": "Ouvidor 63: Habitar a Arte",
        "url": "https://discover.matterport.com/space/EdZkVLG998V"
      }
    ],
    "timelineGroup": "ongoing"
  },
  {
    "id": "embarcados",
    "category": "interactive",
    "kind": "Pesquisa de dispositivos",
    "when": "Em desenvolvimento",
    "title": "Eletrônica embarcada",
    "subtitle": "ESP32, Arduino e interfaces físicas",
    "role": "Pesquisa e desenvolvimento de protótipos audiovisuais",
    "text": "Pesquisa de instrumentos e interfaces onde luz, som e interação se encontram. Os experimentos passam por firmware em PlatformIO, fitas de LED, áudio por DAC e controles acessíveis por botões, potenciômetros ou navegador.",
    "tags": [
      "ESP32",
      "Arduino",
      "PlatformIO",
      "WS2811",
      "Som"
    ],
    "specs": [],
    "mode": 1,
    "hue": 0,
    "timelineGroup": "development"
  },
  {
    "id": "fita-ws2811",
    "sub": true,
    "category": "interactive",
    "kind": "Experimento eletrônico",
    "when": "Em desenvolvimento",
    "title": "FitaWS2811",
    "subtitle": "Controle de pixels e movimento",
    "text": "Projeto em PlatformIO para Arduino Leonardo que controla e anima uma fita WS2811: acender pixel por pixel, escolher a cor, inventar o movimento.",
    "tags": [
      "Arduino Leonardo",
      "PlatformIO",
      "WS2811"
    ],
    "specs": [
      {
        "label": "Placa",
        "value": "Arduino Leonardo"
      },
      {
        "label": "Saída",
        "value": "Fita WS2811"
      },
      {
        "label": "Ambiente",
        "value": "PlatformIO"
      }
    ],
    "images": [
      {
        "src": "ilustracao-fita-ws2811.jpg",
        "caption": "Protótipo",
        "alt": "Fita de LEDs endereçáveis, com uma placa de microcontrolador",
        "credit": "F",
        "width": 1280,
        "height": 1024,
        "responsiveWidths": [
          480,
          960
        ]
      }
    ],
    "mode": 4,
    "hue": 0.02,
    "timelineGroup": "development"
  },
  {
    "id": "lab-integrado",
    "sub": true,
    "category": "interactive",
    "kind": "Pesquisa em desenvolvimento",
    "when": "Em desenvolvimento",
    "title": "Laboratório audiovisual integrado",
    "subtitle": "Do firmware à imagem ao vivo",
    "text": "Pesquisa em desenvolvimento para colocar lado a lado o que costuma andar separado: firmware, visualização, projeção, iluminação e produção audiovisual, num fluxo de trabalho só.",
    "tags": [
      "Visual Studio",
      "TouchDesigner",
      "Resolume",
      "Blender",
      "Lumikit",
      "Python"
    ],
    "specs": [
      {
        "label": "Código e firmware",
        "value": "Visual Studio, PlatformIO"
      },
      {
        "label": "Imagem e cena",
        "value": "TouchDesigner, Resolume Arena, Blender"
      },
      {
        "label": "Luz",
        "value": "Lumikit e LumikitShow"
      },
      {
        "label": "Prototipagem",
        "value": "Python"
      }
    ],
    "mode": 3,
    "hue": 0.35,
    "timelineGroup": "development"
  },
  {
    "id": "cyber-synth",
    "sub": true,
    "category": "interactive",
    "kind": "Instrumento interativo",
    "when": "ESP32",
    "title": "CYBER_SYNTH",
    "subtitle": "Controle pelo celular via Wi-Fi",
    "text": "O ESP32 cria a rede Wi-Fi CYBER_SYNTH e serve uma interface web. Pelo navegador do celular, o público controla LEDs e um alto-falante 8-bit sem instalar nenhum aplicativo.",
    "tags": [
      "ESP32",
      "Wi-Fi",
      "Interface web",
      "Som 8-bit"
    ],
    "specs": [
      {
        "label": "Rede",
        "value": "CYBER_SYNTH"
      },
      {
        "label": "Controle",
        "value": "Celular via navegador"
      },
      {
        "label": "Sistema",
        "value": "ESP32"
      }
    ],
    "images": [
      {
        "src": "ilustracao-cyber-synth.jpg",
        "caption": "Ilustração conceitual",
        "alt": "Placa ESP32, Alto-falante, LEDs",
        "credit": "F1",
        "width": 1280,
        "height": 1024,
        "responsiveWidths": [
          480,
          960
        ]
      }
    ],
    "mode": 2,
    "hue": 0.55,
    "timelineGroup": "experiments"
  },
  {
    "id": "kx-101",
    "sub": true,
    "category": "interactive",
    "kind": "Instrumento interativo",
    "when": "ESP32",
    "title": "KX-101 groove synth",
    "subtitle": "Sintetizador de botões com luz",
    "text": "Quatro botões de arcade disparam grooves sequenciados de Drum and Bass, House, Trance e Hypnotic. Potenciômetros regulam velocidade, volume, eco e ruído, e uma fita de 100 pixels responde ao áudio com luz sincronizada ao delay.",
    "tags": [
      "ESP32",
      "Sintetizador",
      "DAC duplo",
      "WS2811",
      "Arcade"
    ],
    "specs": [
      {
        "label": "Botões",
        "value": "4 botões arcade"
      },
      {
        "label": "Áudio",
        "value": "DAC duplo"
      },
      {
        "label": "Luzes",
        "value": "100 pixels WS2811"
      },
      {
        "label": "Controles",
        "value": "Potenciômetros de velocidade e efeitos"
      }
    ],
    "images": [
      {
        "src": "ilustracao-kx-101.jpg",
        "caption": "Ilustração conceitual",
        "alt": "Painel de sintetizador com quatro botões de arcade iluminados em vermelho, azul, verde e âmbar, potenciômetros metálicos entre eles e uma moldura de fita de LEDs, com a placa e a fiação visíveis ao fundo",
        "credit": "F2",
        "width": 1280,
        "height": 1024,
        "responsiveWidths": [
          480,
          960
        ]
      }
    ],
    "mode": 4,
    "hue": 0.83,
    "timelineGroup": "experiments"
  },
  {
    "id": "apps-interativos",
    "menu": true,
    "category": "apps",
    "kind": "Desenvolvimento de aplicativos interativos",
    "when": "Projetos web",
    "title": "Aplicativos interativos",
    "subtitle": "Experiências digitais",
    "text": "Os aplicativos interativos deste portfólio, reunidos em um só lugar para abrir quando você quiser.",
    "tags": [
      "Aplicativos web",
      "Interação"
    ],
    "specs": [],
    "links": [
      {
        "label": "Psycovisao",
        "text": "psycovisao.vercel.app",
        "url": "https://psycovisao.vercel.app"
      },
      {
        "label": "Urut",
        "text": "urut.vercel.app",
        "url": "https://urut.vercel.app"
      },
      {
        "label": "v1su4rt",
        "text": "v1su4rt.vercel.app",
        "url": "https://v1su4rt.vercel.app"
      },
      {
        "label": "Florcloud",
        "text": "florcloud.vercel.app",
        "url": "https://florcloud.vercel.app"
      }
    ],
    "images": [
      {
        "src": "app-psycovisao.webp",
        "caption": "Psyco_Visão · painel de ajustes",
        "alt": "Tela do app Psyco_Visão com o painel Ajustes aberto, as abas Sonho, Som, Ouvir e Sistema, o controle Mostrar vídeo em Visível e o status Olho Cego no topo",
        "width": 487,
        "height": 431
      },
      {
        "src": "app-urut.webp",
        "caption": "Urut · controles sobre a fumaça",
        "alt": "Tela do app Urut com controles deslizantes de sensibilidade de áudio e giroscópio, Fumaça e Folha, velocidade e escolha entre Auto, P&B e Cor, sobre fumaça em preto e branco",
        "width": 487,
        "height": 431
      },
      {
        "src": "app-v1su4rt.webp",
        "caption": "v1su4rt · contornos em pigmento",
        "alt": "Tela do app v1su4rt com anéis concêntricos coloridos sobre fundo preto e o botão Ativar interações na parte inferior",
        "width": 487,
        "height": 431
      },
      {
        "src": "app-florcloud.webp",
        "caption": "Florcloud · painel de interação",
        "alt": "Tela do app Florcloud com o botão Ativar interações e os controles de sensibilidade do áudio e do giroscópio, intensidade da nuvem de pontos e mistura de cor, com uma forma alaranjada à direita",
        "width": 487,
        "height": 431
      }
    ],
    "mode": 4,
    "hue": 0.7,
    "timelineGroup": "undated"
  },
  {
    "id": "canal-youtube",
    "menu": true,
    "category": "works",
    "kind": "Canal audiovisual",
    "when": "YouTube",
    "title": "Canal de vídeo",
    "subtitle": "YouTube · @v1su4rt",
    "text": "Canal onde ficam videoarte, filminutos, videoinstalações e registros artísticos: o que continua existindo depois que a projeção se apaga.",
    "tags": [
      "Videoarte",
      "Filminuto",
      "Videoinstalação",
      "Registro artístico"
    ],
    "specs": [],
    "links": [
      {
        "label": "Vídeo",
        "text": "YouTube · 5KWj1q85Ask",
        "url": "https://www.youtube.com/watch?v=5KWj1q85Ask&t=228s"
      },
      {
        "label": "Vídeo",
        "text": "YouTube · a9IY0p3NGO4",
        "url": "https://youtu.be/a9IY0p3NGO4"
      },
      {
        "label": "Vídeo",
        "text": "YouTube · p1mrPDFdv5A",
        "url": "https://youtu.be/p1mrPDFdv5A"
      },
      {
        "label": "Vídeo",
        "text": "YouTube · YIrcAWCebn4",
        "url": "https://youtu.be/YIrcAWCebn4"
      },
      {
        "label": "Vídeo",
        "text": "YouTube · 2PL-kG6JIKM",
        "url": "https://youtu.be/2PL-kG6JIKM"
      },
      {
        "label": "Canal",
        "text": "YouTube · @v1su4rt-Vj",
        "url": "https://www.youtube.com/@v1su4rt-Vj"
      }
    ],
    "mode": 0,
    "hue": 0.72,
    "timelineGroup": "undated"
  },
  {
    "id": "fotografia-vivitar",
    "menu": true,
    "category": "works",
    "kind": "Fotografia analógica",
    "when": "Atemporal",
    "title": "Fotografias analógicas · VIVITAR",
    "subtitle": "Série fotográfica",
    "text": "Fotografias feitas em filme com uma câmera VIVITAR: grão, luz e um tempo que não se corrige depois.",
    "tags": [
      "Fotografia analógica",
      "VIVITAR",
      "Preto e branco"
    ],
    "specs": [],
    "images": [
      {
        "src": "vivitar-analogica-01.jpg",
        "caption": "Superfície escura e granulada",
        "alt": "Texturas granuladas",
        "width": 720,
        "height": 1080,
        "responsiveWidths": [
          480,
          720
        ]
      },
      {
        "src": "vivitar-analogica-02.jpg",
        "caption": "Luz da vela",
        "alt": "Iluminado",
        "width": 1512,
        "height": 1003,
        "responsiveWidths": [
          480,
          960
        ]
      },
      {
        "src": "vivitar-analogica-03.jpg",
        "caption": "Anhangabaú, Rio do Mau Espírito",
        "alt": "Rastros de luz",
        "width": 1512,
        "height": 1003,
        "responsiveWidths": [
          480,
          960
        ]
      },
      {
        "src": "vivitar-analogica-04.jpg",
        "caption": "Rastros de luz, erros visuais?",
        "alt": "Linhas luminosas atravessam uma composição escura e abstrata",
        "width": 1512,
        "height": 1003,
        "responsiveWidths": [
          480,
          960
        ]
      },
      {
        "src": "vivitar-analogica-05.jpg",
        "caption": "Sombra",
        "alt": "Silhueta",
        "width": 1512,
        "height": 1003,
        "responsiveWidths": [
          480,
          960
        ]
      },
      {
        "src": "vivitar-analogica-06.jpg",
        "caption": "Desfocado",
        "alt": "Paisagem desfocada",
        "width": 1512,
        "height": 1003,
        "responsiveWidths": [
          480,
          960
        ]
      },
      {
        "src": "vivitar-analogica-07.jpg",
        "caption": "Entre nuvens e árvores",
        "alt": "Luz do Sol filtrada por nuvens acima de árvores em silhueta",
        "width": 1512,
        "height": 1003,
        "responsiveWidths": [
          480,
          960
        ]
      },
      {
        "src": "vivitar-analogica-08.jpg",
        "caption": "Espiral",
        "alt": "Espiral, Ubatuba",
        "width": 1512,
        "height": 1003,
        "responsiveWidths": [
          480,
          960
        ]
      },
      {
        "src": "vivitar-analogica-09.jpg",
        "caption": "Contraluz",
        "alt": "Planta de folhas estreitas em primeiro plano diante de uma luz intensa",
        "width": 1512,
        "height": 1003,
        "responsiveWidths": [
          480,
          960
        ]
      },
      {
        "src": "vivitar-analogica-10.jpg",
        "caption": "Ouvidor 63",
        "alt": "Arte",
        "width": 1512,
        "height": 1003,
        "responsiveWidths": [
          480,
          960
        ]
      }
    ],
    "mode": 0,
    "hue": 0.72,
    "timelineGroup": "undated"
  },
  {
    "id": "bio",
    "category": "profile",
    "kind": "Perfil",
    "when": "Perfil",
    "title": "Sol Emanuel Calderón Vargas",
    "subtitle": "Artista audiovisual e pesquisador",
    "text": "Sou colombiano e vivo em São Paulo desde 2014. Terminei a licenciatura em Artes Visuais e fiz mestrado em História da Arte na Unifesp. Trabalho entre audiovisual, video mapping, iluminação, cenografia, instalações imersivas e sistemas interativos. Minha prática se entrelaça à experiência da Ocupação Artística Ouvidor 63 e à pesquisa sobre artistas autônomos e nômades, realizada com bolsa FAPESP. Desde 2019 integro a Sucata Quântica, onde crio cenografias, expografias e dispositivos de iluminação com materiais reaproveitados e tecnologias alternativas. Em cada projeto persigo a mesma pergunta: como imagem, som e luz podem ativar espaços, memórias e formas de criação coletiva.",
    "tags": [
      "Audiovisual",
      "Video mapping",
      "Pesquisa",
      "Cenografia",
      "Sistemas interativos"
    ],
    "specs": [
      {
        "label": "Origem",
        "value": "Colômbia; mora em São Paulo desde 2014"
      },
      {
        "label": "Licenciatura",
        "value": "Artes Visuais (2016-2019)"
      },
      {
        "label": "Mestrado",
        "value": "História da Arte, Unifesp (2023-2025)"
      },
      {
        "label": "Atuação coletiva",
        "value": "Ouvidor 63; Sucata Quântica"
      }
    ],
    "images": [
      {
        "src": "retrato-capa.jpg",
        "caption": "",
        "alt": "Retrato em preto e branco de Sol Emanuel Calderón Vargas"
      },
      {
        "src": "retrato-rio.jpg",
        "caption": "",
        "alt": "Sol Emanuel em pé junto ao rio, com edifícios ao fundo"
      }
    ],
    "jump": [
      {
        "label": "Centro Cultural Ouvidor 63",
        "target": "ouvidor63"
      },
      {
        "label": "Pesquisa de mestrado",
        "target": "mestrado"
      },
      {
        "label": "Sucata Quântica",
        "target": "sucata"
      }
    ],
    "mode": 0,
    "hue": 0.1,
    "timelineGroup": "profile"
  },
  {
    "id": "referencias",
    "category": "info",
    "kind": "Referências",
    "when": "Links",
    "title": "Referências e instituições",
    "subtitle": "Coletivos, espaços e pesquisa",
    "text": "Coletivos, instituições e projetos que acompanham e sustentam este trabalho.",
    "tags": [],
    "specs": [],
    "links": [
      {
        "label": "Instituição",
        "text": "Memorial da Resistência de São Paulo",
        "url": "https://discover.matterport.com/space/EdZkVLG998V"
      },
      {
        "label": "Coletivo",
        "text": "Sucata Quântica · site",
        "url": "https://www.sucataquantica.com"
      },
      {
        "label": "Coletivo",
        "text": "Sucata Quântica · Instagram",
        "url": "https://www.instagram.com/sucataquantica"
      },
      {
        "label": "Instituição",
        "text": "MASP",
        "url": "https://masp.org.br"
      },
      {
        "label": "Pesquisa",
        "text": "Repositório Unifesp",
        "url": "https://repositorio.unifesp.br/items/1da13160-2200-4081-a790-5c125b83cfb9"
      },
      {
        "label": "Projeto",
        "text": "v1su4rt · Instagram",
        "url": "https://instagram.com/v1su4rt"
      }
    ],
    "mode": 1,
    "hue": 0.95,
    "timelineGroup": "profile"
  },
  {
    "id": "contato",
    "category": "info",
    "kind": "Contato",
    "when": "Contato",
    "title": "Contato",
    "subtitle": "Projetos, colaborações e trabalhos audiovisuais",
    "text": "Propostas de trabalho, colaborações, oficinas e projetos audiovisuais são bem-vindas. Escolha um canal abaixo.",
    "tags": [],
    "specs": [],
    "links": [
      {
        "label": "E-mail",
        "text": "v1su4rt87@gmail.com",
        "url": "mailto:v1su4rt87@gmail.com",
        "copy": true
      },
      {
        "label": "Instagram",
        "text": "@v1su4rt",
        "url": "https://instagram.com/v1su4rt"
      },
      {
        "label": "WhatsApp",
        "text": "+55 11 95793-6951",
        "url": "https://wa.me/5511957936951",
        "copy": true
      },
      {
        "label": "E-mail institucional",
        "text": "sol.emanuel@unifesp.br",
        "url": "mailto:sol.emanuel@unifesp.br",
        "copy": true
      }
    ],
    "jump": [
      {
        "label": "Referências e instituições",
        "target": "referencias"
      },
      {
        "label": "Voltar à biografia",
        "target": "bio"
      }
    ],
    "mode": 0,
    "hue": 0.9,
    "timelineGroup": "profile"
  },
  {
    "id": "apoiar",
    "category": "info",
    "kind": "Apoio",
    "title": "Apoio espontâneo",
    "subtitle": "Pix livre para um artista autônomo e migrante",
    "text": "Trabalho por conta própria, como artista migrante. Um Pix livre paga material de sucata, passagem, hospedagem e horas de ateliê para os projetos continuarem. Não existe valor mínimo nem contrapartida: é apoio de quem quer ver o trabalho seguir.",
    "support": {
      "keyLabel": "Chave Pix (telefone)",
      "key": "(11) 95793-6951",
      "copy": "11957936951",
      "qr": "pix-qr.png",
      "qrWidth": 456,
      "qrHeight": 456,
      "alt": "QR Code Pix para doação de apoio espontâneo"
    },
    "tags": [],
    "specs": [],
    "jump": [
      {
        "label": "Canais de contato",
        "target": "contato"
      },
      {
        "label": "Projetos que esse apoio sustenta",
        "target": "sucata"
      }
    ],
    "mode": 0,
    "hue": 0.75,
    "timelineGroup": "profile"
  }
];

/* Áreas de atuação oferecidas. O menu Serviços e a página de serviços leem desta lista. */
window.SERVICES = [
  {
    "id": "artista-visual",
    "label": "Artista visual"
  },
  {
    "id": "iluminador",
    "label": "Iluminador"
  },
  {
    "id": "cenografo",
    "label": "Cenógrafo"
  },
  {
    "id": "videomaker",
    "label": "Videomaker"
  },
  {
    "id": "fotografo",
    "label": "Fotógrafo"
  }
];
