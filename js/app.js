const $=s=>document.querySelector(s),tg=window.Telegram&&Telegram.WebApp;
if(tg){tg.ready();tg.expand();try{tg.setHeaderColor('#0D0B1A');tg.setBackgroundColor('#0D0B1A')}catch(e){}}
const hap=(k,v)=>{try{tg&&tg.HapticFeedback&&(k==='n'?tg.HapticFeedback.notificationOccurred(v):tg.HapticFeedback.impactOccurred(v))}catch(e){}};
const T=[{n:'Обычный',c:'#9AA5DB',v:13},{n:'Необычный',c:'#27D9BD',v:49},{n:'Редкий',c:'#9B7BFF',v:160},{n:'Эпический',c:'#FF5FA2',v:590},{n:'Легендарный',c:'#FFC933',v:2400},{n:'Мифический',c:'#FF4B3E',v:12600},{n:'Секретный',c:'#EAF1FF',v:35000}]
T.forEach((t,i)=>t.s=['Обычн.','Необыч.','Редкий','Эпик','Легенд.','Миф.','Секрет'][i]);;
const MODES=[{l:'Любой',min:0,cost:100},{l:'Редкий+',min:2,cost:350},{l:'Эпик+',min:3,cost:1000}];
const WORDS=['storm','night','wolf9','cyber','pixel','ghost','nova7','lunar','ember','frost','raven','blaze','orbit','pulse','zenith','vortex','shadow','dragon','falcon','comet','atlas','magic','royal','alpha','omega','delta','sigma','ninja','panda','tiger','cobalt','cipher','quartz','rocket','silent','golden','crystal','phoenix','nexus','vector','matrix','legend','hunter','pirate','wizard','spirit','shiver','velvet','copper','jungle'].filter(w=>/^[a-z]{5,}$/.test(w));
const L='abcdefghijklmnopqrstuvwxyz',V='aeiouy',K='bcdfghjklmnprstvwxz',POOL=L+'0123456789_#$%@';
const R=n=>Math.floor(Math.random()*n),P=a=>a[R(a.length)];
const rnd=n=>Array.from({length:n},()=>P(L)).join(''),syl=n=>Array.from({length:n},(_,i)=>P(i%2?V:K)).join('');
const rev=s=>[...s].reverse().join('');
const MAX=10;                 // размер коллекции
const APP_LINK='';            // ссылка на Mini App для кнопки «Позвать друзей», например https://t.me/твой_бот/app
const fmt=n=>Math.round(n).toLocaleString('ru-RU');
// цена ника плавно растёт с его баллами (без «пустот» между редкостями); секретные цены фиксированы
const PRICE_BASE=12,PRICE_K=.056;
const val=(t,p,n)=>{
  if(t>=6){const l=n?n.length:3;return Math.round(T[6].v*(l<=1?1.6:l===2?1.2:1))}
  if(!p)return T[t].v;
  return Math.max(1,Math.round(PRICE_BASE*Math.exp(PRICE_K*(p-30))));
};
const rar=(t,p)=>t===6?'только бонусы и апгрейд':'1 из '+oneIn(p);

const SECRETS=[...new Set(['ww','xxx','lot','лох','god','333','666','777','888','999','000','dead','#','111','222','444','555','13','69','420','1337','lol','wow','kek','zzz','www','w','x','1','0','11','007','404','gg','xd','omg','wtf','rip','лол','кек','бог','вау','$','%','@','?','!','*','~','_'])];
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
const def={coins:3000,spins:0,best:0,day:'',items:[],uid:0,ups:0,upw:0,cnt:[0,0,0,0,0,0,0],time:0,tday:{d:'',s:0},pend:null,econ:3,login:{n:0,last:''},wheel:'',q:{wk:'',list:[]}};
let S;try{S={...def,...JSON.parse(localStorage.getItem('nameroulette')||'{}')}}catch(e){S={...def}}
if(S.econ!==3){S.coins=3000;S.items=S.items.slice(0,MAX);S.econ=3}
if(!Array.isArray(S.cnt)||S.cnt.length<7)S.cnt=[0,0,0,0,0,0,0];
if(!S.tday||typeof S.tday!=='object')S.tday={d:'',s:0};
if(!S.uid){const id=tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.id;S.uid=id?(id%999999)+1:R(999999)+1}
const save=()=>{try{localStorage.setItem('nameroulette',JSON.stringify(S))}catch(e){}};
if(!S.login||typeof S.login!=='object')S.login={n:0,last:''};
if(!S.q||!Array.isArray(S.q.list))S.q={wk:'',list:[]};

