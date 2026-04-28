// Immediate theme check
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // CRT Startup Cleanup & Audio
    const startup = document.querySelector('.crt-startup');
    const overlay = document.querySelector('.crt-overlay');
    const noise = document.querySelector('.crt-noise');
    const terminal = document.getElementById('terminal');

    function logToTerminal(message) {
        if (!terminal) return;
        const line = document.createElement('div');
        line.classList.add('terminal-line');
        const now = new Date();
        const time = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        line.innerHTML = `<span class="timestamp">${time}</span><span class="message">${message}</span>`;
        terminal.prepend(line);
        
        // Keep only last 5 lines
        if (terminal.children.length > 5) {
            terminal.lastElementChild.remove();
        }
    }

    // Initial logs
    setTimeout(() => logToTerminal('INITIALIZING SYSTEM...'), 100);
    setTimeout(() => logToTerminal('PORTAL CORE STABILIZED'), 800);
    setTimeout(() => logToTerminal('WAITING FOR INPUT...'), 1500);

    function playStartupSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            
            // 1. Initial High Click
            const click = ctx.createOscillator();
            const clickGain = ctx.createGain();
            click.type = 'square';
            click.frequency.setValueAtTime(800, ctx.currentTime);
            clickGain.gain.setValueAtTime(0.1, ctx.currentTime);
            clickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            click.connect(clickGain);
            clickGain.connect(ctx.destination);
            click.start();
            click.stop(ctx.currentTime + 0.1);

            // 2. Rising Hum
            const hum = ctx.createOscillator();
            const humGain = ctx.createGain();
            hum.type = 'sine';
            hum.frequency.setValueAtTime(20, ctx.currentTime);
            hum.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.8);
            humGain.gain.setValueAtTime(0, ctx.currentTime);
            humGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.2);
            humGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
            hum.connect(humGain);
            humGain.connect(ctx.destination);
            hum.start();
            hum.stop(ctx.currentTime + 1);

            // 3. Static Burst
            const bufferSize = ctx.sampleRate * 0.5;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noiseNode = ctx.createBufferSource();
            noiseNode.buffer = buffer;
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.02, ctx.currentTime);
            noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
            noiseNode.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noiseNode.start();
        } catch (e) {
            console.warn("Audio Context blocked or unsupported");
        }
    }

    // Try to play sound immediately (might be blocked)
    playStartupSound();
    // Also try on first interaction just in case
    window.addEventListener('click', () => {
        if (startup.parentElement) playStartupSound();
    }, { once: true });

    setTimeout(() => {
        if (startup) {
            startup.style.opacity = '0';
            setTimeout(() => startup.remove(), 500);
        }
        
        // Stabilize visuals
        if (overlay) overlay.style.opacity = '0.2';
        if (noise) noise.style.opacity = '0.04';
        
        // Initial "Fixing itself" flicker
        anime({
            targets: 'body',
            opacity: [0.5, 1, 0.8, 1],
            duration: 400,
            easing: 'easeInOutQuad'
        });
    }, 1200); // Wait for CSS animation to finish

    // Scroll reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate hero section
                if (entry.target.classList.contains('hero')) {
                    anime.timeline({ easing: 'easeOutExpo' })
                        .add({
                            targets: '.hero',
                            opacity: [0, 1],
                            duration: 100
                        })
                        .add({
                            targets: '.hero-title',
                            opacity: [0, 1],
                            translateY: [20, 0],
                            duration: 1200
                        }, 0)
                        .add({
                            targets: '.hero-subtitle',
                            opacity: [0, 1],
                            translateY: [10, 0],
                            duration: 800
                        }, '-=800');
                } else if (entry.target.classList.contains('portal-card')) {
                    // Animate cards
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [40, 0],
                        duration: 1000,
                        easing: 'easeOutQuart'
                    });
                }
                
                // Stop observing revealed elements
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initialize scroll observer
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Theme toggle logic
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Sync isDark with whatever is actually on the body right now
    let isDark = body.classList.contains('dark-mode');

    themeBtn.addEventListener('click', () => {
        // Disable button during transition
        themeBtn.style.pointerEvents = 'none';

        // Shutter down animation
        anime({
            targets: '.blind',
            scaleY: [0, 1],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeInOutCirc',
            complete: () => {
                // Swap themes
                isDark = !isDark;
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                
                if (isDark) {
                    body.classList.remove('light-mode');
                    body.classList.add('dark-mode');
                } else {
                    body.classList.remove('dark-mode');
                    body.classList.add('light-mode');
                }

                // Shutter up animation
                setTimeout(() => {
                    anime({
                        targets: '.blind',
                        scaleY: [1, 0],
                        transformOrigin: ['50% 100%', '50% 100%'], // retract upwards
                        duration: 600,
                        delay: anime.stagger(100, {from: 'last'}), // reverse stagger
                        easing: 'easeInOutCirc',
                        complete: () => {
                            // Reset origin for next time
                            anime.set('.blind', {transformOrigin: '50% 0%'});
                            themeBtn.style.pointerEvents = 'auto';
                        }
                    });
                }, 300);
            }
        });
        
        // Spin toggle icon
        anime({
            targets: '#theme-icon',
            rotate: '+=360',
            duration: 1000,
            easing: 'easeOutElastic(1, .5)'
        });
    });

    // Card hover animations
    const cards = document.querySelectorAll('.portal-card');
    
    cards.forEach(card => {
        const title = card.querySelector('h2');
        const originalText = title.innerText;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt calculation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        card.addEventListener('mouseenter', () => {
            logToTerminal(`ACCESSING: ${originalText.toUpperCase()}`);
            scrambleEffect(title, originalText);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // Background particle animation
    createBackgroundMotes();

    function createBackgroundMotes() {
        const bgContainer = document.querySelector('.bg-elements');
        const numMotes = 25; 
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;

        for (let i = 0; i < numMotes; i++) {
            const mote = document.createElement('div');
            mote.classList.add('mote');
            
            const size = Math.random() * 4 + 2; 
            mote.style.width = `${size}px`;
            mote.style.height = `${size}px`;
            mote.style.left = `${Math.random() * windowWidth}px`;
            mote.style.top = `${Math.random() * windowHeight}px`;

            // Assign a depth layer (0 = background, 1 = mid, 2 = foreground)
            const layer = Math.floor(Math.random() * 3);
            mote.dataset.layer = layer;
            
            // Set speed and blur based on layer
            if (layer === 0) mote.style.filter = 'blur(1px)';
            if (layer === 2) mote.style.filter = 'blur(3px)';

            bgContainer.appendChild(mote);
            animateMote(mote, windowWidth, windowHeight);
        }
    }

    function animateMote(mote, maxX, maxY) {
        const layer = parseInt(mote.dataset.layer);
        const speedMult = [0.5, 1, 2][layer]; // Foreground (2) moves faster
        
        const destX = (Math.random() - 0.5) * 300 * speedMult;
        const destY = (Math.random() - 0.5) * 300 * speedMult;
        const duration = (Math.random() * 5000 + 5000) / speedMult; 

        anime({
            targets: mote,
            translateX: destX,
            translateY: destY,
            opacity: [
                { value: (Math.random() * 0.4 + 0.1) / (layer + 1), duration: duration / 2, easing: 'easeInOutSine' },
                { value: 0, duration: duration / 2, easing: 'easeInOutSine' }
            ],
            scale: [
                { value: (Math.random() * 1.5 + 1) * (layer + 1) * 0.5, duration: duration / 2 },
                { value: (Math.random() * 0.5 + 0.5) * (layer + 1) * 0.5, duration: duration / 2 }
            ],
            duration: duration,
            easing: 'linear',
            complete: () => {
                mote.style.left = `${Math.random() * maxX}px`;
                mote.style.top = `${Math.random() * maxY}px`;
                mote.style.transform = 'translate(0px, 0px) scale(1)';
                animateMote(mote, maxX, maxY);
            }
        });
    }

    // Grid parallax effect
    const grid = document.querySelector('.bg-grid');
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        grid.style.setProperty('--grid-x', `${moveX}px`);
        grid.style.setProperty('--grid-y', `${moveY}px`);
    });

    // Text Scramble Logic
    function scrambleEffect(element, originalText) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@&%*';
        let iteration = 0;
        const interval = setInterval(() => {
            element.innerText = originalText.split('').map((char, index) => {
                if (index < iteration) return originalText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');

            if (iteration >= originalText.length) {
                clearInterval(interval);
                element.innerText = originalText;
            }
            iteration += 1 / 3;
        }, 30);
    }
});
