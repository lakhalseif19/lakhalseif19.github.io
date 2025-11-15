// Navigation and Page Transitions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the first section
    showSection('home');
    
    // Navigation click handlers
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Start smooth page transition
            startPageTransition(() => {
                showSection(targetId);
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(nav => {
                    nav.classList.remove('active');
                });
                this.classList.add('active');
                
                // Close mobile menu if open
                document.querySelector('.navbar').classList.remove('active');
                document.getElementById('menu-icon').classList.remove('bx-x');
            });
        });
    });
    
    // Mobile menu toggle
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    
    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuIcon.classList.toggle('bx-menu');
            menuIcon.classList.toggle('bx-x');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
            menuIcon.classList.add('bx-menu');
        });
    });
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    let ticking = false;
    
    function updateHeader() {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    // Text animation for home section
    initTextAnimation();
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.service-card, .info-item, .card, .tp-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize TP Actions
    initializeTPActions();
    
    // Initialize modal functionality
    initializeModal();
    
    // Initialize parallax
    initParallax();
    
    // Initialize scroll progress
    initScrollProgress();
});

// Function to handle image loading errors
function handleImageError(img) {
    console.log('Image failed to load:', img.src);
    // Fallback images based on project type
    const fallbackImages = {
        'tp1': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'tp2': 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };
    
    // Determine which fallback to use based on image src
    if (img.src.includes('tp1')) {
        img.src = fallbackImages.tp1;
    } else if (img.src.includes('tp2')) {
        img.src = fallbackImages.tp2;
    } else {
        img.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
}

// Text animation initialization
function initTextAnimation() {
    const textAnimation = document.querySelector('.text-animation span');
    if (!textAnimation) return;
    
    const professions = ['Frontend Developer', '3D Designer', 'UI/UX Designer', 'Blender Artist'];
    let currentProfession = 0;
    let currentChar = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = professions[currentProfession];
        
        if (isDeleting) {
            textAnimation.textContent = currentText.substring(0, currentChar - 1);
            currentChar--;
        } else {
            textAnimation.textContent = currentText.substring(0, currentChar + 1);
            currentChar++;
        }
        
        if (!isDeleting && currentChar === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentProfession = (currentProfession + 1) % professions.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 100 : 200);
        }
    }
    
    // Start the typing animation
    setTimeout(type, 1000);
}

// Initialize TP Actions
function initializeTPActions() {
    // View Render buttons
    document.querySelectorAll('.view-render').forEach(btn => {
        btn.addEventListener('click', function() {
            const tpCard = this.closest('.tp-card');
            const tpTitle = tpCard.querySelector('h3').textContent;
            const renderType = this.getAttribute('data-type');
            const mediaSrc = this.getAttribute('data-src');
            showRender(tpTitle, renderType, mediaSrc);
        });
    });
    
    // View GitHub buttons
    document.querySelectorAll('.view-github').forEach(btn => {
        btn.addEventListener('click', function() {
            const repoUrl = this.getAttribute('data-repo');
            window.open(repoUrl, '_blank');
            showNotification('Opening GitHub repository...', 'info');
        });
    });
    
    // Download Project buttons
    document.querySelectorAll('.download-project').forEach(btn => {
        btn.addEventListener('click', function() {
            const repoName = this.getAttribute('data-repo');
            const projectName = this.getAttribute('data-project');
            const zipUrl = this.getAttribute('data-zip');
            downloadProject(repoName, projectName, zipUrl);
        });
    });
    
    // View Report buttons
    document.querySelectorAll('.view-report').forEach(btn => {
        btn.addEventListener('click', function() {
            const repoName = this.getAttribute('data-repo');
            const projectName = this.getAttribute('data-project');
            const fileUrl = this.getAttribute('data-file');
            viewReport(repoName, projectName, fileUrl);
        });
    });
}

// Initialize modal functionality
function initializeModal() {
    const modal = document.getElementById('renderModal');
    const closeBtn = document.getElementById('closeModal');
    
    if (!modal || !closeBtn) return;
    
    closeBtn.addEventListener('click', closeRender);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeRender();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeRender();
        }
    });
}

// Professional page transition function
function startPageTransition(callback) {
    const pageTransition = document.querySelector('.page-transition-overlay');
    
    if (!pageTransition) {
        if (callback) callback();
        return;
    }
    
    pageTransition.classList.add('active');
    
    setTimeout(() => {
        if (callback) callback();
        
        setTimeout(() => {
            pageTransition.classList.remove('active');
        }, 300);
    }, 500);
}

// Show specific section with smooth animation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 100);
    }
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    updateDocumentTitle(sectionId);
}

