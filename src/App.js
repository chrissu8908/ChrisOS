import { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg:"#080810",panel:"#0c0c1e",panel2:"#10102a",border:"#14142a",border2:"#1e1e3a",
  text:"#ffffff",textSub:"#7070b0",textDim:"#2a2a50",
  accent:"#6060ff",accentHi:"#a060ff",accentBg:"#6060ff14",
  green:"#30d090",red:"#ff3355",redBg:"#ff335514",orange:"#f59e0b",
  sans:"'Inter',system-ui,sans-serif",mono:"'DM Mono','Fira Mono',monospace",
};

const COLORS=["#6060ff","#a060ff","#30d090","#ff3355","#f59e0b","#38bdf8","#f472b6","#34d399","#fb923c","#818cf8"];
const DAYS_FULL=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DAYS_SHORT=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_S=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── YOUR PERSONAL QUOTE COLLECTION ──────────────────────────────────────────
const PERSONAL_QUOTES = [
  {text:"Mistakes are things that you did that you wish you could do over again. Regrets are most often things you didn't do, and wish you did.",author:"Personal Collection"},
  {text:"So few people are capable of learning through the experience of others — you can only partially understand these learnings from others.",author:"Personal Collection"},
  {text:"Restock the stream you fish from — give back to others.",author:"Noyce to Steve Jobs"},
  {text:"The storyteller is the most powerful person in the world.",author:"Steve Jobs / Ed Catmull"},
  {text:"Learning to tell a story is critically important because that's how the money works. The money flows as a function of the story.",author:"Don Valentine"},
  {text:"You're often driven by the hatred of the version of yourself that would quit.",author:"Personal Collection"},
  {text:"The glory and success of the family cannot guarantee the future of its children and grandchildren.",author:"Rockefeller"},
  {text:"People of poor backgrounds will actively develop their creativity and abilities, while also cherishing and seizing various opportunities because they urgently need to rescue themselves.",author:"Rockefeller"},
  {text:"Everyone is a designer and architect of their own destiny. Luck is the remnant of design — we create our own luck.",author:"Personal Collection"},
  {text:"A novice is easily spotted because they do too much. Too many ingredients, too many movements, too much explanation. A master uses the fewest motions required to fulfill their intentions.",author:"Personal Collection"},
  {text:"The goal is not to have the longest train but to arrive at the station first using the least fuel.",author:"Personal Collection"},
  {text:"You cannot connect the dots looking forward, you can only connect them looking backwards. You have to trust that the dots will somehow connect in your future.",author:"Steve Jobs"},
  {text:"Often times the desire to belong will overcome the desire to improve. In the long run, your willpower will almost never beat your environment.",author:"Personal Collection"},
  {text:"We are trying to prove ourselves wrong as quickly as possible, because only that way can we find progress.",author:"Personal Collection"},
  {text:"To a man with a hammer, everything looks like a nail — be multidisciplinary. Have many tools in the toolbox.",author:"Personal Collection"},
  {text:"Radical acceptance quiets the noise created by yesterday's decisions and today's wishful thinking.",author:"Personal Collection"},
  {text:"Envy and self-pity have no utility.",author:"Personal Collection"},
  {text:"All I want to know is where I'm going to die, so I'll never go there.",author:"Buffett / Munger"},
  {text:"The things that you own start to own you.",author:"Sam Zell"},
  {text:"Extreme 'look at me' styles of living should be legal, but not admirable.",author:"Warren Buffett"},
  {text:"It is human nature to overestimate risk and underestimate opportunity. Entrepreneurs are well advised to bias against that piece of human nature.",author:"Personal Collection"},
  {text:"There are few mistakes costlier than hiring the wrong person. An empty seat is less damaging than a poor fit.",author:"Brad Jacobs"},
  {text:"Go to school on everybody.",author:"Brad Jacobs"},
  {text:"Relationships run the world, your reputation is everything.",author:"Brad Jacobs"},
  {text:"I had been dead for billions and billions of years before I was born, and had not suffered the slightest inconvenience from it.",author:"Mark Twain"},
  {text:"Pain is where the progress is — it's not just an indicator of sacrifice, also a measure of growth potential.",author:"Personal Collection"},
  {text:"I can bear any pain as long as it has meaning.",author:"Haruki Murakami"},
  {text:"Learn to reprogram your brain to enjoy the right kind of pain.",author:"Personal Collection"},
  {text:"Ask yourself: What in this present moment is so unbearable? You'll realize it's not the present that weighs you — but the past and the future.",author:"Personal Collection"},
  {text:"Why see more misfortune in the event than good fortune in your ability to bear it?",author:"Personal Collection"},
  {text:"Go after the things that you want. Some people see what they want; some people see the thing that prevents them from getting the thing they want.",author:"Simon Sinek"},
  {text:"Sometimes you're the problem — take accountability for your actions. You can take all the credit for the things you do right, as long as you take responsibility for the things you do wrong.",author:"Simon Sinek"},
  {text:"Leadership isn't about the right people — it's the leadership. Create the right environment.",author:"Simon Sinek"},
  {text:"Tell the truth — value friends who tell the truth.",author:"Personal Collection"},
  {text:"9/10 times, sitting around strategizing is a form of procrastination.",author:"Paul Graham"},
  {text:"Don't try to see the entire mountain at once. Just focus on the hill in front of you — and that hill is adjacent to a bigger and more interesting hill.",author:"Judy Faulkner"},
  {text:"10,000 hours is more like 10,000 error corrections — not the same as repetition, doing the same thing over.",author:"Personal Collection"},
  {text:"The pain of what you're feeling is nothing compared to the joy that's coming.",author:"Romans 8:18"},
  {text:"I realize I have nothing to lose by following my heart and intuition, even if I embarrass myself or fail in the eyes of others, because I'll be dead soon.",author:"Personal Journal, 8/19/25"},
  {text:"Design a day — do I like what I did today? If I did, do it again tomorrow.",author:"Personal Collection"},
  {text:"Effort is sacred even when results betray you.",author:"Personal Collection"},
  {text:"Sometimes the greatest act of strength is sweeping the floor without bitterness.",author:"Personal Collection"},
  {text:"Suppression of expression leads to depression.",author:"Personal Collection"},
  {text:"You're only as healed from something as your ability to share it. You cannot heal what you cannot feel, and you cannot feel what you are unwilling to reveal.",author:"Personal Collection"},
  {text:"Overthinking invents more problems than it solves.",author:"Personal Collection"},
  {text:"Sometimes the wait is longer because the blessing is bigger.",author:"Personal Collection"},
  {text:"In the long run there is no waste in life.",author:"Honda"},
  {text:"The 3 biggest decisions in life: where you live, who you're around, what you do. We don't nearly think about these things long enough.",author:"Personal Collection"},
  {text:"Durability is a first-rate virtue. Growth is easy to measure, durability isn't.",author:"Personal Collection"},
  {text:"Chips on shoulders put chips in pockets.",author:"Personal Collection"},
  {text:"Making mistakes is the privilege of the active.",author:"Personal Collection"},
  {text:"It knows roughly where it's going, but it scurries, stops, looks around, course-corrects, scurries more. Take it day-by-day — you know more about things the closer they are to you.",author:"Jason Fried, 37signals"},
  {text:"Compression is understanding.",author:"Personal Collection"},
  {text:"You only need to get rich once. Time is the only true currency — you will compound for the rest of your life.",author:"Munger to Mickey Malka"},
  {text:"Never turn away from progress because if we do we go backwards.",author:"Personal Collection"},
  {text:"Memory dividends, not memory liabilities.",author:"Personal Collection"},
  {text:"Film had its own language and I needed to be bilingual.",author:"Michael Ovitz"},
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
function useLocalStorage(key,init){
  const [v,setV]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init;}catch{return init;}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(v));}catch{}},[key,v]);
  return [v,setV];
}
function useClock(){
  const [t,setT]=useState(new Date());
  useEffect(()=>{const i=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(i);},[]);
  return t;
}
function getToday(){const d=new Date();return{year:d.getFullYear(),month:d.getMonth(),date:d.getDate(),dayOfWeek:(d.getDay()+6)%7};}
function dateKey(y,m,d){return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}
function todayKey(){const t=getToday();return dateKey(t.year,t.month,t.date);}
function getDaysInMonth(y,m){return new Date(y,m+1,0).getDate();}
function getFirstDayOfMonth(y,m){return(new Date(y,m,1).getDay()+6)%7;}
function pct(v,t){return t>0?Math.round((v/t)*100):0;}

// ─── SERVER-SIDE AI ROUTING ─────────────────────────────────────────────────────
// The browser never receives provider API keys. All AI requests go through /api/ai.
// Groq currently supports Qwen 3.6 27B and DeepSeek-R1-Distill-Qwen-32B.
// The deployment keeps GROQ_API_KEY server-side in environment variables.
const AI_API = "/api/ai";

async function callAI(systemPrompt, userPrompt, maxTokens=500, task="general"){
  try{
    const res=await fetch(AI_API,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({systemPrompt,userPrompt,maxTokens,task}),
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok){
      console.warn(`[AI] HTTP ${res.status}`, data?.error||"");
      return null;
    }
    return data?.text||null;
  }catch(e){
    console.warn("[AI] request failed:",e?.message||e);
    return null;
  }
}

// ─── SKY BACKGROUND ───────────────────────────────────────────────────────────
// UNSPLASH INTEGRATION: Replace with real photo:
// const res = await fetch(`https://api.unsplash.com/photos/random?query=${topic}&orientation=landscape&client_id=YOUR_UNSPLASH_KEY`)
// const photo = await res.json(); use photo.urls.full as background-image CSS

