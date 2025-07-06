let particlesArray = [];
let mouseX = 0;
let mouseY = 0;
let isLoading = true;


const loadingScreen = document.getElementById('loadingScreen');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const backToTopBtn = document.getElementById('backToTop');
const particlesCanvas = document.getElementById('particlesCanvas');


document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});


function initializeApp() {
    setupLoadingScreen();
    setupParticles();
    setupNavigation();
    setupScrollEffects();
    setupCharacterCards();
    setupEpisodeSelector();
    setupGalleryTabs();
    setupFormHandler();
    setupGSAPAnimations();
    setupBackToTop();
    setupMouseTracking();
    setupFavoriteButton();
    setupBubbles();
}


function setupLoadingScreen() {
    const loadingSpinner = document.querySelector('.loading-spinner');

    if (loadingSpinner) {
        gsap.to(loadingSpinner, {
            rotation: 360,
            duration: 1,
            repeat: -1,
            ease: "none"
        });
    }

    setTimeout(() => {
        if (loadingScreen) {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                    isLoading = false;
            
                    startMainAnimations();
                }
            });
        }
    }, 2000);
}

function setupParticles() {
    if (!particlesCanvas) return;

    const ctx = particlesCanvas.getContext('2d');

    function resizeCanvas() {
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * particlesCanvas.width;
            this.y = Math.random() * particlesCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
            this.opacity = Math.random() * 0.5;
            this.pulse = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                this.vx += dx * 0.0001;
                this.vy += dy * 0.0001;
            }

            if (this.x < 0 || this.x > particlesCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > particlesCanvas.height) this.vy *= -1;

            this.opacity += this.pulse;
            if (this.opacity > 0.5 || this.opacity < 0.1) {
                this.pulse *= -1;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();

        requestAnimationFrame(animateParticles);
    }

function drawConnections() {
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.save();
                ctx.globalAlpha = 0.2 * (1 - distance / 150); 
                ctx.strokeStyle = '#ff0000'; 
                ctx.lineWidth = 2; 
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

    animateParticles();
}

function setupNavigation() {

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                gsap.to(window, {
                    duration: 0,
                    scrollTo:targetElement,
                    ease: "power2.out"
                });

            }

            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function setupScrollEffects() {
    const heroSection = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');

    if (heroSection && heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            gsap.to(heroImage, {
                y: scrolled * parallaxSpeed,
                duration: 0.1,
                ease: "none"
            });
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section, .reveal-card').forEach(section => {
        observer.observe(section);
    });

}

function setupCharacterCards() {
    const characterCards = document.querySelectorAll('.character-card');

    characterCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}


