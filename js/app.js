const $=s=>document.querySelector(s),tg=window.Telegram&&Telegram.WebApp;
if(tg){tg.ready();tg.expand();try{tg.setHeaderColor('#0D0B1A');tg.setBackgroundColor('#0D0B1A')}catch(e){}}
const hap=(k,v)=>{try{tg&&tg.HapticFeedback&&(k==='n'?tg.HapticFeedback.notificationOccurred(v):tg.HapticFeedback.impactOccurred(v))}catch(e){}};
const T=[{n:'Обычный',c:'#9AA5DB',v:3},{n:'Необычный',c:'#27D9BD',v:12},{n:'Редкий',c:'#9B7BFF',v:45},{n:'Эпический',c:'#FF5FA2',v:160},{n:'Легендарный',c:'#FFC933',v:700},{n:'Мифический',c:'#FF4B3E',v:3000}];
const MODES=[{l:'Любой',min:0,cost:10},{l:'Редкий+',min:2,cost:40},{l:'Эпический+',min:3,cost:150}];
const WORDS=['storm','night','wolf9','cyber','pixel','ghost','nova7','lunar','ember','frost','raven','blaze','orbit','pulse','zenith','vortex','shadow','dragon','falcon','comet','atlas','magic','royal','alpha','omega','delta','sigma','ninja','panda','tiger','cobalt','cipher','quartz','rocket','silent','golden','crystal','phoenix','nexus','vector','matrix','legend','hunter','pirate','wizard','spirit','shiver','velvet','copper','jungle'].filter(w=>/^[a-z]{5,}$/.test(w));
const L='abcdefghijklmnopqrstuvwxyz',V='aeiouy',K='bcdfghjklmnprstvwxz',POOL=L+'0123456789_';
const R=n=>Math.floor(Math.random()*n),P=a=>a[R(a.length)];
const rnd=n=>Array.from({length:n},()=>P(L)).join(''),syl=n=>Array.from({length:n},(_,i)=>P(i%2?V:K)).join('');
const rev=s=>[...s].reverse().join('');

function gen(){
  const r=Math.random(),n=P([5,6,6,7,7,7,8,8,8,8]);let s;
  if(r<.0005){const a=P(L),b=P(L.replace(a,''));s=R(2)?a.repeat(5):a+b+a+b+a}
  else if(r<.38)s=rnd(n);
  else if(r<.66)s=syl(n);
  else if(r<.78)s=P(WORDS);
  else if(r<.86){const h=syl(3+R(2));s=h+(R(2)?P(L):'')+rev(h)}
  else if(r<.92)s=rnd(2+R(2)).repeat(4).slice(0,6+R(2));
  else if(r<.95){const a=R(17);s=L.slice(a,a+5+R(3))}
  else if(r<.97)s=P(L).repeat(6+R(2));
  else s=P(WORDS)+P(['_x','_','7','77','1337','_'+R(10)]);
  if(r>=.0005&&r<.66&&R(5)===0){const k=1+R(3);s=s.slice(0,-k)+String(R(10**k)).padStart(k,'0')}
  return s;
}
const tierOf=p=>p<45?0:p<65?1:p<90?2:p<115?3:p<150?4:5;
function score(s){
  let p=0;const t=[],len=s.length,core=s.replace(/[\d_]/g,''),d=new Set(s).size;
  p+={5:40,6:28,7:18,8:10}[len]??4;if(len<=6)t.push(len+' символов');
  if(!/\d/.test(s))p+=8;if(!s.includes('_'))p+=4;
  if(WORDS.includes(core)){p+=20;t.push('настоящее слово')}
  if(len>=5&&s===rev(s)){p+=30;t.push('палиндром')}
  if(len===5&&d===1){p+=30;t.push('пять одинаковых')}
  if(len===5&&d===2&&s===rev(s)){p+=25;t.push('двухбуквенный палиндром')}
  if(d<=2){p+=45;t.push('почти один символ')}else if(d===3){p+=25;t.push('всего 3 разных символа')}
  if(/^(.{1,3})\1+.?$/.test(s)&&d>2){p+=30;t.push('повтор')}
  let run=1,mx=1;for(let i=1;i<len;i++){run=s.charCodeAt(i)===s.charCodeAt(i-1)+1?run+1:1;mx=Math.max(mx,run)}
  if(mx>=4){p+=40;t.push('буквы по порядку')}
  if(core===s&&/^([bcdfghjklmnprstvwxz][aeiouy])+[bcdfghjklmnprstvwxz]?$/.test(s)){p+=20;t.push('читается легко')}
  if(/(\d)\1{2}|1337|777|007|123/.test(s)){p+=15;t.push('красивые цифры')}
  return{t:tierOf(p),tags:t,p};
}

