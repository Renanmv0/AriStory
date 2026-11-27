import type { MemoriaPintada } from '../../world/memoriasData';

import { CONVITE } from '../Natal';
export const conviteDaGina: MemoriaPintada = {
  trava:CONVITE, id:'convite-ceia-da-gina', titulo:'Um convite da Gina', lugar:'Correio da casa do Ari',
  legenda:'Ceia no Villa Lobos. A Gina pediu para a dupla buscar a toalha na boutique da Estella.',
  proporcao:.8,
  pintar(ctx,w,h){
    ctx.save();ctx.scale(w/400,h/500);
    ctx.fillStyle='#fff4da';ctx.fillRect(0,0,400,500);
    ctx.strokeStyle='#47735c';ctx.lineWidth=3;ctx.strokeRect(12,12,376,476);
    ctx.strokeStyle='#c99f59';ctx.lineWidth=1;ctx.strokeRect(18,18,364,464);
    // A roda do Villa Lobos impressa como um selo da festa.
    ctx.save();ctx.translate(200,67);ctx.strokeStyle='#936141';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,28,0,Math.PI*2);ctx.moveTo(-13,38);ctx.lineTo(0,0);ctx.lineTo(13,38);ctx.stroke();
    for(let i=0;i<8;i++){
      const x=Math.sin(i*Math.PI/4)*28,y=Math.cos(i*Math.PI/4)*28;
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(x,y);ctx.stroke();
      ctx.fillStyle=i%2?'#ac4250':'#43775d';ctx.fillRect(x-4,y,8,6);
    }
    ctx.restore();
    ctx.textAlign='center';ctx.fillStyle='#963d48';ctx.font='bold 31px Georgia, serif';
    ctx.fillText('Ceia de Natal',200,150);
    ctx.fillStyle='#496d5b';ctx.font='bold 15px sans-serif';ctx.fillText('PARQUE VILLA LOBOS',200,178);
    ctx.textAlign='left';ctx.fillStyle='#433931';ctx.font='21px Georgia, serif';
    ['Ari e Renan,','Vocês vêm jantar com a gente?','Antes, passem na boutique.','A Estella bordou a toalha da ceia','e disse que, se eu dobrar,','ela nunca mais me empresta!'].forEach((l,i)=>ctx.fillText(l,36,226+i*28));
    ctx.fillStyle='#48664e';ctx.font='italic 26px Georgia, serif';ctx.fillText('Com carinho, Gina',132,443);
    ctx.restore();
  },
};
