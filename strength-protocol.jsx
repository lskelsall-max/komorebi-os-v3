import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const WARMUP = [
  { id: "w1", name: "Dead Hang", detail: "Full decompression. Spine lengthens. Let everything go.", duration: 30 },
  { id: "w2", name: "Supine Psoas Stretch", detail: "Posterior pelvic tilt. Breathe into the right side. 60 seconds minimum.", duration: 60 },
  { id: "w3", name: "Glute Bridge Isometric", detail: "Right leads. 5 sec hold each. Feel the right glute — if you can't, reset.", reps: "5 × 5s" },
  { id: "w4", name: "Wall Hip CARs", detail: "Right first. Full range, zero compensation. Own each degree.", reps: "5 each side" },
  { id: "w5", name: "Bird Dog", detail: "Spine neutral. No rotation. Pause at extension.", reps: "5 each side" },
  { id: "w6", name: "Band Pull-Apart", detail: "Warm the rear delts. Pull the right shoulder back into its socket.", reps: "15 reps" },
];

const COOLDOWN = [
  { id: "c1", name: "Wall Hip CARs", detail: "Slow. Full range. Right side especially.", reps: "5 each" },
  { id: "c2", name: "Supine Psoas Stretch", detail: "Decompress what you loaded. Breathe.", duration: 60 },
  { id: "c3", name: "Dead Hang", detail: "Final spinal decompression. Passive. Let go.", duration: 30 },
  { id: "c4", name: "FitMind Meditation", detail: "10–15 mins. Non-negotiable. Post-session clarity.", duration: 600 },
  { id: "c5", name: "Cold Shower", detail: "Finish cold. Own the discomfort. Close the session.", reps: "Until cold" },
];

