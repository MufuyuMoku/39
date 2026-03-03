// ============================================================
// 39 JOURNEY — Enhanced Script
// ============================================================

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// ── Audio Context ──────────────────────────────────────────
let audioCtx = null;
let audioEnabled = false;
const audioBtn = document.getElementById("audio-toggle");

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(freq, type = "sine", duration = 0.4, vol = 0.12) {
    if (!audioEnabled) return;
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

const noteMap = { C4:261.63, D4:293.66, E4:329.63, G4:392, A4:440, B4:493.88, C5:523.25 };

function playNote(noteName) {
    if (noteMap[noteName]) playTone(noteMap[noteName], "triangle", 0.5, 0.1);
}

function playSynthChord(notes, delay = 0) {
    notes.forEach((n, i) => {
        setTimeout(() => playNote(n), delay + i * 80);
    });
}

audioBtn.addEventListener("click", () => {
    audioEnabled = !audioEnabled;
    if (audioEnabled) {
        getAudioCtx().resume();
        audioBtn.classList.add("active");
        audioBtn.querySelector(".audio-label").textContent = "SOUND ON";
        playTone(440, "triangle", 0.3, 0.08);
    } else {
        audioBtn.classList.remove("active");
        audioBtn.querySelector(".audio-label").textContent = "SOUND OFF";
    }
});

// ── Custom Cursor ──────────────────────────────────────────
const cursor = document.querySelector(".custom-cursor");
const cursorDot = document.querySelector(".custom-cursor-dot");
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

document.addEventListener("mousemove", e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
});

function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + "px";
    cursor.style.top = curY + "px";
    requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverEls = document.querySelectorAll("a, button, .kanji, .digit, .grid-num, .qr-link-wrapper, .ftag, .tl-item");
hoverEls.forEach(el => {
    el.addEventListener("mouseenter", () => { document.body.classList.add("cursor-hover"); });
    el.addEventListener("mouseleave", () => { document.body.classList.remove("cursor-hover"); });
});

// ── Click ripple ──────────────────────────────────────────
document.addEventListener("click", e => {
    const r = document.createElement("div");
    r.className = "ripple";
    r.style.left = e.clientX + "px";
    r.style.top = e.clientY + "px";
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 700);
    if (audioEnabled) playTone(880, "sine", 0.15, 0.06);
});

// ── Progress bar ──────────────────────────────────────────
const progressBar = document.getElementById("progress-bar");
document.addEventListener("scroll", () => {
    const total = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = (window.scrollY / total * 100) + "%";
});

// ── Particle Canvas ───────────────────────────────────────
const pCanvas = document.getElementById("particle-canvas");
const pCtx = pCanvas.getContext("2d");
let particles = [];
let isDark = false;

