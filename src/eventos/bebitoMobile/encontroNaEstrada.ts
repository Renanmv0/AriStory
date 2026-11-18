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
import { CarrinhoDeGolfeDaGina } from '../../world/carrinhoDeGolfeDaGina';
import { ConversivelDaTiaLiz } from '../../world/conversivelDaTiaLiz';
import { CorridaDoFlynn } from './corridaDoFlynn';
import { ALTO_DA_CALCADA } from '../../world/estrada';
import { ITENS } from '../../world/itens';
import { ARI, RENAN } from '../../characters/cast';
import type { NaPista } from '../../world/estrada';

type Fase = 'esperando' | 'alinhando' | 'ultrapassando' | 'freando' | 'falando' | 'saindo' | 'feito';
const suave = (t: number): number => { const k = Math.max(0, Math.min(1, t)); return k * k * (3 - 2 * k); };

/** Uma cena no relógio da viagem, isolada dos obstáculos e com as faixas reservadas. */
export class EncontroNaEstrada {
  readonly carro: CarroDoNoel | CarroDaJosefina | MotoDoCapy | FoodTruckDoWalter | LambretaDaEstella | KombiDoMano | CarrinhoDoCookie | DoisCavalosDoJeanLuc | CarrinhoDeGolfeDaGina | ConversivelDaTiaLiz | CorridaDoFlynn;
  get nome(): string { return ({ noel: 'Noel', capy: 'Capy', walter: 'Walter', josefina: 'Josefina', estella: 'Estella', mano: 'Mano', cookie: 'Cookie', jeanluc: 'Jean-Luc', gina: 'Gina', tializ: 'Tia Liz', flynn: 'Flynn' } as const)[this.personagem]; }
  get icone(): string { return ({ noel: '🦃', capy: '🛵', walter: '🌭', josefina: '🐢', estella: '🧵', mano: '🍦', cookie: '🐘', jeanluc: '🦆', gina: '🦒', tializ: '🐻', flynn: '🦊' } as const)[this.personagem]; }
  readonly estado = { fase: 'esperando' as Fase, relativo: -28, tempo: 0, s: 0 };
  private falas = false;
  private anterior: THREE.Vector3 | null = null;
  private inicioDaFreada = 0;
  parada: number | null = null;
  /** a tomada de perto do rosto do Jean-Luc (as falas dos óculos escuros) */
  private dePerto = false;
  /** o carrinho da Gina ENCOSTA no Bebito na parada (0 na faixa dela, 1 encostado), para o pescoço alcançar a janela */
  private encosto = 0;
  /** a tomada do carimbo no para-brisa (a Gina) */
  private noCarimbo = false;
  /**
   * cola o selo de sócio no para-brisa do Bebito da cena, na hora (a cena liga isto no carro dela);
   * devolve `false` se o vidro já tinha selo
   */
  aoCarimbar: (() => boolean) | null = null;
  /**
   * o Flynn: o quanto ele DESCEU da calçada até a beira do asfalto, para a pata alcançar a janela (0 na calçada,
   * 1 na beira), e o quanto a janela de quem vai de carona está aberta, com o braço para fora (0 a 1)
   */
  private naBeira = 0;
  private alvoDaBeira = 0;
  janela = 0;
  private alvoDaJanela = 0;
  /** a tomada de perto do toca aqui (o Flynn) */
  private noToca = false;
  /**
   * baixa o vidro de quem vai de carona e põe o braço dele para fora (0 a 1), a cada quadro do toca aqui
   * (a cena liga isto no Bebito e na carona); `bater` é o instante do tapa
   */
  aoAbrirAJanela: ((quanto: number, bater: number) => number) | null = null;
  /** o quanto o vidro do Bebito já desceu (o que a cena devolve): a agulha só aparece com ele todo embaixo */
  private vidro = 0;
  private tapaDaCarona = -1;
  constructor(private readonly g: GameAPI, readonly s: number, private readonly naPista: NaPista, private readonly rumo: (s: number) => number, private readonly carona: string, readonly personagem: PersonagemNaEstrada = 'noel') {
    this.carro = personagem === 'noel' ? new CarroDoNoel() : personagem === 'capy' ? new MotoDoCapy()
      : personagem === 'walter' ? new FoodTruckDoWalter() : personagem === 'estella' ? new LambretaDaEstella()
        : personagem === 'mano' ? new KombiDoMano() : personagem === 'cookie' ? new CarrinhoDoCookie()
          : personagem === 'jeanluc' ? new DoisCavalosDoJeanLuc() : personagem === 'gina' ? new CarrinhoDeGolfeDaGina()
            : personagem === 'tializ' ? new ConversivelDaTiaLiz() : personagem === 'flynn' ? new CorridaDoFlynn() : new CarroDaJosefina();
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
        gina: 'Um apito, um giroflex e um pescoço saindo pelo toldo… é a Gina de carrinho de golfe!',
        tializ: 'Um conversível azul e amarelo cheio de pompom… é a Tia Liz com as meninas!',
        flynn: 'Passos rápidos na calçada e uma bandana azul… é o Flynn, correndo MAIS RÁPIDO que o Bebito!',
      } as const)[this.personagem], this.icone);
      // (o Mano chega tocando a musiquinha da Kombi, e o Cookie apertando a corneta com a tromba)
      this.g.som(this.personagem === 'mano' ? 'musiquinhaDoSorvete' : this.personagem === 'cookie' ? 'cornetaDoCookie'
        : this.personagem === 'jeanluc' ? 'buzinaDoJeanLuc' : this.personagem === 'gina' ? 'apito'
          : this.personagem === 'tializ' ? 'buzinaDaTiaLiz' : this.personagem === 'flynn' ? 'apito' : 'buzinaDoBebito');
      if (this.carro instanceof CarrinhoDoCookie) this.carro.buzinar();
    }
    if (e.fase === 'feito') return;
    e.tempo += dt;
    if (e.fase === 'alinhando' && e.tempo >= 2.4 && Math.abs(viagem.l - 1.75) < 0.12) {
      e.fase = 'ultrapassando'; e.tempo = 0;
    }
    if (e.fase === 'ultrapassando') {
      const duracao = ({ noel: 2.7, capy: 4, walter: 4.6, josefina: 5, estella: 4.4, mano: 4.8, cookie: 5.2, jeanluc: 4.6, gina: 5.0, tializ: 5.4, flynn: 3.6 } as const)[this.personagem];
      e.relativo = -28 + 42 * suave(e.tempo / duracao);
      if (e.tempo >= duracao) {
        e.fase = 'freando'; e.tempo = 0;
        this.inicioDaFreada = viagem.s + e.relativo;
        // (a Gina para um tico À FRENTE do Bebito: a cabeça dela, que sai pela lateral do carrinho, fica do lado
        // do para-brisa dele)
        // (o Flynn para na altura da janela de quem vai de carona: o banco da frente fica meio metro à frente do meio do
        // Bebito, e ele um tico adiante, com a pata vindo para trás)
        this.parada = this.inicioDaFreada + 8.75 - (this.personagem === 'gina' ? 1.5 : this.personagem === 'flynn' ? 0.85 : 0);
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
        if (this.personagem === 'gina') this.g.som('apito');
        if (this.personagem === 'tializ') this.g.som('buzinaDaTiaLiz');
        if (this.personagem === 'flynn') this.g.som('apito');
      });
    } else if (e.fase === 'saindo') {
      // (o Flynn dispara de novo: sai mais rápido que qualquer carro)
      e.relativo = this.personagem === 'flynn' ? 5 * e.tempo + 6 * e.tempo * e.tempo : 4 * e.tempo + 3.5 * e.tempo * e.tempo;
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
          gina: 'Lá vai a Gina de volta pra guarita, apitando, com o pescoço acima de todo mundo.',
          tializ: 'Lá se vai o conversível, com os pompons balançando e a bandeirinha no vento.',
          flynn: 'E lá vai o Flynn, sumindo na frente do Bebito. A pé.',
        } as const)[this.personagem], this.icone);
      }
    }
    e.s = viagem.s + e.relativo;
    this.carro.group.visible = e.fase !== 'feito';
    // (o carrinho da Gina encosta devagar no fim da freada e se afasta antes de sair)
    const encostar = this.personagem === 'gina' && (e.fase === 'falando' || (e.fase === 'freando' && e.tempo > 1.4));
    this.encosto += ((encostar ? 1 : 0) - this.encosto) * Math.min(1, dt * 1.6);
    let p: THREE.Vector3;
    if (this.carro instanceof CorridaDoFlynn) {
      /*
       * O FLYNN CORRE NA CALÇADA DA DIREITA, no meio dela (as placas ficam na beira, a 4,05, e os postes no fundo,
       * a 5,65). No toca aqui ele desce o degrau até a beira do asfalto, de frente meio virado para o Bebito.
       */
      this.naBeira += (this.alvoDaBeira - this.naBeira) * Math.min(1, dt * 3);
      const k = THREE.MathUtils.smoothstep(this.naBeira, 0, 1);
      // (o degrau: ele fica na altura da calçada até passar da guia, a 3,5)
      const l = 4.6 - 1.3 * k;
      p = this.naPista(e.s, l, l > 3.55 ? ALTO_DA_CALCADA : 0);
      this.carro.group.position.copy(p);
      this.carro.group.rotation.y = this.rumo(e.s) + 0.75 * k;
      this.janela += (this.alvoDaJanela - this.janela) * Math.min(1, dt * 2.5);
      let bate = 0;
      if (this.tapaDaCarona >= 0) {
        this.tapaDaCarona += dt;
        const t = this.tapaDaCarona;
        bate = t < 0.16 ? t / 0.16 : t < 0.45 ? 1 : Math.max(0, 1 - (t - 0.45) / 0.25);
        if (t > 0.7) this.tapaDaCarona = -1;
      }
      this.vidro = this.aoAbrirAJanela?.(this.janela, bate) ?? 1;
    } else {
      p = this.naPista(e.s, -1.75 + 0.85 * THREE.MathUtils.smoothstep(this.encosto, 0, 1));
      this.carro.group.position.copy(p); this.carro.group.rotation.y = this.rumo(e.s);
    }
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
      // (as duas falas dos óculos ganham a tomada de perto: no celular em pé, de longe, eles viram três pixels)
      this.dePerto = true;
      await g.say(['Jean-Luc… de óculos escuros?!'], this.carona);
      await g.say(['Pour la route. Na estrada, um pato tem que ter estilo. E o caixote, eu trago sempre: hoje eu precisei.'], 'Jean-Luc');
      this.dePerto = false;
      // o ponto de ping pong pela janela: ele saca, a bolinha para no ar perto do Bebito, e quem joga rebate na hora certa
      doisCavalos.raqueteNaJanela(true);
      await g.say(['Já que paramos… un petit point de ping pong? Pela janela. Eu saco.'], 'Jean-Luc');
      doisCavalos.sacar(this.naPista(this.parada ?? this.estado.s, 0.15, 1.8));
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
    if (this.personagem === 'gina') {
      const golfe = this.carro as CarrinhoDeGolfeDaGina;
      const SELO = 'selo-socio-do-clube';
      const jaSocio = g.fichaDoBebitoMobile().vagas.paraBrisa.includes(SELO);
      g.som('apito');
      await g.say(['Priii! Encosta aí, bebitos. Fiscalização do clube!'], 'Gina');
      await g.say(['Gina?! Fiscalização na estrada?'], this.carona);
      await g.say(['Na estrada não tem guarita, então eu trouxe a portaria comigo. Carteirinha, por favor.'], 'Gina');
      if (!jaSocio) {
        await g.say(['Carteirinha? A gente nunca teve carteirinha…'], this.carona);
        await g.say(['Agora vai ter.'], 'Gina');
        // o pescoço passa por baixo do toldo e a cabeça sai pela lateral, com o carimbo na boca, até o para-brisa
        golfe.esticarAteAJanela(true);
        this.noCarimbo = true;
        await g.wait(2.4);
        golfe.carimbar();
        g.som('carimbo');
        await g.wait(0.25);
        this.aoCarimbar?.();
        const ficha = g.fichaDoBebitoMobile();
        ficha.vagas.paraBrisa[0] = SELO;
        g.salvarFichaDoBebitoMobile(ficha);
        g.soltarCoracoes();
        g.toast('O selo de SÓCIO DO CLUBE ficou colado no para-brisa do Bebito!', '🦒');
        await g.wait(1.2);
        golfe.esticarAteAJanela(false);
        this.noCarimbo = false;
        await g.say(['Pronto: sócios. Com o selo no vidro, a cancela do clube nem pergunta. Ordem da casa.'], 'Gina');
      } else {
        await g.say(['A gente já é sócio, olha o selo no vidro!'], this.carona);
        // ela confere de perto, com o pescoço até o para-brisa, e volta
        golfe.esticarAteAJanela(true);
        this.noCarimbo = true;
        await g.wait(2.0);
        golfe.esticarAteAJanela(false);
        this.noCarimbo = false;
        await g.say(['Conferido. Selo em dia, cabelo seco: podem seguir.'], 'Gina');
      }
      g.som('apito');
      await g.say(['Agora eu volto pra guarita, que portaria não fica sozinha muito tempo. Aproveitem o dia, viu?'], 'Gina');
      return;
    }
    if (this.personagem === 'tializ') {
      const conversivel = this.carro as ConversivelDaTiaLiz;
      // a história das quatro (o que o Renan contou) só na primeira vez; depois, um oi e a merenda
      const primeira = !g.temMemoria('tializ-na-estrada');
      g.som('buzinaDaTiaLiz');
      await g.say(['¡Mis niños! Encostem aí, que eu trouxe merenda.'], 'Tia Liz');
      await g.say(['OI, BEBITOS! A GENTE TÁ INDO PRA ESCOLA!'], 'Sol');
      if (primeira) {
        await g.say(['Tia Liz! As três juntas no carro com você?'], this.carona);
        await g.say(['Sempre juntas. Lá na Venezuela eu trabalhava numa escola, e elas eram pequenininhas.'], 'Tia Liz');
        await g.say(['E o sonho de nós quatro era se mudar. A gente falava disso todo dia.'], 'Estrella');
        await g.say(['Então a gente fez a mala e veio. E aqui eu cuido delas.'], 'Tia Liz');
        conversivel.ficarTimidas();
        await g.say(['…e ela cuida muito bem.'], 'Luna');
      } else {
        await g.say(['Vocês de novo! A estrada da escola é nossa!'], 'Estrella');
      }
      // as palmas da torcida: na hora certa, o confete sobe do banco de trás
      await g.say(['AGORA A TORCIDA! BATE PALMA COM A GENTE!'], 'Sol');
      const acertou = (await g.horaCerta('Bater palma na hora certa!', undefined, { periodo: 1.2 })) >= 0.75;
      conversivel.comemorar();
      g.som(acertou ? 'surpresa' : 'confirma');
      if (acertou) g.soltarCoracoes();
      await g.say([acertou ? 'ISSO! NO TEMPO CERTINHO! VAI, BEBITOS!' : 'QUASE! MAS VALEU A PALMA! VAI, BEBITOS!'], 'Sol');
      // a merenda: duas arepitas da cesta, pela janela
      conversivel.acenar();
      await g.say(['E pra viagem, uma arepita pra cada um. Feita hoje cedo.'], 'Tia Liz');
      conversivel.jogarArepitas(this.naPista(this.parada ?? this.estado.s, 0.85, 1.35));
      g.som('lancar');
      await g.wait(1.0);
      const doAri = g.storeItem(ITENS.arepitaDaTiaLiz, ARI.id), doRenan = g.storeItem(ITENS.arepitaDaTiaLiz, RENAN.id);
      g.som('pegar');
      g.toast(doAri === 'cheio' || doRenan === 'cheio'
        ? 'A mochila está cheia: a arepita que não coube, a Tia Liz guarda pra próxima.'
        : doAri === 'repetido' && doRenan === 'repetido'
          ? 'Vocês ainda têm a arepita de antes na mochila. A Tia Liz manda comer.'
          : 'Uma arepita da Tia Liz pra cada um, na mochila!', '🫓');
      await g.say(['Juízo na estrada, ¿oíste? Nos vemos na escola.'], 'Tia Liz');
      return;
    }
    if (this.personagem === 'flynn') {
      const corrida = this.carro as CorridaDoFlynn;
      g.som('apito');
      await g.say(['E aí, bebitos! Bom dia! Tô fazendo a minha corrida matinal!'], 'Flynn');
      await g.say(['Flynn?! Você tá correndo mais rápido que o carro!'], this.carona);
      await g.say(['Tenho que correr! Não posso ficar atrás dos meus rivais.'], 'Flynn');
      await g.say(['Rivais? Que rivais?'], this.carona);
      await g.say(['Vocês vão conhecer. Ele também acorda cedo… então eu acordo MAIS cedo.'], 'Flynn');
      // O TOCA AQUI: ele desce da calçada até a beira do asfalto com a pata no alto, o vidro de quem vai de carona
      // desce e o braço sai pela janela; quem joga bate na hora certa
      this.alvoDaBeira = 1;
      this.noToca = true;
      corrida.erguerAPata(true);
      await g.say(['Antes de eu ir: toca aqui!'], 'Flynn');
      this.alvoDaJanela = 1;
      // (o vidro desce e o braço sai: a hora certa só com a mão já do lado de fora)
      for (let t = 0; t < 5 && (this.vidro < 0.99 || this.janela < 0.97); t += 0.1) await g.wait(0.1);
      const acertou = (await g.horaCerta('Bater na mão na hora certa!', this.carona, { periodo: 1.1 })) >= 0.75;
      if (acertou) {
        corrida.bater();
        this.tapaDaCarona = 0;
        await g.wait(0.16);
        g.som('tocaAqui');
        g.soltarCoracoes();
        await g.wait(0.45);
        corrida.erguerAPata(false);
        corrida.comemorar();
        await g.say(['ISSO! Toca aqui de campeão! Valeu, bebitos!'], 'Flynn');
      } else {
        // a mão da carona chega tarde: a pata dele já desceu, e ela passa no vento
        corrida.erguerAPata(false);
        await g.wait(0.25);
        this.tapaDaCarona = 0;
        g.som('asas');
        await g.wait(0.7);
        await g.say(['Passou no vento! Haha, amanhã a gente treina esse também.'], 'Flynn');
      }
      corrida.erguerAPata(false);
      this.alvoDaJanela = 0;
      this.alvoDaBeira = 0;
      await g.wait(0.8);
      this.noToca = false;
      await g.say(['Agora deixa eu ir, que o aquecimento tá esfriando. Até a escola!'], 'Flynn');
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
    if (this.noCarimbo && this.carro instanceof CarrinhoDeGolfeDaGina && this.carro.gina) {
      // o carimbo no para-brisa: de frente para os dois carros, perto, olhando o vão entre eles
      const alvo = this.carro.pontaDoCarimbo();
      const emPe = window.innerWidth / window.innerHeight < 0.8;
      const sDoCarimbo = this.estado.s - 0.1;
      const de = this.naPista(sDoCarimbo + (emPe ? 5.2 : 4.0), 0.6, alvo.y + (emPe ? 1.6 : 1.1));
      return { de, para: alvo.clone().add(new THREE.Vector3(0, -0.15, 0)) };
    }
    if (this.noToca && this.carro instanceof CorridaDoFlynn) {
      /*
       * o toca aqui: QUASE DE CIMA, um tico à frente, olhando para baixo o vão entre o Flynn e a porta. Na
       * altura dos olhos não dá: da calçada a cabeça dele tapa o encontro das mãos, e da pista o retrovisor e a coluna
       * do para-brisa tapam a janela; e de cima mais baixo, da calçada, a pata do lado do carro some atrás da cabeça
       */
      const emPe = window.innerWidth / window.innerHeight < 0.8;
      const sa = this.estado.s;
      const de = this.naPista(sa + (emPe ? 2.2 : 1.6), emPe ? 4.0 : 3.7, emPe ? 5.2 : 4.3);
      return { de, para: this.naPista(sa - 0.35, 2.95, 0.95) };
    }
    if (this.dePerto && this.carro instanceof DoisCavalosDoJeanLuc && this.carro.jeanLuc) {
      // de frente e um tico do lado do Bebito, na altura dos óculos
      const grupo = this.carro.group;
      grupo.updateMatrixWorld(true);
      const rosto = this.carro.jeanLuc.cabecaDoPato.getWorldPosition(new THREE.Vector3());
      const perto = window.innerWidth / window.innerHeight < 0.8 ? 2.5 : 1.9;
      const de = grupo.localToWorld(new THREE.Vector3(-0.33 - 0.55 * perto, 0, -0.1 + 0.85 * perto));
      de.y = rosto.y + 0.35;
      return { de, para: rosto.add(new THREE.Vector3(0, -0.1, 0)) };
    }
    // (o carrinho do Cookie é miúdo, e os óculos do Jean-Luc também: com a tela deitada a tomada chega mais perto, para ele não virar um
    // pontinho ao lado do Bebito; no celular em pé fica a de sempre, que é a que cabe os dois)
    const emPe = window.innerWidth / window.innerHeight < 0.8;
    const longe = emPe ? 1.65 : this.personagem === 'cookie' || this.personagem === 'jeanluc' || this.personagem === 'tializ' || this.personagem === 'flynn' ? 0.8 : 1;
    const alvo = this.naPista(viagem.s + 1, 0, 1.25);
    // A tomada fica sobre a pista, sem um poste da calçada entre a lente e os carros.
    return { de: this.naPista(viagem.s + 10 * longe, 3.5 * longe, 4.8 * longe), para: alvo };
  }
}
