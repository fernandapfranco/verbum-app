/**
 * Configurações que dependem de decisões fora do código.
 * ⚠️ Preencher antes de publicar nas lojas.
 */
export const APP_CONFIG = {
  appName: 'Verbum',
  /** Pessoa física ou jurídica responsável pelos dados (LGPD). */
  controllerName: 'Fernanda',
  /**
   * Canal de contato para dúvidas e para o encarregado de dados.
   * ⚠️ As lojas (App Store/Google Play) exigem também um e-mail de contato.
   */
  contactLabel: 'LinkedIn: linkedin.com/in/fernandapedrottifranco',
  contactUrl: 'https://www.linkedin.com/in/fernandapedrottifranco',
  /**
   * Nome do arquivo do banco bíblico no aparelho. Aumente o número sempre que
   * gerar um novo assets/db/bible.db, para o app substituir a cópia antiga.
   */
  bibleDbName: 'bible-v5.db',
} as const;
