// показать ошибку на экране, если что-то сломалось (пригодится для диагностики на телефоне)
addEventListener('error',e=>{try{let b=document.getElementById('errbar');if(!b){b=document.createElement('div');b.id='errbar';b.style.cssText='position:fixed;left:8px;right:8px;top:8px;z-index:99;background:#B3261E;color:#fff;font:12px/1.35 monospace;padding:8px 10px;border-radius:10px;word-break:break-all';b.onclick=()=>b.remove();document.body.append(b)}b.textContent='Ошибка: '+e.message+' ('+String(e.filename||'').split('/').pop()+':'+e.lineno+') · нажми, чтобы скрыть'}catch(x){}});
addEventListener('unhandledrejection',e=>{try{console.error(e.reason)}catch(x){}});
const $=s=>document.querySelector(s),tg=window.Telegram&&Telegram.WebApp;
// отступ сверху под системную панель Telegram («Закрыть», «…»): берём из SDK, иначе запасной
function safeTop(){
  let t=0;try{t=((tg.safeAreaInset||{}).top||0)+((tg.contentSafeAreaInset||{}).top||0)}catch(e){}
  if(tg&&tg.isFullscreen&&t<90)t=90;   // полноэкранный режим: панель Telegram поверх страницы
  document.documentElement.style.setProperty('--top',t?t+'px':'env(safe-area-inset-top)');
}
if(tg){tg.ready();tg.expand();safeTop();['safeAreaChanged','contentSafeAreaChanged','fullscreenChanged','viewportChanged'].forEach(ev=>{try{tg.onEvent(ev,safeTop)}catch(e){}});try{tg.setHeaderColor('#0D0B1A');tg.setBackgroundColor('#0D0B1A')}catch(e){}}
const hap=(k,v)=>{try{tg&&tg.HapticFeedback&&(k==='n'?tg.HapticFeedback.notificationOccurred(v):tg.HapticFeedback.impactOccurred(v))}catch(e){}};
const T=[{n:'Обычный',c:'#9AA5DB',v:13},{n:'Необычный',c:'#27D9BD',v:49},{n:'Редкий',c:'#9B7BFF',v:160},{n:'Эпический',c:'#FF5FA2',v:590},{n:'Легендарный',c:'#FFC933',v:2400},{n:'Мифический',c:'#FF4B3E',v:12600},{n:'Секретный',c:'#EAF1FF',v:35000}]
T.forEach((t,i)=>t.s=['Обычн.','Необыч.','Редкий','Эпик','Легенд.','Миф.','Секрет'][i]);;
const MODES=[{l:'Любой',min:0,cost:100},{l:'Редкий+',min:2,cost:350},{l:'Эпик+',min:3,cost:1000}];
const WORDS=['storm','night','wolf9','cyber','pixel','ghost','nova7','lunar','ember','frost','raven','blaze','orbit','pulse','zenith','vortex','shadow','dragon','falcon','comet','atlas','magic','royal','alpha','omega','delta','sigma','ninja','panda','tiger','cobalt','cipher','quartz','rocket','silent','golden','crystal','phoenix','nexus','vector','matrix','legend','hunter','pirate','wizard','spirit','shiver','velvet','copper','jungle'].filter(w=>/^[a-z]{5,}$/.test(w));
const L='abcdefghijklmnopqrstuvwxyz',V='aeiouy',K='bcdfghjklmnprstvwxz',POOL=L+'0123456789_#$%@';
const R=n=>Math.floor(Math.random()*n),P=a=>a[R(a.length)];
const rnd=n=>Array.from({length:n},()=>P(L)).join(''),syl=n=>Array.from({length:n},(_,i)=>P(i%2?V:K)).join('');
const rev=s=>[...s].reverse().join('');
const MAX0=10,MAXSLOTS=30;   // стартовый и предельный размер коллекции
let MAX=MAX0;                // текущий размер коллекции (растёт за монеты, хранится в S.slots)
const slotPrice=n=>Math.round(2500*Math.pow(1.35,n-MAX0)/100)*100;   // цена следующего места при n местах
const EN_CAP=15,EN_INT=15*60*1000;   // запас энергии и время накопления одной единицы (15 минут)
const AUTO=['выключена','ниже необычного','ниже редкого','ниже эпического','ниже легендарного','ниже мифического'];
const APP_LINK='';            // ссылка на Mini App для кнопки «Позвать друзей», например https://t.me/твой_бот/app
const fmt=n=>Math.round(n).toLocaleString('ru-RU');
// цена ника плавно растёт с его баллами (без «пустот» между редкостями); секретные цены фиксированы
const PRICE_BASE=12,PRICE_K=.056;
const val=(t,p,n)=>{
  if(t>=6){const l=n?n.length:3;return Math.round(T[6].v*(l<=1?1.6:l===2?1.2:1))}
  if(!p)return T[t].v;
  return Math.max(1,Math.round(PRICE_BASE*Math.exp(PRICE_K*(p-30))));
};