// ---------- Бонусы: ядро (ежедневный вход, ежедневная рулетка, недельные задания) ----------
// Награды за 14 дней входа подряд (после 14-го дня круг начинается заново)
const LOGIN=[1000,1500,2000,3000,4000,5000,7500,10000,12500,15000,20000,25000,35000,50000];
// Призы ежедневной рулетки; w = шанс в процентах (сумма 100). k:'c' монеты, k:'n' ник редкости t
const WHEEL=[{k:'c',v:5000,w:32},{k:'c',v:10000,w:22},{k:'c',v:20000,w:13},{k:'c',v:35000,w:7},{k:'c',v:50000,w:3.5},{k:'c',v:100000,w:1},
  {k:'n',t:3,w:11},{k:'n',t:4,w:6},{k:'n',t:5,w:3.5},{k:'n',t:6,w:1}];
const WTOT=WHEEL.reduce((a,p)=>a+p.w,0);
// Недельные задания: n цель, r награда в монетах. Каждую неделю выбираются 3 из 6
const QDEF={
  spins:{n:30,r:10000,t:n=>`Сделай ${n} круток`},
  wheel:{n:3,r:8000,t:n=>n===1?'Прокрути ежедневную рулетку':`Прокрути ежедневную рулетку ${n} раза`},
  invite:{n:1,r:5000,t:()=>'Позови друга',h:'Засчитывается, когда ты отправишь приглашение'},
  ups:{n:25,r:15000,t:n=>`Сделай ${n} апгрейдов`},
  sell:{n:10,r:8000,t:n=>`Продай ${n} ников`},
  save:{n:5,r:6000,t:n=>`Сохрани ${n} ников`},
};
const dkey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const todayK=()=>dkey(new Date());
const yestK=()=>{const d=new Date();d.setDate(d.getDate()-1);return dkey(d)};
const weekK=()=>{const d=new Date();d.setDate(d.getDate()-(d.getDay()+6)%7);return dkey(d)};
const msToDay=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate()+1)-d};
const msToWeek=()=>{const d=new Date(),k=(d.getDay()+6)%7;return new Date(d.getFullYear(),d.getMonth(),d.getDate()+7-k)-d};
const leftT=ms=>{const s=Math.max(0,Math.floor(ms/1000)),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);return d?`${d} д ${h} ч`:h?`${h} ч ${m} мин`:`${m} мин ${s%60} сек`};
const dw=n=>n%10===1&&n%100!==11?'день':[2,3,4].includes(n%10)&&![12,13,14].includes(n%100)?'дня':'дней';
let lastK=todayK()+weekK();
function loginInfo(){
  const L=S.login,done=L.last===todayK(),alive=done||L.last===yestK(),n=alive?L.n:0;
  return{done,alive,n,idx:done?(L.n-1)%14:n%14};   // idx: какую награду выдали сегодня / какая доступна
}
function ensureQuests(){
  const wk=weekK();if(S.q.wk===wk&&S.q.list.length===3)return;
  const days=7-(new Date().getDay()+6)%7;           // сколько дней недели осталось, включая сегодня
  const ids=Object.keys(QDEF).map(k=>[Math.random(),k]).sort((a,b)=>a[0]-b[0]).slice(0,3).map(x=>x[1]);
  S.q={wk,list:ids.map(id=>({id,n:id==='wheel'?Math.min(QDEF.wheel.n,days):QDEF[id].n,p:0,got:false}))};
  save();
}
function bonAvail(){return !loginInfo().done||S.wheel!==todayK()||S.q.list.some(q=>!q.got&&q.p>=q.n)}
function updBonDot(){const d=document.querySelector('#bon-btn .dot');if(d)d.hidden=!bonAvail()}
function addQuest(id,n=1){ensureQuests();const q=S.q.list.find(x=>x.id===id);if(q&&!q.got&&q.p<q.n){q.p=Math.min(q.n,q.p+n);save()}updBonDot()}
ensureQuests();
let mode=0,count=1,busy=false,cur=[],tt;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2600)}

