import type { PassageRef, Reviewable } from './types';

export type TrailId = 'primeiros-passos' | 'voltando-para-casa';

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
  id: TrailId;
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

export function getTrail(id: string): Trail | undefined {
  return TRAILS.find((t) => t.id === id);
}

export function getLesson(trailId: string, lessonId: string): Lesson | undefined {
  return getTrail(trailId)?.licoes.find((l) => l.id === lessonId);
}
