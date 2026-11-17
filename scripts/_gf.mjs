import { chromium } from 'playwright';
const BASE='http://127.0.0.1:4177', OUT=process.argv[2]??'/tmp/gf', EXTRA=process.env.EXTRA??'', FOTOS=(process.env.FOTOS??'').split(',').filter(Boolean);
const PONTO={x:-6,z:30};
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await (await b.newContext({viewport:{width:1100,height:760}})).newPage();
page.on('pageerror',e=>console.log('ERRO',e.message));
await page.goto(`${BASE}/?cena=villa-lobos&semHalloween&golfe=${PONTO.x},${PONTO.z},0${EXTRA}&em=${PONTO.x+6},${PONTO.z+8}`);
await page.waitForFunction(()=>window.golfe&&window.jogo?.current&&!window.jogo.transitioning,null,{timeout:120000});
await page.waitForTimeout(Number(process.env.ESPERA ?? 3500));
const m=await page.evaluate(()=>{const c=window.golfe;c.group.updateMatrixWorld(true);const V=c.group.position.constructor;const min=new V(1e9,1e9,1e9),max=new V(-1e9,-1e9,-1e9),p=new V();let malhas=0,tri=0;
c.group.traverse(x=>{if(!x.isMesh)return;malhas++;const g=x.geometry;tri+=(g.index?g.index.count:g.attributes.position.count)/3;let vis=true;for(let o=x;o;o=o.parent)if(!o.visible)vis=false;if(!vis||x.isInstancedMesh)return;const pos=g.attributes.position;for(let i=0;i<pos.count;i+=2){p.fromBufferAttribute(pos,i).applyMatrix4(x.matrixWorld);c.group.worldToLocal(p);min.min(p);max.max(p);}});
const cab=c.gina?.cabecaDaGina; const ch=cab?c.group.worldToLocal(cab.getWorldPosition(new V())):null; const cb=c.gina?c.group.worldToLocal(c.pontaDoCarimbo()):null;
return {min:min.toArray().map(v=>+v.toFixed(2)),max:max.toArray().map(v=>+v.toFixed(2)),malhas,tri:Math.round(tri),cabeca:ch?.toArray().map(v=>+v.toFixed(2)),carimbo:cb?.toArray().map(v=>+v.toFixed(2))};});
console.log(JSON.stringify(m));
const fotos={encontro:[[-5.25,4.8,10],[-1.75,1.6,1]],frente:[[2.8,2.4,5],[0,1.2,0.3]],lado:[[-5.5,2.2,0.4],[0,1.4,-0.2]],la:[[5,2.2,-0.6],[0,1.4,0]],tras:[[2,2.8,-5.5],[0,1.2,-0.4]],cima:[[-0.5,7,1.4],[0,1,-0.2]],rosto:[[-1.6,2.9,2.4],[-0.2,2.4,0.3]]};
for(const [nome,[d,pa]] of Object.entries(fotos)){ if(FOTOS.length&&!FOTOS.includes(nome))continue;
 await page.evaluate(([d,p,o])=>{const V=window.jogo.scene.position.constructor;window.jogo.setCameraOmbro(new V(o.x+d[0],d[1],o.z+d[2]),new V(o.x+p[0],p[1],o.z+p[2]));},[d,pa,PONTO]);
 await page.waitForTimeout(800); await page.screenshot({path:`${OUT}-${nome}.png`});}
await b.close();
