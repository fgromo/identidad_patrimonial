(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hover=matchMedia('(hover:hover)').matches;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const q=new URLSearchParams(location.search);
const pad2=n=>String(n).padStart(2,"0");
const fmt=t=>{t=Math.floor(t||0);return Math.floor(t/60)+":"+String(t%60).padStart(2,"0")};
document.documentElement.classList.add("js");
const cv=n=>getComputedStyle(document.body).getPropertyValue(n).trim();

fetch("data/projects.json").then(r=>r.json()).then(init);

function init(D){
  const S=D.site, byId=Object.fromEntries(D.campuses.map(c=>[c.id,c]));
  const projs=id=>D.projects.filter(p=>p.campus===id);
  const img0=p=>p.images&&p.images[0]?(p.images[0].src||p.images[0]):"";
  const page=document.body.dataset.page;
  const lines=s=>s.split(" ").map(w=>`<span class="ln">${esc(w)}</span>`).join("<br>");

  /* shell */
  $(".top").innerHTML=`<a class="logo" href="index.html" aria-label="Inicio">Memoria<br>viva</a>
    <button class="menu-btn" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 46 16" width="46" height="16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" aria-hidden="true"><path d="M1 3c4-2 6 2 10 0s6-2 9 1 7-2 13-1 7 1 12-1"/><path d="M1 8c3 2 7-2 11 0s5 2 9-1 8 2 13 1 6-1 11 0"/><path d="M1 13c5-2 6 2 10 1s6-3 10 0 8 0 12-2 6 1 12 1"/></svg><span>Menú</span></button>`;
  const menu=document.createElement("nav");menu.className="nav";menu.id="menu";menu.setAttribute("aria-label","Principal");
  menu.innerHTML=`<a href="index.html"><b>00</b>Inicio</a>`+D.campuses.map((c,i)=>`<a href="campus.html?c=${c.id}"><b>${pad2(i+1)}</b>${esc(c.name)}</a>`).join("");
  document.body.appendChild(menu);
  const mb=$(".menu-btn"), lab=$("span",mb), setMenu=o=>{menu.classList.toggle("open",o);mb.setAttribute("aria-expanded",o);lab.textContent=o?"Cerrar":"Menú"};
  mb.onclick=()=>setMenu(!menu.classList.contains("open"));
  addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});
  $$("a",menu).forEach(a=>a.addEventListener("click",()=>setMenu(false)));

  $(".foot").innerHTML=`<div class="fcols"><div><h5>Campus</h5><ul>${D.campuses.map(c=>`<li><a href="campus.html?c=${c.id}">${esc(c.name)}</a></li>`).join("")}</ul></div>
    <div><h5>Unidad de formación</h5><ul><li>${esc(S.unit)}</li></ul></div></div>
    <div class="wordmark" data-fit>${lines(S.name)}</div>
    <img class="ehe" src="assets/logo-ehe-blanco.png" alt="Tecnológico de Monterrey, Escuela de Humanidades y Educación"><p class="fine">Los textos, imágenes y audios pertenecen a sus autores.</p>`;

  /* cursor */
  if(hover&&!reduce){
    const d=document.createElement("div");d.className="dot";document.body.appendChild(d);document.body.classList.add("has-dot");
    let x=-50,y=-50,tx=-50,ty=-50;
    addEventListener("mousemove",e=>{tx=e.clientX;ty=e.clientY});
    (function f(){x+=(tx-x)*.25;y+=(ty-y)*.25;d.style.left=x+"px";d.style.top=y+"px";requestAnimationFrame(f)})();
    document.addEventListener("mouseover",e=>{d.classList.toggle("big",!!e.target.closest("a,button,.wv"))});
  }

  /* hover list with floating image */
  function hoverList(box,items){
    const peek=$(".peek",box); if(!peek||!hover)return;
    let tx=0,ty=0,x=0,y=0,first=true,run=false;
    const loop=()=>{x+=(tx-x)*.12;y+=(ty-y)*.12;peek.style.left=x+"px";peek.style.top=y+"px";if(run)requestAnimationFrame(loop)};
    box.addEventListener("mousemove",e=>{const r=box.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;if(first){x=tx;y=ty;first=false}});
    box.addEventListener("mouseleave",()=>{peek.classList.remove("show");run=false;first=true});
    $$("[data-i]",box).forEach(el=>el.addEventListener("mouseenter",()=>{
      const it=items[+el.dataset.i];peek.style.background=it.tone;
      peek.innerHTML=(it.img?`<img src="${esc(it.img)}" alt="">`:"")+`<span>${esc(it.label)}</span>`;
      peek.classList.add("show");if(!run){run=true;loop()}}));
  }

  /* project rows */
  function rows(list){
    return list.map((p,i)=>`<a class="pr" data-i="${i}" href="proyecto.html?c=${esc(p.campus)}&p=${esc(p.slug)}"><b>${pad2(i+1)}</b><h3>${esc(p.title)}</h3><small>${esc(byId[p.campus].name)}</small><small>${esc(p.author)}</small></a>`).join("");
  }
  const peekP=list=>list.map(p=>({tone:byId[p.campus].tone,img:img0(p),label:p.kind||byId[p.campus].name}));

  if(page==="home"){
    document.title=S.name;
    $("#wm").innerHTML=lines(S.name);
    $("#tag").textContent=S.tagline;
    wave($("#wave"));
    const man=$("#manifesto");
    man.innerHTML=S.manifesto.split(" ").map(w=>`<span>${esc(w)}</span>`).join(" ");
    const words=$$("span",man);
    $("#cl").innerHTML=D.campuses.map((c,i)=>`<a class="cl" data-i="${i}" href="campus.html?c=${c.id}">${esc(c.name)}<sup>${pad2(projs(c.id).length)}/${pad2(c.expected)}</sup></a>`).join("");
    hoverList($("#campus"),D.campuses.map(c=>{const L=projs(c.id);const w=L.find(img0);return{tone:c.tone,img:w?img0(w):"",label:`${c.city} · ${L.length} de ${c.expected} proyectos`}}));
    $("#pl").innerHTML=D.projects.length?rows(D.projects):'<p class="empty">Los primeros proyectos se publicarán pronto.</p>';
    hoverList($("#proyectos"),peekP(D.projects));
    const phrase="Patrimonio inmaterial — Texto · Imagen · Sonido — ";
    $("#m1").textContent=phrase.repeat(3);$("#m2").textContent=("Memoria · Oficios · Fiestas · Voces — ").repeat(4);
    const sec=$(".marq"),m1=$("#m1"),m2=$("#m2");
    const onS=()=>{
      const r=sec.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height)));
      m1.style.transform=`translateX(${-p*40}%)`;m2.style.transform=`translateX(${p*40-40}%)`;
      const mr=man.getBoundingClientRect(),mp=Math.min(1,Math.max(0,(innerHeight*.8-mr.top)/(mr.height*.85)));
      const n=Math.round(mp*words.length);words.forEach((w,i)=>w.classList.toggle("on",i<n));
    };
    addEventListener("scroll",onS,{passive:true});onS();
  }

  if(page==="campus"){
    const c=byId[q.get("c")]||D.campuses[0],L=projs(c.id);
    document.title=c.name+" · "+S.name;
    $("#crumb").innerHTML=`<a href="index.html">← Atrás</a><a href="index.html#campus">Campus</a><span>${esc(c.name)}</span>`;
    $("#wm").innerHTML=lines(c.name);
    $("#cintro").textContent=c.intro;
    const det=[["Reto",c.reto],["Socio formador",c.partner],["Presentación",c.event]].filter(x=>x[1]).map(x=>`<div><span class="eyebrow">${x[0]}</span><p>${esc(x[1])}</p></div>`);
    if(c.link)det.push(`<div><span class="eyebrow">${esc(c.link.label)}</span><p><a class="more" style="margin:0" href="${esc(c.link.url)}" target="_blank" rel="noopener">Ver sitio</a></p></div>`);
    $("#cdet").innerHTML=det.join("");
    $("#cinfo").innerHTML=`${esc(c.city)}<br>${L.length} de ${c.expected} proyectos publicados`;
    $("#pl").innerHTML=L.length?rows(L):'<p class="empty">Los proyectos de este campus se publicarán pronto.</p>';
    hoverList($(".plist"),peekP(L));
  }

  if(page==="project"){
    const c=byId[q.get("c")],L=projs(q.get("c")),i=L.findIndex(p=>p.slug===q.get("p")),p=L[i];
    if(!p){document.querySelector(".sheet").innerHTML='<div class="plist"><p class="empty">No encontramos este proyecto.</p><a class="more" href="index.html">Volver al inicio</a></div>';fit();return}
    document.title=p.title+" · "+S.name;
    $("#crumb").innerHTML=`<a href="campus.html?c=${c.id}">← Atrás</a><a href="index.html#campus">Campus</a><a href="campus.html?c=${c.id}">${esc(c.name)}</a><span>${esc(p.title)}</span>`;
    $("#pk").textContent=p.kind||"";$("#pt").textContent=p.title;
    $("#pm").innerHTML=`<div><span class="eyebrow">Autoría</span><p>${esc(p.author)}</p></div><div><span class="eyebrow">Campus</span><p>${esc(c.name)}</p></div><div><span class="eyebrow">Formato</span><p>${esc(p.kind||"")}</p></div>`;
    $("#ptext").innerHTML=(p.text||[]).map(t=>`<p>${esc(t)}</p>`).join("");
    const imgs=(p.images||[]).map(m=>{m=typeof m==="string"?{src:m}:m;return `<figure><img src="${esc(m.src)}" alt="${esc(m.alt||p.title)}" loading="lazy">${m.caption?`<figcaption class="eyebrow" style="margin-top:8px">${esc(m.caption)}</figcaption>`:""}</figure>`});
    $("#pgal").innerHTML=imgs.length?imgs.join(""):`<div class="ph" style="--tone:${c.tone}">Imagen · pendiente</div><div class="ph" style="--tone:${c.tone}">Imagen · pendiente</div>`;
    if(p.audio)player($("#pside"),p.audio);
    const nx=L[i+1];
    const nxt=$("#next");
    if(nx){nxt.href=`proyecto.html?c=${c.id}&p=${nx.slug}`;nxt.innerHTML=`<p class="eyebrow">Siguiente proyecto</p><h3>${esc(nx.title)} →</h3>`}
    else{nxt.href=`campus.html?c=${c.id}`;nxt.innerHTML=`<p class="eyebrow">Fin de la lista</p><h3>Volver a ${esc(c.name)} →</h3>`}
  }

  /* fit wordmarks to width + reveal */
  function fit(){
    $$("[data-fit]").forEach(el=>{
      el.style.fontSize="100px";
      const w=Math.max(...$$(".ln",el).map(l=>l.getBoundingClientRect().width));
      if(w)el.style.fontSize=(100*el.clientWidth/w*.995)+"px";
    });
  }
  (document.fonts?document.fonts.ready:Promise.resolve()).then(fit);addEventListener("resize",fit);fit();
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
  $$("[data-r]").forEach(el=>io.observe(el));
}

