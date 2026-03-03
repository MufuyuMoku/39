gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const svgContainer = document.getElementById("crayon-svg-container");
const svgMarkup = `
    <svg viewBox="0 0 600 600" width="100%" height="100%">
        <circle class="drawn-line crayon-path" cx="300" cy="300" r="180" stroke-dasharray="1200" stroke-dashoffset="1200" />
        <circle class="drawn-line crayon-path" cx="300" cy="300" r="195" opacity="0.6" stroke-dasharray="1300" stroke-dashoffset="1300" />
        <circle class="drawn-line crayon-path" cx="300" cy="300" r="210" opacity="0.4" stroke-dasharray="1400" stroke-dashoffset="1400" />
        <path class="drawn-line crayon-path" d="M300,50 L300,100 M280,80 L300,100 L320,80" stroke-width="5" stroke-dasharray="100" stroke-dashoffset="100" />
        <path class="drawn-line crayon-path" d="M300,550 L300,500 M280,520 L300,500 L320,520" stroke-width="5" stroke-dasharray="100" stroke-dashoffset="100" />
        <path class="drawn-line crayon-path" d="M50,300 L100,300 M80,280 L100,300 L80,320" stroke-width="5" stroke-dasharray="100" stroke-dashoffset="100" />
        <path class="drawn-line crayon-path" d="M550,300 L500,300 M520,280 L500,300 L520,320" stroke-width="5" stroke-dasharray="100" stroke-dashoffset="100" />
    </svg>
`;
if(svgContainer) svgContainer.innerHTML = svgMarkup;

function generateComments() {
    const cloud = document.getElementById("comment-cloud");
    if(!cloud) return;

    const phrases = [
        "Thank you", "ありがとう", "Sankyu 39!", "Thank you Miku!", 
        "Mi-Ku-3-9", "First Sound", "Masterpiece", "Soundtrack", 
        "ありがとうミクさん", "Vocaloid-P", "Creator", "Resonance", 
        "偽りのない感謝を", "サンキュー", "Code & Melody"
    ];

    const totalComments = 80;

    for (let i = 0; i < totalComments; i++) {
        const span = document.createElement("span");
        span.classList.add("bg-comment");
        span.innerText = phrases[Math.floor(Math.random() * phrases.length)];
        
        const posX = Math.random() * 80 + 10; 
        const posY = Math.random() * 80 + 10; 
        
        span.style.left = posX + "%";
        span.style.top = posY + "%";
        
        span.style.opacity = Math.random() * 0.06 + 0.04; 

        span.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`;
        
        span.style.fontSize = Math.random() * 0.8 + 0.9 + "rem"; 

        cloud.appendChild(span);
    }
}
document.addEventListener("DOMContentLoaded", generateComments);

gsap.to(".dict-container", {
    y: -100, opacity: 0,
    scrollTrigger: { trigger: "#act-1", start: "top top", end: "bottom top", scrub: 1 }
});

let tlAct2 = gsap.timeline({
    scrollTrigger: { trigger: "#act-2", start: "top top", end: "+=150%", pin: true, scrub: 1 }
});
tlAct2.fromTo(".giant-number", 
        { scale: 0.8, opacity: 0, yPercent: -22 }, 
        { scale: 1, opacity: 1, yPercent: -22, duration: 2 }
      )
      .to(".crayon-path", { strokeDashoffset: 0, duration: 4, ease: "power2.inOut" }, "-=1")
      .to(".jp-left", { x: 30, opacity: 0.8, duration: 2 }, "-=3")
      .to(".jp-right", { x: -30, opacity: 0.8, duration: 2 }, "-=3");

gsap.from("#act-3 .fade-in-text, .kanji, .katakana-display, #act-3 .sub-text", { 
    y: 40, opacity: 0, stagger: 0.2, duration: 1.2, ease: "power2.out",
    scrollTrigger: { 
        trigger: "#act-3", 
        start: "top 70%", 
        toggleActions: "play reverse play reverse" 
    } 
});

ScrollTrigger.create({
    trigger: "#act-4", start: "top 45%", 
    onEnter: () => {
        document.body.style.backgroundColor = "var(--bg-digital)";
        document.body.style.color = "var(--text-light)";
        gsap.to(".sub-text", { color: "#a0aab2" });
        gsap.to(".digit", { textShadow: "0 0 20px rgba(57, 197, 187, 0.8)" });
    },
    onLeaveBack: () => {
        document.body.style.backgroundColor = "var(--bg-paper)";
        document.body.style.color = "var(--text-ink)";
        gsap.to(".sub-text", { color: "#555" });
        gsap.to(".digit", { textShadow: "0 0 0px rgba(57, 197, 187, 0)" });
    }
});

gsap.from(".miku-code, .digital-lore .sub-text", {
    y: 40, opacity: 0, stagger: 0.15, duration: 1.2, ease: "power2.out",
    scrollTrigger: { 
        trigger: "#act-4", 
        start: "top 65%",
        toggleActions: "play reverse play reverse"
    }
});

gsap.from(".dedication-box > *", {
    y: 30, opacity: 0, stagger: 0.2, duration: 1.2, ease: "power2.out",
    scrollTrigger: { 
        trigger: "#act-5", 
        start: "top 65%",
        toggleActions: "play reverse play reverse" 
    }
});

gsap.to("#comment-cloud", {
    y: -80, 
    scrollTrigger: { trigger: "#act-5", start: "top bottom", end: "bottom top", scrub: 1 }
});

gsap.from(".jp-closing, .jp-closing-thanks, .final-qr-placeholder", {
    y: 40, opacity: 0, stagger: 0.2, duration: 1.2, ease: "power2.out",
    scrollTrigger: { 
        trigger: "#act-6", 
        start: "top 75%",
        toggleActions: "play reverse play reverse" 
    }

});
