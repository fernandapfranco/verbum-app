/**
 * Configurações que dependem de decisões fora do código.
 * ⚠️ Preencher antes de publicar nas lojas.
 */
export const APP_CONFIG = {
  appName: 'Verbum',
  /** Pessoa física ou jurídica responsável pelos dados (LGPD). */
  controllerName: '[a definir — nome do responsável pelo Verbum]',
  /** E-mail para dúvidas e para o encarregado de dados. */
  contactEmail: '[a definir — e-mail de contato]',
  /**
   * Nome do arquivo do banco bíblico no aparelho. Aumente o número sempre que
   * gerar um novo assets/db/bible.db, para o app substituir a cópia antiga.
   */
  bibleDbName: 'bible-v1.db',
} as const;
