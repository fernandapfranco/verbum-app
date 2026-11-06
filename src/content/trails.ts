import type { PassageRef, Reviewable } from './types';

export type TrailId = 'primeiros-passos' | 'voltando-para-casa';
export type SeriesId = 'advento' | 'quaresma';

export type LessonStep =
  | { kind: 'texto'; titulo?: string; corpo: string }
  | { kind: 'leitura'; ref: PassageRef; antes?: string }
  | { kind: 'oracao'; prayerId: string }
  | { kind: 'reflexao'; pergunta: string };

export interface Lesson extends Reviewable {
  id: string;
  titulo: string;
  resumo: string;
  minutos: number;
  passos: LessonStep[];
}

export interface Trail {
  id: TrailId | SeriesId;
  titulo: string;
  subtitulo: string;
  paraQuem: string;
  licoes: Lesson[];
}

const R = (fontes: string[]): Reviewable => ({ status: 'rascunho', fontes });

export const TRAILS: readonly Trail[] = [
  {
    id: 'primeiros-passos',
    titulo: 'Primeiros Passos',
    subtitulo: 'Para quem está começando',
    paraQuem: 'Nunca leu a Bíblia ou não sabe por onde começar? Tudo bem — todo mundo começou um dia. Vamos juntos, sem pressa.',
    licoes: [
      {
        id: 'o-que-e-a-biblia',
        titulo: 'O que é a Bíblia?',
        resumo: 'Uma biblioteca inteira, escrita por pessoas e inspirada por Deus.',
        minutos: 4,
        ...R(['Dei Verbum 11–13', 'CIC 101–108', 'CIC 134']),
        passos: [
          {
            kind: 'texto',
            titulo: 'Uma biblioteca, não um livro só',
            corpo:
              'A palavra "Bíblia" vem do grego e quer dizer "livros". Ela é uma coleção de 73 livros, escritos ao longo de mais de mil anos, em hebraico, aramaico e grego, por pessoas muito diferentes: reis, pastores, profetas, pescadores, um médico.',
          },
          {
            kind: 'texto',
            titulo: 'Palavra de Deus em palavras humanas',
            corpo:
              'A Igreja ensina que Deus inspirou esses autores: eles escreveram com seu jeito, sua cultura e seu estilo, mas o que Deus quis nos dizer está ali. Por isso dizemos que a Bíblia é Palavra de Deus em palavras humanas.',
          },
          {
            kind: 'texto',
            titulo: 'Tudo aponta para Jesus',
            corpo:
              'O Antigo Testamento prepara a vinda de Jesus; o Novo Testamento conta sua vida, morte e ressurreição e os primeiros passos da Igreja. Jesus é o centro: é a Palavra de Deus em pessoa. Ler a Bíblia é, no fundo, conhecer alguém.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'salmos', chapter: 118, from: 105, to: 105 },
            antes: 'Veja como um salmo descreve a Palavra de Deus (na numeração moderna, Salmo 119):',
          },
          {
            kind: 'leitura',
            ref: { bookId: '2-timoteo', chapter: 3, from: 14, to: 17 },
            antes: 'E São Paulo, escrevendo a um jovem amigo, Timóteo:',
          },
          { kind: 'reflexao', pergunta: 'O que você espera encontrar lendo a Bíblia?' },
        ],
      },
      {
        id: 'como-se-organiza',
        titulo: 'Como ela se organiza',
        resumo: 'Antigo e Novo Testamento, e por que a Bíblia católica tem 73 livros.',
        minutos: 4,
        ...R(['CIC 120–123', 'Dei Verbum 14–16']),
        passos: [
          {
            kind: 'texto',
            titulo: 'Duas grandes partes',
            corpo:
              'Antigo Testamento (46 livros): a história da Aliança de Deus com o povo de Israel, antes de Jesus.\n\nNovo Testamento (27 livros): Jesus e a Igreja nascente.\n\n"Testamento" aqui quer dizer "Aliança".',
          },
          {
            kind: 'texto',
            titulo: 'Os grupos de livros',
            corpo:
              'No Antigo Testamento: Pentateuco (os 5 primeiros), Históricos, Sapienciais (poesia e sabedoria, como Salmos e Provérbios) e Proféticos.\n\nNo Novo Testamento: os 4 Evangelhos, os Atos dos Apóstolos, as Cartas e o Apocalipse.\n\nNa aba Bíblia, os livros aparecem exatamente nesses grupos.',
          },
          {
            kind: 'texto',
            titulo: 'Por que 73?',
            corpo:
              'As Bíblias protestantes têm 66 livros. A Bíblia católica inclui também Tobias, Judite, 1 e 2 Macabeus, Sabedoria, Eclesiástico e Baruc (e trechos de Ester e Daniel). São os "deuterocanônicos": livros que os primeiros cristãos já liam e que a Igreja sempre reconheceu como inspirados.',
          },
          { kind: 'reflexao', pergunta: 'Qual grupo de livros deu mais curiosidade em você?' },
        ],
      },
      {
        id: 'como-encontrar',
        titulo: 'Como encontrar um trecho',
        resumo: 'Aprenda a ler "Mc 1,14-20" como quem lê um endereço.',
        minutos: 3,
        ...R([]),
        passos: [
          {
            kind: 'texto',
            titulo: 'Livro, capítulo, versículo',
            corpo:
              'Cada livro é dividido em capítulos, e cada capítulo em versículos (frases numeradas). Uma citação funciona como um endereço:\n\nMc 1,14-20\n• Mc = Evangelho de Marcos\n• 1 = capítulo 1\n• 14-20 = do versículo 14 ao 20\n\nNo Brasil se usa vírgula entre capítulo e versículo. Um ponto junta versículos soltos: Lc 1,28.42 = versículos 28 e 42.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'marcos', chapter: 1, from: 14, to: 20 },
            antes: 'Agora é com você. Este é Mc 1,14-20:',
          },
          {
            kind: 'texto',
            titulo: 'Dica',
            corpo:
              'Os números dos capítulos e versículos foram colocados séculos depois dos textos serem escritos, para facilitar encontrar os trechos. Eles ajudam, mas não precisam interromper a leitura: leia como uma história contínua.',
          },
        ],
      },
      {
        id: 'ler-com-o-coracao',
        titulo: 'Ler com o coração',
        resumo: 'Um jeito simples e antigo de rezar com a Bíblia: a Leitura Orante.',
        minutos: 5,
        ...R(['CIC 2708', 'Verbum Domini 86–87']),
        passos: [
          {
            kind: 'texto',
            titulo: 'Não é só informação',
            corpo:
              'Dá para ler a Bíblia como um livro de história, mas ela foi feita para um encontro. Há séculos os cristãos praticam a "Leitura Orante" (Lectio Divina), em quatro passos simples.',
          },
          {
            kind: 'texto',
            titulo: 'Os quatro passos',
            corpo:
              '1. Ler: o que o texto diz? Leia devagar, talvez duas vezes.\n2. Meditar: o que o texto diz para mim? Guarde uma palavra ou frase.\n3. Rezar: o que eu digo a Deus? Responda com suas palavras.\n4. Contemplar: fique um pouco em silêncio, na presença dele.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'marcos', chapter: 1, from: 35, to: 35 },
            antes: 'Experimente com este versículo curtinho. Ele mostra o próprio Jesus rezando:',
          },
          { kind: 'reflexao', pergunta: 'Que palavra ou frase ficou com você? O que você quer dizer a Deus agora?' },
        ],
      },
      {
        id: 'oracoes-basicas',
        titulo: 'Orações para guardar no coração',
        resumo: 'Sinal da Cruz, Pai-Nosso, Ave-Maria, Glória e Santo Anjo.',
        minutos: 5,
        ...R(['CIC 2759–2865', 'CIC 2676–2679']),
        passos: [
          {
            kind: 'texto',
            titulo: 'Não precisa saber de cor',
            corpo:
              'Muita gente tem vergonha de não saber as orações de cor. Fique tranquilo: aqui elas estão sempre à mão. Com o tempo, de tanto rezar, elas ficam no coração.',
          },
          { kind: 'oracao', prayerId: 'sinal-da-cruz' },
          { kind: 'oracao', prayerId: 'pai-nosso' },
          { kind: 'oracao', prayerId: 'ave-maria' },
          { kind: 'oracao', prayerId: 'gloria' },
          { kind: 'oracao', prayerId: 'santo-anjo' },
          { kind: 'reflexao', pergunta: 'Qual dessas orações você quer rezar todos os dias nesta semana?' },
        ],
      },
      {
        id: 'por-onde-comecar',
        titulo: 'Por onde começar? Por Marcos!',
        resumo: 'O Evangelho mais curto é uma ótima porta de entrada.',
        minutos: 6,
        ...R(['CIC 125–127']),
        passos: [
          {
            kind: 'texto',
            titulo: 'Por que Marcos?',
            corpo:
              'Começar pelo Gênesis e seguir até o fim parece lógico, mas muita gente desanima no meio das leis do Levítico. Os Evangelhos são o coração da Bíblia, e Marcos é o mais curto: 16 capítulos, cheios de ação. Em poucas semanas você conhece Jesus de perto.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'marcos', chapter: 1, from: 1, to: 13 },
            antes: 'Este é o começo do Evangelho de Marcos:',
          },
          { kind: 'reflexao', pergunta: 'O que chamou sua atenção nesse começo?' },
        ],
      },
      {
        id: 'jesus-chama',
        titulo: 'Jesus chama você',
        resumo: 'Os primeiros discípulos deixaram as redes. E você?',
        minutos: 5,
        ...R(['CIC 787', 'CIC 1533']),
        passos: [
          {
            kind: 'leitura',
            ref: { bookId: 'marcos', chapter: 1, from: 14, to: 20 },
            antes: 'Leia de novo, agora devagar, imaginando a cena na beira do mar:',
          },
          {
            kind: 'texto',
            titulo: 'Gente comum',
            corpo:
              'Jesus não chamou os mais preparados: chamou pescadores no meio do trabalho. Ele não espera que você já saiba tudo. Ele chama do jeito que você está — e caminha junto.',
          },
          { kind: 'reflexao', pergunta: 'O que você gostaria de "deixar na praia" para seguir Jesus mais de perto?' },
          {
            kind: 'texto',
            titulo: 'Parabéns! 🎉',
            corpo:
              'Você concluiu os Primeiros Passos. Que tal continuar lendo o Evangelho de Marcos inteiro? Você pode montar um plano no seu ritmo.',
          },
        ],
      },
    ],
  },
  {
    id: 'voltando-para-casa',
    titulo: 'Voltando para Casa',
    subtitulo: 'Para quem está retornando à fé',
    paraQuem: 'Ficou um tempo longe? Aqui ninguém vai te cobrar nada. Deus nunca deixou de esperar por você — e faz festa quando alguém volta.',
    licoes: [
      {
        id: 'ovelha-perdida',
        titulo: 'Que bom que você voltou',
        resumo: 'A ovelha perdida e o pastor que vai atrás.',
        minutos: 4,
        ...R(['CIC 605', 'CIC 1443']),
        passos: [
          {
            kind: 'texto',
            titulo: 'Bem-vindo de volta',
            corpo:
              'Talvez você tenha se afastado por decepção, por correria, por alguma ferida ou simplesmente porque a vida levou para outro lado. Não importa o motivo nem quanto tempo passou. Jesus contou três histórias justamente para pessoas como nós.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'lucas', chapter: 15, from: 1, to: 7 },
            antes: 'Repare em quem estava perto de Jesus quando ele contou esta parábola:',
          },
          {
            kind: 'texto',
            corpo:
              'O pastor não fica esperando a ovelha achar o caminho sozinha. Ele vai atrás, encontra, coloca nos ombros — e faz festa. Não há bronca na história. Há alegria.',
          },
          { kind: 'reflexao', pergunta: 'Em que momento você sentiu que Deus foi atrás de você?' },
        ],
      },
      {
        id: 'o-pai-que-corre',
        titulo: 'O Pai que corre',
        resumo: 'A parábola do filho que volta para casa.',
        minutos: 8,
        ...R(['CIC 1439', 'CIC 2839']),
        passos: [
          {
            kind: 'leitura',
            ref: { bookId: 'lucas', chapter: 15, from: 11, to: 32 },
            antes: 'Talvez a história mais famosa que Jesus contou. Leia sem pressa:',
          },
          {
            kind: 'texto',
            titulo: 'Repare no pai',
            corpo:
              'O filho prepara um discurso de desculpas, mas o pai nem deixa terminar: corre (coisa que um senhor daquele tempo não fazia), abraça, beija e devolve a roupa, o anel e os sapatos — sinais de que ele continua filho. É assim que Deus olha para você.',
          },
          {
            kind: 'texto',
            titulo: 'E o irmão mais velho?',
            corpo:
              'Às vezes a gente se parece com ele: ficou em casa, mas com o coração longe. O pai também sai para buscá-lo. Ninguém fica de fora da festa.',
          },
          { kind: 'reflexao', pergunta: 'Com qual personagem você se identifica hoje? Por quê?' },
        ],
      },
      {
        id: 'zaqueu',
        titulo: 'Zaqueu: hoje é dia de recomeço',
        resumo: 'Jesus chama pelo nome quem todos tinham desistido.',
        minutos: 5,
        ...R(['CIC 2412', 'CIC 545']),
        passos: [
          {
            kind: 'leitura',
            ref: { bookId: 'lucas', chapter: 19, from: 1, to: 10 },
            antes: 'Zaqueu era malvisto por todos. Mas estava curioso:',
          },
          {
            kind: 'texto',
            corpo:
              'Jesus não exige que Zaqueu mude primeiro para depois entrar em sua casa. Ele entra, e é o encontro que muda Zaqueu. "Hoje entrou a salvação nesta casa." Hoje — não amanhã, não quando você estiver "pronto".',
          },
          { kind: 'reflexao', pergunta: 'Qual é a "árvore" em que você subiu para tentar ver Jesus?' },
        ],
      },
      {
        id: 'pedro',
        titulo: 'Pedro: o amor recomeça',
        resumo: 'Três negações, três perguntas, uma nova chance.',
        minutos: 5,
        ...R(['CIC 553', 'CIC 1429']),
        passos: [
          {
            kind: 'texto',
            corpo:
              'Pedro tinha prometido nunca abandonar Jesus — e, na noite da Paixão, negou conhecê-lo três vezes. Depois da ressurreição, Jesus o encontra na praia, prepara comida para ele e faz uma pergunta.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'joao', chapter: 21, from: 15, to: 19 },
          },
          {
            kind: 'texto',
            corpo:
              'Jesus não pergunta "por que você me negou?". Pergunta "tu me amas?". E confia a Pedro o cuidado de todo o rebanho. Nossas quedas não são a última palavra.',
          },
          { kind: 'reflexao', pergunta: 'Se Jesus te perguntasse hoje "tu me amas?", o que você responderia?' },
        ],
      },
      {
        id: 'confissao',
        titulo: 'O abraço da Confissão',
        resumo: 'O que é, como funciona e por que não precisa ter medo.',
        minutos: 7,
        ...R(['CIC 1422–1424', 'CIC 1440–1460', 'CIC 1467']),
        passos: [
          {
            kind: 'texto',
            titulo: 'O que é',
            corpo:
              'A Confissão (sacramento da Reconciliação) é o lugar onde a festa do Pai acontece de verdade. Jesus deu aos apóstolos o poder de perdoar pecados em seu nome, e a Igreja continua fazendo isso por meio dos padres.',
          },
          {
            kind: 'texto',
            titulo: 'Passo a passo',
            corpo:
              '1. Antes, pense com calma no que pesa na sua consciência (o "exame de consciência").\n2. Procure um padre — na paróquia costuma haver horários de confissão.\n3. Se faz tempo, diga isso a ele. É comum, e ele vai te ajudar.\n4. Conte seus pecados com simplicidade.\n5. Ouça o conselho e a penitência (geralmente uma oração ou um gesto).\n6. Reze um ato de arrependimento e receba a absolvição.',
          },
          {
            kind: 'texto',
            titulo: 'Segredo absoluto',
            corpo:
              'O padre é obrigado a guardar segredo total sobre o que ouve, sem nenhuma exceção (é o "sigilo sacramental"). E lembre: ele está ali para te acolher em nome de Deus, não para te julgar.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'salmos', chapter: 50, from: 3, to: 14 },
            antes: 'Este salmo (51 na numeração moderna) é uma linda oração para se preparar:',
          },
          { kind: 'reflexao', pergunta: 'O que você gostaria de entregar a Deus para recomeçar mais leve?' },
        ],
      },
      {
        id: 'de-volta-a-mesa',
        titulo: 'De volta à mesa',
        resumo: 'Reencontrar Jesus na Missa.',
        minutos: 6,
        ...R(['CIC 1345–1355', 'CIC 1385', 'CIC 2180–2182']),
        passos: [
          {
            kind: 'texto',
            titulo: 'O que acontece na Missa',
            corpo:
              'A Missa tem duas grandes partes. Na Liturgia da Palavra, Deus fala com a gente pelas leituras da Bíblia — muitas que você está conhecendo aqui. Na Liturgia Eucarística, o pão e o vinho se tornam o Corpo e o Sangue de Jesus, que se dá a nós na comunhão.',
          },
          {
            kind: 'texto',
            titulo: 'Sem pressa e sem vergonha',
            corpo:
              'Se você não lembra as respostas ou os gestos, tudo bem: acompanhe o folheto ou simplesmente esteja presente. Para comungar, a Igreja pede que a pessoa esteja em paz com Deus — por isso, depois de muito tempo afastado, o caminho é passar antes pela Confissão. Enquanto isso, você pode participar e fazer uma "comunhão espiritual", pedindo a Jesus que venha ao seu coração.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'salmos', chapter: 102, from: 1, to: 13 },
            antes: 'Termine rezando este salmo de gratidão (103 na numeração moderna):',
          },
          {
            kind: 'texto',
            titulo: 'Você chegou em casa 🏠',
            corpo:
              'Você concluiu a trilha Voltando para Casa. Que tal continuar com o Evangelho de Lucas, o Evangelho da misericórdia? Monte um plano no seu ritmo.',
          },
        ],
      },
    ],
  },
];

