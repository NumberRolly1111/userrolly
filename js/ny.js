// Новогодний декор: гирлянда сверху и падающий снег. Работает только при html.ny.
(function(){
  try{
    var h=document.documentElement;
    if(!h.classList.contains('ny'))return;
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(!document.getElementById('nygl')){
      var g=document.createElement('div');g.id='nygl';g.setAttribute('aria-hidden','true');
      var cols=['#E5484D','#FFC857','#3DDC84','#4DA3FF'],n=Math.max(12,Math.min(26,Math.round(window.innerWidth/26)));
      for(var i=0;i<n;i++){var b=document.createElement('i');b.style.setProperty('--c',cols[i%4]);b.style.setProperty('--d',((i*0.37)%2.4).toFixed(2)+'s');g.appendChild(b)}
      document.body.appendChild(g);
    }
    if(reduce||document.getElementById('nyfx'))return;
    var s=document.createElement('div');s.id='nyfx';s.setAttribute('aria-hidden','true');
    var F=['❄','❅','❆','✦'],html='';
    for(var j=0;j<26;j++){
      var left=(j*3.9+Math.random()*3).toFixed(1),size=10+Math.floor(Math.random()*14),dur=9+Math.random()*12,del=-(Math.random()*dur),dx=(Math.random()*60-30).toFixed(0);
      html+='<span style="left:'+left+'%;font-size:'+size+'px;animation-duration:'+dur.toFixed(1)+'s;animation-delay:'+del.toFixed(1)+'s;--dx:'+dx+'px;opacity:'+(0.35+Math.random()*0.55).toFixed(2)+'">'+F[j%F.length]+'</span>';
    }
    s.innerHTML=html;document.body.appendChild(s);
  }catch(e){}
})();