function resizeParticleCanvas() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener("resize", resizeParticleCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * pCanvas.width;
        this.y = Math.random() * pCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.5 - 0.2;
        this.size = Math.random() * 1.5 + 0.5;
        this.life = 1;
        this.decay = Math.random() * 0.003 + 0.001;
        this.color = Math.random() > 0.5 ? "57,197,187" : (Math.random() > 0.5 ? "255,110,180" : "240,192,64");
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.life -= this.decay;
        if (this.life <= 0 || this.y < -10) this.reset();
    }
    draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(${this.color}, ${this.life * (isDark ? 0.5 : 0.2)})`;
        pCtx.fill();
    }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Wave Canvas (Act Freq) ────────────────────────────────
const wCanvas = document.getElementById("wave-canvas");
const wCtx = wCanvas.getContext("2d");
let waveTime = 0;
let waveActive = false;

function resizeWaveCanvas() {
    wCanvas.width = wCanvas.offsetWidth;
    wCanvas.height = wCanvas.offsetHeight;
}

function drawWave() {
    if (!wCanvas.width) { requestAnimationFrame(drawWave); return; }
    wCtx.clearRect(0, 0, wCanvas.width, wCanvas.height);
    
    const waves = [
        { color: "57,197,187", amp: 40, freq: 0.015, speed: 0.03, y: 0.45 },
        { color: "255,110,180", amp: 30, freq: 0.02, speed: 0.025, y: 0.50 },
        { color: "240,192,64", amp: 20, freq: 0.025, speed: 0.04, y: 0.55 },
        { color: "168,85,247", amp: 15, freq: 0.012, speed: 0.02, y: 0.48 },
    ];

    waves.forEach(w => {
        wCtx.beginPath();
        for (let x = 0; x <= wCanvas.width; x += 2) {
            const y = wCanvas.height * w.y +
                Math.sin(x * w.freq + waveTime * w.speed * 60) * w.amp +
                Math.sin(x * w.freq * 2.1 + waveTime * w.speed * 40) * (w.amp * 0.4);
            x === 0 ? wCtx.moveTo(x, y) : wCtx.lineTo(x, y);
        }
        wCtx.strokeStyle = `rgba(${w.color}, 0.5)`;
        wCtx.lineWidth = 1.5;
        wCtx.stroke();
    });

    waveTime++;
    if (waveActive) requestAnimationFrame(drawWave);
}

ScrollTrigger.create({
    trigger: "#act-freq",
    start: "top 80%", end: "bottom top",
    onEnter: () => { resizeWaveCanvas(); waveActive = true; drawWave(); if(audioEnabled) playSynthChord(["C4","E4","G4"], 0); },
    onLeave: () => { waveActive = false; },
    onEnterBack: () => { waveActive = true; drawWave(); },
    onLeaveBack: () => { waveActive = false; }
});

// ── SVG crayon rings ──────────────────────────────────────
const svgContainer = document.getElementById("crayon-svg-container");
const svgMarkup = `
    <svg viewBox="0 0 600 600" width="100%" height="100%">
        <defs>
            <linearGradient id="crayonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#39c5bb;stop-opacity:0.8"/>
                <stop offset="50%" style="stop-color:#ff6eb4;stop-opacity:0.6"/>
                <stop offset="100%" style="stop-color:#39c5bb;stop-opacity:0.8"/>
            </linearGradient>
        </defs>
        <circle class="drawn-line crayon-path" cx="300" cy="300" r="185" stroke-dasharray="1200" stroke-dashoffset="1200" stroke-width="2" />
        <circle class="drawn-line crayon-path" cx="300" cy="300" r="200" opacity="0.5" stroke-dasharray="1300" stroke-dashoffset="1300" stroke-width="1.5" />
        <circle class="drawn-line crayon-path" cx="300" cy="300" r="215" opacity="0.3" stroke-dasharray="1400" stroke-dashoffset="1400" stroke-width="1" />
        <path class="drawn-line crayon-path" d="M300,48 L300,100 M278,78 L300,100 L322,78" stroke-width="3" stroke-dasharray="100" stroke-dashoffset="100" />
        <path class="drawn-line crayon-path" d="M300,552 L300,500 M278,520 L300,500 L322,520" stroke-width="3" stroke-dasharray="100" stroke-dashoffset="100" />
        <path class="drawn-line crayon-path" d="M48,300 L100,300 M78,278 L100,300 L78,322" stroke-width="3" stroke-dasharray="100" stroke-dashoffset="100" />
        <path class="drawn-line crayon-path" d="M552,300 L500,300 M520,278 L500,300 L520,322" stroke-width="3" stroke-dasharray="100" stroke-dashoffset="100" />
        <path class="drawn-line crayon-path" d="M258,258 L342,342 M300,258 L258,300 L342,300 L300,342" stroke-width="1" opacity="0.3" stroke-dasharray="300" stroke-dashoffset="300" />
    </svg>