/* hero waveform ridges */
function wave(c){
  const x=c.getContext("2d");let w,h,mx=.5,my=.5,t=0;
  const rs=()=>{const d=Math.min(2,devicePixelRatio||1);w=c.clientWidth;h=c.clientHeight;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0)};
  rs();addEventListener("resize",rs);
  c.parentElement.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=(e.clientY-r.top)/r.height});
  const hexA=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};
  function f(){
    const INK=cv("--ink"),CREAM=cv("--cream");t+=.008;x.clearRect(0,0,w,h);const L=30;
    for(let i=0;i<L;i++){
      const y0=h*(.12+.84*i/(L-1)),pts=[];
      for(let px=0;px<=w;px+=6){
        const u=px/w,env=Math.exp(-Math.pow((u-.5)*2.4,2));
        const n=Math.sin(u*9+t*2+i*.35)*.5+Math.sin(u*23-t*3+i*.7)*.3+Math.sin(u*47+t*5+i)*.2;
        const m=Math.exp(-Math.pow((u-mx)*6,2))*Math.exp(-Math.pow((y0/h-my)*4,2));
        pts.push([px,y0-(env*h*.2+m*h*.28)*n*(.45+i/L*.7)]);
      }
      x.beginPath();pts.forEach((p,k)=>k?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));
      x.lineTo(w,h+4);x.lineTo(0,h+4);x.closePath();x.fillStyle=INK;x.fill();
      x.beginPath();pts.forEach((p,k)=>k?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));
      x.strokeStyle=hexA(CREAM,.25+.65*i/L);x.lineWidth=1.1;x.stroke();
    }
    if(!reduce)requestAnimationFrame(f);
  }
  f();
}

