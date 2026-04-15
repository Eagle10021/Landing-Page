document.addEventListener('DOMContentLoaded', () => {

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
    let isDark = true;

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
        card.addEventListener('mouseenter', () => {

            anime({
                targets: card,
                scale: 1.03,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });

        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                scale: 1,
                duration: 500,
                easing: 'easeOutElastic(1, .8)'
            });
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

            bgContainer.appendChild(mote);
            animateMote(mote, windowWidth, windowHeight);
        }
    }

    function animateMote(mote, maxX, maxY) {
        const destX = (Math.random() - 0.5) * 200;
        const destY = (Math.random() - 0.5) * 200;
        const duration = Math.random() * 5000 + 5000; 

        anime({
            targets: mote,
            translateX: destX,
            translateY: destY,
            opacity: [
                { value: Math.random() * 0.4 + 0.1, duration: duration / 2, easing: 'easeInOutSine' },
                { value: 0, duration: duration / 2, easing: 'easeInOutSine' }
            ],
            scale: [
                { value: Math.random() * 1.5 + 1, duration: duration / 2 },
                { value: Math.random() * 0.5 + 0.5, duration: duration / 2 }
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
});