const SECRETS=[...new Set(['ww','xxx','lot','лох','god','333','666','777','888','999','000','dead','#','111','222','444','555','13','69','420','1337','lol','wow','kek','zzz','www','w','x','1','0','11','007','404','gg','xd','omg','wtf','rip','лол','кек','бог','вау','$','%','@','?','!','*','~','_'])];
const ADJ=['dark','night','silent','red','blue','cold','wild','swift','lazy','crazy','happy','lucky','toxic','epic','mega','ultra','neo','pixel','cyber','royal'];
const NOUN=['wolf','fox','cat','bear','tiger','panda','ghost','king','queen','ninja','pilot','mage','hero','dragon','falcon','raven','shark','cobra','rider','hunter'];
const AFFIX=['pro','dev','real','official','the','its','mr','im'];
const KEYS=['qwerty','asdfgh','zxcvbn','qazwsx','qweasd','asdfg','zxcvb','qwert','poiuy','wasd1'];
const NAMES=['alex','max','ivan','dima','anna','maria','sasha','kate','oleg','nikita','artem','denis','sergey','andrey','olga','julia','katya','vlad','egor','roman','danil','lena','sonya','misha','kirill','pavel','igor','masha','tanya','ruslan','timur','amir','aidar','aigerim','dana','aruzhan','nurlan','askar','dauren','madina'];
const SURN=['smith','ivanov','petrov','k','m','s','official','real','life','play','game','music','art','photo','travel'];
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
// самые обычные имена: alex2003, ivan_petrov, anna_k, its_max
function plain(){
  const n=P(NAMES);let s;
  switch(R(7)){
    case 0:s=n+(1985+R(30));break;
    case 1:s=n+R(100);break;
    case 2:s=n+'_'+P(SURN);break;
    case 3:s=P(NAMES)+'_'+n;break;
    case 4:s='its_'+n;break;
    case 5:s=n+String(R(1000)).padStart(3,'0');break;
    default:s=n+'_'+(R(90)+10);
  }
  return s.length<5?s+R(10)+R(10):s;
}
function gen(){
  const q=Math.random();
  if(q<.00065){const a=P(L),b=P(L.replace(a,''));return R(2)?a.repeat(5):a+b+a+b+a}
  if(q<.1)return plain();
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

const def={coins:3000,spins:0,best:0,day:'',items:[],uid:0,ups:0,upw:0,cnt:[0,0,0,0,0,0,0],time:0,tday:{d:'',s:0},pend:null,econ:3,login:{n:0,last:''},wheel:'',q:{wk:'',list:[]},slots:10,auto:0,saved:0,sold:0,bestv:0,wheelN:0,maxStreak:0,qn:0,maxCoins:0,inv:0,tri:0,luck:0,five:0,ach:null,achGot:[],en:15,enT:0,src:'free',show:[],snd:true,lvl:1,xp:0,xpv:0};
let S;try{S={...def,...JSON.parse(localStorage.getItem('nameroulette')||'{}')}}catch(e){S={...def}}
fixState();
if(S.econ!==3){S.coins=3000;S.items=S.items.slice(0,MAX);S.econ=3}
if(!S.uid){const id=tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.id;S.uid=id?(id%999999)+1:R(999999)+1}
// ---------- Сохранение: на устройстве (localStorage) и в облаке Telegram (CloudStorage), чтобы прогресс переезжал между устройствами ----------
var CS=null,cloudTm=0,cloudDone=false;
try{if(tg&&tg.CloudStorage&&tg.isVersionAtLeast&&tg.isVersionAtLeast('6.9'))CS=tg.CloudStorage}catch(e){}
const save=()=>{S.ts=Date.now();try{localStorage.setItem('nameroulette',JSON.stringify(S))}catch(e){}if(CS&&cloudDone){clearTimeout(cloudTm);cloudTm=setTimeout(cloudPush,2500)}};
function cloudPush(){
  if(!CS)return;clearTimeout(cloudTm);cloudTm=0;
  try{const j=JSON.stringify(S),parts=[];for(let i=0;i<j.length;i+=3000)parts.push(j.slice(i,i+3000));
    const nop=()=>{};parts.forEach((p,i)=>CS.setItem('nr_'+i,p,nop));CS.setItem('nr_n',String(parts.length),nop)}catch(e){}   // счётчик пишем последним
}
function xpNeed(l){return 100+l*40}   // опыт до следующего уровня
// приводим сохранение к безопасному виду: любые пропуски и мусор (в т.ч. из облака или старых версий) не ломают запуск
function fixState(){
  if(!S||typeof S!=='object')S={...def};
  const num=(k,d)=>{S[k]=typeof S[k]==='number'&&isFinite(S[k])?S[k]:d};
  num('coins',3000);S.coins=Math.max(0,S.coins);
  ['spins','ups','upw','time','saved','sold','bestv','wheelN','maxStreak','qn','maxCoins','inv','tri','luck','five'].forEach(k=>{num(k,0);S[k]=Math.max(0,S[k])});
  num('best',0);S.best=Math.min(6,Math.max(0,Math.floor(S.best)));
  num('uid',0);num('en',EN_CAP);S.en=Math.max(0,Math.min(999,Math.floor(S.en)));num('enT',0);if(S.src!=='free'&&S.src!=='coin')S.src='free';S.snd=S.snd!==false;num('lvl',1);S.lvl=Math.max(1,Math.floor(S.lvl));num('xp',0);S.xp=Math.max(0,Math.floor(S.xp));
  S.show=Array.isArray(S.show)?[...new Set(S.show.filter(n=>n===0||n===1||n===2))]:[];
  S.cnt=Array.isArray(S.cnt)?Array.from({length:7},(_,i)=>Math.max(0,+S.cnt[i]||0)):[0,0,0,0,0,0,0];
  if(!S.tday||typeof S.tday!=='object')S.tday={d:'',s:0};
  if(!S.login||typeof S.login!=='object')S.login={n:0,last:''};
  S.login.n=+S.login.n||0;S.login.last=typeof S.login.last==='string'?S.login.last:'';
  if(typeof S.wheel!=='string')S.wheel='';
  if(!S.q||typeof S.q!=='object'||!Array.isArray(S.q.list))S.q={wk:'',list:[]};
  S.q.list=S.q.list.filter(q=>q&&typeof q.id==='string'&&+q.n>0).map(q=>({id:q.id,n:+q.n,p:Math.max(0,+q.p||0),got:!!q.got}));
  S.items=(Array.isArray(S.items)?S.items:[]).filter(x=>x&&typeof x.n==='string'&&x.n&&Number.isInteger(x.t)&&x.t>=0&&x.t<=6).map(x=>({id:String(x.id||Date.now()+''+R(1000)),n:x.n,t:x.t,p:+x.p||0}));
  S.slots=Math.min(MAXSLOTS,Math.max(MAX0,Math.floor(+S.slots)||MAX0));MAX=S.slots;
  S.items=S.items.slice(0,MAX);
  if(!(S.auto>=0&&S.auto<=5))S.auto=0;S.auto=Math.floor(S.auto);
  if(S.xpv!==1){   // уровни появились позже: старым игрокам тихо начисляем опыт за прошлые действия
    let t=S.spins*10+S.upw*60+S.ups*25+S.saved*3+S.sold*2+(Array.isArray(S.achGot)?S.achGot.length*60:0);S.lvl=1;
    while(t>=xpNeed(S.lvl)){t-=xpNeed(S.lvl);S.lvl++}S.xp=t;S.xpv=1}
  if(S.achv!==3){S.ach=null;S.achGot=[];S.achv=3}         // список достижений менялся: пересчитываем тихо
  S.achGot=Array.isArray(S.achGot)?[...new Set(S.achGot.filter(n=>Number.isInteger(n)&&n>=0&&n<25))]:[];
  if(S.ach!==null&&!Array.isArray(S.ach))S.ach=null;
  if(S.pend!=null){const arr=Array.isArray(S.pend)?S.pend:[S.pend];S.pend=arr.filter(c=>c&&typeof c.name==='string'&&Number.isInteger(c.t)&&c.t>=0&&c.t<=6).map(c=>({name:c.name,t:c.t,p:+c.p||0}))}
}
function cloudLoad(){
  if(!CS){return}
  const done=()=>{cloudDone=true;cloudPush()};
  try{CS.getItem('nr_n',(e,n)=>{
    n=+n;if(e||!n){done();return}
    CS.getItems(Array.from({length:n},(_,i)=>'nr_'+i),(e2,v)=>{
      let o=null;try{if(!e2)o=JSON.parse(Array.from({length:n},(_,i)=>v['nr_'+i]||'').join(''))}catch(x){}
      if(o&&typeof o==='object'&&((o.time||0)>(S.time||0)||((o.time||0)===(S.time||0)&&(o.ts||0)>(S.ts||0)))&&!busy&&!xbusy){
        S={...def,...o};fixState();ensureQuests();localStorage.setItem('nameroulette',JSON.stringify(S));shownCoins=S.coins;cur=[];S.pend=null;showIdle();render();
      }
      done();
    })})}catch(e){cloudDone=true}
}
S.maxStreak=Math.max(S.maxStreak||0,S.login.n||0);

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
function tickEn(){   // накопление энергии: +1 каждые 15 минут, пока меньше запаса
  const now=Date.now();
  if(S.en>=EN_CAP){S.enT=now;return false}
  if(!S.enT||S.enT>now)S.enT=now;
  const k=Math.floor((now-S.enT)/EN_INT);
  if(k>0){S.en=Math.min(EN_CAP,S.en+k);S.enT=S.en>=EN_CAP?now:S.enT+k*EN_INT;return true}
  return false;
}
const enLeft=()=>S.en>=EN_CAP?0:Math.max(0,EN_INT-(Date.now()-S.enT));
const mmss=ms=>{const s=Math.ceil(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function updEn(){
  const el=$('#en');if(!el||el.hidden)return;
  const full=Math.min(S.en,EN_CAP),over=S.en>EN_CAP;
  setHtml(el,`<div class="enrow"><span class="enic">⚡</span><b class="enl">Энергия</b><b class="enn">${S.en} ⚡</b>${over?'<em class="enx">сверх запаса</em>':''}</div>
  <div class="enbar">${Array.from({length:EN_CAP},(_,i)=>`<i${i<full?' class="on"':''}></i>`).join('')}</div>
  <p>${S.en<EN_CAP?`+1 энергия через ${mmss(enLeft())}. Запас: ${EN_CAP}`:`Сверх запаса ${EN_CAP} новая энергия копится, когда станет меньше ${EN_CAP}`}</p>`);
}
function ensureQuests(){
  const wk=weekK();if(S.q.wk===wk&&S.q.list.length===3&&S.q.list.every(q=>QDEF[q.id]))return;
  const days=7-(new Date().getDay()+6)%7;           // сколько дней недели осталось, включая сегодня
  const ids=Object.keys(QDEF).map(k=>[Math.random(),k]).sort((a,b)=>a[0]-b[0]).slice(0,3).map(x=>x[1]);
  S.q={wk,list:ids.map(id=>({id,n:id==='wheel'?Math.min(QDEF.wheel.n,days):QDEF[id].n,p:0,got:false}))};
  save();
}
function bonAvail(){return !loginInfo().done||S.wheel!==todayK()||S.q.list.some(q=>!q.got&&q.p>=q.n)}
function updBonDot(){const d=document.querySelector('#bon-btn .dot');if(d)d.hidden=!bonAvail()}
function addQuest(id,n=1){ensureQuests();const q=S.q.list.find(x=>x.id===id);if(q&&!q.got&&q.p<q.n){q.p=Math.min(q.n,q.p+n);save()}updBonDot()}
ensureQuests();
// ---------- Достижения (25) ----------
// A(иконка, название, описание, текущее значение, цель)
const A=(i,n,d,cur,goal,r)=>({i,n,d,cur,goal,r});   // r: награда в монетах
const ACH=[
  A('🎰','100 круток','Сделай 100 круток',()=>S.spins,100,3000),
  A('🎰','1000 круток','Сделай 1000 круток',()=>S.spins,1000,20000),
  A('⚡','Первый успех','Выиграй первый апгрейд',()=>S.upw,1,1500),
  A('⚡','10 успешных апгрейдов','Выиграй 10 апгрейдов',()=>S.upw,10,8000),
  A('🔧','Мастер апгрейда','Сделай 100 апгрейдов',()=>S.ups,100,25000),
  A('📦','Первый в коллекции','Сохрани первый ник',()=>S.saved,1,1000),
  A('📦','Коллекция из 50 ников','Собери за всё время 50 ников в коллекцию',()=>S.saved,50,15000),
  A('💎','Десятитысячник','Получи ник ценой от 10 000 🪙',()=>S.bestv,10000,10000),
  A('💎','Самый дорогой ник','Получи ник ценой от 100 000 🪙',()=>S.bestv,100000,100000),
  A('✨','Первый редкий','Получи ник редкости «Редкий»',()=>S.cnt[2],1,2000),
  A('✨','Первый эпический','Получи ник редкости «Эпический»',()=>S.cnt[3],1,5000),
  A('✨','Первый легендарный','Получи ник редкости «Легендарный»',()=>S.cnt[4],1,15000),
  A('🔥','Первый мифический','Получи ник редкости «Мифический»',()=>S.cnt[5],1,50000),
  A('🕶️','Первая секретка','Получи ник редкости «Секретный»',()=>S.cnt[6],1,100000),
  A('🌸','10 эпических','Получи 10 эпических ников',()=>S.cnt[3],10,20000),
  A('💰','Первая продажа','Продай ник',()=>S.sold,1,1000),
  A('🏷️','Торговец','Продай 50 ников',()=>S.sold,50,10000),
  A('🎡','Первая рулетка','Прокрути ежедневную рулетку',()=>S.wheelN,1,1500),
  A('🎡','30 ежедневных рулеток','Прокрути ежедневную рулетку 30 раз',()=>S.wheelN,30,20000),
  A('📅','Серия 7 дней','Заходи 7 дней подряд',()=>S.maxStreak,7,8000),
  A('📅','Серия 14 дней','Заходи 14 дней подряд',()=>S.maxStreak,14,25000),
  A('✅','10 заданий','Выполни 10 заданий недели',()=>S.qn,10,10000),
  A('🪙','Миллионер','Накопи 1 000 000 🪙',()=>S.maxCoins,1000000,150000),
  A('🌙','Сутки в игре','Проведи в игре 24 часа',()=>Math.floor(S.time/3600),24,15000),
  A('🗄️','Полная коллекция',`Собери ${MAX0} из ${MAX0} ников`,()=>S.items.length,MAX0,5000),
];
const achOk=(a,i)=>S.ach.includes(i)||a.cur()>=a.goal;
const achReady=()=>ACH.map((x,i)=>i).filter(i=>achOk(ACH[i],i)&&!S.achGot.includes(i));
const achEarned=()=>S.achGot.reduce((s,i)=>s+(ACH[i]?ACH[i].r:0),0);
function claimAch(i){   // i: номер или 'all'
  const ids=i==='all'?achReady():[+i].filter(n=>ACH[n]&&achOk(ACH[n],n)&&!S.achGot.includes(n));
  if(!ids.length)return;const sum=ids.reduce((s,n)=>s+ACH[n].r,0);
  S.achGot.push(...ids);S.coins+=sum;addXp(60*ids.length);sfx(sum>=20000?'coins':'coin');save();hap('n','success');if(sum>=20000)boom('#FFC933',sum>=100000?5:4);
  toast(`Награда: +${fmt(sum)} 🪙`);render();
}
let achLock=0;
function checkAch(){
  S.maxCoins=Math.max(S.maxCoins,S.coins);
  if(busy||xbusy)return;
  const silent=!Array.isArray(S.ach);if(silent)S.ach=[];
  const fresh=[];ACH.forEach((a,i)=>{if(!S.ach.includes(i)&&a.cur()>=a.goal){S.ach.push(i);fresh.push(a)}});
  if(!fresh.length)return;save();
  if(!silent){clearTimeout(achLock);achLock=setTimeout(()=>{toast('🏆 '+fresh[0].n+(fresh.length>1?` и ещё ${fresh.length-1}`:''));hap('n','success');sfx('ach')},900)}
}

// ---------- Звуки (синтез в браузере, файлы не нужны) ----------
const SND={ctx:null,out:null,fx:null};
const NOTE=m=>440*Math.pow(2,(m-69)/12);
function ac(){
  if(!S.snd)return null;
  try{
    if(!SND.ctx){
      const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
      const c=SND.ctx=new C(),comp=c.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=4;comp.connect(c.destination);
      const out=SND.out=c.createGain();out.gain.value=.9;out.connect(comp);
      const dl=c.createDelay(1);dl.delayTime.value=.2;const fb=c.createGain();fb.gain.value=.33;const lp=c.createBiquadFilter();
      lp.type='lowpass';lp.frequency.value=2400;const send=SND.fx=c.createGain();
      send.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(out);
    }
    if(SND.ctx.state==='suspended')SND.ctx.resume();
    return SND.ctx;
  }catch(e){return null}
}
// одна нота: type — тембр, wet — доля эха, slide — во сколько раз сдвигается частота к концу
function tone(m,t,dur,o={}){
  const c=SND.ctx;if(!c)return;const f=NOTE(m),osc=c.createOscillator(),g=c.createGain();
  osc.type=o.type||'sine';osc.frequency.setValueAtTime(f,t);if(o.slide)osc.frequency.exponentialRampToValueAtTime(f*o.slide,t+dur);
  if(o.det)osc.detune.value=o.det;
  const v=o.vol||.1;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+(o.att||.008));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  osc.connect(g);g.connect(SND.out);if(o.wet){const w=c.createGain();w.gain.value=o.wet;g.connect(w);w.connect(SND.fx)}
  osc.start(t);osc.stop(t+dur+.05);
}
function whoosh(t,dur,f0,f1,vol){
  const c=SND.ctx;if(!c)return;const n=Math.floor(c.sampleRate*dur),buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const s=c.createBufferSource();s.buffer=buf;const bp=c.createBiquadFilter();bp.type='bandpass';bp.Q.value=2.2;
  bp.frequency.setValueAtTime(f0,t);bp.frequency.exponentialRampToValueAtTime(f1,t+dur);
  const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+dur*.4);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(bp);bp.connect(g);g.connect(SND.out);s.start(t);s.stop(t+dur);
}
const arp=(ms,t,step,dur,o)=>ms.forEach((m,i)=>tone(m,t+i*step,dur,o));
function sfx(name,a=0){try{sfxPlay(name,a)}catch(e){}}   // звук никогда не должен ломать игру
function sfxPlay(name,a){
  const c=ac();if(!c||!SND.out)return;const t=c.currentTime+.01;
  switch(name){
    case 'tap':tone(88,t,.05,{vol:.04});break;
    case 'tick':tone(84+(a%3)*2,t,.035,{type:'triangle',vol:.06});break;
    case 'whoosh':whoosh(t,.55,300,1800,.12);break;
    case 'land':tone(72+(a%8)*2,t,.2,{vol:.1,wet:.3});tone(84+(a%8)*2,t,.07,{type:'triangle',vol:.035});break;
    case 'sec':tone(84-(a%6)*2,t,.9,{vol:.09,wet:.8,att:.03});tone(60,t,.8,{vol:.05,att:.05});break;
    case 'myt':tone(67+a*2,t,.28,{type:'triangle',vol:.09,wet:.45,slide:1.06});whoosh(t,.22,500,2200,.05);break;
    case 'coin':tone(83,t,.12,{type:'triangle',vol:.09,wet:.3});tone(88,t+.07,.4,{type:'triangle',vol:.09,wet:.45});break;
    case 'coins':arp([83,88,91,95,100,107],t,.055,.35,{type:'triangle',vol:.07,wet:.4});break;
    case 'level':arp([72,76,79,84],t,.1,.5,{type:'triangle',vol:.09,wet:.4});tone(88,t+.4,.9,{vol:.1,wet:.6});tone(60,t,.8,{vol:.08});break;
    case 'ach':arp([79,84,88,91],t,.07,.4,{vol:.08,wet:.5});break;
    case 'lose':tone(64,t,.35,{type:'triangle',vol:.1,slide:.8});tone(57,t+.2,.5,{type:'triangle',vol:.1,slide:.78});break;
    case 'tier':{
      const k=a;
      if(k<=0)tone(72,t,.3,{vol:.1,wet:.25});
      else if(k===1)arp([72,76],t,.09,.35,{vol:.1,wet:.3});
      else if(k===2)arp([72,76,79],t,.09,.4,{vol:.1,wet:.35});
      else if(k===3){arp([72,76,79,84],t,.08,.45,{type:'triangle',vol:.1,wet:.4});tone(91,t+.34,.7,{vol:.07,wet:.6})}
      else if(k===4){arp([67,72,76,79,84,88],t,.075,.5,{type:'triangle',vol:.1,wet:.5});tone(48,t,.7,{vol:.12});tone(96,t+.5,.9,{vol:.06,wet:.7})}
      else if(k===5){tone(45,t,.9,{vol:.22,slide:.5});whoosh(t,.6,200,3000,.14);arp([60,64,67,72,76,79,84,88,91],t+.1,.07,.55,{type:'sawtooth',vol:.035,wet:.5});tone(96,t+.8,1.2,{vol:.08,wet:.8})}
      else{tone(57,t,2,{vol:.12,att:.35});tone(57.15,t,2,{vol:.12,att:.35});arp([96,91,88,84,79],t+.4,.2,1.2,{vol:.13,wet:.85});tone(36,t+1.3,1.5,{vol:.2,slide:.7})}
      break}
  }
}
document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('button,label.item');if(b&&!b.disabled&&b.id!=='spin')sfx('tap')},true);

