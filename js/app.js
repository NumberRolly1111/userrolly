// показать ошибку на экране, если что-то сломалось (пригодится для диагностики на телефоне)
addEventListener('error',e=>{try{let b=document.getElementById('errbar');if(!b){b=document.createElement('div');b.id='errbar';b.style.cssText='position:fixed;left:8px;right:8px;top:8px;z-index:99;background:#B3261E;color:#fff;font:12px/1.35 monospace;padding:8px 10px;border-radius:10px;word-break:break-all';b.onclick=()=>b.remove();document.body.append(b)}b.textContent='Ошибка: '+e.message+' ('+String(e.filename||'').split('/').pop()+':'+e.lineno+') · нажми, чтобы скрыть'}catch(x){}});
addEventListener('unhandledrejection',e=>{try{console.error(e.reason)}catch(x){}});
const $=s=>document.querySelector(s),tg=window.Telegram&&Telegram.WebApp;
try{if(tg&&tg.initDataUnsafe&&tg.initDataUnsafe.start_param==='admin'&&!document.body.dataset.page&&!sessionStorage.getItem('nr_adm')){sessionStorage.setItem('nr_adm','1');location.replace('winvhfufkfdnditgv/')}}catch(e){}
// если на хостинге лежит старый html без новых разделов (файлы загрузили не все) — создаём недостающие, чтобы игра не падала
['ach','show','top','clan','market','museum'].forEach(k=>{if(!$('#tab-'+k)){const s=document.createElement('section');s.id='tab-'+k;s.className='list';s.hidden=true;($('#tab-bon')||document.body).after(s)}});
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
const WORDS=['storm','night','wolf9','cyber','pixel','ghost','nova7','lunar','ember','frost','raven','blaze','orbit','pulse','zenith','vortex','shadow','dragon','falcon','comet','atlas','magic','royal','alpha','omega','delta','sigma','ninja','panda','tiger','cobalt','cipher','quartz','rocket','silent','golden','crystal','phoenix','nexus','vector','matrix','legend','hunter','pirate','wizard','spirit','shiver','velvet','copper','jungle','sunset','thunder','galaxy','planet','meteor','aurora','eclipse','horizon','cosmos','stellar','nebula','quasar','photon','plasma','neutron','proton','carbon','silver','bronze','marble','granite','onyx','amber','jade','ruby','sapphire','opal','ivory','ebony','crimson','scarlet','violet','indigo','azure','emerald','cinder','smoke','steel','iron','titan','giant','knight','archer','viking','samurai','shogun','ronin','sensei','monk','sage','oracle','druid','shaman','rogue','bandit','outlaw','rebel','phantom','specter','wraith','demon','angel','mystic','arcane','cosmic','atomic','turbo','hyper','super','rapid','swift','stealth','blizzard','glacier','tundra','desert','canyon','island','ocean','river','forest','meadow','garden','harbor','castle','temple','tower','bridge','anchor','compass','lantern','candle','mirror','puzzle','riddle','secret','myth','fable','story','poem','melody','rhythm','echo','whisper','thunder','lightning','tornado','cyclone','volcano','crater','spark','flame','inferno','magma','cobra','viper','python','raptor','condor','eagle','hawk','owl','lynx','puma','jaguar','leopard','cheetah','panther','wolfpack','badger','otter','beaver','bison','moose','walrus','penguin','dolphin','octopus','kraken','hydra','griffin','pegasus','unicorn','goblin','ogre','troll','golem','zombie','vampire','captain','sailor','pilot','shuttle','module','sensor','signal','binary','kernel','socket','packet','buffer','cache','proxy','server','client','script','coder','hacker','gamer','streamer','player','winner','champion','master','expert','genius','sorcerer','alchemy','potion','gemstone','diamond','pearl','coral','reef','wave','tide','breeze','zephyr','mistral','monsoon'].filter(w=>/^[a-z]{5,}$/.test(w));
const L='abcdefghijklmnopqrstuvwxyz',V='aeiouy',K='bcdfghjklmnprstvwxz',POOL=L+'0123456789_#$%@';
const R=n=>Math.floor(Math.random()*n),P=a=>a[R(a.length)];
const rnd=n=>Array.from({length:n},()=>P(L)).join(''),syl=n=>Array.from({length:n},(_,i)=>P(i%2?V:K)).join('');
const rev=s=>[...s].reverse().join('');
const MAX0=10,MAXSLOTS=30;   // стартовый и предельный размер коллекции
let MAX=MAX0;                // текущий размер коллекции (растёт за монеты, хранится в S.slots)
const slotPrice=n=>Math.round(75000*Math.pow(1.35,n-MAX0)/1000)*1000;   // цена следующего места при n местах
const EN_CAP=15,EN_INT=15*60*1000;   // запас энергии и время накопления одной единицы (15 минут)
const AUTO=['выключена','ниже необычного','ниже редкого','ниже эпического','ниже легендарного','ниже мифического'];
const APP_LINK='https://t.me/NumberRollyBot';            // ссылка на Mini App для кнопки «Позвать друзей»: https://t.me/ИМЯ_БОТА/КОРОТКОЕ_ИМЯ_ПРИЛОЖЕНИЯ (из @BotFather → /newapp). С ней работают награды за друзей
const fmt=n=>Math.round(n).toLocaleString('ru-RU');
const CAP=1e12;                    // максимальный баланс: 1 трлн монет
const tz=x=>String(x).replace(/(\.\d*?)0+$/,'$1').replace(/\.$/,'').replace('.',',');
const short=n=>n>=1e12?tz((n/1e12).toFixed(2))+'T':n>=1e9?tz((n/1e9).toFixed(2))+'B':n>=1e6?tz((n/1e6).toFixed(2))+'M':n>=1e3?tz((n/1e3).toFixed(1))+'K':String(n);   // 1 500 000 → 1,5M
const fmtC=n=>n>=1e12?tz((n/1e12).toFixed(2))+' трлн':n>=1e9?tz((n/1e9).toFixed(2))+' млрд':n>=1e7?tz((n/1e6).toFixed(1))+' млн':fmt(n);   // для узких мест: 27,7 млн
// цена ника плавно растёт с его баллами (без «пустот» между редкостями); секретные цены фиксированы
const PRICE_BASE=360,PRICE_K=.056;   // цена обычных ников от баллов; общий масштаб экономики: ×30 к версии 3
const START=90000;                   // стартовый баланс
const nameHash=n=>{let h=2166136261;for(const c of String(n)){h^=c.codePointAt(0);h=Math.imul(h,16777619)}h^=h>>>15;h=Math.imul(h,2246822519);h^=h>>>13;return (h>>>0)/4294967296};   // одинаковое «случайное» число для одного ника
const val=(t,p,n)=>{
  if(t>=6){const l=n?[...n].length:3,[lo,hi]=l<=1?[3600000,5000000]:l===2?[2400000,3600000]:l===3?[1600000,2400000]:[1000000,1600000];
    return Math.round(lo+(hi-lo)*nameHash(n||'abc'))}   // секретные: у каждого ника своя цена внутри вилки (1 символ 3,6–5 млн … 4+ символа 1–1,6 млн)
  if(!p)return T[t].v;
  return Math.max(1,Math.round(PRICE_BASE*Math.exp(PRICE_K*(p-30))));
};

