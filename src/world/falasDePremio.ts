import { ARI, RENAN } from '../characters/cast';
import type { GameAPI } from '../core/types';
import { PREMIOS_DA_ARENA } from './itens';

/**
 * O QUE CADA UM FALA QUANDO VOCÊ APARECE VESTINDO O PRÊMIO DELE.
 *
 * Ganhar a roupa é metade do presente; a outra metade é o dono reparar. Sem
 * isto, a jaqueta do Jean-Luc é só mais um tronco azul no guarda-roupa — e o
 * jogo inteiro é sobre gente que repara nas coisas.
 *
 * A regra é a mesma para os quatro:
 *
 * - a PRIMEIRA vez é a cena de verdade, e acontece uma vez só (flag
 *   `premio-notado-<id>`): é ali que ele diz o que aquilo significa;
 * - dali em diante entra uma fala CURTA, sorteada em rodízio pelo contador
 *   `premio.<id>`. Curta de propósito: quem já viu a cena grande não pode ser
 *   obrigado a ver de novo só porque continuou com a roupa.
 *
 * As falas moram aqui, e não na cena, porque a Estella aparece em DOIS lugares
 * (a calçada do parque e o balcão da boutique) e o Mano em dois também (o
 * quiosque e a praça de gelo). Duas cópias da mesma fala viram duas falas
 * diferentes no primeiro ajuste.
 *
 * Vale para a dupla INTEIRA: basta um dos dois estar vestindo. Quem ganhou foi
 * o casal, e o bicho olha para os dois de qualquer jeito.
 */

export type Fala = readonly [string, string];

export interface FalaDePremio {
  /** a cena grande, uma vez só */
  readonly primeira: readonly Fala[];
  /** as curtas de depois, em rodízio */
  readonly depois: readonly (readonly Fala[])[];
}

const A = ARI.name;
const R = RENAN.name;