function setupEpisodeSelector() {
    const seasonBtns = document.querySelectorAll('.season-btn');
    const episodesGrid = document.getElementById('episodes-grid');

    const episodeData = {
        1: [
            { number: 'S1E1', title: 'Geheimnisse (Sırlar)', desc: 'Winden\'de çocukların kayboluşu gizemli olayların başlangıcını işaret eder.', duration: '51 dk', date: '1 Aralık 2017', rating: '8.6' },
            { number: 'S1E2', title: 'Lügen (Yalanlar)', desc: 'Jonas, babasının intiharı ile ilgili gerçekleri öğrenmeye çalışır.', duration: '47 dk', date: '1 Aralık 2017', rating: '8.4' },
            { number: 'S1E3', title: 'Alles ist Jetzt (Her Şey Şimdi)', desc: 'Ulrich, oğlu Mikkel\'i ararken mağarada gizemli bir geçit keşfeder.', duration: '45 dk', date: '1 Aralık 2017', rating: '8.7' },
            { number: 'S1E4', title: 'Doppelleben (Çifte Yaşam)', desc: '1986\'da Ulrich, genç Helge Doppler\'ı bulur.', duration: '47 dk', date: '1 Aralık 2017', rating: '8.5' },
            { number: 'S1E5', title: 'Wahrheiten (Gerçekler)', desc: 'Hannah\'nın geçmişi açığa çıkar.', duration: '49 dk', date: '1 Aralık 2017', rating: '8.8' },
            { number: 'S1E6', title: 'Sic Mundus Creatus Est', desc: 'Jonas 1953\'e seyahat eder.', duration: '52 dk', date: '1 Aralık 2017', rating: '9.0' }
        ],
        2: [
            { number: 'S2E1', title: 'Beginnings and Endings', desc: 'Altı ay sonra, kayıp çocukların ailelerinin hayatında değişimler devam eder.', duration: '53 dk', date: '21 Haziran 2019', rating: '8.8' },
            { number: 'S2E2', title: 'Dark Matter', desc: 'Claudia, zaman yolculuğu hakkında önemli bilgileri keşfeder.', duration: '54 dk', date: '21 Haziran 2019', rating: '8.7' },
            { number: 'S2E3', title: 'Ghosts', desc: 'Charlotte ve Ulrich geçmişin gizli bağlantılarını ortaya çıkarır.', duration: '56 dk', date: '21 Haziran 2019', rating: '8.9' },
            { number: 'S2E4', title: 'The Travelers', desc: 'Jonas, gelecekteki dünyanın korkunç gerçeklerini öğrenir.', duration: '60 dk', date: '21 Haziran 2019', rating: '9.1' },
            { number: 'S2E5', title: 'Lost and Found', desc: 'Helge ile Noah arasındaki geçmiş ortaya çıkar.', duration: '57 dk', date: '21 Haziran 2019', rating: '8.8' },
            { number: 'S2E6', title: 'An Endless Cycle', desc: 'Döngünün gerçek doğası ve sonsuza kadar sürdüğü anlaşılır.', duration: '54 dk', date: '21 Haziran 2019', rating: '9.0' }
        ],
        3: [
            { number: 'S3E1', title: 'Deja-vu', desc: 'Paralel dünyalarda Martha ve Jonas\'ın hikayesi başlar.', duration: '63 dk', date: '27 Haziran 2020', rating: '9.2' },
            { number: 'S3E2', title: 'The Survivors', desc: 'Kıyamet sonrası dünyada yaşayan insanların hikayesi.', duration: '59 dk', date: '27 Haziran 2020', rating: '8.9' },
            { number: 'S3E3', title: 'Adam and Eva', desc: 'İki dünya arasındaki savaşın gerçek nedeni ortaya çıkar.', duration: '58 dk', date: '27 Haziran 2020', rating: '9.0' },
            { number: 'S3E4', title: 'The Origin', desc: 'Döngünün gerçek kaynağı ve başlangıcı keşfedilir.', duration: '63 dk', date: '27 Haziran 2020', rating: '9.3' },
            { number: 'S3E5', title: 'Life and Death', desc: 'Tüm karakterlerin kaderi nihai olarak belirlenir.', duration: '59 dk', date: '27 Haziran 2020', rating: '9.1' },
            { number: 'S3E6', title: 'Light and Shadow', desc: 'Serinin epic finali, döngünün kırılması.', duration: '68 dk', date: '27 Haziran 2020', rating: '9.4' }
        ]
    };

    function renderEpisodes(season) {
        if (!episodesGrid) return;

        const episodes = episodeData[season];
        episodesGrid.innerHTML = '';

        episodes.forEach((episode, index) => {
            const episodeCard = document.createElement('div');
            episodeCard.className = 'episode-card';
            episodeCard.innerHTML = `
                <div class="episode-number">${episode.number}</div>
                <div class="episode-info">
                    <h3>${episode.title}</h3>
                    <p>${episode.desc}</p>
                    <div class="episode-meta">
                        <span class="episode-duration">${episode.duration}</span>
                        <span class="episode-date">${episode.date}</span>
                        <span class="episode-rating">⭐ ${episode.rating}</span>
                    </div>
                </div>
            `;

            episodesGrid.appendChild(episodeCard);

            gsap.fromTo(episodeCard,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 }
            );
        });
    }

    seasonBtns.forEach(btn => {
        btn.addEventListener('click', () => {
      
            seasonBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const season = btn.getAttribute('data-season');
            renderEpisodes(season);
        });
    });
}

