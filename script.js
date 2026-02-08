// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Animated typing effect
const texts = [
    "Hi, I'm a Web Developer",
    "I master CSS & HTML",
    "I create amazing websites",
    "Let's build something great!"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeWriter() {
    const typingElement = document.querySelector('.typing-text');
    const currentText = texts[textIndex];
    
    if (!isDeleting) {
        // Typing
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentText.length) {
            // Pause before deleting
            setTimeout(() => {
                isDeleting = true;
                typeWriter();
            }, pauseTime);
            return;
        }
    } else {
        // Deleting
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
    }
    
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeWriter, speed);
}

// Project modal functionality
function showProjectDetails(projectType) {
    let projectInfo = '';
    
    if (projectType === 'rental') {
        projectInfo = `
            <h3>Digital House Rental Management System</h3>
            <p>A complete digital solution for property management including:</p>
            <ul>
                <li>Property listing and management</li>
                <li>Tenant registration and profiles</li>
                <li>Rent payment tracking</li>
                <li>Maintenance request system</li>
                <li>Dashboard with analytics</li>
                <li>Document management</li>
            </ul>
            <p><strong>Technologies:</strong> HTML5, CSS3, JavaScript, Database Integration</p>
            <p><strong>GitHub:</strong> <a href="https://github.com/keebii/Digital-house-rental-management-system-" target="_blank">View Repository</a></p>
        `;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            ${projectInfo}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Add animation to elements when they come into view
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

// Initialize when page loads
window.addEventListener('load', () => {
    // Start typing animation
    setTimeout(typeWriter, 1000);
    
    // Setup project demo links
    document.querySelectorAll('.demo-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectType = e.target.closest('.demo-link').dataset.project;
            showProjectDetails(projectType);
        });
    });
    
    // Setup project gallery links
    document.querySelectorAll('.gallery-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectType = e.target.closest('.gallery-link').dataset.project;
            showProjectGallery(projectType);
        });
    });
    
    // Setup photo upload functionality
    setupPhotoUpload();
    
    // Load saved photos
    loadSavedPhotos();
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .about-content, .contact-content, .gallery-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Photo upload functionality
function setupPhotoUpload() {
    // Profile photo upload
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    profilePhotoInput.addEventListener('change', handleProfilePhotoUpload);
    
    // Gallery photo upload
    const galleryPhotoInput = document.getElementById('galleryPhotoInput');
    galleryPhotoInput.addEventListener('change', handleGalleryPhotoUpload);
}

function handleProfilePhotoUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profilePlaceholder = document.getElementById('profileImage');
            profilePlaceholder.innerHTML = `<img src="${e.target.result}" alt="Profile Photo">`;
            
            // Save to localStorage
            localStorage.setItem('profilePhoto', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function handleGalleryPhotoUpload(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                addPhotoToGallery(e.target.result, file.name);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Clear the input
    event.target.value = '';
}

function addPhotoToGallery(imageSrc, fileName) {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item uploaded-photo';
    
    galleryItem.innerHTML = `
        <img src="${imageSrc}" alt="${fileName}">
        <div class="gallery-item-overlay">
            <button class="delete-btn" onclick="deleteGalleryPhoto(this)">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    // Add to the beginning of the gallery
    galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
    
    // Save to localStorage
    saveGalleryPhotos();
    
    // Add animation
    galleryItem.style.opacity = '0';
    galleryItem.style.transform = 'translateY(30px)';
    galleryItem.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
        galleryItem.style.opacity = '1';
        galleryItem.style.transform = 'translateY(0)';
    }, 100);
}

function deleteGalleryPhoto(button) {
    const galleryItem = button.closest('.gallery-item');
    galleryItem.style.transform = 'translateY(-30px)';
    galleryItem.style.opacity = '0';
    
    setTimeout(() => {
        galleryItem.remove();
        saveGalleryPhotos();
    }, 300);
}

function saveGalleryPhotos() {
    const uploadedPhotos = [];
    document.querySelectorAll('.uploaded-photo img').forEach(img => {
        uploadedPhotos.push({
            src: img.src,
            alt: img.alt
        });
    });
    localStorage.setItem('galleryPhotos', JSON.stringify(uploadedPhotos));
}

function loadSavedPhotos() {
    // Load profile photo
    const savedProfilePhoto = localStorage.getItem('profilePhoto');
    if (savedProfilePhoto) {
        const profilePlaceholder = document.getElementById('profileImage');
        profilePlaceholder.innerHTML = `<img src="${savedProfilePhoto}" alt="Profile Photo">`;
    }
    
    // Load gallery photos
    const savedGalleryPhotos = localStorage.getItem('galleryPhotos');
    if (savedGalleryPhotos) {
        const photos = JSON.parse(savedGalleryPhotos);
        const galleryGrid = document.getElementById('galleryGrid');
        
        photos.forEach(photo => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item uploaded-photo';
            
            galleryItem.innerHTML = `
                <img src="${photo.src}" alt="${photo.alt}">
                <div class="gallery-item-overlay">
                    <button class="delete-btn" onclick="deleteGalleryPhoto(this)">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            
            galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
        });
    }
}