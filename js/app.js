const $=s=>document.querySelector(s),tg=window.Telegram&&Telegram.WebApp;
if(tg){tg.ready();tg.expand();try{tg.setHeaderColor('#0D0B1A');tg.setBackgroundColor('#0D0B1A')}catch(e){}}
const hap=(k,v)=>{try{tg&&tg.HapticFeedback&&(k==='n'?tg.HapticFeedback.notificationOccurred(v):tg.HapticFeedback.impactOccurred(v))}catch(e){}};
const T=[{n:'Обычный',c:'#9AA5DB',v:75},{n:'Необычный',c:'#27D9BD',v:300},{n:'Редкий',c:'#9B7BFF',v:1125},{n:'Эпический',c:'#FF5FA2',v:4000},{n:'Легендарный',c:'#FFC933',v:17500},{n:'Мифический',c:'#FF4B3E',v:75000},{n:'Секретный',c:'#EAF1FF',v:250000}]
T.forEach((t,i)=>t.s=['Обычн.','Необыч.','Редкий','Эпик','Легенд.','Миф.','Секрет'][i]);;
const MODES=[{l:'Любой',min:0,cost:1000},{l:'Редкий+',min:2,cost:5000},{l:'Эпик+',min:3,cost:15000}];
const WORDS=['storm','night','wolf9','cyber','pixel','ghost','nova7','lunar','ember','frost','raven','blaze','orbit','pulse','zenith','vortex','shadow','dragon','falcon','comet','atlas','magic','royal','alpha','omega','delta','sigma','ninja','panda','tiger','cobalt','cipher','quartz','rocket','silent','golden','crystal','phoenix','nexus','vector','matrix','legend','hunter','pirate','wizard','spirit','shiver','velvet','copper','jungle'].filter(w=>/^[a-z]{5,}$/.test(w));
const L='abcdefghijklmnopqrstuvwxyz',V='aeiouy',K='bcdfghjklmnprstvwxz',POOL=L+'0123456789_#$%@';
const R=n=>Math.floor(Math.random()*n),P=a=>a[R(a.length)];
const rnd=n=>Array.from({length:n},()=>P(L)).join(''),syl=n=>Array.from({length:n},(_,i)=>P(i%2?V:K)).join('');
const rev=s=>[...s].reverse().join('');
const MAX=10;                 // размер коллекции
const APP_LINK='';            // ссылка на Mini App для кнопки «Позвать друзей», например https://t.me/твой_бот/app
const fmt=n=>Math.round(n).toLocaleString('ru-RU');
// цена ника плавно растёт с его баллами (без «пустот» между редкостями); секретные цены фиксированы
const PRICE_BASE=85,PRICE_K=.056;
const val=(t,p,n)=>{
  if(t>=6){const l=n?n.length:3;return Math.round(T[6].v*(l<=1?1.6:l===2?1.2:1))}
  if(!p)return T[t].v;
  return Math.max(5,Math.round(PRICE_BASE*Math.exp(PRICE_K*(p-30))/5)*5);
};
const rar=(t,p)=>t===6?'только из апгрейда':'1 из '+oneIn(p);