// ---------- Эпичная сцена на весь экран: мифический (t=5) и секретный (t=6) ----------
function epic(r){
  return new Promise(res=>{
    if(reduce){res();return}
    const t=r.t,sec=t===6,chars=[...r.name],n=chars.length;
    const st=sec?1300:900,sp=sec?520:240,hold=sec?1700:1500,dur=st+(n-1)*sp+hold;
    const o=document.createElement('div');o.id='epic';o.className='ep '+(sec?'sec':'myt');
    const sz=Math.max(26,Math.min(72,Math.floor((innerWidth-48)/((n+1)*.74))));
    o.style.cssText=`--st:${st}ms;--sp:${sp}ms;--sz:${sz}px;--fd:${dur-900}ms`;
    const embers=sec?'':Array.from({length:44},()=>`<span style="left:${R(100)}%;--s:${3+R(6)}px;--d:${2200+R(2600)}ms;--dl:${R(1800)}ms;--x:${R(120)-60}px"></span>`).join('');
    o.innerHTML=`<div class="ep-bg"></div><div class="ep-rays"></div><div class="ep-ring"></div><div class="ep-ring r2"></div><div class="ep-fx">${embers}</div>
      <div class="ep-box"><div class="ep-tier">${T[t].n}</div><div class="ep-name"><span class="at" style="--i:-1">@</span>${chars.map((ch,i)=>`<span style="--i:${i}">${ch}</span>`).join('')}</div></div><div class="ep-skip">нажми, чтобы продолжить</div>`;
    document.body.append(o);
    r.epic=true;sfx('tier',t);try{hap('n','success')}catch(x){}
    const timers=[];let done=false;
    chars.forEach((_,i)=>timers.push(setTimeout(()=>{sfx(sec?'sec':'myt',i);hap('i',sec?'medium':'heavy')},st+i*sp)));
    const fin=()=>{if(done)return;done=true;timers.forEach(clearTimeout);o.classList.add('out');setTimeout(()=>{o.remove();res()},480)};
    timers.push(setTimeout(fin,dur));
    setTimeout(()=>{o.onclick=fin},900);   // пропустить можно после первой секунды
  });
}

// ---------- Уровень игрока ----------
const lvReward=l=>({c:300+l*120,e:l%5===0?7:2});
const RANKS=[[1,'Бронза','#D08A4A'],[10,'Серебро','#C5CCDB'],[20,'Золото','#FFC933'],[35,'Платина','#6FE3E0'],[50,'Алмаз','#7FA8FF']];
const rankOf=l=>{let r=RANKS[0];RANKS.forEach(x=>{if(l>=x[0])r=x});return r};
function addXp(n){
  S.xp+=n;let up=0;
  while(S.xp>=xpNeed(S.lvl)){S.xp-=xpNeed(S.lvl);S.lvl++;const r=lvReward(S.lvl);S.coins+=r.c;S.en+=r.e;up=S.lvl}
  if(up){const r=lvReward(up);setTimeout(()=>{toast(`⭐ Уровень ${up}: +${fmt(r.c)} 🪙 и +${r.e} ⚡`);sfx('level');hap('n','success');if(typeof render==='function')render()},2200)}
}
let mode=0,count=1,busy=false,cur=[],tt,sel=0,xbusy=0;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2600)}

