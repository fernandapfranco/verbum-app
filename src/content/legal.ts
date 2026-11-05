/**
 * Termos de Uso e Política de Privacidade (rascunho).
 *
 * ⚠️ Antes de publicar nas lojas: revisão por advogado e preenchimento de
 * src/config.ts (responsável pelos dados e e-mail de contato).
 *
 * Ao mudar o conteúdo de forma relevante, aumente LEGAL_VERSION: o app pedirá
 * um novo aceite na próxima abertura.
 */
import { APP_CONFIG } from '../config';

export const LEGAL_VERSION = '2026-11-05';
export const MIN_AGE = 16;

export interface LegalSection {
  titulo: string;
  corpo: string;
}

const { controllerName, contactEmail } = APP_CONFIG;

export const TERMS: LegalSection[] = [
  {
    titulo: '1. O que é o Verbum',
    corpo:
      'O Verbum é um aplicativo para ajudar você a ler a Bíblia com constância e a crescer na vida de oração, com planos de leitura, trilhas, notas explicativas e recursos de acompanhamento. O app é de inspiração católica e procura estar de acordo com o Catecismo da Igreja Católica, mas não é um documento oficial da Igreja.',
  },
  {
    titulo: '2. Quem pode usar',
    corpo: `O Verbum é destinado a pessoas com ${MIN_AGE} anos ou mais. Ao continuar, você declara ter essa idade.`,
  },
  {
    titulo: '3. Texto bíblico',
    corpo:
      'O texto bíblico é a tradução do Pe. Antônio Pereira de Figueiredo, em domínio público, com a ortografia atualizada. Ele foi recuperado de digitalizações antigas e está em revisão contínua: alguns trechos podem conter pequenos erros, que corrigimos à medida que são encontrados. As notas, explicações e trilhas são conteúdos próprios do Verbum, em revisão doutrinal.',
  },
  {
    titulo: '4. Uso adequado',
    corpo:
      'Use o app de forma pessoal e respeitosa. Não tente copiar o aplicativo em si, interferir no seu funcionamento ou usá-lo para fins ilegais. Os recursos sociais (quando existirem) devem ser usados com caridade: sem ofensas, assédio ou conteúdo impróprio.',
  },
  {
    titulo: '5. Sem substituir a Igreja nem profissionais',
    corpo:
      'O Verbum é um apoio à sua vida de fé e não substitui a vida sacramental, a orientação de um sacerdote ou diretor espiritual, nem acompanhamento psicológico ou médico quando necessário.',
  },
  {
    titulo: '6. Disponibilidade e mudanças',
    corpo:
      'Podemos atualizar o app e estes termos. Mudanças relevantes serão avisadas no próprio app e pediremos um novo aceite. O app é oferecido "como está", e nos esforçamos para que funcione bem e sem interrupções.',
  },
  {
    titulo: '7. Contato',
    corpo: `Responsável: ${controllerName}. Dúvidas: ${contactEmail}. Estes termos seguem a legislação brasileira.`,
  },
];

export const PRIVACY: LegalSection[] = [
  {
    titulo: 'Em poucas palavras',
    corpo:
      'Nesta versão, tudo o que você faz no Verbum fica guardado somente no seu aparelho. Não temos servidor, não criamos conta, não vendemos dados e não usamos rastreadores de publicidade.',
  },
  {
    titulo: '1. Quais dados ficam no seu aparelho',
    corpo:
      '• Suas respostas iniciais (experiência com a Bíblia, momento na fé, tempo disponível) e o nome que você deu ao seu anjo.\n• Seu plano de leitura e os capítulos que você marcou como lidos.\n• Destaques, favoritos e notas que você fizer nos versículos.\n• Seu diário espiritual (somente se você autorizar).\n• Suas preferências de leitura e os registros dos seus consentimentos.',
  },
  {
    titulo: '2. Dados sensíveis',
    corpo:
      'A Lei Geral de Proteção de Dados (LGPD, art. 5º, II e art. 11) considera "convicção religiosa" um dado pessoal sensível. Por isso, pedimos seu consentimento específico e separado para guardar seu diário espiritual e suas notas pessoais, e você pode retirá-lo a qualquer momento.',
  },
  {
    titulo: '3. Para que usamos',
    corpo:
      'Apenas para o app funcionar para você: montar e ajustar seu plano, lembrar onde você parou, mostrar seus destaques e seu diário. Nada é enviado para fora do aparelho nesta versão.',
  },
  {
    titulo: '4. Recursos futuros',
    corpo:
      'Quando o Verbum ganhar recursos com conta e amigos (como ver a sequência de amigos ou enviar pedidos de oração), explicaremos exatamente o que será enviado, para onde (servidor no Brasil) e pediremos um novo consentimento específico antes. Nada disso é ativado sem você aceitar.',
  },
  {
    titulo: '5. Seus direitos',
    corpo:
      'Você pode, a qualquer momento, em Perfil → Privacidade e dados: ver e revisar seus consentimentos, exportar uma cópia dos seus dados e apagar todos os seus dados do aparelho. Desinstalar o app também apaga tudo.',
  },
  {
    titulo: '6. Segurança',
    corpo:
      'Seus dados ficam na área privada do aplicativo no seu aparelho. Recomendamos manter o celular protegido com senha ou biometria, já que o diário é pessoal.',
  },
  {
    titulo: '7. Contato e encarregado',
    corpo: `Controlador: ${controllerName}. Encarregado de dados (DPO) e dúvidas sobre privacidade: ${contactEmail}.`,
  },
];