// Каталог ников: у каждой редкости фиксированное число имён (секретные 150, мифические 1000, легендарные 1500, эпические 3000, обычные+необычные+редкие 3000)
const CAT=[["thefalcon","f_bi51","gsmasx","kingvienna","mqzkxyq","sahadopy","level_7","rogue_2013","ruwznha","wicked_aigerim","rex_hydra","anchoranchor1","kingtundra","sqdfxeh","s3rverc0okie","d4l1d4cupc4ke","ezoxyg","eldarofficial7","mcqdwzk","n4_spark7","sweet_milana","vemakoxa","c4ndlecupcake","heavylantern","evgeny43","angel988","batkpue","mivakifa","george_14","gentleeagle_","fruitfruit9","cobra778","wifivula","supjmkxf","top_ranger","siryon","jxzcbudo","its_alexey","adestphg","zehycvkz","puppy_my","katya_k67","ur_gravy","wnblj0","melonly","pvlgmhmz","tupacely","n6_castle9","kuxemos1","sophia_36","rebi983","s_wi63","dapunavu","xagykzof","just_andrey","vodyhamo","zxdfzxdf","baron_1992","zhibek_cash","n9_muffin2","rook2000","oysteroyster8","gpcjkw","dqkyvgc","rwrxifml","ildarildar0","empty_rascal","koala_2013","bmdslt","zujymalo","jlnrikgx","tymomaga","kticyt","dastanuz9","fujow4","tsbctsb","varya_97","tooekmk","cwhe593","lomuhom9","el1napumpk1n","the_nurzhan26","aieqkql","coder_oyster","the_royal_mask","widget68","qfixbqj","jamesliam","liza56","alina667","videlele","zhuldyz_puppy","flame__749","mof690","logic_flame","coin_2001","wcckjif","sheepsheep2","fuztmx","itpubzk","angryboss","zhibek_nerd","qagmktva","ydvsxbzd","walrusgg","raptor_ethan","vampire2023","wuconu08","rppmtgym","pianoium","jaosulir","tempo755","mkjcenia","petite_bubble_ur","zlavenderq","jylcqahc","hotstorm","seryozhareal3","medet_alex19","xgyormyu","pfqayps","tank_1992","sir_trout","canyon_galiya","faeng36","yfkvea80","loudirina","sigixicu","rtehvxeb","mhytxnsg","lorddanil","tfdatfd","squirrel_stealth","tair_1996","baby_dev","faj822","xytoon","tigi74","svipbaxw","thecaptain464","feriix","zqkhdc2","setimkn","imvampire","cocoa_kite","nursultan80","sanzharalex69","mirrororx","riskywizard","gpvzyq38","monorobert77","dope_dart","lmkxat32","hzydikf","lajopo4","cloverzz6","zlkubrw","aruzhan_1983","driftdrift","gyhizodo","xoooa802","the_merey32","eager_taco_the","v1ty4t1ger","kqmckqmc","the_petite_mango","jdygvio","roveva39","mrzhora68","mrjames29","kogugoti","temp0","volc4noblade","denysoty","gomongo","hunanuke","frlwjrqc","v_ji","shiverer","kseniatv","hungry_eel","fadedanel74","arppmb","denis_official","cosmiccosmicsultan","capezhuldyz","sivojuj8","jyedaw","jkzancww","hyxito29","pamyfoca","star_proxy5","castlexd","harehare","nargiz45","vortexexy","bridgegeo","pegu814","sonic_sword","riv3r","pure_cinder","komebara","kinetic_badger","little_dinmukhammed","bopz7","roundemily","xifarun6","krfypka","jsamjey","vocolyni","aidar_ruslan","qwbpbczj","kate1992","thediamond985","captain_tower","nurzhan_2001","emil_islam","zihomepa","fre679","its_roman","cool_polina","lordfrost","sultan48","ydshtgai","ocean_3","questxd7","deqsntza","zebra_logic","iemerald","vaguebakhyt15","kudjvqc6","pzafetf","rlcwzz","lamaon","alina_1980","gothicdronehd","polxzora","shocsuw","zhydrax","jazzyjazzyhammer","odeoebms","gylameli","velvet7","zarina1987","cmcuox","wejixysa","kyd045","zyehgqy","hunternova","tim_kseniya","rkhcwrt","ktxxcvon","dozumul7","eklmr12","dragonalan","toam3","forestxd","ckqpotp","uuwnfom","mrdarina33","dana333","mr_cinder","pomaocv","g0th1cbutt0n","myengine","wig041","sol571ce","qdlmmksv","semetece","mybyrume","rxlrkvts","clever_zombie_true","mango_imp","little_zhenya","cukugito","luwutice","zizugika","nuseryxy","chubby51ng3r","mxjgbqrs","kohpan","qlrnbkr","real_misha60","rabbit_794","rotyjote","r_da","pocket2001","zati349","berlxq","sdzswoe","gpzygpz","topit9","vucbclf","tesyda2","otter_mrs","asel_a80","hhtotq","advqtx97","donutdonut8","raven_2024","wigalamu","bphkxcjs","wmgyahqe","real_tolya","mobile7","jfjzet","ddtjtnd","jacob_ru","lorddenis54","hbbszaa5","ohwvpfq","wetdiamondhd","purepurerex","silly_ghoul","rydotofu","rdxhznmz","pojul78","cdqutkow","a_bitter_bow","r1ddl3","jesinosu","thepirate","edwnfw","mlvmsipj","ifvqnjl","hjolth","fudge_real","xtovxynr","cool_bakhyt","rakhat_55","aybek_gator","ti357","worony6","rabbit_top","evktevkt","hladqduc","dxogu40","cmp99","goatgoat","nybonuwa","tuguviva","pythonnoah","gothic_gator","faridtim1","shuriken481","xpkgqh","uyfiiw","qwnxfja1","sajodifu","crater_pug","qqncaqst","msplanet","sashaofficial3","player__964","xxsniperxx","nina2012","ekahquup","dreamyerzhan","rzqpxzzr","a_hot_baron","airytalgat81","kebefe49","neinsrq","altynkz","ofosbtbn","najog2","fycixuxy","vnrf34","zduk0","wise_player","one_sonic_player","vityareal","one_solid_coder","cool_egor","ape_carbon8","zrapidz","hwqpebef","tkkywl","iphantom","atoll_x","puxa65","ajjziy","kumis_coder","hookoicm","clumsy_donut_just","mulesabit","gopher_sahara","ilafhg82","nimble_sheriff_real","whale_the","pumpkin_proton13","keyboard_sassy","zos080","noxxtr","cozylion","fairy_turtle","cipyg707","debix12","btwsbtw","a_smooth_carrot","wosa1","yerlan_boss","ewuj70","hrtjefc","foxmuciz","lordnazym","fihodiku","alexyerzhan5","grumpytoastz","zksdunxk","fonpar","meekpillowz","vfggiowo","gmibgxtn","wavipali","suvevywy","pixelkz1","amir_kz7","xxfeatherxx","hjqptu","pe798","burlyc4m3l","lyxtadmx","vhxedjrm","asel2012","fzqbwh","latelaser_","aral_bowl","cohanamy","adilarailym9","comet_2024","dqzhhqtf","captain_medet","iibcibw","potato_pure","xow_cle","m1lan","samruk_ivan","lkinua9","ystohdx","npxmjc","eagleix","jexfsdja","imgarden","one_chill_plum","jnksxjcj","sibydyda","syygczin","m0o53","raxogady","rude_bandit","fhajnrx","pillowpillow7","ryzotiwu","kum15bubbl3","murocage","bsvyr72","kstfar","the_varya4","badger_caramel38","nopezuba","zozujago","rich_sniper","cdocwhmx","tair_kz","sleepysleepydart","unzfdraz","ekvfjirt","xaw_str","bbktvdgo","effqocxp","luckyspark","xsrwbyq","sircopper","bymihyxa","xbeqqic","trout_2002","lagoonony","the_joker","bwowhki","jqjcnbh","kgacslrn","evhkumhx","zediji55","wyvosq9","bxykdnwg","n1_puma1","bluishgamer","im_zarina","yuehmh","byl_neb","epdmjim4","darinatv","lordvika","d4r1n4p3pp3r","vaguegamer","cvlkqy","hgndcqne","sojksoj","mydyrafi","xxspiritxx","oycaufxx","fezeon","thecoder","lywag803","xitat62","wovo371","ha1kug0pher","rajalofe","bravebraverex","tosube4","hibo952","karim_k86","its_gum","migh7ymage","mono_badger","qobkam","sugar_8","ubkojnc","qjvo045","samzhuldyz4","angry_rex_new","ridtxyj","uavjzlei","wickededx","silverly","tilit387","lucyturtl3","nargizsanzhar4","ickxvg","byczbycz","ploeozu","nurzhan73","blisscowboy","bclchhu","thelark","tr0llbulle7","ironmonkeyhd","divine_guard_old","dusty_409","v_ny","eevis719","probe_toast","xpaonglx","ubcjvzqx","tqkyinyf","irina_real","a_proud_tornado","punwfo","dcxz174","degu32","zjpti959","sijek31","wjdzboo","iemze4","sirnurlan","tanukiing","pzkkfd","ald1yarmuffin","wokypuji","ivan_nerd","winter77","jhapbkp","nsfoatfs","isamurai","karate743","ur_kid","gulmira_lord","falconanna","lena_gaming","daki63","imphantom","alexey24","zpynzpy","wolfpack7","cloudgg","zarina_xx","capuvo75","bejymyni","wobzfgbi","boxing_x","pynicu1","asylbek_00","xplasmaz","mwgnpzyo","groovyleonid","aqptrovi","dtvivaqp","elena_02","jdzmvy","arina_21","mecha_marlen","cobra_hawk","ahqaoqs","styrad","dino2021","phxmnq","cake_altyn","ofzeqghr","qtokyoq","uxzlkd","jungl3","he808","beetlebeetle","ivan_04","fbxnfbxn","sanzhar_53","real_kenzhe","opwqopw","pbgqcbb","thewizard246","behqrvbq","jcpmhe","bybuqzb","kidykamy","zopyhare","pogudere","jypyn120","quartz149","n3_knight8","c1nnamondroid","qczfaifz","alina_29","rac1ngrang3r","xxgrizzlyxx","jjzqtxh","iquest","xtqpy55","coldfedya37","hhsg60","msyusfcn","sxebciu","dima_d0","phuhhkmi","mblhdh","zevezede","sniper2008","cybersabit","isl4mfr0g","cassettealpha","uxhvhdq","hamtfll","mirasmax27","phonygrapexx","guitar_aral","kuhyex","bakir_xx","kopupewo","kim1986","alert_leopard_just","vnagimee","chloe1985","gud03","pyeodnxd","rapid_pearl","arina2000","ilvcczc","mjppdkq","ypbahnfj","orken_o28","walnut77","sneakysneakyfiddle","ngim55","lu5hye71","xsteelq","garlic_giant","harmony_ark","coin2024","irin4w0rm","qocsgvq","zcofsk","thebow","madrid_clear","tiger_manga","srwrux","lttffr","zoejibmq","n0_jelly2","pirate_x","gopher_new","imcricket","heiuyah","uzftuzf","violet_knight","sematado","fuzzycarrothd","mdwamdwa","cbdmksx","famous_racer","qvfyqvf","lqkmlato","ob588","thepigeon","laserish","xserverq","fiery_ember_new","henikad5","clear_winner_xx","rakhat76","httfmhsr","prxrktsr","kkhqgy","ninjajaz","gaudy_leopard","pobe094","xosigycu","guletocu","roughbadger","cyzevygi","garinawo","ziyejche","mdukhxu","inna_monk","mono_jack","n1_leopard8","vozyfays","eymweym","netihano","anara_robin","bymbvvk","smoothsmoothsnow","consolegg","suavesuavetuna","szmqvrn","nursultan_95","vrzcozzh","bexyp783","questish","ab4ybot","punk_top","rasyzip5","real_nastya8","vzcits","ctejctej","f3ralc4ke","velv3tknife","vephfoce","yhqw133","k_cy","thedoctor","ebtvcniu","bhoiiqt","vespsxmv","uxuvz37","jmegtupc","zhuldyz_aral","kumis77","xxbabyxx","drum_my","n3_skull8","xudavunu","cyp96","summit_whale","wxcdjxec","qzerzima","photon_tower","glow1ngcupc4k3","xaz53","rgng75","cello_3","d4n13lp3pper","xe465","nyxusoci","nastya_anna59","nuasgik","pow_cle","azamat_art","fearl3s5g04t","wetokyo","gohqgz73","xpgkcfv0","ienlienl","gjlarbk","nmggiytg","raoktf","jjwu444","squad_shyngys","xas_zen","saharaneo","symbatreal","peter_p69","spark2006","kolyadima86","mrpavel95","leaf_real","wolfie_2010","f3ralpunk","lemurlemur","lily_sun6","askar196","hound_2015","oltfuyfv","qclmsajp","dvqoatp","maple_88","rajoxesy","cuvoriti","nxxvhvl","akuaeyxn","rose_1997","aixssce","bett3rduke","kxwztnkb","youngkiwi","lpcbfthc","stormygun","cosmic_8","daolxeg","gvqisum","hazy_cash","angel_super","nnfptkcg","wolfpack_artur","xegamidu","cubecube5","kujegoro","zibo3","dumbmiras34","dapperdappercomet","mywraith","toztmn","vhrxc639","semepesi","glacier_abay","otakuer","gegavira","wuwihala","orevn622","bitt3rhare","kuo262","chess_fake","wolcai","one_posh_book","amlivho","sunny_3","ivory395","dfwwparf","icyoxpd","tnbenmoi","eugsme","d_hu50","gzywsyp","proxy_vivid","ilyaalex63","ispvuunx","weladefy","nav868","thecomet992","h0r1z0nfor7","yak_2005","kate2000","ilyas_cat9","kazakh798","dragon_xx","vewydoq","acqsacq","figyd77","mpbapchl","wolfieemil","bellinara","gigy575","trollzhasulan","sailor_throne","vofupp","vukig0","lzfgv44","sfhpbi01","fairy_only","pidecu10","n6_bandit0","yjnayjn","katyalucy5","sgxzerh","gekymy14","vytedatu","veteex","tawgpufv","h0ll0wfudg3","qcdsqcd","npdfdiju","riskyriskyplanet","tornadotornado1","coknpfl","petya_neo","ms_bakhyt","uxxbxfm9","qturbox","febec91","vanillalay","voltagexx","kcklxbv","xxcandyxx","radishzz","ttidqab","helopyd6","grumpy_drone","xaubwkw","chnrjt","hzvijo","dsbmxn","nyzaxara","ohnydpy","n9_coach8","scarle7","gizumuzy","harmony_varya","cobra_dragon","ginger_zesty","slyd4nc3r","pkcvwn","crystal_3","xevpudj","hardysage_","alina_official","am1rbe3","icon2014","its_alisa","inna5pir1t","lordeldar","ronin_pretzel","xuseix","hkukbv","msczfxem","habd7","kozikozi","gruffr4bbit","bakiranna48","zllgftek","awrykvi","twrhff14","nargiz_bakhyt","lantern2002","uxkl529","rejuzy74","shadow_our","ly_ki6","synthe4gl3","szeaum","dmoa2","bug_2018","v_du62","likago78","lotus_sabit","ggldtxb","sodtom","arina_a24","aempssr","rocket_816","k4r1myak","suxzsr","lpppb0","brainydroid","marblelex","mr_umit95","mrasel65","yrfweo","v0r73xgh0ul","owmxcp","health77","milaseta","menogesa","danilzarina","sunnyex","cozyravenhd","tpnfwamf","lbinobq","scarlet_","pukoluzu","lbry726","tuhcin","sewoum","thetank155","asel_alex82","boxyremi","xofowor0","anton_1999","cdgdqj","zwub2","wvyyfecn","ukul3l3whale","ciwyguba","fcymhqf","davidkz","zcompassx","xrmvahzm","clyjmb","rakhat_sun2","lljafrxg","saule_sabina","caryt84","ildaramir3","singer2004","kebyjipo","slhma2","erlan_94","autumn7","cevefado","powotecu","vojosura","vitya_04","nyzfrah","g_ho63","jxt600","zowubihi","oliveramy","fjnnt366","ylwqgi","xslb6","c4nd1dic0n","zobmzl","the_late_whale","rbvbgsf","qehfnjbc","ulan_tv","katya_07","glorcb","real_zhanibek","nndvfe56","sirnick37","nwlezfde","jackuz","yptmyar","arlanru","peelzbdk","senumy27","zotic824","cpcxscub","lively_sheriff_sir","yyuqkg","daisy_egor","eaygbj","anvar_2015","meadow_comet","uphwfbh","jyjedala","mirror_true","gyy151","sophia_dima93","bowl_2015","thebaron","theleonid79","sirbakhyt72","wetyix","max_laser","hutofaci","pxpzgssu","moonluke","wayogum","a_brainy_sponge","mocacapu","turbohq6","my_shadow","cuku113","vera_beibit","imradish","nito61","dmlxhae","hanna_65","expertrto","hetemivy","wdbdds","dyjudeze","bnirsa","etherealmaya","xanexyge","liam2002","boris557","maria_dino","jtxilup","grumpy5w0rd","mowu18","cobra2024","dreamy_engine","viper_true","jxesjf","jaxbin","zarerohe","alisa2014","sweet_oleg","pretzelgg","giantgiantalpha","n1_lotus2","oezzkuw","zdmgynls","monoazamat","lefila78","gsifbfq","owl_pro","alexey821","gydugeni","mljjzk","dojcyagp","robin_radio50","eszpjuuq","hazizahu","sm00th5w0rd","jeroleco","gulmira_zhuldyz","panther_duke","aldiyarofficial","zhzfqk","lagpcyr","kyswaucb","mylo735","xuwabiza","therat644","comboxd","zenith383","wfrcehyv","toucan2004","cygominu","ann43","gyhicuwe","opewpdca","inky_writer","rosymadina","bekzat854","pure_horse","sneakykyy","xcairoz","zdhdozc","mirror_leyla","ruslanyerzhan4","brightbrightogre","tulippro6","lgkfqoxb","vortex__792","sotubevi","nazym25","ttsucxp","fmfdhelb","adjrzwxc","gidanoje","lordrakhat54","tosefife","thetoad269","otxxiaw","aergljo","shaman1337","sushiomega","nanugofa","ny_re53","pug_bli","clcbpcfe","tajetvn","thewinner806","ueiqct5","pocket_631","ahmekhwf","cefug21","llamallama","sonic_fiery","toucan_lil","fhlof3","ltikvc85","luckyangel","nvvprtf","hanna_paul","galiyaorken3","sigma71","zereb4by","hulet92","jow_wal","dauren9","bitterbitterimp","lilglacier","its_ayan25","mwlvex","roman1988","kuayplvn","pnqbofa","au7umn","qslr77","xwfrgbzr","badger_prime","artifact_liza","lwxfdhq","yanazhanibek6","pure_drone","lalhn290","legend_max","fmneapr9","mycofuki","fbjhnvgg","davemixu","erlan_ru","bamboo_721","drgarlic","tlqlyxwv","sroav4","orvjde","bhutnkhm","drumasem","falcon613","gamer_vital","madigrace3","eoyjve","vygexubi","seb_peg","laptop_cake"],["danynav","taribax","zapspaz","quantum","dicugu","bqobqobq","xevorir","xewimog","zytozo","htgdg","gyseesyg","juteco","wyzivil","ocwah","duxana","gjagjagj","tobydi","xfkxfkxf","mxboz","sfisfisf","jotiro","mafywy","kinyma","fimipem","foviwyd","tenosyj","bokiji","nuhyduk","nsntnsnt","xcngo","xywyzoj","negjgen","ssitssi","dahute","xupipun","bilyhin","nynaned","degnged","xjesb","cbplq","tybype","laxooxal","rukulit","imveq","kohiwoh","puwrwup","ki_ni","selyma","korijar","rvfrvfrv","riuriuri","hamaduf","daroyorad","ysttc","tyhoohyt","muhiliv","texoluz","rafikor","mowiyiwom","kozyyzok","vavujo","vykesa","pbbih","joriwag","kaseesak","jexjexje","segumox","rexubow","cudyri","ycunh","sufsufsu","koxeexok","kysucum","po_hu","sypitaf","pigova","xadiidax","tedbdet","wycoocyw","texnxet","setaxu","sarpras","bodpb","edjnr","cmkhp","nihygaw","vosoco","misale","vugozem","lebuyubel","ftkftkft","ittyitty","putamy","duwyku","cmmna","hojyvyc","fucawi","pewaro","pamaeamap","vtmmu","zycaacyz","hazeler","duzuna","wybusil","mobozum","nyjicog","jucymej","kylybef","celuulec","foznp","vimoni","rkbpt","wwgnwwg","yxhyxhyx","cowazom","faviput","axvli","ljpqrsrz","nezukix","gyvexic","gefozi","gejqjeg","kiga_","lakimac","takepin","ficoges","pynoxyn","zohthoz","xusabit","mirror","celofeg","muwoowum","gyvtvyg","enzenzen","fgccs","vsotl","wyyawyya","xipewe","mixiteg","axeaxe7","njunjunj","sevgw","moguwum","vonece","holiiloh","tckui","gawiwaf","zo_fu","lubuziv","xifeuefix","raxikoh","tahanan","gobegum","newhwen","pyruhos","skpju","wafedac","wakemok","sefyfud","pwbpwbpw","wylirak","refaref","ehwza","fozamyz","syfipa","ketelu","nylo_","sebiibes","ofiofiof","mezyeyzem","wajovyd","wy_wa","ffjnc","puzzle","pabfbap","lykower","wfhpk","mopipa","pjdsd","hewonis","ju_ha","dyxjxyd","tonjw","txnxtxn","pereyerep","mitohug","jcojcojc","sjlqy","zedejiv","casady","iycciycc","amytv","poppy7","refake","gpuugpu","gedata","joceta","vedavix","zahybyw","juryhol","hacoocah","bisatug","ponymi","ijtijtij","vexihy","rabuheg","gexyje","byfiko","xynisuz","wukuho","pybijok","ofbsa","mokaakom","ojqojqoj","lycepim","zanyduke","gmxgmxgm","mazylej","zygbgyz","kocyycok","pajuho","pigano","golaalog","nefebyc","lujarog","dfcdfcdf","kyxwxyk","uetuetue","hugejym","cilyweh","micenam","reneqener","lamexa","zapkpaz","nclnclnc","cavare","bineha","devobub","penukul","lolajyp","moviwu","mofbfom","ldehn","modakur","fdhlz","rovama","jicyzab","bomifo","wyharu","dimbot","sihabil","rojdd","dyherit","jigofi","zifave","pabosy","kocihuz","gusugi","subafo","pimoha","dnnhdnnh","weghgew","zrjzrjzr","jasimet","zazibis","binuunib","wgzod","myfiifym","humaleg","wizyvid","catyfik","jusyysuj","conumir","msmia","ozboozb","catuzu","dotamu","zwjzt","lymypuw","talukad","pojezez","dogipyw","mejudof","karyyrak","votucur","pehecyk","jadldaj","gabymed","xedyydex","mebugi","xiduudix","fanope","wovhvow","vohetud","rzeod","resita","teguzo","murepoh","jonovag","fuzinuv","perojib","kixyka","zizomex","towuzuh","vybofy","ryzryzry","vedynoz","okkfm","sufejej","drgnv","sahyyhas","czmczmcz","topyca","fagosed","ygfpk","fqrib","dohepi","jisebig","kiwajeh","jetiitej","hehugi","sikookis","rywyha","sabonec","vyjajy","nahoka","fugyzot","johobif","fupoopuf","pyvepob","tyzofi","manueunam","hdohdohd","tivecoc","vygazet","addve","ypuypuyp","xkity","huxajez","zinagad","jyvatup","gusymi","cyrcyrcy","cuknc","niwuvi","horovog","vgngvgng","netbten","capojip","whutj","bu_hu","dixutaw","sowimo","lawlawla","hujopev","wuhibas","hegyjet","bzabzabz","gruky","wotntow","dekogi","slycoin","wulubu","fedujyn","foxaxiz","berry_","nagatuk","sixajic","mepuwy","cobisub","hipds","limucom","fafypa","ispgt","vodsr","kajukyb","sffgc","bumynad","svdsp","pytoqotyp","kubyoybuk","kemale","yxgpc","inddr","hacifif","taruhij","maxofub","gojiuijog","fi_te","kovyka","ccykf","lucybot","jasifal","fyxety","pyxyfyr","vajerox","bonusix","wufyyfuw","muctcum","sdysdysd","dywiiwyd","tarivof","gopebib","zohyzo","kywybiv","xonotah","sfgbb","vewihac","homotok","kavoaovak","cengnec","jqtzy","gipury","besugyc","dquid","cyfecy","lymekij","robasa","puhajox","vkvim","wukofax","wufadus","duwizul","xybavub","samotiv","vycuucyv","dxmba","bvsbvsbv","kahewed","fubitub","fimeemif","xizayazix","duneli","stcstcst","sagxb","pycajep","whisper","mpxmpxmp","zasiget","jy_xe","yecbd","tolemud","hehowy","haseesah","hybafy","forewi","zfhxv","khhrj","sunymug","iogiogio","zuzibar","zisikuc","bevawaz","abdkd","kubovuk","cyhobe","gaangaan","effro","summer_","cepoko","gywjwyg","arxun","sowixil","zesekuz","luxexew","jagomih","xhdvu","risocig","nbhnbhnb","tofakiv","roverix","lybuxe","leckcel","bykaju","srgbi","dowejaw","hegigy","tuvijep","fe_pe","zeneve","myvanyg","xanesi","tomoxuv","zupaapuz","lyfjfyl","wokihe","liglj","cytapa","lydyby","ibaibaib","hdngu","besevoz","wedocul","lswlz","fesytic","berudot","pivotet","dahawik","oleoleol","kyhabaf","hykaza","dvjdvjdv","dysopik","obaobaob","vortex","qtbqtbqt","xunyjor","haruje","noryyron","kebiruv","tymeso","kkutkku","nyja_","lpdal","xarxarxa","spqep","xiguma","mydvdym","lovudi","cixywo","kylawel","vehyke","rbtpv","boshsob","gapepo","zacihen","bowouowob","vejwjev","syronav","hajoojah","vxeqs","hytyvor","bkebkebk","tiryxop","lozypa","movitid","kexumas","bomoju","supapab","tyxaso","sidunin","kenahyw","pjhje","fituwo","pykaki","brave_","kafoky","bopavo","nafyxe","jogukal","wybigyv","rneut","qvnbv","selemoz","sexyhyp","rhyhf","niwixot","lchju","garacaw","soczcos","bemtmeb","vgecc","zolikor","go_xo","jejynu","culohi","mahwham","sugigyr","cufixu","naxiwa","va_ko","ihjod","gilepa","kodijas","uxssuxss","lunuxeg","junyhu","ejalr","qzoqzoqz","disuausid","ovqovqov","fyrlryf","zaxojos","cefibyh","gyjijut","haziwyr","todiidot","welevel","jupirod","iiwor","vopibo","tunocew","ezygs","wacoocaw","tcslu","zijoojiz","junygis","ryviivyr","qpumv","gowuyuwog","cuwswuc","fyifyify","hfudx","byfodim","lirafys","yymhyym","nagame","fjxfs","xijovis","ixyxt","kurovax","vywofi","jghmn","myladiw","civaavic","yghsb","zaxuca","nawahad","psrvy","gcogcogc","juvkvuj","xizesel","halejiv","fwftn","tczya","pyhavy","kawipiv","cogdgoc","zmgel","quksi","pwkmm","lelezaz","hiwici","yjeeyje","lisytop","zkmwf","kivigyh","jigase","wupasu","zixdxiz","tpitpitp","jabiibaj","zuniinuz","ycdor","nugudu","gibedez","dexaxom","benehil","pucbs","tunyry","xohyri","vupaiapuv","cynajet","zamedeh","ceguset","maple7","usxxb","msyyc","zxrzxrzx","pafigal","fcxfcxfc","pzdea","tewuuwet","donecik","cixyfod","rookrook","wyziizyw","aceaceac","kemyko","jyptpyj","awttawt","hufiry","nujinu","ranivyt","xawuben","xu_ru","kezube","havukez","binepy","mulidi","nugedoc","typifam","jucijoz","qtmsn","crtcq","divinegum","bosikic","hltvd","pizele","jocayacoj","paheduh","xumenu","wzzmi","fekene","pajouojap","gaxetaj","raseesar","butobu","zyseca","mupysex","vesowa","ngcngcng","ntctntct","wesynaz","hamicok","fucyduf","cxvrq","xijugo","qwkvy","jukenez","runoyonur","zupenex","xemyymex","hqufg","vyvukiz","ugabl","ohlww","podugat","rugaze","cykpkyc","bafcfab","komy_","wetyfy","nejyny","qqueueq","pukubuw","vqoje","fijaku","pohivul","larogiz","zikihi","birijur","pqzro","daisy3","vyzedis","fosixu","nipulyc","sirugel","wesica","wimywy","hopaty","dupyypud","zefiifez","wdewdewd","dekimy","fegemec","zeuzzeu","fijyvew","jijino","cyjoka","vumrm","gycuucyg","safofa","zxfzxfzx","lasaher","buvbuvbu","vupmpuv","tizefy","wygoogyw","dabifo","duligu","tidyseg","fyfide","mywarah","jogakoc","bbpef","iqgiqgiq","saboza","fehulen","sarefon","zutstuz","jvzdd","febyoybef","doluulod","xusaba","hesurog","toneveh","slybean","xowinec","hdsgq","zuhokoh","nmtnmtnm","vumasek","cyruuryc","qklgg","penozo","bogiva","pusumal","fahudi","bahokyx","kedyha","ynnjx","lucebof","bbxtv","mysari","cycuwek","xehono","vefuraw","pomuwul","lisizi","glwss","mehuwuj","jo_wi","gejpx","nedukes","vuhoohuv","xcfxcfxc","junybu","junimi","bihumyk","nosumex","wi_fe","kifuxow","we_se","figeti","kodasik","piwetim","zuwyjit","uxtxc","mjxof","nlwnlwnl","zutapy","laweki","bybake","daxyju","cugodi","fylyjor","monyynom","vibygu","mcrmw","kevazy","lubi_","pecycu","tfvtfvtf","kykemik","cyolu","jolidi","nu_ce","joloxi","jixupox","ukfek","behajuz","bapilyx","npgtc","vpaqo","worewem","fifefa","tekyxuh","kim_k","koxehy","rukupe","supahan","zewabo","oxstf","vawjwav","tefixip","luxmxul","sqaqm","gqbeb","dwvqg","koseran","qpzpqpz","oorzoorz","vijzjiv","fwqfwqfw","joraba","bavomy","darjrad","xesovez","bupu_","vonybij","tyfori","tumuxe","wycanu","wpbwwpb","bemikex","mokexod","juniraw","cativeb","sosiraz","nocalir","rammramm","gyxoku","useuseus","mepu_","soseho","wowotox","xo_gu","ibqtc","ysvysvys","fgpfgpfg","xotztox","cewiwig","cetavub","bogudo","oekkoekk","pemomet","cihyfok","bunapam","bamiza","eqzuz","susevu","weetb","bazyhyr","ekrfu","nozyoyzon","wymahi","sakufa","hyjihu","gineenig","nbpwp","nypuaupyn","rxmmy","kotacux","suweewus","hcvfk","szhuu","synth111","femaca","bozoty","gyjezyk","xfzra","hexovu","rooyf","fo_ne","lqgrm","xyzacog","somahy","dywaawyd","hcgghcg","lyhuly","leuleule","joyojoy","jelojuk","qoqxk","bebomu","jukyxys","raxoeoxar","tymyhyt","adnmn","xuzapog","cohhcoh","tuhyxi","cudoni","tpryu","nocmcon","hnyhnyhn","muzuka","siipsii","jonapa","bagbagba","tajesul","romaamor","xtwxtwxt","dawojoh","cojrn","duxowiw","fimtq","varsrav","ndrlp","aidru","gaduxuf","eayaeaya","mehiuihem","ldjmj","wijicu","xeghgex","tyboiobyt","wlrls","zzukzzuk","lixeoexil","manuunam","jakevan","gykwo","nolmlon","wewisal","zpgca","x_jet","mulupat","facexij","hockcoh","zpezpezp","hajexym","yevyevye","zu_ji","tmknp","hi_mu","vahyfi","luvixi","vibewax","vedakev","petitepug","packet","vexegu","lusijym","kalacy","fcolh","dehiihed","cydyso","kyrhryk"],["vikal","gobuvubog","vhsvhsv","hugat","dohyc","wujwujw","kakozokak","tawoj","suryx","kikesekik","vthhh","kinokonik","ropypor","vohoz","likyt","mdimdim","jicid","ipoipoi","yrgyrgy","fubav","kiliz","tylydylyt","befyd","ramux","sanyp","akgakga","dnpdnpd","zrszrsz","xenef","dahyx","kiboh","muhebehum","jeseh","jufyz","szyszys","goninog","cuxetexuc","donilinod","sakiwikas","winyl","jypymypyj","tajag","kaxalaxak","migelegim","jepaz","diduzudid","fzbfzbf","febipibef","rahyc","vowan","fanol","dovonovod","nokab","xeteex","vebvebv","raxubuxar","fagot","nbqnbqn","vimos","mihac","kagir","bqzbqzb","lefij","julaluj","vsfvsfv","gekih","gebibeg","zxvzxvz","hevex","betum","kifaf","hukez","hidikidih","wukuvukuw","mymvmym","dymajamyd","bikokokib","likukil","fowos","iibiibi","jazyzaj","ijrijri","newyz","rytotyr","dzbdzbd","ryreeryr","vugav","besox","kydod","dyjik","piypiyp","tysasyt","tuzywyzut","ponaz","fyreveryf","jehalahej","nimit","zowed","rupewepur","vecusucev","sorir","twutwut","fumahamuf","lomlmol","cyhez","wudyl","jyfotofyj","ruwoc","lulblul","zejok","xediv","rifyk","sirez","fokfokf","walllaw","nozor","keryz","mepoc","barer","vywvywv","himebemih","cimed","bpcbpcb","hyvvvyh","bysip","ridededir","hizzzih","sybun","xonex","ludum","bywawyb","wzawzaw","xhwxhwx","cipcipc","rokaz","vuvij","vkovkov","bxrbxrb","naxyc","odoll","fekaf","xufos","ebiebie","vyfaf","tuluulut","hekax","gicodocig","rkwrkwr","bifijifib","gvlgvlg","vyfof","fzifi","pyvekevyp","mumex","lutax","zugyz","xavym","zegoj","difetefid","ediedie","guhuuuhug","nikes","usuusuus","halubulah","mxnmxnm","banuwunab","uinuinu","aqiaqia","feceecef","cicaacic","qbdqbdq","govol","zuziizuz","zynanyz","tabasabat","ybiybiy","ludyvydul","zatymytaz","pekyfykep","giciicig","pehij","xwexwex","hefikifeh","lacusucal","hiwovowih","oppoppop","hufax","zzzao","lwslwsl","gusikisug","wufafuw","tusuc","kuhot","pizejezip","betyx","zurok","lalhlal","puxam","motyx","dibec","jysetesyj","xuvuc","hytis","nqfnqfn","zihyhiz","dimyp","gunyp","danob","fyzox","krykryk","gycod","rxprxpr","rssessr","femeb","vufvfuv","pydul","sifefis","mepap","romememor","wupyc","vurug","lerrrel","lalumulal","sywiv","suxuk","mopex","puror","cufcufc","xopid","lytobotyl","jyborobyj","nqwnqwn","fgqfgqf","futuutuf","pp909","vpkvpkv","xacurucax","nutonotun","hhkks","korupurok","fmnfmnf","ufxufxu","nadaadan","liluulil","rorhror","pupyn","iafiafi","voxajaxov","uqvuqvu","xyludulyx","cufas","fagggaf","ludludl","dusunusud","dojubujod","puwewup","vozizov","hyhohy","wngwngw","dihoz","hvwhvwh","tomefemot","cpmcpmc","gajob","zevzevz","zqmzqmz","tuwyd","tacuvucat","gewab","nitex","rokamakor","rosib","dynog","vosssov","kaludulak","kasusak","deeddee","nigggin","ibfibfi","qrrsq","romelemor","kicax","rociz","somipimos","zasuj","menic","etzetze","solix","gyzad","vozeh","qbvqbvq","bahuvuhab","isdisdi","cudiz","oqeoe","nibyr","vexuw","jakkkaj","sasdsas","odpodpo","kyjyfyjyk","jacipicaj","capys","sizuk","kifffik","sytigitys","nonyf","kilav","lpolpol","cujiz","vusugusuv","wicot","lzwlzwl","nylefelyn","gukaf","gesyw","fytawatyf","luliv","luvog","lakil","pitup","zumzmuz","xevot","lylaalyl","vazzzav","ryxexyr","mopug","powoowop","bybgbyb","colox","cavyz","tvthtvt","lydedyl","kupev","ztmztmz","vyrumuryv","puxif","tegiriget","sezig","defghij","jojem","gzsgzsg","nyhuz","zopur","pexydyxep","lizyzil","xumasamux","xuwuv","ronij","fyzig","syxylyxys","scrscrs","bilas","ywqywqy","yigyigy","gupoz","wolwolw","jucum","naonaon","lazaazal","sapat","jurezeruj","jedddej","giguw","suzsuzs","pifyb","dawyv","miwep","tupoxoput","mjcmjcm","fotiritof","xacej","denup","siseesis","rexeh","codez","cylaw","wyzazazyw","wakonokaw","cemyx","pidybydip","pokujukop","livamavil","pymamyp","xahup","bubiii","dokex","jenumunej","lisyrysil","lyvywyvyl","yvuyvuy","fefrfef","vexoz","rfcrfcr","zidatadiz","barucurab","lelih","putum","roryz","tejyz","zadolodaz","dimdimd","dusdusd","kavyvak","jynyynyj","regocoger","hwihwih","jazzzaj","neteweten","cyjabajyc","debyx","xulelux","popic","hebur","pbepbep","dajif","dynahanyd","jumej","fikyx","ticupucit","derod","kububu","jywec","werex","pinup","dyxydyd","wytud","cykok","dohiw","xaryrax","nepnpen","kovoc","mozur","yilyily","rddrddrd","cvycvyc","difobofid","hawax","wjowjow","jyryz","wozuz","lifid","xikokix","jeguxugej","vixygyxiv","muducudum","laxejexal","pfjpfjp","gyrex","jadjadj","kedafadek","rewiv","tykuz","mimaxamim","jopypoj","vexuj","fdzfdzf","vmevmev","merilirem","hybyz","bazif","bisyc","fywyv","sicus","npfnpfn","jyzipizyj","cetox","dewas","wugov","xejob","ggxox","nypun","jyfih","hidyc","gogkgog","vybububyv","mypex","lylotolyl","fcvfcvf","rexoh","xolalox","moryv","kedotodek","bukymykub","xydic","havytyvah","bucux","pipaaapip","jikusukij","xenap","mimaz","dokyh","etsetse","gusyj","nysyz","pspapsp","soruturos","iwviwvi","zahorohaz","juxahaxuj","ropyz","nenyk","zapihipaz","wybyv","qpkqpkq","vajyl","fihyx","zeruh","zikyrykiz","hunef","jixoc","ypmypmy","pyhat","zejot","kupap","robym","iceicei","xabiz","hesas","buwar","wurax","zevykyvez","momeoemom","gafop","toxef","mapipipam","zivel","dysyysyd","gibehebig","somezemos","zyzzyzz","semovomes","mujitijum","gygevegyg","ojdojdo","dawetewad","zunznuz","ckickic","imqimqi","heluvuleh","neanean","camux","rahoj","risovosir","debig","juxosoxuj","mohuvuhom","dupan","kupoj","lokolok","kukew","panpanp","fvssvv","jynjynj","wwgwh","bunaz","tomuz","hizezih","doric","ibeibei","miimiimi","nejab","romir","kowiv","cikyg","sukegekus","levigivel","tynininyt","rixoz","jyraz","vtrvv","kevar","naxuc","cyxed","laluv","lawol","nomyvymon","tudur","rzurzur","dufem","zebenebez","aqraqra","besyseb","yhbyhby","uzkuzku","hulyx","xapetepax","cufikifuc","vukor","dejdejd","lodooodol","ozolozo","fixug","zodixidoz","gohawahog","frifrif","tlgtlgt","kasysak","devox","bubhbub","wilonoliw","horiv","bbtbbtb","rusuusur","puxin","mqymm","riliilir","gologo","forihirof","foxynut","sowiwos","mqzmqzm","hidybydih","faxij","muluulum","bufagafub","kimasamik","pejolojep","sisucusis","ticuxucit","wabyj","oiizo","fiufiuf","wekop","pofez","dupux","vytuw","tadydat","nyrokoryn","xinipinix","gaxelexag","cyfot","nadddan","xymxmyx","rovevevor","cyjuz","revrevr","xiziizix","aajaaja","bujuujub","zaxev","towodowot","myraparym","wipivipiw","memzmem","jemozomej","cojavajoc","xezumuzex","ruxez","mocekecom","cohijihoc","wuloboluw","narov","xamak","wykiz","bimyl","hybez","lacam","doruburod","nuhyjyhun","fodis","negogen","nefih","fydutudyf","xeguw","roreheror","bbbwbbbw","byxox","jyxid","pyfyk","fftfftf","kutej","nanuunan","begis","wubifibuw","ytbytby","nadul","milyg","cdecdec","fkhfkhf","wudov","xbdxbdx","jatyl","gyjeb","diwan","rttrttrt","fykigikyf","navemevan","giguuugig","lfklfkl","zomir","madec","busuusub","hjhfhjh","fufqfuf","bolex","hynapanyh","hewam","nitemetin","bezoz","nymes","jagaagaj","slbslbs","rufyx","desac","otxotxo","coxeg","lepod","deceleced","kavox","zelaz","nicyc","wyfum","lokud","ckuckuc","nycujucyn","gydakadyg","zivocoviz","ssbssbs","mysar","hopydypoh","mukkkum","aaici","gazixizag","fykicikyf","nohono","cuwyz","gfggfggf","lesuhusel","loxexol","wuned","wipanapiw","ryfryfr","vahym","hikokih","umwumwu","pahhhap","gowon","komelemok","symej","sicyf","lypif","pacajacap","laces","limuhumil","luhusuhul","zrtzrtz","ftfftff","zixylyxiz","fyvfyvf","pamox","peleelep","nydadadyn","knuknuk","hisek","bejeeejeb","lipuc","daxyl","ttfbtt","mofyb","miwyw","kehyx","wovew","xakib","tosyn","ryxas","bohipihob","gedygydeg","yyixi","xuzop","cymakamyc","gecog","xanyk","fanaanaf","syzup","dixub","moteh","pewos","xezadazex","xigih","luxuz","fosoh","btvbtvb","gizonozig","pysajasyp","vibubiv","sadug","belim","nelit","hejabajeh","phiphip","wrewrew","masiz","tefij","bgbtbgb","jatanataj","sikiikis","koxac","satyv","sekaz"],["ossosso","iiviivii","xhhxhhx","siisiis","qllqllq","cycececyc","nnqnnqnn","sszsszss","ggjggjgg","uusuusuu","rrurrurr","annaanna","lyvyvyl","jururuj","qsqsm","susesus","favavavaf","jolol","mofof","bbqbbqbb","wffwffw","menenem","woowoow","ryroryr","hyhehyh","sehehes","xzzxzzx","nllnlln","kyykyyk","bahabahab","gyfyfyg","diziz","ttjttjtt","babebab","ssussuss","hixix","nynynynyn","farar","kookook","bbfbbfbb","gawawag","tucucut","teeteet","cifif","xyxex","nnznnznn","popppop","iqqiqqi","bixix","eereeree","lelal","bbbhbbb","tatataf","gugagug","hytytyh","sasysas","cicidicic","xapapax","nonolonon","cylyl","tutuutut","pisipisip","tycycyt","dwwdwwd","cccccccc","gynynyg","gejejeg","vhhvhhv","zymymymyz","dutut","kikkkik","dddgddd","mamapamam","jenenej","vadadav","kkakkakk","nogogon","mnopj","sasssas","wowiw","lebebel","katatak","offoffo","jicicij","hepepeh","puwuwup","wwgwwgww","wybyb","nezezen","tejejet","mimiimim","wofof","sysssys","pyfyf","jijiijij","mzzmzzm","dahahad","vinininiv","pakakakap","hahehah","doxoxod","susuwusus","zacacacaz","pphpphpp","lelekelel","vvovvovv","iifiifii","kklkklkk","pgpge","redis","siwiwis","xytyt","tamam","ririirir","bybabyb","xppxppx","rogogor","vggvggv","xururux","coco4","mivivim","tvvtvvt","refefer","myjyjym","nnxnnxnn","nydydyn","hususuh","xopopox","ipipr","hacahacah","tutusutut","zefef","dufufud","nakakan","ppyppypp","hhahhahh","fopop","jopopoj","ggfggfgg","znnzznnz","gwwgwwg","syxyx","immimmi","hjjhjjh","ppoppopp","bbybbybb","wwnwn","sisssis","sololos","ddnddndd","namaman","lalaxalal","byvyv","nonoonon","fffyfff","pababap","ooxooxoo","swwswws","cicycic","luhuhul","wiwewiw","yzzyzzy","sajasajas","ffkffkff","sesososes","rrqrrqrr","hahoh","tutatut","mawamawam","lttlttl","kkrkkrkk","cceccecc","jadadadaj","kkxkkxkk","dahadahad","cuzuzuc","jvvjvvj","juguguj","iisiisii","tyjyjyjyt","rycycyr","lupupul","cwwcwwc","wyywyyw","caracarac","nukukun","sozozos","hxhxo","ladadal","nyynyyn","rykyk","jojonojoj","jccjccj","zaxaxaz","fytyt","sififis","fivivif","mucuc","ttpttptt","mimem","ggrggrgg","wananaw","howowowoh","fekekef","emmemme","bysysyb","sukukus","syysyys","nbbnbbn","sylylys","sywyw","segeges","gagygag","ppcppcpp","podododop","wwxwwxww","tililit","hhwhhwhh","gasasag","super","xuluxulux","cnncn","fafaafaf","nenunen","ninenin","nuxuxun","jibibij","hojojoh","acacg","wybybybyw","tybyb","kiziz","kiwiw","rirur","fyfyyfyf","gazazag","nyfyf","mllmllm","wekekew","nonunon","cosososoc","ryrybyryr","uaauaau","tatit","calalac","uunuunuu","onnonno","dzzdzzd","bbabbabb","rypypypyr","tlltllt","vajajav","llkllkll","weded","bywywyb","ryfyfyr","wuwuuwuw","fofoofof","sisasis","zededez","wawew","lamamamal","mmwmmwmm","gikik","jepejepej","sututus","kekik","bafafab","zudududuz","eeqeeqee","bomomomob","zzgzzgzz","mucucum","cajajac","gicicicig","didikidid","cyhycyhyc","pohopohop","yykyykyy","guxuxug","kepep","zyjyjyz","yttytty","vffvffv","gojojog","tadadat","gycygycyg","lycycyl","totowotot","cycocyc","zerezerez","tereret","jejojojej","iimiimii","zttzttz","xyxoxyx","bhhbhhb","lizilizil","wexex","lylylylyl","wutuwutuw","tujujut","uuzzu","tugugut","syzyzyzys","zyxyxyz","qccqccq","ttvttvtt","zyzozyz","pudud","yyzyyzyy","fefufef","cohoh","wudud","iiziizii","ckkcckkc","bymymyb","riiriir","kkwkkwkk","cucuucuc","uttuttu","viririv","kalalak","poopoop","ywwywwy","dudugudud","veeveev","jjkjjkjj","wwpwwpww","aaoaaoaa","yydyydyy","ccddd","limimil","cucacuc","ojjojjo","zyzyyyzyz","donut","yffyffy","rytytyr","mazamazam","pklmn","papa_","doodood","vufuf","lososol","xexecexex","kysysyk","yuuyyuuy","nasasan","tyhytyhyt","sosisos","ruuruur","cupupupuc","pukukup","momohomom","wuxux","wawewaw","zjzjc","numunumun","bebibeb","pppzppp","recec","bison","kororok","pobobobop","jararaj","zererez","wujujuw","hhhqhhh","igiiigi","jizizij","jyxyx","ffyffyff","pynynyp","dlldlld","nebeben","gffgffg","llllllll","lolululol","jjyjjyjj","mumamum","vonon","gififig","vokovokov","vogogov","kyfyfyk","gzgz4","favavaf","oogoogoo","dhhdhhd","yyywyyy","ssqssqss","sesedeses","xiixiix","xzxzz","qeeqeeq","neveveven","vvgvvgvv","ijjijji","rrdrrdrr","uzzuzzu","fjjfjjf","sokokos","llzllzll","wiciciw","yyayyayy","hexex","heeheeh","fufif","gegigigeg","yyhyyhyy","tonon","nafaf","fololof","dixix","rosos","buhuh","mododom","iikiikii","nenanen","soxox","vuvyvyvuv","kffkkffk","zememez","rurirur","fufukufuf","tepep","volovolov","pxxpxxp","wycycyw","qyyqyyq","zuvuv","zizez","jjdjjdjj","xooxoox","wwowwoww","vuhuvuhuv","hyjyj","fababaf","banana","rrgrrgrr","havavah","cuguguc","rrrrrrrr","winin","fwfwu","fokokof","eyyeyye","fumumuf","kikuk","comet","llallall","tamamat","wywyfywyw","fefe_","cepepepec","nanaanan","vavahavav","fofopofof","jybybyj","ratatar","rrmrrmrr","xororox","juujuuj","bikibikib","kesesek","vivi_","rafafar","lawawawal","wiwywiw","pononop","xypypyx","zizifiziz","guguxugug","wyjyj","sijij","pyvyv","vovavavov","zezyz","jijipijij","lwwlwwl","bifififib","fifufufif","yyvyyvyy","nunuxunun","mididim","vzzvzzv","fyhyhyf","wafafaw","dadidad","nidid","laser","bigigib","tagagat","pypy_","popyp","tutufutut","vyryryv","rucucur","zzozzozz","ajjajja","gaagaag","ryriryr","rokokor","dynydynyd","skskb","sysosys","cccdccc","ezzezze","queue","tetytytet","zimimiz","nahahahan","lesesel","mumomum","nafafafan","wmmwmmw","nememen","muwuwum","gmmgmmg","vvzvvzvv","xikikix","jejefejej","vvvwv","bejej","hffhffh","nawaw","hejejeh","rumumumur","ppippipp","bppbppb","llwllwll","snnsnns","tuxuxut","huhohuh","cxxcxxc","tubub","kohohok","ugguggu","qqxqqxqq","borororob","vinyl","ptpts","dihih","silil","nnknnknn","piwiwip","lahahal","kececek","humumumuh","aawaawaa","didad","huuhuuh","ccaccacc","pecec","zjjzjjz","lhhlhhl","nekeken","googoog","fahahahaf","hhihhihh","tipipipit","hykykykyh","lefefel","bururub","wexexew","jetet","ffxffxff","voxoxov","cycycycyc","nunenenun","mffmffm","hhnhhnhh","ttnttntt","nododon","jimimij","googgoog","nehehen","kijij","oyyoyyo","pememep","pesesep","poxoxop","memamem","sosasos","mazazam","susasus","zzizzizz","ffwffwff","wtwwwtw","bylylylyb","vuvev","buruburub","hihiwihih","rawawawar","tetedetet","cezezec","wawuwaw","gepepeg","vererev","titixitit","lytyt","vapapav","foroforof","sovov","pihih","noonoon","pepipep","gssss","paris","spsssps","fohoh","rkkrkkr","gogygygog","txxtxxt","wbbwbbw","ririiirir","dddyddd","pududup","lbblbbl","nexus","zodod","jewewej","tttttttt","gogorogog","rrfrrfrr","hewew","hhfhhfhh","modem","mamomam","gakakag","uufuufuu","popip","uuwuuwuu","bbobbobb","ccpccpcc","fororof","wususuw","ammamma","yeeyeey","mamaamam","beebeeb","ueuep","iiciicii","lulal","gadadadag","ssrssrss","tununut","vololov","xssxssx","annanna","sororos","aaaaaaaa","hyhyyhyh","lijijil","ryrykyryr","nyryryn","wewejewew","hagag","kvvkvvk","cccxccc","zapapaz","fifitifif","xonononox","jylylyj","fyxyx","nynnnyn","bubbbub","jijjjij","accacca","tydydyt","feefeef","bibixibib","masasam","yywyywyy","zatazataz","pptpptpp","kytytyk","nevev","lyly_","zozazazoz","coral","tovov","dumum","pazaz","hhthhthh","datat","hututuh","cucicuc","ttwttwtt","pimimimip","memeremem","gehegeheg","gegogeg","xaxaaxax","wenenew","uiiuiiu","hahuhah","ziwiwiz","uyyuuyyu","kjjkjjk","nndnndnn","kymym","susuzusus","ccuccucc","gegezegeg","bubu9","micimicim","vyvivyv","epeeepe","hhvhhvhh","zazamazaz","rhhrhhr","gugogug","nelelen","syhyhys","aasaasaa","rohohor","dedeeded","nnrnnrnn","cacalacac","bubuubub","lisisil","hiihiih","rorir","tususut","wigig","lilitilil","dokokod","rrlrrlrr","nomomon","nujujun","mududum","ccqccqcc","jijej","xydydyx","mymyjymym","fyxyxyf","fininif","rorrror","zzzzzzzz","qqtqqtqq","sitit","wttwttw","mmzmmzmm","yppyppy","gyhyhyg","sowowowos","papaapap","zetetez","wywawawyw","qrrqrrq","pywywyp","sysypysys","wipipiw","hevev","vyvevyv","sypypys","pososop","rafaf","lyylyyl","mixixim","rumumur","xysyxysyx","lujujul","dadadadad","sppspps","zovozovoz","uujuujuu","bubuxubub","bemememeb","zzuzzuzz","ximiximix","nyxyx","vupupuv","mebeb","bubab","llbllbll","dixixid","nututun","ttuttutt","cububuc","bugug","gigagig","rarurar","xawaw","nosososon","ppfppfpp","dififid","llxllxll","rrprrprr","tozoz","dememed","tisitisit","qkkqkkq","nunnnun","iggiggi","jymymyj","lynynynyl","pupypup","uqquuqqu","rllrllr","uuxuuxuu","llljlll","trrtrrt","kcckcck","xttxxttx","gugigug","hahohah","melon","nxxnxxn","xiviv","kososok","nuvuvun","novovon","vaxaxav","zebebez","oggoggo","pumum","zezuzez","babarabab","korororok","wuwuuuwuw","sasajasas","xoxocoxox","mararam","lolllol","ciziz","vumumumuv","cocec","hdhdf","nunononun","jmmjmmj","husuhusuh","sititis","bufufub","gigiigig","yyxyyxyy","kizizik","kykakyk","nngnngnn","vvmvvmvv","ceeceec","fubub","sysisys","tttfttt","ggoggogg","qbbqqbbq","lymym","cecerecec","dagagad","hopopoh","vyvvvyv","velevelev","jehehehej","bzzbzzb","gssgssg","pezez","qqzqqzqq","zsszssz","didi_","wwrwwrww","fipipif","tyytyyt","heveveveh","cininic","zixixiz","xexesexex","eeaeeaee","fuwuwuf","gococog","livilivil","momamamom","bybyjybyb","azzazza","buhuhub","bycycyb","vazazav","gykygykyg","rococor","totootot","ccrccrcc","zynyn","lovov","wihihiw","tavavat","vamamav","sslsslss","bbhbbhbb","sejejes","sifif","xulululux","bococob","bobabob","gguggugg","pprpprpp","nunanun","kasas","femefemef","xeexeex","pipiipip","fihihif","cyfycyfyc","pozoz","gibibig","dewew","poppy","xffxffx","rezezer","pipppip","mebebem","mxxmxxm","dylylyd","netet","cchcchcc","mmammamm","veveevev","mororom","xnnxnnx","hahihihah","synynys","cetetec","sssvsss","llillill","viveviv","mysysym","xixxxix","ssyssyss","golem","depep","rereerer","wodowodow","vowowov","zzyzzyzz","bggbggb","zzezzezz","nirir","yybyybyy","vuvavuv","hypypyh","xyhyhyx","ihhiihhi","kfkfy","vvqvvqvv","zununuz","rekeker","vatatav","susisisus","faafaaf","kufukufuk","vuvuwuvuv","yxxyxxy","jihihihij","wynynyw","qpqpm","jututuj","ooyooyoo","kikakik","fararaf","lomomol","muwuwuwum","lgglggl","pycycyp","fududuf","wawaawaw","vovavov","fowowowof","lyxylyxyl","sikikikis","seleles","yiiyiiy","kknkknkk","eexeexee","belebeleb","tawaw","zususuz","jivivij","tpptppt","hoho7","pmmpmmp","cycuc","vuvuhuvuv","sesekeses","lilelil","dudododud","viciciv","sisi_","ggiggigg","hasasah","dqqdqqd","hececeh","zuvuvuz","jyyjyyj","oozoozoo","viriririv","ffpffpff","bxxbxxb","fppfppf","qggqggq","hivihivih","rewewer","ponmnop","vynynyv","fojoj","affaffa","hhuhhuhh","didicidid","sbbsbbs","jededej","pepejepep","xananax","kylylyk","qqhqqhqq","ficicif","vezezev","fatafataf","rurupurur","nhhnhhn","xuhuhux","dazaz","dypyp","gefef","bubabub","mylylylym","rapid","ddmddmdd","llcllcll","fafuf","mmemmemm","ccmccmcc","zzszzszz","muzuz","fananaf","zuuzuuz","zzqzzqzz","pupupupup","nawawan","ssjssjss","bisibisib","nynyjynyn","rgrrrgr","jiwiw","cyycyyc","vjjvjjv","ttxttxtt","dytytytyd","wykykykyw","zozozox","ddtddtdd","rbrbb","cyxyxyc","hhyhhyhh","hororoh","nyryr","dijij","lererel","goxox","rujujur","jumumuj","lilllil","vuwuwuv","webeb","fofoo","vefefev","wwuwwuww","sosovosos","xukukux","ueeueeu","vebebebev","oopoopoo","fufafuf","kususuk","salalas","zamamaz","jedejedej","dewewed","ikkikki","voovoov","gahah","syrysyrys","ccbcb","pawaw","vufufuv","ryreryr","xepepex","uuluuluu","zisisiz","jujubujuj","bijijib","nncnncnn","kykyjykyk","dyydyyd","xodod","voxel","popomopop","clccc","donononod","cedar","fqfqg","tononot","gylyl","irrirri","setetes","cetet","kuvuvuk","zuzuduzuz","kikykik","nagagan","yyryyryy","zezepezez","ddhddhdd","cyryryc","pupuupup","tijij","hizizih","vddvddv","ttattatt","qiiqiiq","kywywyk","cycy6","zllzllz","lobob","holol","zezozez","ittitti","vafafav","fylylylyf","fyfypyfyf","zezezezez","lufuf","jinininij","likikil","titikitit","zikikiz","hyhahyh","mmlmmlmm","weweewew","gumumug","rywywyr","gavavavag","mererem","hyhohyh","wyzyz","tazaz","vapavapav","frrfrrf","yyyhyyy","zozojozoz","wnwwwnw","dezez","kededek","brbri","vnvvvnv","nuhuhun","lububul","edeeede","dduddudd","zezoz","sewewes","gufufufug","damamad","fydydydyf","nanapanan","rovorovor","cacadacac","kukupukuk","zzfzzfzz","tajaj","wumum","eeueeuee","zuwuzuwuz","iixiixii","howowoh","retereter","dumumud","hexexeh","mymyymym","lygylygyl","cafafac","jjejjejj","gicicig","mybybym","tevev","newewen","lulilul","jjljjljj","tytututyt","nywywywyn","wafaf","jiwiwij","pururup","fnnffnnf","cyxyx","giigiig","wylylyw","suuuu","booboob","halalah","fwfwx","pepip","gyyggyyg","corororoc","fftfftff","dizizid","dasasad","iijiijii","cewewec","gyygyyg","decedeced","oorooroo","tobobot","mimitimim","xxhxxhxx","hadadah","popupop","ruwuwur","jaxax","varar","vuvuuvuv","miniminim","ffiffiff","qqqqqqqq","hazel","diidiid","fububuf","hykykyh","fafyf","xyxy_","ddgddgdd","popapop","detet","wududuw","lajaj","ooaooaoo","kttkttk","lewew","kycykycyk","yyuyyuyy","nuzuz","lehehehel","mononom","chhchhc","lafalafal","ggwggwgg","qyyqy","xxexxexx","eiieiie","comomoc","tatanatat","tjtttjt","gmgmz","celel","pddpddp","jjajjajj","lyhyh","jojaj","fificifif","rymyrymyr","lyxyxyxyl","fususuf","zococoz","pifififip","uuauuauu","takakakat","kkekkekk","pkkpkkp","vvavvavv","yyyyyyyy","wwtwwtww","ttottott","rebel","sonic","arrarra","ffeffeff","lelllel","vunuvunuv","nucucun","ddbddbdd","kononok","vygygyv","wwkwwkww","xekekekex","roryror","tetytet","gzzgzzg","xaaxaax","mususum","byybyyb","zuluzuluz","fufaf","duuduud","cllcllc","papakapap","yynyynyy","mumimum","gexexeg","ciciicic","totytot","musus","gagigag","xykyxykyx","pipepip","nnbnnbnn","gkkgkkg","majajajam","zyxyx","fbbfbbf","lolololol","dakakad","xykyk","gugumugug","higigih","gccgccg","xiririx","bexex","sysesys","zuhuh","hehehef","zofof","eieiu","dydidyd","zygygyz","huhuzuhuh","pififip","vewewev","xuxaxaxux","casacasac","febebef","tqtqe","kypypyk","kukik","xyyxyyx","nmmnmmn","zyzezyz","lylynylyl","pyjypyjyp","fifefif","ubbubbu","hyper","ettette","qxxqxxq","lalulal","tebebet","ozzozzo","duzuz","htthtth","etetn","pimimip","aauaauaa","pididip","jupupuj","nunen","lazazal","zcczccz","sasisas","fgfga","fexexef","xxnxxnxx","bbwbbwbb","rvvrvvr","oosoosoo","kkzkkzkk","meremerem","guguugug","ssdssdss","hurur","tororot","kememek","wawamawaw","wiziz","xyxyjyxyx","kggkggk","ccyccycc","pyhypyhyp","xuxexux","vigig","daxaxad","fifiifif","ztztb","tower","lojoj","jovovovoj","nywyw","c0c04","levevevel","gizizig","cecicec","naninan","nynytynyn","dyxyxyd","gogoogog","jonojonoj","ruhuh","pititip","yqqyqqy","kabakabak","zotototoz","rihih","fememef","pccpccp","peepeep","tatetat","batat","lybylybyl","najaj","sahahas","uuuuuuuu","rrarrarr","ruhuhur","hghgp","hihiihih","ruzuzur","bogogob","udduddu","popipop","dnndnnd","ollollo","mkkmk","makakam","pyjyjyjyp","lmmlmml","gisisig","womomow","lalapalal","fococ","ynnynny","vvyvvyvv","walalaw","ciriric","xelelex","xyxyyxyx","lononol","fofifof","ttettett","jijujij","hababah","nykykykyn","bzbbbzb","zzvzzvzz","rugugugur","prrprrp","rubub","nolonolon","hururuh","mimamamim","gamer","fadadaf","hxxhxxh","juvuvuvuj","fmmfmmf","camamamac","runununur","xxxxxxxx","satatatas","magma","bbebbebb","fototof","czccczc","vivisiviv","goxoxog","cicibicic","didydydid","pysysysyp","huhohohuh","vrrvrrv","sllslls","kimimik","vatavatav","nvvnvvn","xyryxyryx","mububum","ruruurur","vyvyyvyv","nejejen","jffjffj","vvpvvpvv","fereref","mnnmnnm","gucucug","eggegge","aooaooa","kakawakak","vururuv","vuvu_","nono_","hyhihyh","gatatag","vomomov","bikikib","ootootoo","aazaazaa","bllbllb","wewowew","mipipipim","ttkttktt","mamaxamam","pununup","xihihix","nikikin","geleleg","huhu_","vexexev","jititij","oohoohoo","relic","rrwrrwrr","tosotosot","sasaasas","zezebezez","lunar","aaxaaxaa","pipivipip","noconocon","vvvivvv","gigisigig","gygegyg","papupap","fizizizif","xukuk","avvavva","ooqooqoo","rymymyr","yylyylyy","vevyvev","mydydydym","dititid","ropopor","qffqffq","lddlddl","hiwiwih","zububuz","xaxafaxax","xxkxxkxx","copopoc","susu7","wowuwow","eqqeqqe","tzztzzt","sysususys","wqqwqqw","camamac","muvuvum","sshsshss","yycyycyy","xoxooxox","ssmssmss","vigigiv","hehejeheh","ddcddcdd","rrkrrkrr","gegigeg","wwlwwlww","toto_","buubuub","fafyfaf","wawywaw","vvvsvvv","xggxggx","hefefeh","jiijiij","momosomom","tyxyxyxyt","lynyn","dajaj","zttzzttz","ooeooeoo","rggrggr","ugguuggu","kokikok","dodadod","wywyywyw","kefefek","tegeg","kococok","tububut","wasawasaw","uyyuyyu","qqyqqyqq","tytotyt","vadad","huhuhux","hototoh","szzszzs","xyzyxyzyx","runun","hyryryh","rusus","cejejec","zizzziz","totytytot","vllvllv","fqqfqqf","tomomot","vkkvkkv","lococol","xowowox","hibibih","cynynyc","gogoxogog","ziririz","jininij","hwwhwwh","wwiwwiww","xexoxex","jrrjrrj","divivid","xaxox","jenen","jynynyj","aggagga","kukakuk","qaaqaaq","robobor","tulip","fytytyf","tururut","hyxyxyh","linux","savavas","tenenet","qqkqqkqq","jwwjwwj","tucucucut","coror","todododot","cizizic","ketetek","tytyytyt","fhhfhhf","fufuufuf","hozozoh","piziz","orrorro","lymymymyl","durur","geneneg","zycycyz","poror","metetem","rooroor","nexexen","oobooboo","nipinipin","qzqzw","river","pypipyp","safafas","jajyjaj","duwuw","rrxrrxrr","disisid","wetetew","xagagax","ruru0","zzlzzlzz","kpkpz","pypep","nnjnnjnn","limilimil","hoxoxoh","mssmssm","ryvyvyr","taxax","nojojon","sononos","ssvssvss","bqqbqqb","aalaalaa","sekekes","kadadak","xoxaxox","satat","tetejetet","pulupulup","bebezebeb","nnpnnpnn","neteneten","bbxbbxbb","mmgmmgmm","ssbssbss","qjjqjjq","releler","zahahaz","kekakek","xjjxjjx","nnonnonn","xxlxxlxx","rryrryrr","nililin","mycycym","mhhmhhm","tuvuvut","susysus","kaxax","zyxwxyz","hahhhah","titatit","jjtjjtjj","fymyfymyf","xoxoroxox","fiwiwif","rirerir","eeveevee","mymy_","ryzyzyr","vititiv","eegeegee","bbblbbb","pavavavap","fiifiif","izzizzi","vepepepev","kikukik","focofocof","tafafat","tehetehet","hhchhchh","dadddad","iwwiwwi","rygyg","pixixip","yvvyvvy","mwwmwwm","pttpttp","jececej","kevev","viriviriv","didiidid","eeeeeeee","pefef","nivivin","deddded","kakaaakak","puzuzup","koror","nydydydyn","mmmrmmm","hkkhhkkh","ullullu","cggcggc","vbbvbbv","cnncnnc","uuzuuzuu","jycycyj","fizifizif","jpjjjpj","momimom","jogojogoj","tete5","ragagar","lejejel","jaja5","nuunuun","nululun","hixixih","hkkhkkh","nntnntnn","muxuxuxum","jlljjllj","udddd","pmpppmp","moxoxoxom","hininih","saxaxas","ppmppmpp","bbibbibb","fylylyf","zzmzzmzz","rerrrer","dadagadad","nnnnnnnn","jzzjzzj","zizoziz","sese_","rebeber","wiwimiwiw","wafafafaw","tanan","deleled","fnnfnnf","mmfmmfmm","pmmppmmp","cicucic","oqqoqqo","memymymem","mqqmqqm","didod","coboboc","takak","xxwxxwxx","carar","qqaqqaqq","ggxggxgg","iiiriii","bivivib","dodoodod","bubyb","llolloll","xojoj","ffmffmff","okokt","zrrzrrz","nesesen","vnnvnnv","zewewez","semesemes","zazuzaz","kkfkkfkk","mababam","jecejecej","wwmwwmww","sawaw","mmommomm","uffuffu","cuxuxuc","wjjwwjjw","xomomox","maamaam","tutat","zuzuguzuz","wiwiwin","lzzlzzl","sqqsqqs","wapapaw","bibiibib","jezezej","byryryb","kyykkyyk","wwzwwzww","geseseg","vavyvav","mesesem","zananaz","lolelelol","kacacak","ppkppkpp","rnnrrnnr","niniinin","telel","riziz","vwwvwwv","yjjyjjy","errerre","cogog","qqwqqwqq","xuvuv","rixix","mycymycym","ffhffhff","wewiwew","nufufun","wejejew","fkfffkf","ffffffff","kokukok","dajajad","rjjrjjr","bybyvybyb","jajojaj","gupupug","debug","jyryryj","zuzuuzuz","mozoz","fegegef","wacawacaw","farararaf","laxaxal","hhhehhh","cqqcqqc","ziviviviz","fxxfxxf","lemon","bununub","gafafag","rugugur","oofoofoo","kaka2","kukubukuk","hihuh","cycynycyc","suwuwus","tggtggt","muxux","kufufuk","mccmccm","sacacas","wikikiw","jjgjjgjj","heehheeh","pzzpzzp","pofofop","iooiooi","fefeefef","sjjsjjs","rudud","giwiw","hihyh","lowolowol","xyxexyx","wydywydyw","xuxxxux","rurarur","wajajaw","bohoh","mujujum","lykykyl","goror","nssnssn","voviv","bofofob","hahapahah","zololoz","mykyk","roro_","jifijifij","jokokokoj","roraror","ppxppxpp","mamimam","xegegex","urrurru","daadaad","beveveb","cecacec","nududun","babaabab","thhthht","nahahan","zqqzqqz","lllnl","jamamaj","vvsvvsvv","zucucuz","gogosogog","ttyttytt","tytetyt","wywygywyw","xijijix","hyzyzyzyh","xaxacaxax","xamam","magic","vffvvffv","jozoz","hoho2","zavavaz","jezez","tipipit","ieeieei","pypepepyp","vypyvypyv","jyjijyj","rexex","mmmmmmmm","dixixixid","lelylel","totititot","hylylyh","nodonodon","matatam","sysyysys","tutui","lululux","vululuv","nwwnwwn","jyjajyj","tytylytyt","wwnwwnww","tuhuhut","fifikifif","sosesos","foxox","mapapam","tokok","dudodud","puupuup","sururus","hofofoh","tyxyx","jumumumuj","hihyhyhih","zyzyfyzyz","qzzqzzq","tososot","xevev","rqrrr","mmtmmtmm","tddtddt","sffsffs","vilil","tojoj","hydyd","gowowog","zohohoz","neneenen","masas","sugugugus","husususuh","qqgqqgqq","kififik","wiziziw","pepexepep","nunuunun","tababat","lsslssl","bbrbbrbb","dysys","ddoddodd","hihuhih","ppdppdpp","rojoj","jexexej","cikikic","ymmymmy","kktkktkk","zawawaz","beheheb","dococod","xazazax","rffrffr","wykykyw","ihiih","tjjtjjt","gyvyvyg","pomomop","wuvuvuw","nywywyn","pufufup","xixux","febefebef","dffdffd","juhujuhuj","rrrwrrr","fuvuv","cucecuc","pododop","fuzuzuf","pucucup","wacac","bjjbjjb","wypypyw","zororoz","cyfyfyc","cusususuc","cimimic","pidid","luuluul","milan","kevevek","dafafad","bowobowob","jojujoj","gucugucug","tnntnnt","jyzyz","babbbab","mimicimim","xypyxypyx","vovuvov","xddxddx","kzzkzzk","zkkzkkz","xuxujuxux","wiwiiwiw","xttxttx","ttrttrtt","eaaeaae","qssqssq","aiiaiia","hohonohoh","honon","pilot","krrkrrk","lomom","iitiitii","nanunan","sikikis","ennenne","nninninn","vuvivuv","zusus","oppoppo","cededec","zititiz","sosasasos","cocccoc","nypypyn","zukukuz","zararaz","lezelezel","dssdssd","xususux","bujujujub","jajaajaj","rarorar","fhfha","navavan","rrzrrzrr","fyfefyf","fynynyf","duduvudud","phhphhp","samamas","aakaakaa","ffgffgff","huhihuh","brrbrrb","eekeekee","nodod","migigigim","jafaf","hycycycyh","rllrr","deteted","zyzyjyzyz","mmimmimm","xovovox","aafaafaa","ferer","piviv","lururul","xwwxwwx","logic","bupup","gikikig","sekesekes","mininim","felelelef","ssxssxss","tylylyt","xaxoxax","wapapapaw","ckkckkc","vivvviv","zicic","zazaazaz","cevevec","jujuujuj","tehehet","wakakaw","hygygyh","zozyzoz","jnnjnnj","xaxaaaxax","mibibim","lysylysyl","dikikid","jafafaj","bebububeb","jjvjjvjj","lipipil","eefeefee","xizizix","babib","gvvgvvg","kupup","vexex","dehehed","bibebib","zofofoz","papypap","juju7","tininit","pororop","jepep","boboa","gkkggkkg","zozogozoz","ccsccscc","vipipiv","geweweg","bovovob","lylllyl","srrsrrs","fozozof","rabababar","ddlddldd","kukusukuk","kakyk","eejeejee","zzwzzwzz","zagag","wywydywyw","nififin","dydididyd","fyfafafyf","xecec","cimim","cagagac","zezzzez","tutotut","ululy","kyky_","zumum","kukuukuk","byxyx","upuuu","sysus","xyxixyx","nana9","ffdffdff","neeneen","jexex","wyrywyryw","khhkkhhk","cffcffc","pigigigip","jjzjjzjj","hafaf","fixixif","ytytf","ggqggqgg","mymybymym","bididib","hhrhhrhh","jikik","nilil","iiuiiuii","ee777","bybyybyb","sycycys","cywyw","xoxuxuxox","ryryyryr","vececev","wywycywyw","kpkkkpk","tuwuw","kykokyk","rololor","wrrwrrw","kkbkkbkk","kininik","quuquuq","kicicik","didddid","oomoomoo","demon","jecec","kazaz","xixexix","gahahag","zasas","cucuxucuc","ahaaaha","camam","lagagal","kkkwkkk","iiqiiqii","pamamap","wppwppw","wzzwwzzw","deveved","hhhjhhh","nomad","nimimin","zddzddz","tytototyt","zzzfzzz","gglgglgg","basas","eeoeeoee","zacazacaz","attatta","hahaahah","waxaxaw","tata_","vppvppv","iyyiyyi","ddpddpdd","rxxrxxr","fofojofof","huhehuh","cofofofoc","cczcczcc","cililic","vurururuv","lolelol","zypyp","xexix","sstsstss","ffqffqff","ttcttctt","dkkdkkd","dodo3","haha9","zppzppz","yygyygyy","ivvivvi","satatas","fifirifif","vvxvvxvv","bibbbib","zhhzhhz","ddkddkdd","uuruuruu","vuzuz","zezelezez","yyfyyfyy","xaxahaxax","kekikek","hihehih","llullull","wululuw","haxaxah","gyvyv","cadadac","vikikiv","xacacax","illilli","brbre","vovovog","dicicid","wowewewow","kukykuk","mkmkj","hohyh","ayyayya","avaaava","setet","exxexxe","fofuf","kkvkkvkk","pllpllp","kkhkkhkk","ninononin","cacccac","ihiiihi","tsstsst","eccecce","ripip","nugugun","kekeeekek","wiiwiiw","popapapop","xixiixix","xqxxxqx","ricicir","wwhwwhww","ralalar","dipipid","vava4","yyeyyeyy","decececed","cifific","cycyycyc","crrcrrc","fefemefef","wuwu4","mydyd","typyp","kepepek","fafavafaf","sasalasas","xrrxrrx","qquqquqq","yyyiyyy","depeped","felelef","jhjhq","pehehep","geneneneg","tilitilit","byryryryb","dodedod","davavad","wywowyw","llhllhll","nakakakan","rrvrrvrr","dykykyd","wwvwwvww","vebevebev","suhuh","cicocic","qqjqqjqq","vegeg","iihiihii","bipipib","jojej","nggnggn","ggvggvgg","kkckkckk","dawawad","ceceecec","pydydydyp","viper","ddjddjdd","jebebej","xexaxex","ovvovvo","hococoh","bibyb","kumumuk","lididil","pwwpwwp","gyryryg","wycycycyw","lljlljll","zozuzoz","ebbebbe","cazaz","kekedekek","lylyylyl","nnmnnmnn","gogug","dexexed","lrrllrrl","uuvuuvuu","ddvddvdd","susulusus","kkkkkkkk","wuwywywuw","zexexez","xoxuxox","dibibid","bimimib","nanonan","kkjkkjkk","naxax","fibifibif","niririn","bonus","vevuvev","yllylly","hududuh","zorororoz","wuhuhuw","cydydyc","rurrrur","syjyjys","yypyypyy","xyxyryxyx","lilisilil","xbbxbbx","tytttyt","sopopos","kokykok","seesees","hywywyh","myxyxym","fufffuf","ccoccocc","iiriirii","nopopon","mobobom","ccbccbcc","fyfufyf","xydyd","byvybyvyb","jererej","vuuvuuv","dqdddqd","bssbssb","nefefen","gugygug","rerar","lnnlnnl","ddeddedd","wununuw","gege_","bumumub","aqqaqqa","mmdmmdmm","dohodohod","bahahab","rrbrrbrr","nffnnffn","mmdmd","mrrmrrm","lawawal","gababag","cejecejec","bkkbkkb","levevel","jyjijijyj","wjjwjjw","cyzyz","iiwiiwii","dukukud","rakakar","senenes","aaataaa","gxxgxxg","pupuhupup","ookookoo","hdhdw","axxaxxa","fypyp","nuvuvuvun","dejedejed","befefeb","bobo5","midid","ttfttftt","oocoocoo","basil","zffzffz","sipip","ssossoss","fatat","llyllyll","lalolal","dipidipid","ninonin","xpxp4","zonon","locococol","rorooror","cacaacac","sexex","pululup","poker","wibibiw","shhshhs","tutet","xuxoxux","sobobos","memumem","gagig","bomomob","kezezek","bopopob","paxaxap","mimymim","sixixis","rolololor","texex","nnynnynn","fwwfwwf","gggggggg","vvuvvuvv","ccfccfcc","fididif","lihilihil","unopq","naxaxan","hijkjih","famamaf","susosus","hehyheh","rysysyr","cucycuc","kakaakak","llnllnll","davav","heheeheh","wuuwuuw","kykykyg","zzvzv","xexuxex","lalaalal","jjjjjjjj","gjjgjjg","jyjoj","miwiwiwim","pezezep","rara_","kokkkok","hohotohoh","jjbjjbjj","memeemem","aayaayaa","hhlhhlhh","uppuppu","ffrffrff","xxqxxqxx","jgjgd","dvddv","nisinisin","nymymyn","kototok","rwwrwwr","wwdwwdww","cciccicc","wewelewew","tiitiit","petetep","dexex","vepepev","gppgppg","bobbbob","eeseesee","xakakax","kekeekek","vivev","momumom","vmmvmmv","tivivivit","uoouoou","joboboj","nnwnnwnn","nynunyn","dacac","hhshhshh","bewew","cvvcvvc","tttnttt","momem","jacacaj","gwwggwwg","coxoxoc","hoho_","gigirigig","xxzxxzxx","lobobol","razazar","bototob","cavacavac","l3v3l","xyxax","roxoxor","malalam","mijimijim","gujujug","myfyfym","vokok","xhhxx","dezezezed","tynynyt","bekebekeb","wododow","jononoj","hhbhhbhh","aaraaraa","kppkppk","tapapat","rrhrrhrr","wawwwaw","kikiikik","vvwvvwvv","sonononos","fefyfef","bicicicib","lopop","kiwiwik","zznzznzz","kenenek","ssksskss","jijijijij","woxowoxow","hyhhhyh","rurerur","juwuwuj","jjcjjcjj","iuuiuui","rococ","liwiwil","wwcwwcww","bugugugub","cocycoc","meemeem","neneeenen","ravavavar","licicil","eeweewee","xababax","xxpxxpxx","jitijitij","ssssssss","addadda","ffjffjff","nemenemen","ttgttgtt","sipipipis","pplpplpp","vyvyvyx","pexexep","hawaw","njjnjjn","zmmzmmz","nokokon","vovoovov","ppbppbpp","qqbqqbqq","susuusus","rotototor","memymem","rekereker","zuzizuz","gygggyg","caxacaxac","ppzppzpp","jisijisij","xyxxxyx","bmmbmmb","iieiieii","fflfflff","tebetebet","falalaf","llqllqll","sibib","eddedde","lexex","xxyxxyxx","ryrororyr","regeg","bososob","degegeged","kawakawak","kololok","numumun","tataratat","fajajaf","gagasagag","bobo1","tohohot","dujujud","gysysyg","dyzyzyd","wyxyxyw","sisiisis","jococoj","tylytylyt","wowoowow","bpbpo","dedided","aahaahaa","oyoyj","kababak","vififiv","rrerrerr","qooqooq","japapaj","cuhuh","rssrssr","pokokop","pavavap","jjhjjhjj","jjrjjrjj","depepeped","kucucuk","perer","juzuz","xxaxxaxx","xezez","cicijicic","desesed","dodud","xobobox","titigitit","memezemem","uxxuuxxu","lititil","zztzztzz","tififit","qvvqvvq","viziziv","ississi","wuwiwuw","hiziz","assassa","gararag","sococos","rqqrqqr","xufufux","lolalol","bujujub","noxoxon","xxmxxmxx","xmmxmmx","hmmhmmh","micicim","sadadas","pupipup","kujujuk","xavav","qqsqqsqq","wobobow","gogygog","bddbddb","caxaxaxac","tococot","rititir","kududuk","fupupuf","hihhhih","cusus","pizizip","sisiiisis","vohohov","wetetetew","nutut","dodolodod","kararak","nwnwv","rirrrir","wwqwwqww","hivivih","ppappapp","kululuk","dodddod","vimimiv","xivivix","bixixib","kakokak","deredered","vususuv","zyzyyzyz","pipopip","ejjejje","jssjssj","hyjyjyh","smmsmms","pytytyp","nyjyjyjyn","uutuutuu","mamymam","kkskkskk","ryhyh","gjgggjg","rujuj","mmmxx","jozozoj","himimih","vacacav","ygygv","qqcqqcqq","wiwowiw","zanazanaz","dadazadad","kuku5","rexexer","xetetex","cujujujuc","mipimipim","mjjmjjm","rivivir","vujujuv","llrllrll","riri_","inninni","yyqyyqyy","bebebebeb","pppppppp","bibobobib","whwwwhw","komomok","pewewep","horor","ffcffcff","cyvyvyc","fisisif","sisasasis","xogogox","jujuuujuj","jololoj","nyhyh","nededen","nenepenen","tatatatat","sovovos","qddqddq","c0c0a","wiwi_","yyiyyiyy","wagagaw","sododos","sypyp","dadaadad","mmsmmsmm","iiiiiiii","cacavacac","pyfyfyp","foofoof","ziziliziz","dyzyz","wiwawiw","zzkzzkzz","ttittitt","pekekep","tysys","bbubbubb","lkklkkl","gajajag","mewewem","tykykyt","dypypyd","jeheh","rededer","waawaaw","vivoviv","kububuk","iqiqy","cocoococ","tatititat","ninun","qppqppq","luzuzul","jlljllj","bobibob","uucuucuu","gyxyxyg","celelec","geegeeg","mimam","ppsppspp","pevevep","lylalalyl","auuauua","xucucux","oeeoeeo","mmjmmjmm","lalylal","uxxuxxu","jowowoj","ccdccdcc","hyfyfyh","kahahahak","hafahafah","totttot","nyhynyhyn","zozoozoz","weeweew","gokokog","hyyhyyh","zizuziz","pydydyp","raryrar","kekesekek","xixyxix","bicicib","vatat","myymyym","pqqpqqp","bibabib","venenev","lilyl","migigim","rorogoror","pemememep","gegeegeg","tododot","euueuue","gbbgbbg","sidisidis","rurar","mihihim","pepeepep","zizaz","oxxoxxo","ututs","romomor","tegeget","gigugig","aaiaaiaa","ttqttqtt","fuvuvuf","lylulyl","cacycac","tatytat","polopolop","eeedeee","towowot","cppcppc","wemem","gabab","fahafahaf","lxxlxxl","dejejejed","dadydad","jyzyzyj","ksskssk","ttzttztt","uhhuhhu","hijijih","fofoxofof","ramen","vvrvvrvv","lalaaalal","kinininik","xixoxix","dybybyd","gefefeg","wjwwwjw","sesoses","myhymyhym","poporopop","hucucuh","xxcxxcxx","gawawawag","gycycyg","mmqmmqmm","jajyj","lelil","gugu_","cipipic","fygygyf","xalalax","mopopom","hihyhih","eeteetee","cacicac","zegeg","wewywew","effeffe","basasab","nowowon","vivuviv"],["rerrer","pippip","goggog","rorror","pappap","vovvov","zizziz","nannan","kikkik","nanaj","cocoa","feffef","poppop","fiffif","bibbib","fyffyf","hahhah","hohhoh","diddid","mimil","ninnin","nonoh","xoxxox","pypyc","puppup","dydyp","wewep","gugud","nunnun","wewwew","gyggyg","mummum","babah","xyxxyx","lellel","tittit","gogox","cyccyc","memmem","duddud","hihij","vyvvyv","cuccuc","rirrir","wowwow","lollol","mymmym","vavvav","ceccec","syssys","nonod","tattat","fyfyj","susuc","nynnyn","nennen","jejjej","vyvyx","xuxug","peppep","xixxix","dedec","dydyv","bubun","lyllyl","lillil","wawwaw","lolog","gaggag","wuwwuw","tettet","nanah","jojjoj","zozzoz","ciccic","tuttut","hihhih","jujjuj","sesec","xaxxax","kekkek","guggug","hehheh","dedded","vuvvuv","dyddyd","coccoc","kykys","zizig","vivim","mammam","zezej","rurrur","wuwur","zazzaz","kykyc","cycyz","bobbob","jijjij","kakkak","kykkyk","tutux","nonnon","lullul","bybbyb","pyppyp","zyzzyz","sysyz","lalaf","hyhhyh","rarrar","daddad","ryrryr","fifiz","tottot","vuvuz","gegex","vivviv","tyttyt","xaxaz","wawag","xuxxux","pupux","foffof","rurud","mommom","susup","lilif","fuffuf","popof","sasah","cycyg","vevvev","cocoh","doddod","jujuw","sesses","sissis","bubbub","huhhuh","cocob","babbab","caccac","jyjjyj","cucun","dodom","sussus","pupun","tetes","gogod","fyfyg","wiwwiw","nynyr","wywwyw","rarad","ninid","zuzzuz","sossos","faffaf","hohot","cycyv","wawaf","niniv","dudul","geggeg","xexxex","lalax","jajjaj","roroc","lallal","mimmim","pepec","zezzez","bebbeb","susuw","luluj","kykyl","neneh","giggig","memek","huhuv","cicij","tatad","dedex","sisix","pupuk","pupuz","xuxuc","kykyv","wuwux","kekef","mamak","tataz","gegej","lilir","tytyv","bybyx","cicim","cecep","weweb","lelex","cacax","wiwin","wiwir","zozol","susuf","hehez","fafam","zezep","gogoj","zuzup","fufur","kokkok","xexez","ninig","luluw","raral","xuxus","fyfyr","dydyx","kukkuk","nonox","rerel","bubum","jajaz","vevel","jijin","jijiz","reren","pypym","mymyc","luluh","ryryg","momox","gugul","sesex","fufut","tytyx","wiwig","rarax","fofoh","boboj","zyzyk","jujur","sassas","rereb","niniw","duduz","lilix","xyxyt","wywym","kykyb","ciciz","cacaw","sosoz","bibiw","nynyl","guguv","nynyg","xmxxmx","zazaw","sysyw","totok","fafal","dedem","hehew","gogow","hehej","memec","ririd","cycyd","ruruw","jyjyx","xyxyh","susur","kukuc","papal","vovoj","hohop","hahar","pepek","hohog","vevef","jyjyv","kykyp","gagax","vivix","cicil","momog","sosol","pepet","hahaz","xyxyv","cacan","sosop","wowof","ryryl","cycyf","gogov","kokoz","cucuj","jojoz","mumux","kykyr","xixiw","momow","nonoj","vovot","wuwum","pepex","hahag","veveb","vivip","jujud","dudus","zyzyh","leleg","loloc","lulub","wiwic","sosog","nynyw","popod","hihix","gogoh","wuwuc","lylyx","sasaf","fafax","xoxor","xuxun","hohos","fufup","bubup","fofol","tutun","hahax","xexeh","wiwiz","seseg","peped","jyjyw","sisib","lalak","dudur","jojot","jajat","huhuw","zozoj","wowob","bibil","lelet","susuv","ryryx","fefez","kykyx","ryryh","dudut","xoxos","memew","nenem","cucuh","babax","nanaz","totos","tetej","dadal","nynyk","zyzyc","dydyh","tytyk","fefel","jajal","ryryk","kakad","nonor","titir","wewet","gigix","fefes","cycym","zyzyf","cucup","pypyx","cycyx","hyhyz","kakab","bibix","vivir","gegez","fifij","popon","xoxof","hihin","mymyz","jejex","hohor","jajad","nunug","kikip","xoxom","jijiw","memex","fafak","xixij","reret","wywyv","gugur","fifix","hehef","zizix","vevex","bobor","memev","babad","ririn","momor","gygyj","totox","jjvvjj","wuwul","lalar","rereh","hhoohh","bbccbb","sisic","nwwwwn","uuxxuu","zazal","mssssm","raram","bubud","vgvvgv","hhwwhh","liliw","svvvvs","vuvur","asaasa","qqvvqq","nrnnrn","dydyr","uujjuu","cocot","eueeue","lolod","rkrrkr","guguf","vvttvv","bgbbgb","sisih","chhhhc","uuwwuu","fofoc","toton","vveevv","dhhhhd","ccppcc","lolop","ddssdd","ammmma","mwwwwm","kkaakk","ovoovo","hbhhbh","gzzzzg","bibik","ixiixi","wewed","nunul","ssqqss","ppggpp","lbllbl","teter","mtmmtm","oiiiio","leler","ninip","vyvyb","hxhhxh","raraz","zhzzhz","dodor","ngnngn","guguw","iibbii","ojjjjo","cecex","szzzzs","vvhhvv","jajaw","pypyw","jwjjwj","ninil","vavat","totop","uubbuu","ruruz","iwiiwi","vuvuj","qhhhhq","smssms","nmmmmn","ppyypp","gpggpg","uuaauu","mamat","ffkkff","zezer","wewej","zezek","fufub","aaooaa","xxkkxx","pupuv","xaxan","xaxag","jjuujj","ooqqoo","tggggt","mymyk","iiooii","uzzzzu","kikin","drddrd","cwwwwc","ykyyky","khkkhk","kikiw","vuvus","qkkkkq","bbffbb","nanar","ziziv","dadah","fifin","lalaz","xxrrxx","hhffhh","jejel","pipiz","ccrrcc","yqyyqy","fefep","sgssgs","yryyry","ehhhhe","tytyn","zggggz","imiimi","nnmmnn","kakaj","tppppt","gugup","uurruu","lggggl","tetep","ynnnny","kekeg","ggjjgg","susum","gttttg","lulug","vovoh","pypyg","bebek","xexen","zyzyg","tetec","mamag","fyfyd","diiiid","mmeemm","tutuk","huhul","ccffcc","dydyl","gagat","llssll","xxhhxx","gygyt","yffffy","mmddmm","heheb","xxssxx","dodok","xoxol","ninij","bubuk","momoz","xixir","fdffdf","tutup","zazac","hhyyhh","rfrrfr","hhzzhh","eyeeye","qqooqq","mqqqqm","vyvym","dedeg","yybbyy","zzeezz","didiv","mmqqmm","papar","nonop","ggmmgg","tytyb","uquuqu","jijix","lulud","zuzul","bxxxxb","luluz","cqqqqc","zuzux","pupuj","aooooa","hahal","pipin","qyqqyq","kikix","bbyybb","hhnnhh","xxqqxx","xlxxlx","bqqqqb","assssa","llrrll","hhxxhh","nynyf","dccccd","lmllml","xxvvxx","zizij","zizir","nynyt","dadax","ttxxtt","vsvvsv","llmmll","cucub","jejec","eteete","viiiiv","hhsshh","weweg","uugguu","vyvyg","vmmmmv","xexev","lzllzl","jbjjbj","cocod","iddddi","fsffsf","kokoc","pypyr","ziiiiz","jvjjvj","ssllss","oossoo","mmccmm","kssssk","gogob","papad","wssssw","uuppuu","rwwwwr","zozos","geger","tytyw","gagaw","aqaaqa","lwwwwl","pqppqp","ffqqff","sesel","mbmmbm","iinnii","prrrrp","wiwih","hihig","vhvvhv","gugux","fofow","vvyyvv","kkttkk","cecew","ddttdd","xiiiix","lylyb","huhun","xaxat","fufun","ddzzdd","yyuuyy","ttfftt","cucuw","rssssr","kekev","vyvyp","jggggj","gegeb","wccccw","nanap","mmggmm","xuxuz","rqqqqr","feeeef","errrre","rurub","ejjjje","ccnncc","zooooz","sjjjjs","mamac","lylys","zozod","grggrg","zuzun","totow","xgxxgx","gigip","knnnnk","ddyydd","bobov","zazan","obbbbo","hihit","jjggjj","mrmmrm","nynyb","momok","fofov","kekew","vffffv","lilid","jajax","raaaar","mmxxmm","qqddqq","uxxxxu","fddddf","baaaab","nened","vfvvfv","fifiw","ruuuur","zttttz","viviw","rryyrr","gvggvg","zxxxxz","bebez","eebbee","jijis","gghhgg","dppppd","mvvvvm","sysyr","zzggzz","cycyj","zizih","dxxxxd","dmmmmd","zzuuzz","aauuaa","vssssv","titij","wowom","yyllyy","sasaj","ffnnff","uvuuvu","hphhph","kikij","vuvux","guguh","cwccwc","pepew","zuzuw","cecek","fbbbbf","sfssfs","rroorr","vivic","bggggb","nanas","cmmmmc","wnwwnw","zizif","kakas","fyfym","uxuuxu","kokow","dkddkd","wlwwlw","ggffgg","zznnzz","wewec","wiiiiw","vuvuw","nffffn","uummuu","zkkkkz","lelef","kkzzkk","lelev","ccjjcc","ffzzff","nanac","yyssyy","yywwyy","kxkkxk","ririg","totov","rorod","zazak","lolor","mbbbbm","pypyv","wawax","rrxxrr","fyfyk","cacak","nunuc","oohhoo","fufum","heher","wiwik","yyhhyy","pmppmp","gssssg","lolos","vzzzzv","cxxxxc","hyhyj","rrllrr","pipid","iijjii","oobboo","kekex","ooffoo","xxggxx","kuuuuk","unuunu","oyyyyo","wwddww","llddll","xyxyd","ttuutt","wtwwtw","bebed","pjppjp","vevet","jmmmmj","myyyym","iqqqqi","bnnnnb","pgppgp","sosok","zizib","vvggvv","pypys","eeooee","kakal","xxccxx","uuvvuu","wwllww","tytyc","qmqqmq","xxzzxx","wewef","iiffii","roroj","titiv","tddddt","eeuuee","wjjjjw","jjddjj","lbbbbl","bebet","lulun","xxppxx","uppppu","zezeb","faaaaf","lilic","hpppph","dedew","ggyygg","jojom","ooppoo","vnnnnv","huhux","evvvve","fyfyb","cucut","dsddsd","gbggbg","kkcckk","nanat","elllle","fwffwf","bvvvvb","cnnnnc","ollllo","mjmmjm","afaafa","lylym","beber","ppoopp","vovoc","gegec","bobol","sszzss","kekep","bybyd","nanal","zyzyw","hahaf","eezzee","vxxxxv","sysyt","hahaw","papac","uuhhuu","ccmmcc","llqqll","iwwwwi","iooooi","popol","sysyk","eweewe","didim","xaxaf","fofos","gmggmg","qyyyyq","pmmmmp","vrvvrv","xuxul","yddddy","ninit","hnhhnh","dedet","skssks","jajag","xexem","nknnkn","fggggf","qqiiqq","oaooao","jujut","fafaj","cvccvc","gigih","illlli","jxjjxj","fufuj","tzzzzt","kakan","nbbbbn","vvwwvv","cacam","zuzuj","dodop","ecccce","vuvud","rvrrvr","aarraa","gffffg","gqggqg","kakav","mhhhhm","wuwun","kkllkk","cacah","cicip","kwkkwk","pfppfp","vevej","dtddtd","vvssvv","lolox","xeeeex","babam","vvddvv","bubur","iviivi","lzzzzl","eevvee","zzsszz","kikir","ccggcc","cucuz","rraarr","niniz","zazav","mimix","ffooff","mmzzmm","jajab","wawam","pypyl","ttqqtt","nanag","hiiiih","rffffr","zezel","ddlldd","hihib","jyjyn","titic","mimih","susuh","wewen","ryrys","fefeh","nddddn","tatav","gigiv","xaxas","zssssz","hdhhdh","rbbbbr","siiiis","pipil","rerek","ppjjpp","ktkktk","jojoh","wowor","xsxxsx","sysyc","nmnnmn","fmffmf","vavad","rorop","kukud","lalam","dodos","atttta","rerev","gagal","zyzyd","llaall","sasad","jijiv","raraw","lolot","nunum","eeiiee","ssggss","sysyb","ijjjji","weweh","cicif","pbppbp","zzjjzz","rmmmmr","vovox","ruruk","jojok","wuwud","ddwwdd","kakaw","fufuv","bpbbpb","hwhhwh","fnnnnf","jyjyt","qqyyqq","xjxxjx","neneb","nonoz","vwwwwv","kukus","ppttpp","lulux","hyhyd","ririp","uaaaau","brbbrb","grrrrg","ttrrtt","huhuz","lffffl","ririz","fqffqf","sosob","aallaa","tsttst","spppps","yuuuuy","sskkss","sosoc","bnbbnb","pypyf","dudug","vovok","xexel","dydyc","ggwwgg","gygyn","mimib","popog","zazar","ffaaff","jdjjdj","zuzum","kokog","jejen","titid","xxuuxx","vyvys","zjzzjz","ddjjdd","papaj","gygyd","hhpphh","ylllly","gkkkkg","gagah","vyvyt","kakaf","vyvyk","gygyw","okkkko","ckkkkc","jyjyz","xwwwwx","bibin","cacas","vvrrvv","vavab","reref","qqkkqq","qjjjjq","tutuz","rrkkrr","tsssst","ljlljl","jkjjkj","mymyl","pepel","didip","qllllq","hihiz","zyzyv","zczzcz","xhhhhx","yrrrry","popox","leles","wowoz","rllllr","ddiidd","aavvaa","effffe","babap","fofoz","cycyb","hihir","wppppw","rhhhhr","iimmii","huhug","nppppn","qqeeqq","wwuuww","sisid","fefew","xexet","exxxxe","bmbbmb","qiqqiq","adddda","zuzus","eejjee","llwwll","hehek","ghhhhg","mllllm","ciciw","jaaaaj","wfwwfw","dedeb","adaada","ddppdd","boooob","fifim","pqqqqp","epeepe","didix","mimiv","didig","ieeeei","cppppc","pepej","kykyf","susub","rorol","cucux","tthhtt","hyhyl","mzmmzm","tatag","aiiiia","titim","gogoz","kkvvkk","zzddzz","zozob","gigil","jujuv","wddddw","ririf","gogok","lilik","aawwaa","vavak","pypyn","mymyr","gugut","hihis","pipiv","uuzzuu","zzoozz","cttttc","lmmmml","wwxxww","susug","fwwwwf","ayaaya","jijic","ssccss","cocop","yyffyy","huhub","xcxxcx","jejed","nanav","bibig","zyzys","mumuw","mmuumm","hahad","cjjjjc","cocom","ruruf","kjkkjk","dodoj","bffffb","acaaca","syyyys","wllllw","popom","aeeeea","jyjyk","vvkkvv","bwwwwb","yvyyvy","mumuj","msmmsm","fppppf","zuzuc","nynys","cpccpc","hehep","ssjjss","ninix","eceece","tutum","gagab","lalab","rdrrdr","wywyp","gagad","ttlltt","wwssww","bebev","jhhhhj","qwqqwq","ryryd","cicib","qnqqnq","eooooe","bhbbhb","wvvvvw","ppxxpp","sisil","kggggk","abbbba","wowon","shhhhs","vdvvdv","dydyk","wuwuj","qqzzqq","bubul","lkkkkl","llyyll","dffffd","xexec","gogom","ycyycy","mamaz","cocof","xkkkkx","vvoovv","bsbbsb","dydyz","cycyp","aiaaia","vovom","teteh","xzxxzx","gagan","jjyyjj","bibit","yymmyy","vyvyw","fxxxxf","ffyyff","xixib","tutub","lelek","ihhhhi","laaaal","bkkkkb","oqooqo","wuwuv","nunuf","gkggkg","fnffnf","ccoocc","qoqqoq","mamas","nggggn","fefer","ggbbgg","zuzuf","sisif","dyyyyd","gygyh","fyfyh","bybyk","fefek","hyhys","fyfyx","hvvvvh","jajac","wewez","vccccv","zqzzqz","nonos","wiwim","sisir","trttrt","jjttjj","zozop","aeaaea","pepes","iiuuii","vivin","wwaaww","mfmmfm","jijik","rerex","jjzzjj","tmmmmt","jijib","cocox","wwzzww","dudup","uruuru","ssaass","zyzyr","nonoc","ninif","nenes","nenet","quqquq","memer","papan","vcvvcv","totof","gygyr","mumut","jyjyl","tetel","wvwwvw","mggggm","crrrrc","ibbbbi","ydyydy","jujus","zezeh","bssssb","hyhyx","cocov","huhut","vevez","ttcctt","zizik","ykkkky","fufuk","qkqqkq","ppccpp","sseess","gaaaag","xuxup","zzffzz","liliv","bbqqbb","gagap","cacar","yggggy","yqqqqy","mppppm","mymyg","ssxxss","eehhee","vevem","fefed","iaaaai","wbbbbw","yooooy","memez","pupuf","ntnntn","snssns","fcffcf","qdqqdq","yjjjjy","geged","seseh","uoooou","xyxyl","hihiv","sxxxxs","jnnnnj","nnuunn","dadab","tuuuut","kakac","hmhhmh","hahac","zccccz","pprrpp","bubut","lilij","ywwwwy","nunuw","xexew","pttttp","acccca","hyhyv","keker","jjssjj","jijil","zazaj","hohov","mkmmkm","popos","axxxxa","lsllsl","kokoj","susun","dadaj","tutuw","ruruc","bybyr","zizis","boboh","wowop","sosov","xaxak","ryryj","ssrrss","nonof","vivik","lolov","mimir","cmccmc","vvjjvv","bbrrbb","wywyx","nenep","lelem","occcco","mzzzzm","totom","didiz","kikil","nxxxxn","qiiiiq"],["vvvvvv","rrrrrr","xxxxxx","pppppp","yyyyy","hhhhh","ppppp","ggggg","ttttt","ppppppp","vvvvv","qqqqq","iiiiiii","ooooo","ccccc","mmmmmm","iiiii","oooooo","ggggggg","bbbbb","dddddd","wwwwwww","xxxxxxx","yyyyyy","eeeeee","zzzzz","bbbbbbb","kkkkkk","tttttt","wwwwww","xxxxx","fffff","vvvvvvv","uuuuuuu","nnnnnnn","lllll","aaaaaa","aaaaaaa","rrrrr","eeeee","sssss","yyyyyyy","wwwww","eeeeeee","nnnnn","qqqqqqq","jjjjjj","hhhhhhh","aaaaa","lllllll","bbbbbb","iiiiii","uuuuu","jjjjj","cccccc","ddddd","hhhhhh","ffffff","kkkkk","mmmmmmm","nnnnnn","ddddddd","qqqqqq","llllll","zzzzzzz","mmmmm","zzzzzz","ooooooo","ttttttt","ssssss","ccccccc","uuuuuu","fffffff","sssssss","rrrrrrr","gggggg","kkkkkkk","jjjjjjj","lflflf","tdtdt","mememe","dpdpd","atatat","ygygy","agagag","vbvbv","fnfnf","obobob","nonon","zyzyzy","chchc","nxnxnx","ojojoj","igigig","ogogo","atata","prprp","kjkjkj","jyjyjy","dbdbd","azaza","pwpwpw","hlhlhl","kykyky","qmqmqm","uauaua","xmxmx","aiaia","ububu","eqeqe","mamam","lvlvlv","xcxcx","bdbdb","omomom","mamama","jdjdjd","xjxjx","xgxgxg","gogogo","kakaka","dndnd","vxvxv","blblb","afafa","tltltl","tptpt","fbfbfb","qcqcqc","sqsqs","vdvdv","djdjdj","dwdwdw","eveve","hahah","cycycy","yfyfyf","cncnc","pbpbpb","hthth","gcgcg","frfrf","ryryry","gjgjg","nsnsn","nonono","kmkmk","mbmbm","jzjzjz","fkfkf","aoaoao","tatat","fefef","ipipi","ykykyk","ofofo","okoko","hphph","cqcqcq","oaoao","zazaz","pzpzpz","jwjwj","eyeye","jhjhjh","xoxox","rjrjrj","szszsz","dhdhd","njnjn","fafafa","xaxax","aoaoa","jtjtj","cpcpc","mlmlm","pypypy","zlzlzl","eyeyey","crcrc","gigig","zfzfz","dldld","xpxpx","efefe","apapap","uauau","hlhlh","jujuj","hfhfhf","pepep","fefefe","npnpn","rzrzrz","khkhkh","lolol","lslsls","wawawa","popop","sbsbs","bfbfbf","bjbjbj","hwhwhw","wvwvwv","vyvyvy","gpgpg","gfgfg","vovov","deded","ayayay","ahaha","hdhdhd","pupupu","ngngn","knknk","veveve","fvfvf","znznzn","zczcz","ababab","azazaz","bobob","lxlxl","zxzxz","jijiji","glglg","vwvwvw","zbzbz","dcdcd","owowow","gbgbgb","fdfdfd","bkbkbk","rnrnr","enenen","zgzgzg","nununu","oxoxo","rxrxrx","oeoeo","rcrcr","bxbxbx","pypyp","mzmzmz","ecece","qnqnqn","kbkbkb","dmdmd","slsls","hihihi","popopo","bgbgbg","pqpqp","uiuiui","ththth","adadad","ihihih","akakak","cgcgcg","cecec","rdrdr","vwvwv","sososo","wowowo","jejeje","ndndnd","agaga","iririr","whwhw","dmdmdm","fgfgfg","mgmgm","nknkn","nwnwn","pepepe","xhxhxh","bjbjb","ocococ","adada","pdpdpd","jajaja","cdcdc","jzjzj","gmgmg","xixix","pcpcpc","hyhyhy","lhlhl","oyoyo","dcdcdc","ththt","vqvqvq","cbcbcb","awawaw","dzdzdz","jljljl","ououo","qaqaq","bvbvbv","hnhnhn","zezeze","grgrgr","ehehe","wewewe","dxdxdx","nbnbnb","ykyky","nenen","uhuhuh","rwrwr","ueueue","gagaga","ststst","ylyly","nenene","gygygy","ohoho","tgtgtg","ukuku","dldldl","gtgtg","flflf","cdcdcd","iaiaia","ijijij","wdwdwd","zszszs","mymym","zbjjbz","nbqqbn","yekkey","tohot","fpllpf","tixit","hpwph","caiiac","qdmmdq","ijwji","lvxxvl","dcwcd","aflfa","pzttzp","dyaayd","hkuukh","deaaed","ogngo","akddka","frwwrf","hjppjh","kdvdk","vynnyv","hboobh","fxttxf","mannam","hpxph","yefey","gjwwjg","sprps","flrlf","vaqqav","pohhop","ctvtc","wjqjw","hngnh","armmra","abuuba","keaek","khohk","rspsr","ryppyr","jfkfj","edjjde","fehef","abjjba","dzllzd","jrssrj","ftmmtf","vbeebv","qfefq","xhihx","ztdtz","gpdpg","arhra","klblk","izhzi","gmffmg","mbfbm","yagay","rnsnr","gkqqkg","hawwah","kqffqk","gcttcg","fheehf","egnge","fveevf","cjnnjc","wbdbw","bkakb","klnlk","exnxe","zypyz","cwywc","isfsi","ackca","yjwjy","wmamw","oyeyo","lzxxzl","mbcbm","jpaapj","jnddnj","nfllfn","hgoogh","owbwo","dzyyzd","cqtqc","hcmmch","pqllqp","brvvrb","hmjjmh","esxse","xdhdx","aibbia","dovvod","spiips","htuuth","havvah","kcoock","foaof","xbvvbx","ofhfo","nlyln","egllge","nlvvln","zwiiwz","ximmix","vypyv","nzbzn","pkhkp","cnffnc","pgagp","cdldc","fxddxf","lbvvbl","dzppzd","rawar","ywaawy","ywffwy","pdgdp","iabai","vznzv","kiooik","cnhhnc","pfxxfp","azbza","crjrc","fusuf","lvpvl","npaapn","zsksz","nojon","atuta","qiwiq","cdzdc","ueoeu","alnla","oatao","fszzsf","ldzdl","swaws","murrum","rlyylr","amyyma","zhuuhz","odxxdo","agpga","nkiikn","zsesz","ifppfi","ajzzja","iloli","adlda","kcrck","etote","btuutb","kvmvk","lqzzql","ygbgy","rdhdr","ptztp","bdvdb","dagad","dfllfd","axjjxa","auiiua","dltld","hoqoh","jdssdj","vqggqv","huyyuh","lowwol","gymyg","ducud","gaxag","tydyt","hzxzh","xabax","hqwwqh","apqpa","dakad","kommok","qirriq","ganag","kvgvk","unmmnu","sfwfs","etmte","obmbo","ipypi","lxjxl","mhuuhm","wpxxpw","ljnnjl","idaadi","kwddwk","zyayz","hovvoh","abnnba","kcxxck","nawwan","ijzzji","phxhp","pgqqgp","nrirn","apffpa","jmxxmj","chxhc","uorou","ylfly","jdedj","ltvvtl","ihghi","pxgxp","gerreg","middim","jszzsj","bqaaqb","arzra","ltctl","ltqqtl","jaffaj","kjmmjk","fxppxf","gkzkg","cbrrbc","sippis","emvme","pveevp","jwewj","oweewo","oajjao","ajrja","qaggaq","phllhp","moaom","usttsu","aybya","qhxhq","zdaadz","pjejp","ouyyuo","jxllxj","pkzzkp","lbhhbl","ctddtc","yfwfy","pdffdp","pbttbp","uqaqu","pheehp","eallae","gctcg","kneenk","cwhhwc","rlhlr","bnddnb","cowoc","bxsxb","vibiv","tnoont","cokkoc","dopod","qnbnq","wgiigw","iauai","oabbao","enyyne","smums","hirrih","ynhhny","iarrai","ayppya","ynpny","qtnntq","gfqfg","ndccdn","hpxxph","pdodp","oymmyo","nmwwmn","ypupy","hjaajh","pxttxp","qrstu","lmnopq","fghij","opqrs","tuvwx","abcde","pqrstu","ijklmn","ghijk","cdefgh","nopqr","stuvwx","stuvw","nopqrs","jklmn","efghij","qrstuv","bcdef","jklmno","mnopq","klmno","cdefg","pqrst","lmnop","fghijk","ghijkl","mnopqr","rstuv","abcdef","uvwxyz","bcdefg","rstuvw","tuvwxy","defgh","efghi","ijklm","hijkl","klmnop","hijklm","opqrst","defghi","uvwxy","nmlkj","wvuts","vutsr","qponml","ihgfed","mlkji","tsrqpo","ihgfe","rqponm","fedcba","utsrq","nmlkji","jihgfe","hgfed","zyxwv","lkjihg","xwvuts","onmlk","fedcb","gfedc","wvutsr","utsrqp","ponml","onmlkj","jihgf","lkjih","gfedcb","qponm","mlkjih","xwvut","yxwvut","zyxwvu","srqpon","tsrqp","hgfedc","rqpon","srqpo","kjihg","ponmlk","yxwvu","kjihgf","vutsrq","lleeww","mmzzaa","ggnnmm","eekkdd","ppwwee","yyaagg","ggrrii","hhggjj","jjaazz","ppttjj","bbkkff","mmaavv","ffnnvv","jjrrnn","aaxxjj","uuyydd","rrxxaa","gghhkk","qquubb","iittaa","ffggpp","kknnoo","eeffvv","aabbqq","uubbpp","llccff","xxqqff","zzppaa","mmnnqq","aabbmm","ccrruu","mmooaa","ooppee","yybbvv","eekkxx","aawwff","hhttww","wwmmuu","ddccuu","xxhhmm","aaiinn","mmhhgg","wwttkk","ffaatt","nnppzz","cciimm","jjbbmm","vvrryy","ppeeaa","eeddww","xxvvhh","qqbbjj","yyxxkk","xxffll","ppccss","vvbbpp","aazzhh","ooaaww","xxnnhh","zzjjll","kkffaa","ffaadd","hhnnxx","nnhhvv","ppyyuu","aattdd","ccyypp","hhoorr","ggiixx","aannll","iihhgg","xxddjj","xxiicc","aauuvv","zzppkk","kkppww","rraakk","bbnnee","ppxxvv","yyddvv","ssjjxx","ssccyy","aapphh","ppddxx","hhddvv","hhddmm","ffllqq","aabbss","vvllcc","ppbbaa","bbggrr","rrllee","wwyyaa","nnooyy","aattyy","ccyyee","ppzzdd","ttddss","ccppmm","eeffll","ccllxx","iiyyoo","kkddee","bbsspp","eeyydd","jjaaee","vvhhnn","eezzjj","eelluu","zzddpp","ttggjj","nnaaxx","oozzpp","eeoopp","aajjxx","uueeaa","aavvrr","ddrraa","ffwwrr","aahhvv","kkttbb","bbmmww","nnccrr","ggppll","iiddhh","llttaa","ppvvhh","wwaamm","jjrrww","ddbbmm","kkeehh","qqddvv","pphhaa","qqddll","kkxxuu","iivvuu","cchhii","eeaayy","ffbbvv","ttuupp","ffaavv","zzvvrr","hhddww","zzbbhh","ddbbaa","iijjnn","bbuuxx","iittrr","vvxxaa","mmbbjj","kalkal","govgov","nltnlt","ncuncu","axjaxj","zehzeh","hdjhdj","csbcsb","quhquh","hdphdp","qwfqwf","loyloy","poypoy","airair","nzmnzm","kdckdc","euveuv","iksiks","afuafu","oucouc","adcadc","pnepne","cbacba","hcvhcv","vhbvhb","mpbmpb","kdwkdw","jzvjzv","sabsab","gfdgfd","mrxmrx","yzdyzd","yswysw","zbvzbv","oaroar","shzshz","odgodg","ubfubf","feyfey","fxofxo","pagpag","odtodt","hekhek","fmgfmg","cbzcbz","phvphv","zsazsa","otfotf","gbqgbq","txctxc","mnxmnx","xgmxgm","csdcsd","abeabe","pygpyg","zudzud","trytry","qdvqdv","dctdct","hckhck","oaeoae","qhpqhp","amyamy","kvdkvd","ioeioe","zeczec","kxbkxb","npcnpc","eqkeqk","nzvnzv","nhunhu","kaykay","rldrld","rznrzn","mcqmcq","urcurc","azqazq","ydfydf","ambamb","guegue","mwemwe","ndbndb","msbmsb","nzsnzs","dcpdcp","nvxnvx","jaujau","sacsac","abyaby","albalb","gqpgqp","copcop","hjzhjz","acuacu","nhfnhf","ugnugn","evnevn","zpszps","pfepfe","qbiqbi","utmutm","lrolro","qgmqgm","ogcogc","anvanv","zakzak","tlwtlw","ferfer","rotrot","xrlxrl","sucsuc","yebyeb","shxshx","anxanx","bycbyc","lhalha","axiaxi","dmbdmb","olxolx","dmrdmr","aykayk","afjafj","ldgldg","mfwmfw","eufeuf","akvakv","ecuecu","vaqvaq","coycoy","hbrhbr","knekne","amvamv","xivxiv","jfkjfk","edtedt","fhufhu","rdzrdz","yhpyhp","phdphd","dnsdns","fzwfzw","sxpsxp","oveove","fbvfbv","rhbrhb","awjawj","mpdmpd","wyhwyh","hfohfo","qrtqrt","kemek","ubcbu"],["ww","xxx","lot","лох","god","333","666","777","888","999","000","dead","#","111","222","444","555","13","69","420","1337","lol","wow","kek","zzz","www","w","x","1","0","11","007","404","gg","xd","omg","wtf","rip","лол","кек","бог","вау","$","%","@","?","!","*","~","_","aaa","bbb","ccc","ddd","eee","fff","ggg","hhh","iii","jjj","kkk","mmm","nnn","ooo","ppp","qqq","rrr","sss","ttt","uuu","vvv","yyy","123","321","100","101","202","303","505","700","800","900","1000","2024","2025","2026","abc","xyz","qwe","asd","zxc","88","99","77","66","55","44","33","22","00","ok","no","yes","hi","yo","ha","he","ho","ah","oh","uh","ye","ya","da","net","top","vip","pro","dev","boss","king","ace","one","two","six","ten","zero","null","void","nil","err","bug","fix","cat","dog","fox","owl","bee","ant","ape","bat","rat","cow","pig","hen","sun","sky","sea","ice","fog"]];
const SECRETS=CAT[6];
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
// узоры мифических ников (возвращает название узора или '')
function myPat(s){
  if(!/^[a-z]{5,7}$/.test(s))return '';
  const len=s.length,d=new Set(s).size,asc=x=>[...x].every((c,i)=>!i||c.charCodeAt(0)===x.charCodeAt(i-1)+1);
  if(d===1)return 'одна буква';
  if(len>=6&&d===2&&/^(.)(.)(\1\2)+\1?$/.test(s))return 'двойной узор';
  if(len===5&&d===2&&s===rev(s)&&/^(.)(.)\1\2\1$/.test(s))return 'двойной узор';
  if(len<=6&&d===3&&s===rev(s))return 'зеркальный ник';
  if(len<=6&&asc(s))return 'алфавит по порядку';
  if(len<=6&&asc(rev(s)))return 'алфавит наоборот';
  if(len===6&&d===3&&/^(.)\1(.)\2(.)\3$/.test(s))return 'три пары';
  if(len===6&&d===3&&s.slice(0,3)===s.slice(3))return 'тройка дважды';
  return '';
}
// Мифические ники: разные «красивые» узоры, не только пять одинаковых букв
function mythic(){
  const d=(n)=>{const a=[...L].sort(()=>Math.random()-.5);return a.slice(0,n)};
  switch(R(9)){
    case 0:return P(L).repeat(5);                                     // aaaaa
    case 1:{const[a,b]=d(2);return a+b+a+b+a}                          // ababa
    case 2:return P(L).repeat(6+R(2));                                 // aaaaaa
    case 3:{const[a,b]=d(2);return (a+b).repeat(3)}                    // ababab
    case 4:{const[a,b,c]=d(3);return R(2)?a+b+c+b+a:a+b+c+c+b+a}       // abcba / abccba
    case 5:{const a=R(L.length-5);return L.slice(a,a+5+R(2))}          // abcde / abcdef
    case 6:{const a=R(L.length-5)+5;return [...L.slice(a-4-R(2),a+1)].reverse().join('')}   // edcba
    case 7:{const[a,b,c]=d(3);return a+a+b+b+c+c}                      // aabbcc
    default:{const[a,b,c]=d(3);return (a+b+c).repeat(2)}               // abcabc
  }
}
function genRaw(){
  if(Math.random()<.00065)return mythic();
  for(let i=0;i<30;i++){const s=genBase();if(!myPat(s))return s}   // узоры мификов встречаются только как настоящий мифик
  return plain();
}
// ник выпадает только из каталога: редкость выбираем по прежним шансам, имя — случайное из списка этой редкости
function gen(){const n=genRaw(),t=score(n).t,l=CAT[t];return l&&l.length?P(l):n}
function genBase(){
  const q=Math.random();
  if(q<.1)return plain();
  if(q<.4)return genNew();
  const r=Math.random(),n=P([5,6,6,7,7,7,8,8,8,8]);let s;
  if(r<.38)s=rnd(n);
  else if(r<.66)s=syl(n);
  else if(r<.78)s=P(WORDS);
  else if(r<.86){const h=syl(3+R(2));s=h+(R(2)?P(L):'')+rev(h)}
  else if(r<.92)s=rnd(3+R(2)).repeat(3).slice(0,7+R(2));
  else if(r<.95){const a=R(17);s=L.slice(a,a+7+R(2))}
  else if(r<.97)s=P(WORDS)+String(R(1000));
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
  const mp=myPat(s);if(mp){p=Math.max(p,150);t.push(mp)}   // мифические узоры: редкость не зависит от случайных баллов
  return{t:tierOf(p),tags:t,p};
}