const SAMPLE=(()=>{const a=[];for(let i=0;i<60000;i++)a.push(score(gen()).p);return a.sort((x,y)=>x-y)})();
const above=p=>{let lo=0,hi=SAMPLE.length;while(lo<hi){const m=(lo+hi)>>1;if(SAMPLE[m]<p)lo=m+1;else hi=m}return SAMPLE.length-lo};
const oneIn=p=>p>=150?2000:Math.max(2,Math.round(SAMPLE.length/Math.max(1,above(p))));
const TIERP=T.map((_,t)=>SAMPLE.filter(p=>tierOf(p)===t).length/SAMPLE.length);
TIERP[5]=Math.max(TIERP[5],.0004);
const def={coins:100,spins:0,best:0,day:'',items:[]};
let S;try{S={...def,...JSON.parse(localStorage.getItem('nameroulette')||'{}')}}catch(e){S={...def}}
const save=()=>{try{localStorage.setItem('nameroulette',JSON.stringify(S))}catch(e){}};
let mode=0,busy=false,cur=null,tt;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2600)}

function build(name,animate,reel=$('#reel')){
  reel.innerHTML='';reel.classList.toggle('idle',!animate&&name.includes('?'));
  reel.style.fontSize=Math.max(14,Math.min(46,Math.floor((reel.parentElement.clientWidth-24-(name.length+1)*6)/(name.length*.94+.6))))+'px';
  const at=document.createElement('div');at.className='at';at.textContent='@';reel.append(at);
  [...name].forEach((ch,i)=>{
    const c=document.createElement('div'),st=document.createElement('div');c.className='cell';st.className='strip'+(animate?' go':'');c.style.setProperty('--i',i);
    const n=animate?12+i*3:0,chars=Array.from({length:n},()=>P(POOL));chars.push(ch);
    st.innerHTML=chars.map(x=>`<span>${x}</span>`).join('');c.append(st);reel.append(c);
    if(n){const d=reduce?1:1000+i*260;st.style.transitionDuration=d+'ms';
      requestAnimationFrame(()=>requestAnimationFrame(()=>st.style.transform=`translateY(${-n*1.5}em)`));
      setTimeout(()=>{st.classList.remove('go');c.classList.add('land');if(!reduce)hap('i','light')},d)}
  });
  return reduce?60:1000+(name.length-1)*260+150;
}

async function spin(){
  if(busy)return;const m=MODES[mode];
  if(S.coins<m.cost){toast('Не хватает монет. Продай ник из коллекции или забери бонус дня.');return}
  if(cur&&!cur.kept){S.coins+=T[cur.t].v;toast(`Прошлый ник продан за ${T[cur.t].v} 🪙`)}
  busy=true;S.coins-=m.cost;S.spins++;
  let best=null;
  for(let i=0;i<3000;i++){const s=gen(),r=score(s);if(!best||r.t>best.t)best={name:s,...r};if(r.t>=m.min)break}
  cur={...best,kept:false};S.best=Math.max(S.best,cur.t);save();
  $('#stage').classList.remove('hit','shake','mythic');$('#res').hidden=true;$('#idle').hidden=false;$('#idle').textContent='Крутится…';
  render();
  const wait=build(cur.name,true);
  await new Promise(r=>setTimeout(r,wait));
  reveal();busy=false;render();
}
function reveal(){
  const t=T[cur.t];document.documentElement.style.setProperty('--tc',t.c);
  $('#stage').classList.add('hit');$('#stage').classList.toggle('shake',cur.t>=3);$('#stage').classList.toggle('mythic',cur.t===5);$('#idle').hidden=true;$('#res').hidden=false;
  $('#tier').textContent=t.n;
  $('#tags').innerHTML=`<span class="tag odd">Круче или равен: 1 из ${oneIn(cur.p)}</span>`+cur.tags.map(x=>`<span class="tag">${x}</span>`).join('');
  $('#sell').textContent=`Продать за ${t.v} 🪙`;
  if(cur.t>=2)hap('n','success');
  if(cur.t>=3)boom(t.c,cur.t);
}
// confetti
const fx=$('#fx'),cx=fx.getContext('2d');let ps=[],raf=0;
function boom(col,tr=3){
  if(reduce)return;const w=fx.width=innerWidth,h=fx.height=innerHeight;
  ps=Array.from({length:tr>=5?300:tr===4?160:100},()=>({x:w/2,y:h*.3,vx:(Math.random()-.5)*15,vy:-Math.random()*13-3,r:3+Math.random()*4,c:Math.random()<.6?col:'#fff',a:1}));
  if(!raf)tick();
}
function tick(){
  cx.clearRect(0,0,fx.width,fx.height);
  ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.35;p.a-=.012;cx.globalAlpha=Math.max(p.a,0);cx.fillStyle=p.c;cx.fillRect(p.x,p.y,p.r,p.r*1.6)});
  ps=ps.filter(p=>p.a>0);raf=ps.length?requestAnimationFrame(tick):0;
}

