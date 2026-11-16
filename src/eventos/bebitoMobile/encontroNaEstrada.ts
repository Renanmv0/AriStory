import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import { CarroDaJosefina } from '../../world/carroDaJosefina';
import type { PersonagemNaEstrada } from './rota';
import { CarroDoNoel } from '../../world/carroDoNoel';
import { MotoDoCapy } from '../../world/motoDoCapy';
import { FoodTruckDoWalter } from '../../world/foodTruckDoWalter';
import { LambretaDaEstella } from '../../world/lambretaDaEstella';
import { KombiDoMano } from '../../world/kombiDoMano';
import { CarrinhoDoCookie } from '../../world/carrinhoDoCookie';
import { DoisCavalosDoJeanLuc } from '../../world/doisCavalosDoJeanLuc';
import { ITENS } from '../../world/itens';
import { ARI, RENAN } from '../../characters/cast';
import type { NaPista } from '../../world/estrada';

type Fase = 'esperando' | 'alinhando' | 'ultrapassando' | 'freando' | 'falando' | 'saindo' | 'feito';
const suave = (t: number): number => { const k = Math.max(0, Math.min(1, t)); return k * k * (3 - 2 * k); };

/** Uma cena no relógio da viagem, isolada dos obstáculos e com as faixas reservadas. */
export class EncontroNaEstrada {
  readonly carro: CarroDoNoel | CarroDaJosefina | MotoDoCapy | FoodTruckDoWalter | LambretaDaEstella | KombiDoMano | CarrinhoDoCookie | DoisCavalosDoJeanLuc;
  get nome(): string { return ({ noel: 'Noel', capy: 'Capy', walter: 'Walter', josefina: 'Josefina', estella: 'Estella', mano: 'Mano', cookie: 'Cookie', jeanluc: 'Jean-Luc' } as const)[this.personagem]; }
  get icone(): string { return ({ noel: '🦃', capy: '🛵', walter: '🌭', josefina: '🐢', estella: '🧵', mano: '🍦', cookie: '🐘', jeanluc: '🦆' } as const)[this.personagem]; }
  readonly estado = { fase: 'esperando' as Fase, relativo: -28, tempo: 0, s: 0 };
  private falas = false;
  private anterior: THREE.Vector3 | null = null;
  private inicioDaFreada = 0;
  parada: number | null = null;
  constructor(private readonly g: GameAPI, readonly s: number, private readonly naPista: NaPista, private readonly rumo: (s: number) => number, private readonly carona: string, readonly personagem: PersonagemNaEstrada = 'noel') {
    this.carro = personagem === 'noel' ? new CarroDoNoel() : personagem === 'capy' ? new MotoDoCapy()
      : personagem === 'walter' ? new FoodTruckDoWalter() : personagem === 'estella' ? new LambretaDaEstella()
        : personagem === 'mano' ? new KombiDoMano() : personagem === 'cookie' ? new CarrinhoDoCookie()
          : personagem === 'jeanluc' ? new DoisCavalosDoJeanLuc() : new CarroDaJosefina();
    this.carro.group.visible = false;
  }
  get ativo(): boolean { return this.estado.fase !== 'esperando' && this.estado.fase !== 'feito'; }
  /** O evento aguarda menu/olhar terminar para não abrir outra fala por cima. */
  update(dt: number, viagem: { s: number; v: number; l: number }, podeComecar: boolean): void {
    const e = this.estado;
    if (e.fase === 'esperando') {
      if (viagem.s < this.s - 60 || !podeComecar) return;
      e.fase = 'alinhando'; e.tempo = 0;
      this.g.toast(({
        noel: 'Uma buzinadinha atrás… é o Noel!',
        capy: 'Capacete vermelho no retrovisor… é o Capy!',
        walter: 'Cheirinho de cachorro-quente no retrovisor… é o Walter!',
        josefina: 'Olha quem veio com as plantinhas: a Josefina!',
        estella: 'Uma TORRE de roupas no retrovisor… é a Estella!',
        mano: 'Uma musiquinha de sorveteiro chegando… é o Mano de Kombi!',
        cookie: 'Um carrinho cor-de-rosa com duas orelhas pra fora… é o Cookie!',
        jeanluc: 'Um 2CV azul, uma boina e um par de óculos escuros… é o Jean-Luc!',
      } as const)[this.personagem], this.icone);
      // (o Mano chega tocando a musiquinha da Kombi, e o Cookie apertando a corneta com a tromba)
      this.g.som(this.personagem === 'mano' ? 'musiquinhaDoSorvete' : this.personagem === 'cookie' ? 'cornetaDoCookie'
        : this.personagem === 'jeanluc' ? 'buzinaDoJeanLuc' : 'buzinaDoBebito');
      if (this.carro instanceof CarrinhoDoCookie) this.carro.buzinar();
    }
    if (e.fase === 'feito') return;
    e.tempo += dt;
    if (e.fase === 'alinhando' && e.tempo >= 2.4 && Math.abs(viagem.l - 1.75) < 0.12) {
      e.fase = 'ultrapassando'; e.tempo = 0;
    }
    if (e.fase === 'ultrapassando') {
      const duracao = ({ noel: 2.7, capy: 4, walter: 4.6, josefina: 5, estella: 4.4, mano: 4.8, cookie: 5.2, jeanluc: 4.6 } as const)[this.personagem];
      e.relativo = -28 + 42 * suave(e.tempo / duracao);
      if (e.tempo >= duracao) {
        e.fase = 'freando'; e.tempo = 0;
        this.inicioDaFreada = viagem.s + e.relativo;
        this.parada = this.inicioDaFreada + 8.75;
      }
    } else if (e.fase === 'freando') {
      // Ele freia adiante e o Bebito alcança a parada; nunca desliza de ré
      // para emparelhar. 7 m/s desacelerando a zero em 2,5 s percorrem 8,75 m.
      const t = Math.min(2.5, e.tempo);
      e.relativo = this.inicioDaFreada + 7 * (t - t * t / 5) - viagem.s;
      if (e.tempo >= 2.5 && viagem.v < 0.1 && Math.abs(viagem.s - this.parada!) < 0.2) { e.fase = 'falando'; e.tempo = 0; }
    } else if (e.fase === 'falando' && !this.falas) {
      this.falas = true;
      void this.conversar().then(() => {
        e.fase = 'saindo'; e.tempo = 0;
        if (this.personagem === 'mano') this.g.som('musiquinhaDoSorvete');
        if (this.carro instanceof CarrinhoDoCookie) { this.g.som('cornetaDoCookie'); this.carro.buzinar(); }
        if (this.personagem === 'jeanluc') this.g.som('buzinaDoJeanLuc');
      });
    } else if (e.fase === 'saindo') {
      e.relativo = 4 * e.tempo + 3.5 * e.tempo * e.tempo;
      if (e.relativo > 65) {
        e.fase = 'feito'; this.carro.group.visible = false;
        this.g.toast(({
          noel: 'Ele tem mais pressa que o liquidificador.',
          capy: 'Salva-vidas até no asfalto.',
          walter: 'Garçom de verdade não desliga a bandeja.',
          josefina: 'Cada mudinha tem seu cinto de segurança.',
          estella: 'A pilha balançou… mas não caiu nem um pé de meia.',
          mano: 'E lá vai a Kombi, tocando a musiquinha até sumir.',
          cookie: 'O carrinho foi embora quicando, com as orelhas dando tchau.',
          jeanluc: 'Lá vai o 2CV, chacoalhando, com a boina no vento e os óculos brilhando.',
        } as const)[this.personagem], this.icone);
      }
    }
    e.s = viagem.s + e.relativo;
    this.carro.group.visible = e.fase !== 'feito';
    const p = this.naPista(e.s, -1.75);
    this.carro.group.position.copy(p); this.carro.group.rotation.y = this.rumo(e.s);
    this.carro.update(dt, this.anterior ? this.anterior.distanceTo(p) : 0, e.fase === 'falando');
    this.anterior = p;
  }
  /** O Bebito deixa a esquerda livre e para ao lado dele para o comentário. */
  velocidade(s: number): number {
    const e = this.estado;
    if (e.fase === 'freando') return Math.min(7, Math.sqrt(6 * Math.max(0, this.parada! - s)));
    return e.fase === 'falando' ? 0 : 7;
  }
  private async conversar(): Promise<void> {
    const g = this.g;
    if (this.personagem === 'capy') {
      await g.say(['Capacete afivelado, distância segura… e nada de mergulhar nas curvas!'], 'Capy');
      await g.say(['Você fiscaliza a rua também?'], this.carona);
      await g.say(['Segurança não tira folga. A moto é vermelha pra combinar com o apito, não pra correr!'], 'Capy');
      await g.say(['Agora vou nessa. Devagar, porque meu seguro não cobre capivara voadora.'], 'Capy');
      return;
    }
    if (this.personagem === 'walter') {
      // o Walter NÃO fala: é cachorro, só late, em "au" de jeitos diferentes (decisão
      // do Renan). Quem entende o recado é quem está de carona.
      g.som('latido');
      await g.say(['Au! Au au! Auuu!'], 'Walter');
      await g.say(['Walter?! Um food truck de cachorro-quente? E o Mania?'], this.carona);
      g.som('latido');
      await g.say(['Au au… Au! Au, au au!'], 'Walter');
      await g.say(['Acho que de dia é churrasco e de tarde é cachorro-quente. Ele não desliga a bandeja nunca.'], this.carona);
      g.som('latido');
      await g.say(['Auuuu! Au! 🐾'], 'Walter');
      return;
    }
    if (this.personagem === 'mano') {
      const kombi = this.carro as KombiDoMano;
      g.som('pinguim');
      await g.say(['Bebitooos! Sentiram o friozinho? É o ar do freezer, sai de presente!'], 'Mano');
      await g.say(['Mano, você embaçou nosso para-brisa inteirinho!'], this.carona);
      await g.say(['Desembaça rapidinho, prometo! Pra compensar… uma casquinha pra cada um!'], 'Mano');
      // as duas casquinhas da bancada: a de morango é do Ari e a de maracujá do Renan (as do quiosque)
      kombi.entregarCasquinhas();
      const doAri = g.storeItem(ITENS.sorveteMorango, ARI.id), doRenan = g.storeItem(ITENS.sorveteMaracuja, RENAN.id);
      g.som('sorvete');
      g.toast(doAri === 'cheio' || doRenan === 'cheio'
        ? 'A mochila está cheia: a casquinha que não coube, o Mano guarda pra próxima.'
        : 'Uma casquinha de morango pro Ari e uma de maracujá pro Renan, na mochila!', '🍦');
      kombi.mano.dancar(3.2);
      await g.say(['E a dancinha de despedida, que sorvete sem dancinha não vale!'], 'Mano');
      return;
    }
    if (this.personagem === 'cookie') {
      const carrinho = this.carro as CarrinhoDoCookie;
      await g.say(['Oi, bebitos… Não se assustem, sou só eu. E o meu carrinho.'], 'Cookie');
      await g.say(['Cookie! Como é que você coube aí dentro?!'], this.carona);
      await g.say(['Cabendo. As orelhas vão pra fora, a tromba sai pelo furinho… Só não posso suspirar, que a porta abre.'], 'Cookie');
      carrinho.oferecer(true);
      await g.say(['Eu trouxe uma coisa pra vocês. É pequenininha, que é o melhor tamanho que existe.'], 'Cookie');
      // os dois brigadeirinhos saem da caixinha e voam até a janela do Bebito (um para cada um)
      carrinho.jogarDocinhos(this.naPista(this.parada ?? this.estado.s, 0.85, 1.35));
      g.som('lancar');
      await g.wait(0.95);
      const doAri = g.storeItem(ITENS.docinhoDoCookie, ARI.id), doRenan = g.storeItem(ITENS.docinhoDoCookie, RENAN.id);
      g.som('pegar');
      g.soltarCoracoes();
      g.toast(doAri === 'cheio' || doRenan === 'cheio'
        ? 'A mochila está cheia: o brigadeirinho que não coube, o Cookie guarda pra próxima.'
        : doAri === 'repetido' && doRenan === 'repetido'
          ? 'Vocês ainda têm o brigadeirinho de antes na mochila. O Cookie achou isso muito educado.'
          : 'Um brigadeirinho do Cookie pra cada um, na mochila!', '🍫');
      await g.say(['Agora eu vou devagarinho. Na lombada eu até prendo a respiração.'], 'Cookie');
      return;
    }
    if (this.personagem === 'jeanluc') {
      const doisCavalos = this.carro as DoisCavalosDoJeanLuc;
      await g.say(['Bonjour, mes amis! Gostaram? É um deux chevaux. Dois cavalos. Eu nunca vi os cavalos.'], 'Jean-Luc');
      await g.say(['Jean-Luc… de óculos escuros?!'], this.carona);
      await g.say(['Pour la route. Na estrada, um pato tem que ter estilo. E o caixote, eu trago sempre: hoje eu precisei.'], 'Jean-Luc');
      // o ponto de ping pong pela janela: ele saca, a bolinha para no ar perto do Bebito, e quem joga rebate na hora certa
      doisCavalos.raqueteNaJanela(true);
      await g.say(['Já que paramos… un petit point de ping pong? Pela janela. Eu saco.'], 'Jean-Luc');
      doisCavalos.sacar(this.naPista(this.parada ?? this.estado.s, 0.7, 1.55));
      g.som('quicar');
      await g.wait(0.8);
      const acertou = (await g.horaCerta('Rebater na hora certa!', undefined, { periodo: 1.1 })) >= 0.75;
      doisCavalos.devolver(acertou);
      g.som('quicar');
      await g.wait(0.8);
      if (acertou) {
        g.som('quicar');
        g.soltarCoracoes();
        await g.say(['Magnifique! De dentro do carro! Ce point est pour vous, mes amis.'], 'Jean-Luc');
      } else {
        await g.say(['Hon hon. A janela é difícil. Revanche na próxima estrada.'], 'Jean-Luc');
      }
      doisCavalos.raqueteNaJanela(false);
      await g.say(['Au revoir! Eu vou na frente, que o caixote escorrega na curva.'], 'Jean-Luc');
      return;
    }
    if (this.personagem === 'estella') {
      await g.say(['Bebitos! A coleção nova ficou pronta, e eu resolvi levar TUDO pra loja de uma vez só!'], 'Estella');
      await g.say(['Estella… isso tudo cabe na loja?'], this.carona);
      await g.say(['Caber, não cabe. Mas está tudo alinhavado, querida, não cai nem um botão.'], 'Estella');
      await g.say(['Passem na loja depois, que eu separo uma peça com a cara de vocês!'], 'Estella');
      return;
    }
    if (this.personagem === 'josefina') {
      await g.say(['Bom dia, meus amores! Estou levando estas mudinhas para o jardim. Cada uma vai ganhar um cantinho com sol.'], 'Josefina');
      await g.say(['As plantinhas também saíram para passear?'], this.carona);
      await g.say(['Claro! Devagarinho, para não despentear as folhas. Até já, meus queridos!'], 'Josefina');
      return;
    }
    g.som('gluglu');
    await g.say(['BEBITOS! Eu ia só buscar laranja. Voltei com três caixas e ESQUECI O GELO!'], 'Noel');
    await g.say(['Você tá fazendo suco ou abastecendo o clube inteiro?'], this.carona);
    await g.say(['OS DOIS! O suco não se espreme sozinho! Já chego lá!'], 'Noel');
  }
  /** Vista frontal dos dois carros; também funciona no celular em pé. */
  camera(viagem: { s: number }): { de: THREE.Vector3; para: THREE.Vector3 } {
    // (o carrinho do Cookie é miúdo: com a tela deitada a tomada chega mais perto, para ele não virar um
    // pontinho ao lado do Bebito; no celular em pé fica a de sempre, que é a que cabe os dois)
    const emPe = window.innerWidth / window.innerHeight < 0.8;
    const longe = emPe ? 1.65 : this.personagem === 'cookie' ? 0.8 : 1;
    const alvo = this.naPista(viagem.s + 1, 0, 1.25);
    // A tomada fica sobre a pista, sem um poste da calçada entre a lente e os carros.
    return { de: this.naPista(viagem.s + 10 * longe, 3.5 * longe, 4.8 * longe), para: alvo };
  }
}