const def={coins:START,spins:0,best:0,day:'',items:[],uid:0,ups:0,upw:0,cnt:[0,0,0,0,0,0,0],time:0,tday:{d:'',s:0},pend:null,econ:4,login:{n:0,last:''},wheel:'',q:{wk:'',list:[]},slots:10,auto:0,saved:0,sold:0,bestv:0,wheelN:0,maxStreak:0,qn:0,maxCoins:0,bestn:'',hide:0,upl:0,uph:[],refd:0,refc:0,casen:0,dcase:'',fast:0,theme:'',cf:'',work:[],lotp:null,lotn:0,dex:'',dexg:[],promo:[],cfree:{},gbest:0,cown:[],cn:'',ct:'',inv:0,tri:0,luck:0,five:0,ach:null,achGot:[],en:15,enT:0,src:'free',show:[],snd:true,lvl:1,xp:0,xpv:0};
let S;try{S={...def,...JSON.parse(localStorage.getItem('nameroulette')||'{}')}}catch(e){S={...def}}
fixState();
// Темы оформления: меняют цвета через переменные CSS (html[data-theme=…])
const THEMES=[{id:'',n:'Ночь',a:'#5B6BFF',b:'#0D0B1A'},{id:'ocean',n:'Океан',a:'#2E8BFF',b:'#06121F'},{id:'emerald',n:'Изумруд',a:'#1FBF72',b:'#06130E'},{id:'sunset',n:'Закат',a:'#FF6B4A',b:'#17090F'},{id:'royal',n:'Королевская',a:'#B05BFF',b:'#120A1F'},{id:'amoled',n:'Чёрная',a:'#5B6BFF',b:'#000000'}];
function applyTheme(){
  const t=THEMES.find(x=>x.id===S.theme)||THEMES[0];
  try{if(t.id)document.documentElement.dataset.theme=t.id;else delete document.documentElement.dataset.theme;
    const m=document.querySelector('meta[name=theme-color]');if(m)m.content=t.b;
    if(tg){tg.setHeaderColor&&tg.setHeaderColor(t.b);tg.setBackgroundColor&&tg.setBackgroundColor(t.b)}}catch(e){}
}
applyTheme();
if(!S.uid){const id=tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.id;S.uid=id?(id%999999)+1:R(999999)+1}
// ---------- Сохранение: на устройстве (localStorage) и в облаке Telegram (CloudStorage), чтобы прогресс переезжал между устройствами ----------
var CS=null,cloudTm=0,cloudDone=false;
// Отметки «сегодня уже получено» (ежедневный кейс и рулетка) хранятся отдельно и всегда берутся по максимуму: откат облака или очистка памяти их не сбросит
const DK='nr_dk';
var dkLast='';
function dkPush(){try{const o=JSON.stringify({c:S.dcase,w:S.wheel});if(o===dkLast)return;dkLast=o;localStorage.setItem(DK,o);if(CS)CS.setItem(DK,o,()=>{})}catch(e){}}
function dkMerge(raw){let ch=false;try{const o=typeof raw==='string'?JSON.parse(raw):raw,d=new Date(),t=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  if(o&&typeof o.c==='string'&&o.c<=t&&o.c>S.dcase){S.dcase=o.c;ch=true}
  if(o&&typeof o.w==='string'&&o.w<=t&&o.w>S.wheel){S.wheel=o.w;ch=true}}catch(e){}return ch}
