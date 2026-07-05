document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. HEADER SCROLL EFFECT
    // ==========================================================================
    const header = document.querySelector('.navbar-header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run once on load
    
    // ==========================================================================
    // 2. MOBILE MENU TOGGLE
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        const isActive = menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        // Prevent body scroll when menu is active on mobile
        document.body.style.overflow = isActive ? 'hidden' : '';
    };
    
    const closeMenu = () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside of the nav-menu
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target) &&
            !navOverlay.contains(e.target)) {
            closeMenu();
        }
    });

    // ==========================================================================
    // 3. INTERACTIVE HERO BEADS MOCKUP
    // ==========================================================================
    const beads = document.querySelectorAll('.mockup-bead');
    const beadColors = ['#ef4444', '#3b82f6', '#10b981', '#fbbf24', '#f97316'];
    const activeLabel = document.querySelector('.mockup-side-label');
    
    beads.forEach((bead, index) => {
        bead.addEventListener('click', () => {
            // Randomly slide the bead left or right along its track
            const randomPercent = Math.floor(Math.random() * 60) + 20; // range 20% to 80%
            bead.style.left = `${randomPercent}%`;
            
            // Add a temporary pop and rotate animation
            bead.style.transform = 'scale(1.35) rotate(15deg) translateY(-8px)';
            
            // Trigger feedback in the label
            if (activeLabel) {
                activeLabel.textContent = `Meronce: Manik ${index + 1}`;
                activeLabel.style.color = beadColors[index % beadColors.length];
                activeLabel.style.background = 'rgba(255, 255, 255, 0.9)';
                
                setTimeout(() => {
                    activeLabel.textContent = 'Sisi Aktif A';
                    activeLabel.style.color = '';
                    activeLabel.style.background = '';
                }, 1500);
            }
            
            setTimeout(() => {
                bead.style.transform = '';
            }, 300);
        });
    });

    // ==========================================================================
    // 4. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Animating once is cleaner
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // ==========================================================================
    // 5. ACTIVE NAV LINK HIGHLIGHT (ON SCROLL)
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNavLinks = () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150; // offset for navbar height
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', highlightNavLinks);

    // ==========================================================================
    // 6. GALLERY LIGHTBOX MODAL
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxFallback = document.getElementById('lightbox-fallback');
    const lightboxFallbackTag = document.getElementById('lightbox-fallback-tag');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-image');
            const imgTitle = item.getAttribute('data-title');
            const category = 'Foto Produk';
            
            // Set attributes
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgTitle;
            lightboxTitle.textContent = imgTitle;
            
            // Reset visibility
            lightboxImg.style.display = 'block';
            lightboxFallback.style.display = 'flex';
            lightboxFallbackTag.textContent = category;
            
            // Define loading and error callbacks for modal image
            lightboxImg.onload = () => {
                // If it successfully loads, hide the fallback container
                lightboxFallback.style.display = 'none';
            };
            
            lightboxImg.onerror = () => {
                // If it fails (e.g. image file not found), hide the image element, keep the clean CSS fallback
                lightboxImg.style.display = 'none';
                lightboxFallback.style.display = 'flex';
            };
            
            // Open modal
            lightboxModal.classList.add('active');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Trigger load manual check (useful if cached/already failed)
            if (lightboxImg.complete) {
                if (lightboxImg.naturalWidth === 0) {
                    lightboxImg.onerror();
                } else {
                    lightboxImg.onload();
                }
            }
        });
    });
    
    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Clear src to stop loading
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on clicking overlay outside image
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
    
    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ==========================================================================
    // 7. DARK MODE THEME TOGGLE
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    
    // Get stored theme or default to light / OS preference
    const getPreferredTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }
        // Fallback to system OS preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };
    
    // Set initial theme
    const initialTheme = getPreferredTheme();
    setTheme(initialTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
});
