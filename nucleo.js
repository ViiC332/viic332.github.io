const $=s=>document.querySelector(s),K='familia-rodrigues-v1',FAM='Rodrigues';
const seed=()=>[];
const load=()=>{try{return JSON.parse(localStorage.getItem(K))}catch(e){return null}};
const save=()=>{try{localStorage.setItem(K,JSON.stringify({P,R}))}catch(e){}};
const S0=load();let P=S0?.P||seed(),R=S0?.R||[],me=null,ph=null,view='t';
const byId=i=>P.find(p=>p.id==i),nid=()=>Math.max(0,...P.map(p=>p.id))+1;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
const fd=d=>new Date(d+'T12:00').toLocaleDateString('pt-BR');
const first=n=>n.split(' ')[0];
const short=n=>{const a=n.split(' '),t=a.length>1?a[0]+' '+a[a.length-1]:a[0];return t.length>16?t.slice(0,15)+'…':t};
function ago(iso){const a=new Date(iso+'T12:00'),n=new Date();let m=(n.getFullYear()-a.getFullYear())*12+n.getMonth()-a.getMonth();if(n.getDate()<a.getDate())m--;if(m>=12){const y=Math.floor(m/12);return`há ${y} ${y>1?'anos':'ano'}`}return m<=0?'há menos de 1 mês':`há ${m} ${m>1?'meses':'mês'}`}
function toast(t){const e=$('#tt');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,3200)}
function modal(h){const m=$('#md');m.hidden=false;m.innerHTML='<div class="sh">'+h+'</div>';m.onclick=e=>{if(e.target==m)closeM()}}
const closeM=()=>$('#md').hidden=true;
const MES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
function dsel(i,v){const[yy,mm,dd]=(v||'--').split('-'),n=new Date().getFullYear();
 return`<div class="dt" id="${i}"><select aria-label="Dia"><option value="">Dia</option>${[...Array(31)].map((_,k)=>`<option ${+dd==k+1?'selected':''}>${k+1}</option>`).join('')}</select><select aria-label="Mês"><option value="">Mês</option>${MES.map((t,k)=>`<option value="${k+1}" ${+mm==k+1?'selected':''}>${t}</option>`).join('')}</select><select aria-label="Ano"><option value="">Ano</option>${[...Array(n-1899)].map((_,k)=>`<option ${+yy==n-k?'selected':''}>${n-k}</option>`).join('')}</select></div>`}