function setupGalleryTabs() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryGrid = document.getElementById('gallery-grid');

    const galleryData = {
        stills: [
            { img: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Winden Mağarası', desc: 'Zaman yolculuğunun başladığı gizemli mağara' },
            { img: 'https://images.unsplash.com/photo-1514496959998-c01c40915c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Nükleer Santral', desc: 'Winden\'in kalbinde yer alan tehlikeli santral' },
            { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Winden Kasabası', desc: 'Tüm hikayenin geçtiği küçük Alman kasabası' },
            { img: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Zaman Makinesi', desc: 'Karmaşık zaman yolculuğu aparatı' },
            { img: 'https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Aile Fotoğrafları', desc: 'Zaman içinde değişen aile bağları' },
            { img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Orman Sahneleri', desc: 'Gizemli olayların geçtiği karanlık orman' }
        ],
        behind: [
            { img: 'https://images.unsplash.com/photo-1489599577372-f9c3c4a9c3b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Çekimler', desc: 'Setlerde çekim anları' },
            { img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Yönetmen', desc: 'Baran bo Odar yönetimde' },
            { img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Oyuncular', desc: 'Set arasında oyuncular' },
            { img: 'https://images.unsplash.com/photo-1517804249634-9b9c6b8b7e8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Kostüm Tasarımı', desc: 'Detaylı kostüm çalışmaları' }
        ],
        posters: [
            { img: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Sezon 1 Posteri', desc: 'İlk sezon resmi posteri' },
            { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Sezon 2 Posteri', desc: 'İkinci sezon resmi posteri' },
            { img: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Sezon 3 Posteri', desc: 'Final sezon resmi posteri' },
            { img: 'https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', title: 'Karakter Posterleri', desc: 'Ana karakterlerin posterleri' }
        ]
    };

    function renderGallery(tab) {
        if (!galleryGrid) return;

        const items = galleryData[tab];
        galleryGrid.innerHTML = '';

        items.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="gallery-overlay">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            `;

            galleryGrid.appendChild(galleryItem);

            gsap.fromTo(galleryItem,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, delay: index * 0.1 }
            );
        });
    }

    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabType = tab.getAttribute('data-tab');
            renderGallery(tabType);
        });
    });
}

function setupFormHandler() {
    const form = document.querySelector('.contact-form form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

 
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            if (!name || !email || !message) {
                showNotification('Lütfen tüm alanları doldurun.', 'error');
                return;
            }
            showNotification('Mesajınız gönderildi! Teşekkür ederiz.', 'success');
            form.reset();
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    gsap.fromTo(notification,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.3 }
    );

    
    setTimeout(() => {
        gsap.to(notification, {
            opacity: 0,
            y: -50,
            duration: 0.3,
            onComplete: () => {
                notification.remove();
            }
        });
    }, 3000);
}


function setupGSAPAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');

    if (heroTitle && heroSubtitle && heroDescription && heroButtons) {
        gsap.set([heroTitle, heroSubtitle, heroDescription, heroButtons], { opacity: 0, y: 50 });
    }

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        gsap.fromTo(item,
            { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(text => {
        text.addEventListener('mouseenter', () => {
            createGlitchEffect(text);
        });
    });
}

function createGlitchEffect(element) {
    const originalText = element.textContent;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let iterations = 0;

    const glitchInterval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        iterations += 1 / 3;

        if (iterations >= originalText.length) {
            clearInterval(glitchInterval);
            element.textContent = originalText;
        }
    }, 30);
}

function startMainAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroStats = document.querySelector('.hero-stats');

    const tl = gsap.timeline();

    tl.to(heroTitle, { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
        .to(heroSubtitle, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .to(heroDescription, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
        .to(heroButtons, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
        .to(heroStats, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3");

    animateStats();
}


function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const endValue = parseFloat(stat.textContent);
        const isDecimal = stat.textContent.includes('.');
        const duration = 2000;
        const frameRate = 60;
        const totalFrames = Math.round(duration / (1000 / frameRate));
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentValue = endValue * progress;

            stat.textContent = isDecimal
                ? currentValue.toFixed(1)
                : Math.floor(currentValue);

            if (frame >= totalFrames) {
                clearInterval(counter);
                stat.textContent = isDecimal
                    ? endValue.toFixed(1)
                    : endValue;
            }
        }, 1000 / frameRate);
    });
}

function startMainAnimations() {
    animateStats();
}

function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        gsap.to(window, {
            duration: 0,
            scrollTo: targetElement,
            ease: "power2.out"
        });
    });
}


function setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

function setupFavoriteButton() {
    const favoriteBtn = document.getElementById('favoriteBtn');

    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('active');
            favoriteBtn.textContent = favoriteBtn.classList.contains('active')
                ? '✅ Favorilere Eklendi'
                : '⭐ Favorilere Ekle';
        });
    }
    
}

function setupBubbles() {
    const container = document.getElementById('bubbleContainer');
    if (!container) return;

    for (let i = 0; i < 80; i++) {
        const bubble = document.createElement('div');
        const size = Math.random() * 6 + 2; 

        const startX = Math.random() * 100; 
        const startY = Math.random() * 100;

        const offsetX = (Math.random() - 0.5) * 200; 
        const offsetY = - (Math.random() * 150 + 100); 

        bubble.classList.add('bubble');
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${startX}vw`;
        bubble.style.top = `${startY}vh`;
        bubble.style.animationDuration = `${10 + Math.random() * 10}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;

        bubble.style.setProperty('--x', `${offsetX}px`);
        bubble.style.setProperty('--y', `${offsetY}px`);

        container.appendChild(bubble);
    }
}




