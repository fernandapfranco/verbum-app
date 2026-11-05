import type { Reviewable } from './types';

/**
 * "Antes de ler": apresentação curta de cada livro, em linguagem simples.
 * quem: autoria segundo a tradição e o consenso atual, sem afirmar além do que se sabe.
 * contexto: para quem/quando.
 * esperar: o que a pessoa vai encontrar e uma dica de leitura.
 */
export interface BookIntro extends Reviewable {
  bookId: string;
  quem: string;
  contexto: string;
  esperar: string;
}

const R: Reviewable = { status: 'rascunho', fontes: ['Dei Verbum 11–20', 'CIC 101–141'] };

const intro = (bookId: string, quem: string, contexto: string, esperar: string): BookIntro => ({
  bookId,
  quem,
  contexto,
  esperar,
  ...R,
});

export const BOOK_INTROS: readonly BookIntro[] = [
  // Pentateuco
  intro('genesis', 'A tradição liga os cinco primeiros livros a Moisés; hoje se entende que reúnem tradições do povo de Israel guardadas e escritas ao longo de séculos.', 'O livro das origens: do mundo, da humanidade e do povo de Deus.', 'Começa com a criação e a queda, e segue com as histórias de Abraão, Isaac, Jacó e José. Não é um livro de ciência: ele responde quem fez tudo e por quê — por amor.'),
  intro('exodo', 'Faz parte do Pentateuco, as tradições ligadas a Moisés.', 'Israel escravo no Egito e libertado por Deus.', 'Saída do Egito, travessia do mar, a Aliança no Sinai e os Dez Mandamentos. É a grande história de libertação que prepara a Páscoa de Jesus.'),
  intro('levitico', 'Faz parte do Pentateuco; reúne leis guardadas pelos sacerdotes da tribo de Levi.', 'Como o povo libertado devia viver e celebrar diante de um Deus santo.', 'Muitas normas de culto e de pureza. Dica: leia buscando a ideia central — "Sede santos, porque eu sou santo" — sem se prender aos detalhes.'),
  intro('numeros', 'Faz parte do Pentateuco.', 'Os quarenta anos de Israel no deserto, a caminho da Terra Prometida.', 'Recenseamentos (daí o nome), murmurações e a fidelidade paciente de Deus a um povo que tropeça. Muito parecido com a nossa caminhada.'),
  intro('deuteronomio', 'Faz parte do Pentateuco; apresenta-se como os discursos de despedida de Moisés.', 'O povo está às portas da Terra Prometida.', 'Uma "segunda lei" que recorda a Aliança com o coração. Aqui está o "Escuta, Israel… amarás o Senhor teu Deus", que Jesus chamou de primeiro mandamento.'),
  // Históricos
  intro('josue', 'Leva o nome de Josué, sucessor de Moisés; faz parte das narrativas históricas de Israel.', 'A entrada do povo na Terra Prometida.', 'Batalhas e a partilha da terra. Lembre que são narrativas antigas, com linguagem da época; o centro é a fidelidade de Deus à promessa.'),
  intro('juizes', 'Narrativas históricas reunidas e organizadas pela tradição de Israel.', 'O tempo entre a chegada à terra e os reis.', 'Um ciclo que se repete: o povo se afasta, sofre, clama, e Deus envia um "juiz" libertador, como Gedeão e Sansão.'),
  intro('rute', 'Autor desconhecido.', 'Tempo dos Juízes.', 'Uma história curta e bonita de amizade e fidelidade. Rute, estrangeira, entra na família de onde nascerá Davi — e, mais tarde, Jesus.'),
  intro('1-samuel', 'Leva o nome do profeta Samuel; faz parte das narrativas históricas de Israel.', 'A passagem dos juízes para a monarquia.', 'Samuel, o rei Saul e a escolha do jovem Davi, o pastor que vence Golias. Mostra que Deus olha o coração.'),
  intro('2-samuel', 'Continuação de 1 Samuel.', 'O reinado de Davi.', 'As vitórias e as quedas de Davi, seu pecado e seu arrependimento sincero, e a promessa de que de sua família viria um rei eterno.'),
  intro('1-reis', 'Narrativas históricas de Israel.', 'De Salomão à divisão do reino.', 'A sabedoria de Salomão, a construção do Templo e o profeta Elias. Mostra como a fidelidade (ou não) a Deus marca a vida do povo.'),
  intro('2-reis', 'Continuação de 1 Reis.', 'Até a destruição de Jerusalém e o exílio na Babilônia.', 'O profeta Eliseu e a sucessão de reis. Termina com a dor do exílio — e uma pequena luz de esperança.'),
  intro('1-cronicas', 'Obra do "cronista", que releu a história de Israel após o exílio. Em edições antigas, chama-se Paralipômenos.', 'Escrito para um povo que reconstruía sua fé depois do exílio.', 'Genealogias longas no começo (pode passar mais rápido) e depois o reinado de Davi, com foco no culto e no Templo.'),
  intro('2-cronicas', 'Continuação de 1 Crônicas.', 'De Salomão ao exílio, recontado com foco no Templo.', 'Uma releitura da história dos reis de Judá que convida a confiar em Deus e a cuidar da oração.'),
  intro('esdras', 'Leva o nome de Esdras, sacerdote e escriba.', 'A volta do exílio e a reconstrução do Templo.', 'Recomeçar depois da crise: o povo volta, reconstrói e renova a Aliança com Deus.'),
  intro('neemias', 'Leva o nome de Neemias, governador judeu.', 'A reconstrução das muralhas de Jerusalém.', 'Oração e trabalho andando juntos. Um livro inspirador para quem está reconstruindo a própria vida.'),
  intro('tobias', 'Autor desconhecido. É um dos livros que só estão no cânon católico (deuterocanônicos).', 'Uma família judia fiel vivendo longe da sua terra.', 'Uma história cheia de ternura, com o anjo Rafael acompanhando o jovem Tobias. Fala de oração, família, caridade — e de anjos da guarda.'),
  intro('judite', 'Autor desconhecido; livro deuterocanônico.', 'Narrativa sobre a fé em tempos de ameaça.', 'Judite, mulher de oração e coragem, salva seu povo. Mais do que crônica, é uma história que ensina a confiar em Deus.'),
  intro('ester', 'Autor desconhecido. A versão católica inclui trechos em grego (no fim, nesta tradução).', 'Judeus vivendo no império persa.', 'A rainha Ester arrisca a vida para salvar seu povo. Mostra Deus agindo de forma discreta na história.'),
  intro('1-macabeus', 'Autor desconhecido; livro deuterocanônico.', 'Século II antes de Cristo: perseguição à fé judaica.', 'A resistência da família dos Macabeus para continuar fiel a Deus. Fala de coragem e de identidade.'),
  intro('2-macabeus', 'Autor desconhecido; livro deuterocanônico.', 'Os mesmos acontecimentos de 1 Macabeus, com outro olhar.', 'Testemunhos de martírio e uma fé clara na ressurreição e na oração pelos falecidos (cap. 12).'),
  // Sapienciais
  intro('jo', 'Autor desconhecido; um dos livros sapienciais.', 'Uma grande reflexão poética sobre o sofrimento.', 'Por que o justo sofre? Jó discute com amigos e com Deus, com toda a honestidade. Bom para quem está passando por dor.'),
  intro('salmos', 'Coleção de 150 orações; muitos são atribuídos a Davi. Nesta tradução, a numeração segue a antiga (grega/latina).', 'O livro de oração de Israel — e de Jesus.', 'Louvor, choro, pedido de perdão, gratidão. Há um salmo para cada estado de alma. Leia rezando, devagar.'),
  intro('proverbios', 'Atribuído em grande parte a Salomão; reúne a sabedoria de Israel.', 'Conselhos para a vida do dia a dia.', 'Frases curtas sobre palavras, trabalho, amizade e humildade. Leia poucos por vez e guarde um.'),
  intro('eclesiastes', 'Apresenta-se como palavras do "Coélet", o pregador; a tradição o ligou a Salomão.', 'Uma reflexão sobre o sentido da vida.', '"Vaidade das vaidades": tudo passa. Um livro honesto que nos leva a buscar o que permanece.'),
  intro('cantico', 'Atribuído a Salomão.', 'Poemas de amor entre o amado e a amada.', 'Celebra o amor humano e, na leitura da Igreja, o amor de Deus por seu povo e por cada alma.'),
  intro('sabedoria', 'Autor judeu anônimo que escreveu em grego, pouco antes de Cristo; deuterocanônico.', 'Para judeus vivendo no mundo grego.', 'Um elogio à Sabedoria de Deus e uma fé clara na vida eterna: "as almas dos justos estão na mão de Deus".'),
  intro('eclesiastico', 'Escrito por Jesus Ben Sirac (por isso também chamado Sirácida); deuterocanônico.', 'Ensino de um sábio de Jerusalém, cerca de 180 anos antes de Cristo.', 'Conselhos práticos sobre família, amizade, trabalho e oração. Um "manual de vida" com muitas joias.'),
  // Proféticos
  intro('isaias', 'Leva o nome do profeta Isaías (século VIII a.C.); reúne também oráculos de seus discípulos.', 'De tempos de crise até a volta do exílio.', 'Muitas profecias que a Igreja lê no Advento e na Semana Santa: o Emanuel, o Servo Sofredor, a consolação do povo.'),
  intro('jeremias', 'O profeta Jeremias, com seu secretário Baruc.', 'Os anos antes e durante a queda de Jerusalém.', 'Um profeta sensível, que sofre com sua missão. Promete uma "nova Aliança" escrita no coração.'),
  intro('lamentacoes', 'Tradicionalmente atribuído a Jeremias.', 'Depois da destruição de Jerusalém.', 'Poemas de luto. Ensinam a levar a dor a Deus — e no meio deles: "as misericórdias do Senhor não têm fim".'),
  intro('baruc', 'Ligado a Baruc, secretário de Jeremias; deuterocanônico. O último capítulo é a "Carta de Jeremias".', 'Para os judeus no exílio.', 'Confissão de pecados, elogio da Sabedoria e esperança de volta para casa.'),
  intro('ezequiel', 'O profeta Ezequiel, sacerdote levado ao exílio.', 'Exílio na Babilônia.', 'Visões fortes e simbólicas. Destaques: o pastor que busca a ovelha perdida e os ossos secos que voltam à vida.'),
  intro('daniel', 'Leva o nome de Daniel. A versão católica inclui os capítulos 13 e 14 (Susana, Bel e o dragão).', 'Judeus fiéis em terra estrangeira e tempos de perseguição.', 'Histórias de fidelidade (a cova dos leões) e visões sobre o fim dos tempos e o "Filho do Homem".'),
  intro('oseias', 'O profeta Oseias.', 'Reino do Norte, século VIII a.C.', 'Deus como esposo fiel que continua amando um povo infiel. Um dos livros mais ternos sobre a misericórdia.'),
  intro('joel', 'O profeta Joel.', 'Época de calamidade.', 'Chamado à conversão e a promessa: "derramarei o meu Espírito" — cumprida em Pentecostes.'),
  intro('amos', 'O profeta Amós, um pastor.', 'Tempo de riqueza injusta em Israel.', 'Um profeta que defende os pobres e denuncia uma religião sem justiça.'),
  intro('abdias', 'O profeta Abdias.', 'O menor livro do Antigo Testamento.', 'Um só capítulo sobre a justiça de Deus diante da arrogância das nações.'),
  intro('jonas', 'Leva o nome do profeta Jonas.', 'Uma narrativa com lição profunda.', 'O profeta que foge, o grande peixe e uma cidade inteira que se converte. Deus é misericordioso com todos.'),
  intro('miqueias', 'O profeta Miqueias.', 'Século VIII a.C.', 'Profecia de que o Messias nasceria em Belém e o resumo da fé: praticar a justiça, amar a misericórdia, caminhar humildemente com Deus.'),
  intro('naum', 'O profeta Naum.', 'A queda de Nínive, capital da Assíria.', 'Um poema sobre o fim dos opressores. Deus não abandona os pequenos.'),
  intro('habacuc', 'O profeta Habacuc.', 'Antes da invasão babilônica.', 'Um profeta que pergunta a Deus "até quando?" e aprende: "o justo viverá pela fé".'),
  intro('sofonias', 'O profeta Sofonias.', 'Século VII a.C.', 'O "Dia do Senhor" e a alegria de Deus por seu povo: "ele se alegrará por ti com cânticos".'),
  intro('ageu', 'O profeta Ageu.', 'A volta do exílio.', 'Um convite direto para reconstruir o Templo e colocar Deus em primeiro lugar.'),
  intro('zacarias', 'O profeta Zacarias.', 'A volta do exílio.', 'Visões de esperança e a profecia do rei humilde que entra montado num jumentinho, cumprida no Domingo de Ramos.'),
  intro('malaquias', 'O "mensageiro" (é o que significa o nome).', 'O último livro profético do Antigo Testamento.', 'Chama a um culto sincero e anuncia o mensageiro que preparará o caminho — que os Evangelhos ligam a João Batista.'),
  // Novo Testamento
  intro('mateus', 'A tradição o atribui ao apóstolo Mateus, o cobrador de impostos que seguiu Jesus.', 'Escrito para cristãos vindos do judaísmo.', 'Mostra Jesus como o Messias prometido. Aqui estão o Sermão da Montanha, as Bem-aventuranças e o Pai-Nosso.'),
  intro('marcos', 'A tradição o atribui a Marcos, discípulo e intérprete de São Pedro.', 'O Evangelho mais curto e, provavelmente, o primeiro escrito.', 'Rápido e cheio de ação: Jesus cura, ensina e chama. Ótimo para quem está começando. Leia como quem acompanha Jesus de perto.'),
  intro('lucas', 'São Lucas, médico e companheiro de São Paulo; também escreveu os Atos.', 'Dedicado a "Teófilo", para comunidades de origem não judaica.', 'O Evangelho da misericórdia: o Filho Pródigo, o Bom Samaritano, Zaqueu. Também traz a infância de Jesus e o olhar de Maria.'),
  intro('joao', 'A tradição o atribui ao apóstolo João, "o discípulo que Jesus amava".', 'O último Evangelho escrito, fruto de longa meditação.', 'Mais contemplativo: "No princípio era o Verbo". Sinais, longos diálogos e o mandamento do amor.'),
  intro('atos', 'São Lucas, continuando seu Evangelho.', 'Os primeiros anos da Igreja.', 'Pentecostes, Pedro e Paulo, e o Evangelho chegando até Roma. É a história da Igreja nascendo pela força do Espírito Santo.'),
  intro('romanos', 'São Paulo.', 'Carta à comunidade de Roma, antes de visitá-la.', 'A carta mais profunda de Paulo: somos salvos pela graça de Cristo, que nos dá vida nova no Espírito. Pode ler devagar, por partes.'),
  intro('1-corintios', 'São Paulo.', 'Para a comunidade de Corinto, cheia de dons e de problemas.', 'Divisões, Eucaristia, ressurreição e o famoso hino do amor (cap. 13): "o amor é paciente…".'),
  intro('2-corintios', 'São Paulo.', 'Para a mesma comunidade, num momento de tensões.', 'Paulo abre o coração: "a minha graça te basta, porque a força se aperfeiçoa na fraqueza".'),
  intro('galatas', 'São Paulo.', 'Para comunidades da Galácia.', 'A liberdade de quem vive em Cristo e os frutos do Espírito: amor, alegria, paz…'),
  intro('efesios', 'Tradicionalmente atribuída a São Paulo.', 'Carta circular às comunidades da Ásia.', 'O grande plano de Deus de reunir tudo em Cristo, e a Igreja como seu Corpo.'),
  intro('filipenses', 'São Paulo, escrevendo da prisão.', 'Para uma comunidade muito querida.', 'A carta da alegria. Traz o hino de Cristo que "se esvaziou" por nós.'),
  intro('colossenses', 'Tradicionalmente atribuída a São Paulo.', 'Para a comunidade de Colossos.', 'Cristo no centro de tudo, acima de qualquer poder.'),
  intro('1-tessalonicenses', 'São Paulo — provavelmente o escrito mais antigo do Novo Testamento.', 'Para uma comunidade jovem e perseguida.', 'Carinho, esperança na volta de Cristo e um conselho: "orai sem cessar".'),
  intro('2-tessalonicenses', 'Tradicionalmente atribuída a São Paulo.', 'Para a mesma comunidade.', 'Esclarece dúvidas sobre o fim dos tempos e anima a perseverar no bem.'),
  intro('1-timoteo', 'Tradicionalmente atribuída a São Paulo.', 'Ao discípulo Timóteo, que guiava a comunidade de Éfeso.', 'Conselhos sobre oração, líderes da comunidade e vida cristã.'),
  intro('2-timoteo', 'Tradicionalmente atribuída a São Paulo, no fim da vida.', 'Uma espécie de testamento espiritual.', '"Combati o bom combate, terminei a corrida, guardei a fé." Fala do valor da Escritura.'),
  intro('tito', 'Tradicionalmente atribuída a São Paulo.', 'Ao discípulo Tito, em Creta.', 'Como organizar a comunidade e viver a fé de maneira concreta.'),
  intro('filemom', 'São Paulo.', 'Bilhete pessoal a Filêmon sobre Onésimo, um escravo fugitivo.', 'Um só capítulo: Paulo pede que Onésimo seja recebido "como irmão". O Evangelho mudando relações.'),
  intro('hebreus', 'Autor desconhecido; a tradição a associou a São Paulo.', 'Para cristãos de origem judaica, cansados na fé.', 'Jesus é o Sumo Sacerdote que nos entende. Um grande elogio da fé (cap. 11).'),
  intro('tiago', 'A tradição a atribui a Tiago, "irmão do Senhor".', 'Carta para as comunidades em geral.', 'Fé que vira obras. Conselhos diretos sobre a língua, os pobres e a oração.'),
  intro('1-pedro', 'O apóstolo São Pedro.', 'Para cristãos que sofrem por sua fé.', 'Esperança no meio da dificuldade: somos "pedras vivas" de um povo santo.'),
  intro('2-pedro', 'Tradicionalmente atribuída a São Pedro.', 'Para comunidades diante de falsos mestres.', 'Convite a crescer na fé e a esperar a vinda do Senhor com paciência.'),
  intro('1-joao', 'A tradição a atribui ao apóstolo João.', 'Para comunidades ligadas a João.', '"Deus é amor." Quem ama a Deus ama o irmão. Curta e muito profunda.'),
  intro('2-joao', 'Atribuída a João, "o Ancião".', 'Bilhete a uma comunidade ("a Senhora eleita").', 'Andar na verdade e no amor.'),
  intro('3-joao', 'Atribuída a João, "o Ancião".', 'Bilhete pessoal a Gaio.', 'Elogio à hospitalidade com os missionários.'),
  intro('judas', 'A tradição a atribui a Judas, "irmão de Tiago" — não o traidor.', 'Para comunidades em perigo de se desviar.', 'Um alerta curto e um belo louvor final.'),
  intro('apocalipse', 'A tradição o atribui ao apóstolo João.', 'Para igrejas perseguidas no fim do século I.', 'Linguagem simbólica (números, cores, animais). Não é um mapa do futuro: é uma mensagem de esperança — Cristo vence. Leia sem medo.'),
];

const byId = new Map(BOOK_INTROS.map((i) => [i.bookId, i]));
export function getBookIntro(bookId: string): BookIntro | undefined {
  return byId.get(bookId);
}
