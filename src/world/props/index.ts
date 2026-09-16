/**
 * Kit de cenario ao ar livre. Toda peca volta como um Group com a base em y=0,
 * pronta para `w.add(w.place(bench(), x, 0, z, rot))`.
 * Prefira reaproveitar daqui a modelar coisa nova dentro de uma cena.
 *
 * Onde mexer / onde por peca nova:
 *
 * | arquivo      | o que mora la                                              |
 * |--------------|------------------------------------------------------------|
 * | natureza.ts  | arvore, arbusto, flores, pedra, pato, nuvem                 |
 * | urbano.ts    | banco, poste, lixeira, mesa, cerca, placa, quiosque, predio |
 * | rua.ts       | onibus, ponto de onibus                                     |
 * | quadra.ts    | cesta, placar, arquibancada, bebedouro, refletor, biruta    |
 * | piscina.ts   | casco, agua, escada, trampolim, ducha, boia, guarda-sol     |
 * | itens.ts     | frisbee, coracao, sorvete (coisas pequenas, de mao)         |
 *
 * Quem importa continua escrevendo `from '../world/props'` — este arquivo
 * repassa tudo.
 */

export * from './natureza';
export * from './urbano';
export * from './rua';
export * from './quadra';
export * from './piscina';
export * from './itens';