const link=n=>`https://t.me/${n}`;
const openTg=u=>tg&&tg.openTelegramLink?tg.openTelegramLink(u):window.open(u,'_blank');
async function copy(n){try{await navigator.clipboard.writeText('@'+n);toast('Скопировано: @'+n)}catch(e){toast('Не удалось скопировать. Выдели ник вручную: @'+n)}}
function share(n,t){const u=`https://t.me/share/url?url=${encodeURIComponent(link(n))}&text=${encodeURIComponent(`Мне выпал ник @${n} (${T[t].n}) в Нейм-рулетке`)}`;openTg(u)}
function keep(){if(!cur||cur.kept)return;cur.kept=true;S.items.unshift({id:Date.now()+''+R(1000),n:cur.name,t:cur.t,p:cur.p});S.items=S.items.slice(0,200);save();toast('Ник в коллекции');hap('i','medium');render()}
function sellCur(){if(!cur||cur.kept)return;S.coins+=T[cur.t].v;toast(`Продано за ${T[cur.t].v} 🪙`);cur.kept=true;save();$('#res').hidden=true;$('#idle').hidden=false;$('#idle').textContent='Крути дальше';$('#stage').classList.remove('hit');render()}

function render(){
  setTimeout(()=>{if(typeof renderUp==='function')renderUp()},0);
  {const cc=$('#coins'),v=S.coins+' 🪙';if(cc.textContent!==v){cc.textContent=v;cc.classList.remove('pop');void cc.offsetWidth;cc.classList.add('pop')}}
  const today=new Date().toDateString();$('#bonus').hidden=S.day===today;
  $('#seg').innerHTML=MODES.map((m,i)=>`<button aria-pressed="${i===mode}" data-m="${i}">${m.l}<small>${m.cost} 🪙</small></button>`).join('');
  const sp=$('#spin');sp.textContent=`Крутить · ${MODES[mode].cost} 🪙`;sp.disabled=busy;
  const pm=TIERP.map((p,i)=>i>=MODES[mode].min?p:0),sm=pm.reduce((a,b)=>a+b,0)||1;
  $('#odds').innerHTML=T.map((t,i)=>{const v=pm[i]/sm*100;return `<span class="od" style="--tc:${t.c}"><b>${v?(v<1?v.toFixed(1):Math.round(v))+'%':'—'}</b><small>${t.n}</small></span>`}).join('');
  $('#keep').disabled=!cur||cur.kept;
  $('#st-spins').textContent=`Круток: ${S.spins}`;
  $('#st-best').innerHTML=`Лучший: <b class="chip" style="background:${T[S.best].c}">${S.spins?T[S.best].n:'—'}</b>`;
  const col=$('#tab-col'),its=[...S.items].sort((a,b)=>b.t-a.t);
  if(!its.length){col.innerHTML=`<div class="empty">Коллекция пуста.<br>Крути рулетку и забирай понравившиеся ники.<br><button class="btn" data-go="game">К рулетке</button></div>`}
  else{col.innerHTML=`<h2>Моя коллекция</h2><p class="sum">Ников: ${its.length} · Если продать всё: ${its.reduce((a,x)=>a+T[x.t].v,0)} 🪙</p>`+
    its.map(x=>`<div class="item" style="--tc:${T[x.t].c}"><div><b>@${x.n}</b><small>${T[x.t].n}${x.p?' · 1 из '+oneIn(x.p):''}</small></div>
    <button data-a="copy" data-id="${x.id}" aria-label="Копировать">⧉</button><button data-a="check" data-id="${x.id}" aria-label="Проверить в Telegram">↗</button><button data-a="share" data-id="${x.id}" aria-label="Поделиться">✈</button><button data-a="sell" data-id="${x.id}" aria-label="Продать">${T[x.t].v} 🪙</button></div>`).join('')}
}

