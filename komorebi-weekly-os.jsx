import { useState, useEffect } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=Space+Mono:wght@400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:2px;}
::-webkit-scrollbar-track{background:#080806;}
::-webkit-scrollbar-thumb{background:#252520;}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.25;}}
.fu{animation:fadeUp 0.3s ease forwards;}
.blink{animation:pulse 2s ease-in-out infinite;}
`;

const C = {
  bg:'#080806', s1:'#0d0d0a', s2:'#111110', s3:'#161613', s4:'#1a1a17',
  border:'#1e1e1a', borderMid:'#282824', text:'#e4e0d4',
  muted:'#888480', dim:'#444440', xdim:'#272723',
  gold:'#c8a455', goldS:'#a07c35', goldF:'rgba(200,164,85,0.09)',
  ember:'#b06030', emberF:'rgba(176,96,48,0.09)',
  sage:'#5a7858', sageF:'rgba(90,120,88,0.09)',
  water:'#4a7a9b', waterF:'rgba(74,122,155,0.09)',
  violet:'#7a5a9b', violetF:'rgba(122,90,155,0.09)',
  pearl:'#9a8870', pearlF:'rgba(154,136,112,0.09)',
};
const sf = "'Cormorant Garamond', serif";
const mn = "'Space Mono', monospace";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const DAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

const DAILY_ROI = [
  {
    id:'tm',
    label:'20 min TM',
    detail:'Transcendental Meditation. Mantra: So Hum. Eyes closed, effortless. Non-negotiable.',
    time:'05:15',
    color:C.gold,
  },
  {
    id:'9091',
    label:'90/90/1',
    detail:'First 90 minutes of the work day on your single most important project. For 90 consecutive days. No email. No meetings. Pure craft.',
    time:'08:00',
    color:C.ember,
  },
  {
    id:'6010',
    label:'60/10 blocks',
    detail:'Work 60 minutes in complete focus, then 10 minutes of full recovery. Movement, breath, away from screens. Repeat through the day.',
    time:'all day',
    color:C.sage,
  },
  {
    id:'student',
    label:'60 min student',
    detail:'Reading, research, annual reports, philosophy. Protect this window — it compounds invisibly. No podcasts, no summaries. Primary sources.',
    time:'variable',
    color:C.water,
  },
  {
    id:'family',
    label:'60 min family',
    detail:'No iPhone. No TV. No distractions. Fully present — Hector and Bella only get one version of their father. This is the most important meeting of the day.',
    time:'18:00',
    color:C.pearl,
  },
  {
    id:'joy',
    label:'Joy as GPS',
    detail:'Check in twice a day: does this bring me energy or drain it? If it drains — eliminate, delegate, or compress it. Follow the aliveness signal.',
    time:'check-in',
    color:C.violet,
  },
];

const WEEKLY_ANCHORS = [
  {
    id:'massage',
    label:'Massage + Float',
    days:[5], // Saturday
    color:C.gold,
    detail:'90 min deep tissue or Thai + 60 min float. Cortisol reset. Nervous system recovery. Not optional when stress is high.',
  },
  {
    id:'wds',
    label:'Weekly Design Session',
    days:[6], // Sunday
    color:C.ember,
    detail:'Sunday evening. Set 90/90/1 target for the week. Design each day intentionally. Review last week\'s Joy GPS readings.',
  },
  {
    id:'create',
    label:'Create phase',
    days:[0,1], // Mon/Tue
    color:C.sage,
    detail:'Monday and Tuesday are creation days. Original thinking, writing, building. Protect from meetings and admin.',
  },
  {
    id:'execute',
    label:'Execute phase',
    days:[2,3], // Wed/Thu
    color:C.water,
    detail:'Wednesday and Thursday are execution days. Move existing work forward. Meetings, calls, deliverables.',
  },
  {
    id:'review',
    label:'Rest + Review phase',
    days:[4,5], // Fri/Sat
    color:C.violet,
    detail:'Friday: review the week, close loops, write. Saturday: physical recovery, massage, float, family.',
  },
  {
    id:'recover',
    label:'Recover + Renew',
    days:[6], // Sunday
    color:C.pearl,
    detail:'Sunday: nature, family, no screens before noon, weekly design session in the evening. Recharge the creative engine.',
  },
];

const G2G = [
  {
    id:'l5',
    label:'Level 5 Leadership',
    sub:'First Who, Then What',
    color:C.gold,
    body:'The highest level of leader combines fierce professional will with personal humility. Get the right people on the bus before deciding where to drive. Character over competence, always.',
    apply:'Who is on your bus right now? Is anyone holding back the vehicle?',
  },
  {
    id:'hog',
    label:'Hedgehog Concept',
    sub:'The three circles',
    color:C.ember,
    body:'The intersection of: what you are deeply passionate about · what you can be the best in the world at · what drives your economic engine. Foxes chase many things. Hedgehogs know one big thing deeply.',
    apply:'Yours: Operator-investor in travel, real assets, and capital allocation. OSP lives in the centre.',
  },
  {
    id:'fly',
    label:'The Flywheel',
    sub:'No single defining action',
    color:C.sage,
    body:'There is no single defining action, no grand programme, no one killer innovation. Just consistent pushing. Turn after turn, the flywheel builds momentum — then a breakthrough. Each turn makes the next easier.',
    apply:'Your flywheel: Advisory cash → Capital compounds → Ventures experiment → Reputation builds → Better advisory clients.',
  },
  {
    id:'20m',
    label:'20 Mile March',
    sub:'Consistency over heroism',
    color:C.water,
    body:'In good times and bad, advance the same 20 miles. Not 40 miles on good days. Not zero on bad days. The discipline of consistency beats the chaos of intensity. The march is the method.',
    apply:'Your march: 90/90/1 daily. One memo per week. One new contact per week. Every week.',
  },
  {
    id:'bullet',
    label:'Fire Bullets, Then Cannonballs',
    sub:'Calibrate before committing',
    color:C.violet,
    body:'Fire small, low-cost, low-risk bullets to test what works. Once you have empirical validation, concentrate fire — fire the cannonball. Never fire an uncalibrated cannonball with limited resources.',
    apply:'OSP is a bullet. Veraxus is a bullet. When one lands, concentrate. That becomes the cannonball.',
  },
  {
    id:'para',
    label:'Productive Paranoia',
    sub:'Prepare for uncertainty',
    color:C.pearl,
    body:'Ask: what could go wrong, even when things are going well? Build cash reserves and buffers disproportionate to the apparent risk. The 10x threat can come at any time. The prepared survive it.',
    apply:'Advisory cash buffer = 6 months. Capital in quality businesses. No single dependency.',
  },
  {
    id:'clock',
    label:'Clock Building, Not Time Telling',
    sub:'Build the machine',
    color:C.gold,
    body:'Don\'t be the genius who gives the right answer. Build an institution that consistently produces right answers without you. The goal is not your own greatness — it is something that outlasts you.',
    apply:'Komorebi is the clock. Not Lee Kelsall the advisor. The holdco outlasts the individual.',
  },
  {
    id:'core',
    label:'Preserve the Core / Stimulate Progress',
    sub:'Yin and yang of endurance',
    color:C.ember,
    body:'Core values and purpose never change. Practices, strategies, and structures must be willing to change with the world. The tension between these two forces is what keeps great companies great.',
    apply:'Your core: integrity, discipline, family, freedom. Everything else — method, product, market — is strategy.',
  },
  {
    id:'brutal',
    label:'Confront the Brutal Facts',
    sub:'The Stockdale Paradox',
    color:C.sage,
    body:'Retain unwavering faith that you will prevail in the end — while simultaneously confronting the most brutal facts of your current reality. Never confuse the two.',
    apply:'You will build something significant. Right now: cash is tight, focus is scattered. Both are true.',
  },
  {
    id:'10x',
    label:'10x Multiplier',
    sub:'Genius of the AND',
    color:C.water,
    body:'Reject the tyranny of the OR. Pursue both purpose AND profit. Both stability AND growth. Both discipline AND creativity. The AND is the multiplier. The OR is the limitation.',
    apply:'Advisory AND capital AND ventures. Not one or another — the three arms compound each other.',
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const todayKey = () => new Date().toISOString().slice(0,10);
const weekStart = () => {
  const d = new Date(); const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0,10);
};
const storeKey = (id) => `roi-${id}-${weekStart()}`;
const isDone = (id) => !!localStorage.getItem(storeKey(id));
const markDone = (id) => localStorage.setItem(storeKey(id), '1');
const getTodayDow = () => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; };

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Pill({ label, color }) {
  return (
    <span style={{
      fontFamily:mn, fontSize:7, letterSpacing:'0.15em',
      padding:'2px 8px', border:`1px solid ${color}44`,
      background:`${color}0d`, color,
    }}>{label}</span>
  );
}

function DailyRoiCard({ item, open, onToggle }) {
  return (
    <div style={{ borderBottom:`1px solid ${C.border}` }}>
      <button onClick={onToggle} style={{
        width:'100%', background:'none', border:'none', cursor:'pointer',
        padding:'13px 0',
        display:'flex', alignItems:'center', gap:14, textAlign:'left',
      }}>
        <div style={{
          width:4, height:32, background:open ? item.color : C.xdim,
          flexShrink:0, transition:'background 0.2s',
        }}/>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:3 }}>
            <span style={{ fontFamily:sf, fontSize:16, fontWeight:500, color: open ? C.text : C.muted, letterSpacing:'0.03em' }}>
              {item.label}
            </span>
            <Pill label={item.time} color={item.color} />
          </div>
        </div>
        <span style={{ fontFamily:mn, fontSize:8, color:C.dim, flexShrink:0 }}>{open?'▲':'▼'}</span>
      </button>
      {open && (
        <div className="fu" style={{ paddingLeft:18, paddingBottom:16, paddingRight:4 }}>
          <p style={{ fontFamily:sf, fontSize:15, fontStyle:'italic', color:C.muted, lineHeight:1.7, fontWeight:300 }}>
            {item.detail}
          </p>
        </div>
      )}
    </div>
  );
}

function WeekStrip({ anchor }) {
  const todayDow = getTodayDow();
  const [done, setDone] = useState(() => isDone(anchor.id));
  return (
    <div style={{
      border:`1px solid ${done ? anchor.color+'33' : C.border}`,
      background: done ? `${anchor.color}06` : C.s1,
      padding:'14px 16px',
      transition:'all 0.2s',
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <div style={{
              width:7, height:7, borderRadius:'50%',
              background: done ? anchor.color : C.dim,
              transition:'background 0.3s',
            }}/>
            <span style={{ fontFamily:sf, fontSize:15, fontWeight:500, color: done ? C.text : C.muted, letterSpacing:'0.03em' }}>
              {anchor.label}
            </span>
          </div>
          {/* day dots */}
          <div style={{ display:'flex', gap:5, marginBottom:8 }}>
            {DAYS.map((d,i) => {
              const active = anchor.days.includes(i);
              const isToday = i === todayDow;
              return (
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                  <div style={{
                    width:22, height:22,
                    border:`1px solid ${active ? anchor.color+'55' : C.border}`,
                    background: active ? `${anchor.color}15` : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    outline: isToday ? `1px solid ${anchor.color}88` : 'none',
                    outlineOffset:1,
                  }}>
                    {active && <div style={{ width:5, height:5, borderRadius:'50%', background:anchor.color }}/>}
                  </div>
                  <span style={{ fontFamily:mn, fontSize:6, color: isToday ? anchor.color : C.xdim, letterSpacing:'0.05em' }}>
                    {d}
                  </span>
                </div>
              );
            })}
          </div>
          <p style={{ fontFamily:sf, fontSize:13, fontStyle:'italic', color:C.dim, lineHeight:1.6, fontWeight:300 }}>
            {anchor.detail}
          </p>
        </div>
        <button onClick={() => { markDone(anchor.id); setDone(true); }} style={{
          background: done ? `${anchor.color}15` : 'transparent',
          border:`1px solid ${done ? anchor.color+'55' : C.borderMid}`,
          color: done ? anchor.color : C.dim,
          fontFamily:mn, fontSize:7, letterSpacing:'0.15em',
          padding:'6px 10px', cursor: done ? 'default' : 'pointer',
          flexShrink:0, whiteSpace:'nowrap',
          transition:'all 0.25s',
        }}>
          {done ? '✓ DONE' : 'MARK'}
        </button>
      </div>
    </div>
  );
}

function G2GCard({ item, open, onToggle }) {
  return (
    <div style={{
      border:`1px solid ${open ? item.color+'44' : C.border}`,
      background: open ? C.s2 : C.s1,
      transition:'all 0.2s',
    }}>
      <button onClick={onToggle} style={{
        width:'100%', background:'none', border:'none', cursor:'pointer',
        padding:'16px 18px',
        display:'flex', alignItems:'center', gap:14, textAlign:'left',
      }}>
        <div style={{
          width:36, height:36, flexShrink:0,
          border:`1px solid ${item.color}33`,
          background: open ? `${item.color}15` : C.s3,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:sf, fontSize:16, color:item.color,
          transition:'all 0.2s',
        }}>
          ◈
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:sf, fontSize:16, fontWeight:500, color: open ? C.text : C.muted, letterSpacing:'0.04em', marginBottom:2 }}>
            {item.label}
          </div>
          <div style={{ fontFamily:mn, fontSize:8, color:item.color, opacity:0.7, letterSpacing:'0.12em' }}>
            {item.sub}
          </div>
        </div>
        <span style={{ fontFamily:mn, fontSize:8, color:C.dim, flexShrink:0 }}>{open?'▲':'▼'}</span>
      </button>
      {open && (
        <div className="fu" style={{ padding:'0 18px 18px', borderTop:`1px solid ${C.border}` }}>
          <p style={{
            fontFamily:sf, fontSize:16, fontStyle:'italic', fontWeight:300,
            color:C.muted, lineHeight:1.75, padding:'14px 0 12px',
          }}>
            {item.body}
          </p>
          <div style={{
            borderLeft:`2px solid ${item.color}`,
            paddingLeft:12, marginTop:4,
          }}>
            <div style={{ fontFamily:mn, fontSize:8, color:item.color, letterSpacing:'0.15em', marginBottom:5 }}>
              YOUR APPLICATION
            </div>
            <p style={{ fontFamily:sf, fontSize:14, color:C.dim, lineHeight:1.65, fontStyle:'italic' }}>
              {item.apply}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ label, accent, children }) {
  return (
    <div style={{ marginBottom:32 }}>
      <div style={{
        display:'flex', alignItems:'center', gap:12,
        marginBottom:14, paddingBottom:10,
        borderBottom:`1px solid ${C.border}`,
      }}>
        <div style={{ width:3, height:16, background:accent, flexShrink:0 }}/>
        <span style={{ fontFamily:mn, fontSize:9, color:accent, letterSpacing:'0.22em' }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function WeeklyOS() {
  const [openRoi, setOpenRoi] = useState(null);
  const [openG2G, setOpenG2G] = useState(null);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday:'long', day:'numeric', month:'long'
  }).toUpperCase();

  const todayDow = getTodayDow();
  const todayAnchors = WEEKLY_ANCHORS.filter(a => a.days.includes(todayDow));
  const weekDone = WEEKLY_ANCHORS.filter(a => isDone(a.id)).length;
  const weekTotal = WEEKLY_ANCHORS.length;
  const pct = Math.round((weekDone / weekTotal) * 100);

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ background:C.bg, minHeight:'100vh', fontFamily:mn, color:C.text, fontSize:11 }}>

        {/* HEADER */}
        <div style={{
          position:'sticky', top:0, zIndex:100,
          background:'rgba(8,8,6,0.97)', backdropFilter:'blur(20px)',
          borderBottom:`1px solid ${C.border}`,
          padding:'12px 24px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ fontFamily:sf, fontSize:18, fontWeight:500, letterSpacing:'0.12em' }}>
              KOMOREBI <span style={{ color:C.gold }}>OS</span>
            </span>
            <div style={{ padding:'2px 10px', border:`1px solid ${C.gold}44`, background:C.goldF, color:C.gold, fontSize:8, letterSpacing:'0.2em' }}>
              WEEKLY OS
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontFamily:mn, fontSize:8, color:C.dim }}>{today}</span>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:60, height:2, background:C.border }}>
                <div style={{ height:2, width:`${pct}%`, background:C.gold, transition:'width 0.5s' }}/>
              </div>
              <span style={{ fontFamily:mn, fontSize:8, color:C.dim }}>{pct}%</span>
            </div>
          </div>
        </div>

        {/* TODAY'S ANCHORS — if any */}
        {todayAnchors.length > 0 && (
          <div style={{
            background:`linear-gradient(135deg, ${C.s2} 0%, ${C.s3} 100%)`,
            borderBottom:`1px solid ${C.border}`,
            padding:'14px 24px',
            display:'flex', alignItems:'center', gap:12,
          }}>
            <div className="blink" style={{ width:6, height:6, borderRadius:'50%', background:C.gold, flexShrink:0 }}/>
            <span style={{ fontFamily:mn, fontSize:8, color:C.gold, letterSpacing:'0.15em' }}>
              TODAY'S ANCHOR{todayAnchors.length > 1 ? 'S' : ''}:
            </span>
            {todayAnchors.map(a => (
              <span key={a.id} style={{
                fontFamily:sf, fontSize:13, fontStyle:'italic', color:C.muted,
              }}>
                {a.label}
              </span>
            ))}
          </div>
        )}

        {/* BODY */}
        <div style={{ maxWidth:700, margin:'0 auto', padding:'28px 20px 80px' }}>

          {/* DAILY ROI ARCHITECTURE */}
          <Section label="DAILY ROI ARCHITECTURE" accent={C.gold}>
            <div style={{ border:`1px solid ${C.border}`, background:C.s1, padding:'4px 16px 0' }}>
              {DAILY_ROI.map(item => (
                <DailyRoiCard
                  key={item.id}
                  item={item}
                  open={openRoi === item.id}
                  onToggle={() => setOpenRoi(openRoi === item.id ? null : item.id)}
                />
              ))}
            </div>
            <div style={{
              marginTop:12, padding:'10px 14px',
              border:`1px solid ${C.border}`, background:C.goldF,
              borderLeft:`2px solid ${C.gold}`,
            }}>
              <p style={{ fontFamily:sf, fontSize:13, fontStyle:'italic', color:C.dim, lineHeight:1.65 }}>
                Stack these in order: TM at 5:15 → 90/90/1 at 08:00 → 60/10 blocks through the day → student window mid-morning → family window at 18:00. Joy GPS is a check-in, not a slot.
              </p>
            </div>
          </Section>

          {/* WEEKLY ANCHOR TRACKER */}
          <Section label="WEEKLY ANCHOR TRACKER" accent={C.ember}>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {WEEKLY_ANCHORS.map(anchor => (
                <WeekStrip key={anchor.id} anchor={anchor} />
              ))}
            </div>
            <div style={{
              marginTop:12, padding:'10px 14px',
              border:`1px solid ${C.border}`, background:C.emberF,
              borderLeft:`2px solid ${C.ember}`,
            }}>
              <p style={{ fontFamily:sf, fontSize:13, fontStyle:'italic', color:C.dim, lineHeight:1.65 }}>
                Cycles of creativity: Create (Mon/Tue) → Execute (Wed/Thu) → Rest/Review (Fri/Sat) → Recover/Renew (Sun). The rhythm protects energy. Missing it creates grinding.
              </p>
            </div>
          </Section>

          {/* GOOD TO GREAT FRAMEWORK LIBRARY */}
          <Section label="GOOD TO GREAT — FRAMEWORK LIBRARY" accent={C.sage}>
            <div style={{ fontSize:9, color:C.dim, marginBottom:14, fontFamily:mn, letterSpacing:'0.1em' }}>
              READ DURING 10-MIN PHILOSOPHY WINDOW · ONE CONCEPT PER DAY
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {G2G.map(item => (
                <G2GCard
                  key={item.id}
                  item={item}
                  open={openG2G === item.id}
                  onToggle={() => setOpenG2G(openG2G === item.id ? null : item.id)}
                />
              ))}
            </div>
          </Section>

          {/* FOOTER */}
          <div style={{
            borderTop:`1px solid ${C.border}`, paddingTop:18, textAlign:'center',
          }}>
            <p style={{ fontFamily:sf, fontSize:13, fontStyle:'italic', color:C.xdim, lineHeight:1.8 }}>
              "Reading is faster than listening.<br/>
              Doing is faster than watching."
            </p>
            <p style={{ fontFamily:mn, fontSize:8, color:C.xdim, letterSpacing:'0.15em', marginTop:8 }}>
              SURF · VERAXUS · KOMOREBI CAPITAL
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
