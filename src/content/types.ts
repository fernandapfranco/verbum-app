/**
 * Todo conteúdo explicativo passa por revisão doutrinal (docs/revisao-doutrinal.md).
 *
 *  rascunho   → escrito, ainda não revisado
 *  em-revisao → enviado ao revisor
 *  aprovado   → revisado e aprovado; pode ir para a loja sem etiqueta
 */
export type ReviewStatus = 'rascunho' | 'em-revisao' | 'aprovado';

export interface Reviewable {
  status: ReviewStatus;
  /** Fontes consultadas: parágrafos do Catecismo (CIC), documentos, passagens. */
  fontes?: string[];
}

export interface PassageRef {
  bookId: string;
  chapter: number;
  /** Primeiro e último versículo (inclusive). Ausentes = capítulo inteiro. */
  from?: number;
  to?: number;
}