/**
 * Séries do tempo litúrgico: trilhas que ficam em destaque quando o tempo se
 * aproxima (ver src/lib/liturgy.ts). Podem ser feitas a qualquer momento.
 */
export interface Series extends Trail {
  id: SeriesId;
  season: 'advento' | 'natal' | 'quaresma' | 'pascoa';
}

export const SERIES: readonly Series[] = [
  {
    id: 'advento',
    season: 'advento',
    titulo: 'Advento: preparar o caminho',
    subtitulo: 'Trilha do tempo litúrgico · 7 encontros',
    paraQuem:
      'Quatro semanas para preparar o coração para o Natal: um encontro curto por semana, com leituras que a Igreja faz no Advento, e um encontro para a noite de Natal.',
    licoes: [
      {
        id: 'o-que-e-o-advento',
        titulo: 'O que é o Advento?',
        resumo: 'Um tempo de espera alegre, com velas, roxo e esperança.',
        minutos: 4,
        ...R(['CIC 524', 'Normas Universais do Ano Litúrgico 39']),
        passos: [
          {
            kind: 'texto',
            titulo: 'Uma chegada',
            corpo:
              '"Advento" quer dizer "chegada". São as quatro semanas antes do Natal, quando a Igreja começa o seu ano. Esperamos duas vindas: celebramos que Jesus veio a nós em Belém e nos preparamos para a sua volta no fim dos tempos.',
          },
          {
            kind: 'texto',
            titulo: 'Sinais do Advento',
            corpo:
              'O roxo das vestes lembra conversão e espera. A coroa do Advento tem quatro velas: uma acesa a cada domingo, para a luz ir crescendo até o Natal. A terceira costuma ser rosa: é o domingo da alegria (Gaudete), porque o Natal já está perto.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'isaias', chapter: 40, from: 1, to: 5 },
            antes: 'O profeta Isaías anunciava consolo a um povo cansado. A Igreja relê estas palavras no Advento:',
          },
          { kind: 'reflexao', pergunta: 'O que você gostaria de preparar no seu coração para este Natal?' },
        ],
      },
      {
        id: 'vigiai',
        titulo: '1ª semana · Vigiai',
        resumo: 'Estar atento é diferente de ter medo.',
        minutos: 4,
        ...R(['CIC 672', 'CIC 2612']),
        passos: [
          { kind: 'leitura', ref: { bookId: 'marcos', chapter: 13, from: 33, to: 37 }, antes: 'No Advento, a Igreja relê este convite de Jesus a ficar acordado:' },
          {
            kind: 'texto',
            corpo:
              'Vigiar não é viver com medo do fim. É viver acordado: perceber Deus nas pequenas coisas, cuidar das pessoas, não deixar a vida passar no piloto automático. Quem vigia está pronto para receber quem ama.',
          },
          { kind: 'reflexao', pergunta: 'Em que parte da sua vida você anda "dormindo"? O que ajudaria você a ficar mais atento a Deus?' },
        ],
      },
      {
        id: 'preparai-o-caminho',
        titulo: '2ª semana · Preparai o caminho',
        resumo: 'João Batista e o convite a endireitar as veredas.',
        minutos: 5,
        ...R(['CIC 523', 'CIC 1427–1429']),
        passos: [
          { kind: 'leitura', ref: { bookId: 'marcos', chapter: 1, from: 1, to: 8 }, antes: 'Todo Advento, João Batista aparece nos Evangelhos de domingo. Aqui está ele no deserto:' },
          {
            kind: 'texto',
            corpo:
              'Antigamente, quando um rei ia visitar uma cidade, abriam e aplainavam a estrada. João pede o mesmo para o coração: tirar as pedras do caminho. Muita gente aproveita o Advento para se confessar antes do Natal — é um jeito bonito de preparar a estrada.',
          },
          { kind: 'reflexao', pergunta: 'Que "pedra" você gostaria de tirar do caminho até o Natal?' },
        ],
      },
      {
        id: 'alegrai-vos',
        titulo: '3ª semana · Alegrai-vos',
        resumo: 'O domingo rosa: o Senhor está perto.',
        minutos: 4,
        ...R(['CIC 30', 'CIC 2637']),
        passos: [
          {
            kind: 'texto',
            corpo:
              'No 3º Domingo do Advento, chamado "Gaudete" ("alegrai-vos"), a vela e as vestes podem ser rosa: uma pausa de alegria no meio da espera, porque o Natal está chegando.',
          },
          { kind: 'leitura', ref: { bookId: 'filipenses', chapter: 4, from: 4, to: 7 }, antes: 'São Paulo escreveu isto da prisão — e mesmo assim fala de alegria:' },
          { kind: 'reflexao', pergunta: 'O que te tira a paz hoje? Experimente entregar isso a Deus, como Paulo sugere.' },
        ],
      },
      {
        id: 'o-sim-de-maria',
        titulo: '4ª semana · O sim de Maria',
        resumo: 'A Anunciação e o "faça-se" que mudou a história.',
        minutos: 6,
        ...R(['CIC 484–494', 'CIC 2617']),
        passos: [
          { kind: 'leitura', ref: { bookId: 'lucas', chapter: 1, from: 26, to: 38 }, antes: 'Perto do Natal, a Igreja lê a visita do anjo Gabriel a Maria:' },
          {
            kind: 'texto',
            corpo:
              'Maria não entendeu tudo de uma vez — ela até perguntou "como se fará isso?". Mas confiou e disse sim. Essa cena é exatamente a que rezamos no Angelus, três vezes por dia.',
          },
          { kind: 'oracao', prayerId: 'angelus' },
          { kind: 'reflexao', pergunta: 'Que "sim" Deus pode estar esperando de você?' },
        ],
      },
      {
        id: 'deus-conosco',
        titulo: 'Deus conosco',
        resumo: 'O Emanuel prometido por Isaías e o sonho de José.',
        minutos: 6,
        ...R(['CIC 437', 'CIC 497']),
        passos: [
          { kind: 'leitura', ref: { bookId: 'isaias', chapter: 9, from: 6, to: 7 }, antes: 'Séculos antes, Isaías anunciou um menino que traria a paz:' },
          { kind: 'leitura', ref: { bookId: 'mateus', chapter: 1, from: 18, to: 24 }, antes: 'E Mateus conta como José acolheu esse mistério:' },
          {
            kind: 'texto',
            corpo:
              'José é o homem do silêncio: não fala uma palavra nos Evangelhos, mas faz o que Deus pede. "Emanuel" quer dizer "Deus conosco" — Deus não ficou longe; veio morar no meio da nossa vida, do jeito que ela é.',
          },
          { kind: 'reflexao', pergunta: 'Onde você precisa sentir hoje que Deus está com você?' },
        ],
      },
      {
        id: 'noite-feliz',
        titulo: 'Noite de Natal',
        resumo: 'Hoje vos nasceu o Salvador.',
        minutos: 6,
        ...R(['CIC 525–526']),
        passos: [
          { kind: 'leitura', ref: { bookId: 'lucas', chapter: 2, from: 1, to: 14 }, antes: 'O Evangelho da noite de Natal. Leia devagar, imaginando a cena:' },
          {
            kind: 'texto',
            corpo:
              'Deus escolheu chegar pequeno, pobre e sem lugar na estalagem. Os primeiros a saber foram pastores trabalhando de madrugada. O Natal é para todos — principalmente para quem acha que não tem lugar.',
          },
          { kind: 'oracao', prayerId: 'gloria' },
          { kind: 'texto', titulo: 'Feliz Natal! 🎄', corpo: 'Você completou a trilha do Advento. Que a luz de Belém fique acesa no seu coração o ano inteiro.' },
        ],
      },
    ],
  },
  {
    id: 'quaresma',
    season: 'quaresma',
    titulo: 'Quaresma: voltar para casa',
    subtitulo: 'Trilha do tempo litúrgico · 10 encontros',
    paraQuem:
      'Das Cinzas à Páscoa: um encontro por semana, mais três para a Semana Santa e um para o domingo da Ressurreição. Para viver a Quaresma sem peso, como um caminho de volta para Deus.',
    licoes: [
      {
        id: 'cinzas',
        titulo: 'Cinzas · Voltai para mim',
        resumo: 'O que é a Quaresma e por que ela começa com cinzas.',
        minutos: 5,
        ...R(['CIC 540', 'CIC 1430–1431', 'CIC 1438', 'Normas Universais do Ano Litúrgico 27–31']),
        passos: [
          {
            kind: 'texto',
            titulo: 'Quarenta dias',
            corpo:
              'A Quaresma são os quarenta dias de preparação para a Páscoa. O número lembra os quarenta anos do povo no deserto e os quarenta dias de Jesus em jejum. Ela começa na Quarta-feira de Cinzas e vai até a Quinta-feira Santa.',
          },
          {
            kind: 'texto',
            titulo: 'Por que cinzas?',
            corpo:
              'As cinzas na testa dizem duas coisas: somos frágeis ("lembra-te que és pó") e queremos mudar de vida ("convertei-vos e crede no Evangelho"). Não é um sinal de tristeza, e sim de recomeço.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'joel', chapter: 2, from: 12, to: 13 },
            antes: 'Na Missa de Cinzas, a Igreja lê este convite do profeta Joel:',
          },
          {
            kind: 'texto',
            corpo:
              '"Rasgai os vossos corações, e não os vossos vestidos." Deus não quer só gestos por fora; quer o coração. E o motivo para voltar é ele mesmo: "benigno, paciente e de muita misericórdia".',
          },
          { kind: 'reflexao', pergunta: 'O que você gostaria que fosse diferente na sua vida até a Páscoa?' },
        ],
      },
      {
        id: 'no-deserto',
        titulo: '1ª semana · No deserto',
        resumo: 'Jesus enfrenta a tentação com a Palavra de Deus.',
        minutos: 5,
        ...R(['CIC 538–540', 'CIC 2849']),
        passos: [
          {
            kind: 'leitura',
            ref: { bookId: 'mateus', chapter: 4, from: 1, to: 11 },
            antes: 'No 1º Domingo da Quaresma, todo ano, a Igreja lê as tentações de Jesus no deserto:',
          },
          {
            kind: 'texto',
            corpo:
              'As três tentações são as nossas de sempre: viver só para as necessidades do corpo, usar Deus para se exibir e trocar Deus pelo poder. Jesus não discute com o tentador: responde com a Palavra de Deus. O deserto é lugar de luta, mas também de encontro.',
          },
          { kind: 'reflexao', pergunta: 'Qual é a tentação que mais aparece no seu dia a dia? Que frase da Bíblia poderia ajudar você nessa hora?' },
        ],
      },
      {
        id: 'escutai-o',
        titulo: '2ª semana · Ouvi-o',
        resumo: 'Na montanha, a glória de Jesus antes da cruz.',
        minutos: 5,
        ...R(['CIC 554–556']),
        passos: [
          {
            kind: 'leitura',
            ref: { bookId: 'mateus', chapter: 17, from: 1, to: 9 },
            antes: 'No 2º Domingo, o Evangelho é sempre a Transfiguração:',
          },
          {
            kind: 'texto',
            corpo:
              'Antes de ver Jesus sofrer, os discípulos o veem cheio de luz. É como se Deus dissesse: a cruz não é o fim da história. E o Pai dá uma única ordem: "Ouvi-o". A Quaresma é um bom tempo para escutar mais e falar menos.',
          },
          { kind: 'reflexao', pergunta: 'Em que momento do dia você poderia reservar alguns minutos de silêncio para ouvir Jesus?' },
        ],
      },
      {
        id: 'no-segredo',
        titulo: '3ª semana · Oração, jejum e esmola',
        resumo: 'Três caminhos, vividos no segredo.',
        minutos: 6,
        ...R(['CIC 1434', 'CIC 1438', 'CIC 2447']),
        passos: [
          {
            kind: 'leitura',
            ref: { bookId: 'mateus', chapter: 6, from: 1, to: 6 },
            antes: 'Jesus fala da esmola e da oração. Este é o Evangelho da Quarta-feira de Cinzas:',
          },
          { kind: 'leitura', ref: { bookId: 'mateus', chapter: 6, from: 16, to: 18 }, antes: 'E do jejum:' },
          {
            kind: 'texto',
            corpo:
              'Oração é voltar-se para Deus; jejum é ter domínio sobre si; esmola é voltar-se para o próximo. Jesus pede que tudo seja feito "em secreto": não para ser visto, mas por amor. Um sacrifício pequeno e constante vale mais que uma promessa enorme que dura dois dias.',
          },
          { kind: 'reflexao', pergunta: 'Escolha um gesto concreto para cada caminho: uma oração, um jejum e uma partilha. Quais serão os seus?' },
        ],
      },
      {
        id: 'o-pai-que-corre',
        titulo: '4ª semana · O Pai que corre',
        resumo: 'Laetare: a alegria de ser recebido de volta.',
        minutos: 7,
        ...R(['CIC 1439', 'CIC 1422–1424', 'CIC 1451–1453']),
        passos: [
          {
            kind: 'texto',
            corpo:
              'O 4º Domingo da Quaresma se chama "Laetare" ("alegra-te"): as vestes podem ser rosa, porque a Páscoa já está perto. É um bom momento para lembrar por que voltamos: porque somos esperados.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'lucas', chapter: 15, from: 11, to: 24 },
            antes: 'A parábola mais conhecida sobre o perdão. Repare em quem corre:',
          },
          {
            kind: 'texto',
            corpo:
              'O filho prepara um discurso; o pai nem deixa ele terminar. Corre, abraça e faz festa. É isso que acontece na Confissão: Deus não espera a gente chegar perfeito. A Quaresma é o tempo em que muita gente volta a se confessar; se fizer tempo que você não vai, este pode ser o momento.',
          },
          { kind: 'oracao', prayerId: 'ato-de-contricao' },
          { kind: 'reflexao', pergunta: 'O que impede você de "levantar-se e ir buscar o Pai"?' },
        ],
      },
      {
        id: 'pelas-suas-chagas',
        titulo: '5ª semana · Pelas suas chagas',
        resumo: 'O Servo sofredor anunciado por Isaías.',
        minutos: 5,
        ...R(['CIC 601', 'CIC 615', 'CIC 1505']),
        passos: [
          {
            kind: 'leitura',
            ref: { bookId: 'isaias', chapter: 53, from: 4, to: 6 },
            antes: 'Séculos antes de Jesus, Isaías descreveu um servo de Deus que sofreria por todos. A Igreja lê este texto na Sexta-feira Santa:',
          },
          {
            kind: 'texto',
            corpo:
              '"Nós fomos sarados pelas suas pisaduras." Jesus não ficou de longe da nossa dor: tomou sobre si o que nos machuca. Olhar para a cruz é descobrir até onde vai o amor de Deus.',
          },
          { kind: 'reflexao', pergunta: 'Que dor ou ferida sua você gostaria de entregar a Jesus nesta semana?' },
        ],
      },
      {
        id: 'ramos',
        titulo: 'Domingo de Ramos · Bendito o que vem',
        resumo: 'Jesus entra em Jerusalém, humilde, montado num jumentinho.',
        minutos: 5,
        ...R(['CIC 559–560']),
        passos: [
          {
            kind: 'leitura',
            ref: { bookId: 'lucas', chapter: 19, from: 28, to: 40 },
            antes: 'Com o Domingo de Ramos começa a Semana Santa. Nas igrejas, todos levam ramos, como o povo de Jerusalém:',
          },
          {
            kind: 'texto',
            corpo:
              'Jesus é rei, mas não chega num cavalo de guerra: vem num jumentinho, sinal de paz e humildade. A mesma multidão que canta "Bendito" vai gritar "Crucifica-o" dias depois. A Semana Santa nos pergunta: como recebo Jesus quando o caminho dele passa pela cruz?',
          },
          { kind: 'reflexao', pergunta: 'Como você quer viver esta Semana Santa? Anote um compromisso simples.' },
        ],
      },
      {
        id: 'lava-pes',
        titulo: 'Quinta-feira Santa · Amou-os até o fim',
        resumo: 'A Última Ceia, o lava-pés e a Eucaristia.',
        minutos: 6,
        ...R(['CIC 610–611', 'CIC 1337', 'CIC 1823']),
        passos: [
          {
            kind: 'leitura',
            ref: { bookId: 'joao', chapter: 13, from: 1, to: 15 },
            antes: 'Na Missa da Ceia do Senhor, que abre o Tríduo Pascal, a Igreja lê este Evangelho:',
          },
          {
            kind: 'texto',
            corpo:
              'Naquela noite Jesus nos deu a Eucaristia e mostrou o que ela significa: lavar os pés uns dos outros. Lavar pés era tarefa de escravo. O Mestre se ajoelha e diz: "Assim façais vós também". Depois da Missa, as igrejas ficam abertas para quem quiser velar um pouco com Jesus.',
          },
          { kind: 'reflexao', pergunta: 'A quem você pode "lavar os pés" nesta semana, com um serviço escondido?' },
        ],
      },
      {
        id: 'sexta-feira-santa',
        titulo: 'Sexta-feira Santa · Tudo está cumprido',
        resumo: 'Junto à cruz, com Maria.',
        minutos: 6,
        ...R(['CIC 613–618', 'CIC 964', 'CIC 2605']),
        passos: [
          {
            kind: 'texto',
            corpo:
              'A Sexta-feira Santa é o único dia do ano sem Missa. A Igreja se reúne para ouvir a Paixão, rezar por todo o mundo e adorar a Cruz. É dia de jejum e abstinência, e de silêncio.',
          },
          {
            kind: 'leitura',
            ref: { bookId: 'joao', chapter: 19, from: 25, to: 30 },
            antes: 'Leia devagar. Fique um pouco ao lado de Maria e do discípulo amado:',
          },
          {
            kind: 'texto',
            corpo:
              'Mesmo na cruz, Jesus cuida dos seus: entrega Maria ao discípulo, e o discípulo a Maria. A Igreja vê nesse gesto Maria se tornando mãe de todos nós. "Tudo está cumprido": o amor foi até o fim.',
          },
          { kind: 'reflexao', pergunta: 'Escreva uma frase de agradecimento a Jesus pela cruz.' },
        ],
      },
      {
        id: 'ressuscitou',
        titulo: 'Páscoa · Ele está vivo!',
        resumo: 'Maria Madalena encontra o Ressuscitado.',
        minutos: 6,
        ...R(['CIC 638–641', 'CIC 1169']),
        passos: [
          {
            kind: 'leitura',
            ref: { bookId: 'joao', chapter: 20, from: 11, to: 18 },
            antes: 'Na manhã de Páscoa, Maria Madalena chora junto ao sepulcro vazio:',
          },
          {
            kind: 'texto',
            corpo:
              'Ela só reconhece Jesus quando ele a chama pelo nome: "Maria". A Ressurreição é isso: Jesus vivo, que conhece cada um pelo nome. A tristeza vira missão, e Maria corre para contar aos outros.',
          },
          {
            kind: 'texto',
            corpo:
              'A Páscoa não é um dia só: são cinquenta dias de festa até Pentecostes. Nesse tempo, no lugar do Angelus, rezamos o Regina Caeli.',
          },
          { kind: 'oracao', prayerId: 'regina-caeli' },
          { kind: 'texto', titulo: 'Feliz Páscoa! Aleluia!', corpo: 'Você completou a trilha da Quaresma. Que a alegria da Ressurreição acompanhe você em todos os dias.' },
        ],
      },
    ],
  },
];

export function getTrail(id: string): Trail | undefined {
  return TRAILS.find((t) => t.id === id) ?? SERIES.find((t) => t.id === id);
}

export function getSeriesFor(season: Series['season']): Series | undefined {
  return SERIES.find((s) => s.season === season);
}

export function getLesson(trailId: string, lessonId: string): Lesson | undefined {
  return getTrail(trailId)?.licoes.find((l) => l.id === lessonId);
}