function dv(i){const q=document.querySelectorAll('#'+i+' select'),d=q[0].value,m=q[1].value,y=q[2].value;if(!d||!m||!y)return'';const t=new Date(+y,+m-1,+d);if(t.getDate()!=+d)return'';return`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function pick(e){const f=e.target.files[0];if(!f)return;const old=document.getElementById('crop');if(old)old.remove();
 const bx=document.createElement('div');bx.id='crop';bx.className='crop';
 bx.innerHTML='<div class="cv"><canvas width="240" height="240"></canvas><i></i></div><p class="sm mut">Arraste a foto até o rosto ficar dentro do círculo e use o controle para aproximar.</p><input type="range" min="100" max="400" value="100" aria-label="Aproximar a foto">';
 e.target.closest('label').insertAdjacentElement('afterend',bx);
 const im=new Image(),cv=bx.querySelector('canvas'),cx=cv.getContext('2d'),zs=bx.querySelector('input');let ox=0,oy=0,sc=1,bs=1,dr=null;
 const pt=()=>{cx.fillStyle='#ddd';cx.fillRect(0,0,240,240);const w=im.width*bs*sc,h=im.height*bs*sc;ox=Math.min(0,Math.max(240-w,ox));oy=Math.min(0,Math.max(240-h,oy));cx.drawImage(im,ox,oy,w,h);const c=document.createElement('canvas');c.width=c.height=160;c.getContext('2d').drawImage(cv,0,0,240,240,0,0,160,160);ph=c.toDataURL('image/jpeg',.8)};
 im.onload=()=>{bs=240/Math.min(im.width,im.height);ox=(240-im.width*bs)/2;oy=(240-im.height*bs)/2;pt()};
 const r=new FileReader();r.onload=()=>im.src=r.result;r.readAsDataURL(f);
 zs.oninput=()=>{const o=sc;sc=zs.value/100;const k=sc/o;ox=120-(120-ox)*k;oy=120-(120-oy)*k;pt()};
 cv.onpointerdown=v=>{dr={x:v.clientX,y:v.clientY,ox,oy};cv.setPointerCapture(v.pointerId)};
 cv.onpointermove=v=>{if(!dr)return;const k=240/cv.getBoundingClientRect().width;ox=dr.ox+(v.clientX-dr.x)*k;oy=dr.oy+(v.clientY-dr.y)*k;pt()};
 cv.onpointerup=()=>dr=null}
const nm=i=>byId(i)?esc(byId(i).n):'(removido)',RL={mae:'mãe',pai:'pai',fi:'filho(a)',ir:'irmão(ã)',cj:'cônjuge',avo:'avô/avó',tio:'tio(a)',sob:'sobrinho(a)',pri:'primo(a)',net:'neto(a)'};
// parentesco: o que "b" é para "a"
function up(id){const m=new Map(),q=[[id,0]];while(q.length){const[i,d]=q.shift();if(m.has(i))continue;m.set(i,d);const p=byId(i);if(p){if(p.pai)q.push([p.pai,d+1]);if(p.mae)q.push([p.mae,d+1])}}return m}
const gg=(p,a,b)=>p.s=='F'?b:(p.s=='O'?(/o$/.test(a)&&/a$/.test(b)&&a.slice(0,-1)==b.slice(0,-1)?a+'(a)':a+'/'+b):a);
const gsel=(p,i)=>`<label>Gênero<select id="${i}" onchange="$('#${i}o').hidden=this.value!='O'"><option value="M" ${p.s=='M'?'selected':''}>Homem</option><option value="F" ${p.s=='F'?'selected':''}>Mulher</option><option value="O" ${p.s=='O'?'selected':''}>Outros</option></select></label><label id="${i}o" ${p.s=='O'?'':'hidden'}>Qual gênero?<input id="${i}t" value="${esc(p.go||'')}"></label>`;
const gv=i=>({s:$('#'+i).value,go:$('#'+i).value=='O'?$('#'+i+'t').value.trim():undefined});
function rel(a,b,x){
 if(a.id==b.id)return'Você';
 if(a.cj==b.id)return gg(b,'Esposo','Esposa');
 const ua=up(a.id),ub=up(b.id);
 if(ua.has(b.id)){const d=ua.get(b.id);return[0,gg(b,'Pai','Mãe'),gg(b,'Avô','Avó'),gg(b,'Bisavô','Bisavó')][d]||`Ancestral (${d}ª geração)`}
 if(ub.has(a.id)){const d=ub.get(a.id);return[0,gg(b,'Filho','Filha'),gg(b,'Neto','Neta'),gg(b,'Bisneto','Bisneta')][d]||`Descendente (${d}ª geração)`}
 let t=null;for(const[i,da]of ua)if(ub.has(i)){const db=ub.get(i);if(!t||da+db<t[0]+t[1])t=[da,db]}
 if(t){const[da,db]=t;
  if(da==1&&db==1)return a.pai==b.pai&&a.mae==b.mae?gg(b,'Irmão','Irmã'):gg(b,'Meio-irmão','Meia-irmã');
  if(da==1&&db==2)return gg(b,'Sobrinho','Sobrinha');
  if(da==1&&db==3)return gg(b,'Sobrinho-neto','Sobrinha-neta');
  if(db==1&&da==2)return gg(b,'Tio','Tia');
  if(db==1&&da==3)return gg(b,'Tio-avô','Tia-avó');
  if(da==2&&db==2)return gg(b,'Primo','Prima');
  if(da>=2&&db>=2)return gg(b,'Primo distante','Prima distante')}
 if(!x&&b.cj){const r=rel(a,byId(b.cj),1);if(r!='Parente'&&r!='Você')return`${gg(b,'Marido','Esposa')} de ${first(byId(b.cj).n)} (${r.toLowerCase()})`}
 return'Parente'}
const nav=f=>{if(window.parent!==window)parent.postMessage({go:f},'*');else location.href=f},SES='arvore-sessao';
const WA={api:'',simular:false};
const PART=['da','de','do','das','dos','e','di','du','del','della','van','von'];
function partes(n){const a=n.trim().split(/\s+/),o=[];let pre='';a.forEach((w,i)=>{if(PART.includes(w.toLowerCase())&&i<a.length-1)pre+=w+' ';else{o.push(pre+w);pre=''}});return o}
const morto=p=>p.fs=='s'||(!p.fs&&!!p.ob);
const fal=p=>morto(p)?(p.ob?`Sim, em ${fd(p.ob)} (${ago(p.ob)})`:'Sim, data não informada'):p.fs=='?'?'Não sei':'Não';
const pend=id=>R.filter(r=>r.st=='pendente'&&(r.alvo==id||r.qid==id||(r.tipo=='incluir'&&r.anchor==id)));
const irmaos=id=>{const m=byId(id);return m&&(m.pai||m.mae)?P.filter(z=>z.id!=id&&((m.pai&&z.pai==m.pai)||(m.mae&&z.mae==m.mae))):[]};
function vias(r,A){const m=byId(A),u=l=>[...new Map(l.map(z=>[z.id,z])).values()].map(z=>({v:z.id,t:z.n}));
 if(r=='avo'||r=='tio')return[{v:'pai',t:'Lado do pai'},{v:'mae',t:'Lado da mãe'}];
 if(r=='sob')return u(irmaos(A));
 if(r=='pri')return u([...irmaos(m.pai),...irmaos(m.mae)]);
 if(r=='net')return u(P.filter(z=>z.pai==A||z.mae==A));
 return null}
function av(p,z=88){return`<div class="av" style="width:${z}px;height:${z}px;font-size:${z*.4}px">${p.f?`<img src="${p.f}" alt="">`:esc(p.n[0])}</div>`}
function upPath(id,t){const pv={[id]:null},q=[id];while(q.length){const i=q.shift();if(i==t)break;const p=byId(i);[p.pai,p.mae].filter(Boolean).forEach(k=>{if(!(k in pv)){pv[k]=i;q.push(k)}})}const o=[];let c=t;while(c!==null&&c!==undefined){o.push(c);c=pv[c]}return o.reverse()}
function grau(a,b){
 if(a.id==b.id)return null;
 const ua=up(a.id),ub=up(b.id);let t=null;
 for(const[i,da]of ua)if(ub.has(i)){const db=ub.get(i);if(!t||da+db<t[0]+t[1])t=[da,db,i]}
 if(!t)return null;
 const c=[...upPath(a.id,t[2]),...upPath(b.id,t[2]).slice(0,-1).reverse()],g=c.length-1,L=[];
 for(let k=0;k<g;k++){const x=byId(c[k]),y=byId(c[k+1]),acima=x.pai==y.id||x.mae==y.id,f=first(y.n);
  const txt=x.id==a.id?`<b>${esc(f)}</b> é ${acima?gg(y,'seu pai','sua mãe'):gg(y,'seu filho','sua filha')}`:`<b>${esc(f)}</b> é ${acima?gg(y,'pai','mãe'):gg(y,'filho','filha')} de ${esc(first(x.n))} <small>(para você: ${esc(rel(a,y).toLowerCase())})</small>`;
  L.push(`<li><span class="nn">${k+1}</span><span>${txt}</span></li>`)}
 return{g,h:`<ol class="stp">${L.join('')}</ol><p class="fim"><b>${esc(first(b.n))}</b> está a ${g} ${g>1?'passos':'passo'} de você, então é parente de <b>${g}º grau</b>.</p>`}}
function legend(){modal(`<h3>Graus de parentesco</h3><p class="sm mut" style="margin:0">O grau é o número de passos entre duas pessoas na árvore. Cada passo vai de um filho ao seu pai ou à sua mãe (ou o contrário).</p><dl class="sm gl"><dt>1º grau</dt><dd>pais e filhos</dd><dt>2º grau</dt><dd>avós, netos e irmãos</dd><dt>3º grau</dt><dd>bisavós, bisnetos, tios e sobrinhos</dd><dt>4º grau</dt><dd>primos, tios-avós e sobrinhos-netos</dd></dl><p class="sm mut" style="margin:0">Exemplo: sua tia é filha da sua avó, que é mãe da sua mãe, que é sua mãe: 3 passos, 3º grau. Tudo é contado a partir de quem está logado, então o mesmo parente muda de grau e de nome para cada pessoa. Cônjuges não têm grau: o vínculo é por casamento.</p><div class="bt"><button class="pri" onclick="closeM()">Entendi</button></div>`)}
const rid=()=>Math.max(0,...R.map(r=>r.id))+1;
function apply(x){
 if(x.tipo=='editar'){const t=byId(x.alvo);if(t)Object.assign(t,x.q);return''}
 if(x.tipo=='remover'){const t=byId(x.alvo);if(!t)return'';if(t.fund)return'O fundador não pode ser removido.';P=P.filter(p=>p.id!=t.id);P.forEach(p=>['pai','mae','cj'].forEach(k=>{if(p[k]==t.id)p[k]=0}));return''}
 const m=byId(x.anchor),r=x.rel;if(!m)return'A pessoa de referência não existe mais.';
 const ex=x.qid?byId(x.qid):P.find(z=>norm(z.n)==norm(x.q.n)&&z.d==x.q.d),q=ex||{id:nid(),...x.q};
 if(r=='mae'||r=='pai'){if(m[r]&&m[r]!=q.id)return`Já existe ${r=='mae'?'mãe':'pai'} cadastrado(a) para essa pessoa.`;m[r]=q.id}
 else if(r=='fi'){const k=m.s=='F'?'mae':m.s=='M'?'pai':(!q.pai||q.pai==m.id?'pai':'mae');if(q[k]&&q[k]!=m.id)return'Essa pessoa já tem outro responsável nesse lugar.';q[k]=m.id}
 else if(r=='ir'){if(m.pai||m.mae){q.pai=m.pai;q.mae=m.mae}else if(q.pai||q.mae){m.pai=q.pai;m.mae=q.mae}else return'Cadastre primeiro um pai ou uma mãe.'}
 else if(r=='cj'){if(m.cj&&m.cj!=q.id)return'Já existe cônjuge cadastrado(a).';m.cj=q.id;q.cj=m.id}
 else{const par=r=='avo'||r=='tio'?byId(m[x.via]):byId(x.via);if(!par)return'Falta a pessoa de ligação: cadastre antes os parentes necessários (por exemplo, seu pai ou sua mãe).';
  if(r=='avo'){const k=q.s=='F'?'mae':q.s=='M'?'pai':(!par.pai?'pai':'mae');if(par[k]&&par[k]!=q.id)return'Essa pessoa já tem '+(k=='mae'?'mãe':'pai')+' cadastrado(a).';par[k]=q.id}
  else if(r=='tio'){if(!par.pai&&!par.mae)return'Cadastre antes os pais de '+first(par.n)+'.';q.pai=par.pai;q.mae=par.mae}
  else{const k=par.s=='F'?'mae':par.s=='M'?'pai':(!q.pai||q.pai==par.id?'pai':'mae');if(q[k]&&q[k]!=par.id)return'Essa pessoa já tem outro responsável nesse lugar.';q[k]=par.id}}
 if(!ex)P.push(q);return''}
const cab=at=>{const m=byId(me),n=R.filter(r=>r.st=='pendente'&&(m.fund||r.por==me)).length;return`<h2>🌳 Família ${FAM}</h2><nav class="tabs"><button class="${at=='p'?'on':''}" onclick="nav('pessoas.html')">Árvore</button><button class="${at=='d'?'on':''}" onclick="nav('pedidos.html')">Pedidos${n?` (${n})`:''}</button></nav><div class="tl">${at=='p'?`<button onclick="legend()">Graus</button><button class="pri" onclick="abrirForm(0,${me})">${m.fund?'+ Parente':'Pedir inclusão'}</button>`:''}<button class="lk" onclick="out()">Sair</button></div>`};
function out(){try{localStorage.removeItem(SES)}catch(e){}nav('index.html')}
function guard(){try{me=+localStorage.getItem(SES)||0}catch(e){me=0}if(!byId(me)){nav('index.html');return false}return true}
document.addEventListener('keydown',e=>{if(e.key=='Escape'){if(window.pcx)pcx();closeM()}});
