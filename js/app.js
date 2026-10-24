const $=s=>document.querySelector(s),tg=window.Telegram&&Telegram.WebApp;
if(tg){tg.ready();tg.expand();try{tg.setHeaderColor('#EEF1FF');tg.setBackgroundColor('#EEF1FF')}catch(e){}}
const hap=(k,v)=>{try{tg&&tg.HapticFeedback&&(k==='n'?tg.HapticFeedback.notificationOccurred(v):tg.HapticFeedback.impactOccurred(v))}catch(e){}};
const T=[{n:'Обычный',c:'#9AA5DB',v:3},{n:'Необычный',c:'#27D9BD',v:12},{n:'Редкий',c:'#9B7BFF',v:45},{n:'Эпический',c:'#FF5FA2',v:160},{n:'Легендарный',c:'#FFC933',v:700}];
const MODES=[{l:'Любой',min:0,cost:10},{l:'Редкий+',min:2,cost:40},{l:'Эпический+',min:3,cost:150}];
const WORDS=['storm','night','wolf9','cyber','pixel','ghost','nova7','lunar','ember','frost','raven','blaze','orbit','pulse','zenith','vortex','shadow','dragon','falcon','comet','atlas','magic','royal','alpha','omega','delta','sigma','ninja','panda','tiger','cobalt','cipher','quartz','rocket','silent','golden','crystal','phoenix','nexus','vector','matrix','legend','hunter','pirate','wizard','spirit','shiver','velvet','copper','jungle'].filter(w=>/^[a-z]{5,}$/.test(w));
const L='abcdefghijklmnopqrstuvwxyz',V='aeiouy',K='bcdfghjklmnprstvwxz',POOL=L+'0123456789_';
const R=n=>Math.floor(Math.random()*n),P=a=>a[R(a.length)];
const rnd=n=>Array.from({length:n},()=>P(L)).join(''),syl=n=>Array.from({length:n},(_,i)=>P(i%2?V:K)).join('');
const rev=s=>[...s].reverse().join('');

function gen(){
  const r=Math.random(),n=P([5,6,6,7,7,7,8,8,8,8]);let s;
  if(r<.38)s=rnd(n);
  else if(r<.66)s=syl(n);
  else if(r<.78)s=P(WORDS);
  else if(r<.86){const h=syl(3+R(2));s=h+(R(2)?P(L):'')+rev(h)}
  else if(r<.92)s=rnd(2+R(2)).repeat(3).slice(0,5+R(3));
  else if(r<.95){const a=R(17);s=L.slice(a,a+5+R(3))}
  else if(r<.97)s=P(L).repeat(5+R(3));
  else s=P(WORDS)+P(['_x','_','7','77','1337','_'+R(10)]);
  if(r<.66&&R(5)===0){const k=1+R(3);s=s.slice(0,-k)+String(R(10**k)).padStart(k,'0')}
  return s;
}
function score(s){
  let p=0;const t=[],len=s.length,core=s.replace(/[\d_]/g,''),d=new Set(s).size;
  p+={5:40,6:28,7:18,8:10}[len]??4;if(len<=6)t.push(len+' символов');
  if(!/\d/.test(s))p+=8;if(!s.includes('_'))p+=4;
  if(WORDS.includes(core)){p+=20;t.push('настоящее слово')}
  if(len>=5&&s===rev(s)){p+=30;t.push('палиндром')}
  if(d<=2){p+=45;t.push('почти один символ')}else if(d===3){p+=25;t.push('всего 3 разных символа')}
  if(/^(.{1,3})\1+.?$/.test(s)&&d>2){p+=30;t.push('повтор')}
  let run=1,mx=1;for(let i=1;i<len;i++){run=s.charCodeAt(i)===s.charCodeAt(i-1)+1?run+1:1;mx=Math.max(mx,run)}
  if(mx>=4){p+=40;t.push('буквы по порядку')}
  if(core===s&&/^([bcdfghjklmnprstvwxz][aeiouy])+[bcdfghjklmnprstvwxz]?$/.test(s)){p+=20;t.push('читается легко')}
  if(/(\d)\1{2}|1337|777|007|123/.test(s)){p+=15;t.push('красивые цифры')}
  return{t:p<45?0:p<65?1:p<90?2:p<115?3:4,tags:t,p};
}

const def={coins:100,spins:0,best:0,day:'',items:[]};
let S;try{S={...def,...JSON.parse(localStorage.getItem('nameroulette')||'{}')}}catch(e){S={...def}}
const save=()=>{try{localStorage.setItem('nameroulette',JSON.stringify(S))}catch(e){}};
let mode=0,busy=false,cur=null,tt;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2600)}

