document.addEventListener('DOMContentLoaded', () => {
    
    // --- Entry Animation Sequence ---
    const timeline = anime.timeline({
        easing: 'easeOutExpo'
    });

    // 1. Reveal Hero Title
    timeline.add({
        targets: '.hero-title',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1200,
        delay: 300
    });

    // 2. Reveal Subtitle
    timeline.add({
        targets: '.hero-subtitle',
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 800
    }, '-=800'); // start slightly before previous finishes

    // 3. Staggered reveal of portal cards
    timeline.add({
        targets: '.portal-card',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        delay: anime.stagger(150),
        easing: 'easeOutQuart'
    }, '-=600');

    // --- Background Ambient Animation ---
    createBackgroundMotes();

    function createBackgroundMotes() {
        const bgContainer = document.querySelector('.bg-elements');
        const numMotes = 25; // How many particles
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        for (let i = 0; i < numMotes; i++) {
            const mote = document.createElement('div');
            mote.classList.add('mote');
            
            // Randomize size and initial position
            const size = Math.random() * 4 + 2; // 2px to 6px
            mote.style.width = `${size}px`;
            mote.style.height = `${size}px`;
            mote.style.left = `${Math.random() * windowWidth}px`;
            mote.style.top = `${Math.random() * windowHeight}px`;

            bgContainer.appendChild(mote);
            
            // Animate each mote
            animateMote(mote, windowWidth, windowHeight);
        }
    }

    function animateMote(mote, maxX, maxY) {
        // Randomize destination offsets (float around starting point)
        const destX = (Math.random() - 0.5) * 200;
        const destY = (Math.random() - 0.5) * 200;
        const duration = Math.random() * 5000 + 5000; // 5 to 10 seconds

        anime({
            targets: mote,
            translateX: destX,
            translateY: destY,
            opacity: [
                { value: Math.random() * 0.5 + 0.1, duration: duration / 2, easing: 'easeInOutSine' },
                { value: 0, duration: duration / 2, easing: 'easeInOutSine' }
            ],
            scale: [
                { value: Math.random() * 1.5 + 1, duration: duration / 2 },
                { value: Math.random() * 0.5 + 0.5, duration: duration / 2 }
            ],
            duration: duration,
            easing: 'linear',
            complete: () => {
                // Reset position smoothly
                mote.style.left = `${Math.random() * maxX}px`;
                mote.style.top = `${Math.random() * maxY}px`;
                mote.style.transform = 'translate(0px, 0px) scale(1)';
                
                // Restart animation loop
                animateMote(mote, maxX, maxY);
            }
        });
    }

    // --- Interactive Hover Scaling using Anime.js ---
    const cards = document.querySelectorAll('.portal-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                scale: 1.02,
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
});