$('#spin').onclick=spin;
$('#keep').onclick=keep;$('#sell').onclick=sellCur;
$('#check').onclick=()=>cur&&openTg(link(cur.name));
$('#copy').onclick=()=>cur&&copy(cur.name);
$('#share').onclick=()=>cur&&share(cur.name,cur.t);
$('#seg').onclick=e=>{const b=e.target.closest('[data-m]');if(b&&!busy){mode=+b.dataset.m;render()}};
$('#bonus').onclick=()=>{S.coins+=50;S.day=new Date().toDateString();save();toast('+50 🪙, возвращайся завтра');hap('n','success');render()};
$('#tab-col').onclick=e=>{
  const g=e.target.closest('[data-go]');if(g)return tab(g.dataset.go);
  const b=e.target.closest('[data-a]');if(!b)return;const x=S.items.find(i=>i.id===b.dataset.id);if(!x)return;
  const a=b.dataset.a;
  if(a==='copy')copy(x.n);else if(a==='check')openTg(link(x.n));else if(a==='share')share(x.n,x.t);
  else if(a==='sell'){S.items=S.items.filter(i=>i!==x);S.coins+=T[x.t].v;save();toast(`Продано за ${T[x.t].v} 🪙`);render()}
};
render();build('??????',false);
if(cur)reveal();
addEventListener('resize',()=>{if(!busy&&!$('#tab-game').hidden)build(cur?cur.name:'??????',false)});