const SEC={start:900,step:1200,dur:1000},MYT={start:350,step:260,dur:650};
function vigOn(reel){
  const v=$('#vig');try{reel.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}
  const place=()=>{const r=reel.getBoundingClientRect();v.style.setProperty('--vx',(r.left+r.width/2)+'px');v.style.setProperty('--vy',(r.top+r.height/2)+'px')};
  place();setTimeout(place,450);v.classList.add('on');
}
const vigOff=()=>$('#vig').classList.remove('on');
function build(name,animate,reel=$('#reel'),kind=0){
  reel.innerHTML='';reel.dataset.name=name;reel.classList.toggle('idle',!animate&&name.includes('?'));
  reel.style.fontSize=Math.max(14,Math.min(46,Math.floor((reel.parentElement.clientWidth-24-(name.length+1)*6)/(name.length*.94+.6))))+'px';
  const sec=kind===6&&animate&&!reduce,myt=kind===5&&animate&&!reduce;   // секретный: медленно по одному с виньеткой; мифический: короткая вспышка
  const at=document.createElement('div');at.className='at'+(sec?' sec':myt?' myt':'');at.textContent='@';reel.append(at);
  if(sec)vigOn(reel);
  [...name].forEach((ch,i)=>{
    const c=document.createElement('div'),st=document.createElement('div');c.className='cell'+(sec?' sec':myt?' myt':'');st.className='strip'+(animate&&!sec&&!myt?' go':'');c.style.setProperty('--i',i);
    const n=animate&&!sec&&!myt?12+i*3:0,chars=Array.from({length:n},()=>P(POOL));chars.push(ch);
    st.innerHTML=chars.map(x=>`<span>${x}</span>`).join('');c.append(st);reel.append(c);
    if(n){const d=reduce?1:1000+i*260;st.style.transitionDuration=d+'ms';
      requestAnimationFrame(()=>requestAnimationFrame(()=>st.style.transform=`translateY(${-n*1.5}em)`));
      setTimeout(()=>{st.classList.remove('go');c.classList.add('land');if(!reduce){hap('i','light');sfx('land',i)}},d)}
    if(myt){c.style.animationDelay=(MYT.start+i*MYT.step)+'ms';setTimeout(()=>{hap('i','light');sfx('myt',i)},MYT.start+i*MYT.step)}
    if(sec)setTimeout(()=>{c.classList.add('in');hap('i','medium');sfx('sec',i);setTimeout(()=>c.classList.remove('sec','in'),SEC.dur)},SEC.start+i*SEC.step);
  });
  if(sec){
    setTimeout(()=>at.classList.add('in'),200);setTimeout(()=>at.classList.remove('sec','in'),200+SEC.dur);
    const total=SEC.start+(name.length-1)*SEC.step+SEC.dur+250;setTimeout(vigOff,total+500);return total;
  }
  if(myt)return MYT.start+(name.length-1)*MYT.step+MYT.dur+100;
  return reduce?60:1000+(name.length-1)*260+150;
}
// показать результат на табло и включить эффекты редкости
function playStage(st,reel,r,fresh){
  const sid=st.id,rid=reel.id;
  const fx2=()=>{st=(sid&&document.getElementById(sid))||st;st.classList.add('hit');st.classList.toggle('shake',r.t>=3);st.classList.toggle('mythic',r.t===5);st.classList.toggle('secret',r.t===6)};
  if(fresh&&r.t>=5&&!reduce){
    build('??????',false,reel);
    epic(r).then(()=>{const rl=(rid&&document.getElementById(rid))||reel;build(r.name,false,rl);fx2();hap('n','success');boom(T[r.t].c,r.t)});return;
  }
  const wait=build(r.name,fresh,reel,0);
  if(fresh)setTimeout(()=>{fx2();hap('n','success');sfx('tier',r.t);if(r.t>=3)boom(T[r.t].c,r.t)},wait);else fx2();
}

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const mkRow=()=>{const d=document.createElement('div');d.className='stage rrow';d.innerHTML='<div class="reel" aria-live="polite"></div><div class="picks"></div><div class="rmeta"></div>';return d};
function showIdle(){const box=$('#reels');box.innerHTML='';const r=mkRow();box.append(r);build('??????',false,r.querySelector('.reel'));$('#idle').hidden=false}
function roll(m){let best=null;for(let i=0;i<3000;i++){const s=gen(),r=score(s);if(!best||r.t>best.t)best={name:s,...r};if(r.t>=m.min)break}return{...best,kept:false,res:''}}
function flushPrev(){const left=cur.filter(c=>!c.kept);cur.forEach(c=>c.kept=true);S.pend=null;if(left.length)toast('Прошлые ники: '+stashAll(left))}
async function spin(){
  if(busy)return;tickEn();const free=S.src==='free',m=free?MODES[0]:MODES[mode],cost=free?count:m.cost*count;
  if(free){if(S.en<cost){toast(`Не хватает энергии: нужно ${cost}, есть ${S.en}. Следующая через ${mmss(enLeft())}. Можно крутить за монеты.`);return}}
  else if(S.coins<cost){toast('Не хватает монет. Продай ники в коллекции или загляни в бонусы.');return}
  flushPrev();sfx('whoosh');addXp(10*count);busy=true;if(free){if(S.en>=EN_CAP)S.enT=Date.now();S.en-=cost}else S.coins-=cost;S.spins+=count;if(count>1)S.tri++;addQuest('spins',count);
  cur=Array.from({length:count},()=>roll(m));
  cur.forEach(c=>{S.cnt[c.t]++;S.best=Math.max(S.best,c.t);S.bestv=Math.max(S.bestv,val(c.t,c.p,c.name))});
  S.pend=cur.map(({name,t,p})=>({name,t,p}));save();
  // одна общая анимация: крутится лучший ник из выпавших, остальные видны в переключателе после неё
  sel=cur.reduce((b,c,i)=>c.t>cur[b].t||(c.t===cur[b].t&&c.p>cur[b].p)?i:b,0);
  $('#idle').hidden=true;render();
  const box=$('#reels');box.innerHTML='';const row=mkRow();box.append(row);
  const c=cur[sel],reel=row.querySelector('.reel');
  if(c.t>=5&&!reduce){build('??????',false,reel);await epic(c);build(c.name,false,reel)}
  else{await sleep(build(c.name,true,reel,0))}
  showSel(sel,true);
  busy=false;render();
}
// показать выбранный ник: fresh = сразу после анимации (эффекты и конфетти), иначе мгновенное переключение
function showSel(i,fresh){
  const row=document.querySelector('#reels .rrow');if(!row||!cur[i])return;sel=i;
  const c=cur[i],t=T[c.t],reel=row.querySelector('.reel'),meta=row.querySelector('.rmeta');
  row.style.setProperty('--tc',t.c);
  if(!fresh)build(c.name,false,reel);
  row.classList.remove('hit','shake','mythic','secret');row.classList.toggle('calm',!fresh);void row.offsetWidth;   // calm: при переключении без тряски и вспышек
  row.classList.add('hit');row.classList.toggle('shake',fresh&&c.t>=3);row.classList.toggle('mythic',c.t===5);row.classList.toggle('secret',c.t===6);
  renderPicks();renderMeta();
  requestAnimationFrame(()=>requestAnimationFrame(()=>meta.classList.add('on')));
  if(fresh){if(!c.epic)sfx('tier',c.t);if(c.t>=2)hap('n','success');if(c.t>=3)boom(t.c,c.t)}
}
function renderMeta(){
  const row=document.querySelector('#reels .rrow');if(!row)return;const c=cur[sel],t=T[c.t],meta=row.querySelector('.rmeta');
  meta.innerHTML=`<div class="badge"><i></i>${t.n}</div><div class="tags">${c.tags.map(x=>`<span class="tag">${x}</span>`).join('')}</div>
  <div class="acts">`+(c.kept
    ?`<button class="btn main" disabled>${c.res}</button>`
    :`<button class="btn main" data-ra="keep">Сохранить</button><button class="btn" data-ra="sell">Продать за ${fmt(val(c.t,c.p,c.name))} 🪙</button>`)+`</div>`;
  meta.querySelector('.acts').classList.toggle('one',c.kept);
}
function renderPicks(){
  const row=document.querySelector('#reels .rrow');if(!row)return;const pk=row.querySelector('.picks');
  pk.innerHTML=cur.length>1?cur.map((c,i)=>`<button class="pk${i===sel?' on':''}${c.kept?' done':''}" data-pk="${i}" style="--tc:${T[c.t].c}"><i></i><b>@${c.name}</b><small>${c.kept?(c.res.startsWith('Прод')?'продан':'сохранён'):T[c.t].n}</small></button>`).join(''):'';
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

const openTg=u=>tg&&tg.openTelegramLink?tg.openTelegramLink(u):window.open(u,'_blank');
async function copy(n){try{await navigator.clipboard.writeText('@'+n);toast('Скопировано: @'+n)}catch(e){toast('Не удалось скопировать. Выдели ник вручную: @'+n)}}
const ask=(msg,ok)=>{try{if(tg&&tg.showConfirm&&tg.isVersionAtLeast&&tg.isVersionAtLeast('6.2')){tg.showConfirm(msg,y=>y&&ok());return}}catch(e){}if(confirm(msg))ok()};
function addItem(n,t,p){S.items.unshift({id:Date.now()+''+R(1000),n,t,p});S.saved++}
// забрать ники в коллекцию; если места нет, продать
function stashAll(list){
  let k=0,s=0,au=0;list.forEach(c=>{
    if(S.auto&&c.t<S.auto){S.coins+=val(c.t,c.p,c.name);S.sold++;au++}
    else if(S.items.length<MAX){addItem(c.name,c.t,c.p);k++}
    else{S.coins+=val(c.t,c.p,c.name);S.sold++;s++}});
  return [k?`сохранено: ${k}`:'',au?`автопродано: ${au}`:'',s?`продано из-за полной коллекции: ${s}`:''].filter(Boolean).join(', ');
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
// ---------- Витрины: наборы ников, за каждый собранный набор награда ----------
// slots: [подпись, условие]; для сбора нужны РАЗНЫЕ ники. r: награда монетами и энергией
const SHOW=[
  {n:'Радуга редкостей',d:'По одному нику каждой редкости: от «Необычного» до «Легендарного»',c:'#FF5FA2',r:{c:80000,e:10},
    slots:[['Необычный',x=>x.t===1],['Редкий',x=>x.t===2],['Эпический',x=>x.t===3],['Легендарный',x=>x.t===4]]},
  {n:'Клуб длины',d:'Четыре ника разной длины',c:'#27D9BD',r:{c:20000,e:5},
    slots:[['5 символов',x=>x.n.length===5],['6 символов',x=>x.n.length===6],['7 символов',x=>x.n.length===7],['8+ символов',x=>x.n.length>=8]]},
  {n:'Зал элиты',d:'Самые редкие ники игры, вместе в одной коллекции',c:'#FFC933',r:{c:400000,e:20},
    slots:[['Эпический+',x=>x.t>=3],['Легендарный+',x=>x.t>=4],['Мифический',x=>x.t===5],['Секретный',x=>x.t===6]]},
];
function vMatch(slots,items){   // подбираем разные ники под слоты так, чтобы заполнить максимум
  let best=[],cnt=-1;const used=new Set(),cur=[];
  const go=k=>{
    if(k===slots.length){const c=cur.filter(Boolean).length;if(c>cnt){cnt=c;best=cur.slice()}return c===slots.length}
    for(const it of items){if(used.has(it.id)||!slots[k][1](it))continue;used.add(it.id);cur[k]=true;const done=go(k+1);used.delete(it.id);if(done)return true}
    cur[k]=false;return go(k+1);
  };
  go(0);return best.map(Boolean);
}
function showHtml(){
  return SHOW.map((v,i)=>{
    const m=vMatch(v.slots,S.items),n=m.filter(Boolean).length,tot=v.slots.length,got=S.show.includes(i),ready=n===tot&&!got;
    return `<div class="vit${got?' got':''}" style="--vc:${v.c}"><div class="vtop"><b>${v.n}</b><em>${got?'✓':n+'/'+tot}</em></div><p>${v.d}</p>
    <div class="vbar"><i style="width:${(got?1:n/tot)*100}%"></i></div>
    <div class="vchips">${v.slots.map((s,k)=>`<span class="vchip${got||m[k]?' ok':''}">${got||m[k]?'✓':'🔒'} ${s[0]}</span>`).join('')}</div>
    <div class="vrw"><span><b>Награда:</b> ${fmt(v.r.c)} 🪙, +${v.r.e} ⚡</span>${got?'<em>Получено ✓</em>':ready?`<button class="btn main sm" data-a="vclaim" data-i="${i}">Забрать</button>`:''}</div></div>`}).join('');
}
const showReady=()=>SHOW.filter((v,i)=>!S.show.includes(i)&&vMatch(v.slots,S.items).every(Boolean)).length;
function showPlate(){
  const r=showReady(),d=S.show.length;
  return `<button class="pcard achbtn" id="show-open" style="margin-bottom:16px"><div><b>Витрины</b><small>Собрано ${d} из ${SHOW.length}${r?` · наград к получению: ${r}`:''}</small></div><span class="mini" style="--p:${d/SHOW.length*100}"><i>${d}</i></span></button>`;
}
function renderShow(){
  setHtml($('#tab-show'),`<div class="ahead"><button class="btn sm" id="show-back">‹ Коллекция</button><h2>Витрины</h2></div><p class="sum">Собери набор из ников коллекции и забери награду. Ники не тратятся, награда выдаётся один раз.</p>`+showHtml());
}
function claimShow(i){
  const v=SHOW[i];if(!v||S.show.includes(i))return;
  if(vMatch(v.slots,S.items).filter(Boolean).length<v.slots.length){toast('Набор ещё не собран');return}
  S.show.push(i);S.coins+=v.r.c;S.en+=v.r.e;addXp(150);sfx('coins');save();hap('n','success');boom(v.c,5);
  toast(`Витрина «${v.n}»: +${fmt(v.r.c)} 🪙 и +${v.r.e} ⚡`);render();
}
const totalV=its=>its.reduce((x,y)=>x+val(y.t,y.p,y.n),0);
function colPanel(){
  const n=S.items.length,full=S.slots>=MAXSLOTS,pr=slotPrice(S.slots);
  return `<div class="cpanel"><div class="ctop"><div><b>${n}</b> <span>из ${S.slots}</span><small>мест занято</small></div><div class="r"><b>${fmt(totalV(S.items))} 🪙</b><small>стоимость ников</small></div></div>
  <div class="cbar"><i style="width:${n/S.slots*100}%"></i></div>
  <button class="btn cwide" data-a="buy"${full?' disabled':''}>${full?'Максимум мест':`+ Купить место · ${fmt(pr)} 🪙`}</button>
  <button class="btn cwide" data-a="cheap">Продать дешёвые</button>
  <button class="crow" data-a="auto"><span>Автопродажа</span><b>${AUTO[S.auto]} ›</b></button></div>`;
}
function renderCol(){
  const col=$('#tab-col'),its=[...S.items].sort((a,b)=>b.t-a.t);
  if(colSel)colSel=new Set([...colSel].filter(id=>S.items.some(i=>i.id===id)));
  let h=colPanel()+showPlate();
  if(!its.length){colSel=null;h+=`<div class="empty">Коллекция пуста.<br>Крути рулетку и забирай понравившиеся ники.<br><button class="btn" data-go="game">К рулетке</button></div>`}
  else h+=`<div class="chead"><div><h2>Мои ники</h2></div>`+
    (colSel?`<div class="cbtns"><button class="btn sm" data-a="all">Все</button><button class="btn sm" data-a="cancel">Отмена</button></div>`:`<button class="btn sm" data-a="selmode">Выбрать</button>`)+`</div>`+
    its.map(x=>{const sub=`<small>${T[x.t].n}</small>`,pr=fmt(val(x.t,x.p,x.n));
      return colSel?`<label class="item pick" style="--tc:${T[x.t].c}"><input type="checkbox" data-cs="${x.id}"${colSel.has(x.id)?' checked':''}><div><b>@${x.n}</b>${sub}</div><span>${pr} 🪙</span></label>`
      :`<div class="item" style="--tc:${T[x.t].c}"><div><b>@${x.n}</b>${sub}</div><button data-a="copy" data-id="${x.id}" aria-label="Копировать">⧉</button><button data-a="sell" data-id="${x.id}" aria-label="Продать">${pr} 🪙</button></div>`}).join('');
  setHtml(col,h);updSelbar();
}
function render(){
  setCoins();
  ensureQuests();updBonDot();checkAch();
  tickEn();const free=S.src==='free',m=free?MODES[0]:MODES[mode],seg=$('#seg'),cn=$('#cnt'),sr=$('#src');
  if(!sr.firstChild)sr.innerHTML='<button aria-pressed="false" data-s="free">⚡ Бесплатно</button><button aria-pressed="false" data-s="coin">🪙 За монеты</button>';
  [...sr.children].forEach(b=>b.setAttribute('aria-pressed',b.dataset.s===S.src));seg.hidden=free;$('#en').hidden=!free;updEn();
  if(!seg.firstChild)seg.innerHTML=MODES.map((x,i)=>`<button aria-pressed="false" data-m="${i}">${x.l}<small>${fmt(x.cost)} 🪙</small></button>`).join('');
  if(!cn.firstChild)cn.innerHTML=[1,3].map(n=>`<button aria-pressed="false" data-n="${n}">×${n}<small>${n===1?'один ник':'три ника'}</small></button>`).join('');
  [...seg.children].forEach((b,i)=>b.setAttribute('aria-pressed',i===mode));
  [...cn.children].forEach(b=>b.setAttribute('aria-pressed',+b.dataset.n===count));
  const sp=$('#spin');sp.textContent=`Крутить${count>1?' ×'+count:''} · ${free?count+' ⚡':fmt(m.cost*count)+' 🪙'}`;sp.disabled=busy;
  $('#st-spins').textContent=`Круток: ${fmt(S.spins)}`;
  $('#st-best').innerHTML=`Лучший: <b class="chip" style="background:${T[S.best].c}">${S.spins?T[S.best].n:'—'}</b>`;
  renderCol();
  if(!$('#tab-prof').hidden)renderProf();
  if(!$('#tab-bon').hidden)renderBon();
  if(!$('#tab-ach').hidden)renderAch();
  if(!$('#tab-show').hidden)renderShow();
  if(!$('#tab-up').hidden)setTimeout(renderUp,0);
}

$('#spin').onclick=spin;
$('#src').onclick=e=>{const b=e.target.closest('[data-s]');if(b&&!busy&&S.src!==b.dataset.s){S.src=b.dataset.s;save();render()}};
$('#seg').onclick=e=>{const b=e.target.closest('[data-m]');if(b&&!busy){mode=+b.dataset.m;render()}};
$('#cnt').onclick=e=>{const b=e.target.closest('[data-n]');if(b&&!busy){count=+b.dataset.n;render()}};
$('#reels').onclick=e=>{
  const pk=e.target.closest('[data-pk]');
  if(pk){if(!busy&&+pk.dataset.pk!==sel)showSel(+pk.dataset.pk,false);return}
  const b=e.target.closest('[data-ra]');if(!b||b.disabled||busy)return;
  const c=cur[sel];if(!c||c.kept)return;
  if(b.dataset.ra==='keep'){
    if(S.items.length>=MAX){toast(`Коллекция заполнена (${MAX}/${MAX}). Продай ник или освободи место.`);return}
    addItem(c.name,c.t,c.p);c.kept=true;c.res='Сохранено ✓';addQuest('save',1);addXp(3);hap('i','medium');
  }else{const v=val(c.t,c.p,c.name);S.coins+=v;S.sold++;c.kept=true;c.res=`Продано за ${fmt(v)} 🪙`;addQuest('sell',1);addXp(2);sfx('coin')}
  S.pend=cur.filter(x=>!x.kept).map(({name,t,p})=>({name,t,p}));save();renderPicks();renderMeta();render();
};
$('#tab-col').onclick=e=>{
  const g=e.target.closest('[data-go]');if(g)return tab(g.dataset.go);
  if(e.target.closest('#show-open'))return tab('show');
  const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
  if(a==='buy'){
    if(S.slots>=MAXSLOTS)return;const pr=slotPrice(S.slots);
    if(S.coins<pr){toast(`Не хватает монет: нужно ${fmt(pr)} 🪙`);return}
    ask(`Купить место №${S.slots+1} за ${fmt(pr)} 🪙?`,()=>{if(S.coins<pr||S.slots>=MAXSLOTS)return;S.coins-=pr;S.slots++;MAX=S.slots;addXp(40);sfx('coin');save();hap('n','success');toast(`Новое место! Теперь мест: ${S.slots}`);render()});return}
  if(a==='auto'){S.auto=(S.auto+1)%AUTO.length;save();toast(S.auto?`Автопродажа: ники ${AUTO[S.auto]} будут продаваться сами, когда ты не сохранил их после крутки`:'Автопродажа выключена');renderCol();return}
  if(a==='cheap'){
    const lim=S.auto||2,its=S.items.filter(i=>i.t<lim);
    if(!its.length){toast(`Нет ников ${AUTO[lim]}`);return}
    const sum=totalV(its);
    ask(`Продать ${its.length} ${pl(its.length)} (${AUTO[lim]}) за ${fmt(sum)} 🪙?`,()=>{const ids=new Set(its.map(i=>i.id));S.items=S.items.filter(i=>!ids.has(i.id));S.coins+=sum;S.sold+=its.length;addQuest('sell',its.length);addXp(2*its.length);sfx('coins');colSel=null;save();toast(`Продано: ${its.length} ${pl(its.length)} за ${fmt(sum)} 🪙`);render()});return}
  if(a==='selmode'){if(!S.items.length)return;colSel=new Set();renderCol();return}
  if(a==='cancel'){colSel=null;renderCol();return}
  if(a==='all'){colSel=colSel.size===S.items.length?new Set():new Set(S.items.map(i=>i.id));renderCol();return}
  const x=S.items.find(i=>i.id===b.dataset.id);if(!x)return;
  if(a==='copy')copy(x.n);
  else if(a==='sell'){const v=val(x.t,x.p,x.n);
    ask(`Продать @${x.n} за ${fmt(v)} 🪙?`,()=>collapse([b.closest('.item')],()=>{if(!S.items.includes(x))return;S.items=S.items.filter(i=>i!==x);S.coins+=v;S.sold++;addQuest('sell',1);addXp(2);sfx('coin');save();toast(`Продано за ${fmt(v)} 🪙`);render()}))}
};
$('#tab-col').onchange=e=>{const i=e.target.closest('[data-cs]');if(!i||!colSel)return;i.checked?colSel.add(i.dataset.cs):colSel.delete(i.dataset.cs);updSelbar()};
$('#selsell').onclick=()=>{
  if(!colSel||!colSel.size)return;
  const its=S.items.filter(i=>colSel.has(i.id)),sum=its.reduce((a,x)=>a+val(x.t,x.p,x.n),0);
  ask(`Продать ${its.length} ${pl(its.length)} за ${fmt(sum)} 🪙?`,()=>{
    const els=[...document.querySelectorAll('#tab-col .item')].filter(el=>el.querySelector('input:checked'));
    $('#selbar').classList.remove('on');
    collapse(els,()=>{const ids=new Set(its.map(i=>i.id));S.items=S.items.filter(i=>!ids.has(i.id));S.coins+=sum;S.sold+=its.length;colSel=null;addQuest('sell',its.length);addXp(2*its.length);sfx('coins');save();toast(`Продано: ${its.length} ${pl(its.length)} за ${fmt(sum)} 🪙`);render()});
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
function pickPrize(s){
  const target=.9*s.v/(up.c/100),ok=prizePool().filter(x=>x.price>s.v);
  if(!ok.length){up.prize=null;return}
  const dist=x=>Math.abs(x.price-target),best=Math.min(...ok.map(dist));
  const near=ok.filter(x=>dist(x)<=best+Math.max(2,target*.03));
  up.prize=near.reduce((a,x)=>dist(x)<dist(a)?x:a);
}
// win: undefined = превью, true/false = исход для ячейки под указателем
const rlCells=(ch,win)=>Array.from({length:RL.n},(_,i)=>{const w=i===RL.idx&&win!==undefined?win:Math.random()<ch;return `<b class="rc ${w?'w':'l'}">${w?'✓':'✕'}</b>`}).join('');
// плавно ведём число (и, при thumb, ползунок) до процента, который подобрался автоматически
let pctRaf=0;
function tweenPct(from,to,thumb){
  cancelAnimationFrame(pctRaf);const out=$('#ch-out'),sl=$('#chs');if(!out)return;
  const setv=v=>{out.textContent=v+'%';if(thumb&&sl)sl.value=v};
  if(reduce||from===to){setv(to);return}
  const t0=performance.now(),d=Math.min(1000,300+Math.abs(to-from)*20);
  const st=n=>{const k=Math.min(1,(n-t0)/d),e=1-Math.pow(1-k,3);setv(Math.round(from+(to-from)*e));if(k<1)pctRaf=requestAnimationFrame(st)};
  pctRaf=requestAnimationFrame(st);
}
function fillUp(thumb=true){
  const s=stake(),pr=up.prize,ok=s.its.length&&pr,ch=ok?chanceOf(s,pr):0,col=ok?T[pr.t].c:'#6A63B0';
  const out=$('#ch-out');
  if(ok){const sl=$('#chs'),to=Math.round(ch*100),from=thumb?+sl.value:(parseInt(out.textContent)||+sl.value);tweenPct(from,to,thumb);if(thumb)up.c=to}
  else{cancelAnimationFrame(pctRaf);out.textContent='—'}
  $('#prize').innerHTML=ok?`<div class="pz" style="--tc:${col}"><div><small>Выпадет</small><b>@${pr.name}</b><em>${T[pr.t].n}</em></div><div class="pp"><small>Цена</small><b>${fmt(pr.price)} 🪙</b></div></div>`
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
  h+=`<div class="upres">${up.msg}${up.res?`<div class="stage" id="upstage" style="--tc:${T[up.res.t].c}"><div class="reel" id="upreel"></div><div class="badge"><i></i>${T[up.res.t].n}</div></div>`:''}</div>`;
  const oldSt=el.querySelector('.stake'),top=oldSt?oldSt.scrollTop:0;el.innerHTML=h;{const n=el.querySelector('.stake');if(n)n.scrollTop=top}fillUp();
  if(up.res){const fresh=up.fresh;up.fresh=false;playStage($('#upstage'),$('#upreel'),up.res,fresh)}
}
async function doUp(){
  const s=stake(),pr=up.prize;if(up.busy||!pr||!s.its.length)return;
  const ch=chanceOf(s,pr),won=Math.random()<ch;
  if(s.its.length>=UPMAX)S.five=1;
  up.busy=true;xbusy=1;up.res=null;up.msg='';
  document.querySelectorAll('#tab-up button,#tab-up input').forEach(e=>e.disabled=true);
  const rl=$('#rl'),trk=$('#rlt'),W=rl.clientWidth,pitch=RL.w+RL.gap,off=(Math.random()-.5)*RL.w*.7,dur=reduce?50:4800;
  trk.style.transition='none';trk.style.transform='translateX(0)';trk.innerHTML=rlCells(ch,won);void trk.offsetWidth;
  trk.style.transition=`transform ${dur}ms cubic-bezier(.08,.6,.12,1)`;
  trk.style.transform=`translateX(${W/2-(RL.idx*pitch+RL.w/2+off)}px)`;
  if(!reduce){let last=-1,lt=0;const t0=performance.now();
    (function tk(){const x=new DOMMatrix(getComputedStyle(trk).transform).m41,i=Math.floor((W/2-x)/pitch),now=performance.now();
      if(i!==last&&now-lt>70){last=i;lt=now;hap('i','light');sfx('tick',i)}
      if(now-t0<dur)requestAnimationFrame(tk)})()}
  await new Promise(r=>setTimeout(r,dur+250));
  trk.children[RL.idx].classList.add('on');
  await new Promise(r=>setTimeout(r,reduce?0:700));
  S.items=S.items.filter(i=>!up.sel.has(i.id));S.ups++;addQuest('ups',1);addXp(won?85:25);
  if(won){
    S.upw++;if(ch<=.1)S.luck=1;S.cnt[pr.t]++;S.bestv=Math.max(S.bestv,pr.price);addItem(pr.name,pr.t,pr.p);
    up.res={name:pr.name,t:pr.t,p:pr.p};up.fresh=true;
    up.msg=`<div class="win" style="--tc:${T[pr.t].c}"><b>Успех!</b> Шанс был ${Math.round(ch*100)}%, ник уже в коллекции.</div>`;
  }else{up.msg=`<div class="lose"><b>Не вышло.</b> Ставка сгорела, шанс был ${Math.round(ch*100)}%.</div>`;hap('n','error');sfx('lose')}
  up.sel.clear();up.prize=null;up.busy=false;xbusy=0;save();render();
}
$('#tab-up').onclick=e=>{
  const g=e.target.closest('[data-go]');if(g)return tab(g.dataset.go);
  if(up.busy)return;
  if(e.target.id==='do-up')doUp();
};
$('#tab-up').onchange=e=>{
  if(e.target.id==='chs'&&!up.busy){const s=stake();if(s.its.length&&up.prize)fillUp(true);return}   // отпустили ползунок: он плавно встаёт на подобранный процент
  const i=e.target.closest('[data-sel]');if(!i||up.busy)return;
  if(i.checked){if(up.sel.size>=UPMAX){i.checked=false;toast(`Максимум ${UPMAX} ников в ставке`);return}up.sel.add(i.dataset.sel)}else up.sel.delete(i.dataset.sel);
  up.msg='';up.res=null;up.prize=null;renderUp();
};
$('#tab-up').oninput=e=>{if(e.target.id!=='chs'||up.busy)return;up.c=+e.target.value;const s=stake();if(s.its.length){pickPrize(s);fillUp(false)}};

// ---------- Профиль ----------
const TN=['Обычных','Необычных','Редких','Эпических','Легендарных','Мифических','Секретных'];
const fmtT=s=>{const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h} ч ${m} мин`:m?`${m} мин`:`${s%60} сек`};
const todaySec=()=>S.tday.d===new Date().toDateString()?S.tday.s:0;
const idStr=()=>{const a=String(S.uid).padStart(6,'0');return a.slice(0,3)+' '+a.slice(3)};
const tgUser=()=>(tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user)||{};
function renderProf(){
  const u=tgUser(),name=u.first_name||'Игрок',need=xpNeed(S.lvl),pct=S.xp/need*100,rk=rankOf(S.lvl),nx=RANKS.find(x=>x[0]>S.lvl),nr=lvReward(S.lvl+1);
  const av=u.photo_url?`<img src="${u.photo_url}" alt="" onerror="this.remove()">`:'';
  const doneV=S.show.length;
  $('#tab-prof').innerHTML=`<h2 class="ptitle">Профиль</h2>
  <div class="pcard pro"><div class="ptop"><div class="av" style="--p:${pct}"><span class="avi">${av}<b>${name.slice(0,1).toUpperCase()}</b></span><em class="lvb">${S.lvl}</em></div>
    <div class="pnm"><b class="pname">${name}</b><span class="rank" style="--rc:${rk[2]}">🛡 ${rk[1]}</span>${nx?`<small>до «${nx[1]}»: ${nx[0]} ур.</small>`:'<small>Высший ранг</small>'}</div></div>
  <div class="pid idc"><span class="idtag">ID</span><b>${idStr()}</b><button id="idcopy" aria-label="Скопировать ID">⧉</button></div>
  <div class="lvrow"><b>Уровень ${S.lvl}</b><small>${fmt(S.xp)} / ${fmt(need)} опыта</small></div>
  <div class="xbar"><i style="width:${pct}%"></i></div>
  <div class="path"><span class="pi">🧭</span><b>Путь игрока</b><small>${S.lvl+1} ур.: +${fmt(nr.c)} 🪙 и +${nr.e} ⚡</small></div>
  <div class="tri"><div><small>Капитал</small><b>${fmt(S.coins)} 🪙</b></div><div><small>Коллекция</small><b>${S.items.length} из ${S.slots}</b></div><div><small>Витрины</small><b>${doneV} из ${SHOW.length}</b></div></div></div>
  <div class="pcard sndrow"><div><b>Звуки</b><small>Эффекты рулетки, наград и колеса</small></div><button class="sw${S.snd?' on':''}" id="snd-tg" role="switch" aria-checked="${S.snd}" aria-label="Звуки"><i></i></button></div>
  <div class="pcard inv"><div><b>Позвать друзей</b><small>Отправь друзьям ссылку на игру</small></div><button class="btn main" id="invite">Позвать</button></div>
  <div class="pcard"><h3>Статистика</h3>
    <div class="pgrid"><div class="pt"><small>Круток</small><b>${fmt(S.spins)}</b></div><div class="pt"><small>Удачных апгрейдов</small><b>${fmt(S.upw)}</b></div>
    <div class="pt"><small>В игре за всё время</small><b id="tm-all">${fmtT(S.time)}</b></div><div class="pt"><small>В игре сегодня</small><b id="tm-day">${fmtT(todaySec())}</b></div></div>
    <div class="pgrid tiers">${T.map((t,i)=>`<div class="pt${i===6?' last':''}" style="--tc:${t.c}"><small>${TN[i]}</small><b>${fmt(S.cnt[i])}</b></div>`).join('')}</div></div>
  <button class="pcard achbtn" id="ach-open"><div><b>Достижения</b><small>Открыто ${ACH.filter(achOk).length} из ${ACH.length}${achReady().length?` · наград к получению: ${achReady().length}`:''}</small></div><span class="mini" style="--p:${ACH.filter(achOk).length/ACH.length*100}"><i>${ACH.filter(achOk).length}</i></span></button>`;
}
setInterval(()=>{
  if(document.hidden)return;
  if(tickEn())save();if(!$('#tab-game').hidden)updEn();
  const d=new Date().toDateString();if(S.tday.d!==d)S.tday={d,s:0};
  S.time++;S.tday.s++;if(S.time%10===0)save();
  if(!$('#tab-prof').hidden){const a=$('#tm-all'),b=$('#tm-day');if(a){a.textContent=fmtT(S.time);b.textContent=fmtT(todaySec())}}
  if(!$('#tab-bon').hidden)updTimers();
  const kk=todayK()+weekK();if(kk!==lastK){lastK=kk;ensureQuests();render()}
},1000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){save();if(cloudDone)cloudPush()}});
addEventListener('pagehide',()=>{save();if(cloudDone)cloudPush()});
$('#tab-prof').onclick=e=>{
  if(e.target.closest('#ach-open'))return tab('ach');
  if(e.target.closest('#snd-tg')){S.snd=!S.snd;save();renderProf();if(S.snd){sfx('ach')}return}
  if(e.target.closest('#idcopy')){(async()=>{try{await navigator.clipboard.writeText(String(S.uid).padStart(6,'0'));toast('ID скопирован')}catch(x){toast('Не удалось скопировать ID')}})();return}
  if(e.target.id!=='invite')return;
  addQuest('invite',1);S.inv=1;save();
  const base=APP_LINK||location.href.split('#')[0].split('?')[0];
  openTg(`https://t.me/share/url?url=${encodeURIComponent(base)}&text=${encodeURIComponent('Заходи в Нейм-рулетку: выбивай редкие юзернеймы и собирай коллекцию!')}`);
};
function renderAch(){
  const n=ACH.filter(achOk).length,tot=ACH.length,C=2*Math.PI*54,rd=achReady().length,got=achEarned();
  const near=ACH.map((x,i)=>({x,i,ok:achOk(x,i)})).filter(o=>!o.ok).sort((p,q)=>Math.min(q.x.cur()/q.x.goal,1)-Math.min(p.x.cur()/p.x.goal,1))[0];
  const rank=o=>o.ok&&!S.achGot.includes(o.i)?0:!o.ok?1:2;
  const list=ACH.map((x,i)=>({x,i,ok:achOk(x,i)})).sort((a,b)=>rank(a)-rank(b)||a.i-b.i);
  const h=`<div class="ahead"><button class="btn sm" id="ach-back">‹ Профиль</button><h2>Достижения</h2></div>
  <div class="asum"><div class="ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" class="rb"/><circle cx="60" cy="60" r="54" class="rf" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-n/tot)}"/></svg><div><b>${n}</b><small>из ${tot}</small></div></div>
    <div class="ainfo"><small class="cap2">Получено наград</small><b class="big">${fmt(got)} 🪙</b><div class="chips"><span class="chip2">🏆 ${n} открыто</span><span class="chip2">🔒 ${tot-n} осталось</span></div>${near?`<p>Ближайшее: ${near.x.n}, ${fmt(Math.min(near.x.cur(),near.x.goal))} из ${fmt(near.x.goal)}</p>`:'<p>Все достижения открыты!</p>'}</div></div>
  ${rd?`<button class="btn main cwide" data-claim="all">Забрать все награды · +${fmt(achReady().reduce((s,i)=>s+ACH[i].r,0))} 🪙</button>`:''}
  <div class="alist">`+list.map(({x,i,ok})=>{const c=Math.min(x.cur(),x.goal),cl=S.achGot.includes(i);
    const side=ok&&!cl?`<button class="btn main sm arw" data-claim="${i}">+${fmt(x.r)} 🪙</button>`:`<span class="arw${cl?' got':''}">${cl?'✓ ':''}+${fmt(x.r)} 🪙</span>`;
    return `<div class="ach${ok?' on':''}"><span class="ai">${x.i}</span><div class="at2"><b>${x.n}</b><small>${x.d}</small>${x.goal>1?`<div class="qbar"><i style="width:${(ok?1:c/x.goal)*100}%"></i></div><em>${ok?'Выполнено ✓':fmt(c)+' / '+fmt(x.goal)}</em>`:`<em>${ok?'Выполнено ✓':'Не выполнено'}</em>`}</div>${side}</div>`}).join('')+`</div>`;
  setHtml($('#tab-ach'),h);
}
$('#tab-show').onclick=e=>{if(e.target.closest('#show-back'))return tab('col');const b=e.target.closest('[data-a="vclaim"]');if(b)claimShow(+b.dataset.i)};
$('#tab-ach').onclick=e=>{if(e.target.closest('#ach-back'))return tab('prof');const b=e.target.closest('[data-claim]');if(b)claimAch(b.dataset.claim)};
$('#prof-btn').onclick=()=>tab($('#tab-prof').hidden?'prof':'game');

function tab(n){
  document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===(n==='show'?'col':n)));
  ['game','col','up','prof','bon','ach','show'].forEach(k=>{const e=$('#tab-'+k);
    if(k===n){if(e.hidden){e.hidden=false;e.classList.remove('tabin');void e.offsetWidth;e.classList.add('tabin')}}else e.hidden=true});
  $('#prof-btn').setAttribute('aria-pressed',n==='prof');
  $('#bon-btn').setAttribute('aria-pressed',n==='bon');
  if(n!=='col')colSel=null;
  if(n==='col')renderCol();else updSelbar();
  if(n==='up')renderUp();
  if(n==='prof')renderProf();
  if(n==='bon')renderBon();
  if(n==='ach')renderAch();
  if(n==='show')renderShow();
  scrollTo(0,0);
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
// ---------- Бонусы: вкладка ----------
const bon={busy:false,res:null,ang:0,win:-1,fresh:false};
// ---------- Колесо ежедневной рулетки ----------
const WN=WHEEL.length,WSL=360/WN;
const wpt=(deg,r)=>{const a=deg*Math.PI/180;return [(r*Math.sin(a)).toFixed(2),(-r*Math.cos(a)).toFixed(2)]};
const wcol=p=>p.k==='n'?T[p.t].c:['#FFD866','#FFC933','#FFB62E','#FFA526','#FF9419','#FF7F11'][Math.min(5,Math.max(0,['5000','10000','20000','35000','50000','100000'].indexOf(String(p.v))))];
function wheelHtml(){
  const segs=WHEEL.map((p,i)=>{
    const a0=i*WSL,a1=a0+WSL,m=a0+WSL/2,[x0,y0]=wpt(a0,88),[x1,y1]=wpt(a1,88),col=wcol(p),isN=p.k==='n';
    const big=isN&&p.t===6?'#fff':col;
    return `<g class="ws${bon.win===i?' won':''}"><path d="M0,0 L${x0},${y0} A88,88 0 0 1 ${x1},${y1} Z" fill="${col}" stroke="#0D0B1A" stroke-width="1.5"/>`+
      `<text transform="rotate(${m}) translate(0,-60)" text-anchor="middle" class="wl1${isN?' tn':''}">${isN?T[p.t].s:wlab(p)}</text>`+
      `<text transform="rotate(${m}) translate(0,-47)" text-anchor="middle" class="wl2">${isN?'ник':'монет'}</text></g>`;
  }).join('');
  const lights=Array.from({length:20},(_,i)=>{const [x,y]=wpt(i*18+9,94);return `<circle class="lt" cx="${x}" cy="${y}" r="2.6"/>`}).join('');
  return `<div class="wheel${bon.busy?' spinning':''}${bon.win>=0?' haswin':''}" id="wheel"><i class="wptr" id="wptr"></i>
    <div class="wrot" id="wrot" style="transform:rotate(${bon.ang}deg)"><svg viewBox="-100 -100 200 200"><circle r="99" fill="#241F4A" stroke="#4B4399" stroke-width="2"/>${lights}${segs}<circle r="12" fill="#0D0B1A"/></svg></div><div class="whub">🎁</div></div>`;
}
const wlab=p=>p.k==='c'?(p.v>=1000?p.v/1000+'K':p.v):'';
const wpick=()=>{let r=Math.random()*WTOT;for(const p of WHEEL){r-=p.w;if(r<0)return p}return WHEEL[0]};
const kfmt=r=>r>=1000?r/1000+'K':String(r);
function wresHtml(){
  const r=bon.res;if(!r)return '';
  if(r.k==='c')return `<div class="win" style="--tc:#FFC933"><b>+<span class="cu" data-to="${r.v}">${fmt(r.v)}</span> 🪙</b> Монеты уже на балансе.</div>`;
  return `<div class="stage" id="wstage" style="--tc:${T[r.t].c}"><div class="reel" id="wreel"></div><div class="badge"><i></i>${T[r.t].n}</div></div>`+
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
    ${wheelHtml()}<p class="sum" hidden>${fmt(Math.min(...WHEEL.filter(p=>p.k==='c').map(p=>p.v)))} до ${fmt(Math.max(...WHEEL.filter(p=>p.k==='c').map(p=>p.v)))} 🪙 и ники от «${T[Math.min(...WHEEL.filter(p=>p.k==='n').map(p=>p.t))].n}» до «${T[Math.max(...WHEEL.filter(p=>p.k==='n').map(p=>p.t))].n}».</p>`+
    (can?`<button class="spin" data-b="wheel">Крутить рулетку</button>`:`<button class="spin" disabled>Уже крутили · ещё <span data-t="day"></span></button>`)+
    `<div class="upres">${wresHtml()}</div></div>`;
  h+=`<div class="pcard"><div class="bhead"><h3>Задания недели</h3><span class="bsub">обновятся через <span data-t="week"></span></span></div>`+
    S.q.list.map((q,i)=>{const d=QDEF[q.id],ok=q.p>=q.n;
      return `<div class="quest${q.got?' got':''}"><div class="qtop"><b>${d.t(q.n)}</b><span>${fmt(d.r)} 🪙</span></div>${d.h?`<small class="qh">${d.h}</small>`:''}<div class="qbar"><i style="width:${q.p/q.n*100}%"></i></div>`+
      `<div class="qbot"><small>${q.p} / ${q.n}</small>${q.got?'<em>Получено ✓</em>':ok?`<button class="btn main sm" data-b="quest" data-i="${i}">Забрать</button>`:''}</div></div>`}).join('')+`</div>`;
  if(el._h!==h){
    el.innerHTML=h;el._h=h;
    const fr=bon.fresh;bon.fresh=false;
    if(bon.res&&bon.res.k==='n')playStage($('#wstage'),$('#wreel'),bon.res,fr);
    else if(fr)document.querySelectorAll('#tab-bon .cu').forEach(el=>{const to=+el.dataset.to,t0=performance.now();if(reduce)return;const st=n=>{const k=Math.min(1,(n-t0)/1400);el.textContent=fmt(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(st)};st(t0)});
  }
  updTimers();
}
function claimLogin(){
  const i=loginInfo();if(i.done)return;
  const r=LOGIN[i.idx];S.login={n:i.n+1,last:todayK()};S.maxStreak=Math.max(S.maxStreak,S.login.n);S.coins+=r;S.en+=5;addXp(30);sfx(r>=10000?'coins':'coin');save();
  toast(`День ${i.idx+1}: +${fmt(r)} 🪙 и +5 ⚡`);hap('n','success');if(r>=20000)boom('#FFC933',4);render();
}
function claimQuest(i){
  const q=S.q.list[i];if(!q||q.got||q.p<q.n)return;
  const r=QDEF[q.id].r;q.got=true;S.qn++;S.coins+=r;S.en+=3;addXp(80);sfx('coin');save();toast(`Задание выполнено: +${fmt(r)} 🪙 и +3 ⚡`);hap('n','success');render();
}
async function doWheel(){
  if(bon.busy||S.wheel===todayK())return;
  const win=wpick(),k=WHEEL.indexOf(win),pick=win.k==='n'?P(prizePool().filter(x=>x.t===win.t)):null;
  // приз выдаём сразу (чтобы закрытие приложения не отменило крутку), показываем после анимации
  S.wheel=todayK();S.wheelN++;addQuest('wheel',1);addXp(25);
  let res;
  if(win.k==='c'){S.coins+=win.v;res={k:'c',v:win.v}}
  else{
    S.cnt[pick.t]++;S.bestv=Math.max(S.bestv,pick.price);
    if(S.items.length<MAX){addItem(pick.name,pick.t,pick.p);res={k:'n',name:pick.name,t:pick.t,p:pick.p,saved:true}}
    else{const v=val(pick.t,pick.p,pick.name);S.coins+=v;S.sold++;res={k:'n',name:pick.name,t:pick.t,p:pick.p,saved:false,v}}
  }
  save();
  bon.busy=true;xbusy=1;bon.res=null;bon.win=-1;
  document.querySelectorAll('#tab-bon button').forEach(b=>b.disabled=true);
  const wh=$('#wheel'),rot=$('#wrot'),ptr=$('#wptr');
  const jit=(Math.random()-.5)*WSL*.7,c=k*WSL+WSL/2;
  const fin=Math.ceil(bon.ang/360)*360+360*(5+R(2))-c+jit,dur=reduce?60:6400;
  wh.classList.add('spinning');
  rot.style.transition=`transform ${dur}ms cubic-bezier(.12,.72,.08,1)`;void rot.offsetWidth;
  rot.style.transform=`rotate(${fin}deg)`;
  if(!reduce){let last=-1;const t0=performance.now();
    (function tk(){
      let deg=NaN;try{const m=new DOMMatrix(getComputedStyle(rot).transform);deg=Math.atan2(m.b,m.a)*180/Math.PI}catch(e){}
      if(isFinite(deg)){const idx=Math.floor((((-deg%360)+360)%360)/WSL);
        if(idx!==last){if(last>=0){ptr.classList.remove('tk');void ptr.offsetWidth;ptr.classList.add('tk');hap('i','light');sfx('tick',idx)}last=idx}}
      if(performance.now()-t0<dur+100)requestAnimationFrame(tk)})();
  }
  await sleep(dur+150);
  bon.ang=fin;bon.win=k;wh.classList.remove('spinning');wh.classList.add('haswin');
  const ws=wh.querySelectorAll('.ws')[k];if(ws)ws.classList.add('won');
  hap('n','success');if(win.k==='c')sfx(win.v>=20000?'coins':'coin');if(!reduce)boom(wcol(win),win.k==='n'?Math.max(3,win.t):win.v>=50000?5:win.v>=20000?4:3);
  await sleep(reduce?0:900);
  bon.res=res;bon.fresh=true;bon.busy=false;xbusy=0;render();
}
$('#tab-bon').onclick=e=>{
  const b=e.target.closest('[data-b]');if(!b||b.disabled||bon.busy)return;
  if(b.dataset.b==='login')claimLogin();else if(b.dataset.b==='wheel')doWheel();else if(b.dataset.b==='quest')claimQuest(+b.dataset.i);
};
$('#bon-btn').onclick=()=>tab($('#tab-bon').hidden?'bon':'game');
renderUp();
cloudLoad();
