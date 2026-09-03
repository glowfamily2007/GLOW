const KEY="worship-setlist-v1";
const seed={songs:[
{id:"s1",title:"Goodness of God",artist:"Bethel Music",key:"G",bpm:72,lyrics:"I love You, Lord\nOh, Your mercy never fails me\nAll my days, I've been held in Your hands\nFrom the moment that I wake up\nUntil I lay my head\nI will sing of the goodness of God"},
{id:"s2",title:"Build My Life",artist:"Housefires",key:"C",bpm:68,lyrics:"Worthy of every song we could ever sing\nWorthy of all the praise we could ever bring\nWorthy of every breath we could ever breathe\nWe live for You"},
{id:"s3",title:"Way Maker",artist:"Sinach",key:"E",bpm:68,lyrics:"You are here, moving in our midst\nI worship You, I worship You\nYou are here, working in this place\nI worship You, I worship You"},
{id:"s4",title:"10,000 Reasons",artist:"Matt Redman",key:"G",bpm:73,lyrics:"Bless the Lord, O my soul\nO my soul\nWorship His holy name\nSing like never before\nO my soul\nI'll worship Your holy name"}
],setlists:[]};
let db=JSON.parse(localStorage.getItem(KEY)||"null")||seed;
let currentSet=null, presentIndex=0;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function fmtDate(d){if(!d)return "No date"; return new Date(d+"T00:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}
function renderSetlists(){
  $("setlistCount").textContent=`${db.setlists.length} setlist${db.setlists.length===1?"":"s"}`;
  const grid=$("setlistGrid"); grid.innerHTML="";
  if(!db.setlists.length){grid.innerHTML=`<div class="card"><h4>No setlists yet</h4><p>Create your first worship set to get started.</p><button onclick="openSetlistDialog()">Create Setlist</button></div>`;return}
  db.setlists.forEach(s=>{const el=document.createElement("div");el.className="card";el.innerHTML=`<span class="pill">${s.event||"WORSHIP"}</span><h4>${esc(s.name)}</h4><p>${fmtDate(s.date)} · ${s.songIds.length} song${s.songIds.length===1?"":"s"}</p><div class="card-foot"><span>${s.songIds.map(id=>db.songs.find(x=>x.id===id)?.key||"").filter(Boolean).join(" · ")||"Empty set"}</span><button onclick="openEditor('${s.id}')">Open →</button></div>`;grid.appendChild(el)})
}
function renderSongs(){
  $("songCount").textContent=`${db.songs.length} songs`;
  const q=$("songSearch").value.toLowerCase(); const list=db.songs.filter(s=>(s.title+" "+s.artist+" "+s.key).toLowerCase().includes(q));
  $("songTable").innerHTML=`<div class="song-row head"><div>Song</div><div>Artist</div><div>Key</div><div>BPM</div><div>Actions</div></div>`+
  list.map(s=>`<div class="song-row"><div><strong>${esc(s.title)}</strong></div><div>${esc(s.artist||"—")}</div><div><span class="mini-key">${esc(s.key||"—")}</span></div><div>${s.bpm||"—"}</div><div class="row-actions"><button onclick="editSong('${s.id}')">Edit</button><button onclick="deleteSong('${s.id}')">×</button></div></div>`).join("")||`<div style="padding:25px;color:#777">No songs found.</div>`;
}
function renderEditor(){
  const s=db.setlists.find(x=>x.id===currentSet); if(!s)return;
  $("editorTitle").textContent=s.name;$("editorMeta").textContent=`${fmtDate(s.date)} · ${s.event||"Worship Service"}`;
  $("songPicker").innerHTML=`<option value="">Add a song to this setlist…</option>`+db.songs.filter(x=>!s.songIds.includes(x.id)).map(x=>`<option value="${x.id}">${esc(x.title)} — ${esc(x.key||"")}</option>`).join("");
  $("setSongs").innerHTML=s.songIds.map((id,i)=>{const x=db.songs.find(a=>a.id===id);if(!x)return "";return `<div class="set-song" draggable="true" data-id="${x.id}"><div class="drag">☷</div><div><h4>${esc(x.title)}</h4><p>${esc(x.artist||"")} · Key ${esc(x.key||"—")} · ${x.bpm||"—"} BPM</p></div><div class="actions"><button onclick="moveSong(${i},-1)">↑</button><button onclick="moveSong(${i},1)">↓</button><button onclick="editSong('${x.id}')">Edit</button><button class="delete" onclick="removeFromSet('${x.id}')">×</button></div></div>`}).join("")||`<div class="card"><h4>This setlist is empty</h4><p>Add songs using the selector above.</p></div>`;
}
function showView(v){["setlistsView","songsView","editorView"].forEach(x=>$(x).classList.add("hidden"));$(v).classList.remove("hidden")}
function openSetlistDialog(){$("setlistName").value="";$("setlistDate").value=new Date().toISOString().slice(0,10);$("setlistEvent").value="Sunday Service";$("setlistDialog").showModal()}
$("setlistDialog").addEventListener("close",()=>{if($("setlistDialog").returnValue!=="ok")return;const s={id:uid(),name:$("setlistName").value.trim(),date:$("setlistDate").value,event:$("setlistEvent").value.trim(),songIds:[]};if(!s.name)return;db.setlists.unshift(s);save();renderSetlists();openEditor(s.id)});
function openEditor(id){currentSet=id;showView("editorView");$("pageTitle").textContent="Setlist";renderEditor()}
function addSongToSet(){const id=$("songPicker").value;if(!id)return;const s=db.setlists.find(x=>x.id===currentSet);s.songIds.push(id);save();renderEditor()}
function moveSong(i,d){const s=db.setlists.find(x=>x.id===currentSet);const j=i+d;if(j<0||j>=s.songIds.length)return;[s.songIds[i],s.songIds[j]]=[s.songIds[j],s.songIds[i]];save();renderEditor()}
function removeFromSet(id){const s=db.setlists.find(x=>x.id===currentSet);s.songIds=s.songIds.filter(x=>x!==id);save();renderEditor()}
function editSong(id){const s=db.songs.find(x=>x.id===id);$("songDialogTitle").textContent="Edit Song";$("songId").value=s.id;$("songTitle").value=s.title;$("songArtist").value=s.artist||"";$("songKey").value=s.key||"";$("songBpm").value=s.bpm||"";$("songLyrics").value=s.lyrics||"";$("songDialog").showModal()}
function addSong(){["songId","songTitle","songArtist","songKey","songBpm","songLyrics"].forEach(id=>$(id).value="");$("songDialogTitle").textContent="Add Song";$("songDialog").showModal()}
$("songDialog").addEventListener("close",()=>{if($("songDialog").returnValue!=="ok")return;const id=$("songId").value;const data={title:$("songTitle").value.trim(),artist:$("songArtist").value.trim(),key:$("songKey").value.trim(),bpm:Number($("songBpm").value)||"",lyrics:$("songLyrics").value};if(!data.title)return;if(id)Object.assign(db.songs.find(x=>x.id===id),data);else db.songs.push({id:uid(),...data});save();renderSongs();if(currentSet)renderEditor()});
function deleteSong(id){if(!confirm("Delete this song from the library?"))return;db.songs=db.songs.filter(x=>x.id!==id);db.setlists.forEach(s=>s.songIds=s.songIds.filter(x=>x!==id));save();renderSongs();if(currentSet)renderEditor()}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function presentation(){const s=db.setlists.find(x=>x.id===currentSet);if(!s||!s.songIds.length)return alert("Add at least one song first.");presentIndex=0;updatePresentation();$("presentation").classList.remove("hidden")}
function updatePresentation(){const set=db.setlists.find(x=>x.id===currentSet), song=db.songs.find(x=>x.id===set.songIds[presentIndex]);$("presentLabel").textContent=`${set.name} · ${song.key||"—"} · ${song.bpm||"—"} BPM`;$("presentTitle").textContent=song.title;$("presentLyrics").textContent=song.lyrics||"No lyrics or notes added."; $("presentCounter").textContent=`${presentIndex+1} / ${set.songIds.length}`}
function exportData(){const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="worship-setlist-backup.json";a.click();URL.revokeObjectURL(a.href)}
$("importInput").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.songs||!x.setlists)throw 0;db=x;save();renderSetlists();renderSongs();alert("Backup imported.");}catch{alert("Invalid Worship Setlist backup.")}};r.readAsText(f)});
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");if(b.dataset.view==="songs"){currentSet=null;showView("songsView");$("pageTitle").textContent="Song Library";renderSongs()}else{currentSet=null;showView("setlistsView");$("pageTitle").textContent="My Setlists";renderSetlists()}});
$("newSetlist").onclick=$("heroNew").onclick=openSetlistDialog;$("addSongBtn").onclick=addSong;$("songSearch").oninput=renderSongs;$("addToSetlist").onclick=addSongToSet;$("backBtn").onclick=()=>{currentSet=null;showView("setlistsView");$("pageTitle").textContent="My Setlists";renderSetlists()};$("presentBtn").onclick=presentation;$("closePresentation").onclick=()=>$("presentation").classList.add("hidden");$("prevSong").onclick=()=>{if(presentIndex>0){presentIndex--;updatePresentation()}};$("nextSong").onclick=()=>{const s=db.setlists.find(x=>x.id===currentSet);if(presentIndex<s.songIds.length-1){presentIndex++;updatePresentation()}};$("exportBtn").onclick=exportData;
renderSetlists();renderSongs();