export const FALAS_DE_PREMIO: Record<string, FalaDePremio> = {
  'jean-luc': {
    primeira: [
      ['Jean-Luc', 'Attendez. ATTENDEZ.'],
      ['Jean-Luc', 'Vocês estão de azul. Com a faixa. E com o... o petit canard aqui no peito.'],
      [A, 'A gente ganhou de você.'],
      ['Jean-Luc', 'Ganharam. E vestiram.'],
      ['Jean-Luc', 'Sabem o que é isso, no meu país? É o que se faz com a camisa de quem se respeita.'],
      [R, 'A gente só achou bonita.'],
      ['Jean-Luc', 'Eu vou fingir que não ouvi essa parte. Deixem eu ter o meu momento.'],
      ['Jean-Luc', 'Voilà. Obrigado. Merci.'],
    ],
    depois: [
      [['Jean-Luc', 'O patinho do peito está torto. Non, mentira. Está perfeito.']],
      [['Jean-Luc', 'Essa jaqueta é da seleção. A seleção sou eu. Sozinho. Mas é a seleção.']],
      [
        ['Jean-Luc', 'Azul, branco e vermelho. Liberté, égalité, e a terceira eu esqueci.'],
        [A, 'Fraternité.'],
        ['Jean-Luc', 'FRATERNITÉ. Eu sabia. Eu só estava testando vocês.'],
      ],
      [['Jean-Luc', 'De jaqueta vocês jogam melhor. É científico. Não me peçam a fonte.']],
      [
        ['Jean-Luc', 'Ça vous va bien.'],
        ['Jean-Luc', 'Ficou bom em vocês. Eu podia ter dito em português, mas não ia soar igual.'],
      ],
    ],
  },

  cookie: {
    primeira: [
      ['Cookie', 'Ah.'],
      ['Cookie', '...'],
      [R, 'Cookie?'],
      ['Cookie', 'É o meu quepe. Vocês estão com o meu quepe.'],
      ['Cookie', 'Quer dizer, é outro. Eu fiz a Estella costurar mais um. Eu pedi. Eu nunca peço nada.'],
      [A, 'Você pediu pra ela fazer pra gente?'],
      ['Cookie', 'Pedi. Achei que se vocês ganhassem de mim... aí eu tinha uma desculpa.'],
      ['Cookie', 'Ninguém nunca quis usar nada meu. Eu sou o elefante grande da bilheteria.'],
      ['Cookie', 'E agora tem gente andando pelo parque de quepe igual ao meu.'],
      [A, 'Tem dois.'],
      ['Cookie', 'Tem três. Contando o meu.'],
    ],
    depois: [
      [['Cookie', 'A aba tem que ficar reta. A minha vive torta, mas a de vocês tem que ficar reta.']],
      [['Cookie', 'Olha a estrelinha. É a mesma da bilheteria. A Estella carimbou uma por uma.']],
      [
        ['Cookie', 'Hoje um moço me perguntou onde compra o bilhete.'],
        ['Cookie', 'Ele perguntou pra vocês, na verdade. Por causa do quepe. Eu achei ótimo.'],
      ],
      [['Cookie', 'Vocês estão de serviço. Se aparecer fila, eu conto com vocês.']],
      [['Cookie', 'Eu fiquei olhando vocês chegando de longe. Eu vi o azul primeiro.']],
    ],
  },

  mano: {
    primeira: [
      ['Mano', 'AH! AH. OS PATINS.'],
      ['Mano', 'Vocês estão COM OS PATINS.'],
      [R, 'A gente ganhou de você no ping pong, Mano.'],
      ['Mano', 'Eu sei! Eu estava lá! Foi lindo!'],
      ['Mano', 'Olha a casquinha do lado. Olha. Eu escolhi a bola de morango porque é a cor do meu avental.'],
      [A, 'Ficou parecendo você.'],
      ['Mano', 'É PRA PARECER COMIGO.'],
      ['Mano', 'Desculpa. Eu falei alto. Eu falo alto quando fico feliz.'],
      ['Mano', 'Vão dar uma volta na pista. Vão AGORA. Eu vou ficar aqui olhando.'],
    ],
    depois: [
      [['Mano', 'Roda uma vez pra mim. Só uma. Por favor.']],
      [['Mano', 'A casquinha do pé direito é de morango. A do esquerdo também. Eu não sou criativo.']],
      [
        ['Mano', 'Sabe por que eu dou patins de prêmio e não sorvete?'],
        [A, 'Por quê?'],
        ['Mano', 'Porque sorvete acaba. Aí vocês iam ter que voltar. E eu queria que voltassem sem precisar.'],
      ],
      [['Mano', 'De patins vocês ficam mais altos. Eu fico do mesmo tamanho. Tudo bem.']],
      [['Mano', 'Se cair, cai rindo. É a única regra da pista.']],
    ],
  },

  estella: {
    primeira: [
      ['Estella', 'PARA. Para aí. Não se mexe.'],
      ['Estella', 'Vira. Vira devagar. Devagar, meu bem.'],
      [R, 'A gente pode falar ou...'],
      ['Estella', 'Não. Ainda não.'],
      ['Estella', 'Caiu. Caiu certinho no ombro. A barra bateu onde tinha que bater.'],
      ['Estella', 'Vocês sabem o que é essa peça? É a única coisa que eu costurei sem encomenda.'],
      [A, 'Sem encomenda?'],
      ['Estella', 'Sem. Eu fiz no ano passado, depois de uma partida que eu perdi de propósito pra um menino.'],
      ['Estella', 'Fiquei brava comigo. Costurei o conjunto inteiro de raiva e guardei.'],
      ['Estella', 'Falei: isso aqui é de quem me ganhar de verdade.'],
      ['Estella', 'Demorou. Mas chegou.'],
    ],
    depois: [
      [['Estella', 'Casa preta com casa branca. Nunca duas iguais coladas. Nem no tabuleiro, nem na costura.']],
      [['Estella', 'O broche é uma dama. Não é uma rainha, é uma DAMA. Tem diferença e eu explico se pedirem.']],
      [
        ['Estella', 'Essa coroa não é enfeite, viu.'],
        ['Estella', 'A dama anda como quiser. Pra frente, pra trás, de lado, na diagonal.'],
        ['Estella', 'Vocês também. Foi pra isso que eu fiz.'],
      ],
      [['Estella', 'A bota fecha o conjunto. Sem ela vocês são gente bem vestida de pé descalço.']],
      [
        ['Estella', 'Deixa eu ver a lapela... hm.'],
        ['Estella', 'Perfeita. Eu só queria uma desculpa pra chegar perto.'],
      ],
    ],
  },
};

/** Alguém da dupla está vestindo alguma peça do prêmio deste bicho? */
export function vestindoOPremio(api: GameAPI, id: string): boolean {
  const pecas = PREMIOS_DA_ARENA[id] ?? [];
  if (pecas.length === 0) return false;
  for (const quem of [api.playerId(), api.companionId()]) {
    for (const vaga of api.wearables(quem)) {
      if (vaga && pecas.some((p) => p.id === vaga.id)) return true;
    }
  }
  return false;
}

/**
 * Fala do prêmio, se houver.
 *
 * Devolve `true` quando FALOU — e é por isso que ela devolve alguma coisa: a
 * cena usa o resultado para pular o "oi" de sempre. Falar do prêmio e depois
 * soltar um cumprimento genérico na sequência seria o bicho reparando na
 * roupa e esquecendo dela no mesmo fôlego.
 */
export async function falarDoPremio(api: GameAPI, id: string): Promise<boolean> {
  if (!vestindoOPremio(api, id)) return false;
  const bloco = FALAS_DE_PREMIO[id];
  if (!bloco) return false;

  const chave = `premio-notado-${id}`;
  let falas: readonly Fala[];
  if (api.flag(chave)) {
    // o rodízio: o contador é o mesmo que decide a fala do pato, e a conta de
    // `-1` existe porque `bump` devolve o valor DEPOIS de somar
    const vezes = api.bump(`premio.${id}`);
    falas = bloco.depois[(vezes - 1) % bloco.depois.length];
  } else {
    api.setFlag(chave);
    falas = bloco.primeira;
  }
  for (const [quem, texto] of falas) await api.say([texto], quem);
  return true;
}
