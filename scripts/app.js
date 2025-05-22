// Function to load HTML partials
async function loadPartial(elementId, filePath) {
    try {
        console.log(`Loading partial: ${filePath} into element: ${elementId}`);
        
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error loading ${filePath}: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`Found element ${elementId}, setting content`);
            element.innerHTML = html;
        } else {
            console.warn(`Element with id "${elementId}" not found`);
        }
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
        const lastModified = new Date(document.lastModified);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastUpdatedElement.textContent = lastModified.toLocaleDateString('en-US', options);
    }
}

// Initialize dark mode
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) {
        console.log('Dark mode toggle button not found');
        return;
    }
    
    const htmlElement = document.documentElement;
    console.log('Initial dark mode state:', htmlElement.classList.contains('dark'));
    
    // Check for saved theme preference or respect OS theme settings
    if (localStorage.getItem('darkMode') === 'true' || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && 
         localStorage.getItem('darkMode') === null)) {
        console.log('Enabling dark mode on init');
        enableDarkMode();
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        console.log('Dark mode toggle clicked');
        console.log('Current dark mode state:', htmlElement.classList.contains('dark'));
        if (htmlElement.classList.contains('dark')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    function enableDarkMode() {
        console.log('Enabling dark mode');
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
        console.log('Disabling dark mode');
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
    console.log('DOM Content Loaded');
    
    try {
        // Check if we're on the index page
        const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        
        if (isIndexPage) {
            // Load all partials for the index page
            await Promise.all([
                loadPartial('header-placeholder', '_includes/header.html'),
                loadPartial('hero-placeholder', '_includes/hero.html'),
                loadPartial('handles-placeholder', '_includes/handles.html'),
                loadPartial('timeline-placeholder', '_includes/timeline.html'),
                loadPartial('changelog-placeholder', '_includes/changelog.html'),
                loadPartial('impact-placeholder', '_includes/impact.html'),
                loadPartial('footer-placeholder', '_includes/footer.html')
            ]);
        } else {
            // For other pages, only load the header
            await loadPartial('header-placeholder', '_includes/header.html');
        }
        
        // Initialize after partials are loaded
        console.log('Initializing components');
        initializeDarkMode();
        initializeSmoothScroll();
        initializeMobileMenu();
        if (isIndexPage) {
            updateFooterDates();
        }
        
        // Hide loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }
    } catch (error) {
        console.error('Error loading page content:', error);
        // Hide loading overlay even if there's an error
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
});