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
const T=[{n:'Обычный',c:'#9AA5DB',v:390},{n:'Необычный',c:'#27D9BD',v:1470},{n:'Редкий',c:'#9B7BFF',v:4800},{n:'Эпический',c:'#FF5FA2',v:17700},{n:'Легендарный',c:'#FFC933',v:72000},{n:'Мифический',c:'#FF4B3E',v:378000},{n:'Секретный',c:'#EAF1FF',v:1000000}]
T.forEach((t,i)=>t.s=['Обычн.','Необыч.','Редкий','Эпик','Легенд.','Миф.','Секрет'][i]);;
const MODES=[{l:'Любой',min:0,cost:3000},{l:'Редкий+',min:2,cost:10500},{l:'Эпик+',min:3,cost:30000}];
const WORDS=['storm','night','wolf9','cyber','pixel','ghost','nova7','lunar','ember','frost','raven','blaze','orbit','pulse','zenith','vortex','shadow','dragon','falcon','comet','atlas','magic','royal','alpha','omega','delta','sigma','ninja','panda','tiger','cobalt','cipher','quartz','rocket','silent','golden','crystal','phoenix','nexus','vector','matrix','legend','hunter','pirate','wizard','spirit','shiver','velvet','copper','jungle','abcdefghijklmnopqrstuvwxyz','aeiouy','bcdfghjklmnprstvwxz','0123456789_#$%@','sunset','thunder','galaxy','planet','meteor','aurora','eclipse','horizon','cosmos','stellar','nebula','quasar','photon','plasma','neutron','proton','carbon','silver','bronze','marble','granite','onyx','amber','jade','ruby','sapphire','opal','ivory','ebony','crimson','scarlet','violet','indigo','azure','emerald','cinder','smoke','steel','iron','titan','giant','knight','archer','viking','samurai','shogun','ronin','sensei','monk','sage','oracle','druid','shaman','rogue','bandit','outlaw','rebel','phantom','specter','wraith','demon','angel','mystic','arcane','cosmic','atomic','turbo','hyper','super','rapid','swift','stealth','blizzard','glacier','tundra','desert','canyon','island','ocean','river','forest','meadow','garden','harbor','castle','temple','tower','bridge','anchor','compass','lantern','candle','mirror','puzzle','riddle','secret','myth','fable','story','poem','melody','rhythm','echo','whisper','thunder','lightning','tornado','cyclone','volcano','crater','spark','flame','inferno','magma','cobra','viper','python','raptor','condor','eagle','hawk','owl','lynx','puma','jaguar','leopard','cheetah','panther','wolfpack','badger','otter','beaver','bison','moose','walrus','penguin','dolphin','octopus','kraken','hydra','griffin','pegasus','unicorn','goblin','ogre','troll','golem','zombie','vampire','captain','sailor','pilot','shuttle','module','sensor','signal','binary','kernel','socket','packet','buffer','cache','proxy','server','client','script','coder','hacker','gamer','streamer','player','winner','champion','master','expert','genius','sorcerer','alchemy','potion','gemstone','diamond','pearl','coral','reef','wave','tide','breeze','zephyr','mistral','monsoon'].filter(w=>/^[a-z]{5,}$/.test(w));
const L='abcdefghijklmnopqrstuvwxyz',V='aeiouy',K='bcdfghjklmnprstvwxz',POOL=L+'0123456789_#$%@';
const R=n=>Math.floor(Math.random()*n),P=a=>a[R(a.length)];
const rnd=n=>Array.from({length:n},()=>P(L)).join(''),syl=n=>Array.from({length:n},(_,i)=>P(i%2?V:K)).join('');
const rev=s=>[...s].reverse().join('');
const MAX0=10,MAXSLOTS=30;   // стартовый и предельный размер коллекции
let MAX=MAX0;                // текущий размер коллекции (растёт за монеты, хранится в S.slots)
const slotPrice=n=>Math.round(75000*Math.pow(1.35,n-MAX0)/1000)*1000;   // цена следующего места при n местах
const EN_CAP=15,EN_INT=15*60*1000;   // запас энергии и время накопления одной единицы (15 минут)
const AUTO=['выключена','ниже необычного','ниже редкого','ниже эпического','ниже легендарного','ниже мифического'];
const APP_LINK='';            // ссылка на Mini App для кнопки «Позвать друзей»: https://t.me/ИМЯ_БОТА/КОРОТКОЕ_ИМЯ_ПРИЛОЖЕНИЯ (из @BotFather → /newapp). С ней работают награды за друзей
const fmt=n=>Math.round(n).toLocaleString('ru-RU');
const short=n=>n>=1e6?(n/1e6).toFixed(n%1e6?2:0).replace(/\.?0+$/,'').replace('.',',')+'M':n>=1e3?(n/1e3).toFixed(n%1e3?1:0).replace(/\.0$/,'')+'K':String(n);   // 1 500 000 → 1,5M
const fmtC=n=>n>=1e7?(n/1e6).toFixed(1).replace('.',',')+' млн':fmt(n);   // для узких мест: 27,7 млн
// цена ника плавно растёт с его баллами (без «пустот» между редкостями); секретные цены фиксированы
const PRICE_BASE=360,PRICE_K=.056;   // цена обычных ников от баллов; общий масштаб экономики: ×30 к версии 3
const START=90000;                   // стартовый баланс
const val=(t,p,n)=>{
  if(t>=6){const l=n?[...n].length:3;return Math.round(T[6].v*(l<=1?5:l===2?3:l===3?2:1))}   // секретные: 1 символ 5 млн, 2: 3 млн, 3: 2 млн, 4+: 1 млн
  if(!p)return T[t].v;
  return Math.max(1,Math.round(PRICE_BASE*Math.exp(PRICE_K*(p-30))));
};

