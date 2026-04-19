class HeroAnimation {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Create initial particles (fewer for premium feel)
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 2 + 1,
                originalX: 0,
                originalY: 0
            });
            this.particles[i].originalX = this.particles[i].x;
            this.particles[i].originalY = this.particles[i].y;
        }

        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw Subtle Grid
        this.drawGrid();

        this.particles.forEach(p => {
            // Mouse Interaction (Repulsion)
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const force = Math.max(0, (200 - dist) / 200);
            
            if (dist < 200) {
                p.x -= (dx/dist) * force * 5;
                p.y -= (dy/dist) * force * 5;
            }

            // Return to original position slowly
            p.x += (p.originalX - p.x) * 0.02;
            p.y += (p.originalY - p.y) * 0.02;

            // Ambient motion
            p.originalX += p.vx;
            p.originalY += p.vy;

            // Wrap around
            if (p.originalX < 0) p.originalX = this.width;
            if (p.originalX > this.width) p.originalX = 0;
            if (p.originalY < 0) p.originalY = this.height;
            if (p.originalY > this.height) p.originalY = 0;

            // Draw Particle
            this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw lines to nearby particles
            this.particles.forEach(p2 => {
                const dxx = p.x - p2.x;
                const dyy = p.y - p2.y;
                const d = Math.sqrt(dxx*dxx + dyy*dyy);
                if (d < 150) {
                    this.ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - d/150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }

    drawGrid() {
        const spacing = 100;
        this.ctx.strokeStyle = 'rgba(255,255,255,0.02)';
        this.ctx.lineWidth = 1;

        // Vertical lines with distortion
        for (let x = 0; x < this.width; x += spacing) {
            this.ctx.beginPath();
            for (let y = 0; y < this.height; y += 20) {
                const dx = this.mouse.x - x;
                const dy = this.mouse.y - y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const offset = Math.max(0, (300 - dist) / 300) * 30;
                
                const drawX = x + (dx/dist) * -offset;
                if (y === 0) this.ctx.moveTo(drawX, y);
                else this.ctx.lineTo(drawX, y);
            }
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < this.height; y += spacing) {
            this.ctx.beginPath();
            for (let x = 0; x < this.width; x += 20) {
                const dx = this.mouse.x - x;
                const dy = this.mouse.y - y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const offset = Math.max(0, (300 - dist) / 300) * 30;
                
                const drawY = y + (dy/dist) * -offset;
                if (x === 0) this.ctx.moveTo(x, drawY);
                else this.ctx.lineTo(x, drawY);
            }
            this.ctx.stroke();
        }
    }
}

new HeroAnimation();