const SEC={start:900,step:1200,dur:1000};
function vigOn(reel){
  const v=$('#vig');try{reel.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}
  const place=()=>{const r=reel.getBoundingClientRect();v.style.setProperty('--vx',(r.left+r.width/2)+'px');v.style.setProperty('--vy',(r.top+r.height/2)+'px')};
  place();setTimeout(place,450);v.classList.add('on');
}
const vigOff=()=>$('#vig').classList.remove('on');
function build(name,animate,reel=$('#reel'),slow=false){
  reel.innerHTML='';reel.dataset.name=name;reel.classList.toggle('idle',!animate&&name.includes('?'));
  reel.style.fontSize=Math.max(14,Math.min(46,Math.floor((reel.parentElement.clientWidth-24-(name.length+1)*6)/(name.length*.94+.6))))+'px';
  const sec=slow&&animate&&!reduce;   // секретный ник: символы выходят по одному, остальное затемнено
  const at=document.createElement('div');at.className='at'+(sec?' sec':'');at.textContent='@';reel.append(at);
  if(sec)vigOn(reel);
  [...name].forEach((ch,i)=>{
    const c=document.createElement('div'),st=document.createElement('div');c.className='cell'+(sec?' sec':'');st.className='strip'+(animate&&!sec?' go':'');c.style.setProperty('--i',i);
    const n=animate&&!sec?12+i*3:0,chars=Array.from({length:n},()=>P(POOL));chars.push(ch);
    st.innerHTML=chars.map(x=>`<span>${x}</span>`).join('');c.append(st);reel.append(c);
    if(n){const d=reduce?1:1000+i*260;st.style.transitionDuration=d+'ms';
      requestAnimationFrame(()=>requestAnimationFrame(()=>st.style.transform=`translateY(${-n*1.5}em)`));
      setTimeout(()=>{st.classList.remove('go');c.classList.add('land');if(!reduce)hap('i','light')},d)}
    if(sec)setTimeout(()=>{c.classList.add('in');hap('i','medium');setTimeout(()=>c.classList.remove('sec','in'),SEC.dur)},SEC.start+i*SEC.step);
  });
  if(sec){
    setTimeout(()=>at.classList.add('in'),200);setTimeout(()=>at.classList.remove('sec','in'),200+SEC.dur);
    const total=SEC.start+(name.length-1)*SEC.step+SEC.dur+250;setTimeout(vigOff,total+500);return total;
  }
  return reduce?60:1000+(name.length-1)*260+150;
}
// показать результат на табло и включить эффекты редкости
function playStage(st,reel,r,fresh){
  const wait=build(r.name,fresh,reel,r.t===6);
  const fx2=()=>{st.classList.add('hit');st.classList.toggle('shake',r.t>=3);st.classList.toggle('mythic',r.t===5);st.classList.toggle('secret',r.t===6)};
  if(fresh)setTimeout(()=>{fx2();hap('n','success');if(r.t>=3)boom(T[r.t].c,r.t)},wait);else fx2();
}

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const mkRow=()=>{const d=document.createElement('div');d.className='stage rrow';d.innerHTML='<div class="reel" aria-live="polite"></div><div class="rmeta"></div>';return d};
function showIdle(){const box=$('#reels');box.innerHTML='';const r=mkRow();box.append(r);build('??????',false,r.querySelector('.reel'));$('#idle').hidden=false}
function roll(m){let best=null;for(let i=0;i<3000;i++){const s=gen(),r=score(s);if(!best||r.t>best.t)best={name:s,...r};if(r.t>=m.min)break}return{...best,kept:false}}
function flushPrev(){const left=cur.filter(c=>!c.kept);cur.forEach(c=>c.kept=true);S.pend=null;if(left.length)toast('Прошлые ники: '+stashAll(left))}
async function spin(){
  if(busy)return;const m=MODES[mode],cost=m.cost*count;
  if(S.coins<cost){toast('Не хватает монет. Продай ники в коллекции или загляни в бонусы.');return}
  flushPrev();busy=true;S.coins-=cost;S.spins+=count;addQuest('spins',count);
  cur=Array.from({length:count},()=>roll(m));
  cur.forEach(c=>{S.cnt[c.t]++;S.best=Math.max(S.best,c.t)});
  S.pend=cur.map(({name,t,p})=>({name,t,p}));save();
  $('#idle').hidden=true;render();
  const box=$('#reels');box.innerHTML='';
  const rows=cur.map(()=>{const r=mkRow();box.append(r);return r});
  await Promise.all(rows.map(async(r,i)=>{await sleep(i*240);const w=build(cur[i].name,true,r.querySelector('.reel'),cur[i].t===6);await sleep(w);revealRow(r,cur[i],i)}));
  busy=false;render();
}
function revealRow(row,c,i){
  const t=T[c.t];row.style.setProperty('--tc',t.c);
  row.classList.add('hit');row.classList.toggle('shake',c.t>=3);row.classList.toggle('mythic',c.t===5);row.classList.toggle('secret',c.t===6);
  const meta=row.querySelector('.rmeta');
  meta.innerHTML=`<div class="badge"><i></i>${t.n}</div><div class="tags"><span class="tag odd">Круче или равен: ${rar(c.t,c.p)}</span>${c.tags.map(x=>`<span class="tag">${x}</span>`).join('')}</div>
  <div class="acts"><button class="btn main" data-ra="keep" data-i="${i}">Сохранить</button><button class="btn" data-ra="sell" data-i="${i}">Продать за ${fmt(val(c.t,c.p,c.name))} 🪙</button><button class="btn" data-ra="copy" data-i="${i}">Копировать</button><button class="btn" data-ra="share" data-i="${i}">Поделиться</button></div>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>meta.classList.add('on')));
  if(c.t>=2)hap('n','success');if(c.t>=3)boom(t.c,c.t);
}
function markDone(row,text){row.querySelectorAll('[data-ra="keep"],[data-ra="sell"]').forEach(x=>x.disabled=true);row.querySelector('[data-ra="keep"]').textContent=text}
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
// забрать ники в коллекцию; если места нет, продать
function stashAll(list){
  let k=0,s=0;list.forEach(c=>{if(S.items.length<MAX){addItem(c.name,c.t,c.p);k++}else{S.coins+=val(c.t,c.p,c.name);s++}});
  return [k?`сохранено: ${k}`:'',s?`продано из-за полной коллекции: ${s}`:''].filter(Boolean).join(', ');
}
const pl=n=>n%10===1&&n%100!==11?'ник':[2,3,4].includes(n%10)&&![12,13,14].includes(n%100)?'ника':'ников';
function collapse(els,done){els.forEach(e=>{e.style.maxHeight=e.offsetHeight+'px';e.style.overflow='hidden';void e.offsetWidth;e.classList.add('out')});setTimeout(done,reduce?0:320)}

let shownCoins=S.coins,twRaf=0,colSel=null;
function setCoins(){
  const el=$('#coins'),from=shownCoins,to=S.coins;
  if(from===to){el.textContent=fmt(to)+' 🪙';return}
  cancelAnimationFrame(twRaf);el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');
  const t0=performance.now(),d=reduce?1:450;
  const step=n=>{const k=Math.min(1,(n-t0)/d),e=1-Math.pow(1-k,3);shownCoins=k<1?Math.round(from+(to-from)*e):to;el.textContent=fmt(shownCoins)+' 🪙';if(k<1)twRaf=requestAnimationFrame(step)};
  twRaf=requestAnimationFrame(step);
}
const setHtml=(el,h)=>{if(el._h!==h){el.innerHTML=h;el._h=h}};
function updSelbar(){
  const on=colSel&&colSel.size>0&&!$('#tab-col').hidden;
  if(on){const its=S.items.filter(i=>colSel.has(i.id));$('#selinfo').textContent=`Выбрано: ${its.length} · ${fmt(its.reduce((a,x)=>a+val(x.t,x.p,x.n),0))} 🪙`}
  $('#selbar').classList.toggle('on',!!on);
}
function renderCol(){
  const col=$('#tab-col'),its=[...S.items].sort((a,b)=>b.t-a.t);
  if(colSel)colSel=new Set([...colSel].filter(id=>S.items.some(i=>i.id===id)));
  let h;
  if(!its.length){colSel=null;h=`<div class="empty">Коллекция пуста.<br>Крути рулетку и забирай понравившиеся ники.<br><button class="btn" data-go="game">К рулетке</button></div>`}
  else h=`<div class="chead"><div><h2>Моя коллекция</h2><p class="sum">Ников: ${its.length} / ${MAX} · Если продать всё: ${fmt(its.reduce((a,x)=>a+val(x.t,x.p,x.n),0))} 🪙</p></div>`+
    (colSel?`<div class="cbtns"><button class="btn sm" data-a="all">Все</button><button class="btn sm" data-a="cancel">Отмена</button></div>`:`<button class="btn sm" data-a="selmode">Выбрать</button>`)+`</div>`+
    its.map(x=>{const sub=`<small>${T[x.t].n}${x.p?' · '+rar(x.t,x.p):''}</small>`,pr=fmt(val(x.t,x.p,x.n));
      return colSel?`<label class="item pick" style="--tc:${T[x.t].c}"><input type="checkbox" data-cs="${x.id}"${colSel.has(x.id)?' checked':''}><div><b>@${x.n}</b>${sub}</div><span>${pr} 🪙</span></label>`
      :`<div class="item" style="--tc:${T[x.t].c}"><div><b>@${x.n}</b>${sub}</div><button data-a="copy" data-id="${x.id}" aria-label="Копировать">⧉</button><button data-a="sell" data-id="${x.id}" aria-label="Продать">${pr} 🪙</button></div>`}).join('');
  setHtml(col,h);updSelbar();
}
function render(){
  setCoins();
  ensureQuests();updBonDot();
  const m=MODES[mode],seg=$('#seg'),cn=$('#cnt'),od=$('#odds');
  if(!seg.firstChild)seg.innerHTML=MODES.map((x,i)=>`<button aria-pressed="false" data-m="${i}">${x.l}<small>${fmt(x.cost)} 🪙</small></button>`).join('');
  if(!cn.firstChild)cn.innerHTML=[1,3].map(n=>`<button aria-pressed="false" data-n="${n}">×${n}<small>${n===1?'один ник':'три ника'}</small></button>`).join('');
  [...seg.children].forEach((b,i)=>b.setAttribute('aria-pressed',i===mode));
  [...cn.children].forEach(b=>b.setAttribute('aria-pressed',+b.dataset.n===count));
  const sp=$('#spin');sp.textContent=`Крутить${count>1?' ×'+count:''} · ${fmt(m.cost*count)} 🪙`;sp.disabled=busy;
  if(!od.firstChild)od.innerHTML=T.slice(0,6).map(t=>`<span class="od" style="--tc:${t.c}"><b></b><small>${t.s}</small></span>`).join('');
  const pm=TIERP.slice(0,6).map((p,i)=>i>=m.min?p:0),sm=pm.reduce((a,b)=>a+b,0)||1;
  [...od.children].forEach((s,i)=>{const v=pm[i]/sm*100;s.firstChild.textContent=v?(v<1?v.toFixed(1):Math.round(v))+'%':'—'});
  $('#st-spins').textContent=`Круток: ${fmt(S.spins)}`;
  $('#st-best').innerHTML=`Лучший: <b class="chip" style="background:${T[S.best].c}">${S.spins?T[S.best].n:'—'}</b>`;
  renderCol();
  if(!$('#tab-prof').hidden)renderProf();
  if(!$('#tab-bon').hidden)renderBon();
  if(!$('#tab-up').hidden)setTimeout(renderUp,0);
}

$('#spin').onclick=spin;
$('#seg').onclick=e=>{const b=e.target.closest('[data-m]');if(b&&!busy){mode=+b.dataset.m;render()}};
$('#cnt').onclick=e=>{const b=e.target.closest('[data-n]');if(b&&!busy){count=+b.dataset.n;render()}};
$('#reels').onclick=e=>{
  const b=e.target.closest('[data-ra]');if(!b||b.disabled)return;
  const c=cur[+b.dataset.i],a=b.dataset.ra;if(!c)return;
  if(a==='copy')return copy(c.name);
  if(a==='share')return share(c.name,c.t);
  if(c.kept)return;
  const row=b.closest('.rrow');
  if(a==='keep'){
    if(S.items.length>=MAX){toast(`Коллекция заполнена (${MAX}/${MAX}). Продай ник или освободи место.`);return}
    addItem(c.name,c.t,c.p);c.kept=true;addQuest('save',1);markDone(row,'Сохранено ✓');hap('i','medium');
  }else{const v=val(c.t,c.p,c.name);S.coins+=v;c.kept=true;addQuest('sell',1);markDone(row,`Продано за ${fmt(v)} 🪙`)}
  S.pend=cur.filter(x=>!x.kept).map(({name,t,p})=>({name,t,p}));save();render();
};
$('#tab-col').onclick=e=>{
  const g=e.target.closest('[data-go]');if(g)return tab(g.dataset.go);
  const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
  if(a==='selmode'){colSel=new Set();renderCol();return}
  if(a==='cancel'){colSel=null;renderCol();return}
  if(a==='all'){colSel=colSel.size===S.items.length?new Set():new Set(S.items.map(i=>i.id));renderCol();return}
  const x=S.items.find(i=>i.id===b.dataset.id);if(!x)return;
  if(a==='copy')copy(x.n);
  else if(a==='sell'){const v=val(x.t,x.p,x.n);
    ask(`Продать @${x.n} за ${fmt(v)} 🪙?`,()=>collapse([b.closest('.item')],()=>{if(!S.items.includes(x))return;S.items=S.items.filter(i=>i!==x);S.coins+=v;addQuest('sell',1);save();toast(`Продано за ${fmt(v)} 🪙`);render()}))}
};
$('#tab-col').onchange=e=>{const i=e.target.closest('[data-cs]');if(!i||!colSel)return;i.checked?colSel.add(i.dataset.cs):colSel.delete(i.dataset.cs);updSelbar()};
$('#selsell').onclick=()=>{
  if(!colSel||!colSel.size)return;
  const its=S.items.filter(i=>colSel.has(i.id)),sum=its.reduce((a,x)=>a+val(x.t,x.p,x.n),0);
  ask(`Продать ${its.length} ${pl(its.length)} за ${fmt(sum)} 🪙?`,()=>{
    const els=[...document.querySelectorAll('#tab-col .item')].filter(el=>el.querySelector('input:checked'));
    $('#selbar').classList.remove('on');
    collapse(els,()=>{const ids=new Set(its.map(i=>i.id));S.items=S.items.filter(i=>!ids.has(i.id));S.coins+=sum;colSel=null;addQuest('sell',its.length);save();toast(`Продано: ${its.length} ${pl(its.length)} за ${fmt(sum)} 🪙`);render()});
  });
};
{const arr=Array.isArray(S.pend)?S.pend:S.pend?[S.pend]:[];S.pend=null;if(arr.length){const m=stashAll(arr);save();setTimeout(()=>toast('Прошлые ники: '+m),500)}}
render();showIdle();
addEventListener('resize',()=>{if(busy||$('#tab-game').hidden)return;document.querySelectorAll('#reels .reel').forEach(r=>r.dataset.name&&build(r.dataset.name,false,r))});

// ---------- Апгрейд ----------
const UPMAX=5;   // максимум ников в ставке апгрейда
let up={sel:new Set(),c:50,prize:null,busy:false,msg:'',res:null,fresh:false};
const RL={n:70,w:64,gap:6,idx:52};
const chanceOf=(s,pr)=>Math.min(.85,Math.max(.01,.9*s.v/pr.price));
function stake(){const its=S.items.filter(i=>up.sel.has(i.id)).slice(0,UPMAX);return{its,v:its.reduce((a,x)=>a+val(x.t,x.p,x.n),0),mx:its.reduce((a,x)=>Math.max(a,x.t),-1)}}
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
  up.sel=new Set([...up.sel].filter(id=>S.items.some(i=>i.id===id)).slice(0,UPMAX));
  const s=stake(),el=$('#tab-up'),its=[...S.items].sort((a,b)=>b.t-a.t);
  if(!s.its.length)up.prize=null;else if(!up.prize)pickPrize(s);
  let h=`<h2>Апгрейд</h2><p class="sum">Поставь ники из коллекции и двигай ползунок: чем ниже шанс, тем дороже ник выпадет. Если стрелка остановится на ✕, ставка сгорит. В ставку можно поставить до ${UPMAX} ников.</p>`;
  if(!its.length&&!up.res&&!up.msg){el.innerHTML=h+`<div class="empty">Ставить пока нечего.<br>Сохрани ники в коллекцию.<br><button class="btn" data-go="game">К рулетке</button></div>`;return}
  const full=up.sel.size>=UPMAX;
  h+=`<p class="sum cap">Ставка: <b>${up.sel.size} / ${UPMAX}</b></p><div class="stake">`+its.map(x=>`<label class="item pick" style="--tc:${T[x.t].c}"><input type="checkbox" data-sel="${x.id}"${up.sel.has(x.id)?' checked':''}${full&&!up.sel.has(x.id)?' disabled':''}><div><b>@${x.n}</b><small>${T[x.t].n}</small></div><span>${fmt(val(x.t,x.p,x.n))} 🪙</span></label>`).join('')+`</div>`;
  h+=`<div class="slider"><div class="srow"><span>Шанс</span><b id="ch-out"></b></div><input type="range" id="chs" min="1" max="85" step="1" value="${up.c}"${s.its.length?'':' disabled'} aria-label="Шанс апгрейда"></div><div id="prize"></div>`;
  h+=`<div class="rl" id="rl"><i class="ptr"></i><div class="rl-track" id="rlt"></div></div><button class="spin" id="do-up">Крутить апгрейд</button>`;
  h+=`<div class="upres">${up.msg}${up.res?`<div class="stage" id="upstage" style="--tc:${T[up.res.t].c}"><div class="reel" id="upreel"></div><div class="badge"><i></i>${T[up.res.t].n}</div><div class="tags"><span class="tag odd">${up.res.t===6?rar(6):'Круче или равен: 1 из '+oneIn(up.res.p)}</span></div></div>`:''}</div>`;
  const oldSt=el.querySelector('.stake'),top=oldSt?oldSt.scrollTop:0;el.innerHTML=h;{const n=el.querySelector('.stake');if(n)n.scrollTop=top}fillUp();
  if(up.res){const fresh=up.fresh;up.fresh=false;playStage($('#upstage'),$('#upreel'),up.res,fresh)}
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
  S.items=S.items.filter(i=>!up.sel.has(i.id));S.ups++;addQuest('ups',1);
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
$('#tab-up').onchange=e=>{
  const i=e.target.closest('[data-sel]');if(!i||up.busy)return;
  if(i.checked){if(up.sel.size>=UPMAX){i.checked=false;toast(`Максимум ${UPMAX} ников в ставке`);return}up.sel.add(i.dataset.sel)}else up.sel.delete(i.dataset.sel);
  up.msg='';up.res=null;up.prize=null;renderUp();
};
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
  if(!$('#tab-bon').hidden)updTimers();
  const kk=todayK()+weekK();if(kk!==lastK){lastK=kk;ensureQuests();render()}
},1000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
addEventListener('pagehide',save);
$('#tab-prof').onclick=e=>{
  if(e.target.id!=='invite')return;
  addQuest('invite',1);
  const base=APP_LINK||location.href.split('#')[0].split('?')[0];
  openTg(`https://t.me/share/url?url=${encodeURIComponent(base)}&text=${encodeURIComponent('Заходи в Нейм-рулетку: выбивай редкие юзернеймы и собирай коллекцию!')}`);
};
$('#prof-btn').onclick=()=>tab($('#tab-prof').hidden?'prof':'game');