// ---------- Апгрейд ----------
let up={sel:new Set(),tg:null,busy:false,msg:'',res:null,fresh:false};
const chanceFor=(v,t)=>Math.min(.85,.9*v/T[t].v);
const RL={n:70,w:64,gap:6,idx:52};
function stake(){const its=S.items.filter(i=>up.sel.has(i.id));return{its,v:its.reduce((a,x)=>a+T[x.t].v,0),mx:its.reduce((a,x)=>Math.max(a,x.t),-1)}}
// win: undefined = превью, true/false = исход для ячейки под указателем
function rlCells(ch,win){return Array.from({length:RL.n},(_,i)=>{const w=i===RL.idx&&win!==undefined?win:Math.random()<ch;return `<b class="rc ${w?'w':'l'}">${w?'✓':'✕'}</b>`}).join('')}
function renderUp(){
  if(up.busy)return;
  up.sel=new Set([...up.sel].filter(id=>S.items.some(i=>i.id===id)));
  const s=stake();if(up.tg!==null&&(!s.its.length||up.tg<=s.mx))up.tg=null;
  const el=$('#tab-up'),its=[...S.items].sort((a,b)=>b.t-a.t);
  let h=`<h2>Апгрейд</h2><p class="sum">Поставь ники из коллекции и выбери цель выше по редкости. Чем больше ставка, тем больше ✓ на ленте (шанс не выше 85%). Если стрелка остановится на ✕, ставка сгорит.</p>`;
  if(!its.length&&!up.res&&!up.msg){el.innerHTML=h+`<div class="empty">Ставить пока нечего.<br>Забери ники в коллекцию.<br><button class="btn" data-go="game">К рулетке</button></div>`;return}
  h+=`<div class="stake">`+its.map(x=>`<label class="item pick" style="--tc:${T[x.t].c}"><input type="checkbox" data-sel="${x.id}"${up.sel.has(x.id)?' checked':''}><div><b>@${x.n}</b><small>${T[x.t].n}</small></div><span>${T[x.t].v} 🪙</span></label>`).join('')+`</div>`;
  h+=`<div class="targets">`+T.map((t,i)=>{const ok=s.its.length&&i>s.mx,c=ok?chanceFor(s.v,i):0;
    return `<button class="tg${up.tg===i?' on':''}" style="--tc:${t.c}" data-tg="${i}"${ok&&c>=.01?'':' disabled'}><b>${ok?Math.round(c*100)+'%':'—'}</b><small>${t.n}</small></button>`}).join('')+`</div>`;
  const ch=up.tg!==null?chanceFor(s.v,up.tg):0,col=up.tg!==null?T[up.tg].c:'#6A63B0';
  h+=`<div class="rl" id="rl" style="--tc:${col}"><i class="ptr"></i><div class="rl-track" id="rlt">${rlCells(ch)}</div></div>`;
  h+=`<p class="sum">${up.tg===null?'Выбери ставку и цель':`Ставка ${s.v} 🪙 · шанс ${Math.round(ch*100)}% · цель: ${T[up.tg].n}`}</p><button class="spin" id="do-up"${up.tg===null?' disabled':''}>Крутить апгрейд</button>`;
  h+=`<div class="upres">${up.msg}${up.res?`<div class="stage" id="upstage" style="--tc:${T[up.res.t].c}"><div class="reel" id="upreel"></div><div class="badge"><i></i>${T[up.res.t].n}</div><div class="tags"><span class="tag odd">Круче или равен: 1 из ${oneIn(up.res.p)}</span></div></div>`:''}</div>`;
  el.innerHTML=h;
  if(up.res){
    const fresh=up.fresh,st=$('#upstage'),r=up.res,wait=build(r.name,fresh,$('#upreel'));up.fresh=false;
    if(fresh)setTimeout(()=>{st.classList.add('hit');st.classList.toggle('shake',r.t>=3);st.classList.toggle('mythic',r.t===5);hap('n','success');if(r.t>=3)boom(T[r.t].c,r.t)},wait);
    else{st.classList.add('hit');st.classList.toggle('mythic',r.t===5)}
  }
}
async function doUp(){
  const s=stake();if(up.busy||up.tg===null||!s.its.length)return;
  const tgt=up.tg,ch=chanceFor(s.v,tgt),won=Math.random()<ch;
  up.busy=true;up.res=null;up.msg='';
  document.querySelectorAll('#tab-up button,#tab-up input').forEach(e=>e.disabled=true);
  const rl=$('#rl'),trk=$('#rlt'),W=rl.clientWidth,pitch=RL.w+RL.gap,off=(Math.random()-.5)*RL.w*.7,dur=reduce?50:4800;
  trk.style.transition='none';trk.style.transform='translateX(0)';trk.innerHTML=rlCells(ch,won);void trk.offsetWidth;
  trk.style.transition=`transform ${dur}ms cubic-bezier(.08,.6,.12,1)`;
  trk.style.transform=`translateX(${W/2-(RL.idx*pitch+RL.w/2+off)}px)`;
  if(!reduce){let last=-1,lt=0;const t0=performance.now();
    (function tk(){const x=new DOMMatrix(getComputedStyle(trk).transform).m41,i=Math.floor((W/2-x)/pitch),now=performance.now();
      if(i!==last&&now-lt>70){last=i;lt=now;hap('i','light')}
      if(now-t0<dur)requestAnimationFrame(tk)})()}
  await new Promise(r=>setTimeout(r,dur+250));
  trk.children[RL.idx].classList.add('on');
  await new Promise(r=>setTimeout(r,reduce?0:700));
  S.items=S.items.filter(i=>!up.sel.has(i.id));
  if(won){
    let b=null;for(let i=0;i<20000;i++){const n=gen(),r=score(n);if(!b||r.t>b.t)b={name:n,...r};if(r.t>=tgt)break}
    S.items.unshift({id:Date.now()+''+R(1000),n:b.name,t:b.t,p:b.p});
    up.res={name:b.name,t:b.t,p:b.p};up.fresh=true;
    up.msg=`<div class="win" style="--tc:${T[b.t].c}"><b>Успех!</b> Шанс был ${Math.round(ch*100)}%, ник уже в коллекции.</div>`;
  }else{up.msg=`<div class="lose"><b>Не вышло.</b> Ставка сгорела, шанс был ${Math.round(ch*100)}%.</div>`;hap('n','error')}
  up.sel.clear();up.tg=null;up.busy=false;save();render();
}
$('#tab-up').onclick=e=>{
  const g=e.target.closest('[data-go]');if(g)return tab(g.dataset.go);
  const t=e.target.closest('[data-tg]');if(t&&!up.busy){up.tg=+t.dataset.tg;up.msg='';up.res=null;renderUp();return}
  if(e.target.id==='do-up')doUp();
};
$('#tab-up').onchange=e=>{const i=e.target.closest('[data-sel]');if(!i||up.busy)return;i.checked?up.sel.add(i.dataset.sel):up.sel.delete(i.dataset.sel);up.msg='';up.res=null;renderUp()};
function tab(n){
  document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===n));
  ['game','col','up'].forEach(k=>$('#tab-'+k).hidden=k!==n);
  if(n==='game')build(cur?cur.name:'??????',false);
  if(n==='up')renderUp();
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
renderUp();
