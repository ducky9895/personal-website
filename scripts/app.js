// Function to load HTML partials
async function loadPartial(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error loading ${filePath}: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Failed to load partial: ${error}`);
    }
}

// Function to update the footer date information
function updateFooterDates() {
    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        const currentYear = new Date().getFullYear();
        currentYearElement.textContent = currentYear;
    }
    
    // Update last modified date
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        // Option 1: Use document last modified date
        const lastModified = new Date(document.lastModified);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastUpdatedElement.textContent = lastModified.toLocaleDateString('en-US', options);
        
        // Option 2: Use current date (uncomment if you prefer this)
        // const today = new Date();
        // const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // lastUpdatedElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Initialize dark mode
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or respect OS theme settings
    if (localStorage.getItem('darkMode') === 'true' || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && 
         localStorage.getItem('darkMode') === null)) {
        enableDarkMode();
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        if (htmlElement.classList.contains('dark')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    function enableDarkMode() {
        htmlElement.classList.add('dark');
        document.body.classList.add('bg-gray-900');
        document.body.classList.remove('bg-white');
        localStorage.setItem('darkMode', 'true');
        
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('ri-moon-line');
            icon.classList.add('ri-sun-line');
        }
    }
    
    function disableDarkMode() {
        htmlElement.classList.remove('dark');
        document.body.classList.remove('bg-gray-900');
        document.body.classList.add('bg-white');
        localStorage.setItem('darkMode', 'false');
        
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('ri-sun-line');
            icon.classList.add('ri-moon-line');
        }
    }
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    }
    
    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });
}

// Load all partials when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    // Load partials
    // Using Promise.all to load all partials in parallel
    try {
        await Promise.all([
            loadPartial('header-placeholder', 'layouts/partials/header.html'),
            loadPartial('hero-placeholder', 'layouts/partials/hero.html'),
            loadPartial('handles-placeholder', 'layouts/partials/handles.html'),
            loadPartial('journey-placeholder', 'layouts/partials/journey.html'),
            loadPartial('research-section-placeholder', 'layouts/partials/research.html'),
            loadPartial('impact-placeholder', 'layouts/partials/impact.html'),
            loadPartial('footer-placeholder', 'layouts/partials/footer.html')
        ]);
        
        // Initialize after partials are loaded
        initializeDarkMode();
        initializeSmoothScroll();
        initializeMobileMenu();
        updateFooterDates();
        
        // Hide loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = 0;
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }
    } catch (error) {
        console.error('Error loading partials:', error);
        // Even if there's an error, remove the loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
});