function tab(n){
  document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===n));
  ['game','col','up','prof','bon'].forEach(k=>{const e=$('#tab-'+k);
    if(k===n){if(e.hidden){e.hidden=false;e.classList.remove('tabin');void e.offsetWidth;e.classList.add('tabin')}}else e.hidden=true});
  $('#prof-btn').setAttribute('aria-pressed',n==='prof');
  $('#bon-btn').setAttribute('aria-pressed',n==='bon');
  if(n!=='col')colSel=null;
  if(n==='col')renderCol();else updSelbar();
  if(n==='up')renderUp();
  if(n==='prof')renderProf();
  if(n==='bon')renderBon();
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
// ---------- Бонусы: вкладка ----------
const bon={busy:false,res:null,fresh:false};
const WT={n:70,w:78,gap:6,idx:52};
const wpick=()=>{let r=Math.random()*WTOT;for(const p of WHEEL){r-=p.w;if(r<0)return p}return WHEEL[0]};
const wlab=p=>p.k==='c'?(p.v>=1000?p.v/1000+'K':p.v):T[p.t].s;
const wtile=p=>p.k==='c'?`<b class="wt co"><em>${wlab(p)}</em><small>монет</small></b>`:`<b class="wt" style="--tc:${T[p.t].c}"><em>${wlab(p)}</em><small>ник</small></b>`;
const kfmt=r=>r>=1000?r/1000+'K':String(r);
function wresHtml(){
  const r=bon.res;if(!r)return '';
  if(r.k==='c')return `<div class="win" style="--tc:#FFC933"><b>+${fmt(r.v)} 🪙</b> Монеты уже на балансе.</div>`;
  return `<div class="stage" id="wstage" style="--tc:${T[r.t].c}"><div class="reel" id="wreel"></div><div class="badge"><i></i>${T[r.t].n}</div><div class="tags"><span class="tag odd">${r.t===6?rar(6):'Круче или равен: '+rar(r.t,r.p)}</span></div></div>`+
    `<div class="win" style="--tc:${T[r.t].c}">${r.saved?'Ник добавлен в коллекцию.':`Коллекция заполнена, ник продан за ${fmt(r.v)} 🪙.`}</div>`;
}
function updTimers(){document.querySelectorAll('#tab-bon [data-t]').forEach(s=>s.textContent=leftT(s.dataset.t==='day'?msToDay():msToWeek()))}
function renderBon(){
  if(bon.busy)return;
  ensureQuests();
  const li=loginInfo(),can=S.wheel!==todayK(),el=$('#tab-bon');
  let h=`<h2>Бонусы</h2>`;
  h+=`<div class="pcard"><div class="bhead"><h3>Ежедневный вход</h3><span class="bsub">Серия: ${li.n} ${dw(li.n)}</span></div><div class="lgrid">`+
    LOGIN.map((r,i)=>{const st=(li.done?i<=li.idx:i<li.idx)?'done':(!li.done&&i===li.idx)?'now':'';
      return `<div class="lcell ${st}${i===13?' big':''}"><small>День ${i+1}</small><b>${kfmt(r)}</b>${st==='done'?'<i>✓</i>':''}</div>`}).join('')+`</div>`+
    (li.done?`<button class="btn" disabled>Получено · следующая через <span data-t="day"></span></button>`
      :`<button class="btn main" data-b="login">Забрать день ${li.idx+1}: ${fmt(LOGIN[li.idx])} 🪙</button>`)+
    (!li.done&&!li.alive&&S.login.n>0?`<p class="sum">Серия прервалась, награды идут с первого дня.</p>`:'')+`</div>`;
  h+=`<div class="pcard"><div class="bhead"><h3>Ежедневная рулетка</h3><span class="bsub">1 попытка в сутки</span></div>
    <div class="rl wl" id="wl"><i class="ptr"></i><div class="rl-track" id="wlt"></div></div>
    <div class="wodds">${WHEEL.map(p=>`<span class="od" style="--tc:${p.k==='c'?'#FFC933':T[p.t].c}"><b>${p.w}%</b><small>${wlab(p)}</small></span>`).join('')}</div>`+
    (can?`<button class="spin" data-b="wheel">Крутить рулетку</button>`:`<button class="spin" disabled>Уже крутили · ещё <span data-t="day"></span></button>`)+
    `<div class="upres">${wresHtml()}</div></div>`;
  h+=`<div class="pcard"><div class="bhead"><h3>Задания недели</h3><span class="bsub">обновятся через <span data-t="week"></span></span></div>`+
    S.q.list.map((q,i)=>{const d=QDEF[q.id],ok=q.p>=q.n;
      return `<div class="quest${q.got?' got':''}"><div class="qtop"><b>${d.t(q.n)}</b><span>${fmt(d.r)} 🪙</span></div>${d.h?`<small class="qh">${d.h}</small>`:''}<div class="qbar"><i style="width:${q.p/q.n*100}%"></i></div>`+
      `<div class="qbot"><small>${q.p} / ${q.n}</small>${q.got?'<em>Получено ✓</em>':ok?`<button class="btn main sm" data-b="quest" data-i="${i}">Забрать</button>`:''}</div></div>`}).join('')+`</div>`;
  if(el._h!==h){
    el.innerHTML=h;el._h=h;
    const t=$('#wlt');if(t)t.innerHTML=Array.from({length:WT.n},wpick).map(wtile).join('');
    if(bon.res&&bon.res.k==='n'){const fresh=bon.fresh;bon.fresh=false;playStage($('#wstage'),$('#wreel'),bon.res,fresh)}else bon.fresh=false;
  }
  updTimers();
}
function claimLogin(){
  const i=loginInfo();if(i.done)return;
  const r=LOGIN[i.idx];S.login={n:i.n+1,last:todayK()};S.coins+=r;save();
  toast(`День ${i.idx+1}: +${fmt(r)} 🪙`);hap('n','success');if(r>=20000)boom('#FFC933',4);render();
}
function claimQuest(i){
  const q=S.q.list[i];if(!q||q.got||q.p<q.n)return;
  const r=QDEF[q.id].r;q.got=true;S.coins+=r;save();toast(`Задание выполнено: +${fmt(r)} 🪙`);hap('n','success');render();
}
async function doWheel(){
  if(bon.busy||S.wheel===todayK())return;
  const win=wpick(),pick=win.k==='n'?P(prizePool().filter(x=>x.t===win.t)):null;   // пул строим заранее, чтобы не подвисло в анимации
  bon.busy=true;bon.res=null;
  document.querySelectorAll('#tab-bon button').forEach(b=>b.disabled=true);
  const rl=$('#wl'),trk=$('#wlt'),W=rl.clientWidth,pitch=WT.w+WT.gap,off=(Math.random()-.5)*WT.w*.6,dur=reduce?50:5200;
  trk.style.transition='none';trk.style.transform='translateX(0)';
  trk.innerHTML=Array.from({length:WT.n},(_,i)=>wtile(i===WT.idx?win:wpick())).join('');void trk.offsetWidth;
  trk.style.transition=`transform ${dur}ms cubic-bezier(.08,.6,.12,1)`;
  trk.style.transform=`translateX(${W/2-(WT.idx*pitch+WT.w/2+off)}px)`;
  if(!reduce){let last=-1,lt=0;const t0=performance.now();
    (function tk(){const x=new DOMMatrix(getComputedStyle(trk).transform).m41,i=Math.floor((W/2-x)/pitch),now=performance.now();
      if(i!==last&&now-lt>70){last=i;lt=now;hap('i','light')}
      if(now-t0<dur)requestAnimationFrame(tk)})()}
  await sleep(dur+250);trk.children[WT.idx].classList.add('on');await sleep(reduce?0:700);
  S.wheel=todayK();addQuest('wheel',1);
  if(win.k==='c'){S.coins+=win.v;bon.res={k:'c',v:win.v};if(win.v>=20000)boom('#FFC933',win.v>=50000?5:4)}
  else{
    S.cnt[pick.t]++;
    if(S.items.length<MAX){addItem(pick.name,pick.t,pick.p);bon.res={k:'n',name:pick.name,t:pick.t,p:pick.p,saved:true}}
    else{const v=val(pick.t,pick.p,pick.name);S.coins+=v;bon.res={k:'n',name:pick.name,t:pick.t,p:pick.p,saved:false,v}}
  }
  bon.fresh=true;bon.busy=false;save();render();
}
$('#tab-bon').onclick=e=>{
  const b=e.target.closest('[data-b]');if(!b||b.disabled||bon.busy)return;
  if(b.dataset.b==='login')claimLogin();else if(b.dataset.b==='wheel')doWheel();else if(b.dataset.b==='quest')claimQuest(+b.dataset.i);
};
$('#bon-btn').onclick=()=>tab($('#tab-bon').hidden?'bon':'game');
renderUp();