/* audio player with real waveform */
function player(host,src){
  const hexA=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};
  host.innerHTML=`<div class="player"><audio preload="metadata" src="${esc(src)}"></audio><canvas class="wv" aria-label="Forma de onda; haz clic para avanzar"></canvas><div class="pl-row"><button class="pl-btn" type="button" aria-label="Reproducir">▶</button><span class="pl-time">0:00 / 0:00</span></div></div><p class="pl-cap">Audio del proyecto</p>`;
  const a=$("audio",host),cv=$("canvas",host),btn=$("button",host),tm=$(".pl-time",host),ctx=cv.getContext("2d"),N=80;let peaks=null;
  const draw=()=>{const w=cv.width,h=cv.height,p=a.duration?a.currentTime/a.duration:0,bw=w/N;ctx.clearRect(0,0,w,h);
    for(let i=0;i<N;i++){const v=peaks?peaks[i]:.08,bh=Math.max(4,v*h*.92);ctx.fillStyle=i/N<p?cv("--cream"):hexA(cv("--cream"),.28);ctx.fillRect(i*bw+bw*.2,(h-bh)/2,bw*.6,bh)}
    tm.textContent=fmt(a.currentTime)+" / "+fmt(a.duration)};
  const size=()=>{const d=Math.min(2,devicePixelRatio||1);cv.width=cv.clientWidth*d;cv.height=cv.clientHeight*d;draw()};
  size();addEventListener("resize",size);
  let raf;const tick=()=>{draw();if(!a.paused)raf=requestAnimationFrame(tick)};
  btn.onclick=()=>a.paused?a.play():a.pause();
  a.onplay=()=>{btn.textContent="❚❚";btn.setAttribute("aria-label","Pausar");tick()};
  a.onpause=a.onended=()=>{btn.textContent="▶";btn.setAttribute("aria-label","Reproducir");cancelAnimationFrame(raf);draw()};
  a.onloadedmetadata=draw;
  cv.onclick=e=>{const r=cv.getBoundingClientRect();if(a.duration){a.currentTime=(e.clientX-r.left)/r.width*a.duration;draw()}};
  fetch(src).then(r=>r.arrayBuffer()).then(b=>new (window.AudioContext||window.webkitAudioContext)().decodeAudioData(b)).then(buf=>{
    const d=buf.getChannelData(0),s=Math.floor(d.length/N),step=Math.max(1,s>>6);let pk=[],mx=0;
    for(let i=0;i<N;i++){let m=0;for(let j=i*s;j<(i+1)*s;j+=step)m=Math.max(m,Math.abs(d[j]));pk.push(m);mx=Math.max(mx,m)}
    peaks=pk.map(v=>v/(mx||1));draw()}).catch(()=>{});
}
})();
