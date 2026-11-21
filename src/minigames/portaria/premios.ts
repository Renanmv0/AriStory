/** Entrega separada da nota: a melhor marca vale também para quem jogou antes. */
export const CHAVE_DO_PREMIO = (n: number): string => `portaria:premio:dia:${n}`;
export function premiosPendentes(s: { stat(chave: string): number; flag(chave: string): boolean }): number[] {
  return [1, 2, 3, 4, 5, 6].filter(n => s.stat(`portaria:dia:${n}:estrelas`) >= 3 && !s.flag(CHAVE_DO_PREMIO(n)));
}

/** Falas de presente, criadas para o minigame; não são fatos da vida real da dupla. */
export const RECADOS_DO_PREMIO: Readonly<Record<number, string>> = {
  1: 'Dois crachás, duas estrelinhas de gente… e três de serviço! Fiz com um coraçãozinho para vocês não esquecerem de atender com carinho.',
  2: 'Um apito dourado pra cada um! Pode apitar de orgulho. De cinco em cinco segundos, não, que eu ainda trabalho aqui!',
  3: 'Agora têm quepe de porteiro de verdade! Deixei espaço pros cachinhos. E um coração do ladinho: autoridade com fofura.',
  4: 'Esses coletes refletem luz e bom serviço! Tem bolso para a caneta e um coração escondidinho. Segurança não precisa ser sem graça.',
  5: 'Pulseirinha VIP para os dois! VIP de “Vocês Inspecionam Perfeitinho”. O exame da piscina continua valendo, hein!',
  6: 'O uniforme completo da nossa equipe! Camisa, calça e tênis para cada um. Vocês cabem direitinho na guarita… e no meu coração.',
};