function SkyBackground({hour}){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    c.width=c.offsetWidth;c.height=c.offsetHeight;
    const W=c.width,H=c.height;
    const palettes={night:["#020209","#070718","#0d0d28"],dawn:["#120820","#4a1540","#c04030"],morning:["#0a1040","#1540a0","#4090d0"],noon:["#0a3870","#1868c0","#50a0e0"],golden:["#180a30","#702050","#e06020"],dusk:["#060418","#200a50","#6020b0"]};
    const p=hour<5?"night":hour<7?"dawn":hour<11?"morning":hour<15?"noon":hour<18?"golden":"dusk";
    const [c1,c2,c3]=palettes[p];
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,c1);g.addColorStop(0.5,c2);g.addColorStop(1,c3);
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    if(hour<7||hour>=19){for(let i=0;i<200;i++){ctx.globalAlpha=Math.random()*.7+.1;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(Math.random()*W,Math.random()*H*.6,Math.random()*1.4,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
    if(hour<6||hour>=20){ctx.fillStyle="#dde8ff";ctx.beginPath();ctx.arc(W*.78,H*.16,26,0,Math.PI*2);ctx.fill();ctx.fillStyle=c1;ctx.beginPath();ctx.arc(W*.78+9,H*.16-5,22,0,Math.PI*2);ctx.fill();}
    else{const sy=hour<12?H*.14+(12-hour)*7:H*.14+(hour-12)*7;const sg=ctx.createRadialGradient(W*.72,sy,0,W*.72,sy,60);sg.addColorStop(0,"#fff9e6");sg.addColorStop(.4,"#fef08a");sg.addColorStop(1,"transparent");ctx.fillStyle=sg;ctx.beginPath();ctx.arc(W*.72,sy,60,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fde047";ctx.beginPath();ctx.arc(W*.72,sy,20,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle=c2+"88";ctx.beginPath();ctx.moveTo(0,H);[[0,.7],[.08,.46],[.2,.33],[.32,.49],[.45,.29],[.58,.43],[.72,.26],[.85,.39],[.95,.31],[1,.51]].forEach(([x,y])=>ctx.lineTo(W*x,H*y));ctx.lineTo(W,H);ctx.closePath();ctx.fill();
    ctx.fillStyle=c3+"44";ctx.beginPath();ctx.moveTo(0,H);[[0,.78],[.12,.6],[.25,.7],[.38,.52],[.5,.65],[.65,.54],[.78,.63],[.9,.5],[1,.66]].forEach(([x,y])=>ctx.lineTo(W*x,H*y));ctx.lineTo(W,H);ctx.closePath();ctx.fill();
    ctx.fillStyle="#080810";ctx.beginPath();ctx.moveTo(0,H);[[0,.83],[.03,.83],[.03,.73],[.06,.73],[.06,.66],[.075,.66],[.075,.59],[.09,.59],[.09,.73],[.11,.73],[.11,.64],[.13,.64],[.13,.52],[.14,.52],[.14,.49],[.15,.49],[.15,.69],[.18,.69],[.18,.63],[.21,.63],[.21,.71],[.25,.71],[.25,.59],[.27,.59],[.27,.55],[.29,.55],[.29,.52],[.31,.52],[.31,.71],[.35,.71],[.35,.65],[.37,.65],[.37,.58],[.39,.58],[.39,.54],[.42,.54],[.42,.71],[.46,.71],[.46,.63],[.5,.63],[.5,.57],[.52,.57],[.52,.51],[.535,.51],[.535,.48],[.545,.48],[.545,.45],[.55,.45],[.55,.63],[.58,.63],[.58,.69],[.62,.69],[.62,.61],[.65,.61],[.65,.56],[.67,.56],[.67,.53],[.69,.53],[.69,.71],[.72,.71],[.72,.66],[.75,.66],[.75,.61],[.78,.61],[.78,.57],[.8,.57],[.8,.73],[.84,.73],[.84,.67],[.87,.67],[.87,.71],[.9,.71],[.9,.63],[.93,.63],[.93,.77],[.96,.77],[.96,.73],[1,.73],[1,1],[0,1]].forEach(([x,y])=>ctx.lineTo(W*x,H*y));ctx.closePath();ctx.fill();
    if(hour<7||hour>=18){for(let i=0;i<150;i++){const wx=Math.random()*W,wy=H*.5+Math.random()*H*.3;const px=ctx.getImageData(Math.min(wx,W-1),Math.min(wy,H-1),1,1).data;if(px[0]<15&&px[1]<15&&px[2]<20){ctx.fillStyle=`rgba(255,215,80,${Math.random()*.55+.25})`;ctx.fillRect(wx,wy,3,4);}}}
    const haze=ctx.createLinearGradient(0,H*.5,0,H);haze.addColorStop(0,"transparent");haze.addColorStop(1,"rgba(8,8,16,.75)");ctx.fillStyle=haze;ctx.fillRect(0,0,W,H);
  },[hour]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>;
}

// ─── NEWS SOURCES ─────────────────────────────────────────────────────────────
// All external data access is server-side. The React client calls /api/news,
// which fetches Currents + Reddit and returns one normalized payload.
const NEWS_API = "/api/news";

const NEWS_TABS = [
  {id:"world", label:"World", emoji:"🌍", category:"general", reddit:["worldnews","news","inthenews"]},
  {id:"tech", label:"Tech", emoji:"💻", category:"technology", reddit:["technology","technews"]},
  {id:"business", label:"Business", emoji:"📈", category:"business", reddit:["business","economy"]},
  {id:"politics", label:"Politics", emoji:"🏛️", category:"politics", reddit:["politics"]},
  {id:"interesting", label:"Interesting", emoji:"✨", category:"science", reddit:["futurology","mildlyinteresting","history","philosophy","todayilearned"]},
];

async function fetchTabData(tab){
  try{
    const params=new URLSearchParams({
      category:tab.category,
      subreddits:(tab.reddit||[]).join(","),
    });
    const r=await fetch(`${NEWS_API}?${params.toString()}`);
    const data=await r.json().catch(()=>({}));
    if(!r.ok){
      console.warn(`[News/${tab.id}] HTTP ${r.status}`,data?.error||"");
      return {news:[],reddit:[],error:data?.error||`News request failed (${r.status})`};
    }
    return {
      news:Array.isArray(data.news)?data.news:[],
      reddit:Array.isArray(data.reddit)?data.reddit:[],
      error:null,
    };
  }catch(e){
    console.warn(`[News/${tab.id}]`,e?.message||e);
    return {news:[],reddit:[],error:e?.message||"Unable to fetch news"};
  }
}

// ─── NEWS INTELLIGENCE ─────────────────────────────────────────────────────────
// The model does NOT decide what is "true" from Reddit.
// It first synthesizes reported news, then characterizes Reddit as
// bottom-up public discussion.

function parseJSON(text){
  if(!text) return null;
  try{
    const start=text.indexOf("{");
    const end=text.lastIndexOf("}");
    if(start===-1||end===-1) return null;
    return JSON.parse(text.slice(start,end+1));
  }catch(e){
    console.warn("[news] JSON parse failed:",e?.message||e);
    return null;
  }
}

// ─── NEWS SUMMARY HOOK ────────────────────────────────────────────────────────
// Single LLM call — picks important stories AND writes bullets in one pass.
// Uses numeric IDs so the model can never fabricate a link: we look up the
// real URL in JS from the ID it returns. Reddit is a separate evidence stream.
//
// Bugs fixed vs prior version:
//  • Dep array was watching items?.rss?.length — data key is items.news not rss
//  • isLoading logic was inverted — spinner disappeared during fetch
//  • Two-call pipeline doubled failure surface; collapsed to one call
//  • Model was constructing/guessing URLs — now uses id→url lookup table
//  • Token budget was too large for free-tier models; trimmed inputs
function useNewsSummary(tab,items){
  const [summary,setSummary]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  useEffect(()=>{
    const newsCount=items?.news?.length||0;
    if(!newsCount) return;

    const cacheKey=`news-v7-${tab.id}-${todayKey()}`;
    const cached=sessionStorage.getItem(cacheKey);
    if(cached){
      try{
        const parsed=JSON.parse(cached);
        if(parsed?.bullets?.length){setSummary(parsed);return;}
      }catch{}
    }

    let cancelled=false;
    setLoading(true);
    setError(null);

    const newsItems=items.news.slice(0,18);
    const redditItems=(items.reddit||[]).slice(0,10);

    const newsBlock=newsItems.map((a,i)=>
      `[${i}] ${a.source} — ${a.title}${a.desc?` | ${a.desc.slice(0,180)}`:""}`
    ).join("\n");
    const redditBlock=redditItems.length
      ? redditItems.map((r,i)=>`[R${i}] ${r.source} (${r.score||0}↑, ${r.comments||0} comments) — ${r.title}`).join("\n")
      : "No Reddit posts available.";

    const system=`You are the editor of a personal daily news dashboard.

Your job is to decide what deserves attention, NOT summarize every headline.

REPORTED NEWS is factual input from professional news sources. PUBLIC THOUGHT is Reddit discussion and must never be treated as representative public opinion or factual evidence by itself.

Choose the number of stories based on the day:
- slow day: 1-3 stories
- normal day: 3-5 stories
- major news day: up to 6 stories
Never add filler to hit a quota.

Cluster multiple headlines covering the same underlying event into one story.
Rank stories by real-world consequence, magnitude/novelty, breadth of impact, importance to understanding the day, and independent corroboration.

Each bullet must be one compact paragraph: "Headline — what happened, and why it matters." Keep it analytical and specific.

Return ONLY JSON in exactly this shape:
{
  "bullets":[{"id":0,"text":"Headline — concise explanation of what happened and why it matters."}],
  "publicThought":{"summary":"1-2 sentences on recurring substantive Reddit themes, or say the sample is weak/unrelated.","themes":["theme 1","theme 2"],"sentiment":"concerned|mixed|optimistic|skeptical|neutral","sourceCount":0}
}

Rules:
- id must exactly match a numeric reported-news index.
- Never invent ids, sources, URLs, facts, or statistics.
- Do not cite Reddit in news bullets.
- publicThought.sourceCount must reflect Reddit posts actually used.`;

    callAI(
      system,
      `TAB: ${tab.label}\n\nREPORTED NEWS:\n${newsBlock}\n\nPUBLIC THOUGHT FROM REDDIT:\n${redditBlock}\n\nReturn only the JSON object.`,
      1000,
      "news"
    ).then(text=>{
      if(cancelled) return;
      const parsed=parseJSON(text);
      if(!parsed?.bullets?.length){
        setError("AI returned no usable digest. Showing the latest headlines instead.");
        setLoading(false);
        return;
      }

      const bullets=parsed.bullets
        .filter(b=>Number.isInteger(b?.id)&&newsItems[b.id]&&b?.text)
        .slice(0,6)
        .map(b=>({
          text:String(b.text).trim(),
          source:newsItems[b.id].source,
          link:newsItems[b.id].link,
        }));

      if(!bullets.length){
        setError("AI could not map its selections back to the reported-news sources.");
        setLoading(false);
        return;
      }

      const safe={
        bullets,
        publicThought:{
          summary:parsed.publicThought?.summary||"",
          themes:Array.isArray(parsed.publicThought?.themes)?parsed.publicThought.themes.slice(0,3):[],
          sentiment:parsed.publicThought?.sentiment||"neutral",
          sourceCount:Number(parsed.publicThought?.sourceCount)||0,
        },
      };
      setSummary(safe);
      sessionStorage.setItem(cacheKey,JSON.stringify(safe));
      setLoading(false);
    }).catch(e=>{
      if(cancelled) return;
      console.warn("[News digest]",e?.message||e);
      setError("Unable to generate the AI digest. Showing the latest headlines instead.");
      setLoading(false);
    });

    return()=>{cancelled=true;};
  },[tab.id,items?.news?.length,items?.reddit?.length]);

  return{summary,loading,error};
}

// ─── QUOTE HOOK ───────────────────────────────────────────────────────────────
// Uses "creative" tier — Gemma 2 9B (free). Prose quality matters here.
function useQuote(apiKey, topHeadline){
  const [quote,setQuote]=useState(null);

  useEffect(()=>{
    const today=getToday();
    const idx=(today.year*366+today.month*31+today.date)%PERSONAL_QUOTES.length;
    setQuote(PERSONAL_QUOTES[idx]);

    if(!topHeadline) return;
    const cacheKey=`quote-v3-${todayKey()}`;
    const cached=sessionStorage.getItem(cacheKey);
    if(cached){try{const q=JSON.parse(cached);if(q.text)setQuote(q);}catch{}return;}

    callAI(
      `Write one short, memorable quote that connects a news headline to human nature, resilience, progress, or decision-making. Return ONLY JSON: {"text":"...","author":"..."}.`,
      `Today's headline: "${topHeadline}"`,
      180,
      "quote"
    ).then(text=>{
      const parsed=parseJSON(text);
      if(parsed?.text&&parsed?.author){setQuote(parsed);sessionStorage.setItem(cacheKey,JSON.stringify(parsed));}
    });
  },[topHeadline]);

  return quote;
}

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
function SettingsPanel({onClose}){
  const [testing,setTesting]=useState(false);
  const [testResult,setTestResult]=useState(null);

  const test=async()=>{
    setTesting(true);setTestResult(null);
    const result=await callAI("Reply with only: connection works","connection test",20,"test");
    setTestResult(result?"success":"fail");
    setTesting(false);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:T.panel,border:`1px solid ${T.border2}`,borderRadius:20,padding:36,width:"100%",maxWidth:520,fontFamily:T.sans}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:28}}>
          <div><p style={{margin:0,fontFamily:T.mono,fontSize:12,color:T.textSub,letterSpacing:"0.12em",textTransform:"uppercase"}}>Configuration</p><h2 style={{margin:"6px 0 0",fontSize:24,fontWeight:800,color:T.text}}>News + AI</h2></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.textSub,cursor:"pointer",fontSize:28,lineHeight:1}}>×</button>
        </div>
        <div style={{background:T.panel2,borderRadius:14,padding:18,border:`1px solid ${T.border}`,marginBottom:18}}>
          <p style={{margin:"0 0 10px",fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase"}}>Server-side configuration</p>
          <p style={{margin:0,fontSize:14,color:T.textSub,lineHeight:1.6}}>Groq, Currents, and Reddit are now accessed through server-side API routes. Secrets stay out of the browser and can be configured as deployment environment variables.</p>
        </div>
        <div style={{display:"grid",gap:10,marginBottom:24}}>
          {["GROQ_API_KEY","CURRENTS_API_KEY"].map(name=><div key={name} style={{display:"flex",justifyContent:"space-between",padding:"12px 14px",background:T.bg,borderRadius:10,border:`1px solid ${T.border}`}}><span style={{fontFamily:T.mono,fontSize:11,color:T.textSub}}>{name}</span><span style={{fontFamily:T.mono,fontSize:10,color:T.green}}>SERVER SECRET</span></div>)}
        </div>
        <button onClick={test} disabled={testing} style={{height:42,padding:"0 18px",background:T.accentBg,border:`1px solid ${T.accent}44`,borderRadius:10,color:T.accent,fontSize:14,cursor:"pointer",fontWeight:700,fontFamily:T.mono}}>{testing?"Testing…":"Test Groq connection"}</button>
        {testResult&&<span style={{marginLeft:12,fontSize:13,fontWeight:700,color:testResult==="success"?T.green:T.red}}>{testResult==="success"?"✓ Connected":"✗ Check server environment"}</span>}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:24}}><button onClick={onClose} style={{height:44,padding:"0 20px",background:"none",border:`1px solid ${T.border2}`,borderRadius:10,color:T.textSub,fontSize:14,cursor:"pointer"}}>Close</button></div>
      </div>
    </div>
  );
}

