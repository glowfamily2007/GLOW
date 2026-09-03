const STORE="worship-setlist-full-v1";
const seed={songs:[
{id:"joy",title:"The Joy",artist:"The Belonging Co",key:"Db",tempo:"",language:"",tags:["imported"],sections:[
{label:"INTRO",lines:[["Db  Ebm  Gb",""]]},
{label:"VERSE",lines:[["Db        Gb/Db        Db","This is the day     You made"],["Gb/Db    Bbm","So I'll      rejoice and be glad"],["Gb",""]]},
{label:"CHORUS",lines:[["Gb        Db","There is joy in the house of the Lord"],["Bbm       Gb","I will sing, I will dance"],["Db","And give You praise"]]}
]},
{id:"rum",title:"Rumaragasang pagpapala",artist:"Artist not set",key:"D",tempo:"",language:"Tagalog",tags:["praise"],sections:[{label:"VERSE",lines:[["D","Ikaw ang aking lakas"],["G          D","Sa Iyo ako'y sasamba"]]}]},
{id:"good",title:"Goodness of God",artist:"Worship Library",key:"G",tempo:"72",language:"English",tags:["worship"],sections:[{label:"VERSE",lines:[["G","Add your licensed lyrics here"],["C         G","Add your chord progression here"]]}]}
],setlists:[]};
let db=JSON.parse(localStorage.getItem(STORE)||"null")||seed;
let currentId=db.songs[0]?.id, zoom=1, mode="chords", presentIndex=0, presentSet=null;
const $=x=>document.getElementById(x);
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function save(){localStorage.setItem(STORE,JSON.stringify(db))}
function current(){return db.songs.find(x=>x.id===currentId)||db.songs[0]}
function populateFilters(){
 const keys=[...new Set(db.songs.map(s=>s.key).filter(Boolean))].sort(),tags=[...new Set(db.songs.flatMap(s=>s.tags||[]))].sort();
 $("keyFilter").innerHTML='<option value="">All keys</option>'+keys.map(x=>`<option>${esc(x)}</option>`).join("");
 $("tagFilter").innerHTML='<option value="">All tags</option>'+tags.map(x=>`<option>${esc(x)}</option>`).join("");
}
function renderList(){
 const q=$("search").value.toLowerCase(),lang=document.querySelector(".lang.active").dataset.lang,k=$("keyFilter").value,t=$("tagFilter").value;
 let list=db.songs.filter(s=>(!q||(s.title+" "+s.artist+" "+JSON.stringify(s.sections)).toLowerCase().includes(q))&&(!lang||lang==="all"||s.language===lang)&&(!k||s.key===k)&&(!t||(s.tags||[]).includes(t)));
 $("count").textContent=db.songs.length;
 $("songList").innerHTML=list.map(s=>`<div class="song ${s.id===currentId?"active":""}" onclick="selectSong('${s.id}')"><span class="right">${esc(s.key||"—")}</span><b>${esc(s.title)}</b><small>${esc(s.artist||"Artist not set")}　 ${s.tempo?esc(s.tempo)+" BPM":"No tempo"}</small></div>`).join("")||'<div style="padding:15px;color:#777">No songs found.</div>';
}
function renderChart(){
 const s=current();if(!s)return;
 $("artistLabel").textContent=(s.artist||"WORSHIP SONG").toUpperCase();$("title").textContent=s.title;
 $("meta").textContent=`Time not set　 ${s.tempo?`Tempo ${s.tempo}`:"Tempo not set"}　 ${s.language?`Language ${s.language}`:"Language not set"}`;
 $("tag").textContent=(s.tags||[])[0]||"chart";$("key").textContent=s.key||"—";$("chart").style.fontSize=(19*zoom)+"px";
 $("chart").innerHTML=(s.sections||[]).map(sec=>`<div class="section"><div class="section-label">${esc(sec.label)}</div><div>${sec.lines.map(r=>`<div class="line"><div class="chord">${esc(mode==="numbers"?numbers(r[0],s.key):r[0])}</div><div class="lyric">${esc(r[1]||"")}</div></div>`).join("")}</div></div>`).join("");
 renderList();
}
function numbers(str){const m={C:1,"C#":1,Db:1,D:2,"D#":3,Eb:3,E:3,F:4,"F#":4,Gb:4,G:5,"G#":6,Ab:6,A:6,"A#":7,Bb:7,B:7};return String(str).replace(/[A-G](?:#|b)?/g,x=>m[x]||x)}
function selectSong(id){currentId=id;renderChart()}
function openEditor(){
 const s=current();$("dialogTitle").textContent="Edit chart";$("fTitle").value=s.title;$("fArtist").value=s.artist||"";$("fKey").value=s.key||"";$("fTempo").value=s.tempo||"";$("fLang").value=s.language||"English";$("fTags").value=(s.tags||[]).join(", ");
 $("fChart").value=(s.sections||[]).map(sec=>`[${sec.label}]\n`+sec.lines.map(r=>`${r[0]} | ${r[1]||""}`).join("\n")).join("\n\n");$("songDialog").showModal()
}
function parseChart(txt){let out=[],sec=null;txt.split("\n").forEach(line=>{let h=line.match(/^\[(.+)\]$/);if(h){sec={label:h[1],lines:[]};out.push(sec)}else if(line.trim()&&sec){let p=line.split("|");sec.lines.push([(p.shift()||"").trim(),p.join("|").trim()])}});return out}
$("songDialog").addEventListener("close",()=>{if($("songDialog").returnValue!=="ok")return;let s=current();s.title=$("fTitle").value.trim()||s.title;s.artist=$("fArtist").value.trim();s.key=$("fKey").value.trim();s.tempo=$("fTempo").value;s.language=$("fLang").value;s.tags=$("fTags").value.split(",").map(x=>x.trim()).filter(Boolean);s.sections=parseChart($("fChart").value);save();populateFilters();renderChart()});
function newChart(){let id="song"+Date.now();db.songs.push({id,title:"New Worship Song",artist:"",key:"C",tempo:"",language:"English",tags:["new"],sections:[{label:"VERSE",lines:[["C","Add your licensed lyrics here"]]}]});currentId=id;save();populateFilters();renderChart();openEditor()}
$("newChart").onclick=newChart;$("edit").onclick=openEditor;
$("search").oninput=renderList;$("keyFilter").onchange=renderList;$("tagFilter").onchange=renderList;
document.querySelectorAll(".lang").forEach(b=>b.onclick=()=>{document.querySelectorAll(".lang").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderList()});
const chrom=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
function transpose(d){let s=current(),i=chrom.indexOf(s.key);if(i<0)i=0;s.key=chrom[(i+d+12)%12];save();renderChart()}
$("keyMinus").onclick=()=>transpose(-1);$("keyPlus").onclick=()=>transpose(1);
$("zoomMinus").onclick=()=>{zoom=Math.max(.7,zoom-.1);$("zoomText").textContent=Math.round(zoom*100)+"%";renderChart()};$("zoomPlus").onclick=()=>{zoom=Math.min(1.7,zoom+.1);$("zoomText").textContent=Math.round(zoom*100)+"%";renderChart()};
document.querySelectorAll(".mode button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".mode button").forEach(x=>x.classList.remove("chosen"));b.classList.add("chosen");mode=b.dataset.mode;renderChart()});
$("print").onclick=()=>window.print();
$("share").onclick=async()=>{let u=location.href.split("#")[0]+"#song="+encodeURIComponent(currentId);try{await navigator.clipboard.writeText(u);alert("Chart link copied.")}catch{prompt("Copy this chart link:",u)}};
let timer=null,scrollSpeed=1;$("auto").onclick=()=>{if(timer){clearInterval(timer);timer=null;$("auto").textContent="▶"}else{timer=setInterval(()=>scrollBy(0,scrollSpeed),50);$("auto").textContent="❚❚"}};
$("speedMinus").onclick=()=>{scrollSpeed=Math.max(.5,scrollSpeed-.5);$("speed").textContent=scrollSpeed+"×"};$("speedPlus").onclick=()=>{scrollSpeed=Math.min(5,scrollSpeed+.5);$("speed").textContent=scrollSpeed+"×"};$("top").onclick=()=>scrollTo({top:0,behavior:"smooth"});
function showPage(p){$("libraryPage").classList.toggle("hidden",p!=="library");$("setlistsPage").classList.toggle("hidden",p!=="setlists");document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===p));if(p==="setlists")renderSetlists()}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
function newSet(){ $("setName").value="";$("setDate").value=new Date().toISOString().slice(0,10);$("setNotes").value="";$("setDialog").showModal()}
$("newSetlist").onclick=newSet;
$("setDialog").addEventListener("close",()=>{if($("setDialog").returnValue!=="ok")return;db.setlists.push({id:"set"+Date.now(),name:$("setName").value.trim(),date:$("setDate").value,notes:$("setNotes").value,songIds:[currentId]});save();renderSetlists()});
function renderSetlists(){let g=$("setlistGrid");g.innerHTML=db.setlists.map(s=>`<div class="set-card"><small>${esc(s.date||"NO DATE")}</small><h3>${esc(s.name)}</h3><p>${esc(s.notes||"Worship service")} · ${s.songIds.length} songs</p><div class="songs-in">${s.songIds.map(id=>db.songs.find(x=>x.id===id)?.title).filter(Boolean).map(esc).join("<br>")||"Empty setlist"}</div><button onclick="presentSetlist('${s.id}')">▶ Present</button></div>`).join("")||'<div class="set-card"><h3>No setlists yet</h3><p>Create a setlist for your next service.</p></div>'}
function presentSetlist(id){let s=db.setlists.find(x=>x.id===id);if(!s?.songIds.length)return alert("This setlist is empty.");presentSet=s;presentIndex=0;updatePresent();$("present").classList.remove("hidden")}
function updatePresent(){let s=presentSet,x=db.songs.find(y=>y.id===s.songIds[presentIndex]);$("presentMeta").textContent=`${s.name} · ${x.key||"—"} · ${x.tempo||"—"} BPM`;$("presentTitle").textContent=x.title;$("presentText").textContent=(x.sections||[]).map(sec=>`[ ${sec.label} ]\n`+sec.lines.map(r=>`${r[0]}\n${r[1]||""}`).join("\n\n")).join("\n\n");$("presentCount").textContent=`${presentIndex+1} / ${s.songIds.length}`}
$("closePresent").onclick=()=>$("present").classList.add("hidden");$("prev").onclick=()=>{if(presentIndex>0){presentIndex--;updatePresent()}};$("next").onclick=()=>{if(presentIndex<presentSet.songIds.length-1){presentIndex++;updatePresent()}};
$("backup").onclick=()=>{let b=new Blob([JSON.stringify(db,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="worship-setlist-backup.json";a.click();URL.revokeObjectURL(a.href)};
$("importFile").onclick=()=>$("file").click();$("file").onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let x=JSON.parse(r.result);if(!x.songs||!x.setlists)throw 0;db=x;currentId=db.songs[0]?.id;save();populateFilters();renderChart();renderSetlists();alert("Backup imported.")}catch{alert("Invalid backup file.")}};r.readAsText(f)};
$("about").onclick=e=>{e.preventDefault();alert("Worship Setlist is an original local-first worship planning app. Add only song material you are licensed or authorized to use.")};
document.addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="TEXTAREA"){e.preventDefault();$("search").focus()}if(e.key==="Escape")$("present").classList.add("hidden")});
populateFilters();renderChart();renderSetlists();