const SECRETS=['ww','xxx','lot','лох','god','333','666','777','888','999','000','dead','#','111','222','444','555','13','69','420','1337','lol','wow','kek','zzz','www','w','x','1','0','11','007','404','gg','xd','omg','wtf','rip','лол','кек','бог','вау','$','%','@','?','!','*','~','_','aaa','bbb','ccc','ddd','eee','fff','ggg','hhh','iii','jjj','kkk','mmm','nnn','ooo','ppp','qqq','rrr','sss','ttt','uuu','vvv','yyy','123','321','100','101','202','303','505','700','800','900','1000','2024','2025','2026','abc','xyz','qwe','asd','zxc','88','99','77','66','55','44','33','22','00','ok','no','yes','hi','yo','ha','he','ho','ah','oh','uh','ye','ya','da','net','top','vip','pro','dev','boss','king','ace','one','two','six','ten','zero','null','void','nil','err','bug','fix','cat','dog','fox','owl','bee','ant','ape','bat','rat','cow','pig','hen','sun','sky','sea','ice','fog','ash'];
const ADJ=['dark','night','silent','red','blue','cold','wild','swift','lazy','crazy','happy','lucky','toxic','epic','mega','ultra','neo','pixel','cyber','royal','angry','brave','calm','clever','cool','cosmic','crimson','deadly','deep','divine','dizzy','electric','fancy','fast','fierce','frozen','funny','fuzzy','giant','gentle','glitch','golden','grim','hidden','holy','hungry','icy','iron','jolly','keen','lone','lucid','magic','mighty','mystic','noble','odd','pale','proud','quick','quiet','rapid','rusty','sacred','salty','savage','shiny','shy','sleepy','sly','smooth','sneaky','solar','sonic','stormy','sunny','sweet','tiny','turbo','vivid','wicked','witty','wise','young','zen','zesty','atomic','bitter','bold','broken','bright','burning','chill','clumsy','cursed','dusty','eager','feral','fiery','gloomy','grumpy','haunted','hollow','humble','hyper','lunar','lost','noisy','neon','nimble','rogue','shadow','silver'];
const NOUN=['wolf','fox','cat','bear','tiger','panda','ghost','king','queen','ninja','pilot','mage','hero','dragon','falcon','raven','shark','cobra','rider','hunter','eagle','hawk','owl','lynx','puma','jaguar','viper','python','badger','otter','wolfie','bunny','kitten','puppy','monkey','koala','lion','leopard','cheetah','rhino','hippo','zebra','giraffe','whale','dolphin','octopus','crab','turtle','frog','toad','snake','lizard','gecko','dino','rex','knight','archer','viking','samurai','ronin','monk','sage','oracle','druid','rogue','bandit','pirate','captain','sailor','wizard','witch','goblin','troll','zombie','vampire','robot','droid','cyborg','alien','comet','meteor','planet','star','moon','sun','cloud','storm','thunder','rain','snow','frost','flame','ember','spark','blade','sword','arrow','shield','hammer','axe','bow','dagger','spear','crown','throne','castle','tower','bridge','anchor','lantern','candle','mirror','phantom','wraith','demon','angel','boss','chief','lord','duke','baron','ranger','scout','sniper','tank','driver','racer','runner','jumper','dancer','singer','drummer','painter','writer','maker','builder','coder','gamer','streamer','player','winner','champ'];
const AFFIX=['pro','dev','real','official','the','its','mr','im','not','just','only','ur','my','our','sir','dr','mrs','lil','big','old','new','top','best','true','pure','x','xx','neo'];
const KEYS=['qwerty','asdfgh','zxcvbn','qazwsx','qweasd','asdfg','zxcvb','qwert','poiuy','wasd1'];
const NAMES=['alex','max','ivan','dima','anna','maria','sasha','kate','oleg','nikita','artem','denis','sergey','andrey','olga','julia','katya','vlad','egor','roman','danil','lena','sonya','misha','kirill','pavel','igor','masha','tanya','ruslan','timur','amir','aidar','aigerim','dana','aruzhan','nurlan','askar','dauren','madina','john','mike','paul','peter','david','james','robert','daniel','tom','jack','harry','oliver','george','leo','adam','eric','jacob','luke','noah','liam','ethan','mason','emma','olivia','sophia','mia','lily','zoe','chloe','ella','emily','grace','ruby','alice','lucy','maya','nina','vera','vika','zhenya','galya','lyuda','inna','oksana','polina','alina','diana','karina','elina','milana','amina','aisha','zarina','asel','dinara','gulnara','aliya','sabina','bakhyt','yerlan','arman','bauyrzhan','dastan','nurzhan','rustam','samat','sanzhar','zhandos','kairat','marat','azamat','tair','bekzat','alibek','ayan','zhan','abay','ilyas','yelena','nastya','liza','varya','ksenia','arina','yana','kolya','vanya','petya','fedya','zhora','lyosha','seryozha','vitya','tolya','gleb','stas','maksim','boris','leonid','anton','ilya','mark','nick','sam','ben','joe','dan','tim','kim','eva','ann','amy'];
const SURN=['smith','ivanov','petrov','k','m','s','official','real','life','play','game','music','art','photo','travel','kim','lee','ali','khan','sidorov','kuznetsov','popov','sokolov','volkov','smirnov','nurmukhanov','abenov','dev','pro','tv','fan','club','team','crew','blog','shop','studio','store','fit','food','cars','cats','dogs','love','luv','fire','ice','sun','moon','sky','gold','star','x_x','01','07','77','99','2k'];
// ---- расширенные словари: больше вариантов ников ----
const _w=s=>s.split(/\s+/).filter(Boolean);
WORDS.push(..._w(`banana cherry mango lemon orange peach apple berry melon coconut pepper ginger cookie waffle donut muffin pretzel burger pizza pasta noodle sushi ramen taco nacho cocoa coffee espresso mocha latte vanilla caramel honey sugar maple cinnamon mint basil olive tomato potato carrot onion garlic radish pumpkin walnut almond hazel
soccer hockey tennis boxing karate judo archery surfing skater racing cricket rugby chess poker domino bingo arcade joystick console gamepad cartridge level quest loot raid guild clan squad boss bonus combo streak critical mana health shield armor potion scroll relic artifact
anime manga otaku kawaii sakura katana shuriken kitsune tanuki yokai oni sushi bento origami haiku zenith kaiju mecha
python java ruby swift kotlin rustic golang linux ubuntu debian docker nginx redis mongo cloud server router modem laptop mouse keyboard monitor display camera tablet mobile gadget widget plugin module syntax logic loop array stack queue heap graph tree branch commit merge deploy debug compile render shader pixel sprite voxel
tokyo paris london berlin madrid milan vienna prague dubai cairo sahara siberia alaska arctic tropic jungle savanna prairie tundra fjord lagoon atoll glacier summit valley ridge canyon cavern grotto
monday friday sunday summer winter autumn spring dawn dusk midnight noon sunrise twilight equinox solstice
rhythm melody harmony chorus tempo beat bassline vinyl cassette radio studio guitar piano violin cello drums trumpet banjo ukulele synth
tulip orchid lotus daisy poppy jasmine lavender clover willow cedar birch aspen pine oak maple bamboo moss fern
magnet laser sonic quantum fusion gravity vacuum plasma kinetic voltage circuit engine piston turbine rocket thruster booster capsule probe rover lander satellite telescope
brave swift mighty clever gentle fierce loyal noble humble wicked sneaky lucky rusty dusty frosty smoky stormy sunny cloudy windy rainy foggy
bajkal almaty astana kazakh steppe nomad yurt koumiss samruk tulpar altyn kumis`).filter(w=>/^[a-z]{5,}$/.test(w)));
ADJ.push(..._w(`able acid agile airy alert alive amber ample ancient arctic ashen astral atomic awake azure baby bare bashful beefy better bionic bitter black blind bliss bloody bluish bony boxed brainy brisk bubbly burly busy candid casual chilly chubby classy clean clear cloudy clumsy cozy crafty crispy cuddly curly dapper daring dashing decent dense dim dirty dope dreamy dual dull dumb earthy easy edgy elder elite empty ethereal exotic faded fairy fake famous fearless fluffy flying foggy foxy frail frosty gamer gaudy ghostly giddy glassy glossy glowing gothic grand greedy groovy gruff hairy handy hardy hasty hazy heavy hip hot huge icy idle inky jazzy jumpy kind lanky late lavish lawful lean light lively loud loyal lush mad meek mellow merry messy mild minty misty mono moody mossy mute naive nasty neat nerdy nifty ninja nutty oily old open pastel peppy petite phony picky pink plain plush polar posh prime puny pure purple quirky rare real regal retro rich risky robust rosy rough round royal rude sassy scary sharp shaggy sick silky silly sleek slim slow small smart snappy snowy soft solid sour spicy spooky stable steel sticky stoic strong sturdy suave super tame tasty tidy tough tricky true ultra urban vague vast velvet vital warm weak weird wet windy witty woody zany zippy`));
NOUN.push(..._w(`ace agent alpha ape ant ark atom axe baby badger bandit bat bean bee beetle bell bird biscuit bishop bit blob bolt bone book boom bot bowl brain brick bubble buck bug bull bullet bunny butter button cake camel candy cannon cape carrot cash castle cheese chip cinder clown coach cobra coin comet cookie cork cowboy crab cricket crow cube cupcake dart diamond dice disco doctor doll donut dove dozer dream drift drone drum duck dude dust eel egg elf emu engine fairy fang feather fiddle finch fish flash flea flint fly fort frost fruit fudge gamer gator gem genie ghoul glider glove gnome goat gopher grape gravy grizzly guard gum gun hamster hammer hare hat hawk hippo hog hornet horse hound hunter husky icon idol imp jack jelly jester jet joker judge kid kite kiwi knife lamb lamp lark laser leaf lemur lion llama lobster lock lotus lucky mammoth mango marble mask mouse mule mummy muffin nerd nest night ninja nugget nut ogre oyster panda parrot pearl pebble pepper pigeon pillow pixie pizza plum pocket pony popcorn potato prince pug pumpkin punk puppy quail quest rabbit rascal ranger rat raven reaper robin rocket rogue rook rose rover saint salmon sandwich scout seal shadow sheep sheriff shrimp skull sloth slug snail sniper spider spike spirit sponge spoon squid squirrel stag storm sultan sword tank taco tiger toast tomato tornado toucan trap trout tuna turkey turtle twin unicorn viper vortex waffle wasp weasel whale wizard wolf worm yak yeti zebra zombie`));
NAMES.push(..._w(`adel adil akbar akmal alan albert aldiyar alex alexey alina alisa amanda amir anara anel angel anvar arailym aral arina arlan artur asem asylbek ayana aybek ayzhan azat bakir beibit bella bolat dalida damir darina darkhan dauren dias diyar dinmukhammed elena elnur emil eldar erlan evgeny farid fatima galiya gaukhar gulmira hanna ildar inara irina islam kamila karim kamal kenzhe kseniya laura lazzat leyla lina lyazzat madi malika marlen medet merey mira miras nargiz nazym nursultan olzhas orken rakhat raushan renat rinat sabit saltanat sanzhar saule sayan shyngys sultan symbat talgat tamerlan temirlan ulan umit yerzhan yerkebulan zhanna zhibek zhuldyz zhasulan zere zhanibek zhaxylyk`));
SURN.push(..._w(`kz uz ru by ua us uk de fr 99 2000 2001 2002 2003 2004 2005 007 777 1337 official real original legit fresh daily nightly prime vibes mood swag drip flex king queen boss lord vip pro max ultra mini mega neo zero one two three`));
SECRETS.push(...(_w(`aaaa 0000 1111 2222 3333 4444 5555 6666 7777 8888 9999 1234 4321 2024 2023 2022 2021 2020 2010 2000 1999 1990 1980 xoxo wasd gamer noob pwned owned epic bruh yeet sus nope meow woof moo oink quack hiss boo yay yum wow ahh ohh umm hmm yep nah ye ya yo hi hey ok ay`).filter(x=>x.length<5&&!SECRETS.includes(x))));
const LEET={a:'4',e:'3',o:'0',i:'1',s:'5',t:'7'},UNLEET={4:'a',3:'e',0:'o',1:'i',5:'s',7:'t'};
const leet=w=>[...w].map((c,i)=>i&&LEET[c]&&R(2)?LEET[c]:c).join('');
function genNew(){
  const k=R(40),w=P(WORDS),a=P(ADJ),nn=P(NOUN);
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
    case 10:return w+'_'+nn;
    case 11:return nn+P(NAMES);
    case 12:return P(NAMES)+'_'+nn;
    case 13:return a+P(NAMES)+(R(2)?R(100):'');
    case 14:return w+P(['hq','tv','pro','xd','gg','ru','kz','x','xx','zz'])+(R(3)?'':R(10));
    case 15:return 'the'+nn+(R(2)?'':R(1000));
    case 16:return P(['mr','ms','dr','sir','lil','big','king','lord'])+w;
    case 17:return nn+'_'+w+(R(3)?'':R(100));
    case 18:return leet(w+nn);
    case 19:return (R(2)?w:nn)+P(['_','__'])+R(1000);
    case 20:return syl(2)+syl(2)+P(['_','x','z','ix','on','ex']);
    case 21:return a+'_'+nn+'_'+P(AFFIX);
    case 22:return w+'-'.replace('-','_')+a;
    case 23:return P(['i','im','be','go','my','we'])+w;
    case 24:return w+w.slice(-2)+P(['x','z','o','y']);
    case 25:return P(['dark','lord','mr','ms','sir','the'])+P(NAMES)+(R(2)?R(100):'');
    case 26:return nn+'_'+(1990+R(36));
    case 27:return w+'_'+P(NAMES);
    case 28:return P(NAMES)+P(['_gaming','_music','_art','_vlog','_tv','_ru','_kz','_official','_real','_xx']);
    case 29:return a+nn+P(['_','x','xx','z','hd','tv','pro']);
    case 30:return P(['x','z','q'])+w+P(['x','z','q']);
    case 31:return w+P(['ing','er','ly','ish','ify','ora','ium','oid','ex','ix']);
    case 32:return syl(3)+P(['_','']) +w.slice(0,3);
    case 33:return nn+nn+(R(2)?R(10):'');
    case 34:return a+a+nn;
    case 35:return 'n'+R(10)+'_'+nn+R(10);
    case 36:return w.slice(0,1).toUpperCase().toLowerCase()+w.slice(1)+P(['_',''])+P(['alpha','prime','omega','zero','nova','plus','neo','max']);
    case 37:return P(['the','a','one'])+'_'+a+'_'+nn;
    case 38:return leet(P(NAMES)+nn);
    case 39:return syl(1+R(2))+'_'+syl(2)+(R(2)?R(100):'');
    default:return a+nn+R(100);
  }
}
// самые обычные имена: alex2003, ivan_petrov, anna_k, its_max
function plain(){
  const n=P(NAMES);let s;
  switch(R(17)){
    case 12:s=n+P(['_','',''])+P(['alex','max','dima','anna'])+R(100);break;
    case 13:s=P(['sweet','cool','little','real','just'])+'_'+n;break;
    case 14:s=n+'_'+P(['star','sun','fox','cat','kz','lov'])+R(10);break;
    case 15:s=n+P(['.','_','-']).replace(/[.-]/,'_')+P(['09','98','97','96','95','94','00','01','02','03','04'])  ;break;
    case 16:s=n+P(NAMES)+R(10);break;
    case 7:s=n+'_'+n.slice(0,1)+R(100);break;
    case 8:s=P(NAMES)+n+(R(2)?R(10):'');break;
    case 9:s=n+'.'.replace('.','_')+(1980+R(40));break;
    case 10:s=n+P(['official','real','life','tv','kz','ru','uz'])+(R(2)?R(10):'');break;
    case 11:s=P(['the','real','its','im','mr','ms'])+'_'+n+(R(2)?R(100):'');break;
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

const def={coins:START,spins:0,best:0,day:'',items:[],uid:0,ups:0,upw:0,cnt:[0,0,0,0,0,0,0],time:0,tday:{d:'',s:0},pend:null,econ:4,login:{n:0,last:''},wheel:'',q:{wk:'',list:[]},slots:10,auto:0,saved:0,sold:0,bestv:0,wheelN:0,maxStreak:0,qn:0,maxCoins:0,bestn:'',hide:0,upl:0,uph:[],refd:0,refc:0,inv:0,tri:0,luck:0,five:0,ach:null,achGot:[],en:15,enT:0,src:'free',show:[],snd:true,lvl:1,xp:0,xpv:0};
let S;try{S={...def,...JSON.parse(localStorage.getItem('nameroulette')||'{}')}}catch(e){S={...def}}
fixState();
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
  num('coins',START);S.coins=Math.max(0,S.coins);
  num('bestv',0);num('maxCoins',0);
  ['spins','ups','upw','time','saved','sold','bestv','wheelN','maxStreak','qn','maxCoins','inv','tri','luck','five'].forEach(k=>{num(k,0);S[k]=Math.max(0,S[k])});
  num('best',0);S.best=Math.min(6,Math.max(0,Math.floor(S.best)));
  if(S.econ===3){S.coins=Math.round(S.coins*30);S.bestv=Math.round((S.bestv||0)*30);S.maxCoins=Math.round((S.maxCoins||0)*30);S.econ=4}   // экономика ×30: переносим баланс игрока
  else if(S.econ!==4){S.coins=START;S.econ=4}
  if(typeof S.bestn!=='string')S.bestn='';S.hide=S.hide?1:0;
  num('refc',0);S.refc=Math.max(0,Math.floor(S.refc));S.refd=S.refd?1:0;
  num('upl',0);S.upl=Math.max(0,Math.floor(S.upl));S.uph=Array.isArray(S.uph)?S.uph.filter(x=>x&&typeof x==='object'&&typeof x.s==='string').slice(0,30):[];
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
// Награды за 7 дней входа подряд (после 7-го дня круг начинается заново)
const LOGIN=[30000,45000,60000,90000,120000,150000,225000];
// Призы ежедневной рулетки; w = шанс в процентах (сумма 100). k:'c' монеты, k:'n' ник редкости t
const WHEEL0=[{k:'c',v:150000,w:32},{k:'c',v:300000,w:22},{k:'c',v:600000,w:13},{k:'c',v:1000000,w:7},{k:'c',v:1500000,w:3.5},{k:'c',v:3000000,w:1},
  {k:'n',t:3,w:11},{k:'n',t:4,w:6},{k:'n',t:5,w:3.5},{k:'n',t:6,w:1}];
const WHEEL=[0,8,3,6,5,1,9,2,7,4].map(i=>WHEEL0[i]);   // секторы расставлены вперемешку; шансы остаются прежними
const WTOT=WHEEL.reduce((a,p)=>a+p.w,0);
// Недельные задания: n цель, r награда в монетах. Каждую неделю выбираются 3 из 6
const QDEF={
  spins:{n:30,r:300000,t:n=>`Сделай ${n} круток`},
  wheel:{n:3,r:240000,t:n=>n===1?'Прокрути ежедневную рулетку':`Прокрути ежедневную рулетку ${n} раза`},
  invite:{n:1,r:150000,t:()=>'Позови друга',h:'Засчитывается, когда ты отправишь приглашение'},
  ups:{n:25,r:450000,t:n=>`Сделай ${n} апгрейдов`},
  sell:{n:10,r:240000,t:n=>`Продай ${n} ников`},
  save:{n:5,r:180000,t:n=>`Сохрани ${n} ников`},
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
  return{done,alive,n,idx:done?(L.n-1)%7:n%7};   // idx: какую награду выдали сегодня / какая доступна
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
  A('🎰','100 круток','Сделай 100 круток',()=>S.spins,100,90000),
  A('🎰','1000 круток','Сделай 1000 круток',()=>S.spins,1000,600000),
  A('⚡','Первый успех','Выиграй первый апгрейд',()=>S.upw,1,45000),
  A('⚡','10 успешных апгрейдов','Выиграй 10 апгрейдов',()=>S.upw,10,240000),
  A('🔧','Мастер апгрейда','Сделай 100 апгрейдов',()=>S.ups,100,750000),
  A('📦','Первый в коллекции','Сохрани первый ник',()=>S.saved,1,30000),
  A('📦','Коллекция из 50 ников','Собери за всё время 50 ников в коллекцию',()=>S.saved,50,450000),
  A('💎','Ценный ник','Получи ник ценой от 300 000 🪙',()=>S.bestv,300000,300000),
  A('💎','Самый дорогой ник','Получи ник ценой от 3 000 000 🪙',()=>S.bestv,3000000,3000000),
  A('✨','Первый редкий','Получи ник редкости «Редкий»',()=>S.cnt[2],1,60000),
  A('✨','Первый эпический','Получи ник редкости «Эпический»',()=>S.cnt[3],1,150000),
  A('✨','Первый легендарный','Получи ник редкости «Легендарный»',()=>S.cnt[4],1,450000),
  A('🔥','Первый мифический','Получи ник редкости «Мифический»',()=>S.cnt[5],1,1500000),
  A('🕶️','Первая секретка','Получи ник редкости «Секретный»',()=>S.cnt[6],1,3000000),
  A('🌸','10 эпических','Получи 10 эпических ников',()=>S.cnt[3],10,600000),
  A('💰','Первая продажа','Продай ник',()=>S.sold,1,30000),
  A('🏷️','Торговец','Продай 50 ников',()=>S.sold,50,300000),
  A('🎡','Первая рулетка','Прокрути ежедневную рулетку',()=>S.wheelN,1,45000),
  A('🎡','30 ежедневных рулеток','Прокрути ежедневную рулетку 30 раз',()=>S.wheelN,30,600000),
  A('📅','Серия 7 дней','Заходи 7 дней подряд',()=>S.maxStreak,7,240000),
  A('📅','Серия 14 дней','Заходи 14 дней подряд',()=>S.maxStreak,14,750000),
  A('✅','10 заданий','Выполни 10 заданий недели',()=>S.qn,10,300000),
  A('🪙','Магнат','Накопи 30 000 000 🪙',()=>S.maxCoins,30000000,4500000),
  A('🌙','Сутки в игре','Проведи в игре 24 часа',()=>Math.floor(S.time/3600),24,450000),
  A('🗄️','Полная коллекция',`Собери ${MAX0} из ${MAX0} ников`,()=>S.items.length,MAX0,150000),
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
const SND={ctx:null,out:null,fx:null,rv:null};
const NOTE=m=>440*Math.pow(2,(m-69)/12);
function ac(){
  if(!S.snd)return null;
  try{
    if(!SND.ctx){
      const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
      const c=SND.ctx=new C(),comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=12;comp.ratio.value=6;comp.attack.value=.003;comp.release.value=.2;comp.connect(c.destination);
      const out=SND.out=c.createGain();out.gain.value=.9;out.connect(comp);
      const dl=c.createDelay(1);dl.delayTime.value=.2;const fb=c.createGain();fb.gain.value=.33;const lp=c.createBiquadFilter();
      lp.type='lowpass';lp.frequency.value=2400;const send=SND.fx=c.createGain();
      send.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(out);
      // реверберация: синтезированный импульс (шум с затуханием) даёт «объём» вместо сухого писка
      const len=Math.floor(c.sampleRate*1.9),ir=c.createBuffer(2,len,c.sampleRate);
      for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
      const cv=c.createConvolver();cv.buffer=ir;const rv=SND.rv=c.createGain(),hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=320;
      rv.gain.value=.55;rv.connect(hp);hp.connect(cv);const rvo=c.createGain();rvo.gain.value=.8;cv.connect(rvo);rvo.connect(out);
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
  if(SND.rv&&o.rv!==0){const r=c.createGain();r.gain.value=o.rv??.16;g.connect(r);r.connect(SND.rv)}
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
// колокольчик: частотная модуляция даёт «стеклянный» тембр, звон затухает мягко
function bell(m,t,dur,o={}){
  const c=SND.ctx;if(!c)return;const f=NOTE(m),car=c.createOscillator(),mod=c.createOscillator(),mg=c.createGain(),g=c.createGain(),v=o.vol||.08;
  car.frequency.value=f;mod.frequency.value=f*(o.ratio||3.5);mg.gain.setValueAtTime(f*(o.idx||1.6),t);mg.gain.exponentialRampToValueAtTime(f*.02,t+dur*.8);
  mod.connect(mg);mg.connect(car.frequency);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  car.connect(g);g.connect(SND.out);if(SND.rv){const r=c.createGain();r.gain.value=o.rv??.45;g.connect(r);r.connect(SND.rv)}
  if(o.wet){const w=c.createGain();w.gain.value=o.wet;g.connect(w);w.connect(SND.fx)}
  car.start(t);mod.start(t);car.stop(t+dur+.05);mod.stop(t+dur+.05);
}
// короткий щелчок (шум через полосовой фильтр) + низкий «стук» — механические деления циферблата
function click(t,vol,f=2600,thump=true){
  const c=SND.ctx;if(!c)return;const n=Math.floor(c.sampleRate*.03),buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);
  const s=c.createBufferSource();s.buffer=buf;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f;bp.Q.value=1.6;
  const g=c.createGain();g.gain.value=vol;s.connect(bp);bp.connect(g);g.connect(SND.out);s.start(t);
  if(thump)tone(43+(f-2000)/160,t,.05,{vol:vol*.9,rv:0})
}
// нарастающий «заряд» перед результатом: шум и свист поднимаются по частоте
function riser(t,dur,vol=.1){
  const c=SND.ctx;if(!c)return;const n=Math.floor(c.sampleRate*dur),buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
  const s=c.createBufferSource();s.buffer=buf;const bp=c.createBiquadFilter();bp.type='bandpass';bp.Q.value=3;
  bp.frequency.setValueAtTime(180,t);bp.frequency.exponentialRampToValueAtTime(3800,t+dur*.92);
  const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+dur*.85);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(bp);bp.connect(g);g.connect(SND.out);s.start(t);s.stop(t+dur);
  tone(36,t,dur*.9,{vol:.07,att:dur*.6,slide:2.2,rv:0});tone(55,t,dur*.9,{type:'triangle',vol:.03,att:dur*.7,slide:3,rv:.1})
}
const arp=(ms,t,step,dur,o)=>ms.forEach((m,i)=>tone(m,t+i*step,dur,o));
function sfx(name,a=0){try{sfxPlay(name,a)}catch(e){}}   // звук никогда не должен ломать игру
function sfxPlay(name,a){
  const c=ac();if(!c||!SND.out)return;const t=c.currentTime+.01;
  switch(name){
    case 'tap':click(t,.05,3400,false);tone(92,t,.04,{vol:.025,rv:0});break;
    case 'tick':click(t,.08,2200+(a%4)*260);break;
    case 'uptick':click(t,.085,1500+(100-a)*16);break;   // a = доля пройденного пути 0…100: чем медленнее стрелка, тем ниже щелчок
    case 'whoosh':whoosh(t,.55,300,1800,.12);break;
    case 'land':bell(72+(a%8)*2,t,.5,{vol:.07,idx:1.1,wet:.25});click(t,.07,1800);break;
    case 'sec':tone(84-(a%6)*2,t,.9,{vol:.09,wet:.8,att:.03});tone(60,t,.8,{vol:.05,att:.05});break;
    case 'myt':tone(67+a*2,t,.28,{type:'triangle',vol:.09,wet:.45,slide:1.06});whoosh(t,.22,500,2200,.05);break;
    case 'coin':bell(83,t,.25,{vol:.07,ratio:4.1});bell(88,t+.07,.7,{vol:.08,ratio:4.1,wet:.3});break;
    case 'coins':[83,88,91,95,100,107,112].forEach((m,i)=>bell(m,t+i*.05,.55,{vol:.05,ratio:4.1,wet:.3}));break;
    case 'level':[72,76,79,84].forEach((m,i)=>bell(m,t+i*.1,.8,{vol:.075,wet:.35}));bell(91,t+.42,1.4,{vol:.08,wet:.55});tone(48,t,.9,{vol:.09,att:.05,rv:.05});break;
    case 'ach':[79,84,88,91,96].forEach((m,i)=>bell(m,t+i*.065,.8,{vol:.06,wet:.4}));break;
    case 'lose':tone(64,t,.4,{type:'triangle',vol:.09,slide:.8,rv:.25});tone(57,t+.22,.6,{type:'triangle',vol:.09,slide:.78,rv:.3});click(t+.02,.05,500);break;
    case 'upstart':riser(t,5.2,.1);tone(48,t,.3,{vol:.12,slide:.7,rv:.05});break;
    case 'upwin':
      tone(36,t,1.2,{vol:.2,slide:.65,rv:0});whoosh(t,.5,400,4200,.1);
      [72,76,79,84].forEach((m,i)=>bell(m,t+.05+i*.06,1.6,{vol:.085,wet:.4}));
      [91,96,100,103].forEach((m,i)=>bell(m,t+.32+i*.07,1.4,{vol:.05,ratio:4.1,wet:.5}));break;
    case 'uplose':tone(50,t,.6,{vol:.16,slide:.55,rv:.1});tone(62,t+.04,.6,{type:'triangle',vol:.06,slide:.7,rv:.3});click(t,.06,700);break;
    case 'near':tone(79,t,.6,{type:'triangle',vol:.1,slide:.62,rv:.3});tone(60,t+.1,.7,{vol:.12,slide:.6,rv:.2});click(t,.05,900);break;
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
const lvReward=l=>({c:9000+l*3600,e:l%5===0?7:2});
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
  cur.forEach(c=>{S.cnt[c.t]++;S.best=Math.max(S.best,c.t);noteBest(val(c.t,c.p,c.name),c.name)});
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
function noteBest(v,n){if(v>S.bestv){S.bestv=v;S.bestn=String(n||'')}}
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
  if(from===to){el.textContent=fmtC(to)+' 🪙';return}
  cancelAnimationFrame(twRaf);el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');
  const t0=performance.now(),d=reduce?1:450;
  const step=n=>{const k=Math.min(1,(n-t0)/d),e=1-Math.pow(1-k,3);shownCoins=k<1?Math.round(from+(to-from)*e):to;el.textContent=fmtC(shownCoins)+' 🪙';if(k<1)twRaf=requestAnimationFrame(step)};
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
  {n:'Радуга редкостей',d:'По одному нику каждой редкости: от «Необычного» до «Легендарного»',c:'#FF5FA2',r:{c:600000,e:10},
    slots:[['Необычный',x=>x.t===1],['Редкий',x=>x.t===2],['Эпический',x=>x.t===3],['Легендарный',x=>x.t===4]]},
  {n:'Клуб длины',d:'Четыре ника разной длины',c:'#27D9BD',r:{c:150000,e:5},
    slots:[['5 символов',x=>x.n.length===5],['6 символов',x=>x.n.length===6],['7 символов',x=>x.n.length===7],['8+ символов',x=>x.n.length>=8]]},
  {n:'Зал элиты',d:'Самые редкие ники игры, вместе в одной коллекции',c:'#FFC933',r:{c:3000000,e:20},
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
const UPMAX=5;                 // максимум ников в ставке
const MULTS=[2,3,5,10];        // быстрые множители цели
const UPK=.95,UPLOSS=5,INSFEE=.25;   // шанс = цена ставки ÷ цена цели × 0,95; защита после 5 неудач подряд; страховка = 25% цены ставки
let up={sel:new Set(),mode:2,c:30,prize:null,busy:false,msg:'',res:null,fresh:false,sheet:'',ins:false,rot:0};
const chanceOf=(s,pr)=>Math.min(.85,Math.max(.01,UPK*s.v/pr.price));
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
// цель: по множителю (×2…×10) или по заданному шансу; берём ближайший по цене ник из пула
function pickPrize(s){
  const target=up.mode==='c'?UPK*s.v/(up.c/100):s.v*up.mode,ok=prizePool().filter(x=>x.price>s.v);
  if(!ok.length||!s.its.length){up.prize=null;return}
  const dist=x=>Math.abs(x.price-target),best=Math.min(...ok.map(dist));
  const near=ok.filter(x=>dist(x)<=best+Math.max(2,target*.03));
  up.prize=near.reduce((a,x)=>dist(x)<dist(a)?x:a);
}
// ----- циферблат шанса -----
const DR=82,DC=2*Math.PI*DR;
function dialSvg(){
  let tk='';for(let i=0;i<60;i++){const M=i%5===0;tk+=`<line class="${M?'tm':''}" x1="100" y1="${M?37:39}" x2="100" y2="${M?45:42}" transform="rotate(${i*6} 100 100)"/>`}
  // круг неподвижен: дуга успеха идёт от верха (0°) по часовой стрелке; вокруг него вращается стрелка
  return `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>
    <radialGradient id="dgd" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#2a2561"/><stop offset="1" stop-color="#14112b"/></radialGradient>
    <linearGradient id="dnl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <circle class="dbez" cx="100" cy="100" r="97"/>
    <circle class="ddisk" cx="100" cy="100" r="68" fill="url(#dgd)"/>
    <circle class="dtr" cx="100" cy="100" r="${DR}"/>
    <circle class="dwin" id="dwin" cx="100" cy="100" r="${DR}" transform="rotate(-90 100 100)" stroke-dasharray="0 ${DC}"/>
    <g class="dtk">${tk}</g>
    <g id="dneedle" style="transform-origin:50% 50%;transform:rotate(${up.rot}deg)"><rect x="98.6" y="22" width="2.8" height="40" rx="1.4" fill="url(#dnl)"/><circle class="dnb" cx="100" cy="18" r="9"/><circle class="dnc" cx="100" cy="18" r="3.6"/></g></svg>`;
}
let pctRaf=0;
function tweenPct(to){
  cancelAnimationFrame(pctRaf);const out=$('#dpct');if(!out)return;
  if(to==null){out.textContent='—';return}
  const from=parseInt(out.textContent)||0,setv=v=>out.textContent=v+'%';
  if(reduce||from===to){setv(to);return}
  const t0=performance.now(),d=Math.min(900,260+Math.abs(to-from)*14);
  const st=n=>{const k=Math.min(1,(n-t0)/d),e=1-Math.pow(1-k,3);setv(Math.round(from+(to-from)*e));if(k<1)pctRaf=requestAnimationFrame(st)};
  pctRaf=requestAnimationFrame(st);
}
const multWord=m=>m===2?'в 2 раза':`в ${m} раз`;
const insFee=s=>Math.round(s.v*INSFEE);
function upSkeleton(){
  return `<h2>Апгрейд</h2>
  <div class="slots"><button class="slot" id="up-stake"></button><i class="sarw">→</i><div class="slot" id="up-target"></div></div>
  <div class="pcard updial">
    <div class="mults" id="mults">${MULTS.map(m=>`<button data-m="${m}">×${m}</button>`).join('')}<button data-m="c">Свой</button></div>
    <div class="cust" id="cust" hidden><span>Шанс</span><input type="range" id="upcs" min="1" max="85" step="1" value="${up.c}" aria-label="Свой шанс"><b id="upcv">${up.c}%</b></div>
    <div class="dial" id="dial">${dialSvg()}<div class="dctr"><b id="dpct">—</b><small>шанс</small></div></div>
    <div class="hist"><div class="hstrip" id="hstrip"></div><button class="hlink" id="up-hist">История ›</button></div>
    <p class="hint">Выбери ники из коллекции и цель. Шанс = цена ставки ÷ цена цели × 0,95. Не повезёт — ставка сгорит. Защита от серий: если ${UPLOSS} раз подряд не везёт, следующий апгрейд выигрывает точно.</p>
    <p class="pity" id="pity"></p>
  </div>
  <div class="pcard sndrow"><div><b>Страховка</b><small id="ins-sub"></small></div><button class="sw" id="up-ins" role="switch" aria-checked="false" aria-label="Страховка"><i></i></button></div>
  <button class="spin" id="up-main">Выбрать из коллекции</button>
  <div class="upres" id="upres"></div>
  <div class="usheet" id="usheet" hidden></div>`;
}
function fillUp(){
  const s=stake(),pr=up.prize,ok=!!(s.its.length&&pr),ch=ok?chanceOf(s,pr):0,col=ok?T[pr.t].c:'#6A63B0';
  // слоты
  const st=$('#up-stake'),tg=$('#up-target');
  if(s.its.length){const nm=s.its.slice(0,2).map(x=>'@'+escH(x.n)).join(', ')+(s.its.length>2?` +${s.its.length-2}`:'');
    st.className='slot full';st.style.setProperty('--tc',T[s.mx].c);st.innerHTML=`<small class="cap">Ставка</small><b class="sn">${nm}</b><span class="sv">${fmt(s.v)} 🪙</span><em class="slnk">Изменить · ${s.its.length}/${UPMAX}</em>`}
  else{st.className='slot';st.style.removeProperty('--tc');st.innerHTML=`<small class="cap">Ставка</small><span class="plus">+</span><em class="slnk">${S.items.length?'Выбрать из коллекции':'Коллекция пуста'}</em>`}
  if(ok){tg.className='slot full';tg.style.setProperty('--tc',col);tg.innerHTML=`<small class="cap">Цель</small><b class="sn">@${escH(pr.name)}</b><em class="tier" style="color:${col}">${T[pr.t].n}</em><span class="sv">${fmt(pr.price)} 🪙</span>`}
  else{tg.className='slot';tg.style.removeProperty('--tc');tg.innerHTML=`<small class="cap">Цель</small><span class="tghint">${s.its.length?'Нет ников дороже ставки':up.mode==='c'?`С шансом ${up.c}%`:`${multWord(up.mode)} дороже`}</span>`}
  // множители
  document.querySelectorAll('#mults [data-m]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.m===String(up.mode))));
  $('#cust').hidden=up.mode!=='c';
  // циферблат
  if(!ok&&!up.busy&&up.rot){const nd=$('#dneedle');if(nd){nd.style.transition=reduce?'none':'transform .9s cubic-bezier(.3,.9,.3,1)';nd.style.transform='rotate(0deg)'}up.rot=0}
  const w=$('#dwin');w.style.stroke=col;w.setAttribute('stroke-dasharray',`${DC*ch} ${DC}`);$('#dial').style.setProperty('--wc',col);
  tweenPct(ok?Math.round(ch*100):null);
  if(ok&&up.mode==='c'){const v=Math.round(ch*100);$('#upcv').textContent=up.c+'%';if(v!==up.c)$('#upcv').textContent=up.c+'% → '+v+'%'}
  // история и защита
  const h=S.uph.slice(0,10);
  $('#hstrip').innerHTML=h.length?h.map(x=>`<i class="hs ${x.w?'ok':'no'}">${x.w?'✓':'✕'}</i>`).join(''):'<span class="hnone">Пока нет апгрейдов</span>';
  const pl=Math.min(S.upl,UPLOSS);
  $('#pity').innerHTML=S.upl>=UPLOSS?'🛡 Защита сработает: следующий апгрейд выиграет точно!':`🛡 Защита от серий: ${pl} / ${UPLOSS}`;
  $('#pity').classList.toggle('on',S.upl>=UPLOSS);
  // страховка
  const fee=s.its.length?insFee(s):0,sw=$('#up-ins');
  $('#ins-sub').textContent=s.its.length?`Не повезёт — ставка останется · ${fmt(fee)} 🪙`:'Не повезёт — ставка останется';
  sw.classList.toggle('on',up.ins);sw.setAttribute('aria-checked',String(up.ins));
  // главная кнопка
  const mb=$('#up-main');
  if(!S.items.length&&!s.its.length){mb.textContent='К рулетке';mb.dataset.act='go';mb.disabled=false}
  else if(!s.its.length){mb.textContent='+ Выбрать из коллекции';mb.dataset.act='pick';mb.disabled=false}
  else if(!ok){mb.textContent='Нет цели дороже ставки';mb.dataset.act='';mb.disabled=true}
  else{mb.textContent=up.ins?`Крутить · страховка ${fmt(fee)} 🪙`:'Крутить апгрейд';mb.dataset.act='spin';mb.disabled=false}
}
function renderRes(){
  const r=$('#upres');if(!r)return;
  r.innerHTML=`${up.msg}${up.res?`<div class="stage" id="upstage" style="--tc:${T[up.res.t].c}"><div class="reel" id="upreel"></div><div class="badge"><i></i>${T[up.res.t].n}</div></div>`:''}`;
  if(up.res){const fresh=up.fresh;up.fresh=false;playStage($('#upstage'),$('#upreel'),up.res,fresh)}
}
function renderSheet(){
  const sh=$('#usheet');if(!sh)return;
  if(!up.sheet){sh.hidden=true;sh.innerHTML='';return}
  sh.hidden=false;
  if(up.sheet==='pick'){
    const its=[...S.items].sort((a,b)=>b.t-a.t||val(b.t,b.p,b.n)-val(a.t,a.p,a.n)),full=up.sel.size>=UPMAX;
    sh.innerHTML=`<div class="sbg" data-close="1"></div><div class="sbox"><div class="shead"><b>Ставка</b><span id="scnt">${up.sel.size} / ${UPMAX}</span></div>
    <div class="slist">${its.length?its.map(x=>`<label class="item pick" style="--tc:${T[x.t].c}"><input type="checkbox" data-sel="${x.id}"${up.sel.has(x.id)?' checked':''}${full&&!up.sel.has(x.id)?' disabled':''}><div><b>@${escH(x.n)}</b><small>${T[x.t].n}</small></div><span>${fmt(val(x.t,x.p,x.n))} 🪙</span></label>`).join(''):'<p class="sum">В коллекции пока пусто.</p>'}</div>
    <button class="btn main" data-close="1">Готово</button></div>`;
  }else{
    const h=S.uph;
    sh.innerHTML=`<div class="sbg" data-close="1"></div><div class="sbox"><div class="shead"><b>История апгрейдов</b><span>${h.length}</span></div>
    <div class="slist">${h.length?h.map(x=>`<div class="hrow ${x.w?'ok':'no'}"><i class="hs ${x.w?'ok':'no'}">${x.w?'✓':'✕'}</i><div><b>${x.w?'@'+escH(x.p):x.i?'Ставка осталась':'Ставка сгорела'}</b><small>${escH(x.s)} · шанс ${x.ch}%${x.g?' · защита':''}</small></div><span>${fmt(x.x)} 🪙</span></div>`).join(''):'<p class="sum">История пока пуста.</p>'}</div>
    <button class="btn main" data-close="1">Закрыть</button></div>`;
  }
}
function renderUp(){
  if(up.busy)return;
  up.sel=new Set([...up.sel].filter(id=>S.items.some(i=>i.id===id)).slice(0,UPMAX));
  const el=$('#tab-up');if(!el.querySelector('#dneedle'))el.innerHTML=upSkeleton();
  const s=stake();if(!s.its.length)up.prize=null;else if(!up.prize)pickPrize(s);
  fillUp();renderRes();renderSheet();
}
async function doUp(){
  const s=stake(),pr=up.prize;if(up.busy||!pr||!s.its.length)return;
  const fee=up.ins?insFee(s):0;
  if(fee>S.coins){toast('Не хватает монет на страховку');return}
  const ch=chanceOf(s,pr),pity=S.upl>=UPLOSS,won=pity||Math.random()<ch,ins=up.ins;
  if(s.its.length>=UPMAX)S.five=1;
  S.coins-=fee;up.busy=true;xbusy=1;up.res=null;up.msg='';renderRes();
  document.querySelectorAll('#tab-up button,#tab-up input').forEach(e=>e.disabled=true);
  sfx('upstart');
  const ring=$('#dneedle'),a360=ch*360,pad=Math.min(3,a360*.15,(360-a360)*.15),dur=reduce?60:5200;
  const a=won?pad+Math.random()*(a360-2*pad):a360+pad+Math.random()*(360-a360-2*pad);
  const base=up.rot,tot=base+360*(reduce?1:6)+(((a-base)%360)+360)%360;   // стрелка по часовой доходит до угла a
  ring.style.transition=`transform ${dur}ms cubic-bezier(.1,.62,.08,1)`;void ring.getBoundingClientRect();ring.style.transform=`rotate(${tot}deg)`;
  if(!reduce){let last=-1,lt=0;const t0=performance.now();
    (function tk(){const m=new DOMMatrix(getComputedStyle(ring).transform),ang=((Math.atan2(m.b,m.a)*180/Math.PI)%360+360)%360,i=Math.floor(ang/6),now=performance.now();
      if(i!==last&&now-lt>45){last=i;lt=now;hap('i','light');sfx('uptick',Math.min(100,Math.round((now-t0)/dur*100)))}
      if(now-t0<dur)requestAnimationFrame(tk)})()}
  await new Promise(r=>setTimeout(r,dur+250));
  const dial=$('#dial'),edge=Math.min(a,Math.abs(a-a360),360-a),near=!won&&edge<9;
  dial.classList.add(won?'won':'lost');sfx(won?'upwin':near?'near':'uplose');
  await new Promise(r=>setTimeout(r,reduce?0:800));
  dial.classList.remove('won','lost');
  S.ups++;addQuest('ups',1);addXp(won?85:25);
  const names=s.its.map(x=>'@'+x.n).join(' ');
  let keep=false;
  if(won){
    S.upl=0;S.items=S.items.filter(i=>!up.sel.has(i.id));
    S.upw++;if(ch<=.1&&!pity)S.luck=1;S.cnt[pr.t]++;noteBest(pr.price,pr.name);addItem(pr.name,pr.t,pr.p);
    up.res={name:pr.name,t:pr.t,p:pr.p};up.fresh=true;
    up.msg=`<div class="win" style="--tc:${T[pr.t].c}"><b>Успех!</b> ${pity?'Сработала защита от серий.':`Шанс был ${Math.round(ch*100)}%.`} Ник уже в коллекции.</div>`;
  }else{
    S.upl=(S.upl||0)+1;
    if(ins){keep=true;up.msg=`<div class="lose"><b>Не вышло, но ставка осталась.</b> Страховка сработала, шанс был ${Math.round(ch*100)}%.</div>`}
    else{S.items=S.items.filter(i=>!up.sel.has(i.id));up.msg=`<div class="lose"><b>Не вышло.</b> Ставка сгорела, шанс был ${Math.round(ch*100)}%.</div>`}
    hap('n','error');
  }
  S.uph.unshift({w:won?1:0,ch:Math.round(ch*100),s:names,p:won?pr.name:'',i:keep?1:0,g:pity?1:0,x:s.v});S.uph=S.uph.slice(0,30);
  up.rot=((tot%360)+360)%360;ring.style.transition='none';
  if(!keep){up.sel.clear();up.prize=null}
  up.busy=false;xbusy=0;
  document.querySelectorAll('#tab-up button,#tab-up input').forEach(e=>e.disabled=false);
  save();render();
}
$('#tab-up').onclick=e=>{
  const g=e.target.closest('[data-go]');if(g)return tab(g.dataset.go);
  if(up.busy)return;
  if(e.target.closest('[data-close]')){up.sheet='';return renderSheet()}
  const m=e.target.closest('[data-m]');
  if(m){const v=m.dataset.m==='c'?'c':+m.dataset.m;if(v==='c'&&up.mode!=='c'&&up.prize)up.c=Math.min(85,Math.max(1,Math.round(chanceOf(stake(),up.prize)*100)));
    up.mode=v;up.msg='';up.res=null;const sl=$('#upcs');if(sl)sl.value=up.c;pickPrize(stake());fillUp();renderRes();return}
  if(e.target.closest('#up-stake')){if(!S.items.length)return;up.sheet='pick';return renderSheet()}
  if(e.target.closest('#up-hist')){up.sheet='hist';return renderSheet()}
  if(e.target.closest('#up-ins')){up.ins=!up.ins;return fillUp()}
  const mb=e.target.closest('#up-main');
  if(mb){const act=mb.dataset.act;if(act==='go')tab('game');else if(act==='pick'){up.sheet='pick';renderSheet()}else if(act==='spin')doUp()}
};
$('#tab-up').onchange=e=>{
  const i=e.target.closest('[data-sel]');if(!i||up.busy)return;
  if(i.checked){if(up.sel.size>=UPMAX){i.checked=false;toast(`Максимум ${UPMAX} ников в ставке`);return}up.sel.add(i.dataset.sel)}else up.sel.delete(i.dataset.sel);
  const full=up.sel.size>=UPMAX;document.querySelectorAll('#usheet [data-sel]').forEach(c=>{c.disabled=full&&!c.checked});
  $('#scnt').textContent=`${up.sel.size} / ${UPMAX}`;
  up.msg='';up.res=null;pickPrize(stake());fillUp();renderRes();
};
$('#tab-up').oninput=e=>{if(e.target.id!=='upcs'||up.busy)return;up.c=+e.target.value;const s=stake();if(s.its.length){pickPrize(s);fillUp()}else $('#upcv').textContent=up.c+'%'};

// ---------- Профиль ----------
const TN=['Обычных','Необычных','Редких','Эпических','Легендарных','Мифических','Секретных'];
const fmtT=s=>{const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h} ч ${m} мин`:m?`${m} мин`:`${s%60} сек`};
const todaySec=()=>S.tday.d===new Date().toDateString()?S.tday.s:0;
const idStr=()=>{const a=String(S.uid).padStart(6,'0');return a.slice(0,3)+' '+a.slice(3)};
const tgUser=()=>(tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user)||{};
function renderProf(){
  if(typeof refPoll==='function'&&!renderProf.t){renderProf.t=1;setTimeout(()=>{renderProf.t=0;refPoll()},0)}
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
  <div class="tri"><div><small>Капитал</small><b>${fmtC(S.coins)} 🪙</b></div><div><small>Коллекция</small><b>${S.items.length} из ${S.slots}</b></div><div><small>Витрины</small><b>${doneV} из ${SHOW.length}</b></div></div></div>
  <div class="pcard sndrow"><div><b>Звуки</b><small>Эффекты рулетки, наград и колеса</small></div><button class="sw${S.snd?' on':''}" id="snd-tg" role="switch" aria-checked="${S.snd}" aria-label="Звуки"><i></i></button></div>
  <div class="pcard inv invx"><div><b>Позвать друзей</b><small>За каждого друга: +${fmt(REF_C)} 🪙 и +${REF_E} ⚡ · приглашено ${S.refc} из ${REF_MAX}</small></div><div class="invb">${lb.refn>0?`<button class="btn main" id="ref-claim">Забрать +${fmt(lb.refn*REF_C)} 🪙</button>`:''}<button class="btn${lb.refn>0?'':' main'}" id="invite">Позвать</button></div></div>
  <div class="pcard"><h3>Статистика</h3>
    <div class="pgrid"><div class="pt"><small>Круток</small><b>${fmt(S.spins)}</b></div><div class="pt"><small>Удачных апгрейдов</small><b>${fmt(S.upw)}</b></div>
    <div class="pt"><small>В игре за всё время</small><b id="tm-all">${fmtT(S.time)}</b></div><div class="pt"><small>В игре сегодня</small><b id="tm-day">${fmtT(todaySec())}</b></div></div>
    <div class="pgrid tiers">${T.map((t,i)=>`<div class="pt${i===6?' last':''}" style="--tc:${t.c}"><small>${TN[i]}</small><b>${fmt(S.cnt[i])}</b></div>`).join('')}</div></div>
  <button class="pcard achbtn" id="top-open"><div><b>Рейтинг игроков</b><small>Топ по капиталу и самому дорогому нику</small></div><span class="trophy">🏆</span></button>
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
document.addEventListener('visibilitychange',()=>{if(document.hidden){save();lbPush();if(cloudDone)cloudPush()}});
addEventListener('pagehide',()=>{save();if(cloudDone)cloudPush()});
$('#tab-prof').onclick=e=>{
  if(e.target.closest('#ach-open'))return tab('ach');
  if(e.target.closest('#top-open'))return tab('top');
  if(e.target.closest('#snd-tg')){S.snd=!S.snd;save();renderProf();if(S.snd){sfx('ach')}return}
  if(e.target.closest('#idcopy')){(async()=>{try{await navigator.clipboard.writeText(String(S.uid).padStart(6,'0'));toast('ID скопирован')}catch(x){toast('Не удалось скопировать ID')}})();return}
  if(e.target.closest('#ref-claim'))return claimRefs();
  if(e.target.id!=='invite')return;
  addQuest('invite',1);S.inv=1;save();
  const me=tgUser().id,base=APP_LINK?(me?APP_LINK+(APP_LINK.includes('?')?'&':'?')+'startapp=r'+me:APP_LINK):location.href.split('#')[0].split('?')[0];
  openTg(`https://t.me/share/url?url=${encodeURIComponent(base)}&text=${encodeURIComponent('Заходи в Нейм-рулетку: выбивай редкие юзернеймы и собирай коллекцию!')}`);
};
function renderAch(){
  const n=ACH.filter(achOk).length,tot=ACH.length,C=2*Math.PI*54,rd=achReady().length,got=achEarned();
  const near=ACH.map((x,i)=>({x,i,ok:achOk(x,i)})).filter(o=>!o.ok).sort((p,q)=>Math.min(q.x.cur()/q.x.goal,1)-Math.min(p.x.cur()/p.x.goal,1))[0];
  const rank=o=>o.ok&&!S.achGot.includes(o.i)?0:!o.ok?1:2;
  const list=ACH.map((x,i)=>({x,i,ok:achOk(x,i)})).sort((a,b)=>rank(a)-rank(b)||a.i-b.i);
  const h=`<div class="ahead"><h2>Достижения</h2></div>
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

// Страницы: index.html (игра), rating.html (рейтинг), achievements.html (достижения). Состояние общее — в localStorage и облаке Telegram.
const PAGE=document.body.dataset.page||'main',PAGES={top:'rating.html',ach:'achievements.html'};
function tab(n){
  const here=PAGE==='main'?['game','col','up','prof','bon','show']:[PAGE];
  if(here.includes(n))return tabIn(n);
  save();try{if(cloudDone)cloudPush()}catch(e){}
  location.href=(PAGES[n]||'index.html')+(PAGES[n]||n==='game'?'':'#'+n);
}
function tabIn(n){
  document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===(n==='show'?'col':n)));
  ['game','col','up','prof','bon','ach','show','top'].forEach(k=>{const e=$('#tab-'+k);
    if(k===n){if(e.hidden){e.hidden=false;e.classList.remove('tabin');void e.offsetWidth;e.classList.add('tabin');clearTimeout(e._ti);e._ti=setTimeout(()=>e.classList.remove('tabin'),900)}}else e.hidden=true});
  $('#prof-btn').setAttribute('aria-pressed',n==='prof');
  $('#bon-btn').setAttribute('aria-pressed',n==='bon');
  if(n!=='col')colSel=null;
  if(n==='col')renderCol();else updSelbar();
  if(n==='up')renderUp();
  if(n==='prof')renderProf();
  if(n==='bon')renderBon();
  if(n==='ach')renderAch();
  if(n==='show')renderShow();
  if(n==='top')openTop();
  scrollTo(0,0);
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
// ---------- Рейтинг игроков ----------
// Рейтинг работает через маленький сервер (папка rating-worker). Пока адрес не указан, страница показывает подсказку.
const API='https://rt.wsmp.workers.dev';   // например: https://nr-rating.твой-аккаунт.workers.dev
const escH=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const netWorth=()=>S.coins+S.items.reduce((s,x)=>s+val(x.t,x.p,x.n),0);   // капитал = монеты + стоимость коллекции
const lb={by:'net',data:{},load:false,err:'',sent:'',last:0};
function bestOwn(){   // лучший ник из коллекции, если имя ещё не записано
  if(S.bestn||!S.items.length)return;
  let b=null,bv=0;S.items.forEach(x=>{const v=val(x.t,x.p,x.n);if(v>bv){bv=v;b=x.n}});if(b&&bv>=S.bestv*.999){S.bestn=b}
}
async function lbReq(path,body){
  const r=await fetch(API.replace(/\/$/,'')+path,{method:body?'POST':'GET',headers:{'X-Init-Data':tg&&tg.initData||'','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  if(!r.ok)throw new Error(r.status===429?'wait':'http '+r.status);return r.json();
}
async function lbPush(force){
  if(!API||!tg||!tg.initData)return;bestOwn();
  const u=tgUser(),b={name:(u.first_name||'Игрок').slice(0,24),net:Math.round(netWorth()),best:S.bestv,bestn:S.bestn||'',lvl:S.lvl,hide:S.hide},sig=JSON.stringify(b);
  if(!force&&sig===lb.sent)return;if(Date.now()-lb.last<12000)return;
  lb.last=Date.now();try{await lbReq('/sync',b);lb.sent=sig}catch(e){}
}
async function openTop(){
  renderTop();if(!API||!tg||!tg.initData)return;
  lb.load=true;lb.err='';renderTop();
  try{await lbPush(true);lb.data[lb.by]=await lbReq('/top?by='+lb.by)}catch(e){const m=String(e.message||e);lb.err=m==='wait'?'Подожди несколько секунд и попробуй снова':'Не удалось загрузить рейтинг ('+(m==='http 401'?'ошибка проверки Telegram: проверь BOT_TOKEN':m==='http 500'?'ошибка сервера: проверь привязку базы DB':/Failed to fetch|Load failed|NetworkError/i.test(m)?'нет связи с сервером':m)+')'}
  lb.load=false;if(!$('#tab-top').hidden)renderTop();
}
function renderTop(){
  const d=lb.data[lb.by],net=lb.by==='net',medal=['🥇','🥈','🥉'];
  const val2=x=>net?fmtC(x)+' 🪙':fmtC(x)+' 🪙';
  let body;
  if(!API)body='<div class="pcard lbmsg"><b>Рейтинг пока не подключён</b><small>Нужно развернуть сервер из папки rating-worker и вписать его адрес в app.js (константа API). Подробности в README.</small></div>';
  else if(!tg||!tg.initData)body='<div class="pcard lbmsg"><b>Рейтинг доступен в Telegram</b><small>Открой игру через бота, чтобы видеть таблицу и попасть в неё.</small></div>';
  else if(lb.load&&!d)body='<div class="pcard lbmsg"><small>Загружаю…</small></div>';
  else if(lb.err&&!d)body=`<div class="pcard lbmsg"><b>${escH(lb.err)}</b><button class="btn main" id="top-retry">Повторить</button></div>`;
  else if(d){
    const me=d.me;
    body=`<div class="pcard lbme"><small>Твоё место</small><b>${me&&me.rank?'#'+fmt(me.rank):'—'}</b><span>${val2(net?Math.round(netWorth()):S.bestv)}${!net&&S.bestn?` · ${escH(S.bestn)}`:''}</span></div>
    <div class="lbl">`+(d.top.length?d.top.map((r,i)=>`<div class="lbr${r.me?' me':''}"><em>${medal[i]||i+1}</em><div class="lbn"><b>${escH(r.name)}</b><small>${net?`${r.lvl} ур.`:escH(r.bestn||'—')}</small></div><span>${val2(r.v)}</span></div>`).join(''):'<div class="pcard lbmsg"><small>Пока никого нет — стань первым!</small></div>')+'</div>';
  }else body='';
  setHtml($('#tab-top'),`<div class="ahead"><h2>Рейтинг</h2></div>
  <div class="seg two"><button data-by="net" aria-pressed="${net}">Капитал</button><button data-by="best" aria-pressed="${!net}">Лучший ник</button></div>
  ${body}
  <div class="pcard sndrow"><div><b>Показывать меня</b><small>Если выключить, тебя не будет в таблице</small></div><button class="sw${S.hide?'':' on'}" id="top-hide" role="switch" aria-checked="${!S.hide}"></button></div>`);
}
$('#tab-top').onclick=e=>{
  if(e.target.closest('#top-back'))return tab('prof');
  if(e.target.closest('#top-retry'))return openTop();
  const b=e.target.closest('[data-by]');if(b&&b.dataset.by!==lb.by){lb.by=b.dataset.by;return openTop()}
  if(e.target.closest('#top-hide')){S.hide=S.hide?0:1;save();lb.sent='';lbPush(true).then(()=>{if(!$('#tab-top').hidden)openTop()});renderTop()}
};
setInterval(()=>{if(!document.hidden)lbPush()},60000);
// ---------- Друзья: награды за приглашённых ----------
// Друг открывает игру по ссылке с ?startapp=r<id>. Сервер записывает пару «кто пригласил — кто пришёл»
// и только для нового игрока (которого ещё не было в таблице). Пригласивший забирает награду кнопкой в профиле.
const REF_C=60000,REF_E=2,REF_NEW_C=30000,REF_NEW_E=2,REF_MAX=20;   // награды и предел приглашений
lb.refn=0;
async function refInit(){
  if(!API||!tg||!tg.initData)return;
  const sp=(tg.initDataUnsafe&&tg.initDataUnsafe.start_param)||'';
  if(/^r\d{1,15}$/.test(sp)&&!S.refd){
    try{const r=await lbReq('/ref',{inviter:sp.slice(1)});S.refd=1;
      if(r.ok){S.coins+=REF_NEW_C;S.en+=REF_NEW_E;save();render();toast(`🎁 Бонус за приглашение: +${fmt(REF_NEW_C)} 🪙 и +${REF_NEW_E} ⚡`)}else save()}catch(e){}
  }
  refPoll();
}
async function refPoll(){
  if(!API||!tg||!tg.initData)return;
  try{const r=await lbReq('/refs');const n=Math.max(0,Math.min(r.n|0,REF_MAX-S.refc));if(n!==lb.refn){lb.refn=n;if(!$('#tab-prof').hidden)renderProf()}}catch(e){}
}
async function claimRefs(){
  if(!lb.refn)return;
  try{const r=await lbReq('/ref/claim',{});const n=Math.max(0,Math.min(r.n|0,REF_MAX-S.refc));lb.refn=0;
    if(n){S.coins+=n*REF_C;S.en+=n*REF_E;S.refc+=n;save();render();sfx('coins');toast(`🎁 Друзья: +${fmt(n*REF_C)} 🪙 и +${n*REF_E} ⚡`)}}catch(e){toast('Не удалось забрать награду')}
  renderProf();
}

// ---------- Бонусы: вкладка ----------
const bon={busy:false,res:null,ang:0,win:-1,fresh:false};
// ---------- Колесо ежедневной рулетки ----------
const WN=WHEEL.length,WSL=360/WN;
const wpt=(deg,r)=>{const a=deg*Math.PI/180;return [(r*Math.sin(a)).toFixed(2),(-r*Math.cos(a)).toFixed(2)]};
const wcol=p=>{if(p.k==='n')return T[p.t].c;const cs=WHEEL.filter(x=>x.k==='c').map(x=>x.v),i=cs.indexOf(p.v);return ['#FFD866','#FFC933','#FFB62E','#FFA526','#FF9419','#FF7F11'][Math.min(5,Math.max(0,i))]};
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
const wlab=p=>p.k==='c'?short(p.v):'';
const wpick=()=>{let r=Math.random()*WTOT;for(const p of WHEEL){r-=p.w;if(r<0)return p}return WHEEL[0]};
const kfmt=short;
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
      return `<div class="lcell ${st}${i===6?' big':''}"><small>День ${i+1}</small><b>${kfmt(r)}</b>${st==='done'?'<i>✓</i>':''}</div>`}).join('')+`</div>`+
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
    S.cnt[pick.t]++;noteBest(pick.price,pick.name);
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
if(PAGE!=='main')tabIn(PAGE);
else{const h=location.hash.slice(1);if(['col','up','prof','bon','show'].includes(h))tabIn(h)}
try{if(PAGE!=='main'&&tg&&tg.BackButton){tg.BackButton.show();tg.BackButton.onClick(()=>{location.href='index.html'})}}catch(e){}
refInit();
cloudLoad();
try{window.bootDone&&bootDone()}catch(e){}   // игра готова: убираем загрузочный экран