// ─── AI NEWS CHAT ─────────────────────────────────────────────────────────────
function NewsChat({allItems,onClose}){
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);

  const context=Object.entries(allItems).map(([tabId,data])=>{
    const tab=NEWS_TABS.find(t=>t.id===tabId);
    const headlines=[...(data.news||[]),...(data.reddit||[])].slice(0,8).map(i=>`[${i.source}] ${i.title}`).join("\n");
    return `=== ${tab?.label||tabId} ===\n${headlines}`;
  }).join("\n\n");

  const send=async()=>{
    if(!input.trim()||loading) return;
    const userMsg={role:"user",content:input.trim()};
    setMessages(p=>[...p,userMsg]);setInput("");setLoading(true);
    const text=await callAI(
      `You are a sharp news analyst embedded in a personal dashboard. You have today's headlines from multiple sources across World, Tech, Business, Politics, and Interesting categories. Answer questions with insight and cite sources when the supplied context supports it. Be concise but substantive. Note where perspectives diverge — especially between mainstream outlets and Reddit community views.\n\nToday's headlines:\n${context}`,
      [...messages,userMsg].map(m=>`${m.role==="user"?"User":"Assistant"}: ${m.content}`).join("\n"),
      600,
      "chat"
    );
    setMessages(p=>[...p,{role:"assistant",content:text||"Couldn't get a response."}]);
    setLoading(false);
  };

  useEffect(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),[messages,loading]);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:T.panel,border:`1px solid ${T.border2}`,borderRadius:20,width:"100%",maxWidth:660,height:600,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"20px 26px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:T.accent}}/>
          <div style={{flex:1}}>
            <p style={{margin:0,fontSize:20,fontWeight:800,color:T.text,fontFamily:T.sans}}>News AI</p>
            <p style={{margin:0,fontSize:14,color:T.textSub}}>Ask anything across all today's sources</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.textSub,cursor:"pointer",fontSize:26}}>×</button>
        </div>
        <div style={{flex:1,overflow:"auto",padding:"20px 26px",display:"flex",flexDirection:"column",gap:14}}>
          {messages.length===0&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <p style={{margin:0,fontSize:15,color:T.textSub}}>Try asking:</p>
              {["What's the most important story today and why?","Where do mainstream media and Reddit disagree?","What should I know about today's markets?","Any surprising or counterintuitive stories today?"].map(s=>(
                <button key={s} onClick={()=>setInput(s)} style={{background:T.accentBg,border:`1px solid ${T.accent}33`,borderRadius:10,padding:"12px 16px",cursor:"pointer",textAlign:"left",fontSize:15,color:T.text,fontFamily:T.sans,fontWeight:500}}>"{s}"</button>
              ))}
            </div>
          )}
          {messages.map((m,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"85%",padding:"14px 18px",borderRadius:14,background:m.role==="user"?T.accent:T.panel2,color:T.text,fontSize:15,lineHeight:1.65,fontWeight:m.role==="user"?600:400}}>{m.content}</div>
            </div>
          ))}
          {loading&&<div style={{display:"flex",gap:6,padding:"12px 16px",background:T.panel2,borderRadius:14,width:"fit-content"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:T.textSub,animation:`pulse 1.2s ${i*.2}s ease-in-out infinite`}}/>)}</div>}
          <div ref={bottomRef}/>
        </div>
        <div style={{padding:"14px 22px",borderTop:`1px solid ${T.border}`,display:"flex",gap:10,flexShrink:0}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about today's news..."
            style={{flex:1,height:48,background:T.panel2,border:`1px solid ${T.border2}`,borderRadius:12,color:T.text,fontSize:15,padding:"0 16px",outline:"none",fontFamily:T.sans}}/>
          <button onClick={send} disabled={loading||!input.trim()} style={{height:48,padding:"0 22px",background:T.accent,border:"none",borderRadius:12,color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",opacity:loading||!input.trim()?.5:1}}>Ask</button>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.85)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

// ─── NEWS PANEL (HOME) ────────────────────────────────────────────────────────
function NewsPanel({allItems,setAllItems,onTopHeadline}){
  const [activeTab,setActiveTab]=useState(0);
  const [loadingTabs,setLoadingTabs]=useState({});
  const tab=NEWS_TABS[activeTab];
  const items=allItems[tab.id]||{};
  const {summary,loading:summaryLoading,error:summaryError}=useNewsSummary(tab,items);

  // ← Fixed: isLoading is true while the fetch is in flight (loadingTabs[tab.id]===true)
  //   OR while we have a key but haven't started yet (!items.news && !loadingTabs[tab.id])
  const fetchDone=!!items.news; // news array exists (even if empty) = fetch completed
  const isLoading=!fetchDone;

  useEffect(()=>{
    if(fetchDone||loadingTabs[tab.id]) return;
    setLoadingTabs(p=>({...p,[tab.id]:true}));
    fetchTabData(tab).then(data=>{
      setAllItems(p=>({...p,[tab.id]:data}));
      if(activeTab===0&&data.news?.[0]?.title) onTopHeadline(data.news[0].title);
    }).finally(()=>setLoadingTabs(p=>({...p,[tab.id]:false})));
  },[tab.id,fetchDone]);

  return(
    <div style={{background:"rgba(12,12,30,.85)",backdropFilter:"blur(20px)",borderRadius:18,border:"1px solid rgba(255,255,255,.07)",overflow:"hidden",display:"flex",flexDirection:"column",height:400}}>
      {/* Tab bar */}
      <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,.06)",flexShrink:0}}>
        {NEWS_TABS.map((t,i)=>(
          <button key={t.id} onClick={()=>setActiveTab(i)} style={{
            flex:1,padding:"11px 2px",background:"none",border:"none",cursor:"pointer",
            fontFamily:T.mono,fontSize:9,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",
            color:activeTab===i?"rgba(255,255,255,.9)":"rgba(255,255,255,.25)",
            borderBottom:activeTab===i?"2px solid #6060ff":"2px solid transparent",
            transition:"all .15s",
          }}>{t.emoji} {t.label}</button>
        ))}
      </div>

      {/* Scrollable content */}
      <div style={{overflow:"auto",flex:1,padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {/* Loading */}
        {isLoading&&(
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"rgba(96,96,255,.5)",animation:`pulse 1.2s ${i*.2}s ease-in-out infinite`}}/>)}
            <span style={{fontFamily:T.mono,fontSize:11,color:"rgba(255,255,255,.2)"}}>Fetching news…</span>
          </div>
        )}
        {/* No key */}
        {!isLoading&&false&&(
          <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,.28)",fontStyle:"italic",lineHeight:1.6}}>Add your Currents News API key in ⚙ Settings to load headlines. Add OpenRouter separately for AI digests + Public Thought.</p>
        )}
        {/* AI digest — only render after news fetch is complete */}
        {fetchDone&&(
          <>
            {summaryLoading&&(
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"rgba(96,96,255,.6)",animation:`pulse 1.2s ${i*.2}s ease-in-out infinite`}}/>)}
                <span style={{fontFamily:T.mono,fontSize:11,color:"rgba(255,255,255,.22)"}}>Generating digest…</span>
              </div>
            )}
            {summaryError&&<div style={{fontFamily:T.mono,fontSize:10,color:"rgba(255,180,120,.7)",marginBottom:8}}>{summaryError}</div>}
            {summary?.bullets&&!summaryLoading&&(
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                <span style={{fontFamily:T.mono,fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:"rgba(96,96,255,.6)",textTransform:"uppercase",marginBottom:8}}>Today's Digest</span>
                {summary.bullets.map((b,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:9}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#6060ff",marginTop:7,flexShrink:0}}/>
                    <div style={{minWidth:0,lineHeight:1.55}}>
                      <span style={{fontSize:13,color:"rgba(230,230,255,.85)",fontWeight:500}}>{b.text} </span>
                      {b.link&&b.link!=="#"&&b.source&&(
                        <a href={b.link} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
                          style={{fontFamily:T.mono,fontSize:10,color:"rgba(96,96,255,.55)",fontWeight:700,textDecoration:"none",whiteSpace:"nowrap"}}
                          onMouseEnter={e=>e.currentTarget.style.color="rgba(160,160,255,.9)"}
                          onMouseLeave={e=>e.currentTarget.style.color="rgba(96,96,255,.55)"}
                        >↗ {b.source}</a>
                      )}
                    </div>
                  </div>
                ))}
                {summary.publicThought?.summary&&(
                  <div style={{marginTop:4,padding:"11px 12px",background:"rgba(255,80,30,.07)",borderRadius:10,border:"1px solid rgba(255,80,30,.15)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                      <span style={{fontSize:10}}>◉</span>
                      <span style={{fontFamily:T.mono,fontSize:9,fontWeight:700,letterSpacing:"0.1em",color:"rgba(255,120,60,.8)",textTransform:"uppercase"}}>Public Thought</span>
                      {summary.publicThought.sourceCount>0&&(
                        <span style={{fontFamily:T.mono,fontSize:8,color:"rgba(255,150,120,.4)",marginLeft:"auto"}}>
                          {summary.publicThought.sourceCount} discussions
                        </span>
                      )}
                    </div>
                    <p style={{margin:0,fontSize:12,color:"rgba(255,190,150,.78)",lineHeight:1.55}}>{summary.publicThought.summary}</p>
                    {summary.publicThought.themes?.length>0&&(
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>
                        {summary.publicThought.themes.map((theme,i)=>(
                          <span key={i} style={{fontFamily:T.mono,fontSize:8,color:"rgba(255,170,140,.55)",padding:"3px 6px",borderRadius:5,background:"rgba(255,100,50,.08)"}}>{theme}</span>
                        ))}
                      </div>
                    )}
                    <p style={{margin:"7px 0 0",fontSize:9,color:"rgba(255,150,120,.3)",fontFamily:T.mono}}>
                      Bottom-up discussion · not representative public opinion
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {/* Raw headlines — shown after fetch regardless of AI key */}
        {fetchDone&&(items.news||[]).length>0&&(
          <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:10}}>
            <span style={{fontFamily:T.mono,fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:"rgba(255,255,255,.18)",textTransform:"uppercase",display:"block",marginBottom:6}}>Headlines</span>
            {(items.news||[]).slice(0,5).map((item,i)=>(
              <div key={i} onClick={()=>window.open(item.link,"_blank")}
                style={{display:"flex",gap:8,alignItems:"baseline",padding:"5px 0",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,.03)"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <span style={{fontFamily:T.mono,fontSize:9,color:"rgba(96,96,255,.5)",fontWeight:700,flexShrink:0,minWidth:52}}>{item.source}</span>
                <span style={{fontSize:12,color:"rgba(255,255,255,.55)",lineHeight:1.35,fontWeight:500}}>{item.title}</span>
              </div>
            ))}
            {(items.reddit||[]).length>0&&(
              <>
                <span style={{fontFamily:T.mono,fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:"rgba(255,120,60,.35)",textTransform:"uppercase",display:"block",margin:"8px 0 5px"}}>Public Thought</span>
                {(items.reddit||[]).slice(0,3).map((item,i)=>(
                  <div key={i} onClick={()=>window.open(item.link,"_blank")}
                    style={{display:"flex",gap:8,alignItems:"baseline",padding:"5px 0",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,.03)"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <span style={{fontFamily:T.mono,fontSize:9,color:"rgba(255,120,60,.5)",fontWeight:700,flexShrink:0,minWidth:52}}>{item.source}</span>
                    <span style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.35,fontWeight:500}}>{item.title}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const MODULES=[
  {id:"habits",label:"Habits",icon:"◎",color:"#6060ff",active:true,desc:"Daily, weekly & monthly"},
  {id:"goals",label:"Goals",icon:"◈",color:"#a060ff",active:false,desc:"Objectives & milestones"},
  {id:"finance",label:"Finance",icon:"◇",color:"#f59e0b",active:false,desc:"Budget & spending"},
  {id:"journal",label:"Journal",icon:"▤",color:"#f472b6",active:false,desc:"Daily reflection"},
  {id:"health",label:"Health",icon:"♡",color:"#30d090",active:false,desc:"Workouts & wellness"},
];

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({onNavigate,habits,checked}){
  const time=useClock();
  const today=getToday();
  const hour=time.getHours();
  const hh=String(time.getHours()).padStart(2,"0");
  const mm=String(time.getMinutes()).padStart(2,"0");
  const ss=String(time.getSeconds()).padStart(2,"0");
  const [location,setLocation]=useState("—");
  const [showSettings,setShowSettings]=useState(false);
  const [allItems,setAllItems]=useState({});
  const [topHeadline,setTopHeadline]=useState("");
  const quote=useQuote(null,topHeadline);

  useEffect(()=>{
    navigator.geolocation?.getCurrentPosition(async pos=>{
      try{
        const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
        const d=await r.json();
        setLocation(d.address?.city||d.address?.town||d.address?.state||"Your City");
      }catch{setLocation("New York");}
    },()=>setLocation("New York"));
  },[]);

  const dailyHabits=habits.filter(h=>h.freq==="daily");
  const doneToday=dailyHabits.filter(h=>{const logs=checked[`${h.id}-logs`]||{};return logs[todayKey()];}).length;
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  return(
    <div style={{position:"relative",minHeight:"100vh",overflow:"hidden",fontFamily:T.sans}}>
      <SkyBackground hour={hour}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(8,8,16,.2) 0%,rgba(8,8,16,.05) 35%,rgba(8,8,16,.8) 68%,rgba(8,8,16,1) 100%)"}}/>
      <div style={{position:"relative",zIndex:10,display:"flex",flexDirection:"column",minHeight:"100vh"}}>

        {/* Top bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"22px 40px"}}>
          <span style={{fontFamily:T.mono,fontSize:12,color:"rgba(255,255,255,.3)",letterSpacing:"0.16em"}}>ChrisOS</span>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:12}}>📍</span>
              <span style={{fontFamily:T.mono,fontSize:12,color:"rgba(255,255,255,.35)",letterSpacing:"0.08em"}}>{location.toUpperCase()}</span>
            </div>
            <button onClick={()=>setShowSettings(true)} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",borderRadius:8,color:"rgba(255,255,255,.5)",cursor:"pointer",padding:"6px 12px",fontSize:13,fontFamily:T.mono,fontWeight:700,letterSpacing:"0.06em"}}>
              ⚙ Settings
            </button>
          </div>
        </div>

        {/* Hero */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 40px",textAlign:"center"}}>
          <p style={{margin:"0 0 10px",fontFamily:T.mono,fontSize:14,color:"rgba(255,255,255,.3)",letterSpacing:"0.18em",textTransform:"uppercase"}}>{greeting} · {DAYS_FULL[today.dayOfWeek]}</p>
          <div style={{fontFamily:T.sans,fontWeight:800,lineHeight:1,color:"#fff",letterSpacing:"-0.04em",fontSize:"clamp(72px,13vw,140px)"}}>
            {hh}<span style={{color:"rgba(255,255,255,.12)"}}>:</span>{mm}
            <span style={{fontSize:"clamp(32px,4.5vw,56px)",color:"rgba(255,255,255,.18)",fontWeight:400,marginLeft:6}}>:{ss}</span>
          </div>
          <p style={{margin:"14px 0 0",fontFamily:T.mono,fontSize:15,color:"rgba(255,255,255,.3)",letterSpacing:"0.14em"}}>{MONTHS[today.month].toUpperCase()} {today.date}, {today.year}</p>
          {quote&&(
            <div style={{marginTop:28,maxWidth:580,padding:"20px 30px",background:"rgba(255,255,255,.05)",backdropFilter:"blur(16px)",borderRadius:16,border:"1px solid rgba(255,255,255,.07)"}}>
              <p style={{margin:0,fontSize:18,color:"rgba(255,255,255,.82)",fontStyle:"italic",lineHeight:1.65,fontWeight:400}}>"{quote.text}"</p>
              {quote.author&&<p style={{margin:"10px 0 0",fontSize:13,color:"rgba(255,255,255,.32)",fontFamily:T.mono,letterSpacing:"0.06em"}}>— {quote.author}</p>}
            </div>
          )}
          {dailyHabits.length>0&&(
            <div style={{marginTop:18,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:120,height:5,background:"rgba(255,255,255,.1)",borderRadius:99,overflow:"hidden"}}>
                <div style={{width:`${pct(doneToday,dailyHabits.length)}%`,height:"100%",background:T.accent,borderRadius:99,transition:"width .5s"}}/>
              </div>
              <span style={{fontFamily:T.mono,fontSize:13,color:"rgba(255,255,255,.3)"}}>{doneToday}/{dailyHabits.length} daily habits</span>
            </div>
          )}
        </div>

        {/* Bottom grid */}
        <div style={{padding:"0 40px 40px",display:"grid",gridTemplateColumns:"1fr 420px",gap:28,maxWidth:1280,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>
          {/* Modules */}
          <div>
            <p style={{margin:"0 0 14px",fontFamily:T.mono,fontSize:11,color:"rgba(255,255,255,.22)",letterSpacing:"0.16em",textTransform:"uppercase"}}>Modules</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:10}}>
              {MODULES.map(m=>(
                <button key={m.id} onClick={()=>m.active&&onNavigate(m.id)} style={{
                  background:"rgba(12,12,30,.8)",backdropFilter:"blur(20px)",
                  border:`1px solid ${m.active?m.color+"33":"rgba(255,255,255,.05)"}`,
                  borderRadius:14,padding:"18px 20px",cursor:m.active?"pointer":"default",
                  textAlign:"left",transition:"all .2s",opacity:m.active?1:.38,
                }}
                  onMouseEnter={e=>m.active&&(e.currentTarget.style.background="rgba(18,18,42,.9)")}
                  onMouseLeave={e=>m.active&&(e.currentTarget.style.background="rgba(12,12,30,.8)")}
                >
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <span style={{fontSize:20,color:m.active?m.color:"rgba(255,255,255,.2)"}}>{m.icon}</span>
                    {!m.active&&<span style={{fontFamily:T.mono,fontSize:9,color:"rgba(255,255,255,.18)",letterSpacing:"0.1em"}}>SOON</span>}
                  </div>
                  <p style={{margin:0,fontSize:16,fontWeight:700,color:m.active?"rgba(255,255,255,.92)":"rgba(255,255,255,.22)"}}>{m.label}</p>
                  <p style={{margin:"4px 0 0",fontSize:13,color:"rgba(255,255,255,.28)"}}>{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
          {/* News */}
          <NewsPanel allItems={allItems} setAllItems={setAllItems} onTopHeadline={setTopHeadline}/>
        </div>
      </div>
      {showSettings&&<SettingsPanel onClose={()=>setShowSettings(false)}/>}
    </div>
  );
}

// ─── HABIT COMPONENTS ─────────────────────────────────────────────────────────
const DEFAULT_HABITS=[
  {id:1,name:"Morning workout",emoji:"🏋️",color:"#6060ff",freq:"daily",type:"quantifiable",unit:"minutes",goalValue:30},
  {id:2,name:"Read",emoji:"📖",color:"#30d090",freq:"daily",type:"quantifiable",unit:"pages",goalValue:20},
  {id:3,name:"Drink water",emoji:"💧",color:"#38bdf8",freq:"daily",type:"quantifiable",unit:"glasses",goalValue:8},
  {id:4,name:"Gym session",emoji:"💪",color:"#f472b6",freq:"weekly",type:"boolean",unit:"",goalValue:4},
  {id:5,name:"Call family",emoji:"📞",color:"#f59e0b",freq:"weekly",type:"boolean",unit:"",goalValue:2},
];

function HabitModal({habit,onSave,onClose,onDelete}){
  const [form,setForm]=useState(habit);
  const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  const isNew=!habit.id;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:T.panel,border:`1px solid ${T.border2}`,borderRadius:20,padding:32,width:"100%",maxWidth:480,fontFamily:T.sans}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
          <h3 style={{margin:0,fontSize:22,fontWeight:800,color:T.text}}>{isNew?"New Habit":"Edit Habit"}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.textSub,cursor:"pointer",fontSize:26,lineHeight:1}}>×</button>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:18}}>
          <input value={form.emoji||""} onChange={e=>upd("emoji",e.target.value)} maxLength={2} style={{width:58,height:50,background:T.bg,border:`1px solid ${T.border2}`,borderRadius:12,color:T.text,fontSize:26,textAlign:"center",outline:"none"}}/>
          <input value={form.name||""} onChange={e=>upd("name",e.target.value)} placeholder="Habit name" style={{flex:1,height:50,background:T.bg,border:`1px solid ${T.border2}`,borderRadius:12,color:T.text,fontSize:17,padding:"0 16px",outline:"none"}}/>
        </div>
        <div style={{marginBottom:18}}>
          <label style={{fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:10}}>Color</label>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{COLORS.map(c=><button key={c} onClick={()=>upd("color",c)} style={{width:30,height:30,borderRadius:"50%",background:c,border:`3px solid ${form.color===c?"#fff":"transparent"}`,cursor:"pointer"}}/>)}</div>
        </div>
        <div style={{marginBottom:18}}>
          <label style={{fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:10}}>Frequency</label>
          <div style={{display:"flex",gap:8}}>{["daily","weekly","monthly"].map(f=><button key={f} onClick={()=>upd("freq",f)} style={{flex:1,height:44,borderRadius:10,cursor:"pointer",fontFamily:T.mono,fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",border:form.freq===f?`2px solid ${T.accent}`:`1px solid ${T.border2}`,background:form.freq===f?T.accentBg:"transparent",color:form.freq===f?T.accent:T.textSub}}>{f}</button>)}</div>
        </div>
        <div style={{marginBottom:18}}>
          <label style={{fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:10}}>Tracking type</label>
          <div style={{display:"flex",gap:8}}>{[{v:"boolean",l:"Yes / No"},{v:"quantifiable",l:"Measure it"}].map(({v,l})=><button key={v} onClick={()=>upd("type",v)} style={{flex:1,height:44,borderRadius:10,cursor:"pointer",fontFamily:T.mono,fontSize:12,fontWeight:700,border:form.type===v?`2px solid ${T.accent}`:`1px solid ${T.border2}`,background:form.type===v?T.accentBg:"transparent",color:form.type===v?T.accent:T.textSub}}>{l}</button>)}</div>
        </div>
        {form.type==="quantifiable"&&(
          <div style={{display:"flex",gap:12,marginBottom:18}}>
            <div style={{flex:1}}>
              <label style={{fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:10}}>Unit</label>
              <input value={form.unit||""} onChange={e=>upd("unit",e.target.value)} placeholder="minutes, pages, glasses…" style={{width:"100%",height:46,background:T.bg,border:`1px solid ${T.border2}`,borderRadius:10,color:T.text,fontSize:15,padding:"0 14px",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{width:120}}>
              <label style={{fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:10}}>Goal</label>
              <input type="number" value={form.goalValue||""} onChange={e=>upd("goalValue",Number(e.target.value))} style={{width:"100%",height:46,background:T.bg,border:`1px solid ${T.border2}`,borderRadius:10,color:T.text,fontSize:17,fontWeight:700,padding:"0 14px",outline:"none",boxSizing:"border-box",textAlign:"center",fontFamily:T.mono}}/>
            </div>
          </div>
        )}
        {form.freq!=="daily"&&(
          <div style={{marginBottom:18}}>
            <label style={{fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:10}}>Target ({form.freq==="weekly"?"times/week":"times/month"})</label>
            <input type="number" value={form.goalValue||""} onChange={e=>upd("goalValue",Number(e.target.value))} style={{width:"100%",height:46,background:T.bg,border:`1px solid ${T.border2}`,borderRadius:10,color:T.text,fontSize:17,fontWeight:700,padding:"0 14px",outline:"none",boxSizing:"border-box",textAlign:"center",fontFamily:T.mono}}/>
          </div>
        )}
        <div style={{display:"flex",gap:10,marginTop:24}}>
          <button onClick={()=>onSave(form)} style={{flex:1,height:48,background:T.accent,border:"none",borderRadius:12,color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer"}}>{isNew?"Add Habit":"Save Changes"}</button>
          {!isNew&&<button onClick={()=>onDelete(form.id)} style={{height:48,padding:"0 18px",background:T.redBg,border:`1px solid ${T.red}44`,borderRadius:12,color:T.red,fontSize:15,cursor:"pointer",fontWeight:700}}>Delete</button>}
          <button onClick={onClose} style={{height:48,padding:"0 18px",background:"none",border:`1px solid ${T.border2}`,borderRadius:12,color:T.textSub,fontSize:15,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function LogModal({habit,dateStr,existing,onSave,onClose}){
  const [value,setValue]=useState(existing?.value??(habit.type==="boolean"?true:""));
  const [note,setNote]=useState(existing?.note??"");
  const d=new Date(dateStr+"T00:00:00");
  const label=`${MONTHS_S[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:T.panel,border:`1px solid ${T.border2}`,borderRadius:20,padding:32,width:"100%",maxWidth:400,fontFamily:T.sans}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <div>
            <p style={{margin:0,fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase"}}>Log entry</p>
            <h3 style={{margin:"6px 0 0",fontSize:20,fontWeight:800,color:T.text}}>{habit.emoji} {habit.name}</h3>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.textSub,cursor:"pointer",fontSize:26}}>×</button>
        </div>
        <p style={{margin:"0 0 22px",fontSize:14,color:T.textSub,fontFamily:T.mono}}>{label}</p>
        {habit.type==="boolean"?(
          <div style={{display:"flex",gap:12,marginBottom:22}}>
            {[{v:true,l:"✓  Done",c:T.green,bg:"rgba(48,208,144,.12)"},{v:false,l:"✗  Missed",c:T.red,bg:T.redBg}].map(({v,l,c,bg})=>(
              <button key={String(v)} onClick={()=>setValue(v)} style={{flex:1,height:54,borderRadius:12,cursor:"pointer",fontSize:17,fontWeight:800,border:value===v?`2px solid ${c}`:`1px solid ${T.border2}`,background:value===v?bg:"transparent",color:value===v?c:T.textSub}}>{l}</button>
            ))}
          </div>
        ):(
          <div style={{marginBottom:22}}>
            <label style={{fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:10}}>Actual {habit.unit} · goal: {habit.goalValue}</label>
            <input type="number" value={value} onChange={e=>setValue(Number(e.target.value))} placeholder={String(habit.goalValue)}
              style={{width:"100%",height:60,background:T.bg,border:`1px solid ${T.border2}`,borderRadius:12,color:T.text,fontSize:28,fontWeight:800,padding:"0 16px",outline:"none",boxSizing:"border-box",textAlign:"center",fontFamily:T.mono}}/>
            {Number(value)>0&&<p style={{margin:"10px 0 0",fontSize:15,textAlign:"center",fontWeight:700,color:Number(value)>=habit.goalValue?T.green:T.orange}}>{pct(Number(value),habit.goalValue)}% of goal{Number(value)>habit.goalValue?" 🎉":""}</p>}
          </div>
        )}
        <div style={{marginBottom:22}}>
          <label style={{fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:10}}>Note (optional)</label>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="How did it go?" style={{width:"100%",height:46,background:T.bg,border:`1px solid ${T.border2}`,borderRadius:10,color:T.text,fontSize:15,padding:"0 14px",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>onSave({value,note})} style={{flex:1,height:48,background:T.accent,border:"none",borderRadius:12,color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer"}}>Save</button>
          {existing&&<button onClick={()=>onSave(null)} style={{height:48,padding:"0 16px",background:T.redBg,border:`1px solid ${T.red}44`,borderRadius:12,color:T.red,fontSize:15,cursor:"pointer",fontWeight:700}}>Clear</button>}
          <button onClick={onClose} style={{height:48,padding:"0 16px",background:"none",border:`1px solid ${T.border2}`,borderRadius:12,color:T.textSub,fontSize:15,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function TrackerView({habits,checked,onLog,onEdit}){
  const today=getToday();
  const weekKeys=(()=>{const d=new Date();const mon=new Date(d);mon.setDate(d.getDate()-((d.getDay()+6)%7));return DAYS_SHORT.map((_,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);return dateKey(x.getFullYear(),x.getMonth(),x.getDate());});})();
  const weekDates=(()=>{const d=new Date();const mon=new Date(d);mon.setDate(d.getDate()-((d.getDay()+6)%7));return DAYS_SHORT.map((_,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);return x.getDate();});})();
  return(
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {[{freq:"daily",label:"Daily",color:"#6060ff"},{freq:"weekly",label:"Weekly",color:"#30d090"},{freq:"monthly",label:"Monthly",color:"#f59e0b"}].map(({freq,label,color})=>{
        const group=habits.filter(h=>h.freq===freq);if(!group.length)return null;
        return(
          <div key={freq}>
            <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0 12px"}}>
              <span style={{fontFamily:T.mono,fontSize:12,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color,flexShrink:0}}>{label}</span>
              <div style={{flex:1,height:1,background:T.border}}/>
            </div>
            {freq==="daily"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr repeat(7,44px)",gap:6,marginBottom:10,paddingLeft:4}}>
                <div/>{DAYS_SHORT.map((d,i)=>{const isT=i===today.dayOfWeek;return(<div key={d} style={{textAlign:"center"}}><div style={{fontFamily:T.mono,fontSize:11,color:isT?T.accent:T.textDim,textTransform:"uppercase",fontWeight:700}}>{d}</div><div style={{width:28,height:28,borderRadius:"50%",margin:"4px auto 0",background:isT?T.accent:"transparent",color:isT?"#fff":T.textSub,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.mono,fontSize:13,fontWeight:isT?800:500}}>{weekDates[i]}</div></div>);})}
              </div>
            )}
            {group.map(h=>{
              const logs=checked[`${h.id}-logs`]||{};
              if(freq==="daily"){
                return(<div key={h.id} style={{display:"grid",gridTemplateColumns:"1fr repeat(7,44px)",gap:6,alignItems:"center",background:T.panel,borderRadius:14,padding:"14px 16px",border:`1px solid ${T.border}`,marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
                    <span style={{width:40,height:40,borderRadius:10,background:h.color+"22",border:`1px solid ${h.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{h.emoji}</span>
                    <div style={{minWidth:0}}>
                      <p style={{margin:0,fontSize:16,fontWeight:700,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.name}</p>
                      <p style={{margin:0,fontFamily:T.mono,fontSize:12,color:T.textSub}}>{h.type==="quantifiable"?`goal: ${h.goalValue} ${h.unit}`:"yes / no"}</p>
                    </div>
                    <button onClick={()=>onEdit(h)} style={{marginLeft:"auto",background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:16,padding:"0 4px",flexShrink:0}}>✎</button>
                  </div>
                  {weekKeys.map((k,i)=>{const log=logs[k];const achv=log?(h.type==="boolean"?log.value===true:Number(log.value)>=h.goalValue):false;const isT=i===today.dayOfWeek;return(<button key={k} onClick={()=>onLog(h,k)} style={{width:40,height:40,borderRadius:10,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .15s",border:log?(achv?`2px solid ${h.color}`:`2px solid ${T.red}`):(isT?`2px solid ${T.border2}`:`2px solid ${T.border}`),background:log?(achv?h.color:T.redBg):(isT?T.panel2:"transparent")}}>{log&&(achv?<svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>:<span style={{fontSize:18,fontWeight:800,color:T.red,lineHeight:1}}>✗</span>)}</button>);})}
                </div>);
              }
              const logCount=Object.values(logs).filter(Boolean).length;
              return(<div key={h.id} style={{display:"flex",alignItems:"center",gap:14,background:T.panel,borderRadius:14,padding:"14px 18px",border:`1px solid ${T.border}`,marginBottom:8}}>
                <span style={{width:40,height:40,borderRadius:10,background:h.color+"22",border:`1px solid ${h.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{h.emoji}</span>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:"0 0 6px",fontSize:16,fontWeight:700,color:T.text}}>{h.name}</p>
                  <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1,height:5,background:T.border,borderRadius:99,overflow:"hidden"}}><div style={{width:`${Math.min(pct(logCount,h.goalValue),100)}%`,height:"100%",background:h.color,borderRadius:99,transition:"width .3s"}}/></div><span style={{fontFamily:T.mono,fontSize:13,color:T.textSub,flexShrink:0,fontWeight:600}}>{logCount}/{h.goalValue}</span></div>
                </div>
                <button onClick={()=>onLog(h,todayKey())} style={{height:38,padding:"0 16px",background:T.accentBg,border:`1px solid ${T.accent}44`,borderRadius:10,color:T.accent,cursor:"pointer",fontSize:14,fontFamily:T.mono,fontWeight:700}}>+ Log</button>
                <button onClick={()=>onEdit(h)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:16}}>✎</button>
              </div>);
            })}
          </div>
        );
      })}
    </div>
  );
}

function CalendarView({habits,checked,onLog}){
  const [cy,setCy]=useState(getToday().year);const [cm,setCm]=useState(getToday().month);const [sel,setSel]=useState(null);
  const today=getToday();const dim=getDaysInMonth(cy,cm);const first=getFirstDayOfMonth(cy,cm);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <button onClick={()=>{if(cm===0){setCm(11);setCy(y=>y-1);}else setCm(m=>m-1);}} style={{background:"none",border:`1px solid ${T.border2}`,borderRadius:10,color:T.textSub,cursor:"pointer",width:40,height:40,fontSize:20}}>‹</button>
        <span style={{fontFamily:T.mono,fontSize:16,fontWeight:700,color:T.text,flex:1,textAlign:"center",letterSpacing:"0.06em"}}>{MONTHS[cm].toUpperCase()} {cy}</span>
        <button onClick={()=>{if(cm===11){setCm(0);setCy(y=>y+1);}else setCm(m=>m+1);}} style={{background:"none",border:`1px solid ${T.border2}`,borderRadius:10,color:T.textSub,cursor:"pointer",width:40,height:40,fontSize:20}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>{DAYS_SHORT.map(d=><div key={d} style={{textAlign:"center",fontFamily:T.mono,fontSize:12,color:T.textSub,padding:"6px 0",letterSpacing:"0.06em"}}>{d}</div>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>
        {Array.from({length:first}).map((_,i)=><div key={`e-${i}`}/>)}
        {Array.from({length:dim},(_,i)=>{
          const day=i+1,key=dateKey(cy,cm,day);const isToday=cy===today.year&&cm===today.month&&day===today.date;const isFuture=new Date(cy,cm,day)>new Date();const isSel=sel===key;
          const logs=habits.map(h=>(checked[`${h.id}-logs`]||{})[key]);
          const achv=logs.filter((l,i)=>l&&(habits[i].type==="boolean"?l.value===true:Number(l.value)>=habits[i].goalValue)).length;
          const hasAny=logs.filter(Boolean).length>0;const fillPct=habits.length>0?achv/habits.length:0;
          return(<button key={day} onClick={()=>!isFuture&&setSel(isSel?null:key)} style={{height:64,borderRadius:12,cursor:isFuture?"default":"pointer",opacity:isFuture?.3:1,border:isSel?`2px solid ${T.accent}`:isToday?`2px solid ${T.border2}`:`1px solid ${T.border}`,background:isSel?T.accentBg:isToday?T.panel2:T.panel,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,position:"relative",overflow:"hidden"}}>
            {hasAny&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:`${fillPct*100}%`,maxHeight:"45%",background:T.accent+"18"}}/>}
            <span style={{fontFamily:T.mono,fontSize:15,fontWeight:isToday?800:500,color:isToday?T.accent:T.text,position:"relative"}}>{day}</span>
            {hasAny&&<span style={{fontFamily:T.mono,fontSize:11,color:T.textSub,position:"relative"}}>{achv}/{habits.length}</span>}
          </button>);
        })}
      </div>
      {sel&&(
        <div style={{background:T.panel2,borderRadius:14,padding:20,border:`1px solid ${T.border}`}}>
          <p style={{margin:"0 0 14px",fontFamily:T.mono,fontSize:12,color:T.textSub,letterSpacing:"0.08em",textTransform:"uppercase"}}>{new Date(sel+"T00:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {habits.map(h=>{const log=(checked[`${h.id}-logs`]||{})[sel];const achv=log?(h.type==="boolean"?log.value===true:Number(log.value)>=h.goalValue):false;return(<div key={h.id} style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:20}}>{h.emoji}</span><span style={{flex:1,fontSize:16,color:T.text,fontWeight:500}}>{h.name}</span>{log?<span style={{fontFamily:T.mono,fontSize:14,fontWeight:700,color:achv?T.green:T.red}}>{h.type==="boolean"?(log.value?"✓ Done":"✗ Missed"):`${log.value} ${h.unit} (${pct(Number(log.value),h.goalValue)}%)`}</span>:<span style={{fontFamily:T.mono,fontSize:13,color:T.textDim}}>—</span>}<button onClick={()=>onLog(h,sel)} style={{height:34,padding:"0 14px",background:T.accentBg,border:`1px solid ${T.accent}44`,borderRadius:8,color:T.accent,cursor:"pointer",fontSize:13,fontFamily:T.mono,fontWeight:700}}>{log?"edit":"log"}</button></div>);})}
          </div>
        </div>
      )}
    </div>
  );
}

function StatsView({habits,checked}){
  const [selId,setSelId]=useState(habits[0]?.id);const [win,setWin]=useState(30);
  const habit=habits.find(h=>h.id===selId);
  if(!habit)return<div style={{color:T.textSub,padding:40,textAlign:"center",fontSize:17}}>Add habits to see stats.</div>;
  const today=new Date();
  const days=Array.from({length:win},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()-(win-1-i));const key=dateKey(d.getFullYear(),d.getMonth(),d.getDate());const log=(checked[`${habit.id}-logs`]||{})[key];const achieved=log?(habit.type==="boolean"?log.value===true:Number(log.value)>=habit.goalValue):false;return{key,date:d.getDate(),month:d.getMonth(),label:`${MONTHS_S[d.getMonth()]} ${d.getDate()}`,logged:log!=null,value:log?.value??null,achieved,pctGoal:habit.type==="quantifiable"&&log?pct(Number(log.value),habit.goalValue):(log?.value===true?100:0)};});
  const logged=days.filter(d=>d.logged),achieved=days.filter(d=>d.achieved);
  const avgPct=logged.length>0?Math.round(logged.reduce((a,d)=>a+d.pctGoal,0)/logged.length):0;
  const streak=(()=>{let s=0;for(let i=days.length-1;i>=0;i--){if(days[i].achieved)s++;else break;}return s;})();
  const best=(()=>{let s=0,c=0;days.forEach(d=>{if(d.achieved){c++;s=Math.max(s,c);}else c=0;});return s;})();
  const analysis=[];
  if(!logged.length){analysis.push("No data yet. Start logging to see your analysis.");}
  else{const lr=pct(logged.length,days.length);analysis.push(lr>=80?`Strong consistency — ${lr}% of days logged in the last ${win} days.`:lr>=50?`Moderate tracking at ${lr}%. Gaps in the log obscure real patterns.`:`Only ${lr}% of days logged. Fill in past days for an accurate picture.`);if(achieved.length){const ar=pct(achieved.length,logged.length);analysis.push(ar>=80?`Excellent — hitting the goal ${ar}% of logged days.`:ar>=50?`Hitting the goal ${ar}% of logged days. Room to push further.`:`Goal hit rate is ${ar}%. Consider if the target needs adjusting.`);}if(streak>=3)analysis.push(`${streak}-day streak active. Don't break the chain.`);if(best>streak&&best>=5)analysis.push(`Your longest streak was ${best} days — that's your benchmark.`);if(habit.type==="quantifiable"&&avgPct>0)analysis.push(avgPct>120?`Averaging ${avgPct}% of your goal — you've outgrown this target. Raise it.`:avgPct>=90?`Averaging ${avgPct}% of goal — right in the zone.`:`Averaging ${avgPct}% of goal. Small increases compound fast.`);}
  return(
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{habits.map(h=><button key={h.id} onClick={()=>setSelId(h.id)} style={{padding:"8px 18px",borderRadius:24,cursor:"pointer",fontSize:15,fontWeight:700,border:selId===h.id?`2px solid ${h.color}`:`1px solid ${T.border2}`,background:selId===h.id?h.color+"18":"transparent",color:selId===h.id?h.color:T.textSub}}>{h.emoji} {h.name}</button>)}</div>
      <div style={{display:"flex",gap:8}}>{[7,30,90,"All"].map(w=>{const val=w==="All"?365:w;return<button key={w} onClick={()=>setWin(val)} style={{padding:"6px 16px",borderRadius:24,cursor:"pointer",fontFamily:T.mono,fontSize:12,fontWeight:700,border:win===val?`2px solid ${T.accent}`:`1px solid ${T.border2}`,background:win===val?T.accentBg:"transparent",color:win===val?T.accent:T.textSub}}>{w==="All"?"ALL TIME":`${w}D`}</button>;})}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[{label:"Log Rate",value:`${pct(logged.length,days.length)}%`,sub:`${logged.length}/${days.length} days`,color:T.accent},{label:"Goal Hit",value:`${pct(achieved.length,logged.length||1)}%`,sub:`${achieved.length} achieved`,color:T.green},{label:"Avg % Goal",value:`${avgPct}%`,sub:"over logged days",color:T.orange},{label:"Streak",value:`${streak}d`,sub:`best: ${best}d`,color:T.accentHi}].map(({label,value,sub,color})=>(
          <div key={label} style={{background:T.panel2,borderRadius:14,padding:"20px 18px",border:`1px solid ${T.border}`}}>
            <p style={{margin:"0 0 10px",fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase"}}>{label}</p>
            <p style={{margin:0,fontFamily:T.mono,fontSize:34,fontWeight:700,color,lineHeight:1}}>{value}</p>
            <p style={{margin:"6px 0 0",fontSize:13,color:T.textSub,fontWeight:500}}>{sub}</p>
          </div>
        ))}
      </div>
      {logged.length>0&&(
        <div style={{background:T.panel2,borderRadius:16,padding:24,border:`1px solid ${T.border}`}}>
          <p style={{margin:"0 0 18px",fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase"}}>{habit.type==="quantifiable"?`${habit.unit} vs goal`:"goal achievement %"} · {win===365?"all time":`last ${win} days`}</p>
          <div style={{display:"flex",gap:3,alignItems:"flex-end",height:100,overflowX:"auto",paddingBottom:4}}>
            {days.map(d=>{const h=d.logged?Math.max(6,(d.pctGoal/100)*90):0;return<div key={d.key} title={`${d.label}: ${d.logged?(d.achieved?`✓ ${d.pctGoal}%`:"✗"):"—"}`} style={{flex:1,minWidth:8,maxWidth:22,height:`${h}px`,background:!d.logged?T.textDim:d.achieved?habit.color:T.red,borderRadius:"3px 3px 0 0",transition:"height .3s"}}/>;})}</div>
          <div style={{display:"flex",gap:16,marginTop:12}}>{[{c:habit.color,l:"Goal met"},{c:T.red,l:"Missed"},{c:T.textDim,l:"Not logged"}].map(({c,l})=><div key={l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:2,background:c}}/><span style={{fontFamily:T.mono,fontSize:11,color:T.textSub}}>{l}</span></div>)}</div>
        </div>
      )}
      <div style={{background:T.panel2,borderRadius:16,padding:24,border:`1px solid ${T.border}`}}>
        <p style={{margin:"0 0 16px",fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase"}}>Heatmap</p>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{days.map(d=><div key={d.key} title={`${d.label}`} style={{width:16,height:16,borderRadius:4,background:!d.logged?T.textDim:d.achieved?habit.color:T.red,opacity:!d.logged?.25:1}}/>)}</div>
        <div style={{display:"flex",gap:16,marginTop:12}}>{[{c:habit.color,l:"Achieved"},{c:T.red,l:"Missed"},{c:T.textDim,l:"Not logged"}].map(({c,l})=><div key={l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:12,height:12,borderRadius:3,background:c}}/><span style={{fontFamily:T.mono,fontSize:11,color:T.textSub}}>{l}</span></div>)}</div>
      </div>
      <div style={{background:T.panel2,borderRadius:16,padding:24,border:`1px solid ${T.border}`}}>
        <p style={{margin:"0 0 16px",fontFamily:T.mono,fontSize:11,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase"}}>Analysis</p>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>{analysis.map((line,i)=><div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}><div style={{width:8,height:8,borderRadius:"50%",background:habit.color,marginTop:6,flexShrink:0}}/><p style={{margin:0,fontSize:16,color:T.text,lineHeight:1.65}}>{line}</p></div>)}</div>
      </div>
    </div>
  );
}

function HabitsModule(){
  const [habits,setHabits]=useLocalStorage("dash-habits-v3",DEFAULT_HABITS);
  const [checked,setChecked]=useLocalStorage("dash-checked-v3",{});
  const [view,setView]=useState("tracker");const [editing,setEditing]=useState(null);const [logTarget,setLogTarget]=useState(null);
  const saveHabit=form=>{if(!form.id)setHabits(p=>[...p,{...form,id:Date.now()}]);else setHabits(p=>p.map(h=>h.id===form.id?form:h));setEditing(null);};
  const deleteHabit=id=>{setHabits(p=>p.filter(h=>h.id!==id));setEditing(null);};
  const saveLog=(habitId,dateStr,data)=>{setChecked(prev=>{const key=`${habitId}-logs`;const ex=prev[key]||{};if(data===null){const u={...ex};delete u[dateStr];return{...prev,[key]:u};}return{...prev,[key]:{...ex,[dateStr]:data}};});setLogTarget(null);};
  return(
    <div style={{fontFamily:T.sans}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
        <div><p style={{margin:0,fontFamily:T.mono,fontSize:12,letterSpacing:"0.14em",textTransform:"uppercase",color:T.textSub}}>Module</p><h2 style={{margin:"4px 0 0",fontSize:28,fontWeight:800,color:T.text,letterSpacing:"-0.02em"}}>Habits</h2></div>
        <button onClick={()=>setEditing({name:"",emoji:"✅",color:COLORS[0],freq:"daily",type:"boolean",unit:"",goalValue:1})} style={{height:46,padding:"0 22px",background:T.accent,border:"none",borderRadius:12,color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer"}}>+ Add Habit</button>
      </div>
      <div style={{display:"flex",gap:2,borderBottom:`1px solid ${T.border}`,marginBottom:24}}>
        {[{k:"tracker",l:"Tracker"},{k:"calendar",l:"Calendar"},{k:"stats",l:"Stats"}].map(({k,l})=>(
          <button key={k} onClick={()=>setView(k)} style={{padding:"10px 22px",background:"none",border:"none",cursor:"pointer",fontFamily:T.mono,fontSize:13,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:view===k?T.text:T.textSub,borderBottom:view===k?`2px solid ${T.accent}`:"2px solid transparent",marginBottom:-1,transition:"all .15s"}}>{l}</button>
        ))}
      </div>
      {view==="tracker"&&<TrackerView habits={habits} checked={checked} onLog={(h,d)=>setLogTarget({habit:h,dateStr:d})} onEdit={setEditing}/>}
      {view==="calendar"&&<CalendarView habits={habits} checked={checked} onLog={(h,d)=>setLogTarget({habit:h,dateStr:d})}/>}
      {view==="stats"&&<StatsView habits={habits} checked={checked}/>}
      {editing&&<HabitModal habit={editing} onSave={saveHabit} onClose={()=>setEditing(null)} onDelete={deleteHabit}/>}
      {logTarget&&<LogModal habit={logTarget.habit} dateStr={logTarget.dateStr} existing={(checked[`${logTarget.habit.id}-logs`]||{})[logTarget.dateStr]} onSave={d=>saveLog(logTarget.habit.id,logTarget.dateStr,d)} onClose={()=>setLogTarget(null)}/>}
    </div>
  );
}

function ComingSoon({label,icon}){return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:400,gap:16,border:`2px dashed ${T.border2}`,borderRadius:20}}><span style={{fontSize:52,opacity:.2}}>{icon}</span><p style={{margin:0,fontFamily:T.mono,fontSize:12,color:T.textSub,letterSpacing:"0.1em",textTransform:"uppercase"}}>Coming soon</p><p style={{margin:0,fontSize:16,color:T.textDim}}>{label} is up next.</p></div>;}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useLocalStorage("dash-page-v2","home");
  const [habits]=useLocalStorage("dash-habits-v3",DEFAULT_HABITS);
  const [checked]=useLocalStorage("dash-checked-v3",{});

  const render=()=>{
    switch(page){
      case "home":    return <HomePage onNavigate={setPage} habits={habits} checked={checked}/>;
      case "habits":  return <HabitsModule/>;
      case "goals":   return <ComingSoon label="Goals" icon="◈"/>;
      case "finance": return <ComingSoon label="Finance" icon="◇"/>;
      case "journal": return <ComingSoon label="Journal" icon="▤"/>;
      case "health":  return <ComingSoon label="Health" icon="♡"/>;
      default:        return <HomePage onNavigate={setPage} habits={habits} checked={checked}/>;
    }
  };

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:T.sans}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#1e1e3a;border-radius:99px;}
        input::placeholder{color:#2a2a50;}
        input[type=number]{-moz-appearance:textfield;}
        input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        @keyframes pulse{0%,100%{opacity:.3;transform:scale(.85)}50%{opacity:1;transform:scale(1)}}
      `}</style>
      {page!=="home"&&(
        <div style={{background:T.panel,borderBottom:`1px solid ${T.border}`,padding:"0 36px",display:"flex",alignItems:"center",gap:4,height:58,position:"sticky",top:0,zIndex:100}}>
          <button onClick={()=>setPage("home")} style={{background:"none",border:"none",color:T.textSub,cursor:"pointer",fontFamily:T.mono,fontSize:13,letterSpacing:"0.08em",padding:"8px 12px",borderRadius:8,fontWeight:700}}>← Home</button>
          <div style={{flex:1}}/>
          {MODULES.map(m=><button key={m.id} onClick={()=>setPage(m.id)} style={{background:page===m.id?T.accentBg:"none",border:"none",cursor:"pointer",padding:"8px 16px",borderRadius:8,fontFamily:T.mono,fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:page===m.id?T.accent:T.textSub}}>{m.label}</button>)}
        </div>
      )}
      {page!=="home"?<div style={{maxWidth:960,margin:"0 auto",padding:"36px 28px"}}>{render()}</div>:render()}
    </div>
  );
}