`;
if (svgContainer) svgContainer.innerHTML = svgMarkup;

// ── Number grid (Act 3) ───────────────────────────────────
const numGrid = document.getElementById("number-grid");
if (numGrid) {
    for (let i = 1; i <= 81; i++) {
        const d = document.createElement("div");
        d.className = "grid-num" + (i === 39 ? " is-39" : "");
        d.textContent = i;
        if (i === 39) {
            d.title = "39 = Thank You = Miku";
            d.addEventListener("click", () => {
                if(audioEnabled) playSynthChord(["C4","E4","G4","C5"], 0);
                d.style.transform = "scale(1.4)";
                d.style.color = "var(--pink-accent)";
                setTimeout(() => { d.style.transform = ""; d.style.color = ""; }, 400);
            });
        }
        d.addEventListener("mouseenter", () => {
            if(audioEnabled && Math.random() > 0.85) playTone(200 + i * 8, "sine", 0.1, 0.05);
        });
        numGrid.appendChild(d);
    }
}

// ── Frequency bars (Act Freq) ─────────────────────────────
const freqBarsContainer = document.getElementById("freq-bars");
if (freqBarsContainer) {
    const barCount = 48;
    for (let i = 0; i < barCount; i++) {
        const b = document.createElement("div");
        b.className = "freq-bar";
        const h = Math.random() * 40 + 8;
        b.style.setProperty("--h", h + "px");
        b.style.setProperty("--dur", (Math.random() * 0.6 + 0.4) + "s");
        b.style.animationDelay = (i * 0.03) + "s";
        freqBarsContainer.appendChild(b);
    }
}

// ── Comment cloud (Act 5) ─────────────────────────────────
function generateComments() {
    const cloud = document.getElementById("comment-cloud");
    if (!cloud) return;
    const phrases = [
        "Thank you","ありがとう","Sankyu 39!","Thank you Miku!",
        "Mi-Ku-3-9","First Sound","Masterpiece","Soundtrack",
        "ありがとうミクさん","Vocaloid-P","Creator","Resonance",
        "偽りのない感謝を","サンキュー","Code & Melody",
        "初音ミク","The Voice","39","三九","Synthesized Soul"
    ];
    for (let i = 0; i < 90; i++) {
        const span = document.createElement("span");
        span.className = "bg-comment";
        span.innerText = phrases[Math.floor(Math.random() * phrases.length)];
        span.style.left = (Math.random() * 80 + 10) + "%";
        span.style.top = (Math.random() * 85 + 8) + "%";
        span.style.opacity = Math.random() * 0.07 + 0.03;
        span.style.transform = `translate(-50%,-50%) rotate(${Math.random() * 30 - 15}deg)`;
        span.style.fontSize = (Math.random() * 0.7 + 0.85) + "rem";
        cloud.appendChild(span);
    }
}

// ── Floating tags (Act 5) ─────────────────────────────────
function generateFloatingTags() {
    const container = document.getElementById("floating-tags");
    if (!container) return;
    const tags = ["#VOCALOID","#初音ミク","#39","#THANK_YOU","#GOROAWASE","#SYNTH","#MIKU","#MUSIC","#CODE","#GRATITUDE","#三九","#FIRST_SOUND"];
    tags.forEach(t => {
        const el = document.createElement("div");
        el.className = "ftag";
        el.textContent = t;
        el.addEventListener("mouseenter", () => {
            if(audioEnabled) playTone(500 + Math.random() * 300, "triangle", 0.2, 0.07);
        });
        container.appendChild(el);
    });
}

// ── Hologram card tilt ────────────────────────────────────
const holoCard = document.getElementById("holo-card");
if (holoCard) {
    holoCard.addEventListener("mousemove", e => {
        const r = holoCard.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / (r.width / 2);
        const dy = (e.clientY - cy) / (r.height / 2);
        holoCard.querySelector(".holo-inner").style.transform = `rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg)`;
    });
    holoCard.addEventListener("mouseleave", () => {
        holoCard.querySelector(".holo-inner").style.transform = "";
    });
}

// ── Dict entries reveal on scroll ────────────────────────
const revealEls = document.querySelectorAll("[data-reveal]");
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.3 });
revealEls.forEach(el => revealObs.observe(el));

// ── Timeline items reveal ─────────────────────────────────
const tlItems = document.querySelectorAll(".tl-item");
const tlObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.index || 0) * 150;
            setTimeout(() => e.target.classList.add("visible"), delay);
            if (audioEnabled && e.isIntersecting) {
                const idx = parseInt(e.target.dataset.index || 0);
                const chords = [["C4","E4"],["D4","G4"],["E4","A4"],["G4","B4"]];
                setTimeout(() => playSynthChord(chords[idx] || ["C4","G4"], 0), delay);
            }
        }
    });
}, { threshold: 0.4 });
tlItems.forEach(el => tlObs.observe(el));

// ── Kanji hover sound ─────────────────────────────────────
document.querySelectorAll("[data-hover-sound]").forEach(el => {
    el.addEventListener("mouseenter", () => playNote(el.dataset.hoverSound));
});

// ── DOMContentLoaded init ─────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    generateComments();
    generateFloatingTags();
});

// ── GSAP Animations ───────────────────────────────────────

// Act 1: dict out on scroll
gsap.to(".dict-container", {
    y: -120, opacity: 0,
    scrollTrigger: { trigger: "#act-1", start: "top top", end: "bottom top", scrub: 1.2 }
});

// Act 2: pinned 39 reveal
let tlAct2 = gsap.timeline({
    scrollTrigger: { trigger: "#act-2", start: "top top", end: "+=160%", pin: true, scrub: 1.2 }
});
tlAct2
    .fromTo(".giant-number",
        { scale: 0.7, opacity: 0, yPercent: 0 },
        { scale: 1, opacity: 1, yPercent: 0, duration: 2 }
    )
    .to(".crayon-path", { strokeDashoffset: 0, duration: 4, ease: "power2.inOut", stagger: 0.3 }, "-=1.5")
    .to(".jp-left", { x: 40, opacity: 0.9, duration: 2 }, "-=3.5")
    .to(".jp-right", { x: -40, opacity: 0.9, duration: 2 }, "-=3.5")
    .to(".orbit-ring", { opacity: 1, duration: 1 }, "-=2");

// Act 2 → scroll color trigger
ScrollTrigger.create({
    trigger: "#act-2",
    start: "top top",
    onEnter: () => { if (audioEnabled) playSynthChord(["C4","G4"], 200); }
});

// Act 3
gsap.from("#act-3 .fade-in-text, .kanji, .katakana-display, #act-3 .sub-text, .number-grid", {
    y: 50, opacity: 0, stagger: 0.15, duration: 1.2, ease: "power3.out",
    scrollTrigger: { trigger: "#act-3", start: "top 65%", toggleActions: "play reverse play reverse" }
});

// Act Freq entrance
gsap.from(".freq-label, .freq-title, .act-frequency .sub-text, .freq-bars", {
    y: 40, opacity: 0, stagger: 0.2, duration: 1.2, ease: "power2.out",
    scrollTrigger: { trigger: "#act-freq", start: "top 60%", toggleActions: "play reverse play reverse" }
});

// Theme transition → dark
ScrollTrigger.create({
    trigger: "#act-4", start: "top 50%",
    onEnter: () => {
        isDark = true;
        document.body.style.backgroundColor = "var(--bg-digital)";
        document.body.style.color = "var(--text-light)";
        gsap.to(".sub-text", { color: "#667", duration: 0.8 });
        if (audioEnabled) playSynthChord(["G4","B4","D4"], 0);
    },
    onLeaveBack: () => {
        isDark = false;
        document.body.style.backgroundColor = "var(--bg-paper)";
        document.body.style.color = "var(--text-ink)";
        gsap.to(".sub-text", { color: "#555", duration: 0.8 });
    }
});

// Act 4 elements
gsap.from(".miku-code, .digital-lore .sub-text, .hologram-card", {
    y: 50, opacity: 0, stagger: 0.18, duration: 1.2, ease: "power3.out",
    scrollTrigger: { trigger: "#act-4", start: "top 60%", toggleActions: "play reverse play reverse" }
});

// Act 5 dedication
gsap.from(".dedication-box > *", {
    y: 35, opacity: 0, stagger: 0.18, duration: 1.3, ease: "power2.out",
    scrollTrigger: { trigger: "#act-5", start: "top 60%", toggleActions: "play reverse play reverse" }
});
gsap.to("#comment-cloud", {
    y: -100,
    scrollTrigger: { trigger: "#act-5", start: "top bottom", end: "bottom top", scrub: 1.5 }
});

// Act 6 closing
gsap.from(".jp-closing, .jp-closing-thanks, .final-qr-placeholder, .closing-credits", {
    y: 50, opacity: 0, stagger: 0.22, duration: 1.3, ease: "power3.out",
    scrollTrigger: { trigger: "#act-6", start: "top 70%", toggleActions: "play reverse play reverse",
        onEnter: () => { if (audioEnabled) playSynthChord(["C4","E4","G4","C5"], 0); }
    }
});

// ── Scroll status text ────────────────────────────────────
const statusEl = document.querySelector(".scroll-status");
const statusMap = [
    { id: "act-1", text: "Scroll to explore" },
    { id: "act-2", text: "Act II · Chaos" },
    { id: "act-3", text: "Act III · Goroawase" },
    { id: "act-freq", text: "Act IV · Frequency" },
    { id: "act-4", text: "Act V · The Voice" },
    { id: "act-timeline", text: "Act VI · Journey" },
    { id: "act-5", text: "Act VII · Dedication" },
    { id: "act-6", text: "Act VIII · Thank You" },
];
statusMap.forEach(s => {
    ScrollTrigger.create({
        trigger: "#" + s.id, start: "top 50%",
        onEnter: () => { if(statusEl) { statusEl.style.opacity = "0"; setTimeout(() => { statusEl.textContent = s.text; statusEl.style.opacity = "1"; }, 300); } },
    });
});
if (statusEl) statusEl.style.transition = "opacity 0.3s ease";