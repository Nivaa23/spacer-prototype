// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Custom Cursor Logic
const cursorFollower = document.querySelector('.cursor-follower');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;
let followX = 0, followY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot moves instantly
    gsap.to(cursorDot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1
    });

    // Follower has lag
    gsap.to(cursorFollower, {
        x: mouseX - 10,
        y: mouseY - 10,
        duration: 0.5,
        ease: "power2.out"
    });
});

// Cursor Interactions
document.querySelectorAll('a, button, .program-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorFollower, { scale: 3, background: 'rgba(255,255,255,0.1)', border: '1px solid white' });
        gsap.to(cursorDot, { scale: 2 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, { scale: 1, background: 'white', border: 'none' });
        gsap.to(cursorDot, { scale: 1 });
    });
});

// Section Reveal Animations
gsap.registerPlugin(ScrollTrigger);

const reveals = document.querySelectorAll('.reveal');
reveals.forEach(el => {
    gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});

// Hero Content Entry Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    tl.to('.hero-title', { opacity: 1, y: 0, duration: 1.5, ease: "power4.out", delay: 0.5 })
        .to('.hero-subtext', { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=1")
        .to('.cta-button', { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.8");
});

// Card Canvases (Simple geometric patterns)
function initCardCanvases() {
    const cards = document.querySelectorAll('.program-card canvas');
    cards.forEach((canvas, index) => {
        const ctx = canvas.getContext('2d');
        const w = 400;
        const h = 600;
        canvas.width = w;
        canvas.height = h;

        function draw() {
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;

            // Draw abstract architectural lines
            const time = Date.now() * 0.0005;
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                const offset = Math.sin(time + i) * 50;
                ctx.moveTo(0, h / 2 + offset + i * 10);
                ctx.lineTo(w, h / 2 - offset + i * 10);
                ctx.stroke();
            }
            requestAnimationFrame(draw);
        }
        draw();
    });
}
initCardCanvases();

// Program Stacked Scroll Interaction
function initProgramScroll() {
    const wrapper = document.querySelector('.programs-wrapper');
    const cards = gsap.utils.toArray('.program-card');

    if (!wrapper || cards.length === 0) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 1, // Slow down scroll progression with smooth interpolation
        }
    });

    cards.forEach((card, i) => {
        // Initial setup
        if (i === 0) {
            gsap.set(card, { opacity: 1, y: 0, scale: 1, zIndex: i + 1 });
        } else {
            gsap.set(card, { opacity: 0, y: window.innerHeight * 0.8, scale: 0.9, zIndex: i + 1 });
        }

        // Timeline progression
        if (i > 0) {
            // Next card emerges from below
            tl.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "power2.inOut" // cinematic smooth easing
            }, i); // Sequence exactly at i

            // Previous card moves slightly upward and fades out with depth scale
            tl.to(cards[i - 1], {
                opacity: 0,
                y: -100, // Move up
                scale: 0.95, // Depth feeling
                duration: 1,
                ease: "power2.inOut"
            }, i);
        }
    });
}

// Ensure the scroll trigger initializes after render
window.addEventListener('load', () => {
    initProgramScroll();
});
