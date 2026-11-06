import type { Reviewable } from './types';

/**
 * Glossário tocável. `formas` são as grafias que aparecem no texto (já com a
 * ortografia atualizada) e que, ao serem tocadas no leitor, abrem a definição.
 * `antiga` marca palavras que só são difíceis por serem antigas.
 */
export interface GlossaryTerm extends Reviewable {
  id: string;
  termo: string;
  formas: string[];
  definicao: string;
  antiga?: boolean;
}

const t = (
  id: string,
  termo: string,
  formas: string[],
  definicao: string,
  fontes: string[] = [],
  antiga = false,
): GlossaryTerm => ({ id, termo, formas, definicao, fontes, antiga, status: 'rascunho' });

export const GLOSSARY: readonly GlossaryTerm[] = [
  // Fé e Escritura
  t('alianca', 'Aliança', ['aliança', 'alianças', 'concerto'], 'Um pacto de amor e fidelidade entre Deus e seu povo. Deus faz alianças com Noé, Abraão, Moisés e Davi; em Jesus, faz a "nova e eterna Aliança", selada com o seu sangue.', ['CIC 54–64', 'CIC 1964']),
  t('evangelho', 'Evangelho', ['evangelho', 'evangelhos'], 'Quer dizer "boa notícia": a notícia de que Deus nos ama e nos salva em Jesus. Também é o nome dos quatro livros que contam a vida de Jesus (Mateus, Marcos, Lucas e João).', ['CIC 125–127']),
  t('messias', 'Messias / Cristo', ['messias', 'cristo', 'ungido'], '"Messias" (hebraico) e "Cristo" (grego) significam "Ungido": aquele que Deus consagra para salvar seu povo. Os cristãos reconhecem Jesus como o Messias prometido.', ['CIC 436–440']),
  t('reino', 'Reino de Deus', ['reino de deus', 'reino dos céus'], 'Não é um lugar no mapa: é Deus reinando com seu amor, sua justiça e sua paz. Começa já, no coração de quem acolhe Jesus, e se completará no fim dos tempos.', ['CIC 541–546']),
  t('filho-do-homem', 'Filho do Homem', ['filho do homem'], 'Título que Jesus usa para si mesmo. Lembra a visão de Daniel 7, de alguém que recebe de Deus um reino eterno, e também a sua humanidade.', ['Dn 7,13-14']),
  t('parabola', 'Parábola', ['parábola', 'parábolas', 'semelhança'], 'Uma pequena história do dia a dia (sementes, ovelhas, moedas) que Jesus usa para ensinar algo sobre Deus. Convida a pensar e a tomar posição.', ['CIC 546']),
  t('apostolo', 'Apóstolo', ['apóstolo', 'apóstolos'], '"Enviado". Os Doze escolhidos por Jesus para estar com ele e anunciar o Evangelho. Os bispos são seus sucessores.', ['CIC 857–862']),
  t('discipulo', 'Discípulo', ['discípulo', 'discípulos'], 'Quem segue um mestre para aprender com ele e viver como ele. Todo cristão é chamado a ser discípulo de Jesus.', []),
  t('penitencia', 'Penitência / Conversão', ['penitência', 'fazei penitência', 'conversão'], 'Nesta tradução, "fazer penitência" traduz o chamado à conversão: mudar de mentalidade e de vida, voltando-se para Deus. Não é castigo: é um recomeço.', ['CIC 1430–1433']),
  t('graca', 'Graça', ['graça'], 'Presente gratuito de Deus: sua própria vida e amor em nós, que não podemos merecer, mas podemos acolher.', ['CIC 1996–1999']),
  t('misericordia', 'Misericórdia', ['misericórdia', 'misericórdias', 'misericordioso'], 'O amor de Deus que se inclina sobre a nossa miséria para curar e perdoar. É o coração do Evangelho.', ['CIC 1846–1848']),
  t('pecado', 'Pecado', ['pecado', 'pecados', 'pecador', 'pecadores'], 'Uma ofensa a Deus que também fere a nós e aos outros: escolher contra o amor. Deus nunca se cansa de perdoar quem volta para ele.', ['CIC 1849–1851']),
  t('espirito-santo', 'Espírito Santo', ['espírito santo'], 'A terceira Pessoa da Santíssima Trindade: o Amor de Deus que nos dá vida, coragem e entendimento. Foi derramado sobre a Igreja em Pentecostes.', ['CIC 683–747']),
  t('batismo', 'Batismo', ['batismo', 'batizar', 'batizando', 'batizado', 'batizados'], 'O batismo de João era um sinal de arrependimento. O Batismo cristão nos faz filhos de Deus, nos lava do pecado e nos torna parte da Igreja.', ['CIC 1213', 'CIC 1262–1274']),
  t('pentecostes', 'Pentecostes', ['pentecostes'], 'Festa judaica cinquenta dias depois da Páscoa. Nesse dia o Espírito Santo desceu sobre os apóstolos e Maria (At 2). É considerado o "nascimento" da Igreja em missão.', ['CIC 731–732']),
  t('pascoa', 'Páscoa', ['páscoa'], '"Passagem". Para os judeus, a libertação do Egito. Para os cristãos, a passagem de Jesus da morte à vida: sua Ressurreição, centro da nossa fé.', ['CIC 1168–1171']),
  t('amem', 'Amém', ['amém'], 'Palavra hebraica que quer dizer "é verdade", "assim seja". É o nosso "sim" a Deus.', ['CIC 1061–1065']),
  t('aleluia', 'Aleluia', ['aleluia'], '"Louvai o Senhor" em hebraico. Um grito de alegria, especialmente cantado no tempo da Páscoa.', []),
  t('hosana', 'Hosana', ['hosana'], 'Aclamação hebraica que significa "salva, por favor!" e virou um grito de louvor, como no Domingo de Ramos.', []),
  t('emanuel', 'Emanuel', ['emanuel'], '"Deus conosco". Nome do menino anunciado por Isaías e que os Evangelhos aplicam a Jesus.', ['Is 7,14', 'Mt 1,23']),
  t('profeta', 'Profeta', ['profeta', 'profetas'], 'Alguém chamado por Deus para falar em seu nome: consolar, corrigir e anunciar o que Deus prepara. Mais do que "prever o futuro", é ler o presente com os olhos de Deus.', ['CIC 64', 'CIC 702']),
  t('lei', 'Lei', ['a lei', 'da lei'], 'A Lei de Moisés (Torá): o caminho de vida que Deus deu a Israel, resumido nos Dez Mandamentos. Jesus a leva à plenitude no mandamento do amor.', ['CIC 1961–1964']),
  t('templo', 'Templo', ['templo'], 'O grande santuário de Jerusalém, lugar da presença de Deus no meio do povo. Jesus fala de seu próprio corpo como o novo Templo.', ['CIC 583–586']),
  t('sinagoga', 'Sinagoga', ['sinagoga', 'sinagogas'], 'Casa de oração e de estudo da Escritura dos judeus, presente em cada cidade. Jesus ensinava nelas aos sábados.', []),
  t('sabado', 'Sábado', ['sábado', 'sábados'], 'Dia sagrado de descanso para os judeus, em memória da criação e da libertação. Os cristãos celebram o domingo, dia da Ressurreição.', ['CIC 2168–2176']),
  t('fariseus', 'Fariseus', ['fariseu', 'fariseus'], 'Grupo judeu muito religioso, dedicado a cumprir a Lei nos mínimos detalhes. Jesus elogia seu zelo, mas critica quem se acha melhor que os outros.', []),
  t('saduceus', 'Saduceus', ['saduceu', 'saduceus'], 'Grupo ligado aos sacerdotes do Templo. Não acreditavam na ressurreição dos mortos.', []),
  t('escribas', 'Escribas', ['escriba', 'escribas'], 'Especialistas em ler e interpretar a Lei; os "doutores da lei".', []),
  t('publicanos', 'Publicanos', ['publicano', 'publicanos'], 'Cobradores de impostos para Roma. Eram malvistos, considerados traidores e pecadores — e Jesus comia com eles.', []),
  t('samaritanos', 'Samaritanos', ['samaritano', 'samaritanos', 'samaritana'], 'Povo da Samaria, vizinho dos judeus, com quem havia antiga rivalidade. Jesus os coloca como exemplo de fé e de amor.', []),
  t('levita', 'Levita', ['levita', 'levitas'], 'Membro da tribo de Levi, encarregado de ajudar no culto do Templo.', []),
  t('sinedrio', 'Sinédrio / Conselho', ['sinédrio', 'concílio'], 'O conselho supremo dos judeus em Jerusalém, presidido pelo sumo sacerdote.', []),
  t('sumo-sacerdote', 'Príncipe dos sacerdotes', ['príncipe dos sacerdotes', 'príncipes dos sacerdotes', 'sumo sacerdote'], 'Os sacerdotes principais do Templo; "príncipe dos sacerdotes" é como esta tradução chama o sumo sacerdote.', []),
  t('gentios', 'Gentios', ['gentio', 'gentios'], 'Os povos que não eram judeus. O Evangelho é anunciado a todos eles.', []),
  t('circuncisao', 'Circuncisão', ['circuncisão', 'circuncidado', 'circuncidados'], 'Sinal da Aliança de Deus com Abraão, feito nos meninos judeus. São Paulo ensina que em Cristo o que conta é a fé que age pelo amor.', ['Gn 17', 'Gl 5,6']),
  t('denario', 'Dinheiro / Denário', ['denário', 'denários', 'dinheiros'], 'Moeda romana de prata, mais ou menos o pagamento de um dia de trabalho.', []),
  t('dracma', 'Dracma', ['dracma', 'dracmas'], 'Moeda grega de prata, de valor parecido com o denário.', []),
  t('talento', 'Talento', ['talento', 'talentos'], 'Uma quantia enorme de dinheiro (milhares de dias de trabalho). Da parábola dos talentos vem o sentido de "dom".', []),
  t('leproso', 'Leproso', ['leproso', 'leprosos', 'lepra'], 'Pessoa com doença de pele grave. Era excluída do convívio. Jesus toca e cura os leprosos.', []),
  t('possesso', 'Possesso / Espírito imundo', ['possesso', 'possessos', 'espírito imundo', 'espíritos imundos'], 'Pessoa dominada pelo mal. Jesus liberta com autoridade, mostrando que o Reino de Deus vence o mal.', ['CIC 550', 'CIC 1673']),
  t('satanas', 'Satanás / Demônio', ['satanás', 'demônio', 'demônios', 'diabo'], 'O Adversário: um anjo que rejeitou a Deus e tenta afastar as pessoas dele. Jesus o venceu.', ['CIC 391–395']),
  t('anjo', 'Anjo', ['anjo', 'anjos'], 'Criaturas espirituais que servem a Deus e o louvam; também são mensageiros e protetores. Cada um de nós tem um anjo da guarda.', ['CIC 328–336']),
  t('centuriao', 'Centurião', ['centurião'], 'Oficial do exército romano que comandava cerca de cem soldados.', []),
  t('jordao', 'Rio Jordão', ['jordão'], 'O principal rio da Terra Santa, onde João batizava e onde Jesus foi batizado.', []),
  t('galileia', 'Galileia', ['galileia'], 'Região do norte da Terra Santa, onde Jesus cresceu (em Nazaré) e começou a pregar.', []),
  t('cafarnaum', 'Cafarnaum', ['cafarnaum'], 'Cidade à beira do mar da Galileia, onde Jesus morou durante sua pregação.', []),
  // Palavras antigas da tradução
  t('outrossim', 'outrossim', ['outrossim'], 'Também; do mesmo modo.', [], true),
  t('porventura', 'porventura', ['porventura'], 'Por acaso; será que…', [], true),
  t('varao', 'varão', ['varão', 'varões'], 'Homem.', [], true),
  t('mancebo', 'mancebo', ['mancebo', 'mancebos'], 'Rapaz, jovem.', [], true),
  t('donzela', 'donzela', ['donzela', 'donzelas'], 'Moça; jovem solteira.', [], true),
  t('lombos', 'lombos', ['lombos'], 'Cintura. "Cingir os lombos" é amarrar a roupa na cintura para estar pronto para caminhar ou trabalhar.', [], true),
  t('veredas', 'veredas', ['veredas', 'vereda'], 'Caminhos estreitos, trilhas.', [], true),
  t('mister', 'mister', ['mister'], '"Ter mister de" = precisar de.', [], true),
  t('jornaleiros', 'jornaleiros', ['jornaleiro', 'jornaleiros'], 'Trabalhadores pagos por dia (pela "jornada").', [], true),
  t('landes', 'landes', ['landes'], 'Bolotas, frutos do carvalho usados para alimentar porcos.', [], true),
  t('estulticia', 'estultícia', ['estultícia', 'estulto', 'estultos'], 'Tolice, falta de juízo.', [], true),
  t('opróbrio', 'opróbrio', ['opróbrio', 'opróbrios'], 'Vergonha, humilhação pública.', [], true),
  t('iniquidade', 'iniquidade', ['iniquidade', 'iniquidades', 'iníquo', 'iníquos'], 'Maldade, injustiça; pecado.', [], true),
  t('diuturnidade', 'diuturnidade', ['diuturnidade'], 'Longa duração. "Por diuturnidade de dias" = por muitos e muitos dias.', [], true),
  t('pingue', 'pingue', ['pingue'], 'Gordo, abundante; óleo fino e perfumado.', [], true),
  t('baculo', 'báculo', ['báculo'], 'Cajado, bordão do pastor.', [], true),
  t('sicomoro', 'sicômoro', ['sicômoro'], 'Árvore parecida com a figueira, de galhos baixos e fáceis de subir.', [], true),
  t('entrouxar', 'entrouxando', ['entrouxando'], 'Juntando tudo numa trouxa; fazendo as malas.', [], true),
  t('regalar', 'regalar-se', ['regalar', 'regalarmos', 'regalar-me'], 'Divertir-se, festejar com fartura.', [], true),
  t('cevado', 'cevado', ['cevado'], 'Engordado para a festa.', [], true),
  t('complacencia', 'complacência', ['complacência'], 'Agrado, alegria. "Em ti pus toda a minha complacência" = "em ti está todo o meu agrado".', [], true),
  t('defraudar', 'defraudar', ['defraudado'], 'Enganar alguém para tirar o que é dele.', [], true),
  t('jubilo', 'júbilo', ['júbilo'], 'Alegria muito grande.', [], true),
];

const byId = new Map(GLOSSARY.map((g) => [g.id, g]));
export function getTerm(id: string) {
  return byId.get(id);
}
