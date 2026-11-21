import { CHAVE } from './consequencias';

/** Marco fixo: acrescentar dias à escala não muda o que foi a primeira semana. */
export const DIAS_DA_PRIMEIRA_SEMANA = [1, 2, 3, 4, 5, 6] as const;
export const HOMENAGEM_DA_GINA = 'portaria:homenagem:primeira-semana';

export function homenagemDaGinaPendente(s: { stat(chave: string): number; flag(chave: string): boolean }): boolean {
  return !s.flag(HOMENAGEM_DA_GINA) && DIAS_DA_PRIMEIRA_SEMANA.every(n => s.stat(CHAVE.vezes(n)) > 0);
}

/** Falas ficcionais da primeira semana; o agradecimento não depende da nota. */
export const FALAS_DA_HOMENAGEM = [
  { titulo: 'Só mais um minutinho…', texto: 'Mmm… peraí, bebitos. Trouxe uma coisinha pra vocês!', botao: 'O que é, Gina? →' },
  { titulo: 'Parabéns, meus bebitos!', texto: 'Seis dias de portaria juntos! Teve correria, teve dúvida… e vocês continuaram aprendendo. Parabéns pela nossa primeira semana!', botao: 'Continuar →' },
  { titulo: 'Obrigada pela companhia', texto: 'Vocês não cuidaram só do portão. Fizeram companhia pra mim. Essa guarita ficou muito mais alegre com vocês aqui. Obrigada, de coração.', botao: 'A gente também… →' },
  { titulo: 'A nossa equipe', texto: 'A gente também adorou ficar aqui com você, Gina. Essa guarita já tem um pedacinho da gente.', botao: 'Ouvir a Gina →' },
  { titulo: 'Foi só a primeira semana', texto: 'E eu vou guardar esse pedacinho com carinho! Voltem quando quiserem, viu? Agora… descanso! E sem tocar a campainha na saída só pra me dar susto!', botao: 'Obrigado, Gina! 💚' },
] as const;
