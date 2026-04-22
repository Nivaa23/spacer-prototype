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

// Filter UI Logic
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Simple visual feedback only for prototype
        gsap.fromTo('.program-card-new',
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
        );
    });
});

// Modal Logic
const programModal = document.getElementById('program-modal');

function openModal(title, category, duration, level, tools, image) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-category').textContent = category;
    document.getElementById('modal-duration').textContent = duration;
    document.getElementById('modal-level').textContent = level;
    document.getElementById('modal-tools').textContent = tools;
    if (image) {
        document.getElementById('modal-image').src = 'assets/' + image;
    }
    programModal.classList.add('active');

    // Add custom cursor scale up for close button
    gsap.to(cursorFollower, { scale: 1, background: 'white', border: 'none' });
    gsap.to(cursorDot, { scale: 1 });
}

function closeModal() {
    programModal.classList.remove('active');
}

// Add cursor interaction to new elements
document.querySelectorAll('.filter-btn, .close-modal').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorFollower, { scale: 3, background: 'rgba(255,255,255,0.1)', border: '1px solid white' });
        gsap.to(cursorDot, { scale: 2 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, { scale: 1, background: 'white', border: 'none' });
        gsap.to(cursorDot, { scale: 1 });
    });
});

document.querySelectorAll('.program-card-stacked').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorFollower, { scale: 4, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--text-color)' });
        gsap.to(cursorDot, { scale: 0 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, { scale: 1, background: 'white', border: 'none' });
        gsap.to(cursorDot, { scale: 1 });
    });
});

// Initialize Stacked Scroll Experience
const programCards = gsap.utils.toArray('.program-card-stacked');
if (programCards.length) {
    const parent = document.querySelector('.programs-wrapper');
    const sticky = document.querySelector('.programs-sticky');

    // Create timeline pinned to wrapper
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: parent,
            start: "top top",
            end: "bottom bottom",
            scrub: 1 // smooth scrubbing
        }
    });

    programCards.forEach((card, index) => {
        // First card is fully visible at start
        if (index === 0) {
            gsap.set(card, { autoAlpha: 1, y: 0, scale: 1 });
        } else {
            // Other cards start below and transparent (completely hidden from pointer events)
            gsap.set(card, { autoAlpha: 0, y: 60, scale: 0.98 });
        }

        if (index < programCards.length - 1) {
            const nextCard = programCards[index + 1];

            // When scrolling, current card fades down (keeps visibility:visible)
            tl.to(card, {
                opacity: 0.6,
                scale: 0.95,
                y: -30,
                duration: 1,
                ease: "power2.inOut"
            }, index * 2)

                // At same time, next card emerges from below (autoAlpha toggles visibility)
                .to(nextCard, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power2.inOut"
                }, index * 2);
        }
    });
}