const SESSIONS = [
  {
    id: "A",
    label: "SESSION A",
    sublabel: "PUSH",
    color: "#C8A96E",
    day: "MON",
    rules: ["RIGHT LEADS", "POSITION FIRST", "NO GRIND", "HEEL LIFT — RIGHT SHOE"],
    exercises: [
      {
        id: "A1", name: "Incline DB Press",
        sets: 4, reps: "5", tempo: "3-1-1", load: "16kg", logged: "16kg",
        color: "#C8A96E", rest: 120,
        cues: [
          "Right side leads every set",
          "Pack the lats into the bench before each rep",
          "Pause at the bottom — own the position",
          "Stop at the first slow rep",
        ],
        subs: [
          { name: "Floor Press", note: "Knees bent, triceps touch floor at bottom. Zero impingement." },
          { name: "Wall-Supported Press", note: "Sit against wall, press from shoulder. Enforces upright torso." },
        ],
      },
      {
        id: "A2", name: "Push Press — KB (Single Arm)",
        sets: 4, reps: "3", tempo: "Explosive", load: "8kg", logged: "8kg",
        color: "#C8A96E", rest: 120,
        cues: [
          "Heel lift in right shoe before you begin",
          "Squeeze right glute before the dip",
          "Small dip — legs drive, shoulder guides",
          "Full lockout pause at top — 1 full second",
          "Right arm first. Always.",
        ],
        subs: [
          { name: "Seated DB Shoulder Press", note: "Sit on floor or bench edge. Removes LLD issue entirely." },
          { name: "Half-Kneeling KB Press", note: "Right knee down. Forces right glute activation passively." },
        ],
      },
      {
        id: "A3", name: "Supported Lateral Raise",
        sets: 3, reps: "6", tempo: "2-1-2", load: "4kg", logged: "4kg",
        color: "#9B8EC4", rest: 90, superset: "A4",
        cues: [
          "Chest on incline bench — removes all compensation",
          "Lead with the elbow, not the wrist",
          "Slow eccentric — 2 full seconds down",
          "No shrug. Shoulder stays packed.",
        ],
        subs: [
          { name: "Side-Lying Lateral Raise", note: "Lie on left side, right arm raises to ceiling. Pure isolation." },
          { name: "Seated Lateral Raise", note: "Slight forward lean. Reduces QL involvement vs standing." },
        ],
      },
      {
        id: "A4", name: "Band Pull-Apart",
        sets: 3, reps: "10", tempo: "Controlled", load: "Light band", logged: null,
        color: "#9B8EC4", rest: 90, supersetWith: "A3",
        cues: [
          "Superset directly after lateral raise — no rest between",
          "Thumbs finish behind ears",
          "Feel the right rear delt working",
          "This is corrective — not optional",
        ],
        subs: [],
      },
      {
        id: "A5", name: "Banded Pull-Up (Assisted)",
        sets: 2, reps: "5", tempo: "2-1-2", load: "Band assist", logged: "Band assist",
        color: "#7EB8C9", rest: 90,
        cues: [
          "Added session 1 — keep at 2 sets on push days",
          "Pack the lats before you pull",
          "Dead hang at the bottom each rep",
          "Right side leads — feel it pulling equally",
        ],
        subs: [
          { name: "Band Face Pull", note: "If no pull-up bar. External rotation emphasis." },
          { name: "Single Arm Band Row", note: "Anchor band low, pull to hip. Right leads." },
        ],
      },
      {
        id: "A6", name: "Tricep Pushdown — Band",
        sets: 3, reps: "8", tempo: "2-1-2", load: "Medium band", logged: null,
        color: "#7EB8C9", rest: 90,
        cues: [
          "Elbows pinned to sides throughout",
          "Full extension at the bottom",
          "Slow eccentric — feel the long head",
          "Right arm first if doing unilateral",
        ],
        subs: [
          { name: "Close-Grip Floor Press", note: "Elbows narrow, hands close. Loads the triceps significantly." },
          { name: "Diamond Push-Up", note: "Hands form diamond shape. Bodyweight, anywhere." },
        ],
      },
    ],
  },
  {
    id: "B",
    label: "SESSION B",
    sublabel: "PULL",
    color: "#7EB8C9",
    day: "WED",
    rules: ["RIGHT LEADS", "ELBOW TO HIP", "OWN THE CONTRACTION", "NO GRIND"],
    exercises: [
      {
        id: "B1", name: "Single Arm DB Row",
        sets: 4, reps: "5", tempo: "2-1-2", load: "20kg", logged: null,
        color: "#7EB8C9", rest: 120,
        cues: [
          "Right arm leads every session",
          "Elbow to hip — not hand to shoulder",
          "Pause and own the contraction at the top",
          "No rotation in the torso",
          "If right QL fires before the lat — stop the set",
        ],
        subs: [
          { name: "Band Row (anchored)", note: "Loop band around post or door. Same cues apply." },
          { name: "Incline DB Row", note: "Chest on incline bench. Removes all spinal loading." },
        ],
      },
      {
        id: "B2", name: "Band Face Pull",
        sets: 3, reps: "8", tempo: "2-2-2", load: "Medium band", logged: null,
        color: "#7EB8C9", rest: 90,
        cues: [
          "Anchor band at upper chest height",
          "Thumbs finish behind ears at peak contraction",
          "External rotation emphasis — not a row",
          "Right rear delt must be felt working",
        ],
        subs: [
          { name: "Band Pull-Apart", note: "Same posterior chain benefit. Arms straight throughout." },
          { name: "Prone DB Rear Delt Raise", note: "Lie face down on incline. Pure rear delt isolation." },
        ],
      },
      {
        id: "B3", name: "Incline DB Curl",
        sets: 3, reps: "6", tempo: "2-1-3", load: "8kg", logged: null,
        color: "#9B8EC4", rest: 90,
        cues: [
          "Sit back on incline — upper arm stays vertical",
          "Slow eccentric — 3 full seconds down",
          "Shoulder pinned into socket throughout",
          "Right arm first",
          "No swing — if you swing, the weight is too heavy",
        ],
        subs: [
          { name: "Standing DB Curl", note: "Strict form, no swing. Elbows pinned to sides." },
          { name: "Band Curl", note: "Stand on band, curl up. Resistance increases at peak." },
        ],
      },
      {
        id: "B4", name: "Dead Hang",
        sets: 3, reps: "30s", tempo: "Passive", load: "Bodyweight", logged: null,
        color: "#C8A96E", rest: 60, isDuration: true, duration: 30,
        cues: [
          "This is structural maintenance — not accessory work",
          "Full passive decompression — let everything go",
          "Feel the right side of the spine lengthening",
          "Breathe slowly throughout",
        ],
        subs: [
          { name: "Supported Hang (feet on ground)", note: "Hands on bar, slight bend in knees. Still decompresses." },
          { name: "Doorframe Hang", note: "Grip top of doorframe. Less effective but better than nothing." },
        ],
      },
      {
        id: "B5", name: "Bird Dog Row",
        sets: 3, reps: "5", tempo: "3-1-2", load: "8kg", logged: null,
        color: "#9B8EC4", rest: 90,
        cues: [
          "Start in bird dog position — spine neutral",
          "Row the dumbbell while holding the extension",
          "Stability before strength — if you lose position, reset",
          "Right arm rows while right leg extends",
          "This is corrective as much as strength",
        ],
        subs: [
          { name: "Plank DB Row", note: "Plank position, row from the floor. Less range but stable." },
          { name: "Kneeling Single Arm Row", note: "Both knees down, upright torso. Reduces stability demand." },
        ],
      },
    ],
  },
  {
    id: "C",
    label: "SESSION C",
    sublabel: "HINGE + LOWER",
    color: "#E07B4A",
    day: "FRI",
    rules: ["RIGHT LEADS", "HIP HINGE NOT SQUAT", "GLUTE AT TOP", "POSITION FIRST"],
    exercises: [
      {
        id: "C1", name: "KB Swing",
        sets: 5, reps: "5", tempo: "Explosive", load: "20kg", logged: null,
        color: "#E07B4A", rest: 120,
        cues: [
          "Hip hinge — not a squat",
          "Explosive hip snap at the top",
          "Right glute squeeze at the top is the entire point",
          "Dead stop between reps if needed — own each one",
          "Stop the set if the lower back takes over",
        ],
        subs: [
          { name: "KB Deadlift", note: "Same hinge pattern, no swing. Both hands on single KB." },
          { name: "Romanian Deadlift — DB", note: "Slow eccentric hinge. Right glute loaded throughout." },
        ],
      },
      {
        id: "C2", name: "Single Leg RDL",
        sets: 4, reps: "5", tempo: "3-1-2", load: "12.5kg (contralateral)", logged: null,
        color: "#E07B4A", rest: 120,
        cues: [
          "Right leg leads every set",
          "Contralateral load — weight in left hand when right leg stands",
          "Slow — 3 seconds down, own the bottom",
          "Stop if right QL fires before the hamstring",
          "Slight knee bend on standing leg — not locked out",
        ],
        subs: [
          { name: "SL RDL — Bodyweight", note: "Same pattern, no load. Build the motor pattern first." },
          { name: "Hip Hinge to Wall", note: "Stand arms length from wall, hinge back to touch. Groove the pattern." },
        ],
      },
      {
        id: "C3", name: "Goblet Squat Hold",
        sets: 3, reps: "20s", tempo: "Static", load: "8kg", logged: null,
        color: "#C8A96E", rest: 90, isDuration: true, duration: 20,
        cues: [
          "Posterior pelvic tilt at the bottom",
          "Elbows track inside the knees",
          "Feel the right hip decompressing",
          "Breathe slowly — let the position do the work",
          "This is corrective as much as strength",
        ],
        subs: [
          { name: "Bodyweight Squat Hold", note: "Same position, arms forward for counterbalance." },
          { name: "Box Squat Hold", note: "Sit to box, just hover above it. Controls depth." },
        ],
      },
      {
        id: "C4", name: "Slant Board Calf Raise",
        sets: 3, reps: "8", tempo: "3-1-3", load: "Bodyweight / 8kg", logged: null,
        color: "#9B8EC4", rest: 90,
        cues: [
          "Right leads — right foot slightly higher on board",
          "Slow eccentric — 3 full seconds down",
          "Full range — heel below board level at bottom",
          "Ankle mobility is hip mobility upstream",
          "Single leg when bilateral feels too easy",
        ],
        subs: [
          { name: "Step Edge Calf Raise", note: "Use a step or book. Same range of motion principle." },
          { name: "Seated Calf Raise", note: "Sit on bench, weight on knee. Loads soleus more than gastroc." },
        ],
      },
      {
        id: "C5", name: "Glute Bridge Isometric",
        sets: 3, reps: "5 × 5s", tempo: "Isometric", load: "Bodyweight", logged: null,
        color: "#E07B4A", rest: 60,
        cues: [
          "Right glute must fire before counting the rep",
          "If right glute doesn't fire — reset position, try again",
          "5 second hold each — full contraction",
          "Feel the anterior hip opening as the glute fires",
          "This closes every lower session",
        ],
        subs: [],
      },
    ],
  },
];