try{dkMerge(localStorage.getItem(DK))}catch(e){}
try{if(tg&&tg.CloudStorage&&tg.isVersionAtLeast&&tg.isVersionAtLeast('6.9'))CS=tg.CloudStorage}catch(e){}
const save=()=>{if(S.coins>CAP)S.coins=CAP;S.ts=Date.now();dkPush();try{localStorage.setItem('nameroulette',JSON.stringify(S))}catch(e){}if(CS&&cloudDone){clearTimeout(cloudTm);cloudTm=setTimeout(cloudPush,2500)}};
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
  num('coins',START);S.coins=Math.min(CAP,Math.max(0,S.coins));
  num('bestv',0);num('maxCoins',0);
  ['spins','ups','upw','time','saved','sold','bestv','wheelN','maxStreak','qn','maxCoins','inv','tri','luck','five'].forEach(k=>{num(k,0);S[k]=Math.max(0,S[k])});
  num('best',0);S.best=Math.min(6,Math.max(0,Math.floor(S.best)));
  if(S.econ===3){S.coins=Math.round(S.coins*30);S.bestv=Math.round((S.bestv||0)*30);S.maxCoins=Math.round((S.maxCoins||0)*30);S.econ=4}   // экономика ×30: переносим баланс игрока
  else if(S.econ!==4){S.coins=START;S.econ=4}
  if(typeof S.bestn!=='string')S.bestn='';S.hide=S.hide?1:0;
  num('refc',0);S.refc=Math.max(0,Math.floor(S.refc));S.refd=S.refd?1:0;
  if(typeof S.dcase!=='string')S.dcase='';S.fast=S.fast?1:0;if(typeof S.theme!=='string')S.theme='';if(typeof S.cf!=='string')S.cf='';
  S.work=(Array.isArray(S.work)?S.work:[]).filter(w=>w&&typeof w.id==='string'&&isFinite(+w.t)).map(w=>({id:w.id,t:Math.min(Date.now(),+w.t)})).slice(0,3);
  if(!(S.lotp&&typeof S.lotp==='object'&&((S.lotp.k==='c'&&isFinite(+S.lotp.v)&&+S.lotp.v>0)||(S.lotp.k==='n'&&typeof S.lotp.name==='string'))))S.lotp=null;
  num('lotn',0);S.lotn=Math.max(0,Math.floor(S.lotn));S.cown=Array.isArray(S.cown)?[...new Set(S.cown.filter(x=>typeof x==='string'))]:[];if(typeof S.cn!=='string')S.cn='';if(typeof S.ct!=='string')S.ct='';
  num('casen',0);S.casen=Math.max(0,Math.floor(S.casen));
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
// 10 быстрых нажатий на заголовок «Нейм-рулетка» открывают админ-страницу (доступ проверяет сама страница)
(function(){const h=document.querySelector('header h1');if(!h)return;let n=0,tm=0;
  h.addEventListener('click',()=>{n++;clearTimeout(tm);tm=setTimeout(()=>{n=0},2000);if(n>=10){n=0;try{save()}catch(e){}location.href='winvhfufkfdnditgv/'}});})();