const SECRETS=[...new Set(['1','0','7','13','11','00','22','69','42','111','222','333','666','777','888','999','000','420','404','007','123','1337','lol','wow','kek','zzz','www','ww','w','x','z','a','xx','xxx','aaa','abc','qwe','omg','wtf','gg','xd','ok','hi','yo','no','meh','oof','_','#','##','$','%','@','?','!','*','~'])];
const ADJ=['dark','night','silent','red','blue','cold','wild','swift','lazy','crazy','happy','lucky','toxic','epic','mega','ultra','neo','pixel','cyber','royal'];
const NOUN=['wolf','fox','cat','bear','tiger','panda','ghost','king','queen','ninja','pilot','mage','hero','dragon','falcon','raven','shark','cobra','rider','hunter'];
const AFFIX=['pro','dev','real','official','the','its','mr','im'];
const KEYS=['qwerty','asdfgh','zxcvbn','qazwsx','qweasd','asdfg','zxcvb','qwert','poiuy','wasd1'];
const LEET={a:'4',e:'3',o:'0',i:'1',s:'5',t:'7'},UNLEET={4:'a',3:'e',0:'o',1:'i',5:'s',7:'t'};
const leet=w=>[...w].map((c,i)=>i&&LEET[c]&&R(2)?LEET[c]:c).join('');
function genNew(){
  const k=R(11),w=P(WORDS),a=P(ADJ),nn=P(NOUN);
  switch(k){
    case 0:return a+nn;
    case 1:return a+'_'+nn;
    case 2:return leet(a+nn);
    case 3:return leet(w);
    case 4:return nn+(2000+R(26));
    case 5:return P(AFFIX)+'_'+nn;
    case 6:return nn+'_'+P(AFFIX);
    case 7:return P(KEYS);
    case 8:return syl(2).repeat(3);
    case 9:return 'xx'+nn+'xx';
    default:return a+nn+R(100);
  }
}
function gen(){
  const q=Math.random();
  if(q<.00065){const a=P(L),b=P(L.replace(a,''));return R(2)?a.repeat(5):a+b+a+b+a}
  if(q<.4)return genNew();
  const r=Math.random(),n=P([5,6,6,7,7,7,8,8,8,8]);let s;
  if(r<.38)s=rnd(n);
  else if(r<.66)s=syl(n);
  else if(r<.78)s=P(WORDS);
  else if(r<.86){const h=syl(3+R(2));s=h+(R(2)?P(L):'')+rev(h)}
  else if(r<.92)s=rnd(2+R(2)).repeat(4).slice(0,6+R(2));
  else if(r<.95){const a=R(17);s=L.slice(a,a+5+R(3))}
  else if(r<.97)s=P(L).repeat(6+R(2));
  else s=P(WORDS)+P(['_x','_','7','77','1337','_'+R(10)]);
  if(r<.66&&R(5)===0){const k=1+R(3);s=s.slice(0,-k)+String(R(10**k)).padStart(k,'0')}
  return s;
}
const tierOf=p=>p<45?0:p<65?1:p<90?2:p<115?3:p<150?4:p<999?5:6;
function score(s){
  if(SECRETS.includes(s))return{t:6,tags:['секретный ник','короче 5 символов'],p:999};
  let p=0;const t=[],len=s.length,core=s.replace(/[\d_]/g,''),d=new Set(s).size;
  p+={5:40,6:28,7:18,8:10}[len]??4;if(len<=6)t.push(len+' символов');
  if(!/\d/.test(s))p+=8;if(!s.includes('_'))p+=4;
  if(WORDS.includes(core)){p+=20;t.push('настоящее слово')}
  const plain=s.replace(/_/g,''),two=x=>ADJ.some(a=>x.startsWith(a)&&NOUN.includes(x.slice(a.length)));
  if(two(plain.replace(/\d+$/,''))){p+=15;t.push('два слова')}
  else if(/\d/.test(s)&&two([...plain].map(c=>UNLEET[c]||c).join(''))){p+=20;t.push('лит-спик')}
  if(KEYS.includes(s)){p+=35;t.push('клавиатурный ряд')}
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
const oneIn=p=>p>=999?6700:p>=150?2000:Math.max(2,Math.round(SAMPLE.length/Math.max(1,above(p))));
const TIERP=T.map((_,t)=>SAMPLE.filter(p=>tierOf(p)===t).length/SAMPLE.length);
TIERP[5]=Math.max(TIERP[5],.0004);TIERP[6]=0;
const def={coins:5000,spins:0,best:0,day:'',items:[],uid:0,ups:0,upw:0,cnt:[0,0,0,0,0,0,0],time:0,tday:{d:'',s:0},pend:null,econ:2};
let S;try{S={...def,...JSON.parse(localStorage.getItem('nameroulette')||'{}')}}catch(e){S={...def}}
if(S.econ!==2){S.coins=5000;S.items=S.items.slice(0,MAX);S.econ=2}
if(!Array.isArray(S.cnt)||S.cnt.length<7)S.cnt=[0,0,0,0,0,0,0];
if(!S.tday||typeof S.tday!=='object')S.tday={d:'',s:0};
if(!S.uid){const id=tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.id;S.uid=id?(id%999999)+1:R(999999)+1}
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
  if(cur&&!cur.kept){toast('Прошлый ник '+stash(cur));cur.kept=true;S.pend=null}
  busy=true;S.coins-=m.cost;S.spins++;
  let best=null;
  for(let i=0;i<3000;i++){const s=gen(),r=score(s);if(!best||r.t>best.t)best={name:s,...r};if(r.t>=m.min)break}
  cur={...best,kept:false};S.best=Math.max(S.best,cur.t);S.cnt[cur.t]++;S.pend={name:cur.name,t:cur.t,p:cur.p};save();
  $('#stage').classList.remove('hit','shake','mythic','secret');$('#res').hidden=true;$('#idle').hidden=false;$('#idle').textContent='Крутится…';
  render();
  const wait=build(cur.name,true);
  await new Promise(r=>setTimeout(r,wait));
  reveal();busy=false;render();
}
function reveal(){
  const t=T[cur.t];document.documentElement.style.setProperty('--tc',t.c);
  $('#stage').classList.add('hit');$('#stage').classList.toggle('shake',cur.t>=3);$('#stage').classList.toggle('mythic',cur.t===5);$('#stage').classList.toggle('secret',cur.t===6);$('#idle').hidden=true;$('#res').hidden=false;
  $('#tier').textContent=t.n;
  $('#tags').innerHTML=`<span class="tag odd">Круче или равен: 1 из ${oneIn(cur.p)}</span>`+cur.tags.map(x=>`<span class="tag">${x}</span>`).join('');
  $('#sell').textContent=`Продать за ${fmt(val(cur.t,cur.p,cur.name))} 🪙`;
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

const link=n=>`https://t.me/${encodeURIComponent(n)}`;
const openTg=u=>tg&&tg.openTelegramLink?tg.openTelegramLink(u):window.open(u,'_blank');
async function copy(n){try{await navigator.clipboard.writeText('@'+n);toast('Скопировано: @'+n)}catch(e){toast('Не удалось скопировать. Выдели ник вручную: @'+n)}}
function share(n,t){const u=`https://t.me/share/url?url=${encodeURIComponent(link(n))}&text=${encodeURIComponent(`Мне выпал ник @${n} (${T[t].n}) в Нейм-рулетке`)}`;openTg(u)}
const ask=(msg,ok)=>{try{if(tg&&tg.showConfirm&&tg.isVersionAtLeast&&tg.isVersionAtLeast('6.2')){tg.showConfirm(msg,y=>y&&ok());return}}catch(e){}if(confirm(msg))ok()};
function addItem(n,t,p){S.items.unshift({id:Date.now()+''+R(1000),n,t,p})}
// забрать ник в коллекцию; если места нет, продать
function stash(c){
  if(S.items.length<MAX){addItem(c.name,c.t,c.p);return 'сохранён в коллекцию'}
  const v=val(c.t,c.p,c.name);S.coins+=v;return `продан за ${fmt(v)} 🪙 (коллекция заполнена)`;
}
function keep(){
  if(!cur||cur.kept)return;
  if(S.items.length>=MAX){toast(`Коллекция заполнена (${MAX}/${MAX}). Продай ник или освободи место.`);return}
  addItem(cur.name,cur.t,cur.p);cur.kept=true;S.pend=null;save();toast('Ник сохранён');hap('i','medium');render();
}
function sellCur(){if(!cur||cur.kept)return;const v=val(cur.t,cur.p,cur.name);S.coins+=v;S.pend=null;toast(`Продано за ${fmt(v)} 🪙`);cur.kept=true;save();$('#res').hidden=true;$('#idle').hidden=false;$('#idle').textContent='Крути дальше';$('#stage').classList.remove('hit');render()}

function render(){
  setTimeout(()=>{if(typeof renderUp==='function')renderUp()},0);
  {const cc=$('#coins'),v=fmt(S.coins)+' 🪙';if(cc.textContent!==v){cc.textContent=v;cc.classList.remove('pop');void cc.offsetWidth;cc.classList.add('pop')}}
  const today=new Date().toDateString();$('#bonus').hidden=S.day===today;
  $('#seg').innerHTML=MODES.map((m,i)=>`<button aria-pressed="${i===mode}" data-m="${i}">${m.l}<small>${fmt(m.cost)} 🪙</small></button>`).join('');
  const sp=$('#spin');sp.textContent=`Крутить · ${fmt(MODES[mode].cost)} 🪙`;sp.disabled=busy;
  const pm=TIERP.slice(0,6).map((p,i)=>i>=MODES[mode].min?p:0),sm=pm.reduce((a,b)=>a+b,0)||1;
  $('#odds').innerHTML=T.slice(0,6).map((t,i)=>{const v=pm[i]/sm*100;return `<span class="od" style="--tc:${t.c}"><b>${v?(v<1?v.toFixed(1):Math.round(v))+'%':'—'}</b><small>${t.s}</small></span>`}).join('');
  $('#keep').disabled=!cur||cur.kept;
  $('#st-spins').textContent=`Круток: ${S.spins}`;
  $('#st-best').innerHTML=`Лучший: <b class="chip" style="background:${T[S.best].c}">${S.spins?T[S.best].n:'—'}</b>`;
  const col=$('#tab-col'),its=[...S.items].sort((a,b)=>b.t-a.t);
  if(!its.length){col.innerHTML=`<div class="empty">Коллекция пуста.<br>Крути рулетку и забирай понравившиеся ники.<br><button class="btn" data-go="game">К рулетке</button></div>`}
  else{col.innerHTML=`<h2>Моя коллекция</h2><p class="sum">Ников: ${its.length} / ${MAX} · Если продать всё: ${fmt(its.reduce((a,x)=>a+val(x.t,x.p,x.n),0))} 🪙</p>`+
    its.map(x=>`<div class="item" style="--tc:${T[x.t].c}"><div><b>@${x.n}</b><small>${T[x.t].n}${x.p?' · '+rar(x.t,x.p):''}</small></div><button data-a="copy" data-id="${x.id}" aria-label="Копировать">⧉</button><button data-a="sell" data-id="${x.id}" aria-label="Продать">${fmt(val(x.t,x.p,x.n))} 🪙</button></div>`).join('')}
  if(!$('#tab-prof').hidden)renderProf();
}

$('#spin').onclick=spin;
$('#keep').onclick=keep;$('#sell').onclick=sellCur;
$('#check').onclick=()=>cur&&openTg(link(cur.name));
$('#copy').onclick=()=>cur&&copy(cur.name);
$('#share').onclick=()=>cur&&share(cur.name,cur.t);
$('#seg').onclick=e=>{const b=e.target.closest('[data-m]');if(b&&!busy){mode=+b.dataset.m;render()}};
$('#bonus').onclick=()=>{S.coins+=1000;S.day=new Date().toDateString();save();toast('+1 000 🪙, возвращайся завтра');hap('n','success');render()};
$('#tab-col').onclick=e=>{
  const g=e.target.closest('[data-go]');if(g)return tab(g.dataset.go);
  const b=e.target.closest('[data-a]');if(!b)return;const x=S.items.find(i=>i.id===b.dataset.id);if(!x)return;
  if(b.dataset.a==='copy')copy(x.n);
  else if(b.dataset.a==='sell'){const v=val(x.t,x.p,x.n);
    ask(`Продать @${x.n} за ${fmt(v)} 🪙?`,()=>{if(!S.items.includes(x))return;S.items=S.items.filter(i=>i!==x);S.coins+=v;save();toast(`Продано за ${fmt(v)} 🪙`);render()})}
};
if(S.pend){const x=S.pend;S.pend=null;const m=stash({name:x.name,t:x.t,p:x.p});save();setTimeout(()=>toast('Прошлый ник '+m),500)}
render();build('??????',false);
if(cur)reveal();
addEventListener('resize',()=>{if(!busy&&!$('#tab-game').hidden)build(cur?cur.name:'??????',false)});

// ---------- Апгрейд ----------
let up={sel:new Set(),c:50,prize:null,busy:false,msg:'',res:null,fresh:false};
const RL={n:70,w:64,gap:6,idx:52};
const chanceOf=(s,pr)=>Math.min(.85,Math.max(.01,.9*s.v/pr.price));
function stake(){const its=S.items.filter(i=>up.sel.has(i.id));return{its,v:its.reduce((a,x)=>a+val(x.t,x.p,x.n),0),mx:its.reduce((a,x)=>Math.max(a,x.t),-1)}}
// пул призов: ники всех редкостей с ценами (строится один раз). Секретные есть только здесь
let POOLN=null;
function prizePool(){
  if(POOLN)return POOLN;const seen=new Set(),a=[];
  const add=n=>{if(seen.has(n))return;seen.add(n);const r=score(n);a.push({name:n,t:r.t,p:r.p,price:val(r.t,r.p,n)})};
  for(let i=0;i<25000;i++)add(gen());
  SECRETS.forEach(add);
  for(const c of L){add(c.repeat(5));for(const d of L)if(d!==c)add(c+d+c+d+c)}
  return POOLN=a.sort((x,y)=>x.price-y.price);
}
// цена приза = 90% ставки / шанс; берём ближайший по цене ник из пула
function pickPrize(s,again){
  const target=.9*s.v/(up.c/100),ok=prizePool().filter(x=>x.price>s.v);
  if(!ok.length){up.prize=null;return}
  const dist=x=>Math.abs(x.price-target),best=Math.min(...ok.map(dist));
  const near=ok.filter(x=>dist(x)<=best+Math.max(2,target*.03));
  up.prize=again?P(near):near.reduce((a,x)=>dist(x)<dist(a)?x:a);
}
// win: undefined = превью, true/false = исход для ячейки под указателем
const rlCells=(ch,win)=>Array.from({length:RL.n},(_,i)=>{const w=i===RL.idx&&win!==undefined?win:Math.random()<ch;return `<b class="rc ${w?'w':'l'}">${w?'✓':'✕'}</b>`}).join('');
function fillUp(){
  const s=stake(),pr=up.prize,ok=s.its.length&&pr,ch=ok?chanceOf(s,pr):0,col=ok?T[pr.t].c:'#6A63B0';
  $('#ch-out').textContent=ok?Math.round(ch*100)+'%':'—';
  $('#prize').innerHTML=ok?`<div class="pz" style="--tc:${col}"><div><small>Выпадет</small><b>@${pr.name}</b><em>${T[pr.t].n} · ${rar(pr.t,pr.p)}</em></div><div class="pp"><small>Цена</small><b>${fmt(pr.price)} 🪙</b></div></div><button class="btn" id="reroll">Другой ник</button>`
    :`<p class="sum">${s.its.length?'Нет ников дороже ставки. Поставь меньше.':'Отметь ники для ставки'}</p>`;
  $('#rl').style.setProperty('--tc',col);$('#rlt').innerHTML=rlCells(ch);$('#do-up').disabled=!ok;
}
function renderUp(){
  if(up.busy)return;
  up.sel=new Set([...up.sel].filter(id=>S.items.some(i=>i.id===id)));
  const s=stake(),el=$('#tab-up'),its=[...S.items].sort((a,b)=>b.t-a.t);
  if(!s.its.length)up.prize=null;else if(!up.prize)pickPrize(s);
  let h=`<h2>Апгрейд</h2><p class="sum">Поставь ники из коллекции и двигай ползунок: чем ниже шанс, тем дороже ник выпадет. Если стрелка остановится на ✕, ставка сгорит.</p>`;
  if(!its.length&&!up.res&&!up.msg){el.innerHTML=h+`<div class="empty">Ставить пока нечего.<br>Сохрани ники в коллекцию.<br><button class="btn" data-go="game">К рулетке</button></div>`;return}
  h+=`<div class="stake">`+its.map(x=>`<label class="item pick" style="--tc:${T[x.t].c}"><input type="checkbox" data-sel="${x.id}"${up.sel.has(x.id)?' checked':''}><div><b>@${x.n}</b><small>${T[x.t].n}</small></div><span>${fmt(val(x.t,x.p,x.n))} 🪙</span></label>`).join('')+`</div>`;
  h+=`<div class="slider"><div class="srow"><span>Шанс</span><b id="ch-out"></b></div><input type="range" id="chs" min="1" max="85" step="1" value="${up.c}"${s.its.length?'':' disabled'} aria-label="Шанс апгрейда"></div><div id="prize"></div>`;
  h+=`<div class="rl" id="rl"><i class="ptr"></i><div class="rl-track" id="rlt"></div></div><button class="spin" id="do-up">Крутить апгрейд</button>`;
  h+=`<div class="upres">${up.msg}${up.res?`<div class="stage" id="upstage" style="--tc:${T[up.res.t].c}"><div class="reel" id="upreel"></div><div class="badge"><i></i>${T[up.res.t].n}</div><div class="tags"><span class="tag odd">${up.res.t===6?'Только из апгрейда':'Круче или равен: 1 из '+oneIn(up.res.p)}</span></div></div>`:''}</div>`;
  el.innerHTML=h;fillUp();
  if(up.res){
    const fresh=up.fresh,st=$('#upstage'),r=up.res,wait=build(r.name,fresh,$('#upreel'));up.fresh=false;
    const fx2=()=>{st.classList.add('hit');st.classList.toggle('shake',r.t>=3);st.classList.toggle('mythic',r.t===5);st.classList.toggle('secret',r.t===6)};
    if(fresh)setTimeout(()=>{fx2();hap('n','success');if(r.t>=3)boom(T[r.t].c,r.t)},wait);else fx2();
  }
}
async function doUp(){
  const s=stake(),pr=up.prize;if(up.busy||!pr||!s.its.length)return;
  const ch=chanceOf(s,pr),won=Math.random()<ch;
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
  S.items=S.items.filter(i=>!up.sel.has(i.id));S.ups++;
  if(won){
    S.upw++;S.cnt[pr.t]++;addItem(pr.name,pr.t,pr.p);
    up.res={name:pr.name,t:pr.t,p:pr.p};up.fresh=true;
    up.msg=`<div class="win" style="--tc:${T[pr.t].c}"><b>Успех!</b> Шанс был ${Math.round(ch*100)}%, ник уже в коллекции.</div>`;
  }else{up.msg=`<div class="lose"><b>Не вышло.</b> Ставка сгорела, шанс был ${Math.round(ch*100)}%.</div>`;hap('n','error')}
  up.sel.clear();up.prize=null;up.busy=false;save();render();
}
$('#tab-up').onclick=e=>{
  const g=e.target.closest('[data-go]');if(g)return tab(g.dataset.go);
  if(up.busy)return;
  if(e.target.id==='reroll'){const s=stake();if(s.its.length){pickPrize(s,true);fillUp()}return}
  if(e.target.id==='do-up')doUp();
};
$('#tab-up').onchange=e=>{const i=e.target.closest('[data-sel]');if(!i||up.busy)return;i.checked?up.sel.add(i.dataset.sel):up.sel.delete(i.dataset.sel);up.msg='';up.res=null;up.prize=null;renderUp()};
$('#tab-up').oninput=e=>{if(e.target.id!=='chs'||up.busy)return;up.c=+e.target.value;const s=stake();if(s.its.length){pickPrize(s);fillUp()}};

// ---------- Профиль ----------
const TN=['Обычных','Необычных','Редких','Эпических','Легендарных','Мифических','Секретных'];
const fmtT=s=>{const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h} ч ${m} мин`:m?`${m} мин`:`${s%60} сек`};
const todaySec=()=>S.tday.d===new Date().toDateString()?S.tday.s:0;
const idStr=()=>{const a=String(S.uid).padStart(6,'0');return a.slice(0,3)+','+a.slice(3)};
function renderProf(){
  $('#tab-prof').innerHTML=`<div class="pcard idc"><small>Твой ID</small><b>${idStr()}</b></div>
  <div class="pgrid"><div class="pcard"><small>Капитал</small><b>${fmt(S.coins)} 🪙</b></div><div class="pcard"><small>Коллекция</small><b>${S.items.length} / ${MAX}</b></div></div>
  <div class="pcard inv"><div><b>Позвать друзей</b><small>Отправь друзьям ссылку на игру</small></div><button class="btn main" id="invite">Позвать</button></div>
  <div class="pcard"><h3>Статистика</h3>
    <div class="pgrid"><div class="pt"><small>Круток</small><b>${fmt(S.spins)}</b></div><div class="pt"><small>Удачных апгрейдов</small><b>${fmt(S.upw)}</b></div>
    <div class="pt"><small>В игре за всё время</small><b id="tm-all">${fmtT(S.time)}</b></div><div class="pt"><small>В игре сегодня</small><b id="tm-day">${fmtT(todaySec())}</b></div></div>
    <div class="pgrid tiers">${T.map((t,i)=>`<div class="pt${i===6?' last':''}" style="--tc:${t.c}"><small>${TN[i]}</small><b>${fmt(S.cnt[i])}</b></div>`).join('')}</div></div>`;
}
setInterval(()=>{
  if(document.hidden)return;
  const d=new Date().toDateString();if(S.tday.d!==d)S.tday={d,s:0};
  S.time++;S.tday.s++;if(S.time%10===0)save();
  if(!$('#tab-prof').hidden){const a=$('#tm-all'),b=$('#tm-day');if(a){a.textContent=fmtT(S.time);b.textContent=fmtT(todaySec())}}
},1000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
addEventListener('pagehide',save);
$('#tab-prof').onclick=e=>{
  if(e.target.id!=='invite')return;
  const base=APP_LINK||location.href.split('#')[0].split('?')[0];
  openTg(`https://t.me/share/url?url=${encodeURIComponent(base)}&text=${encodeURIComponent('Заходи в Нейм-рулетку: выбивай редкие юзернеймы и собирай коллекцию!')}`);
};
$('#prof-btn').onclick=()=>tab($('#tab-prof').hidden?'prof':'game');

function tab(n){
  document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===n));
  ['game','col','up','prof'].forEach(k=>$('#tab-'+k).hidden=k!==n);
  $('#prof-btn').setAttribute('aria-pressed',n==='prof');
  if(n==='game')build(cur?cur.name:'??????',false);
  if(n==='up')renderUp();
  if(n==='prof')renderProf();
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
renderUp();
