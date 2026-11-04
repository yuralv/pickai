<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#080808">
<title>PickAI — 더 빠르고 똑똑한 쇼핑 탐색</title>
<meta name="description" content="원하는 상품과 취향을 입력하면 PickAI가 맞춤 검색어를 만들고 5개 쇼핑몰로 연결해 드립니다.">
<style>
:root{color-scheme:dark;--bg:#050505;--panel:#211f1f;--line:#49413e;--ink:#f8f5f3;--muted:#c0b8b4;--orange:#ff9d62;--red:#d94d3d;--shadow:0 18px 55px #0008}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,Pretendard,"Noto Sans KR",system-ui,-apple-system,"Segoe UI",sans-serif}button,input,textarea{font:inherit}button{cursor:pointer}.wrap{width:min(1180px,calc(100% - 48px));margin:auto}
.top{height:88px;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{display:flex;align-items:center;gap:11px;font-size:19px;font-weight:900;letter-spacing:-.5px}.mark{width:47px;height:47px;border-radius:12px;background:#000;display:grid;place-items:center;border:1px solid #292321}.mark svg{width:38px;height:38px}.toplink{border:1px solid #a75a40;background:#ffffff08;color:#f6e9e3;border-radius:999px;padding:8px 15px;font-size:11px;font-weight:750}
.hero{position:relative;isolation:isolate;overflow:hidden;margin:0 -24px;padding:52px max(24px,calc((100vw - 1084px)/2)) 62px;min-height:425px;background:radial-gradient(ellipse at 86% 0%,#ffffff42 0%,#77736f 25%,transparent 54%),linear-gradient(180deg,#777574 0%,#383635 48%,#050505 100%)}.hero:before{content:"";position:absolute;z-index:-1;width:380px;height:380px;right:-110px;top:-180px;border:1px solid #b77a4d;border-radius:50%;box-shadow:0 0 0 54px #b77a4d0b,0 0 0 110px #b77a4d09}.eyebrow{font-size:10px;letter-spacing:2px;font-weight:800;color:#eee6e1}.hero h1{font-size:clamp(35px,5vw,54px);letter-spacing:-2.2px;line-height:1.13;margin:18px 0 20px;max-width:700px;font-weight:850}.hero p{margin:0;color:#eee9e6;line-height:1.7;max-width:590px;font-size:14px}.searchbox{margin-top:29px;max-width:730px;min-height:58px;padding:6px 7px 6px 17px;border:1px solid #77706d;border-radius:15px;background:#252323;display:grid;grid-template-columns:1fr auto;gap:10px;box-shadow:0 12px 35px #0003}.searchbox textarea{width:100%;height:42px;min-height:42px;max-height:100px;resize:vertical;border:0;outline:0;background:transparent;color:#fff;padding:10px 4px;font-size:13px;line-height:1.5}.searchbox textarea::placeholder{color:#c4bcba}.primary{border:0;border-radius:12px;background:linear-gradient(100deg,#fff4f0,#d94d3d);color:#17100e;font-weight:900;padding:0 23px;min-width:155px;font-size:13px}.primary:hover{filter:brightness(1.07)}.primary:disabled{opacity:.6;cursor:wait}.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.chip{border:1px solid #ad6348;background:#753a2a;color:#fff1e9;padding:7px 12px;border-radius:999px;font-size:11px}.chip:hover{background:#9a4c35}.modebar{font-size:11px;color:#d7cfca;margin-top:13px;display:flex;align-items:center;gap:8px}.dot{width:7px;height:7px;border-radius:50%;background:#e3a45c}.dot.ok{background:#5bc58e}
.section{padding:47px 0 49px;border-bottom:1px solid #39302c}.section .eyebrow{color:#d8c9c1}.section h2{font-size:21px;letter-spacing:-.7px;margin:9px 0 6px}.section-desc{font-size:12px;color:#bcb4b0;margin:0;line-height:1.7}.recommend-area{margin-top:23px}.recommend-label{font-size:13px;font-weight:800;margin-bottom:12px}.rec-options{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.rec-option{background:#211f1f;border:1px solid #504744;color:#fff;border-radius:14px;text-align:left;padding:14px 16px;min-height:88px;transition:.15s}.rec-option:hover,.rec-option.active{border-color:#e17a4e;background:#2b2421}.rec-option .num{font-family:Georgia,serif;font-size:25px;color:var(--orange);font-weight:700}.rec-option .recname{display:block;font-size:13px;font-weight:850;margin-top:5px}.rec-option .recquery{display:block;color:#bfb5b0;font-size:11px;margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.store-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:15px}.store-card{border:1px solid #514945;border-radius:16px;background:linear-gradient(145deg,#272424,#1d1b1b);padding:19px 20px 17px;min-height:190px;display:flex;flex-direction:column}.store-number{font-family:Georgia,serif;color:var(--orange);font-size:29px;font-weight:700}.store-name{font-size:16px;font-weight:850;margin-top:12px}.store-desc{font-size:11px;color:#c5bdb9;margin-top:7px}.store-link{margin-top:auto;padding:12px 14px;border-radius:11px;text-decoration:none;color:white;font-size:12px;font-weight:850;display:flex;align-items:center;justify-content:space-between}.store-link span:last-child{font-size:19px}.amazon .store-link{background:linear-gradient(100deg,#070707,#82731b)}.temu .store-link{background:linear-gradient(100deg,#bcb9b8,#ff6500)}.aliexpress .store-link{background:linear-gradient(100deg,#090706,#a64a00)}.coupang .store-link{background:linear-gradient(100deg,#28b6ed,#389d56)}.elevenst .store-link{background:linear-gradient(100deg,#170604,#f1240d)}.empty,.loading{padding:20px 0;color:#c7bfbb;font-size:12px;line-height:1.7}.notice{margin-top:27px;padding:15px 17px;border-radius:14px;background:#2b201d;color:#d4c8c2;font-size:11px;line-height:1.7}.tools{display:grid;grid-template-columns:1fr 1fr;gap:15px;padding:30px 0}.toolcard{background:#171515;border:1px solid #393230;border-radius:14px;padding:17px}.tool-title{font-size:13px;font-weight:850;margin-bottom:12px}.pref-add{display:grid;grid-template-columns:1fr 40px;gap:7px}.pref-add input{min-width:0;border:1px solid #514945;border-radius:9px;padding:10px;background:#0e0d0d;color:#fff;font-size:12px;outline:none}.pref-add button{border:0;border-radius:9px;background:#a84c31;color:#fff;font-weight:900}.pref-list,.history-list{display:grid;gap:7px;margin-top:10px}.pref-item,.history-item{display:flex;align-items:center;justify-content:space-between;gap:8px;border:1px solid #393230;border-radius:9px;padding:8px 9px;font-size:11px;color:#e9e1dd}.pref-item span{overflow-wrap:anywhere}.delete,.history-item button,.clear{border:0;background:none;padding:0;font-size:11px;color:#e9a184}.history-item button{text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.muted{color:#a99f9a;font-size:11px}.clear{margin-top:10px}.footer{padding:24px 0 30px;text-align:center;color:#aaa09b;font-size:10px;border-top:1px solid #39302c}.toast{position:fixed;left:50%;bottom:22px;transform:translate(-50%,20px);opacity:0;pointer-events:none;background:#f6eee9;color:#1a1412;padding:11px 15px;border-radius:12px;font-size:12px;transition:.2s;z-index:10;box-shadow:var(--shadow)}.toast.on{opacity:1;transform:translate(-50%,0)}
@media(max-width:760px){.wrap{width:min(100% - 28px,620px)}.top{height:72px}.hero{margin:0 -14px;padding:40px 22px 45px;min-height:0}.hero h1{font-size:37px}.searchbox{grid-template-columns:1fr}.primary{height:46px}.rec-options{grid-template-columns:1fr}.rec-option{min-height:74px}.store-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.store-card{min-height:175px;padding:15px}.tools{grid-template-columns:1fr}.section{padding:35px 0}.toplink{font-size:10px;padding:7px 10px}}
@media(max-width:420px){.store-grid{grid-template-columns:1fr}.hero h1{font-size:33px}.brand{font-size:17px}.mark{width:42px;height:42px}}
</style>
</head>
<body>
<div class="wrap">
<header class="top">
  <div class="brand"><div class="mark" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M9 17h30l-3 23H12L9 17Z" stroke="#f3eee8" stroke-width="1.7"/><path d="M16 18c0-8 16-8 16 0" stroke="#f3eee8" stroke-width="1.7"/><path d="M7 31c7-11 19-16 34-17M8 36c10-7 22-10 34-8" stroke="#ff7b28" stroke-width="2.2" stroke-linecap="round"/><path d="m34 9 7 4-7 4" stroke="#ef3d25" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></div><span>PICK AI</span></div>
  <a class="toplink" href="#shopping">더 똑똑한 쇼핑 탐색</a>
</header>
<section class="hero">
  <div class="eyebrow">FIND YOUR BETTER PICK</div>
  <h1>고르는 시간은 줄이고, 찾는 길은<br>더 빠르게.</h1>
  <p>찾고 싶은 상품을 입력해 주세요. 알리익스프레스, 테무, 아마존, 쿠팡, 11번가의 검색 결과로 바로 이동할 수 있습니다.</p>
  <form class="searchbox" id="searchForm">
    <textarea id="query" maxlength="500" placeholder="예: 조용한 흰색 무선 키보드, 10만 원 이하" required></textarea>
    <button class="primary" id="searchButton" type="submit">쇼핑몰에서 찾기 →</button>
  </form>
  <div class="chips">
    <button class="chip" data-query="조용한 흰색 무선 기계식 키보드 10만원 이하">무선 키보드</button>
    <button class="chip" data-query="가성비 좋은 노이즈 캔슬링 무선 이어폰">가성비 이어폰</button>
    <button class="chip" data-query="홍보용 심플한 책상 조명">홍보용 책상</button>
    <button class="chip" data-query="가벼운 대학생 노트북 100만원 이하">노트북</button>
  </div>
  <div class="modebar"><i class="dot" id="modeDot"></i><span id="modeText">AI 추천 준비 중</span><span id="searchInfo"></span></div>
</section>
<section class="section" id="shopping">
  <div class="eyebrow">FIND IT OUT THERE</div>
  <h2>원하는 쇼핑몰에서 바로 찾기</h2>
  <p class="section-desc">상품을 이 페이지에 나열하지 않습니다. 아래 링크를 열어 각 쇼핑몰의 검색 결과를 확인해 주세요.</p>
  <div class="recommend-area">
    <div class="recommend-label">검색 조건을 선택해 주세요</div>
    <div id="recommendations" class="rec-options"><div class="empty">상품을 입력하시면 맞춤 검색어 3가지를 제안해 드립니다.</div></div>
  </div>
  <div class="recommend-label" style="margin-top:25px">쇼핑몰 검색 결과 바로가기</div>
  <div id="storeGrid" class="store-grid">
    <div class="empty">먼저 찾으시는 상품을 입력해 주세요.</div>
  </div>
  <div class="notice">안내 · 각 버튼은 해당 쇼핑몰의 검색 페이지를 새 탭에서 엽니다. 상품 정보와 가격은 쇼핑몰에서 직접 확인해 주세요.</div>
</section>
<section class="tools">
  <div class="toolcard">
    <div class="tool-title">내 취향 기억하기</div>
    <div class="pref-add"><input id="preferenceInput" maxlength="80" placeholder="예: 심플한 디자인"><button id="addPreference" type="button" aria-label="취향 추가">+</button></div>
    <div class="pref-list" id="preferences"><div class="muted">저장된 취향이 없습니다.</div></div>
    <div class="muted" style="margin-top:9px">이 기기의 브라우저에만 저장됩니다.</div>
  </div>
  <div class="toolcard">
    <div class="tool-title">최근 검색</div>
    <div class="history-list" id="history"><div class="muted">검색 기록이 없습니다.</div></div>
    <button class="clear" id="clearHistory" type="button">검색 기록 지우기</button>
  </div>
</section>
<footer class="footer">pick ai · 더 가볍고 명확한 쇼핑 탐색을 위해</footer>
</div>
<div class="toast" id="toast" role="status"></div>
<script>
const $=id=>document.getElementById(id);
const KEYS={prefs:'pickai_v6_preferences',history:'pickai_v6_history'};
const STORE_CLASS={amazon:'amazon',temu:'temu',aliexpress:'aliexpress',coupang:'coupang',elevenst:'elevenst'};
const STORE_NUM={aliexpress:'01',temu:'02',amazon:'03',coupang:'04',elevenst:'05'};
function load(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value:fallback}catch{return fallback}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{showToast('브라우저 저장 공간을 사용할 수 없습니다.')}}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const state={prefs:load(KEYS.prefs,[]).slice(0,15),history:load(KEYS.history,[]).slice(0,10),recommendations:[],selected:0};
let toastTimer;
function showToast(message){const el=$('toast');el.textContent=message;el.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('on'),2400)}
function renderPreferences(){const el=$('preferences');el.innerHTML=state.prefs.length?state.prefs.map((p,i)=>`<div class="pref-item"><span>${escapeHtml(p)}</span><button class="delete" type="button" data-remove-pref="${i}">삭제</button></div>`).join(''):'<div class="muted">저장된 취향이 없습니다.</div>'}
function renderHistory(){const el=$('history');el.innerHTML=state.history.length?state.history.map((h,i)=>`<div class="history-item"><button type="button" data-history="${i}">${escapeHtml(h)}</button></div>`).join(''):'<div class="muted">검색 기록이 없습니다.</div>'}
function rememberQuery(query){state.history=[query,...state.history.filter(x=>x!==query)].slice(0,10);save(KEYS.history,state.history);renderHistory()}
function renderResults(data){
  $('recommendations').innerHTML=(data.recommendations||[]).map((item,index)=>`<button type="button" class="rec-option ${index===state.selected?'active':''}" data-rec="${index}"><span class="num">0${index+1}</span><span class="recname">${escapeHtml(item.title)}</span><span class="recquery">${escapeHtml(item.searchQuery)}</span></button>`).join('');
  renderStores();
}
function renderStores(){
  const item=state.recommendations[state.selected];
  if(!item){$('storeGrid').innerHTML='<div class="empty">먼저 찾으시는 상품을 입력해 주세요.</div>';return}
  const storeOrder={aliexpress:0,temu:1,amazon:2,coupang:3,elevenst:4};
  $('storeGrid').innerHTML=[...(item.stores||[])].sort((a,b)=>(storeOrder[a.id]??99)-(storeOrder[b.id]??99)).map(store=>`<article class="store-card ${STORE_CLASS[store.id]||''}"><div class="store-number">${STORE_NUM[store.id]||'↗'}</div><div class="store-name">${escapeHtml(store.name)}</div><div class="store-desc">${escapeHtml(store.name)} 검색 결과로 이동합니다.</div><a class="store-link" href="${escapeHtml(store.url)}" target="_blank" rel="noopener noreferrer"><span>검색 결과 열기</span><span>↗</span></a></article>`).join('');
}
function renderRecommendations(data){
  $('modeText').textContent=data.parser==='openai'?'AI 맞춤 분석 완료':'기본 분석 모드';
  $('searchInfo').textContent=` · 추천 검색어 ${data.recommendations.length}개`;
  state.recommendations=data.recommendations||[];state.selected=0;renderResults(data);
  if(data.warning)showToast(data.warning);
}
async function runRecommendation(query){
 const text=String(query||'').trim();if(!text)return;
 const button=$('searchButton');button.disabled=true;button.textContent='분석 중…';
 $('recommendations').innerHTML='<div class="loading">취향과 조건을 분석하고 있습니다…</div>';
 $('storeGrid').innerHTML='<div class="loading">맞춤 검색어를 준비하고 있습니다…</div>';
 $('modeText').textContent='AI 분석 중';
 try{
  const response=await fetch('/api/recommend',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:text,prefs:state.prefs})});
  const data=await response.json();if(!response.ok)throw new Error(data.error||'추천 요청을 완료하지 못했습니다.');
  renderRecommendations(data);rememberQuery(text);
  $('modeDot').classList.toggle('ok',data.parser==='openai');
  if(data.parser!=='openai')$('modeText').textContent=data.warning?'AI 응답 오류 · 기본 검색어를 표시합니다.':'기본 분석 모드';
  $('shopping').scrollIntoView({behavior:'smooth',block:'start'});
 }catch(error){
  $('recommendations').innerHTML=`<div class="empty"><strong>추천을 만들지 못했습니다.</strong><br>${escapeHtml(error.message||'서버 연결을 확인해 주세요.')}</div>`;
  $('storeGrid').innerHTML='';$('modeText').textContent='서버 연결을 확인해 주세요.';showToast('추천 요청에 실패했습니다.');
 }finally{button.disabled=false;button.textContent='쇼핑몰에서 찾기 →'}
}
$('searchForm').addEventListener('submit',event=>{event.preventDefault();runRecommendation($('query').value)});
$('addPreference').addEventListener('click',()=>{const value=$('preferenceInput').value.trim();if(!value)return;if(state.prefs.includes(value)){showToast('이미 저장된 취향입니다.');return}state.prefs=[...state.prefs,value].slice(-15);save(KEYS.prefs,state.prefs);$('preferenceInput').value='';renderPreferences();showToast('취향을 저장했습니다.')});
$('preferenceInput').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();$('addPreference').click()}});
$('preferences').addEventListener('click',event=>{const button=event.target.closest('[data-remove-pref]');if(!button)return;state.prefs.splice(Number(button.dataset.removePref),1);save(KEYS.prefs,state.prefs);renderPreferences()});
$('history').addEventListener('click',event=>{const button=event.target.closest('[data-history]');if(!button)return;const query=state.history[Number(button.dataset.history)];$('query').value=query;runRecommendation(query)});
$('clearHistory').addEventListener('click',()=>{state.history=[];save(KEYS.history,state.history);renderHistory();showToast('검색 기록을 삭제했습니다.')});
$('recommendations').addEventListener('click',event=>{const button=event.target.closest('[data-rec]');if(!button)return;state.selected=Number(button.dataset.rec);renderResults({recommendations:state.recommendations})});
document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{$('query').value=button.dataset.query;runRecommendation(button.dataset.query)}));
renderPreferences();renderHistory();
fetch('/api/health').then(r=>r.json()).then(data=>{if(data.ok){$('modeDot').classList.toggle('ok',data.aiConfigured);$('modeText').textContent=data.aiConfigured?'AI 연결 설정 확인됨':'기본 분석 모드 · API 설정을 확인해 주세요.'}}).catch(()=>$('modeText').textContent='서버 연결을 확인해 주세요.');
</script>
</body>
</html>