// ─── UTILITIES ───────────────────────────────────────────────────────────────

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `${s}s`;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Timer({ duration, color, label = "REST" }) {
  const [active, setActive] = useState(false);
  const [remaining, setRemaining] = useState(duration);
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (active && remaining > 0) {
      ref.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) { clearInterval(ref.current); setActive(false); setDone(true); return 0; }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(ref.current);
  }, [active]);

  const progress = ((duration - remaining) / duration) * 100;

  return (
    <button
      onClick={done ? () => { setRemaining(duration); setDone(false); } : () => setActive((a) => !a)}
      style={{
        position: "relative", overflow: "hidden",
        background: done ? "rgba(76,175,80,0.1)" : active ? color : "transparent",
        border: `1px solid ${done ? "#4CAF50" : color}`,
        borderRadius: "4px", color: done ? "#4CAF50" : active ? "#0a0a0a" : color,
        padding: "6px 14px", fontSize: "11px", fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.08em", cursor: "pointer", minWidth: "110px", transition: "all 0.2s",
      }}
    >
      {active && <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`, background: "rgba(255,255,255,0.2)", transition: "width 1s linear" }} />}
      <span style={{ position: "relative", zIndex: 1 }}>
        {done ? "✓ NEXT SET" : active ? `${label} ${formatTime(remaining)}` : `${label} ${formatTime(duration)}`}
      </span>
    </button>
  );
}

function SetTracker({ sets, color }) {
  const [completed, setCompleted] = useState([]);
  const toggle = (i) => setCompleted((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>SETS</span>
      {Array.from({ length: sets }).map((_, i) => (
        <button key={i} onClick={() => toggle(i)} style={{
          width: "28px", height: "28px", borderRadius: "4px",
          border: `1.5px solid ${completed.includes(i) ? color : "rgba(255,255,255,0.15)"}`,
          background: completed.includes(i) ? color : "transparent",
          color: completed.includes(i) ? "#0a0a0a" : "rgba(255,255,255,0.3)",
          fontFamily: "'DM Mono', monospace", fontSize: "10px", cursor: "pointer",
          transition: "all 0.15s", fontWeight: completed.includes(i) ? "700" : "400",
        }}>
          {completed.includes(i) ? "✓" : i + 1}
        </button>
      ))}
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
        {completed.length}/{sets}
      </span>
    </div>
  );
}

function ExerciseCard({ ex }) {
  const [open, setOpen] = useState(true);
  const [showSubs, setShowSubs] = useState(false);

  return (
    <div style={{
      marginBottom: "8px",
      background: "rgba(255,255,255,0.02)",
      border: `1px solid rgba(255,255,255,0.06)`,
      borderLeft: `3px solid ${ex.color}`,
      borderRadius: "8px", overflow: "hidden",
    }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", background: "transparent", border: "none", cursor: "pointer",
        borderBottom: open ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: ex.color, letterSpacing: "0.1em", opacity: 0.6 }}>{ex.id}</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", color: "#F0EBE3" }}>{ex.name}</span>
          {ex.logged && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: ex.color, border: `1px solid ${ex.color}44`, borderRadius: "3px", padding: "2px 7px", letterSpacing: "0.1em" }}>
              ↗ {ex.logged}
            </span>
          )}
          {(ex.superset || ex.supersetWith) && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px", padding: "2px 6px" }}>
              SUPERSET
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{ex.sets}×{ex.reps}</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</span>
        </div>
      </button>

      {open && (
        <div style={{ padding: "16px 18px" }}>
          {/* Stats */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {[
              { label: "LOAD", val: ex.load },
              { label: "REPS", val: ex.reps },
              { label: "TEMPO", val: ex.tempo },
              { label: "REST", val: formatTime(ex.rest) },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "4px", padding: "7px 11px" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: "3px" }}>{s.label}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: ex.color }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Cues */}
          <div style={{ marginBottom: "14px" }}>
            {ex.cues.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "5px", alignItems: "flex-start" }}>
                <span style={{ color: ex.color, fontSize: "10px", marginTop: "2px", opacity: 0.5 }}>→</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: "1.5" }}>{c}</span>
              </div>
            ))}
          </div>

          {/* Set tracker + timer */}
          <div style={{ marginBottom: "12px" }}>
            <SetTracker sets={ex.sets} color={ex.color} />
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {ex.isDuration
              ? <Timer duration={ex.duration} color={ex.color} label="HOLD" />
              : <Timer duration={ex.rest} color={ex.color} label="REST" />
            }
            {ex.subs && ex.subs.length > 0 && (
              <button onClick={() => setShowSubs((s) => !s)} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px", color: "rgba(255,255,255,0.3)", padding: "6px 12px",
                fontFamily: "'DM Mono', monospace", fontSize: "10px", cursor: "pointer",
                letterSpacing: "0.08em", transition: "all 0.2s",
              }}>
                {showSubs ? "HIDE SUBS" : "SHOW SUBS"}
              </button>
            )}
          </div>

          {/* Subs */}
          {showSubs && ex.subs.length > 0 && (
            <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", margin: "0 0 8px" }}>SUBSTITUTIONS</p>
              {ex.subs.map((sub, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: ex.color, opacity: 0.5, marginTop: "1px" }}>{i + 1}.</span>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", color: "rgba(240,235,227,0.7)", marginBottom: "2px" }}>{sub.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", lineHeight: "1.5" }}>{sub.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SimpleStep({ step, color }) {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "14px",
      padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
      opacity: checked ? 0.4 : 1, transition: "opacity 0.3s",
    }}>
      <button onClick={() => setChecked((c) => !c)} style={{
        width: "18px", height: "18px", minWidth: "18px", borderRadius: "50%",
        border: `1.5px solid ${checked ? color : "rgba(255,255,255,0.2)"}`,
        background: checked ? color : "transparent", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginTop: "2px", transition: "all 0.2s",
      }}>
        {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 6L8 1" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", color: "#F0EBE3", marginBottom: "4px", textDecoration: checked ? "line-through" : "none" }}>{step.name}</div>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "0 0 8px", lineHeight: "1.6" }}>{step.detail}</p>
        {step.duration && <Timer duration={step.duration} color={color} label="" />}
        {step.reps && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color, border: `1px solid ${color}66`, borderRadius: "4px", padding: "5px 10px" }}>{step.reps}</span>}
      </div>
    </div>
  );
}

function CollapsibleSection({ title, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "transparent", border: "none", cursor: "pointer",
        padding: "0 0 12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "3px", height: "16px", background: color, borderRadius: "2px" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.18em", color, fontWeight: "600" }}>{title}</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</span>
      </button>
      {open && children}
    </div>
  );
}

function SessionView({ session }) {
  return (
    <div style={{ padding: "20px 16px 60px", maxWidth: "680px", margin: "0 auto" }}>
      {/* Rules */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
        {session.rules.map((r) => (
          <span key={r} style={{
            fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.12em",
            color: `${session.color}99`, border: `1px solid ${session.color}22`,
            borderRadius: "3px", padding: "4px 8px",
          }}>{r}</span>
        ))}
      </div>

      <CollapsibleSection title="WARMUP — 8 MINS" color="#7EB8C9">
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "4px 16px" }}>
          {WARMUP.map((step) => <SimpleStep key={step.id} step={step} color="#7EB8C9" />)}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="WORKING SETS" color={session.color}>
        {session.exercises.map((ex) => <ExerciseCard key={ex.id} ex={ex} />)}
      </CollapsibleSection>

      <CollapsibleSection title="COOLDOWN + MINDSET" color="#9B8EC4" defaultOpen={false}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "4px 16px" }}>
          {COOLDOWN.map((step) => <SimpleStep key={step.id} step={step} color="#9B8EC4" />)}
        </div>
      </CollapsibleSection>

      <div style={{
        padding: "18px 20px", background: `${session.color}08`,
        border: `1px solid ${session.color}18`, borderRadius: "8px", textAlign: "center",
      }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "12px", color: `${session.color}99`, margin: "0 0 4px" }}>
          "I am relentless, disciplined, and focused."
        </p>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", margin: 0, letterSpacing: "0.1em" }}>
          KOMOREBI · RONIN PHASE · SESSION {session.id}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function StrengthApp() {
  const [activeTab, setActiveTab] = useState("A");
  const session = SESSIONS.find((s) => s.id === activeTab);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      backgroundImage: `radial-gradient(ellipse at 20% 0%, ${session.color}09 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(155,142,196,0.04) 0%, transparent 50%)`,
      transition: "background 0.4s ease",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "28px 24px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)", maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", margin: "0 0 6px" }}>
              {dateStr.toUpperCase()}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", color: "#F0EBE3", margin: "0 0 3px", fontWeight: "400" }}>
              Strength Protocol
            </h1>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", margin: 0, letterSpacing: "0.1em" }}>
              RONIN PHASE · PILLAR III
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "SESSIONS", val: "3×/WK" },
              { label: "TARGET", val: "45m" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", padding: "8px 12px", textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: session.color }}>{s.val}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0" }}>
          {SESSIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              style={{
                flex: 1, padding: "12px 8px",
                background: activeTab === s.id ? "rgba(255,255,255,0.04)" : "transparent",
                border: "none",
                borderBottom: activeTab === s.id ? `2px solid ${s.color}` : "2px solid transparent",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: activeTab === s.id ? s.color : "rgba(255,255,255,0.25)", letterSpacing: "0.15em", marginBottom: "3px" }}>
                {s.day}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: activeTab === s.id ? s.color : "rgba(255,255,255,0.3)", letterSpacing: "0.1em", fontWeight: activeTab === s.id ? "600" : "400" }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: activeTab === s.id ? `${s.color}88` : "rgba(255,255,255,0.15)", letterSpacing: "0.1em", marginTop: "2px" }}>
                {s.sublabel}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Session content */}
      <SessionView key={activeTab} session={session} />
    </div>
  );
}