// Команда с админ-страницы (/winvhfufkfdnditgv/): страница кладёт её в localStorage, игра применяет при запуске
function applyAdmin(){
  let raw=null;try{raw=localStorage.getItem('nr_admin');if(raw)localStorage.removeItem('nr_admin')}catch(e){}
  if(!raw)return;let c;try{c=JSON.parse(raw)}catch(e){return}
  if(!c||typeof c!=='object'||Date.now()-(+c.ts||0)>600000)return;   // команда живёт 10 минут
  const msg=[];
  if(c.c&&isFinite(+c.c.v)&&+c.c.v>=0){const v=Math.floor(+c.c.v);S.coins=Math.max(0,c.c.m==='add'?S.coins+v:v);msg.push('баланс '+fmt(S.coins))}
  const names=Array.isArray(c.n)?c.n.filter(x=>typeof x==='string'&&/^[^\s@]{1,32}$/.test(x)).slice(0,30):[];
  let ok=0;
  names.forEach(n=>{if(S.items.length>=30)return;if(S.items.length>=S.slots)S.slots=Math.min(30,S.items.length+1);MAX=S.slots;const r=score(n);addItem(n,r.t,r.p);ok++});
  if(names.length)msg.push('ников: '+ok+(ok<names.length?' из '+names.length+' (нет места)':''));
  if(!msg.length)return;
  save();try{shownCoins=S.coins}catch(e){}try{render()}catch(e){}try{toast('Админ: '+msg.join(', '))}catch(e){}
}
function cloudLoad(){
  if(!CS){applyAdmin();return}
  const done=()=>{applyAdmin();cloudDone=true;cloudPush();dkPush()};
  try{CS.getItem(DK,(e0,dv)=>{if(!e0&&dkMerge(dv)){try{localStorage.setItem('nameroulette',JSON.stringify(S))}catch(x){}try{renderCases()}catch(x){}try{render()}catch(x){}}});}catch(e){}
  try{CS.getItem('nr_n',(e,n)=>{
    n=+n;if(e||!n){done();return}
    CS.getItems(Array.from({length:n},(_,i)=>'nr_'+i),(e2,v)=>{
      let o=null;try{if(!e2)o=JSON.parse(Array.from({length:n},(_,i)=>v['nr_'+i]||'').join(''))}catch(x){}
      if(o&&typeof o==='object'&&((o.time||0)>(S.time||0)||((o.time||0)===(S.time||0)&&(o.ts||0)>(S.ts||0)))&&!busy&&!xbusy){
        S={...def,...o};fixState();dkMerge(localStorage.getItem(DK));ensureQuests();localStorage.setItem('nameroulette',JSON.stringify(S));shownCoins=S.coins;cur=[];S.pend=null;showIdle();render();
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
    const fk=S.fast?.55:1,st=Math.round((sec?1300:900)*fk),sp=Math.round((sec?520:240)*fk),hold=Math.round((sec?1700:1500)*fk),dur=st+(n-1)*sp+hold;
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
const FK=()=>S.fast?.4:1;   // быстрый режим: анимации в 2,5 раза короче
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
    if(n){const d=reduce?1:Math.round((1000+i*260)*FK());st.style.transitionDuration=d+'ms';
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
  return reduce?60:Math.round((1000+(name.length-1)*260)*FK())+150;
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
function addItem(n,t,p){S.items.unshift({id:Date.now()+''+R(1000),n,t,p});S.saved++;try{dexAdd(n)}catch(e){}}
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
  return `<button class="pcard achbtn" id="show-open" style="margin-bottom:16px"><div><b>Витрины</b><small>Собрано ${d} из ${SHOW.length}${r?` · наград к получению: ${r}`:''}</small></div><span class="mini" style="--p:${d/SHOW.length*100}"><i>${d}</i></span></button>`+`<button class="pcard achbtn" id="market-open" style="margin-bottom:16px"><div><b>Рынок игроков</b><small>Покупай и продавай ники за монеты</small></div><span class="trophy">🛒</span></button>`+`<button class="pcard achbtn" id="museum-open" style="margin-bottom:16px"><div><b>Музей</b><small>Навсегда поставь ник на витрину славы</small></div><span class="trophy">🏛️</span></button>`+`<button class="pcard achbtn" data-craft="1" style="margin-bottom:16px"><div><b>Крафт</b><small>Три любых ника → один новый, шансы зависят от выбранных</small></div><span class="trophy">⚗️</span></button>`;
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
// Аватар Telegram вместо иконки профиля: кольцо = прогресс до следующего уровня, значок = уровень
var avaOk=true,avaKey='';
var FRM;   // рамки аватарки (список задаётся ниже, в блоке косметики)
function frameId(){return FRM&&S.cf&&S.cown.includes(S.cf)&&FRM.some(x=>x.id===S.cf)?S.cf:''}
function frameRing(id){return id?`<i class="frg ${id}"></i>`:''}
function updAva(){
  const eh=x=>String(x).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
  const btn=document.getElementById('prof-btn');if(!btn)return;
  const u=tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user,photo=u&&u.photo_url&&avaOk?u.photo_url:'',nm=u?(u.first_name||u.username||'?'):'?';
  const need=xpNeed(S.lvl),pr=Math.max(0,Math.min(1,S.xp/need)),C=2*Math.PI*19;
  const fid=frameId(),key=photo+'|'+nm+'|'+S.lvl+'|'+Math.round(pr*200)+'|'+fid;if(key===avaKey)return;avaKey=key;
  btn.classList.add('pba');
  btn.innerHTML=frameRing(fid)+`<svg class="pbr" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" class="pbt"/><circle cx="22" cy="22" r="19" class="pbp" stroke-dasharray="${(C*pr).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 22 22)"/></svg>`+
    `<span class="pbi">${photo?`<img src="${eh(photo)}" alt="" referrerpolicy="no-referrer">`:`<b>${eh([...String(nm)][0]||'?').toUpperCase()}</b>`}</span><span class="pbl">${S.lvl}</span>`;
  const im=btn.querySelector('img');if(im)im.onerror=()=>{avaOk=false;avaKey='';updAva()};
}
function render(){
  try{updAva()}catch(e){}
  setCoins();
  ensureQuests();updBonDot();checkAch();try{renderCases()}catch(e){}   // кейсы объявлены ниже: на первом проходе их ещё нет
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
  if(!$('#tab-prof').hidden)renderProf();try{if(!$('#tab-museum').hidden)renderMuseum()}catch(x){};
  if(!$('#tab-bon').hidden)renderBon();
  if(!$('#tab-ach').hidden)renderAch();
  if(!$('#tab-show').hidden)renderShow();
  if(!$('#tab-up').hidden)setTimeout(renderUp,0);
}

$('#spin').onclick=spin;
(function(){   // маленькая кнопка быстрого режима над кнопкой «Крутить»
  let b=$('#fast');if(!b){const sp=$('#spin');if(!sp)return;const w=document.createElement('div');w.className='fastrow';b=document.createElement('button');b.id='fast';b.className='fastb';b.type='button';w.append(b);sp.before(w)}
  const upd=()=>{b.setAttribute('aria-pressed',S.fast?'true':'false');b.innerHTML='<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>Быстро'};
  upd();b.onclick=()=>{S.fast=S.fast?0:1;save();upd();toast(S.fast?'Быстрый режим включён':'Быстрый режим выключен')};
})();
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
  if(e.target.closest('#market-open'))return tab('market');
  if(e.target.closest('#museum-open'))return tab('museum');
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
const UPK=.9,INSFEE=.7;   // шанс = цена ставки ÷ цена цели × 0,9; страховка = 70% цены ставки
let up={sel:new Set(),mode:2,c:30,prize:null,busy:false,msg:'',res:null,fresh:false,sheet:'',ins:false,rot:0};
const chanceOf=(s,pr)=>Math.min(.85,Math.max(.01,UPK*s.v/pr.price));
function stake(){const its=S.items.filter(i=>up.sel.has(i.id)).slice(0,UPMAX);return{its,v:its.reduce((a,x)=>a+val(x.t,x.p,x.n),0),mx:its.reduce((a,x)=>Math.max(a,x.t),-1)}}
// пул призов: ники всех редкостей с ценами (строится один раз). Секретные есть только здесь
let POOLN=null;
function prizePool(){
  if(POOLN)return POOLN;const seen=new Set(),a=[];
  const add=n=>{if(seen.has(n))return;seen.add(n);const r=score(n);a.push({name:n,t:r.t,p:r.p,price:val(r.t,r.p,n)})};
  CAT.forEach(l=>l.forEach(add));
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
    <p class="hint">Выбери ники из коллекции и цель. Шанс = цена ставки ÷ цена цели × 0,9. Не повезёт — ставка сгорит.</p>
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
  const ch=chanceOf(s,pr),pity=false,won=Math.random()<ch,ins=up.ins;
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
  if(!reduce){[250,1100].forEach(d=>setTimeout(()=>{const r=$('#upres');if(r&&!$('#tab-up').hidden)r.scrollIntoView({behavior:'smooth',block:'end'})},d))}
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
// ---------- Косметика: стили ника и титулы (покупаются за монеты, видны в профиле и рейтинге) ----------
const NSTY=[
  {id:'silver',n:'Серебряный никнейм',price:1e6},
  {id:'gold',n:'Золотой никнейм',price:5e6},
  {id:'emerald',n:'Изумрудный никнейм',price:20e6},
  {id:'diamond',n:'Бриллиантовый никнейм',price:80e6},
];
const TTL=[
  {id:'collector',n:'Коллекционер',price:1e6,c:'#9B7BFF'},
  {id:'trader',n:'Торговец',price:2e6,c:'#27D9BD'},
  {id:'upgrader',n:'Мастер апгрейда',price:8e6,c:'#FF8A3D'},
  {id:'gambler',n:'Азартный',price:15e6,c:'#FF4B3E'},
  {id:'magnate',n:'Магнат',price:30e6,c:'#FFB62E'},
  {id:'oligarch',n:'Олигарх',price:100e6,c:'#FFD84A'},
  {id:'billionaire',n:'Миллиардер',price:300e6,c:'#6FE3E0'},
  {id:'legend',n:'Легенда',price:1e9,c:'#FF7AE0'},
  {id:'emperor',n:'Император',price:5e9,c:'#FFFFFF'},
];
FRM=[
  {id:'f_silver',n:'Серебряная рамка',price:1e6},
  {id:'f_gold',n:'Золотая рамка',price:5e6},
  {id:'f_emerald',n:'Изумрудная рамка',price:20e6},
  {id:'f_diamond',n:'Бриллиантовая рамка',price:80e6},
];
const cosNick=id=>NSTY.find(x=>x.id===id),cosTitle=id=>TTL.find(x=>x.id===id),cosFrame=id=>FRM.find(x=>x.id===id);
const cosOwn=id=>S.cown.includes(id);
const nickHtml=(name,id)=>`<span class="nk${cosNick(id)?' nk-'+id:''}">${escH(name)}</span>`;
const titleHtml=id=>{const t=cosTitle(id);return t?`<span class="ttl" style="--tc:${t.c}">${t.n}</span>`:''};
const cosKey=()=>(cosOwn(S.cn)&&cosNick(S.cn)?S.cn:'')+'|'+(cosOwn(S.ct)&&cosTitle(S.ct)?S.ct:'')+'|'+(cosOwn(S.cf)&&cosFrame(S.cf)?S.cf:'');
S.cown=S.cown.filter(x=>cosNick(x)||cosTitle(x)||cosFrame(x));if(S.cn&&!cosOwn(S.cn))S.cn='';if(S.ct&&!cosOwn(S.ct))S.ct='';if(S.cf&&!cosOwn(S.cf))S.cf='';
try{avaKey='';updAva()}catch(e){}
function cosSheet(){
  let o=document.getElementById('cosheet');
  if(!o){o=document.createElement('div');o.id='cosheet';o.className='usheet';document.body.append(o);
    o.onclick=e=>{
      if(e.target.closest('[data-cx]'))return o.remove();
      const b=e.target.closest('[data-cb]');
      if(b){const id=b.dataset.cb,it=cosNick(id)||cosTitle(id)||cosFrame(id),k=cosNick(id)?'n':cosTitle(id)?'t':'f',fld=k==='n'?'cn':k==='t'?'ct':'cf';if(!it)return;
        if(cosOwn(id)){S[fld]=S[fld]===id?'':id}   // надеть / снять
        else{
          if(S.coins<it.price)return toast('Не хватает монет');
          S.coins-=it.price;S.cown.push(id);S[fld]=id;sfx('ach');hap('n','success');toast('Куплено: '+it.n);
        }
        save();render();lb.sent='';lbPush();cosSheet();if(!$('#tab-prof').hidden)renderProf();try{if(!$('#tab-museum').hidden)renderMuseum()}catch(x){}}
    }}
  const u=tgUser(),nm=u.first_name||'Игрок';
  const row=(it,kind)=>{const own=cosOwn(it.id),on=kind===1?S.cn===it.id:kind===2?S.ct===it.id:S.cf===it.id,poor=!own&&S.coins<it.price;
    return `<div class="crow2${on?' on':''}"><div class="cprev">${kind===1?nickHtml(nm,it.id):kind===2?titleHtml(it.id):`<span class="fprev">${frameRing(it.id)}<b>${escH([...nm][0]||'?').toUpperCase()}</b></span>`}</div><div class="cinfo"><b>${it.n}</b><small>${own?(on?'Надето':'Куплено'):fmtC(it.price)+' 🪙'}</small></div><button class="btn sm${own||!poor?' main':''}" data-cb="${it.id}"${poor?' disabled':''}>${own?(on?'Снять':'Надеть'):poor?'Не хватает':'Купить'}</button></div>`};
  o.innerHTML=`<div class="sbg" data-cx="1"></div><div class="sbox casebox"><div class="shead"><b>✨ Косметика</b><button class="btn sm" data-cx="1">✕</button></div>
    <div class="cprevbig">${nickHtml(nm,cosOwn(S.cn)?S.cn:'')}${cosOwn(S.ct)?`<div>${titleHtml(S.ct)}</div>`:''}</div>
    <h3 class="chd">Никнеймы</h3>${NSTY.map(x=>row(x,1)).join('')}
    <h3 class="chd">Рамки аватарки</h3>${FRM.map(x=>row(x,3)).join('')}
    <h3 class="chd">Титулы</h3>${TTL.map(x=>row(x,2)).join('')}</div>`;
}

// ---------- Альбом: сколько ников каталога ты собрал ----------
var DEXM=null,DEXT=0;
var DEXS=[[100,150000],[500,600000],[1500,2000000],[3000,6000000],[6000,20000000],[8650,100000000]];
function dexMap(){if(DEXM)return DEXM;DEXM={};let i=0;for(const a of CAT)for(const n of a)if(!(n in DEXM))DEXM[n]=i++;DEXT=i;return DEXM}
function dexBits(){const m=dexMap(),L=Math.ceil(DEXT/4);let d=typeof S.dex==='string'&&/^[0-9a-f]*$/.test(S.dex)?S.dex:'';if(d.length<L)d=d+'0'.repeat(L-d.length);return d.slice(0,L)}
function dexAdd(n){const m=dexMap(),i=m[n];if(i===undefined)return;const d=dexBits(),k=i>>2,v=parseInt(d[k],16);if(v&(1<<(i&3)))return;S.dex=d.slice(0,k)+(v|(1<<(i&3))).toString(16)+d.slice(k+1)}
function dexCount(){const d=dexBits();let c=0;for(const ch of d){let v=parseInt(ch,16);while(v){c+=v&1;v>>=1}}return c}
function dexSeed(){try{(S.items||[]).forEach(x=>dexAdd(x.n))}catch(e){}}
function albumCard(){
  dexSeed();const n=dexCount(),tot=(dexMap(),DEXT),got=Array.isArray(S.dexg)?S.dexg:[];
  const nxt=DEXS.findIndex(x=>n<x[0]),ready=DEXS.map((x,i)=>n>=x[0]&&!got.includes(i)?i:-1).filter(i=>i>=0);
  const pc=n/tot*100,pt=pc>0&&pc<1?'<1':String(Math.round(pc));
  return `<div class="pcard albm"><div class="alt"><span class="alic">📖</span><div class="alin"><b class="alnum">${fmt(n)}<small> / ${fmt(tot)}</small></b><span class="alsub">ников каталога собрано</span></div><span class="alpc">${pt}%</span></div>
  <div class="albar"><i style="width:${Math.max(n?2:0,pc)}%"></i></div>
  <div class="alft">${nxt>=0?`До награды ${fmt(DEXS[nxt][0])}: ещё ${fmt(DEXS[nxt][0]-n)}`:'Каталог собран полностью!'}</div>
  <div class="algrid">${DEXS.map((x,i)=>{const ok=n>=x[0],cl=got.includes(i),w=Math.min(100,n/x[0]*100);return `<div class="alm${cl?' cl':ok?' ok':''}${i===nxt?' nx':''}"><b>${fmt(x[0])}</b><span class="alr">${short(x[1])} 🪙</span><div class="alb"><i style="width:${w}%"></i></div><em>${cl?'✓ получено':ok?'можно забрать':'ещё '+fmt(x[0]-n)}</em></div>`}).join('')}</div>
  ${ready.length?`<button class="btn main cwide" id="dex-claim">Забрать награды · +${fmt(ready.reduce((a,i)=>a+DEXS[i][1],0))} 🪙</button>`:''}</div>`}
function dexClaim(){dexSeed();const n=dexCount();if(!Array.isArray(S.dexg))S.dexg=[];let sum=0;DEXS.forEach((x,i)=>{if(n>=x[0]&&!S.dexg.includes(i)){S.dexg.push(i);sum+=x[1]}});if(!sum)return;S.coins=Math.min(CAP,S.coins+sum);save();render();sfx('coins');toast('📖 Альбом: +'+fmt(sum)+' 🪙');renderProf()}
function renderProf(){
  if(typeof refPoll==='function'&&!renderProf.t){renderProf.t=1;setTimeout(()=>{renderProf.t=0;refPoll()},0)}
  const u=tgUser(),name=u.first_name||'Игрок',need=xpNeed(S.lvl),pct=S.xp/need*100,rk=rankOf(S.lvl),nx=RANKS.find(x=>x[0]>S.lvl),nr=lvReward(S.lvl+1);
  const av=u.photo_url?`<img src="${u.photo_url}" alt="" onerror="this.remove()">`:'';
  const doneV=S.show.length;
  $('#tab-prof').innerHTML=`<h2 class="ptitle">Профиль</h2>
  <div class="pcard pro"><div class="ptop"><div class="av" style="--p:${pct}">${frameRing(frameId())}<span class="avi">${av}<b>${name.slice(0,1).toUpperCase()}</b></span><em class="lvb">${S.lvl}</em></div>
    <div class="pnm"><b class="pname">${nickHtml(name,cosOwn(S.cn)?S.cn:'')}</b>${cosOwn(S.ct)?`<span class="ttlrow">${titleHtml(S.ct)}</span>`:''}<span class="rank" style="--rc:${rk[2]}">🛡 ${rk[1]}</span>${nx?`<small>до «${nx[1]}»: ${nx[0]} ур.</small>`:'<small>Высший ранг</small>'}</div></div>
  <div class="pid idc"><span class="idtag">ID</span><b>${idStr()}</b><button id="idcopy" aria-label="Скопировать ID">⧉</button></div>
  <div class="lvrow"><b>Уровень ${S.lvl}</b><small>${fmt(S.xp)} / ${fmt(need)} опыта</small></div>
  <div class="xbar"><i style="width:${pct}%"></i></div>
  <div class="path"><span class="pi">🧭</span><b>Путь игрока</b><small>${S.lvl+1} ур.: +${fmt(nr.c)} 🪙 и +${nr.e} ⚡</small></div>
  <div class="tri"><div><small>Капитал</small><b>${S.coins>=1e9?short(S.coins):fmtC(S.coins)} 🪙</b></div><div><small>Коллекция</small><b>${S.items.length} из ${S.slots}</b></div><div><small>Витрины</small><b>${doneV} из ${SHOW.length}</b></div></div></div>
  <div class="pcard sndrow"><div><b>Звуки</b><small>Эффекты рулетки, наград и колеса</small></div><button class="sw${S.snd?' on':''}" id="snd-tg" role="switch" aria-checked="${S.snd}" aria-label="Звуки"><i></i></button></div>
  ${(()=>{try{return albumCard()}catch(e){return ''}})()}
  <div class="pcard"><h3>Тема оформления</h3><div class="themes">${THEMES.map(t=>`<button class="thm" data-theme="${t.id}" aria-pressed="${(S.theme||'')===t.id}" style="--tl:${t.a}"><i style="background:linear-gradient(135deg,${t.b} 55%,${t.a} 55%)"></i>${t.n}</button>`).join('')}</div></div>
  <div class="pcard inv invx"><div><b>Позвать друзей</b><small>За каждого друга: +${fmt(REF_C)} 🪙 и +${REF_E} ⚡ · приглашено ${S.refc} из ${REF_MAX}</small></div><div class="invb">${lb.refn>0?`<button class="btn main" id="ref-claim">Забрать +${fmt(lb.refn*REF_C)} 🪙</button>`:''}<button class="btn${lb.refn>0?'':' main'}" id="invite">Позвать</button></div></div>
  <div class="pcard"><h3>Статистика</h3>
    <div class="pgrid"><div class="pt"><small>Круток</small><b>${fmt(S.spins)}</b></div><div class="pt"><small>Удачных апгрейдов</small><b>${fmt(S.upw)}</b></div>
    <div class="pt"><small>В игре за всё время</small><b id="tm-all">${fmtT(S.time)}</b></div><div class="pt"><small>В игре сегодня</small><b id="tm-day">${fmtT(todaySec())}</b></div></div>
    <div class="pgrid tiers">${T.map((t,i)=>`<div class="pt${i===6?' last':''}" style="--tc:${t.c}"><small>${TN[i]}</small><b>${fmt(S.cnt[i])}</b></div>`).join('')}</div></div>
  <button class="pcard achbtn" id="top-open"><div><b>Рейтинг игроков</b><small>Топ по капиталу и самому дорогому нику</small></div><span class="trophy">🏆</span></button>
  <button class="pcard achbtn" id="clan-open"><div><b>Кланы</b><small>${cl.me&&cl.me.clan?escH('['+(cl.me.clan.tag||'')+'] '+(cl.me.clan.name||'')):'Вступи в клан или создай свой'}</small></div><span class="trophy">🛡️</span></button>
  <button class="pcard achbtn" data-craft="1" ><div><b>Крафт</b><small>Три любых ника → один новый, шансы зависят от выбранных</small></div><span class="trophy">⚗️</span></button>
  <button class="pcard achbtn" id="cos-open"><div><b>Косметика</b><small>Ники, рамки и титулы · куплено ${S.cown.length} из ${NSTY.length+TTL.length+FRM.length}</small></div><span class="trophy">✨</span></button>
  <button class="pcard achbtn" id="ach-open"><div><b>Достижения</b><small>Открыто ${ACH.filter(achOk).length} из ${ACH.length}${achReady().length?` · наград к получению: ${achReady().length}`:''}</small></div><span class="mini" style="--p:${ACH.filter(achOk).length/ACH.length*100}"><i>${ACH.filter(achOk).length}</i></span></button>`;
}
setInterval(()=>{
  if(document.hidden)return;
  if(tickEn())save();if(!$('#tab-game').hidden)updEn();
  const d=new Date().toDateString();if(S.tday.d!==d)S.tday={d,s:0};
  S.time++;S.tday.s++;if(S.time%10===0)save();
  if(!$('#tab-prof').hidden){const a=$('#tm-all'),b=$('#tm-day');if(a){a.textContent=fmtT(S.time);b.textContent=fmtT(todaySec())}}
  if(!$('#tab-bon').hidden)updTimers();
  if(S.time%30===0&&(!$('#tab-game').hidden||!$('#tab-bon').hidden||!$('#tab-prof').hidden))renderCases();
  const kk=todayK()+weekK();if(kk!==lastK){lastK=kk;ensureQuests();render()}
},1000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){save();lbPush();if(cloudDone)cloudPush()}});
addEventListener('pagehide',()=>{save();if(cloudDone)cloudPush()});
$('#tab-prof').onclick=e=>{
  if(e.target.closest('#ach-open'))return tab('ach');
  if(e.target.closest('#top-open'))return tab('top');
  if(e.target.closest('#clan-open'))return tab('clan');
  if(e.target.closest('#dex-claim'))return dexClaim();
  if(e.target.closest('#cos-open'))return cosSheet();
  {const th=e.target.closest('[data-theme]');if(th){S.theme=th.dataset.theme;applyTheme();save();renderProf();return}}
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
const PAGE=document.body.dataset.page||'main',PAGES={top:'rating.html',ach:'achievements.html',clan:'clans.html',market:'market.html',museum:'museum.html'};
function tab(n){
  const here=PAGE==='main'?['game','col','up','prof','bon','show']:[PAGE];
  if(here.includes(n))return tabIn(n);
  save();try{if(cloudDone)cloudPush()}catch(e){}
  location.href=(PAGES[n]||'index.html')+(PAGES[n]||n==='game'?'':'#'+n);
}
function tabIn(n){
  {const nn=n==='show'||n==='market'||n==='museum'?'col':n==='clan'?'top':n;document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===nn))}
  ['game','col','up','prof','bon','ach','show','top','clan','market','museum'].forEach(k=>{const e=$('#tab-'+k);if(!e)return;
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
  if(n==='clan')openClan();
  if(n==='market')openMarket();
  if(n==='museum')openMuseum();
  scrollTo(0,0);
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
// ---------- Рейтинг игроков ----------
// Рейтинг работает через маленький сервер (папка rating-worker). Пока адрес не указан, страница показывает подсказку.
const API='https://rt.wsmp.workers.dev';   // например: https://nr-rating.твой-аккаунт.workers.dev
const escH=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const netWorth=()=>S.coins+S.items.reduce((s,x)=>s+val(x.t,x.p,x.n),0);   // капитал = монеты + стоимость коллекции
const lb={cheat:0,by:'net',data:{},load:false,err:'',sent:'',last:0};
function bestOwn(){   // лучший ник из коллекции, если имя ещё не записано
  if(S.bestn||!S.items.length)return;
  let b=null,bv=0;S.items.forEach(x=>{const v=val(x.t,x.p,x.n);if(v>bv){bv=v;b=x.n}});if(b&&bv>=S.bestv*.999){S.bestn=b}
}
async function lbReq(path,body){
  const r=await fetch(API.replace(/\/$/,'')+path,{method:body?'POST':'GET',headers:{'X-Init-Data':tg&&tg.initData||'','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  if(!r.ok){let code='';try{code=(await r.json()).error}catch(e){}throw new Error(r.status===429?'wait':(r.status===401||r.status>=500)?'http '+r.status:'e:'+code)}return r.json();
}
async function lbPush(force){
  if(!API||!tg||!tg.initData)return;bestOwn();
  const u=tgUser(),b={name:(u.first_name||'Игрок').slice(0,24),net:Math.round(netWorth()),best:S.bestv,bestn:S.bestn||'',lvl:S.lvl,hide:S.hide,cos:cosKey()},sig=JSON.stringify(b);
  if(!force&&sig===lb.sent)return;if(Date.now()-lb.last<12000)return;
  lb.last=Date.now();try{const r=await lbReq('/sync',b);lb.sent=sig;const was=lb.cheat;lb.cheat=r&&r.error==='cheat'?1:0;if(lb.cheat&&!was)try{toast('Данные не прошли проверку: рейтинг и рынок временно закрыты')}catch(e){}}catch(e){}
}
async function openTop(){
  renderTop();if(!API||!tg||!tg.initData)return;
  lb.load=true;lb.err='';renderTop();
  try{await lbPush(true);lb.data[lb.by]=await lbReq('/top?by='+lb.by)}catch(e){const m=String(e.message||e);lb.err=m==='wait'?'Подожди несколько секунд и попробуй снова':'Не удалось загрузить рейтинг ('+(m==='http 401'?'ошибка проверки Telegram: проверь BOT_TOKEN':m==='http 500'?'ошибка сервера: проверь привязку базы DB':/Failed to fetch|Load failed|NetworkError/i.test(m)?'нет связи с сервером':m)+')'}
  lb.load=false;if(!$('#tab-top').hidden)renderTop();
}
function renderTop(){
  const d=lb.data[lb.by],net=lb.by==='net';
  const val2=x=>net?fmtC(x)+' 🪙':fmtC(x)+' 🪙';
  let body;
  if(!API)body='<div class="pcard lbmsg"><b>Рейтинг пока не подключён</b><small>Нужно развернуть сервер из папки rating-worker и вписать его адрес в app.js (константа API). Подробности в README.</small></div>';
  else if(!tg||!tg.initData)body='<div class="pcard lbmsg"><b>Рейтинг доступен в Telegram</b><small>Открой игру через бота, чтобы видеть таблицу и попасть в неё.</small></div>';
  else if(lb.load&&!d)body='<div class="pcard lbmsg"><small>Загружаю…</small></div>';
  else if(lb.err&&!d)body=`<div class="pcard lbmsg"><b>${escH(lb.err)}</b><button class="btn main" id="top-retry">Повторить</button></div>`;
  else if(d){
    const me=d.me,esc=escH;
    const cosOf=r=>String(r.me?cosKey():(r.cos||'')).split('|');
    const tagC=t=>['#FF5A4D','#FFB62E','#9B7BFF','#27D9BD','#5B9BFF','#FF5FA2'][[...t].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7)%6];
    const tagH=r=>r.tag?`<em class="ctag" style="color:${tagC(r.tag)}">[${esc(r.tag)}]</em>`:'';
    const frameOf=r=>{const f=cosOf(r)[2];return cosFrame(f)?frameRing(f):''};
    const ini=r=>esc([...String(r.name||'?')][0]||'?').toUpperCase();
    const nick=r=>nickHtml(r.name,cosOf(r)[0]);
    const sub=r=>{const t=cosOf(r)[1];return net?(t&&cosTitle(t)?titleHtml(t):`<small>${r.lvl} ур.</small>`):`<small>${esc(r.bestn||'—')}</small>`};
    const top=d.top;
    const pod=k=>{const r=top[k-1];if(!r)return `<div class="pd p${k} empty"><div class="ped">${k}</div></div>`;
      return `<div class="pd p${k}${r.me?' me':''}" data-pi="${k-1}">${k===1?'<span class="crown">👑</span>':''}<div class="pava g${k}">${frameOf(r)}<b>${ini(r)}</b><i class="pbadge">${k}</i></div>
      <div class="pn">${tagH(r)}<span class="pnk">${nick(r)}</span></div><div class="psub">${sub(r)}</div><b class="pval">${val2(r.v)}</b><div class="ped">${k}</div></div>`};
    const rows=top.slice(3).map((r,i)=>`<div class="lrow${r.me?' me':''}" data-pi="${i+3}"><em class="lrk">${i+4}</em>${tagH(r)}<span class="lnk">${nick(r)}</span><span class="lsub">${sub(r)}</span><b class="lval">${val2(r.v)}</b></div>`).join('');
    const u=tgUser(),mine={name:u.first_name||'Игрок',me:true};
    body=(top.length?`<div class="podium">${pod(2)}${pod(1)}${pod(3)}</div>`+(rows?`<div class="lbcard">${rows}</div>`:''):'<div class="pcard lbmsg"><small>Пока никого нет. Ты можешь стать первым.</small></div>')+
    `<div class="mebar"><em>${me&&me.rank?fmt(me.rank):'—'}</em><span class="mnm">${nick(mine)}</span><span class="you">ТЫ</span><b class="lval">${val2(net?Math.round(netWorth()):S.bestv)}</b></div>`;
  }else body='';
  setHtml($('#tab-top'),`<div class="ahead"><h2>Рейтинг</h2></div>
  <button class="pcard achbtn" id="clan-open"><div><b>Кланы</b><small>Вступи в клан или создай свой</small></div><span class="trophy">🛡️</span></button>
  <div class="seg two"><button data-by="net" aria-pressed="${net}">Капитал</button><button data-by="best" aria-pressed="${!net}">Лучший ник</button></div>
  ${lb.cheat?'<div class="pcard lbmsg warn"><b>Данные не прошли проверку</b><small>Капитал вырос быстрее, чем это возможно в игре. Рейтинг, рынок, кланы и музей закрыты, пока данные не придут в норму.</small></div>':''}
  ${body}
  <div class="pcard sndrow"><div><b>Показывать меня</b><small>Если выключить, тебя не будет в таблице</small></div><button class="sw${S.hide?'':' on'}" id="top-hide" role="switch" aria-checked="${!S.hide}"></button></div>`);
}
$('#tab-top').onclick=e=>{
  {const pr=e.target.closest('[data-pi]');if(pr&&!e.target.closest('#top-hide'))return playerSheet(+pr.dataset.pi)}
  if(e.target.closest('#top-back'))return tab('prof');
  if(e.target.closest('#clan-open'))return tab('clan');
  if(e.target.closest('#top-retry'))return openTop();
  const b=e.target.closest('[data-by]');if(b&&b.dataset.by!==lb.by){lb.by=b.dataset.by;return openTop()}
  if(e.target.closest('#top-hide')){S.hide=S.hide?0:1;save();lb.sent='';lbPush(true).then(()=>{if(!$('#tab-top').hidden)openTop()});renderTop()}
};
setInterval(()=>{if(!document.hidden)lbPush()},60000);

// ---------- Кланы ----------
// Кланы живут на сервере рейтинга (rating-worker). Очки клана = сумма капиталов его игроков; уровень клана растёт с очками, а с ним и число мест.
const CLAN_COST=3000000;   // цена создания клана (монет); сервер дополнительно проверяет, что капитал игрока не меньше
const CE={sync:'Подожди пару секунд: профиль ещё не отправлен на сервер',inclan:'Ты уже в клане',nofunds:'Для создания клана не хватает капитала',exists:'Такой тег или название уже занято',full:'В клане нет мест',lvl:'Не хватает уровня',tag:'Тег: от 2 до 5 латинских букв или цифр',name:'Название: от 3 до 20 символов',notfound:'Клан или заявка не найдены',leader:'Это может только лидер',manyreq:'Не больше 5 заявок одновременно',self:'Себя выгнать нельзя',wait:'Подожди несколько секунд'};
const cl={tab:'',q:'',list:null,my:0,me:null,load:false,err:'',sheet:'',form:null,armed:'',busy:false};
const CICON=['🛡️','⭐','💎','🔥','👑','⚔️','🐉','🦅','🌙','⚡'];
const chash=s=>[...s].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7);
const cerr=e=>{const m=String(e&&e.message||e).replace(/^e:/,'');return CE[m]||(m==='http 401'?'Ошибка проверки Telegram':m==='http 500'?'Ошибка сервера':'Нет связи с сервером')};
const joinWord=j=>j?'По заявке':'Открытый';
async function openClan(){
  renderClan();if(!API||!tg||!tg.initData)return;
  cl.load=true;cl.err='';renderClan();
  try{await lbPush(true);cl.me=await lbReq('/clan/me');if(!cl.tab)cl.tab=cl.me.clan?'my':'list';await loadClans(true)}catch(e){cl.err=cerr(e);if(!cl.tab)cl.tab='list'}
  cl.load=false;if(!$('#tab-clan').hidden)renderClan();
}
async function loadClans(quiet){
  try{const r=await lbReq('/clans?q='+encodeURIComponent(cl.q));cl.list=r.clans;cl.my=r.my}catch(e){if(!quiet)toast(cerr(e))}
}
async function clanAct(path,body,ok){   // общий вызов действия: блокирует повторные нажатия, обновляет данные
  if(cl.busy)return false;cl.busy=true;cl.armed='';
  try{const r=await lbReq(path,body||{});if(ok)toast(typeof ok==='function'?ok(r):ok);
    cl.me=await lbReq('/clan/me');await loadClans(true);cl.busy=false;return r}
  catch(e){cl.busy=false;toast(cerr(e));renderClan();return false}
}
function clanCard(c){
  const ic=CICON[chash(c.tag)%CICON.length],hue=chash(c.tag)%360,mine=c.id===cl.my;
  let act;
  if(mine)act='<span class="cchip ok">Твой клан</span>';
  else if(cl.my)act='';
  else if(c.req)act=`<button class="cchip warn" data-cancel="${c.id}">Заявка отправлена · отменить</button>`;
  else if(c.n>=c.cap)act='<span class="cchip">Мест нет</span>';
  else if(S.lvl<c.minlvl)act=`<span class="cchip">С ${c.minlvl} уровня</span>`;
  else act=`<button class="btn main sm" data-join="${c.id}">${c.join?'Подать заявку':'Вступить'}</button>`;
  return `<div class="ccard${mine?' mine':''}" style="--ch:${hue}"><div class="cic">${ic}</div><div class="cbody"><b><em class="ctag">[${escH(c.tag)}]</em> ${escH(c.name)}</b>
    <small>${c.lvl} ур. · ${c.n}/${c.cap} · ${joinWord(c.join)}${c.minlvl>1?` · с ${c.minlvl} ур.`:''}</small><small class="cpts">${fmt(c.pts)} очков</small>${c.descr?`<small class="cdesc">${escH(c.descr)}</small>`:''}</div><div class="cact">${act}</div></div>`;
}
function clanMy(){
  const m=cl.me;if(!m||!m.clan)return `<div class="pcard lbmsg"><b>Ты пока не в клане</b><small>Вступи в клан во вкладке «Кланы» или создай свой.</small><button class="btn main" data-ct="list">К списку кланов</button></div>`;
  const c=m.clan,ic=CICON[chash(c.tag)%CICON.length];
  const need=(c.lvl)*3000000,pr=Math.min(100,(c.pts%3000000)/3000000*100);
  let h=`<div class="pcard cmain" style="--ch:${chash(c.tag)%360}"><div class="chead"><div class="cic big">${ic}</div><div><b class="cn"><em class="ctag">[${escH(c.tag)}]</em> ${escH(c.name)}</b><small>${c.lvl} уровень · ${c.n}/${c.cap} · ${joinWord(c.join)}${c.minlvl>1?` · с ${c.minlvl} ур.`:''}</small></div></div>
    ${c.descr?`<p class="cdesc2">${escH(c.descr)}</p>`:''}
    <div class="cpts2"><span>Очки клана</span><b>${fmt(c.pts)}</b></div>
    <div class="qbar"><i style="width:${c.lvl>=20?100:pr}%"></i></div><small class="cnext">${c.lvl>=20?'Максимальный уровень':`До ${c.lvl+1} уровня: ${fmt(c.lvl*3000000-c.pts)} очков (+2 места)`}</small>
    <div class="crow2">${c.link?`<button class="btn" data-link="${escH(c.link)}">💬 Чат клана</button>`:''}${m.leader?'<button class="btn" id="cl-edit">⚙ Настройки</button>':''}<button class="btn${cl.armed==='leave'?' danger':''}" data-arm="leave">${cl.armed==='leave'?'Точно выйти?':'Выйти'}</button></div></div>`;
  if(m.leader&&m.requests.length)h+=`<h3 class="ch3">Заявки · ${m.requests.length}</h3>`+m.requests.map(r=>`<div class="mrow"><div class="mn"><b>${escH(r.name)}</b><small>${r.lvl} ур. · ${fmtC(r.pts)} 🪙</small></div><div class="mbt"><button class="btn main sm" data-acc="${r.uid}">✓</button><button class="btn sm" data-rej="${r.uid}">✕</button></div></div>`).join('');
  h+=`<h3 class="ch3">Участники · ${m.members.length}</h3>`+m.members.map((x,i)=>`<div class="mrow${x.me?' me':''}"><em>${i+1}</em><div class="mn"><b>${escH(x.name)}${x.owner?' 👑':''}</b><small>${x.lvl} ур.</small></div><span class="mpt">${fmtC(x.pts)} 🪙</span>${m.leader&&!x.me?`<button class="btn sm${cl.armed==='k'+x.uid?' danger':''}" data-arm="k${x.uid}" aria-label="Выгнать">${cl.armed==='k'+x.uid?'Выгнать?':'✕'}</button>`:''}</div>`).join('');
  return h;
}
function clanSheet(){
  const f=cl.form;if(!cl.sheet||!f)return '';
  const edit=cl.sheet==='edit';
  return `<div class="usheet" id="csheet"><div class="sbg" data-cclose="1"></div><div class="sbox"><div class="shead"><b>${edit?'Настройки клана':'Новый клан'}</b></div>
  <div class="cform">${edit?'':`<label>Тег<input id="f-tag" maxlength="5" autocapitalize="characters" placeholder="ABC" value="${escH(f.tag)}"></label><label>Название<input id="f-name" maxlength="20" placeholder="Название клана" value="${escH(f.name)}"></label>`}
  <label>Описание<textarea id="f-descr" maxlength="90" rows="2" placeholder="Коротко о клане">${escH(f.descr)}</textarea></label>
  <label>Ссылка на чат (t.me)<input id="f-link" maxlength="64" placeholder="https://t.me/…" value="${escH(f.link)}"></label>
  <div class="seg two"><button data-fj="0" aria-pressed="${!f.join}">Открытый</button><button data-fj="1" aria-pressed="${!!f.join}">По заявке</button></div>
  <label>Минимальный уровень<select id="f-lvl">${[1,2,3,5,8,10,15,20,30,40,50].map(v=>`<option value="${v}"${v===f.minlvl?' selected':''}>${v}</option>`).join('')}</select></label></div>
  ${edit?'':`<small class="sum">Создание стоит ${fmt(CLAN_COST)} 🪙${S.coins<CLAN_COST?` · не хватает ${fmt(CLAN_COST-S.coins)}`:''}</small>`}
  <button class="btn main" id="f-ok"${!edit&&S.coins<CLAN_COST?' disabled':''}>${edit?'Сохранить':`Создать за ${fmtC(CLAN_COST)} 🪙`}</button><button class="btn" data-cclose="1">Отмена</button></div></div>`;
}
function renderClan(){
  const el=$('#tab-clan');if(!el)return;
  const tabs=[['my','Мой клан'],['list','Кланы']];
  let body;
  if(!API)body='<div class="pcard lbmsg"><b>Кланы пока не подключены</b><small>Нужен сервер из папки rating-worker (см. README). Впиши его адрес в константу API.</small></div>';
  else if(!tg||!tg.initData)body='<div class="pcard lbmsg"><b>Кланы доступны в Telegram</b><small>Открой игру через бота.</small></div>';
  else if(cl.load&&!cl.me&&!cl.list)body='<div class="pcard lbmsg"><small>Загружаю…</small></div>';
  else if(cl.err&&!cl.me)body=`<div class="pcard lbmsg"><b>${escH(cl.err)}</b><button class="btn main" id="cl-retry">Повторить</button></div>`;
  else if(cl.tab==='my')body=clanMy();
  else body=(cl.my?'':`<button class="btn main cwide" id="cl-new">＋ Создать клан за ${fmtC(CLAN_COST)} 🪙</button>`)+`<input class="csearch" id="cl-q" type="search" placeholder="Название или тег" value="${escH(cl.q)}" autocomplete="off"><div class="chd"><b>Кланы сервера</b><small>по очкам</small></div>`+
    ((cl.list||[]).length?cl.list.map(clanCard).join(''):'<div class="pcard lbmsg"><small>Кланов не найдено.</small></div>');
  const keep=document.activeElement&&document.activeElement.id==='cl-q';
  setHtml(el,`<div class="ahead"><button class="btn sm" id="cl-back">‹ Рейтинг</button><h2>Кланы</h2></div>
  <div class="seg two">${tabs.map(([k,l])=>`<button data-ct="${k}" aria-pressed="${cl.tab===k}">${l}</button>`).join('')}</div>${body}${clanSheet()}`);
  if(keep){const i=$('#cl-q');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}
}
function readForm(){
  const g=id=>{const e=$('#'+id);return e?e.value:''};const f=cl.form;
  if($('#f-tag'))f.tag=g('f-tag').toUpperCase();if($('#f-name'))f.name=g('f-name');f.descr=g('f-descr');f.link=g('f-link');f.minlvl=+g('f-lvl')||1;
}
let clanQ=0;
$('#tab-clan').oninput=e=>{if(e.target.id!=='cl-q')return;cl.q=e.target.value;clearTimeout(clanQ);clanQ=setTimeout(async()=>{await loadClans(true);renderClan()},350)};
$('#tab-clan').onclick=async e=>{
  const t=e.target;
  if(t.closest('#cl-back'))return tab('top');
  if(t.closest('#cl-retry'))return openClan();
  const ct=t.closest('[data-ct]');if(ct){cl.tab=ct.dataset.ct;cl.armed='';return renderClan()}
  if(t.closest('[data-cclose]')){cl.sheet='';return renderClan()}
  const fj=t.closest('[data-fj]');if(fj){readForm();cl.form.join=+fj.dataset.fj;return renderClan()}
  if(t.closest('#cl-new')){cl.form={tag:'',name:'',descr:'',link:'',join:0,minlvl:1};cl.sheet='new';return renderClan()}
  if(t.closest('#cl-edit')&&cl.me&&cl.me.clan){const c=cl.me.clan;cl.form={tag:c.tag,name:c.name,descr:c.descr,link:c.link,join:c.join,minlvl:c.minlvl};cl.sheet='edit';return renderClan()}
  if(t.closest('#f-ok')){
    readForm();const f=cl.form,edit=cl.sheet==='edit';
    if(!edit&&S.coins<CLAN_COST)return toast('Не хватает монет');
    const r=await clanAct(edit?'/clan/edit':'/clan/create',f,edit?'Настройки сохранены':'🛡️ Клан создан!');
    if(r){if(!edit){S.coins-=CLAN_COST;save();render();cl.tab='my'}cl.sheet='';renderClan()}
    return;
  }
  const j=t.closest('[data-join]');if(j){const r=await clanAct('/clan/join',{id:+j.dataset.join},r=>r.joined?'Ты в клане!':'Заявка отправлена');if(r&&r.joined)cl.tab='my';return renderClan()}
  const cn=t.closest('[data-cancel]');if(cn){await clanAct('/clan/cancel',{id:+cn.dataset.cancel},'Заявка отменена');return renderClan()}
  const ac=t.closest('[data-acc]');if(ac){await clanAct('/clan/accept',{uid:ac.dataset.acc,ok:1},'Принят в клан');return renderClan()}
  const rj=t.closest('[data-rej]');if(rj){await clanAct('/clan/accept',{uid:rj.dataset.rej,ok:0},'Заявка отклонена');return renderClan()}
  const lk=t.closest('[data-link]');if(lk)return openTg(lk.dataset.link);
  const ar=t.closest('[data-arm]');
  if(ar){const k=ar.dataset.arm;
    if(cl.armed!==k){cl.armed=k;renderClan();setTimeout(()=>{if(cl.armed===k){cl.armed='';renderClan()}},4000);return}
    if(k==='leave'){const r=await clanAct('/clan/leave',{},'Ты вышел из клана');if(r){cl.tab='list'}return renderClan()}
    if(k[0]==='k'){await clanAct('/clan/kick',{uid:k.slice(1)},'Игрок исключён');return renderClan()}
  }
};

// ---------- Кейсы (под рулеткой) ----------
// w: [редкость, шанс %]. Цены подобраны так, чтобы в среднем игрок получал около 90% цены кейса ником (средняя цена ников редкости берётся из пула).
const CASES=[
  {id:'daily',n:'Подарок дня',ic:'🎁',c:'#27D96B',price:0,daily:1,d:'Бесплатно раз в сутки: обычные и необычные, иногда редкие',w:[[0,40],[1,40],[2,17],[3,3]]},
  {id:'start',n:'Первая добыча',ic:'📦',c:'#27D9BD',price:5200,d:'Необычные и редкие, с шансом на легендарный',w:[[1,55],[2,35],[3,9],[4,1]]},
  {id:'rare',n:'Сундук странника',ic:'💠',c:'#9B7BFF',price:25000,d:'Редкие и эпические, иногда мифический',w:[[2,40],[3,45],[4,14],[5,1]]},
  {id:'all',n:'Всё или ничего',ic:'🎲',c:'#FF5FA2',price:52000,d:'98% редкий ник, 2% — секретный',w:[[2,98],[6,2]]},
  {id:'star',n:'Комета',ic:'☄️',c:'#FFB62E',price:185000,d:'Много мифических и шанс на секретный',w:[[3,50],[4,30],[5,17],[6,3]]},
  {id:'abyss',n:'Чёрная дыра',ic:'🌌',c:'#FF4B3E',price:650000,d:'Только легендарные, мифические и секретные',w:[[4,30],[5,55],[6,15]]},
];
let cs={id:'',busy:false,res:null,tiles:[]},tierPool=null;
const poolOf=t=>{if(!tierPool){tierPool=[[],[],[],[],[],[],[]];prizePool().forEach(x=>tierPool[x.t].push(x))}return tierPool[t]};
const pctw=w=>w%1?w.toFixed(1).replace('.',','):String(w);
function rollTier(c){let r=Math.random()*c.w.reduce((s,x)=>s+x[1],0);for(const [t,w] of c.w){r-=w;if(r<0)return t}return c.w[c.w.length-1][0]}
const dClaimed=()=>S.dcase===todayK();
function casesHtml(){return `<div class="cshd"><b>Кейсы</b><small>Открыто: ${fmt(S.casen)}</small></div><div class="csgrid">`+CASES.map(c=>`<button class="cscard${S.coins<c.price?' poor':''}${c.daily&&dClaimed()?' done':''}" data-case="${c.id}" style="--cc:${c.c}"><span class="csi">${c.ic}</span><b>${c.n}</b><small>${c.d}</small><span class="csp">${c.daily?(dClaimed()?'Через '+leftT(msToDay()):'Бесплатно · раз в сутки'):fmt(c.price)+' 🪙'}</span></button>`).join('')+'</div>'}
function renderCases(){
  let el=$('#cases');if(!el){const st=document.querySelector('#tab-game .stats');if(!st)return;el=document.createElement('div');el.id='cases';st.after(el)}
  setHtml(el,'');
  if(!$('#tab-bon').hidden)try{renderBon()}catch(e){}
}
function caseSheet(){
  let sh=$('#casesh');if(!sh){sh=document.createElement('div');sh.id='casesh';sh.className='usheet';sh.hidden=true;document.body.appendChild(sh);
    sh.onclick=e=>{if(e.target.closest('[data-cclose]')&&!cs.busy){cs.id='';cs.res=null;caseSheet()}if(e.target.closest('#cs-open'))openCase()}}
  const c=CASES.find(x=>x.id===cs.id);if(!c){sh.hidden=true;sh.innerHTML='';return}
  sh.hidden=false;
  const fr=(S.cfree&&S.cfree[c.id])|0,rs=cs.res,need=(fr>0?0:c.price)-S.coins,dd=c.daily&&dClaimed()&&!cs.busy;
  sh.innerHTML=`<div class="sbg" data-cclose="1"></div><div class="sbox casebox" style="--cc:${c.c}"><div class="shead"><b>${c.ic} ${c.n}</b><button class="btn sm" data-cclose="1"${cs.busy?' disabled':''}>✕</button></div>
  <p class="cdesc3">${c.d}</p>
  <div class="codds">${c.w.map(([t,w])=>`<span style="--tc:${T[t].c}"><i></i>${T[t].n} <b>${pctw(w)}%</b></span>`).join('')}</div>
  <div class="crl" id="crl"><i class="cptr"></i><div class="crt" id="crt"></div></div>
  <div id="cres">${rs?`<div class="cresc" style="--tc:${T[rs.t].c}"><small>${T[rs.t].n}</small><b>@${escH(rs.name)}</b><span>${fmt(rs.price)} 🪙</span><em>${escH(rs.msg)}</em></div>`:''}</div>
  <button class="btn main" id="cs-open"${cs.busy||need>0||dd?' disabled':''}>${cs.busy?'Открываем…':c.daily?(dd?'Следующий через '+leftT(msToDay()):'Открыть бесплатно'):need>0?`Не хватает ${fmt(need)} 🪙`:(fr>0?`Открыть бесплатно (промокод ×${fr})`:(rs?'Открыть ещё · ':'Открыть за ')+fmt(c.price)+' 🪙')}</button></div>`;
}
function caseTile(t,name){return `<b class="ct" style="--tc:${T[t].c}"><i>${escH(name)}</i><small>${T[t].s}</small></b>`}
async function openCase(){
  const c=CASES.find(x=>x.id===cs.id);const fr=S.cfree&&S.cfree[c&&c.id]>0;if(!c||cs.busy||(!fr&&S.coins<c.price)||(c.daily&&dClaimed()))return;
  cs.busy=true;xbusy=1;cs.res=null;
  const tier=rollTier(c),pr=P(poolOf(tier));
  if(fr)S.cfree[c.id]--;else S.coins-=c.price;if(c.daily)S.dcase=todayK();S.casen++;S.cnt[pr.t]++;S.best=Math.max(S.best,pr.t);noteBest(pr.price,pr.name);addXp(8+pr.t*6);
  const msg=stashAll([{name:pr.name,t:pr.t,p:pr.p}]);save();render();   // приз выдан сразу: закрытие приложения его не отменит
  caseSheet();
  const trk=$('#crt'),rl=$('#crl'),N=46,WIN=36,tw=96,gap=8,pitch=tw+gap;
  const tiles=Array.from({length:N},(_,i)=>{if(i===WIN)return caseTile(pr.t,pr.name);const t=rollTier(c),x=P(poolOf(t));return caseTile(t,x.name)});
  trk.innerHTML=tiles.join('');rl.classList.add('on');
  const W=rl.clientWidth,off=(Math.random()-.5)*tw*.7,dur=reduce?60:Math.round(5000*FK()+(S.fast?300:0));
  trk.style.transition='none';trk.style.transform='translateX(0)';void trk.offsetWidth;
  trk.style.transition=`transform ${dur}ms cubic-bezier(.08,.6,.12,1)`;trk.style.transform=`translateX(${W/2-(WIN*pitch+tw/2+off)}px)`;
  sfx('upstart');
  if(!reduce){let last=-1,lt=0;const t0=performance.now();
    (function tk(){const x=new DOMMatrix(getComputedStyle(trk).transform).m41,i=Math.floor((W/2-x)/pitch),now=performance.now();
      if(i!==last&&now-lt>60){last=i;lt=now;hap('i','light');sfx('uptick',Math.min(100,Math.round((now-t0)/dur*100)))}
      if(now-t0<dur)requestAnimationFrame(tk)})()}
  await sleep(dur+250);
  const w=trk.children[WIN];if(w)w.classList.add('win');
  await sleep(reduce?0:650);
  if(pr.t>=5&&!reduce)await epic({name:pr.name,t:pr.t,p:pr.p});else sfx('tier',pr.t);
  hap('n','success');
  cs.res={name:pr.name,t:pr.t,price:pr.price,msg};cs.busy=false;xbusy=0;
  save();render();caseSheet();
  const t2=$('#crt'),r2=$('#crl');if(t2&&r2){r2.classList.add('on');t2.innerHTML=tiles.join('');t2.style.transition='none';t2.style.transform=`translateX(${r2.clientWidth/2-(WIN*pitch+tw/2+off)}px)`;const ww=t2.children[WIN];if(ww)ww.classList.add('win')}
}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-case]');if(!b||cs.busy)return;cs.id=b.dataset.case;cs.res=null;caseSheet()});
// ---------- Зал в музее: пассивный доход ----------
var WORKMAX=3,WORKCAP=8*3600e3,WORKRATE=.0025,wkPick=false,wkTm=0;   // до 3 ников; 0,25% цены ника в час; копится до 8 часов
function workList(){S.work=S.work.filter(w=>S.items.some(i=>i.id===w.id));return S.work}
function workRate(it){return Math.max(1,Math.round(val(it.t,it.p,it.n)*WORKRATE))}
function workAcc(w,it){return Math.floor(workRate(it)*Math.min(WORKCAP,Math.max(0,Date.now()-w.t))/3600e3)}
function workTotal(){return workList().reduce((s,w)=>{const it=S.items.find(i=>i.id===w.id);return s+(it?workAcc(w,it):0)},0)}
function workPlate(){const n=workList().length,t=workTotal();return `<div class="cshd wkhd"><b>Пассивный заработок</b></div><button class="pcard achbtn" data-work="1" style="margin-bottom:12px"><div><b>Мой зал в музее</b><small>${n} из ${WORKMAX} на показе${t>0?' · накоплено '+fmtC(t)+' 🪙':' · посетители платят за просмотр'}</small></div><span class="trophy">🖼️</span></button>`}
function workSheet(close){
  let o=document.getElementById('worksh');
  if(close){if(o)o.remove();clearInterval(wkTm);wkPick=false;return}
  if(!o){o=document.createElement('div');o.id='worksh';o.className='usheet';document.body.append(o);
    wkTm=setInterval(()=>{if(document.getElementById('worksh')&&!wkPick)workSheet()},5000);
    o.onclick=e=>{
      if(e.target.closest('[data-wx]')){if(wkPick){wkPick=false;return workSheet()}return workSheet(true)}
      const add=e.target.closest('[data-wadd]');if(add){wkPick=true;return workSheet()}
      const pk=e.target.closest('[data-wpick]');
      if(pk){if(S.work.length<WORKMAX&&S.items.some(i=>i.id===pk.dataset.wpick)&&!S.work.some(w=>w.id===pk.dataset.wpick)){S.work.push({id:pk.dataset.wpick,t:Date.now()});save();sfx('tap')}wkPick=false;try{renderCases()}catch(x){}if(!$('#tab-prof').hidden)renderProf();try{if(!$('#tab-museum').hidden)renderMuseum()}catch(x){};return workSheet()}
      const rm=e.target.closest('[data-wrm]');
      if(rm){const w=S.work.find(x=>x.id===rm.dataset.wrm),it=w&&S.items.find(i=>i.id===w.id);if(w&&it){const g=workAcc(w,it);if(g>0)S.coins+=g}S.work=S.work.filter(x=>x.id!==rm.dataset.wrm);save();render();try{renderCases()}catch(x){}if(!$('#tab-prof').hidden)renderProf();try{if(!$('#tab-museum').hidden)renderMuseum()}catch(x){};return workSheet()}
      if(e.target.closest('[data-wclaim]')){
        let sum=0;workList().forEach(w=>{const it=S.items.find(i=>i.id===w.id);if(it){sum+=workAcc(w,it);w.t=Date.now()}});
        if(sum>0){S.coins+=sum;save();render();sfx('coins');hap('n','success');toast(`Заработано: +${fmt(sum)} 🪙`);try{renderCases()}catch(x){}if(!$('#tab-prof').hidden)renderProf();try{if(!$('#tab-museum').hidden)renderMuseum()}catch(x){}}
        return workSheet()}
    }}
  const list=workList();
  if(wkPick){
    const its=S.items.filter(i=>!list.some(w=>w.id===i.id)).sort((a,b)=>val(b.t,b.p,b.n)-val(a.t,a.p,a.n));
    o.innerHTML=`<div class="sbg" data-wx="1"></div><div class="sbox casebox"><div class="shead"><b>Кого выставить в зале?</b><button class="btn sm" data-wx="1">‹</button></div>`+
      (its.length?its.map(x=>`<button class="item wpk" data-wpick="${x.id}" style="--tc:${T[x.t].c}"><div><b>@${escH(x.n)}</b><small>${T[x.t].n}</small></div><span>+${fmt(workRate(x))} 🪙/ч</span></button>`).join(''):'<div class="pcard lbmsg"><small>Все ники уже на показе или коллекция пуста.</small></div>')+`</div>`;
    return;
  }
  const tot=workTotal();
  const slot=i=>{const w=list[i];if(!w)return `<button class="wslot empty" data-wadd="1"><b>＋ Выставить ник</b><small>Свободное место ${i+1} из ${WORKMAX}</small></button>`;
    const it=S.items.find(x=>x.id===w.id),rate=workRate(it),acc=workAcc(w,it),full=Date.now()-w.t>=WORKCAP;
    return `<div class="wslot" style="--tc:${T[it.t].c}"><div class="wtop"><div><b>@${escH(it.n)}</b><small>${T[it.t].n} · +${fmt(rate)} 🪙/ч</small></div><button class="btn sm" data-wrm="${it.id}">Убрать</button></div>
    <div class="wbar"><i style="width:${Math.min(100,(Date.now()-w.t)/WORKCAP*100)}%"></i></div><small class="wacc">${full?'Склад полон — забери монеты':'Накоплено'}: <b>${fmt(acc)} 🪙</b></small></div>`};
  o.innerHTML=`<div class="sbg" data-wx="1"></div><div class="sbox casebox"><div class="shead"><b>🖼️ Мой зал в музее</b><button class="btn sm" data-wx="1">✕</button></div>
    <p class="cdesc3">Выставленный ник остаётся у тебя в коллекции, а посетители музея платят за просмотр: 0,25% цены ника в час. Копится до 8 часов, потом нужно зайти и забрать.</p>
    ${[0,1,2].map(slot).join('')}
    <button class="btn main cwide" data-wclaim="1"${tot>0?'':' disabled'}>${tot>0?`Забрать всё · +${fmt(tot)} 🪙`:'Пока нечего забирать'}</button></div>`;
}

// ---------- Промокоды ----------
var PROMOS={NAMEROULETTE:{c:'star',n:1}};   // код → бесплатное открытие кейса (один раз на игрока)
function promoUse(raw){
  const code=String(raw||'').trim().toUpperCase().replace(/[^A-Z0-9_-]/g,''),pr=PROMOS[code];
  if(!code)return toast('Введи промокод');
  if(!pr)return toast('Такого промокода нет');
  if(!Array.isArray(S.promo))S.promo=[];
  if(S.promo.includes(code))return toast('Ты уже использовал этот промокод');
  const c=CASES.find(x=>x.id===pr.c);
  S.promo.push(code);if(!S.cfree||typeof S.cfree!=='object')S.cfree={};S.cfree[pr.c]=(S.cfree[pr.c]|0)+pr.n;
  save();sfx('ach');toast(`🎟️ Промокод принят: кейс «${c.n}»`);render();
  cs.id=pr.c;cs.res=null;caseSheet();
}
function promoCard(){return `<div class="pcard promo"><div class="bhead"><h3>Промокод</h3><span class="bsub">один раз на игрока</span></div><div class="prow"><input id="promo-in" type="text" placeholder="Введи код" maxlength="24" autocomplete="off" autocapitalize="characters" spellcheck="false"><button class="btn main" id="promo-go">Применить</button></div></div>`}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#promo-go')){const i=document.getElementById('promo-in');promoUse(i&&i.value);if(i)i.value=''}});

// ---------- Профиль другого игрока ----------
var pls={i:-1,d:null,err:'',busy:false};
async function playerSheet(i){
  let sh=document.getElementById('plsh');
  if(!sh){sh=document.createElement('div');sh.id='plsh';sh.className='usheet';document.body.append(sh);
    sh.onclick=e=>{if(e.target.closest('[data-plx]')){sh.remove()}}}
  pls.i=i;pls.d=null;pls.err='';plDraw();
  try{pls.d=await lbReq('/player?by='+lb.by+'&i='+i)}catch(e){pls.err='Не удалось загрузить профиль'}
  if(document.getElementById('plsh'))plDraw();
}
function plDraw(){
  const sh=document.getElementById('plsh');if(!sh)return;
  const d=pls.d,eh=x=>String(x==null?'':x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  let b;
  if(pls.err)b=`<div class="pcard lbmsg"><b>${eh(pls.err)}</b></div>`;
  else if(!d)b='<div class="pcard lbmsg"><small>Загружаю…</small></div>';
  else{
    const cs3=String(d.cos||'').split('|'),rk=rankOf(d.lvl||1),bn=d.bestn?nickVal(d.bestn):null;
    const ttl=cs3[1]&&cosTitle(cs3[1])?`<span class="ttlrow">${titleHtml(cs3[1])}</span>`:'';
    const fr=cs3[2]&&cosFrame(cs3[2])?frameRing(cs3[2]):'';
    b=`<div class="plhd"><div class="av">${fr}<span class="avi"><b>${eh([...String(d.name||'?')][0]||'?').toUpperCase()}</b></span><em class="lvb">${d.lvl||1}</em></div>
    <div class="pnm"><b class="pname">${d.tag?`<em class="ctag">[${eh(d.tag)}]</em> `:''}${nickHtml(d.name,cs3[0])}</b>${ttl}<span class="rank" style="--rc:${rk[2]}">🛡 ${rk[1]}</span></div></div>
    <div class="pgrid"><div class="pt"><small>Место в рейтинге</small><b>#${d.rank}</b></div><div class="pt"><small>Капитал</small><b>${fmtC(d.net)} 🪙</b></div>
    <div class="pt"><small>Уровень</small><b>${d.lvl||1}</b></div><div class="pt"><small>Клан</small><b>${d.cname?eh(d.cname):'—'}</b></div></div>
    <div class="pcard" style="margin:10px 0 0"><small class="cap2">Самый дорогой ник</small>${bn?`<div class="muprev">${plate(d.bestn,bn.t)}<span>${fmtC(d.best)} 🪙</span></div>`:'<p class="sum">—</p>'}</div>`;
  }
  sh.innerHTML=`<div class="sbg" data-plx="1"></div><div class="sbox casebox"><div class="shead"><b>Профиль игрока</b><button class="btn sm" data-plx="1">✕</button></div>${b}</div>`;
}

// ---------- Мини игра «Угадай юзернейм» ----------
var GSC=50000,GSM=[0,2,4.5,10,22,48,100],GST=12,gs={run:false,streak:0,r:null,pick:-1,q:'max',ans:0,tm:0};
var GSQ={max:'Какой ник ДОРОЖЕ всех?',min:'Какой ник ДЕШЕВЛЕ всех?',mid:'Какой ник ВТОРОЙ по дороговизне?'};
function gsRound(){
  clearTimeout(gs.tm);
  const qs=gs.streak===0?['max']:['max','min','mid','min'];gs.q=P(qs);
  for(let k=0;k<60;k++){
    const b=R(5),tiers=[0,1,2,3].map(()=>b+R(3)),c=tiers.map(t=>P(poolOf(t))).filter(Boolean);
    if(c.length<4||new Set(c.map(x=>x.name)).size<4)continue;
    const v=c.map(x=>x.price).sort((x,y)=>x-y);let ok=true;for(let i=1;i<4;i++)if(v[i]<v[i-1]*1.12)ok=false;
    if(!ok)continue;
    gs.r=c.sort(()=>Math.random()-.5);gs.pick=-1;gsAns();return;
  }
  gs.r=[0,1,2,3].map(i=>P(poolOf(i+1)));gs.pick=-1;gsAns();
}
function gsAns(){const o=gs.r.map((x,i)=>[x.price,i]).sort((a,b)=>a[0]-b[0]);gs.ans=gs.q==='max'?o[3][1]:gs.q==='min'?o[0][1]:o[2][1];gs.t0=Date.now()}
function gsPrize(){return Math.round(GSC*GSM[Math.min(gs.streak,GSM.length-1)])}
function gsAnswer(i){
  if(!gs.run||gs.pick>=0&&i!==-2)return;clearTimeout(gs.tm);gs.pick=i;
  if(i===gs.ans){gs.streak++;if(gs.streak>(S.gbest|0))S.gbest=gs.streak;sfx('upwin');addXp(4)}else{gs.run=false;gs.lost=true;gs.late=i<0;sfx('lose')}
  if(gs.run&&gs.streak>=GSM.length-1){S.coins=Math.min(CAP,S.coins+gsPrize());gs.run=false;gs.maxed=true;toast('🏆 Максимальная серия: +'+fmt(gsPrize())+' 🪙');sfx('coins')}
  save();render();gsSheet();
}
function gsSheet(close){
  let sh=document.getElementById('gssh');
  if(close){clearTimeout(gs.tm);if(sh)sh.remove();return}
  if(!sh){sh=document.createElement('div');sh.id='gssh';sh.className='usheet';document.body.append(sh);
    sh.onclick=e=>{
      if(e.target.closest('[data-gsx]'))return gsSheet(true);
      if(e.target.closest('#gs-start')){if(S.coins<GSC)return;S.coins-=GSC;gs.run=true;gs.streak=0;gs.lost=gs.taken=gs.maxed=false;gsRound();save();render();sfx('tap');return gsSheet()}
      const pk=e.target.closest('[data-gsp]');
      if(pk)return gsAnswer(+pk.dataset.gsp);
      if(e.target.closest('#gs-next')){gsRound();return gsSheet()}
      if(e.target.closest('#gs-take')){const p=gsPrize();S.coins=Math.min(CAP,S.coins+p);gs.run=false;gs.taken=p;sfx('coins');toast('Забрано: +'+fmt(p)+' 🪙');save();render();return gsSheet()}
    }}
  const eh=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const lad=GSM.slice(1).map((m,i)=>`<span class="gsl${gs.run&&gs.streak===i+1?' on':''}${gs.streak>i+1?' dn':''}"><b>${i+1}</b><small>×${m}</small></span>`).join('');
  const card=(x,i,rev)=>{const cl=rev?(i===gs.ans?' ok':(i===gs.pick?' bad':'')):'';
    return `<button class="gso${cl}" data-gsp="${i}"${rev?' disabled':''}><b>@${eh(x.name)}</b>${rev?`<small style="color:${T[x.t].c}">${T[x.t].n} · ${fmt(x.price)} 🪙</small>`:''}</button>`};
  let main;
  if(gs.run&&gs.r){
    const rev=gs.pick>=0,left=Math.max(0.2,GST-(Date.now()-gs.t0)/1000);
    main=`<div class="gsq ${gs.q}"><b>${GSQ[gs.q]}</b><small>Серия ${gs.streak} · в банке ${fmt(gsPrize())} 🪙</small></div>
    ${rev?'':`<div class="gstm"><i style="animation-duration:${left}s"></i></div>`}
    <div class="gsc">${gs.r.map((x,i)=>card(x,i,rev)).join('')}</div>
    ${rev?`<button class="btn main" id="gs-next">Дальше</button><button class="btn cwide" id="gs-take">Забрать ${fmt(gsPrize())} 🪙</button>`:''}`;
    if(!rev){clearTimeout(gs.tm);gs.tm=setTimeout(()=>{if(gs.run&&gs.pick<0&&document.getElementById('gssh'))gsAnswer(-1)},left*1000)}
  }else{
    const end=gs.lost?`<div class="pcard lbmsg warn"><b>${gs.late?'Время вышло':'Не угадал'} — серия сгорела</b><small>Ставка ${fmt(GSC)} 🪙 потеряна. ${GSQ[gs.q]}</small></div>`:gs.taken?`<div class="pcard lbmsg"><b>Забрано +${fmt(gs.taken)} 🪙</b></div>`:gs.maxed?`<div class="pcard lbmsg"><b>Серия из ${GSM.length-1} — максимум!</b></div>`:'';
    main=`${end}${gs.lost&&gs.r?`<div class="gsc">${gs.r.map((x,i)=>card(x,i,true)).join('')}</div>`:''}
    <p class="cdesc3">Четыре ника и вопрос: то «самый дорогой», то «самый дешёвый», то «второй по цене». Цены близкие, а на ответ ${GST} секунд. Каждый верный ответ увеличивает приз, забрать можно после любого. Ошибка или таймер — ставка сгорает. Рекорд серии: <b>${S.gbest|0}</b>.</p>
    <button class="btn main" id="gs-start"${S.coins<GSC?' disabled':''}>${S.coins<GSC?'Не хватает '+fmt(GSC-S.coins)+' 🪙':'Играть за '+fmt(GSC)+' 🪙'}</button>`;
  }
  sh.innerHTML=`<div class="sbg" data-gsx="1"></div><div class="sbox casebox"><div class="shead"><b>🔎 Угадай юзернейм</b><button class="btn sm" data-gsx="1">✕</button></div><div class="gsl-row">${lad}</div>${main}</div>`;
}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#gs-open')){if(!gs.run){gs.lost=gs.taken=gs.maxed=false;gs.r=null}gsSheet()}});


// ---------- Крафт: три ника одной редкости → один ник редкостью выше ----------
var CRM=4,CRF=.2,cr={sel:[],res:null,busy:false};   // в крафт идут ники до легендарного; комиссия 20% от стоимости трёх ников
function crItems(){return cr.sel.map(id=>S.items.find(i=>i.id===id)).filter(Boolean)}
function crSum(){return crItems().reduce((a,x)=>a+val(x.t,x.p,x.n),0)}
// шансы зависят от выбранных ников: цель = средняя редкость + 1, дробная часть делит шанс между двумя соседними редкостями
function crOdds(items){
  if(items.length!==3)return[];
  const m=items.reduce((a,x)=>a+x.t,0)/3+1,lo=Math.floor(m+1e-9),fr=m-lo,r=Math.round(fr*100)/100;
  const o=[];if(r<1)o.push([Math.min(5,lo),1-r]);if(r>0)o.push([Math.min(5,lo+1),r]);
  const mg={};o.forEach(([t,w])=>mg[t]=(mg[t]||0)+w);return Object.entries(mg).map(([t,w])=>[+t,w]).sort((a,b)=>a[0]-b[0]);
}
function crSheet(close){
  let sh=document.getElementById('crsh');
  if(close){if(sh)sh.remove();return}
  if(!sh){sh=document.createElement('div');sh.id='crsh';sh.className='usheet';document.body.append(sh);
    sh.onclick=e=>{
      if(e.target.closest('[data-crx]'))return crSheet(true);
      const it=e.target.closest('[data-cri]');
      if(it&&!cr.busy){const id=it.dataset.cri,k=cr.sel.indexOf(id);if(k>=0)cr.sel.splice(k,1);else if(cr.sel.length<3)cr.sel.push(id);cr.res=null;sfx('tick');return crSheet()}
      if(e.target.closest('#cr-go'))return crGo();
    }}
  const eh=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  cr.sel=cr.sel.filter(id=>S.items.some(i=>i.id===id&&i.t<=CRM));
  const list=S.items.filter(i=>i.t<=CRM).sort((a,b)=>a.t-b.t||val(b.t,b.p,b.n)-val(a.t,a.p,a.n)),its=crItems();
  const fee=Math.round(crSum()*CRF),ok=its.length===3&&S.coins>=fee,odds=crOdds(its);
  const slots=[0,1,2].map(i=>{const x=its[i];return `<div class="crslot${x?' fl':''}"${x?` style="--tc:${T[x.t].c}"`:''}>${x?'@'+eh(x.n):'?'}</div>`}).join('');
  const oddsH=odds.length?`<div class="crodds">${odds.map(([t,w])=>`<span style="--tc:${T[t].c}"><i></i>${T[t].n} <b>${Math.round(w*100)}%</b></span>`).join('')}</div>`:'<div class="crodds"><small>Выбери три ника — здесь появятся шансы</small></div>';
  const res=cr.res?`<div class="cresc" style="--tc:${T[cr.res.t].c}"><small>${T[cr.res.t].n}</small><b>@${eh(cr.res.name)}</b><span>${fmt(cr.res.price)} 🪙</span></div>`:'';
  sh.innerHTML=`<div class="sbg" data-crx="1"></div><div class="sbox casebox"><div class="shead"><b>⚗️ Крафт</b><button class="btn sm" data-crx="1">✕</button></div>
  <p class="cdesc3">Выбери три любых ника, можно разной редкости: они сгорят, а взамен придёт случайный ник. Чем выше редкость выбранных, тем выше шанс на лучший результат. Комиссия — ${Math.round(CRF*100)}% от их стоимости.</p>
  <div class="crslots">${slots}<i>→</i><div class="crslot out">?</div></div>
  ${oddsH}${res}
  <div class="slist mpick">${list.length?list.map(x=>`<button class="item wpk${cr.sel.includes(x.id)?' crsel':''}" data-cri="${x.id}" style="--tc:${T[x.t].c}"><div><b>@${eh(x.n)}</b><small>${T[x.t].n}</small></div><span>${fmt(val(x.t,x.p,x.n))} 🪙</span></button>`).join(''):'<div class="pcard lbmsg"><small>Нет ников для крафта (легендарные и выше не берём).</small></div>'}</div>
  <button class="btn main" id="cr-go"${ok?'':' disabled'}>${its.length<3?`Выбрано ${its.length} из 3`:S.coins<fee?`Не хватает ${fmt(fee-S.coins)} 🪙`:`Скрафтить · ${fmt(fee)} 🪙`}</button></div>`;
}
function crGo(){
  const items=crItems();if(items.length!==3||cr.busy||items.some(x=>x.t>CRM))return;
  const fee=Math.round(crSum()*CRF);if(S.coins<fee)return;
  let r=Math.random(),tier=0;const od=crOdds(items);for(const [t,w] of od){tier=t;if(r<w)break;r-=w}
  const pr=P(poolOf(tier));if(!pr)return;
  S.coins-=fee;S.items=S.items.filter(i=>!cr.sel.includes(i.id));
  addItem(pr.name,pr.t,pr.p);S.best=Math.max(S.best,pr.t);try{noteBest(pr.price,pr.name)}catch(e){}addXp(10+pr.t*6);
  cr.res=pr;cr.sel=[];save();render();sfx('tier');hap('n','success');try{if(!$('#tab-prof').hidden)renderProf()}catch(e){}
  crSheet();
}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-craft]')){cr.sel=[];cr.res=null;crSheet()}});

// ---------- Моментальная лотерея: три одинаковых символа — приз ----------
var LOTP=100000,LOT=[{s:'🍒',v:200000,p:.07},{s:'🍋',v:300000,p:.035},{s:'🔔',v:600000,p:.018},{s:'⭐',v:1500000,p:.006},{s:'💎',v:5000000,p:.0012},{s:'👑',v:25000000,p:.0001},{s:'🔮',nick:1,p:.0002}],lt={t:null,done:false};
function lotCard(){return `<button class="lotcard${S.coins<LOTP?' poor':''}" id="lot-open"><span class="lci">🎟️</span><div><b>Моментальная лотерея</b><small>Билет ${fmt(LOTP)} 🪙 · найди три одинаковых из девяти</small></div><span class="lcp">›</span></button>`}
var LOTX=['🍀','🎲','🍉','🍇'];   // «пустые» символы для заполнения билета
function lotRoll(){
  let r=Math.random(),w=null;for(const x of LOT){if(r<x.p){w=x;break}r-=x.p}
  const all=LOT.map(x=>x.s).concat(LOTX),cnt={},cells=[];
  const put=sym=>{cnt[sym]=(cnt[sym]||0)+1;cells.push(sym)};
  if(w)for(let i=0;i<3;i++)put(w.s);
  while(cells.length<9){const c=P(all);if((cnt[c]||0)<2&&!(w&&c===w.s))put(c)}   // кроме выигрышного символа ни один не встречается больше двух раз
  for(let i=cells.length-1;i>0;i--){const j=R(i+1);[cells[i],cells[j]]=[cells[j],cells[i]]}
  return{cells,hit:w?cells.map((c,i)=>c===w.s?i:-1).filter(i=>i>=0):[],w};
}
function claimLot(){
  const p=S.lotp;if(!p)return '';
  S.lotp=null;let msg;
  if(p.k==='c'){S.coins+=+p.v;msg=`+${fmt(+p.v)} 🪙`}
  else{const r=score(p.name);if(S.items.length<MAX){addItem(p.name,r.t,r.p);msg=`секретный ник @${p.name}`}else{const v=val(r.t,r.p,p.name);S.coins+=v;S.sold++;msg=`@${p.name} продан за ${fmt(v)} 🪙 (нет места)`}}
  save();render();return msg;
}
function lotScratch(cv,done){
  const dpr=Math.min(2,devicePixelRatio||1),w=cv.clientWidth,h=cv.clientHeight;cv.width=w*dpr;cv.height=h*dpr;
  const g=cv.getContext('2d');g.scale(dpr,dpr);
  const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#9AA3B2');gr.addColorStop(.45,'#E9EDF4');gr.addColorStop(1,'#9AA3B2');g.fillStyle=gr;g.fillRect(0,0,w,h);
  g.fillStyle='rgba(55,65,85,.55)';g.font='800 14px sans-serif';g.textAlign='center';g.fillText('СОТРИ ЗАЩИТНЫЙ СЛОЙ',w/2,h/2+5);
  g.globalCompositeOperation='destination-out';g.lineCap='round';g.lineWidth=40;
  let down=false,last=null,lastT=0,fin=false;
  const pt=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  const seg=(a,b)=>{g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()};
  const check=()=>{if(fin)return;const d=g.getImageData(0,0,cv.width,cv.height).data;let c=0,t=0;for(let i=3;i<d.length;i+=4*29){t++;if(d[i]<20)c++}if(c/t>.5){fin=true;done()}};
  cv.onpointerdown=e=>{down=true;try{cv.setPointerCapture(e.pointerId)}catch(x){}last=pt(e);seg(last,last);e.preventDefault()};
  cv.onpointermove=e=>{if(!down)return;const q=pt(e);seg(last,q);last=q;const n=Date.now();if(n-lastT>140){lastT=n;check();sfx('tick')}};
  cv.onpointerup=cv.onpointercancel=()=>{down=false;check()};
  cv.wipe=()=>{if(fin)return;fin=true;done()};
}
function lotSheet(close){
  let o=document.getElementById('lotsh');
  if(close){if(o)o.remove();if(S.lotp){const m=claimLot();if(m)toast('Приз лотереи: '+m)}lt.t=null;lt.done=false;return}
  if(!o){o=document.createElement('div');o.id='lotsh';o.className='usheet';document.body.append(o);
    o.onclick=e=>{
      if(e.target.closest('[data-lx]'))return lotSheet(true);
      if(e.target.closest('#lot-wipe')){const cv=$('#lot-cv');cv&&cv.wipe&&cv.wipe();return}
      if(e.target.closest('#lot-buy')){
        if(S.coins<LOTP)return toast('Не хватает монет');
        if(S.lotp){const m=claimLot();if(m)toast('Приз лотереи: '+m)}
        const r=lotRoll();S.coins-=LOTP;S.lotn++;
        r.nm=P(SECRETS);S.lotp=r.w?(r.w.nick?{k:'n',name:r.nm}:{k:'c',v:r.w.v}):null;   // приз записан сразу: закрытие приложения его не отменит
        save();render();lt.t=r;lt.done=false;sfx('upstart');lotSheet();
      }}}
  const t=lt.t,poor=S.coins<LOTP;
  const symsHtml=t?t.cells.map((x,i)=>`<span class="lsy${lt.done&&t.hit.includes(i)?' hit':''}">${x}</span>`).join(''):'';
  const res=t&&lt.done?(t.w?`<div class="lotres win"><b>Выигрыш!</b><span>${t.w.nick?'Секретный ник: @'+escH(t.nm||''):'+'+fmt(t.w.v)+' 🪙'}</span></div>`:'<div class="lotres lose"><b>Не повезло</b><span>Трёх одинаковых нет</span></div>'):'';
  o.innerHTML=`<div class="sbg" data-lx="1"></div><div class="sbox casebox lotbox"><div class="shead"><b>🎟️ Моментальная лотерея</b><button class="btn sm" data-lx="1">✕</button></div>
    <p class="cdesc3">Сотри защитный слой. Найдёшь три одинаковых символа среди девяти — приз твой сразу.</p>
    <div class="ticket"><div class="thd"><b>МОМЕНТАЛЬНАЯ ЛОТЕРЕЯ</b><span>№ ${S.lotn?String(S.lotn).padStart(6,'0'):'—'}</span></div>
      <div class="lscr${t&&lt.done&&t.w?' win':''}">${t?`<div class="lsyms">${symsHtml}</div>${lt.done?'':'<canvas id="lot-cv"></canvas>'}`:'<div class="lph"><span>🎟️</span><b>Купи билет ниже</b></div>'}</div></div>
    ${res}
    ${t&&!lt.done?'<button class="btn cwide" id="lot-wipe">Стереть всё</button>':`<button class="btn main cwide" id="lot-buy"${poor?' disabled':''}>${poor?'Не хватает монет':(t?'Купить ещё · ':'Купить билет · ')+fmt(LOTP)+' 🪙'}</button>`}
    <details class="lodds"><summary>Шансы и призы</summary>${LOT.map(x=>`<div class="lrw"><span>${x.s}${x.s} ${x.s}</span><b>${x.nick?'случайный секретный ник':fmt(x.v)+' 🪙'}</b><small>${(x.p*100).toFixed(x.p<.001?2:1).replace('.',',')}%</small></div>`).join('')}<small class="sum">Общий шанс выигрыша около ${(LOT.reduce((a,x)=>a+x.p,0)*100).toFixed(1).replace('.',',')}%. Если трёх одинаковых нет, приза нет.</small></details></div>`;
  const cv=$('#lot-cv');
  if(cv&&t&&!lt.done)lotScratch(cv,()=>{
    lt.done=true;cv.style.transition='opacity .45s';cv.style.opacity='0';
    setTimeout(()=>{
      if(t.w){const m=claimLot();sfx(t.w.v>=1500000||t.w.nick?'ach':'coins');hap('n','success');try{boom('#FFC933',t.w.v>=1500000||t.w.nick?5:3)}catch(x){}if(m)toast('Приз: '+m)}
      else{sfx('lose');hap('n','warning')}
      lotSheet();render();
    },reduce?0:420);
  });
}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target;if(!t)return;if(t.closest('#lot-open')){lt.t=null;lt.done=false;lotSheet()}else if(t.closest('[data-work]'))workSheet()});
try{const m=claimLot();if(m)setTimeout(()=>toast('Приз лотереи: '+m),1500)}catch(e){}

renderCases();

// ---------- Рынок между игроками ----------
// Лоты хранит сервер (rating-worker). Тип и цену ника покупатель считает сам по названию, а не берёт у продавца.
const ME={sync:'Подожди пару секунд: профиль ещё не отправлен на сервер',gone:'Лот уже продан или снят',own:'Это твой лот',changed:'Цена изменилась, обнови список',toomany:'Не больше 10 лотов одновременно',price:'Цена: от 10 до 2 000 000 000 🪙',name:'Этот ник нельзя выставить'};
const mk={hist:null,tab:'buy',q:'',sort:'new',lots:null,my:null,load:false,err:'',sheet:false,sel:'',price:'',busy:false};
const merr=e=>{const m=String(e&&e.message||e).replace(/^e:/,'');return ME[m]||(m==='http 401'?'Ошибка проверки Telegram':m==='http 500'?'Ошибка сервера':m==='wait'?'Подожди несколько секунд':'Нет связи с сервером')};
const nickVal=n=>{const s=score(n);return {t:s.t,p:s.p,v:val(s.t,s.p,n)}};
async function openMarket(){
  renderMarket();if(!API||!tg||!tg.initData)return;
  mk.load=true;mk.err='';renderMarket();
  try{await lbPush(true);await mLoad()}catch(e){mk.err=merr(e)}
  mk.load=false;if(!$('#tab-market').hidden)renderMarket();
}
async function mLoad(){
  const [l,m]=await Promise.all([lbReq(`/market?sort=${mk.sort}&q=${encodeURIComponent(mk.q)}`),lbReq('/market/my')]);mk.lots=l.lots;mk.my=m;
}
async function mAct(path,body,fn){
  if(mk.busy)return false;mk.busy=true;
  try{const r=await lbReq(path,body||{});fn&&fn(r);try{await mLoad()}catch(e){}mk.busy=false;return r}
  catch(e){mk.busy=false;toast(merr(e));try{await mLoad()}catch(x){}renderMarket();return false}
}
function mLot(l){
  const n=nickVal(l.name),d=Math.round((l.price/n.v-1)*100),deal=d<=-10?`<em class="mdeal good">−${-d}% от оценки</em>`:d>=30?`<em class="mdeal hot">+${d}% к оценке</em>`:'';
  return `<div class="mlot" style="--tc:${T[n.t].c}"><div class="mi"><b>@${escH(l.name)}</b><small><span class="mtier">${T[n.t].n}</span> · ${escH(l.seller)}</small><small>Оценка ${fmt(n.v)} 🪙 ${deal}</small></div>
  <div class="mpr"><b>${fmt(l.price)} 🪙</b>${l.mine?'<span class="cchip">Твой</span>':`<button class="btn main sm" data-buy="${l.id}" data-pr="${l.price}"${S.coins<l.price?' disabled':''}>${S.coins<l.price?'Не хватает':'Купить'}</button>`}</div></div>`;
}
function marketSheet(){
  if(!mk.sheet)return '';
  const its=[...S.items].sort((a,b)=>val(b.t,b.p,b.n)-val(a.t,a.p,a.n)),sel=S.items.find(i=>i.id===mk.sel),v=sel?val(sel.t,sel.p,sel.n):0,pr=Math.round(+mk.price)||0,fee=(mk.my&&mk.my.fee)||.05;
  return `<div class="usheet" id="msheet"><div class="sbg" data-mclose="1"></div><div class="sbox"><div class="shead"><b>Выставить ник</b><button class="btn sm" data-mclose="1">✕</button></div>
  <div class="slist mpick">${its.length?its.map(x=>`<label class="item pick" style="--tc:${T[x.t].c}"><input type="radio" name="mpick" data-msel="${x.id}"${x.id===mk.sel?' checked':''}><div><b>@${escH(x.n)}</b><small>${T[x.t].n}</small></div><span>${fmt(val(x.t,x.p,x.n))} 🪙</span></label>`).join(''):'<p class="sum">В коллекции пусто.</p>'}</div>
  ${sel?`<label class="mlab">Цена, 🪙<input id="m-price" inputmode="numeric" value="${escH(mk.price)}" placeholder="${v}"></label>
  <div class="mchips">${[1,1.5,2,3].map(k=>`<button class="btn sm" data-mk="${k}">×${k}</button>`).join('')}</div>
  <small class="sum">Оценка: ${fmt(v)} 🪙${pr>=10?` · ты получишь ${fmt(Math.floor(pr*(1-fee)))} 🪙 (комиссия ${Math.round(fee*100)}%)`:''}</small>`:''}
  <button class="btn main" id="m-ok"${sel&&pr>=10?'':' disabled'}>Выставить на рынок</button></div></div>`;
}
function renderMarket(){
  const el=$('#tab-market');if(!el)return;
  let body;
  if(!API)body='<div class="pcard lbmsg"><b>Рынок пока не подключён</b><small>Нужен сервер из папки rating-worker (см. README).</small></div>';
  else if(!tg||!tg.initData)body='<div class="pcard lbmsg"><b>Рынок доступен в Telegram</b><small>Открой игру через бота.</small></div>';
  else if(mk.load&&!mk.lots)body='<div class="pcard lbmsg"><small>Загружаю…</small></div>';
  else if(mk.err&&!mk.lots)body=`<div class="pcard lbmsg"><b>${escH(mk.err)}</b><button class="btn main" id="m-retry">Повторить</button></div>`;
  else if(mk.tab==='hist')body=!mk.hist?'<div class="pcard lbmsg"><small>Загружаю…</small></div>':(mk.hist.length?mk.hist.map(h=>{const n=nickVal(h.name),sold=h.kind==='sold';return `<div class="mlot hrow2" style="--tc:${T[n.t].c}"><div class="mi"><b>${sold?'💰 Продано':'🛒 Куплено'} · @${escH(h.name)}</b><small>${T[n.t].n} · ${sold?'покупатель':'продавец'}: ${escH(h.who)}</small><small>${fmtDate(h.ts)}</small></div><div class="mpr"><b class="${sold?'hplus':'hminus'}">${sold?'+':'−'}${fmt(sold?h.get:h.price)} 🪙</b>${sold?`<small>цена ${fmt(h.price)}</small>`:''}</div></div>`}).join(''):'<div class="pcard lbmsg"><small>Сделок пока нет.</small></div>')
  else if(mk.tab==='buy')body=`<input class="csearch" id="m-q" type="search" placeholder="Поиск ника" value="${escH(mk.q)}" autocomplete="off">
    <div class="seg" style="margin:0 0 12px">${[['new','Новые'],['cheap','Дешёвые'],['exp','Дорогие']].map(([k,l])=>`<button data-sort="${k}" aria-pressed="${mk.sort===k}">${l}</button>`).join('')}</div>`+
    ((mk.lots||[]).length?mk.lots.map(mLot).join(''):'<div class="pcard lbmsg"><small>Лотов нет. Выстави свой ник во вкладке «Мои лоты».</small></div>');
  else{
    const m=mk.my||{active:[],sold:[],fee:.05,max:10},tot=m.sold.reduce((s,x)=>s+x.get,0);
    body=`<button class="btn main cwide" id="m-new">＋ Выставить ник</button>`+
    (m.sold.length?`<div class="pcard msold"><div><b>Продано: ${m.sold.length}</b><small>${m.sold.map(x=>'@'+escH(x.name)).slice(0,3).join(', ')}${m.sold.length>3?'…':''}</small></div><button class="btn main" id="m-claim">Забрать +${fmt(tot)} 🪙</button></div>`:'')+
    `<h3 class="ch3">Мои лоты · ${m.active.length} из ${m.max}</h3>`+
    (m.active.length?m.active.map(x=>{const n=nickVal(x.name);return `<div class="mlot" style="--tc:${T[n.t].c}"><div class="mi"><b>@${escH(x.name)}</b><small>${T[n.t].n}</small></div><div class="mpr"><b>${fmt(x.price)} 🪙</b><button class="btn sm" data-cancel="${x.id}">Снять</button></div></div>`}).join(''):'<div class="pcard lbmsg"><small>Ты пока ничего не выставил.</small></div>')+
    `<small class="sum">Комиссия рынка ${Math.round(m.fee*100)}% берётся с продавца.</small>`;
  }
  const keep=document.activeElement&&document.activeElement.id==='m-q';
  setHtml(el,`<div class="ahead"><button class="btn sm" id="m-back">‹ Коллекция</button><h2>Рынок</h2></div>
  <div class="seg three"><button data-mt="buy" aria-pressed="${mk.tab==='buy'}">Купить</button><button data-mt="my" aria-pressed="${mk.tab==='my'}">Мои лоты${mk.my&&mk.my.sold.length?' •':''}</button><button data-mt="hist" aria-pressed="${mk.tab==='hist'}">История</button></div>${body}${marketSheet()}`);
  if(keep){const i=$('#m-q');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}
}
let mkQ=0;
$('#tab-market').oninput=e=>{
  if(e.target.id==='m-q'){mk.q=e.target.value;clearTimeout(mkQ);mkQ=setTimeout(async()=>{try{await mLoad()}catch(x){}renderMarket()},350)}
  if(e.target.id==='m-price'){mk.price=e.target.value.replace(/\D/g,'');const s=$('#msheet .sum'),ok=$('#m-ok'),fee=(mk.my&&mk.my.fee)||.05,pr=+mk.price||0;if(ok)ok.disabled=!(mk.sel&&pr>=10);
    const sel=S.items.find(i=>i.id===mk.sel);if(s&&sel)s.textContent=`Оценка: ${fmt(val(sel.t,sel.p,sel.n))} 🪙${pr>=10?` · ты получишь ${fmt(Math.floor(pr*(1-fee)))} 🪙 (комиссия ${Math.round(fee*100)}%)`:''}`}
};
$('#tab-market').onchange=e=>{const s=e.target.closest('[data-msel]');if(!s)return;mk.sel=s.dataset.msel;const it=S.items.find(i=>i.id===mk.sel);mk.price=it?String(val(it.t,it.p,it.n)):'';renderMarket()};
$('#tab-market').onclick=async e=>{
  const t=e.target;
  if(t.closest('#m-back'))return tab('col');
  if(t.closest('#m-retry'))return openMarket();
  const mt=t.closest('[data-mt]');if(mt){mk.tab=mt.dataset.mt;renderMarket();if(mk.tab==='hist'){mk.hist=null;renderMarket();lbReq('/market/history').then(r=>{mk.hist=r.items||[];if(mk.tab==='hist')renderMarket()}).catch(e=>{mk.hist=[];toast(merr(e));if(mk.tab==='hist')renderMarket()})}return}
  const so=t.closest('[data-sort]');if(so){mk.sort=so.dataset.sort;try{await mLoad()}catch(x){}return renderMarket()}
  if(t.closest('[data-mclose]')){mk.sheet=false;return renderMarket()}
  if(t.closest('#m-new')){mk.sheet=true;mk.sel='';mk.price='';return renderMarket()}
  const kk=t.closest('[data-mk]');if(kk){const it=S.items.find(i=>i.id===mk.sel);if(it){mk.price=String(Math.round(val(it.t,it.p,it.n)*+kk.dataset.mk));renderMarket()}return}
  if(t.closest('#m-ok')){
    const it=S.items.find(i=>i.id===mk.sel),pr=+mk.price;if(!it||!(pr>=10))return;
    const r=await mAct('/market/list',{name:it.n,price:pr},()=>{S.items=S.items.filter(i=>i.id!==it.id);save();render()});
    if(r){mk.sheet=false;mk.tab='my';toast('Ник выставлен на рынок')}return renderMarket();
  }
  const by=t.closest('[data-buy]');
  if(by){
    const price=+by.dataset.pr;if(S.coins<price)return toast('Не хватает монет');
    if(S.items.length>=MAX)return toast('Коллекция полна: освободи место');
    const r=await mAct('/market/buy',{id:+by.dataset.buy,max:price},r=>{const n=nickVal(r.name);S.coins-=r.price;addItem(r.name,n.t,n.p);S.items=S.items;save();render();sfx('coins');toast(`Куплено: @${r.name}`)});
    return renderMarket();
  }
  const cn=t.closest('[data-cancel]');
  if(cn){
    if(S.items.length>=MAX)return toast('Коллекция полна: освободи место, чтобы вернуть ник');
    await mAct('/market/cancel',{id:+cn.dataset.cancel},r=>{const n=nickVal(r.name);addItem(r.name,n.t,n.p);save();render();toast(`Ник @${r.name} вернулся в коллекцию`)});
    return renderMarket();
  }
  if(t.closest('#m-claim')){
    await mAct('/market/claim',{},r=>{if(r.sum>0){S.coins+=r.sum;save();render();sfx('coins');toast(`Выручка: +${fmt(r.sum)} 🪙`)}});
    return renderMarket();
  }
};

// ---------- Музей ----------
// Экспонаты хранит сервер. Имя ника может висеть в музее только у одного игрока, поставленный ник навсегда уходит из коллекции.
// Цену экспоната каждый клиент считает сам по названию и по ней сортирует список.
Object.assign(ME,{taken:'Такой ник уже стоит в музее',many:'Не больше 3 экспонатов у одного игрока',flag:'Данные не прошли проверку: функции игроков закрыты',poor:'Твой капитал меньше цены лота'});Object.assign(CE,{flag:'Данные не прошли проверку: функции игроков закрыты'});
const mu={items:null,total:0,mine:0,max:3,load:false,err:'',sheet:false,sel:'',armed:false,busy:false};
const PLATE=[['#c9d0f5','#8791c9'],['#7ff0da','#1fb59b'],['#c9b6ff','#7f5df0'],['#ffa8cf','#e0407f'],['#ffe591','#d79a1c'],['#ff9a8e','#d9372a'],['#ffffff','#bccaff']];
const plate=(name,t)=>`<div class="plate" style="--g1:${PLATE[t][0]};--g2:${PLATE[t][1]}"><i>${T[t].s}</i><b>${escH(name)}</b></div>`;
const fmtDate=ts=>new Date(ts).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
async function openMuseum(){
  renderMuseum();if(!API||!tg||!tg.initData)return;
  mu.load=true;mu.err='';renderMuseum();
  try{await lbPush(true);await muLoad()}catch(e){mu.err=merr(e)}
  mu.load=false;if(!$('#tab-museum').hidden)renderMuseum();
}
async function muLoad(){const r=await lbReq('/museum');mu.items=r.items;mu.total=r.total;mu.mine=r.mine;mu.max=r.max}
function renderMuseum(){
  const el=$('#tab-museum');if(!el)return;
  let body;
  if(!API)body='<div class="pcard lbmsg"><b>Музей пока не подключён</b><small>Нужен сервер из папки rating-worker (см. README).</small></div>';
  else if(!tg||!tg.initData)body='<div class="pcard lbmsg"><b>Музей доступен в Telegram</b><small>Открой игру через бота.</small></div>';
  else if(mu.load&&!mu.items)body='<div class="pcard lbmsg"><small>Загружаю…</small></div>';
  else if(mu.err&&!mu.items)body=`<div class="pcard lbmsg"><b>${escH(mu.err)}</b><button class="btn main" id="mu-retry">Повторить</button></div>`;
  else{
    const rows=(mu.items||[]).map(x=>({...x,n:nickVal(x.name)})).sort((p,q)=>q.n.v-p.n.v||p.ts-q.ts);
    body=`<div class="pcard mus"><div><b>В музее ${fmt(mu.total)} ${pl(mu.total)}</b><small>Твоих экспонатов: ${mu.mine} из ${mu.max}</small></div><button class="btn main" id="mu-new"${mu.mine>=mu.max?' disabled':''}>＋ Поставить</button></div>`+
    (rows.length?rows.map((x,i)=>`<div class="murow${x.mine?' me':''}"><em>${i+1}</em>${plate(x.name,x.n.t)}<div class="mui"><b>${fmt(x.n.v)} 🪙</b><span>${escH(x.owner)}</span><small>${fmtDate(x.ts)}</small></div></div>`).join(''):'<div class="pcard lbmsg"><small>В музее пока пусто. Поставь первый ник!</small></div>');
  }
  const its=[...S.items].sort((a,b)=>val(b.t,b.p,b.n)-val(a.t,a.p,a.n)),sel=S.items.find(i=>i.id===mu.sel);
  const sheet=mu.sheet?`<div class="usheet" id="musheet"><div class="sbg" data-muclose="1"></div><div class="sbox"><div class="shead"><b>Поставить в музей</b><button class="btn sm" data-muclose="1">✕</button></div>
    <div class="slist mpick">${its.length?its.map(x=>`<label class="item pick" style="--tc:${T[x.t].c}"><input type="radio" name="mupick" data-musel="${x.id}"${x.id===mu.sel?' checked':''}><div><b>@${escH(x.n)}</b><small>${T[x.t].n}</small></div><span>${fmt(val(x.t,x.p,x.n))} 🪙</span></label>`).join(''):'<p class="sum">В коллекции пусто.</p>'}</div>
    ${sel?`<div class="muprev">${plate(sel.n,sel.t)}<span>${fmt(val(sel.t,sel.p,sel.n))} 🪙</span></div>`:''}
    <small class="sum">Ник навсегда уйдёт из коллекции и станет экспонатом. Вернуть или продать его будет нельзя.</small>
    <button class="btn main${mu.armed?' danger':''}" id="mu-ok"${sel?'':' disabled'}>${mu.armed?'Точно поставить навсегда?':'Поставить в музей'}</button></div></div>`:'';
  setHtml(el,`<div class="ahead"><button class="btn sm" id="mu-back">‹ Коллекция</button><h2>Музей</h2></div>${(()=>{try{return workPlate()}catch(e){return ''}})()}${body}${sheet}`);
}
$('#tab-museum').onchange=e=>{const s=e.target.closest('[data-musel]');if(!s)return;mu.sel=s.dataset.musel;mu.armed=false;renderMuseum()};
$('#tab-museum').onclick=async e=>{
  const t=e.target;
  if(t.closest('#mu-back'))return tab('col');
  if(t.closest('#mu-retry'))return openMuseum();
  if(t.closest('[data-muclose]')){mu.sheet=false;mu.armed=false;return renderMuseum()}
  if(t.closest('#mu-new')){mu.sheet=true;mu.sel='';mu.armed=false;return renderMuseum()}
  if(t.closest('#mu-ok')){
    const it=S.items.find(i=>i.id===mu.sel);if(!it||mu.busy)return;
    if(!mu.armed){mu.armed=true;renderMuseum();setTimeout(()=>{if(mu.armed){mu.armed=false;renderMuseum()}},4000);return}
    mu.busy=true;mu.armed=false;
    try{await lbPush(true);await lbReq('/museum/add',{name:it.n,v:val(it.t,it.p,it.n)});
      S.items=S.items.filter(i=>i.id!==it.id);save();render();sfx('level');toast(`🏛️ @${it.n} теперь в музее`);mu.sheet=false;try{await muLoad()}catch(x){}}
    catch(x){toast(merr(x))}
    mu.busy=false;return renderMuseum();
  }
};

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
  try{const r=await lbReq('/refs');const n=Math.max(0,Math.min(r.n|0,REF_MAX-S.refc));if(n!==lb.refn){lb.refn=n;if(!$('#tab-prof').hidden)renderProf();try{if(!$('#tab-museum').hidden)renderMuseum()}catch(x){}}}catch(e){}
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
  try{h+=`<div class="bcases">${casesHtml()}</div>`}catch(e){}
  try{h+=promoCard()}catch(e){}
  try{h+=`<div class="bcases bmini"><div class="cshd"><b>Мини игры</b><small>2 из 4</small></div><div class="csgrid"><button class="cscard${S.coins<LOTP?' poor':''}" id="lot-open" style="--cc:#FFC933"><span class="csi">🎟️</span><b>Лотерея</b><small>Найди три одинаковых из девяти</small><span class="csp">${fmt(LOTP)} 🪙</span></button><button class="cscard${S.coins<GSC?' poor':''}" id="gs-open" style="--cc:#27D9BD"><span class="csi">🔎</span><b>Угадай юзернейм</b><small>Дороже, дешевле или второй? Успей за 12 секунд</small><span class="csp">${fmt(GSC)} 🪙</span></button>`+[1,2].map(()=>`<div class="cscard soon" style="--cc:#7A7F9A"><span class="csi">🔒</span><b>Скоро…</b><small>Новая мини игра</small><span class="csp">В разработке</span></div>`).join('')+`</div></div>`}catch(e){}
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
try{if(PAGE!=='main'&&tg&&tg.BackButton){tg.BackButton.show();tg.BackButton.onClick(()=>{location.href=PAGE==='clan'?'rating.html':(PAGE==='market'||PAGE==='museum')?'index.html#col':'index.html'})}}catch(e){}
refInit();
cloudLoad();
try{window.bootDone&&bootDone()}catch(e){}   // игра готова: убираем загрузочный экран