// Update document title based on current section
function updateDocumentTitle(sectionId) {
    const baseTitle = 'Seif El Islam - Frontend & 3D Designer';
    const sectionTitles = {
        'home': baseTitle,
        'tps': `Practical Works - ${baseTitle}`,
        'services': `Services - ${baseTitle}`,
        'contact': `Contact - ${baseTitle}`
    };
    
    document.title = sectionTitles[sectionId] || baseTitle;
}

// TP Actions functions
function showRender(title, type, mediaSrc) {
    const modal = document.getElementById('renderModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMedia = document.getElementById('modalMedia');
    
    if (!modal || !modalTitle || !modalMedia) return;
    
    modalTitle.textContent = `${title} - ${type === 'image' ? 'Render' : 'Animation'}`;
    
    modalMedia.innerHTML = '';
    
    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'modal-loading';
    loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Loading media from GitHub...</p>';
    modalMedia.appendChild(loadingDiv);
    
    if (type === 'image') {
        const img = document.createElement('img');
        img.src = mediaSrc;
        img.alt = title;
        img.className = 'modal-image';
        img.onload = function() {
            loadingDiv.remove();
            modalMedia.appendChild(img);
            showNotification('Image loaded successfully from GitHub', 'success');
        };
        img.onerror = function() {
            loadingDiv.remove();
            // Fallback image
            const fallbackImg = document.createElement('img');
            fallbackImg.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
            fallbackImg.alt = 'Fallback Image';
            fallbackImg.className = 'modal-image';
            modalMedia.appendChild(fallbackImg);
            showNotification('Failed to load image from GitHub. Showing fallback.', 'warning');
        };
    } else {
        const video = document.createElement('video');
        video.src = mediaSrc;
        video.controls = true;
        video.autoplay = true;
        video.className = 'modal-video';
        video.onloadeddata = function() {
            loadingDiv.remove();
            modalMedia.appendChild(video);
            showNotification('Video loaded successfully from GitHub', 'success');
        };
        video.onerror = function() {
            loadingDiv.remove();
            // Fallback video or message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'modal-error';
            errorMsg.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Video Not Available</h4>
                <p>The video file could not be loaded from GitHub.</p>
                <p>Please check if the file exists in the repository:</p>
                <p><code>${mediaSrc}</code></p>
                <button class="btn" onclick="closeRender()">Close</button>
            `;
            modalMedia.appendChild(errorMsg);
            showNotification('Video file not found on GitHub. Please check the repository.', 'error');
        };
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRender() {
    const modal = document.getElementById('renderModal');
    const modalMedia = document.getElementById('modalMedia');
    
    if (!modal || !modalMedia) return;
    
    // Stop any playing videos
    const video = modalMedia.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear modal content
    setTimeout(() => {
        modalMedia.innerHTML = '';
    }, 300);
}

// Project Download Functions
function downloadProject(repoName, projectName, zipUrl) {
    showNotification(`Starting download for ${projectName}...`, 'info');
    
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `${projectName}.zip`;
    link.target = '_blank';
    
    // Append to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success notification after a short delay
    setTimeout(() => {
        showNotification(`${projectName} download started! The repository will download as a ZIP file.`, 'success');
    }, 1000);
}

function viewReport(repoName, projectName, fileUrl) {
    // Open the PDF in GitHub's viewer instead of downloading
    showNotification(`Opening report for ${projectName} in GitHub viewer...`, 'info');
    window.open(fileUrl, '_blank');
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        'info': 'fas fa-info-circle',
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'error': 'fas fa-times-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        
        startPageTransition(() => {
            showSection(targetId);
        });
    });
});

// Add parallax effect to background elements
function initParallax() {
    const circles = document.querySelectorAll('.decoration-circle');
    
    if (!circles.length) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        circles.forEach((circle, index) => {
            const speed = 0.02 * (index + 1);
            circle.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    const navbar = document.querySelector('.navbar');
    const menuIcon = document.getElementById('menu-icon');
    
    if (window.innerWidth > 768) {
        if (navbar) navbar.classList.remove('active');
        if (menuIcon) {
            menuIcon.classList.remove('bx-x');
            menuIcon.classList.add('bx-menu');
        }
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--main-color), var(--accent-color));
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Add hover effects for TP cards
document.addEventListener('DOMContentLoaded', function() {
    const tpCards = document.querySelectorAll('.tp-card');
    
    tpCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
});

function optimizeImageQuality(img) {
    // Préchargement et optimisation
    img.loading = 'eager';
    img.decoding = 'sync';
    img.fetchPriority = 'high';
    
    // Si l'image est floue, on tente de recharger une version HD
    img.onload = function() {
        if (this.naturalWidth < 500) {
            console.warn('Image de faible qualité détectée');
            // Charger une version HD si disponible
            const hdSrc = this.src.replace('.jpg', '-hd.jpg');
            const hdImage = new Image();
            hdImage.src = hdSrc;
        }
    };
}

// Appliquer à toutes les images de profil
document.querySelectorAll('.profile-image').forEach(optimizeImageQuality);