function build(name,animate){
  const reel=$('#reel');reel.innerHTML='';
  reel.style.fontSize=Math.min(44,Math.floor((reel.parentElement.clientWidth-40)/((name.length+.7)*.95)))+'px';
  const at=document.createElement('div');at.className='at';at.textContent='@';reel.append(at);
  [...name].forEach((ch,i)=>{
    const c=document.createElement('div'),st=document.createElement('div');c.className='cell';st.className='strip';
    const n=animate?12+i*3:0,chars=Array.from({length:n},()=>P(POOL));chars.push(ch);
    st.innerHTML=chars.map(x=>`<span>${x}</span>`).join('');c.append(st);reel.append(c);
    if(n){const d=reduce?1:1000+i*260;st.style.transitionDuration=d+'ms';
      requestAnimationFrame(()=>requestAnimationFrame(()=>st.style.transform=`translateY(${-n*1.3}em)`));
      if(!reduce)setTimeout(()=>hap('i','light'),d)}
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
  $('#stage').classList.remove('hit');$('#res').hidden=true;$('#idle').hidden=false;$('#idle').textContent='Крутится…';
  render();
  const wait=build(cur.name,true);
  await new Promise(r=>setTimeout(r,wait));
  reveal();busy=false;render();
}
function reveal(){
  const t=T[cur.t];document.documentElement.style.setProperty('--tc',t.c);
  $('#stage').classList.add('hit');$('#idle').hidden=true;$('#res').hidden=false;
  $('#tier').textContent=t.n;
  $('#tags').innerHTML=cur.tags.map(x=>`<span class="tag">${x}</span>`).join('');
  $('#sell').textContent=`Продать за ${t.v} 🪙`;
  if(cur.t>=2)hap('n','success');
  if(cur.t>=3)boom(t.c);
}
// confetti
const fx=$('#fx'),cx=fx.getContext('2d');let ps=[],raf=0;
function boom(col){
  if(reduce)return;const w=fx.width=innerWidth,h=fx.height=innerHeight;
  ps=Array.from({length:cur.t===4?160:100},()=>({x:w/2,y:h*.3,vx:(Math.random()-.5)*15,vy:-Math.random()*13-3,r:3+Math.random()*4,c:Math.random()<.6?col:'#12101F',a:1}));
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
function keep(){if(!cur||cur.kept)return;cur.kept=true;S.items.unshift({id:Date.now()+''+R(1000),n:cur.name,t:cur.t});S.items=S.items.slice(0,200);save();toast('Ник в коллекции');hap('i','medium');render()}
function sellCur(){if(!cur||cur.kept)return;S.coins+=T[cur.t].v;toast(`Продано за ${T[cur.t].v} 🪙`);cur.kept=true;save();$('#res').hidden=true;$('#idle').hidden=false;$('#idle').textContent='Крути дальше';$('#stage').classList.remove('hit');render()}

function render(){
  $('#coins').textContent=S.coins+' 🪙';
  const today=new Date().toDateString();$('#bonus').hidden=S.day===today;
  $('#seg').innerHTML=MODES.map((m,i)=>`<button aria-pressed="${i===mode}" data-m="${i}">${m.l}<small>${m.cost} 🪙</small></button>`).join('');
  const sp=$('#spin');sp.textContent=`Крутить · ${MODES[mode].cost} 🪙`;sp.disabled=busy;
  $('#keep').disabled=!cur||cur.kept;
  $('#st-spins').textContent=`Круток: ${S.spins}`;
  $('#st-best').innerHTML=`Лучший: <b class="chip" style="background:${T[S.best].c}">${S.spins?T[S.best].n:'—'}</b>`;
  const col=$('#tab-col'),its=[...S.items].sort((a,b)=>b.t-a.t);
  if(!its.length){col.innerHTML=`<div class="empty">Коллекция пуста.<br>Крути рулетку и забирай понравившиеся ники.<br><button class="btn" data-go="game">К рулетке</button></div>`}
  else{col.innerHTML=`<h2>Моя коллекция</h2><p class="sum">Ников: ${its.length} · Если продать всё: ${its.reduce((a,x)=>a+T[x.t].v,0)} 🪙</p>`+
    its.map(x=>`<div class="item" style="--tc:${T[x.t].c}"><div><b>@${x.n}</b><small>${T[x.t].n}</small></div>
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
function tab(n){
  document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===n));
  $('#tab-game').hidden=n!=='game';$('#tab-col').hidden=n!=='col';
  if(n==='game')build(cur?cur.name:'??????',false);
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
render();build('??????',false);
if(cur)reveal();
addEventListener('resize',()=>{if(!busy&&!$('#tab-game').hidden)build(cur?cur.name:'??????',false)});
